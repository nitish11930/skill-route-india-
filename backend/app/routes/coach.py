"""Grounded Gemini Career Coach Route."""

from fastapi import APIRouter
from backend.app.services.gemini_service import gemini_coach, CoachChatRequest, CoachChatResponse

router = APIRouter(prefix="/api/coach", tags=["AI Career Coach"])

@router.post("/chat", response_model=CoachChatResponse)
async def chat_with_coach(request: CoachChatRequest):
    return await gemini_coach.get_coaching_response(request)
