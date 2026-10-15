# NAXA Compliance AI

Naxa checks invoice evidence against purchase orders and supporting records before payment. The current code is the runnable local application foundation; document upload and invoice comparisons are not connected yet.

## Run the local foundation

1. Copy `.env.example` to `.env` and set a local PostgreSQL password there.
2. Start PostgreSQL and the private storage volumes with `docker compose up -d db`.
3. In one terminal, run `cd backend && uv sync && uv run uvicorn app.main:app --reload --port 8000`.
4. In another terminal, run `cd frontend && npm ci && npm run dev`.
5. Open the app at `http://localhost:3000`. The API liveness and database readiness endpoints are `http://localhost:8000/health` and `http://localhost:8000/ready`.

Docker Compose keeps PostgreSQL data and the future private uploads in separate named volumes. The app container definitions are available with `docker compose --profile containers up --build` when the container builder can access package registries. No real financial documents should be used in this demo.

## Run checks without Docker

- Frontend: `cd frontend && npm ci && npm run lint && npm run build`
- Backend: `cd backend && uv sync && uv run pytest`

Database schema and migrations are intentionally deferred until the open first-slice data decisions in [the task plan](docs/task-plan.md) are resolved.
