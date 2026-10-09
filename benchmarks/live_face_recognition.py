from pathlib import Path
import sys

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from services.cv.app.core.attendance_db import (
    initialize_database,
    record_attendance,
    register_employee,
)

ENROLL_DIR = ROOT / "data" / "face_test" / "enrollment" / "participant_001"
DETECTOR_MODEL = ROOT / "models" / "face" / "face_detection_yunet_2023mar.onnx"
RECOGNIZER_MODEL = ROOT / "models" / "face" / "face_recognition_sface_2021dec.onnx"

CAMERA_INDEX = 0
CONFIDENCE_THRESHOLD = 0.80
MIN_FACE_SIZE = 80

# Experimental demo threshold. Not production validated.
PROVISIONAL_THRESHOLD = 0.35
REQUIRED_CONSECUTIVE_FRAMES = 5

EMPLOYEE_ID = "participant_001"
EMPLOYEE_NAME = "Huzaifa Bin Mubarak"
EMPLOYEE_DESIGNATION = "Data Analyst"
EVENT_SOURCE = "webcam_manual_test"


def list_images(folder):
    extensions = {".jpg", ".jpeg", ".png"}
    return sorted(
        p for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in extensions
    )


def embedding_from_image(image, face, recognizer):
    _, _, w, h = [int(round(v)) for v in face[:4]]
    if min(w, h) < MIN_FACE_SIZE:
        return None

    aligned = recognizer.alignCrop(image, face)
    feature = recognizer.feature(aligned)

    if feature is None or not np.isfinite(feature).all():
        return None

    feature = feature.reshape(-1).astype(np.float32)
    norm = float(np.linalg.norm(feature))
    if norm < 1e-12:
        return None

    return feature / norm


def build_template(detector, recognizer):
    features = []

    for path in list_images(ENROLL_DIR):
        image = cv2.imread(str(path))
        if image is None:
            print(f"SKIP | {path.name} | unreadable")
            continue

        height, width = image.shape[:2]
        detector.setInputSize((width, height))
        result = detector.detect(image)
        faces = result[1] if result is not None else None

        if faces is None or len(faces) != 1:
            print(f"SKIP | {path.name} | expected exactly one face")
            continue

        try:
            feature = embedding_from_image(image, faces[0], recognizer)
        except cv2.error as exc:
            print(f"SKIP | {path.name} | {exc}")
            continue

        if feature is None:
            print(f"SKIP | {path.name} | invalid or small face")
            continue

        features.append(feature)
        print(f"Loaded enrollment image: {path.name}")

    if not features:
        raise RuntimeError("No usable enrollment images found.")

    template = np.mean(np.vstack(features), axis=0)
    norm = float(np.linalg.norm(template))
    if norm < 1e-12:
        raise RuntimeError("Could not create a valid enrollment template.")

    print(f"\nEnrollment template created from {len(features)} images.")
    return template / norm


