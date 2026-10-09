import time
import cv2
import torch
from torchvision.models.detection import (
    ssdlite320_mobilenet_v3_large,
    SSDLite320_MobileNet_V3_Large_Weights,
)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SCORE_THRESHOLD = 0.50
WARMUP_FRAMES = 10
TEST_SECONDS = 60

def main():
    print(f"Device: {DEVICE}")
    if DEVICE.type == "cuda":
        print(f"GPU: {torch.cuda.get_device_name(0)}")

    weights = SSDLite320_MobileNet_V3_Large_Weights.DEFAULT
    print("Loading SSDLite pretrained weights (first run downloads them)...")
    model = ssdlite320_mobilenet_v3_large(weights=weights)
    model.eval().to(DEVICE)
    preprocess = weights.transforms()
    categories = weights.meta["categories"]

    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        raise RuntimeError("Cannot open webcam. Check camera permissions or camera index.")

    frame_count = 0
    inference_times = []
    start_time = None
    last_people = 0

    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                print("Could not read webcam frame.")
                break

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            tensor = torch.from_numpy(rgb.copy()).permute(2, 0, 1).float() / 255.0
            tensor = tensor.to(DEVICE)

            if DEVICE.type == "cuda":
                torch.cuda.synchronize()
            t0 = time.perf_counter()

            with torch.inference_mode():
                prediction = model([preprocess(tensor)])[0]

            if DEVICE.type == "cuda":
                torch.cuda.synchronize()
            elapsed = time.perf_counter() - t0

            if frame_count >= WARMUP_FRAMES:
                inference_times.append(elapsed)
                if start_time is None:
                    start_time = time.perf_counter()

            boxes = prediction["boxes"].detach().cpu().numpy()
            labels = prediction["labels"].detach().cpu().numpy()
            scores = prediction["scores"].detach().cpu().numpy()
            people = 0

            for box, label, score in zip(boxes, labels, scores):
                if score < SCORE_THRESHOLD or categories[label] != "person":
                    continue

                people += 1
                x1, y1, x2, y2 = map(int, box)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 220, 0), 2)
                cv2.putText(
                    frame, f"Person {score:.2f}", (x1, max(20, y1 - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 220, 0), 2
                )

            frame_count += 1
            last_people = people

            if start_time is not None:
                elapsed_test = time.perf_counter() - start_time
                if elapsed_test >= TEST_SECONDS:
                    break
                fps = len(inference_times) / max(sum(inference_times), 1e-9)
                status = f"Inference FPS: {fps:.1f} | People: {people} | q: quit"
            else:
                status = f"Warming up {frame_count}/{WARMUP_FRAMES} | q: quit"

            cv2.putText(
                frame, status, (10, 25), cv2.FONT_HERSHEY_SIMPLEX,
                0.55, (0, 220, 255), 2
            )
            cv2.imshow("AttendX - SSDLite Benchmark", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        camera.release()
        cv2.destroyAllWindows()

    if inference_times:
        avg_ms = sum(inference_times) / len(inference_times) * 1000
        fps = len(inference_times) / sum(inference_times)
        print("\n--- AttendX SSDLite Benchmark ---")
        print(f"Device: {DEVICE}")
        print(f"Measured inference runs: {len(inference_times)}")
        print(f"Average inference latency: {avg_ms:.2f} ms")
        print(f"Average inference-only FPS: {fps:.2f}")
        print(f"Last detected person count: {last_people}")
        if DEVICE.type == "cuda":
            print(f"Peak allocated GPU memory: {torch.cuda.max_memory_allocated() / 1024**2:.1f} MiB")
    else:
        print("No benchmark measurements completed.")

if __name__ == "__main__":
    main()
