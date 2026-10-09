from pathlib import Path
import hashlib
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
ENROLL_DIR = ROOT / "data" / "face_test" / "enrollment" / "participant_001"
VALIDATION_DIR = ROOT / "data" / "face_test" / "validation"
DETECTOR_MODEL = ROOT / "models" / "face" / "face_detection_yunet_2023mar.onnx"
RECOGNIZER_MODEL = ROOT / "models" / "face" / "face_recognition_sface_2021dec.onnx"

CONFIDENCE_THRESHOLD = 0.80
MIN_FACE_SIZE = 80
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def get_embedding(path, detector, recognizer):
    image = cv2.imread(str(path))
    if image is None:
        return None, "unreadable image"

    height, width = image.shape[:2]
    detector.setInputSize((width, height))
    result = detector.detect(image)
    faces = result[1] if result is not None else None

    if faces is None or len(faces) == 0:
        return None, "no face detected"
    if len(faces) > 1:
        return None, f"{len(faces)} faces detected"

    face = faces[0]
    x, y, w, h = [int(round(v)) for v in face[:4]]
    if min(w, h) < MIN_FACE_SIZE:
        return None, f"face too small ({w}x{h})"

    try:
        aligned = recognizer.alignCrop(image, face)
        feature = recognizer.feature(aligned)
    except cv2.error as exc:
        return None, f"embedding error: {exc}"

    if feature is None or not np.isfinite(feature).all():
        return None, "invalid embedding"

    feature = feature.reshape(-1).astype(np.float32)
    norm = float(np.linalg.norm(feature))
    if norm < 1e-12:
        return None, "zero-length embedding"

    return feature / norm, "ok"


def list_images(folder):
    if not folder.exists():
        return []
    return sorted(
        p for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
    )


def main():
    for model in (DETECTOR_MODEL, RECOGNIZER_MODEL):
        if not model.is_file():
            raise FileNotFoundError(f"Model not found: {model}")

    enrollment_paths = list_images(ENROLL_DIR)
    if not enrollment_paths:
        raise SystemExit(f"No enrollment images found: {ENROLL_DIR}")

    detector = cv2.FaceDetectorYN.create(
        str(DETECTOR_MODEL), "", (320, 320),
        CONFIDENCE_THRESHOLD, 0.3, 5000
    )
    recognizer = cv2.FaceRecognizerSF.create(str(RECOGNIZER_MODEL), "")

    enrollment_features = []
    print("\nENROLLMENT: participant_001")
    print("-" * 72)

    for path in enrollment_paths:
        feature, status = get_embedding(path, detector, recognizer)
        if feature is None:
            print(f"SKIP | {path.name} | {status}")
        else:
            enrollment_features.append(feature)
            print(f"OK   | {path.name}")

    if not enrollment_features:
        raise SystemExit("No usable enrollment embeddings.")

    template = np.mean(np.vstack(enrollment_features), axis=0)
    template_norm = float(np.linalg.norm(template))
    if template_norm < 1e-12:
        raise SystemExit("Could not construct a valid enrollment template.")
    template /= template_norm

    print(f"\nUsable enrollment embeddings: {len(enrollment_features)}")
    print("\nVALIDATION")
    print("=" * 90)

    seen_hashes = {}
    summaries = {}

    for participant_dir in sorted(VALIDATION_DIR.iterdir()):
        if not participant_dir.is_dir():
            continue

        participant = participant_dir.name
        paths = list_images(participant_dir)
        if not paths:
            continue

        print(f"\n{participant}")
        print("-" * 90)
        scores = []
        unique_count = 0

        for path in paths:
            file_hash = sha256(path)
            if file_hash in seen_hashes:
                print(
                    f"DUPLICATE | {path.name} | same content as "
                    f"{seen_hashes[file_hash]}"
                )
                continue

            seen_hashes[file_hash] = str(path.relative_to(ROOT))
            unique_count += 1

            feature, status = get_embedding(path, detector, recognizer)
            if feature is None:
                print(f"FAIL | {path.name} | {status}")
                continue

            score = float(np.dot(feature, template))
            scores.append(score)
            print(f"OK   | {path.name} | cosine_similarity={score:.4f}")

        summaries[participant] = {
            "files": len(paths),
            "unique": unique_count,
            "success": len(scores),
            "scores": scores,
        }

        if scores:
            print(
                f"Summary: mean={np.mean(scores):.4f}, "
                f"min={np.min(scores):.4f}, max={np.max(scores):.4f}"
            )

    print("\nFINAL SUMMARY")
    print("=" * 90)
    for participant, data in summaries.items():
        label = (
            "GENUINE MATCH TEST"
            if participant == "participant_001"
            else "UNKNOWN-PERSON TEST"
        )
        print(
            f"{participant} ({label}): files={data['files']}, "
            f"unique={data['unique']}, successful={data['success']}"
        )
        if data["scores"]:
            print(
                f"  mean={np.mean(data['scores']):.4f}, "
                f"min={np.min(data['scores']):.4f}, "
                f"max={np.max(data['scores']):.4f}"
            )

    print("\nScores are cosine similarities, not probabilities.")
    print("No acceptance threshold is applied by this evaluator.")
    print("Small samples cannot establish production false-accept rates.")


if __name__ == "__main__":
    main()
