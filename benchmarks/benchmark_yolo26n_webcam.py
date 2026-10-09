import time
import cv2
import torch
from ultralytics import YOLO

MODEL_NAME = "yolo26n.pt"
CONFIDENCE = 0.50
WARMUP_FRAMES = 10
TEST_SECONDS = 60

def main():
    device = 0 if torch.cuda.is_available() else "cpu"
    print(f"Device: {'cuda:0' if device == 0 else 'cpu'}")
    if device == 0:
        print(f"GPU: {torch.cuda.get_device_name(0)}")

    print(f"Loading {MODEL_NAME}...")
    model = YOLO(MODEL_NAME)

    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        raise RuntimeError("Cannot open webcam.")

    times = []
    frame_count = 0
    start = None
    last_people = 0

    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                print("Could not read webcam frame.")
                break

            if device == 0:
                torch.cuda.synchronize()
            t0 = time.perf_counter()

            results = model.predict(
                source=frame,
                imgsz=640,
                conf=CONFIDENCE,
                device=device,
                verbose=False,
            )

            if device == 0:
                torch.cuda.synchronize()
            elapsed = time.perf_counter() - t0

            people = 0
            for result in results:
                for box in result.boxes:
                    if int(box.cls.item()) != 0:
                        continue

                    people += 1
                    x1, y1, x2, y2 = map(
                        int, box.xyxy[0].cpu().tolist()
                    )
                    score = float(box.conf.item())
                    cv2.rectangle(
                        frame, (x1, y1), (x2, y2), (0, 220, 0), 2
                    )
                    cv2.putText(
                        frame, f"Person {score:.2f}",
                        (x1, max(20, y1 - 8)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55,
                        (0, 220, 0), 2
                    )

            frame_count += 1
            last_people = people

            if frame_count > WARMUP_FRAMES:
                times.append(elapsed)
                if start is None:
                    start = time.perf_counter()

            if start is not None:
                test_elapsed = time.perf_counter() - start
                if test_elapsed >= TEST_SECONDS:
                    break

                fps = len(times) / max(sum(times), 1e-9)
                status = f"Pipeline FPS: {fps:.1f} | People: {people} | q: quit"
            else:
                status = f"Warming up {frame_count}/{WARMUP_FRAMES} | q: quit"

            cv2.putText(
                frame, status, (10, 25), cv2.FONT_HERSHEY_SIMPLEX,
                0.55, (0, 220, 255), 2
            )
            cv2.imshow("AttendX - YOLO26n Benchmark", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        camera.release()
        cv2.destroyAllWindows()

    if times:
        avg_ms = sum(times) / len(times) * 1000
        fps = len(times) / sum(times)
        print("\n--- AttendX YOLO26n Benchmark ---")
        print(f"Model: {MODEL_NAME}")
        print(f"Device: {'cuda:0' if device == 0 else 'cpu'}")
        print(f"Measured runs: {len(times)}")
        print(f"Average pipeline latency: {avg_ms:.2f} ms")
        print(f"Pipeline FPS: {fps:.2f}")
        print(f"Last detected person count: {last_people}")
        if device == 0:
            print(
                "Peak allocated GPU memory: "
                f"{torch.cuda.max_memory_allocated() / 1024**2:.1f} MiB"
            )
    else:
        print("No benchmark measurements completed.")

if __name__ == "__main__":
    main()
