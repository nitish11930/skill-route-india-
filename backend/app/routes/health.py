"""Health and Live Integration Status Route."""

from datetime import datetime
from fastapi import APIRouter
from backend.app.config import settings
from backend.app.db.neo4j_client import neo4j_client
from backend.app.services.gemini_service import gemini_coach

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
def get_health_status():
    neo4j_health = neo4j_client.check_health()
    gemini_health = gemini_coach.check_health()

    is_demo_mode = not (neo4j_health.get("connected") and gemini_health.get("connected"))

    return {
        "status": "online",
        "app": settings.app_name,
        "version": settings.app_version,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "isDemoMode": is_demo_mode,
        "integrations": {
            "neo4j": {
                "configured": settings.has_neo4j_config,
                "connected": neo4j_health.get("connected", False),
                "status": neo4j_health.get("status", "unknown"),
                "message": neo4j_health.get("message", ""),
                "targetUri": settings.masked_neo4j_uri(),
                "database": settings.neo4j_database
            },
            "gemini": {
                "configured": settings.has_gemini_config,
                "connected": gemini_health.get("connected", False),
                "model": settings.gemini_model.strip() if settings.gemini_model.strip() else "not-configured",
                "status": gemini_health.get("status", "not-configured"),
                "message": gemini_health.get("message", "")
            }
        },
        "modeDescription": (
            "Running in Production Graph Mode with live Neo4j AuraDB & Gemini"
            if not is_demo_mode
            else "Running in Transparent Demo Mode with In-Memory Graph Engine & Grounded Coach Fallback"
        )
    }
