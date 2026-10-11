"""User Calibration and Profile Routes."""

from fastapi import APIRouter
from backend.app.services.user_service import user_service, UserProfileUpdate

router = APIRouter(prefix="/api/user", tags=["User Profile"])

@router.get("/profile")
def get_profile():
    return user_service.get_profile()

@router.post("/profile")
def update_profile(update: UserProfileUpdate):
    return user_service.update_profile(update)

@router.post("/skills/{skill_id}/toggle")
def toggle_skill(skill_id: str):
    return user_service.toggle_skill(skill_id)

@router.post("/reset")
def reset_profile():
    return user_service.reset_profile()
