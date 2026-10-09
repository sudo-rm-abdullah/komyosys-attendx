from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "data" / "face_test" / "enrollment" / "participant_001"
DETECTOR_MODEL = ROOT / "models" / "face" / "face_detection_yunet_2023mar.onnx"
RECOGNIZER_MODEL = ROOT / "models" / "face" / "face_recognition_sface_2021dec.onnx"

CONFIDENCE_THRESHOLD = 0.80
MIN_FACE_SIZE = 80

def main():
    for path in (DETECTOR_MODEL, RECOGNIZER_MODEL):
        if not path.is_file():
            raise FileNotFoundError(f"Model not found: {path}")

    if not IMAGE_DIR.is_dir():
        raise FileNotFoundError(f"Enrollment folder not found: {IMAGE_DIR}")

    images = sorted(
        p for p in IMAGE_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )

    if not images:
        print(f"No images found in {IMAGE_DIR}")
        return

    detector = cv2.FaceDetectorYN.create(
        str(DETECTOR_MODEL), "", (320, 320),
        CONFIDENCE_THRESHOLD, 0.3, 5000
    )
    recognizer = cv2.FaceRecognizerSF.create(
        str(RECOGNIZER_MODEL), ""
    )

    embeddings = []
    names = []

    print(f"OpenCV version: {cv2.__version__}")
    print(f"Images found: {len(images)}")
    print("-" * 75)

    for path in images:
        image = cv2.imread(str(path))

        if image is None:
            print(f"FAIL | {path.name} | Could not read image")
            continue

        height, width = image.shape[:2]
        detector.setInputSize((width, height))
        result = detector.detect(image)
        faces = result[1] if result is not None else None
        detection_method = "original"

        if faces is None or len(faces) == 0:
            # Diagnostic retry on a 1.5x enlarged image.
            enlarged = cv2.resize(
                image, None, fx=1.5, fy=1.5,
                interpolation=cv2.INTER_CUBIC
            )
            detector.setInputSize(
                (enlarged.shape[1], enlarged.shape[0])
            )
            retry_result = detector.detect(enlarged)
            retry_faces = (
                retry_result[1] if retry_result is not None else None
            )

            if retry_faces is not None and len(retry_faces) > 0:
                # Convert bounding boxes back to original-image coordinates.
                faces = retry_faces.copy()
                faces[:, :4] /= 1.5
                detection_method = "enlarged retry"
            else:
                print(
                    f"FAIL | {path.name} | "
                    "No face detected after retry"
                )
                continue

        if len(faces) > 1:
            print(
                f"REVIEW | {path.name} | "
                f"{len(faces)} faces detected"
            )
            continue

        face = faces[0]
        confidence = float(face[-1])
        x, y, w, h = [int(round(v)) for v in face[:4]]
        blur_score = float(
            cv2.Laplacian(image[max(y, 0):max(y, 0) + max(h, 1),
                                max(x, 0):max(x, 0) + max(w, 1)],
                          cv2.CV_64F).var()
        ) if w > 0 and h > 0 else 0.0

        if min(w, h) < MIN_FACE_SIZE:
            print(
                f"REVIEW | {path.name} | Face too small: {w}x{h} px"
            )
            continue

        try:
            aligned = recognizer.alignCrop(image, face)
            feature = recognizer.feature(aligned)
        except cv2.error as exc:
            print(f"FAIL | {path.name} | Alignment/embedding error: {exc}")
            continue

        if feature is None or not np.isfinite(feature).all():
            print(f"FAIL | {path.name} | Invalid face embedding")
            continue

        embeddings.append(feature.reshape(-1).astype(np.float32))
        names.append(path.name)

        print(
            f"PASS | {path.name} | confidence={confidence:.3f} "
            f"| face={w}x{h}px | blur_score={blur_score:.1f} "
            f"| detection={detection_method}"
        )

    print("-" * 75)
    print(f"Embeddings created: {len(embeddings)} / {len(images)}")
    print("Note: PASS means detection and embedding succeeded, not that the")
    print("image is suitable for production enrollment or identity is verified.")

    if len(embeddings) >= 2:
        matrix = np.vstack(embeddings)
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        normalized = matrix / np.maximum(norms, 1e-12)
        similarities = normalized @ normalized.T

        print("\nPairwise SFace cosine similarity:")
        print("Higher values indicate more similar embeddings; no identity")
        print("threshold has been calibrated yet.\n")
        print("Image A | Image B | Similarity")
        print("-" * 65)

        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                print(
                    f"{names[i]} | {names[j]} | "
                    f"{similarities[i, j]:.4f}"
                )

if __name__ == "__main__":
    main()
