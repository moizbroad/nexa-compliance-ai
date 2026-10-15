import os

from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

app = FastAPI(title="Naxa Compliance API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness check: the API process is responding."""
    return {"status": "ok"}


@app.get("/ready")
def ready() -> dict[str, str]:
    """Readiness check: PostgreSQL is accepting connections."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=503, detail="Database is not configured")

    try:
        engine = create_engine(database_url, pool_pre_ping=True)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        engine.dispose()
    except (SQLAlchemyError, ValueError):
        raise HTTPException(status_code=503, detail="Database is unavailable") from None

    return {"status": "ready", "database": "connected"}
