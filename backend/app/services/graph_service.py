"""Recommendations computed from the retrieved Neo4j graph, or labeled seed demo."""
import logging
from typing import Any, Dict, List, Optional
from collections import defaultdict
from backend.app.config import settings
from backend.app.db.neo4j_client import neo4j_client
from backend.app.db.memory_store import memory_store, MemoryGraphStore

logger = logging.getLogger('skillroute.graph')

class GraphService:
    def is_neo4j_active(self):
        return bool(settings.has_neo4j_config and neo4j_client.check_health().get('connected'))

    def _store(self):
        if settings.has_neo4j_config:
            try:
                # Read actual graph properties and relationships; calculations never
                # label local seed data as Neo4j merely because a ping succeeded.
                roles = [r['node'] for r in neo4j_client.execute_read('MATCH (r:Role) RETURN properties(r) AS node')]
                skills = [r['node'] for r in neo4j_client.execute_read('MATCH (s:Skill) RETURN properties(s) AS node')]
                deps = neo4j_client.execute_read('MATCH (s:Skill)-[:DEPENDS_ON]->(p:Skill) RETURN s.id AS child, p.id AS parent')
                reqs = neo4j_client.execute_read("MATCH (r:Role)-[q:REQUIRES]->(s:Skill) RETURN r.id AS role, s.id AS skill, coalesce(q.importance, 'Core') AS importance, coalesce(q.level, 'Foundational') AS level")
                resources = neo4j_client.execute_read('MATCH (r:Resource)-[:TEACHES]->(s:Skill) RETURN properties(r) AS node, s.id AS skillId')
                if roles and skills and reqs:
                    store = MemoryGraphStore(roles, skills, [(d['child'], d['parent']) for d in deps], [(r['role'], r['skill'], r['importance'], r['level']) for r in reqs], [dict(r['node'], skillId=r['skillId']) for r in resources])
                    store.topological_sort(list(store.skills))
                    return store, {'is_demo_mode': False, 'source': 'Neo4j AuraDB'}
                reason = 'Connected graph is empty; run the explicit seed CLI.'
            except Exception as exc:
                logger.warning('Neo4j graph retrieval failed: %s', type(exc).__name__)
                reason = 'Live graph unavailable; using local sample graph.'
        else:
            reason = 'Neo4j is not configured; using local sample graph.'
        return memory_store, {'is_demo_mode': True, 'source': 'In-Memory Graph Engine', 'sourceNotice': reason}

    def get_roles(self):
        store, meta = self._store()
        return dict(meta, roles=[dict(r, requiredSkillCount=len(store.role_requirements.get(r['id'], []))) for r in store.get_all_roles()])

    def get_role_detail(self, role_id):
        store, meta = self._store()
        role = store.get_role_by_id(role_id)
        if not role:
            return dict(meta, error='Role not found', role=None)
        skills = [dict(store.skills[q['skill_id']], importance=q['importance'], level=q['level']) for q in store.role_requirements[role_id] if q['skill_id'] in store.skills]
        return dict(meta, role=dict(role, requiredSkills=skills))

    def get_skill_gaps(self, role_id, completed_skill_ids):
        store, meta = self._store()
        result = dict(store.calculate_skill_gaps(role_id, completed_skill_ids), **meta)
        result['evidence'] = {'relationshipTypes': ['REQUIRES', 'DEPENDS_ON', 'TEACHES'], 'source': meta['source'], 'selfReportedCompletion': True}
        if not meta['is_demo_mode']:
            try:
                result['evidence']['prerequisitePaths'] = neo4j_client.execute_read(
                    'MATCH (r:Role {id: $roleId})-[:REQUIRES]->(required:Skill) '
                    'OPTIONAL MATCH path=(required)-[:DEPENDS_ON*1..20]->(prerequisite:Skill) '
                    'RETURN required.id AS skillId, collect(DISTINCT prerequisite.id) AS prerequisiteIds',
                    {'roleId': role_id})
            except Exception as exc:
                logger.warning('Prerequisite evidence query unavailable: %s', type(exc).__name__)
                result['evidence']['notice'] = 'Path evidence unavailable; graph snapshot computation used.'
        return result

    def get_roadmap(self, role_id, completed_skill_ids):
        store, meta = self._store()
        return dict(store.generate_roadmap(role_id, completed_skill_ids), **meta)

    def get_skills(self):
        store, meta = self._store()
        return dict(meta, skills=[dict(s, prerequisites=store.get_direct_prerequisites(s['id'])) for s in store.get_all_skills()])

    def get_resources(self, skill_id=None, is_free=None):
        store, meta = self._store()
        resources = store.get_resources(skill_id, is_free)
        return dict(meta, resources=resources, count=len(resources))

graph_service = GraphService()
