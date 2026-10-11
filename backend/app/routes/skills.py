"""Skills and Gap Analysis Routes."""

from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.graph_service import graph_service
from backend.app.services.user_service import user_service

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("")
def list_skills():
    return graph_service.get_skills()

@router.get("/gaps")
def get_skill_gaps(
    role_id: Optional[str] = Query(None, description="Optional target role ID; defaults to current user profile target role")
):
    profile = user_service.get_profile()
    target_role = role_id or profile.get("targetRoleId", "fullstack-swe")
    completed_skills = profile.get("completedSkillIds", [])

    return graph_service.get_skill_gaps(target_role, completed_skills)
