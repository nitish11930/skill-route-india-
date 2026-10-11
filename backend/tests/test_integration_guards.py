from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import settings
from backend.app.services.graph_service import graph_service, neo4j_client
from backend.app.services.gemini_service import gemini_coach
from backend.app.db.memory_store import MemoryGraphStore, memory_store
import pytest

client = TestClient(app)

def test_unknown_profile_and_skill_are_rejected():
    assert client.post('/api/user/profile', json={'targetRoleId': 'not-a-role'}).status_code == 400
    assert client.post('/api/user/skills/not-a-skill/toggle').status_code == 400
    assert client.get('/api/roadmap?role_id=not-a-role').status_code == 400
    assert client.post('/api/coach/chat', json={'message': 'x' * 1001}).status_code == 422

def test_unavailable_neo4j_stays_demo_even_when_credentials_present(monkeypatch):
    monkeypatch.setattr(settings, 'neo4j_uri', 'neo4j+s://test.invalid')
    monkeypatch.setattr(settings, 'neo4j_username', 'test')
    monkeypatch.setattr(settings, 'neo4j_password', 'test')
    def offline(*args, **kwargs):
        raise ConnectionError('do not expose this secret')
    monkeypatch.setattr(neo4j_client, 'execute_read', offline)
    payload = graph_service.get_roadmap('fullstack-swe', [])
    assert payload['is_demo_mode'] is True
    assert payload['source'] == 'In-Memory Graph Engine'
    assert 'secret' not in str(payload)

def test_live_graph_changes_recommendations(monkeypatch):
    monkeypatch.setattr(settings, 'neo4j_uri', 'neo4j+s://test.invalid')
    monkeypatch.setattr(settings, 'neo4j_username', 'test')
    monkeypatch.setattr(settings, 'neo4j_password', 'test')
    role = dict(memory_store.roles['fullstack-swe'])
    remote_skill = dict(next(iter(memory_store.skills.values())), id='remote-only-skill', name='Remote Graph Skill')
    def read(query, parameters=None):
        if query.startswith('MATCH (r:Role) RETURN'): return [{'node': role}]
        if query.startswith('MATCH (s:Skill) RETURN'): return [{'node': remote_skill}]
        if 'DEPENDS_ON' in query: return []
        if ':REQUIRES' in query: return [{'role': role['id'], 'skill': remote_skill['id'], 'importance': 'Core', 'level': 'Foundational'}]
        return []
    monkeypatch.setattr(neo4j_client, 'execute_read', read)
    result = graph_service.get_skill_gaps(role['id'], [])
    assert result['source'] == 'Neo4j AuraDB'
    assert result['is_demo_mode'] is False
    assert [s['id'] for s in result['skills']] == ['remote-only-skill']

def test_cycles_rejected_and_order_deterministic():
    graph = MemoryGraphStore(dependencies=[('a', 'b'), ('b', 'a')])
    with pytest.raises(ValueError, match='cycle'):
        graph.topological_sort(['a', 'b'])
    expected = memory_store.topological_sort(list(memory_store.skills))
    assert expected == memory_store.topological_sort(list(reversed(memory_store.skills)))

def test_configured_gemini_is_not_claimed_verified(monkeypatch):
    monkeypatch.setattr(settings, 'gemini_api_key', 'sentinel-secret')
    monkeypatch.setattr(settings, 'gemini_model', 'example-model')
    monkeypatch.setattr(gemini_coach, '_verified', False)
    health = gemini_coach.check_health()
    assert health['connected'] is False
    assert health['status'] == 'configured_unverified'
    assert 'sentinel-secret' not in str(health)


def test_phase_order_never_places_dependency_after_dependent():
    for role_id in memory_store.roles:
        roadmap = memory_store.generate_roadmap(role_id, [])
        sequence = [s["id"] for phase in roadmap["phases"] for s in phase["skills"]]
        positions = {skill: index for index, skill in enumerate(sequence)}
        for skill in sequence:
            for prerequisite in memory_store.get_direct_prerequisites(skill):
                if prerequisite in positions:
                    assert positions[prerequisite] < positions[skill]


def test_built_frontend_and_api_share_origin():
    from pathlib import Path
    import re
    if not (Path(__file__).resolve().parents[2] / 'frontend' / 'dist').is_dir():
        pytest.skip('Build frontend first to verify production static serving')
    page = client.get('/')
    assert page.status_code == 200
    assert 'SkillRoute India' in page.text
    asset = re.search(r'src="(/assets/[^\"]+\.js)"', page.text)
    assert asset
    assert client.get(asset.group(1)).status_code == 200
    assert client.get('/api/health').json()['status'] == 'online'
    assert client.get('/.env').status_code == 404
