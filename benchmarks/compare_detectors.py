import time
import cv2
import torch
from torchvision.models.detection import (
    ssdlite320_mobilenet_v3_large,
    SSDLite320_MobileNet_V3_Large_Weights,
)
from ultralytics import YOLO

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
FRAME_COUNT = 60
WARMUP_COUNT = 10
CONFIDENCE = 0.50

def capture_frames():
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        raise RuntimeError("Could not open webcam.")

    frames = []
    try:
        print(f"Capturing {FRAME_COUNT} frames...")
        while len(frames) < FRAME_COUNT:
            ok, frame = camera.read()
            if ok:
                frames.append(frame.copy())
    finally:
        camera.release()

    print(f"Captured {len(frames)} frames at {frames[0].shape[1]}x{frames[0].shape[0]}")
    return frames

def sync():
    if DEVICE.type == "cuda":
        torch.cuda.synchronize()

def benchmark_ssdlite(frames):
    weights = SSDLite320_MobileNet_V3_Large_Weights.DEFAULT
    model = ssdlite320_mobilenet_v3_large(weights=weights).eval().to(DEVICE)
    person_id = weights.meta["categories"].index("person")

    def run(frame):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        tensor = torch.from_numpy(rgb.copy()).permute(2, 0, 1).float().div_(255)
        with torch.inference_mode():
            output = model([tensor.to(DEVICE)])[0]
        return int(((output["labels"] == person_id) &
                    (output["scores"] >= CONFIDENCE)).sum().item())

    return measure("SSDLite MobileNetV3-Large", run, frames)

def benchmark_yolo(frames):
    model = YOLO("yolo26n.pt")

    def run(frame):
        results = model.predict(
            source=frame, imgsz=640, conf=CONFIDENCE,
            device=0 if DEVICE.type == "cuda" else "cpu",
            verbose=False,
        )
        if not results or results[0].boxes is None:
            return 0
        boxes = results[0].boxes
        return int(((boxes.cls == 0) & (boxes.conf >= CONFIDENCE)).sum().item())

    return measure("YOLO26n", run, frames)

def measure(name, run, frames):
    print(f"\nWarming up {name}...")
    for frame in frames[:WARMUP_COUNT]:
        run(frame)
    sync()

    if DEVICE.type == "cuda":
        torch.cuda.reset_peak_memory_stats()

    durations = []
    counts = []
    print(f"Measuring {name} on {len(frames)} identical frames...")

    for frame in frames:
        sync()
        start = time.perf_counter()
        count = run(frame)
        sync()
        durations.append(time.perf_counter() - start)
        counts.append(count)

    total = sum(durations)
    result = {
        "name": name,
        "fps": len(frames) / total,
        "latency_ms": total / len(frames) * 1000,
        "avg_people": sum(counts) / len(counts),
        "peak_mib": (
            torch.cuda.max_memory_allocated() / 1024**2
            if DEVICE.type == "cuda" else 0
        ),
    }

    print(f"  FPS: {result['fps']:.2f}")
    print(f"  Average pipeline latency: {result['latency_ms']:.2f} ms")
    print(f"  Average detected people: {result['avg_people']:.2f}")
    if DEVICE.type == "cuda":
        print(f"  Peak allocated GPU memory: {result['peak_mib']:.1f} MiB")
    return result

def main():
    print(f"Device: {DEVICE}")
    if DEVICE.type == "cuda":
        print(f"GPU: {torch.cuda.get_device_name(0)}")

    frames = capture_frames()
    results = [benchmark_ssdlite(frames), benchmark_yolo(frames)]

    print("\n========== STANDARDIZED COMPARISON ==========")
    print(f"{'Model':30} {'FPS':>8} {'Latency ms':>12} {'Avg people':>12} {'GPU MiB':>10}")
    for r in results:
        print(f"{r['name']:30} {r['fps']:8.2f} {r['latency_ms']:12.2f} "
              f"{r['avg_people']:12.2f} {r['peak_mib']:10.1f}")
    print("\nTiming includes preprocessing, inference and postprocessing.")
    print("Webcam capture and preview rendering are excluded.")

if __name__ == "__main__":
    main()
