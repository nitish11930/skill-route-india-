"""In-memory Graph Engine and Data Repository for SkillRoute India.

Provides:
- In-memory graph traversal algorithms (transitive closure, topological ordering, gap analysis).
- High-fidelity demo mode repository when Neo4j is unconfigured or offline.
- Shared graph business logic for both remote Cypher and local fallback.
"""

from collections import defaultdict, deque
from typing import Any, Dict, List, Optional, Set, Tuple
from backend.app.db.seed_data import ROLES, SKILLS, DEPENDENCIES, ROLE_REQUIREMENTS, RESOURCES

class MemoryGraphStore:
    def __init__(self, roles=None, skills=None, dependencies=None, requirements=None, resources=None):
        self.roles: Dict[str, Dict[str, Any]] = {r["id"]: dict(r) for r in (ROLES if roles is None else roles)}
        self.skills: Dict[str, Dict[str, Any]] = {s["id"]: dict(s) for s in (SKILLS if skills is None else skills)}
        self.resources: List[Dict[str, Any]] = list(RESOURCES if resources is None else resources)

        # Adjacency maps for prerequisite graph:
        # child DEPENDS_ON parent -> parent is prerequisite for child
        # child_to_prereqs[child] = set of parents (direct prerequisites)
        self.child_to_prereqs: Dict[str, Set[str]] = defaultdict(set)
        # parent_to_dependents[parent] = set of children (skills that depend on parent)
        self.parent_to_dependents: Dict[str, Set[str]] = defaultdict(set)

        for child, parent in (DEPENDENCIES if dependencies is None else dependencies):
            self.child_to_prereqs[child].add(parent)
            self.parent_to_dependents[parent].add(child)

        # Role requirements map: role_id -> list of requirement dicts
        self.role_requirements: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        for role_id, skill_id, importance, level in (ROLE_REQUIREMENTS if requirements is None else requirements):
            self.role_requirements[role_id].append({
                "skill_id": skill_id,
                "importance": importance,
                "level": level
            })

    def get_all_roles(self) -> List[Dict[str, Any]]:
        return list(self.roles.values())

    def get_role_by_id(self, role_id: str) -> Optional[Dict[str, Any]]:
        return self.roles.get(role_id)

    def get_all_skills(self) -> List[Dict[str, Any]]:
        return list(self.skills.values())

    def get_skill_by_id(self, skill_id: str) -> Optional[Dict[str, Any]]:
        return self.skills.get(skill_id)

    def get_direct_prerequisites(self, skill_id: str) -> List[str]:
        return sorted(self.child_to_prereqs.get(skill_id, set()))

    def get_transitive_prerequisites(self, skill_id: str) -> Set[str]:
        """Find all upstream prerequisites (transitive closure) for a skill."""
        visited: Set[str] = set()
        queue = deque(self.child_to_prereqs.get(skill_id, set()))
        while queue:
            curr = queue.popleft()
            if curr not in visited:
                visited.add(curr)
                for upstream in self.child_to_prereqs.get(curr, set()):
                    if upstream not in visited:
                        queue.append(upstream)
        return visited

    def topological_sort(self, skill_ids: List[str]) -> List[str]:
        """Kahn's topological sort on a subset of skills based on DEPENDS_ON relations.

        Foundational skills with 0 unsatisfied prerequisites appear first.
        """
        id_set = set(skill_ids)
        in_degree: Dict[str, int] = {s: 0 for s in id_set}
        adj: Dict[str, Set[str]] = defaultdict(set)

        for s in id_set:
            # For each prereq that is also in our subset
            prereqs = self.child_to_prereqs.get(s, set())
            for p in prereqs:
                if p in id_set:
                    # p must come before s, so edge is p -> s
                    adj[p].add(s)
                    in_degree[s] += 1

        queue = deque(sorted(s for s in id_set if in_degree[s] == 0))
        ordered: List[str] = []

        while queue:
            # Sort queue deterministically by difficulty/category/name
            u = queue.popleft()
            ordered.append(u)

            for neighbor in sorted(adj[u]):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(ordered) != len(id_set):
            raise ValueError("Skill dependency graph contains a cycle")

        return ordered

    def calculate_skill_gaps(self, role_id: str, completed_skill_ids: List[str]) -> Dict[str, Any]:
        """Calculate scored skill gaps, readiness score, and blocked vs ready items."""
        role = self.get_role_by_id(role_id)
        if not role:
            raise ValueError(f"Role not found: {role_id}")

        req_items = self.role_requirements.get(role_id, [])
        role_skill_ids = {r["skill_id"] for r in req_items}

        # Include transitive prerequisites needed for the role's skills
        all_relevant_skill_ids = set(role_skill_ids)
        for s_id in role_skill_ids:
            all_relevant_skill_ids.update(self.get_transitive_prerequisites(s_id))

        completed_set = set(completed_skill_ids)

        # Map each skill requirement metadata
        req_meta = {r["skill_id"]: r for r in req_items}

        skills_detail = []
        ready_to_learn = []
        blocked_skills = []
        completed_skills = []

        # Topologically sort all relevant skills
        sorted_all_ids = self.topological_sort(list(all_relevant_skill_ids))

        for s_id in sorted_all_ids:
            skill = self.skills.get(s_id)
            if not skill:
                continue

            prereqs = sorted(self.child_to_prereqs.get(s_id, set()))
            missing_prereqs = [p for p in prereqs if p not in completed_set]
            is_completed = s_id in completed_set

            meta = req_meta.get(s_id, {
                "importance": "Prerequisite",
                "level": "Foundational"
            })

            if is_completed:
                status = "COMPLETED"
            elif len(missing_prereqs) == 0:
                status = "READY"
            else:
                status = "BLOCKED"

            item = {
                "id": skill["id"],
                "name": skill["name"],
                "category": skill["category"],
                "description": skill["description"],
                "estimatedHours": skill["estimatedHours"],
                "difficulty": skill["difficulty"],
                "importance": meta["importance"],
                "requiredLevel": meta["level"],
                "isCoreRequirement": s_id in role_skill_ids,
                "status": status,
                "prerequisites": [
                    {
                        "id": p,
                        "name": self.skills.get(p, {}).get("name", p),
                        "completed": p in completed_set
                    }
                    for p in prereqs
                ],
                "missingPrerequisites": [
                    {
                        "id": p,
                        "name": self.skills.get(p, {}).get("name", p)
                    }
                    for p in missing_prereqs
                ]
            }

            skills_detail.append(item)
            if status == "COMPLETED":
                completed_skills.append(item)
            elif status == "READY":
                ready_to_learn.append(item)
            else:
                blocked_skills.append(item)

        # Scored Readiness Calculation
        # Core skills have weight 3, Recommended 2, Prerequisite 1.5, Elective 1
        weights = {"Core": 3.0, "Recommended": 2.0, "Prerequisite": 1.5, "Elective": 1.0}
        total_weight = 0.0
        earned_weight = 0.0

        for item in skills_detail:
            w = weights.get(item["importance"], 1.0)
            total_weight += w
            if item["status"] == "COMPLETED":
                earned_weight += w

        readiness_pct = round((earned_weight / total_weight * 100), 1) if total_weight > 0 else 0.0

        # Hours remaining
        hours_remaining = sum(
            item["estimatedHours"] for item in skills_detail if item["status"] != "COMPLETED"
        )

        return {
            "role": role,
            "readinessScore": readiness_pct,
            "totalSkillsCount": len(skills_detail),
            "completedCount": len(completed_skills),
            "readyCount": len(ready_to_learn),
            "blockedCount": len(blocked_skills),
            "estimatedHoursRemaining": hours_remaining,
            "skills": skills_detail,
            "readyToLearn": ready_to_learn,
            "blockedSkills": blocked_skills,
            "completedSkills": completed_skills
        }

    def generate_roadmap(self, role_id: str, completed_skill_ids: List[str]) -> Dict[str, Any]:
        """Generate a phased learning roadmap and graph visualization data."""
        gaps = self.calculate_skill_gaps(role_id, completed_skill_ids)
        skills = gaps["skills"]

        # Group into 3 pedagogical phases:
        # Phase 1: Foundational Prerequisites & Core Tools (Beginner difficulty or Fundamentals)
        # Phase 2: Role Core Competencies (Intermediate / Core importance)
        # Phase 3: Advanced Architectures & Production Scaling (Advanced difficulty or Systems)
        phase_1 = []
        phase_2 = []
        phase_3 = []

        assigned_phase = {}
        buckets = [phase_1, phase_2, phase_3]
        for s in skills:
            diff = s["difficulty"].lower()
            cat = s["category"].lower()
            preferred = 0 if diff == "beginner" or "fundamentals" in cat else 2 if diff == "advanced" or "distributed" in cat else 1
            phase = max([preferred] + [assigned_phase[p["id"]] for p in s["prerequisites"] if p["id"] in assigned_phase])
            assigned_phase[s["id"]] = phase
            buckets[phase].append(s)

        # Build Graph Visualization Nodes and Edges
        nodes = []
        edges = []

        for s in skills:
            nodes.append({
                "id": s["id"],
                "label": s["name"],
                "category": s["category"],
                "difficulty": s["difficulty"],
                "status": s["status"],
                "importance": s["importance"],
                "hours": s["estimatedHours"],
                "isCore": s["isCoreRequirement"]
            })

            for p in s["prerequisites"]:
                # Edge: p -> s (p must be learned before s)
                edges.append({
                    "id": f"{p['id']}->{s['id']}",
                    "source": p["id"],
                    "target": s["id"],
                    "type": "DEPENDS_ON",
                    "sourceCompleted": p["completed"],
                    "targetStatus": s["status"]
                })

        return {
            "role": gaps["role"],
            "readinessScore": gaps["readinessScore"],
            "totalHours": gaps["estimatedHoursRemaining"],
            "phases": [
                {
                    "phaseNumber": 1,
                    "title": "Phase 1: Foundational Prerequisites & Tooling",
                    "description": "Master core computational foundations, languages, and baseline infrastructure.",
                    "skills": phase_1
                },
                {
                    "phaseNumber": 2,
                    "title": "Phase 2: Core Engineering & Frameworks",
                    "description": "Build high-velocity applications using essential production frameworks and databases.",
                    "skills": phase_2
                },
                {
                    "phaseNumber": 3,
                    "title": "Phase 3: Advanced Architectures & Scalability",
                    "description": "Engineer resilient distributed systems, declarative infrastructure, and AI platform scale.",
                    "skills": phase_3
                }
            ],
            "graph": {
                "nodes": nodes,
                "edges": edges
            }
        }

    def get_resources(self, skill_id: Optional[str] = None, is_free: Optional[bool] = None) -> List[Dict[str, Any]]:
        """Filter curated learning resources."""
        results = []
        for r in self.resources:
            if skill_id and r["skillId"] != skill_id:
                continue
            if is_free is not None and r["is_free"] != is_free:
                continue
            # Enrich with skill name
            skill = self.skills.get(r["skillId"])
            enriched = dict(r)
            enriched["skillName"] = skill["name"] if skill else r["skillId"]
            enriched["skillCategory"] = skill["category"] if skill else "General"
            results.append(enriched)
        return results

memory_store = MemoryGraphStore()
