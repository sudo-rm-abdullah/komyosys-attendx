# AttendX API Service

Minimal FastAPI service foundation. It currently exposes only `GET /health` and contains no business endpoints, database integration, or Supabase connection.

From the repository root, install `requirements.txt` and run:

```sh
uvicorn app.main:app --app-dir services/api --reload --port 8000
```

Health check: `http://localhost:8000/health`
