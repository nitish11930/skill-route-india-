"""Tests for Grounded Gemini Career Coach service."""

import pytest
from backend.app.services.gemini_service import gemini_coach, CoachChatRequest, sanitize_input

def test_input_sanitization():
    raw = "What should I learn next?\x00\x08   "
    clean = sanitize_input(raw)
    assert clean == "What should I learn next?"

@pytest.mark.asyncio
async def test_grounded_coaching_fallback_response():
    """Verify coach response is grounded with graph evidence and safety guardrails."""
    req = CoachChatRequest(
        message="What is the shortest path to becoming an AI platform engineer?",
        roleId="aiml-platform"
    )
    res = await gemini_coach.get_coaching_response(req)

    assert res.response is not None
    assert len(res.response) > 50
    assert "aiml-platform" in res.groundedEvidence["targetRole"].lower() or "ai & ml" in res.groundedEvidence["targetRole"].lower()
    assert "readinessScore" in res.groundedEvidence

    # Guardrail check: Verify no raw cypher execution syntax is recommended to user
    assert "MATCH (" not in res.response or "cypher" in res.response.lower()
    assert "DROP DATABASE" not in res.response

def test_missing_model_reports_not_configured(monkeypatch):
    """Verify missing GEMINI_MODEL returns not-configured and does not guess a default."""
    from backend.app.config import settings
    monkeypatch.setattr(settings, "gemini_model", "")
    monkeypatch.setattr(settings, "gemini_api_key", "")
    health = gemini_coach.check_health()
    assert health["model"] == "not-configured"
    assert health["status"] == "not-configured"
    assert health["connected"] is False
