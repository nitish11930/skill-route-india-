"""Tests must never change the demo profile or call paid/live services."""
import pytest
import backend.app.services.user_service as profile_module
from backend.app.config import settings

@pytest.fixture(autouse=True)
def isolate_profile_and_services(tmp_path, monkeypatch):
    monkeypatch.setattr(profile_module, 'PROFILE_FILE', tmp_path / 'profile.json')
    monkeypatch.setattr(settings, 'neo4j_uri', '')
    monkeypatch.setattr(settings, 'gemini_api_key', '')
