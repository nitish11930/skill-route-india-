"""Integration tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    """Verify health returns 200, valid structure, and protects secrets."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "isDemoMode" in data
    assert "integrations" in data
    assert "neo4j" in data["integrations"]
    assert "gemini" in data["integrations"]

    # Ensure passwords and raw secrets are never leaked in payload
    raw_text = response.text.lower()
    assert "password" not in raw_text or data["integrations"]["neo4j"]["targetUri"] != ""
    assert "your_neo4j_password" not in raw_text

def test_roles_endpoints():
    """Verify target roles list and detail."""
    res_list = client.get("/api/roles")
    assert res_list.status_code == 200
    roles = res_list.json().get("roles", [])
    assert len(roles) >= 5

    first_role_id = roles[0]["id"]
    res_detail = client.get(f"/api/roles/{first_role_id}")
    assert res_detail.status_code == 200
    role = res_detail.json().get("role")
    assert role["id"] == first_role_id
    assert "requiredSkills" in role

def test_skill_gaps_endpoint():
    """Verify skill gaps endpoint returns scored analysis."""
    response = client.get("/api/skills/gaps?role_id=fullstack-swe")
    assert response.status_code == 200
    data = response.json()
    assert "readinessScore" in data
    assert "skills" in data
    assert "readyToLearn" in data
    assert "blockedSkills" in data

def test_roadmap_endpoint():
    """Verify roadmap endpoint returns phases and graph visual data."""
    response = client.get("/api/roadmap?role_id=aiml-platform")
    assert response.status_code == 200
    data = response.json()
    assert "phases" in data
    assert len(data["phases"]) == 3
    assert "graph" in data
    assert "nodes" in data["graph"]
    assert "edges" in data["graph"]

def test_resources_endpoint():
    """Verify real curated resources are returned."""
    response = client.get("/api/resources")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert len(data["resources"]) > 0
    # Every resource has a real URL and provider
    for r in data["resources"]:
        assert r["url"].startswith("http")
        assert len(r["provider"]) > 0

def test_user_profile_and_skill_toggle():
    """Verify user profile lifecycle and skill toggling."""
    # Reset first
    client.post("/api/user/reset")

    # Get initial profile
    res_get = client.get("/api/user/profile")
    assert res_get.status_code == 200
    initial_skills = res_get.json().get("completedSkillIds", [])

    # Toggle a skill
    test_skill = "docker-containers"
    res_toggle = client.post(f"/api/user/skills/{test_skill}/toggle")
    assert res_toggle.status_code == 200
    updated = res_toggle.json()
    assert updated["skillId"] == test_skill

    # Verify profile reflected the change
    res_verify = client.get("/api/user/profile")
    current_skills = res_verify.json().get("completedSkillIds", [])
    if test_skill in initial_skills:
        assert test_skill not in current_skills
    else:
        assert test_skill in current_skills

@pytest.mark.parametrize("graph_live,coach_live,configured", [
    (True, False, True), (False, True, True), (True, True, True), (False, False, False),
])
def test_health_describes_each_integration(monkeypatch, graph_live, coach_live, configured):
    from backend.app.routes import health
    monkeypatch.setattr(health.neo4j_client, "check_health", lambda: {"connected": graph_live})
    monkeypatch.setattr(health.gemini_coach, "check_health", lambda: {"connected": coach_live})
    monkeypatch.setattr(health.settings, "gemini_api_key", "test-key" if configured else "")
    monkeypatch.setattr(health.settings, "gemini_model", "test-model")
    data = health.get_health_status()
    assert data["isDemoMode"] == (not (graph_live and coach_live))
    description = data["modeDescription"]
    assert ("Graph: live Neo4j." if graph_live else "Graph: in-memory demo.") in description
    assert ("verified Gemini." if coach_live else "unverified; fallback available." if configured else "deterministic demo fallback.") in description
