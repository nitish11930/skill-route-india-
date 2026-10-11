"""Career Roadmap and Interactive Dependency Graph Route."""

from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.graph_service import graph_service
from backend.app.services.user_service import user_service

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])

@router.get("")
def get_roadmap(
    role_id: Optional[str] = Query(None, description="Target role ID; defaults to user profile")
):
    profile = user_service.get_profile()
    target_role = role_id or profile.get("targetRoleId", "fullstack-swe")
    completed_skills = profile.get("completedSkillIds", [])

    return graph_service.get_roadmap(target_role, completed_skills)
