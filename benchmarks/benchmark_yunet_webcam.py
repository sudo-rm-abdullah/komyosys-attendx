import time
import cv2

MODEL = "models/face/face_detection_yunet_2023mar.onnx"
CAMERA_INDEX = 0

def main():
    detector = cv2.FaceDetectorYN.create(
        MODEL, "", (320, 320), 0.8, 0.3, 5000
    )

    camera = cv2.VideoCapture(CAMERA_INDEX)
    if not camera.isOpened():
        raise RuntimeError("Cannot open webcam.")

    latencies = []
    frames = 0
    print("YuNet face detection started. Press Q to stop.")

    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                break

            height, width = frame.shape[:2]
            detector.setInputSize((width, height))

            start = time.perf_counter()
            _, faces = detector.detect(frame)
            latency_ms = (time.perf_counter() - start) * 1000
            latencies.append(latency_ms)
            frames += 1

            if faces is not None:
                for face in faces:
                    x, y, w, h = map(int, face[:4])
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 220, 0), 2)
                    cv2.putText(
                        frame, f"Face {face[-1]:.2f}",
                        (x, max(20, y - 8)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 220, 0), 2
                    )

            cv2.putText(
                frame, f"Faces: {0 if faces is None else len(faces)} | "
                f"Detection: {latency_ms:.1f} ms | Q: quit",
                (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 220, 255), 2
            )
            cv2.imshow("AttendX - YuNet Face Detection", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        camera.release()
        cv2.destroyAllWindows()

    if latencies:
        print("\n--- YuNet webcam results ---")
        print(f"Frames processed: {frames}")
        print(f"Average detection latency: {sum(latencies) / len(latencies):.2f} ms")
        print(f"Average detection FPS: {1000 / (sum(latencies) / len(latencies)):.2f}")

if __name__ == "__main__":
    main()
