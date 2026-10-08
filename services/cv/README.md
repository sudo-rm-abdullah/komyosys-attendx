# AttendX CV Service

Minimal Python service foundation. It currently exposes only `GET /health`. No camera ingestion, OpenCV, model weights, YOLO, face recognition, or other CV logic is included.

From the repository root, install `requirements.txt` and run:

```sh
uvicorn app.main:app --app-dir services/cv --reload --port 8001
```

Health check: `http://localhost:8001/health`