def main():
    for model in (DETECTOR_MODEL, RECOGNIZER_MODEL):
        if not model.is_file():
            raise FileNotFoundError(f"Model not found: {model}")

    initialize_database()
    register_employee(
        EMPLOYEE_ID, EMPLOYEE_NAME, EMPLOYEE_DESIGNATION
    )

    detector = cv2.FaceDetectorYN.create(
        str(DETECTOR_MODEL), "", (320, 320),
        CONFIDENCE_THRESHOLD, 0.3, 5000
    )
    recognizer = cv2.FaceRecognizerSF.create(str(RECOGNIZER_MODEL), "")
    template = build_template(detector, recognizer)

    camera = cv2.VideoCapture(CAMERA_INDEX)
    if not camera.isOpened():
        raise RuntimeError(
            f"Cannot open camera {CAMERA_INDEX}. "
            "Close other camera apps or try another camera index."
        )

    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    match_streak = 0
    unknown_streak = 0
    score = None
    status = "CHECKING..."
    message = "Waiting for a stable face match"
    message_until = 0

    print("\nAttendX attendance demo started.")
    print("I = test check-in | O = test check-out | Q = quit")
    print("Events are written only after a manual keypress during a provisional match.")
    print("DEMO ONLY: the recognition threshold is not production validated.")

    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                print("Could not read webcam frame.")
                break

            height, width = frame.shape[:2]
            detector.setInputSize((width, height))
            result = detector.detect(frame)
            faces = result[1] if result is not None else None

            score = None
            box = None

            if faces is None or len(faces) == 0:
                status = "RETRY - NO FACE"
                match_streak = 0
                unknown_streak = 0

            elif len(faces) > 1:
                status = "RETRY - MULTIPLE FACES"
                match_streak = 0
                unknown_streak = 0

            else:
                face = faces[0]
                x, y, w, h = [int(round(v)) for v in face[:4]]
                box = (x, y, w, h)

                try:
                    feature = embedding_from_image(frame, face, recognizer)
                except cv2.error:
                    feature = None

                if feature is None:
                    status = "RETRY - FACE QUALITY"
                    match_streak = 0
                    unknown_streak = 0
                else:
                    score = float(np.dot(feature, template))

                    if score >= PROVISIONAL_THRESHOLD:
                        match_streak += 1
                        unknown_streak = 0
                    else:
                        unknown_streak += 1
                        match_streak = 0

                    if match_streak >= REQUIRED_CONSECUTIVE_FRAMES:
                        status = "PROVISIONAL MATCH"
                    elif unknown_streak >= REQUIRED_CONSECUTIVE_FRAMES:
                        status = "UNKNOWN"
                    else:
                        status = "CHECKING..."

            if box is not None:
                x, y, w, h = box
                color = (
                    (0, 200, 0)
                    if status == "PROVISIONAL MATCH"
                    else (0, 165, 255)
                )
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)

            cv2.putText(
                frame, status, (15, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2
            )

            if score is not None:
                cv2.putText(
                    frame, f"Similarity: {score:.3f}", (15, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2
                )

            if status == "PROVISIONAL MATCH":
                cv2.putText(
                    frame, "I: CHECK IN    O: CHECK OUT", (15, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2
                )
            elif status == "CHECKING...":
                progress = max(match_streak, unknown_streak)
                cv2.putText(
                    frame,
                    f"Consistent frames: {progress}/{REQUIRED_CONSECUTIVE_FRAMES}",
                    (15, 90), cv2.FONT_HERSHEY_SIMPLEX,
                    0.55, (255, 255, 255), 1
                )

            cv2.putText(
                frame, "TEST MODE - MANUAL CONFIRMATION REQUIRED",
                (15, height - 15), cv2.FONT_HERSHEY_SIMPLEX,
                0.48, (255, 255, 255), 1
            )

            if message:
                cv2.putText(
                    frame, message[:75], (15, 125),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.48, (255, 255, 255), 1
                )

            cv2.imshow("AttendX - Attendance Test", frame)
            key = cv2.waitKey(1) & 0xFF

            if key in (ord("q"), ord("Q")):
                break

            if key in (ord("i"), ord("I"), ord("o"), ord("O")):
                if status != "PROVISIONAL MATCH":
                    message = "Not recorded: no stable provisional match"
                    print(message)
                    continue

                event_type = (
                    "check_in" if key in (ord("i"), ord("I"))
                    else "check_out"
                )

                try:
                    result = record_attendance(
                        EMPLOYEE_ID, event_type, source=EVENT_SOURCE
                    )
                    if result["recorded"]:
                        message = f"RECORDED: {event_type.upper()}"
                        print(message, "|", result)
                    else:
                        message = f"NOT RECORDED: {result['reason']}"
                        print(message)
                except (ValueError, RuntimeError) as exc:
                    message = f"Attendance error: {exc}"
                    print(message)

    finally:
        camera.release()
        cv2.destroyAllWindows()
        print("Webcam released. Test stopped.")


if __name__ == "__main__":
    main()