# Komyosys AttendX

AttendX is organized as a monorepo containing the web frontend, API service, computer-vision service, shared contract placeholders, and future infrastructure/database scaffolding.

## Development

Install JavaScript dependencies from the repository root:

```sh
npm install
npm run dev
```

The root `dev` and `build` scripts delegate to the `apps/web` workspace. The web application is available at the Vite URL printed in the terminal (normally `http://localhost:5173`).

Run the services separately:

```sh
python -m pip install -r services/api/requirements.txt
uvicorn app.main:app --app-dir services/api --reload --port 8000
```

```sh
python -m pip install -r services/cv/requirements.txt
uvicorn app.main:app --app-dir services/cv --reload --port 8001
```

Both services expose `GET /health`. They are intentionally minimal foundations; no business API, CV processing, or Supabase integration is implemented.

See [the architecture overview](docs/architecture/README.md) for component boundaries and current camera configuration.
