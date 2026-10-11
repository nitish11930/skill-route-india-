"""SkillRoute India - FastAPI Application Entrypoint.

Architectural principles:
- Transparent Demo Mode vs Live Neo4j/Gemini
- Strict secret security: no secrets exposed to browser or logs
- Never silently seed database on startup
- CORS configured for Vite frontend
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.db.neo4j_client import neo4j_client
from backend.app.routes import health, roles, skills, roadmap, resources, coach, user

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("skillroute.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    # Verify connectivity if configured (read-only ping, NO SEEDING)
    if settings.has_neo4j_config:
        health_status = neo4j_client.check_health()
        logger.info(f"Neo4j connectivity status: {health_status.get('status')}")
    else:
        logger.info("Neo4j unconfigured. Operating in in-memory Demo Mode.")

    yield

    logger.info("Shutting down SkillRoute India services...")
    neo4j_client.close()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-driven Career Navigation & Prerequisite Graph for Indian GCC & Product Tech",
    lifespan=lifespan
)

# Enable CORS for local development and preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routes
app.include_router(health.router)
app.include_router(roles.router)
app.include_router(skills.router)
app.include_router(roadmap.router)
app.include_router(resources.router)
app.include_router(coach.router)
app.include_router(user.router)

@app.get("/api/info")
def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health"
    }

@app.exception_handler(ValueError)
async def invalid_input(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

# A built frontend can be served by the same Python process and origin.
frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if frontend_dist.is_dir():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
