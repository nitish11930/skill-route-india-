"""Neo4j AuraDB client and connection management.

Strict security rules implemented:
1. Parameterized Cypher queries only ($param). Never string concatenation.
2. Never silently seed on application startup / page load.
3. Secrets are never printed or returned in error traces.
4. Schema constraints for uniqueness and indexing.
"""

import logging
from typing import Any, Dict, List, Optional
from neo4j import GraphDatabase, Driver, Session
from backend.app.config import settings
from backend.app.db.seed_data import ROLES, SKILLS, DEPENDENCIES, ROLE_REQUIREMENTS, RESOURCES

logger = logging.getLogger("skillroute.neo4j")

class Neo4jClient:
    def __init__(self):
        self._driver: Optional[Driver] = None

    def get_driver(self) -> Optional[Driver]:
        if not settings.has_neo4j_config:
            return None
        if self._driver is None:
            try:
                self._driver = GraphDatabase.driver(
                    settings.neo4j_uri,
                    auth=(settings.neo4j_username, settings.neo4j_password),
                    max_connection_lifetime=30 * 60,
                    max_connection_pool_size=50,
                    connection_acquisition_timeout=5.0,
                    connection_timeout=5.0,
                    max_transaction_retry_time=5.0
                )
            except Exception as e:
                logger.warning(f"Could not initialize Neo4j driver: {type(e).__name__}")
                self._driver = None
        return self._driver

    def close(self):
        if self._driver:
            self._driver.close()
            self._driver = None

    def get_session(self, driver: Driver) -> Session:
        """Create a Neo4j session compatible with both local and AuraDB instance default routing."""
        if settings.neo4j_database and settings.neo4j_database.lower() != "neo4j":
            try:
                return driver.session(database=settings.neo4j_database)
            except Exception:
                return driver.session()
        return driver.session()

    def check_health(self) -> Dict[str, Any]:
        """Perform a live connectivity verification."""
        if not settings.has_neo4j_config:
            return {
                "connected": False,
                "status": "unconfigured",
                "message": "Neo4j credentials not configured. Running in Demo Mode.",
                "uri": "none"
            }
        driver = self.get_driver()
        if not driver:
            return {
                "connected": False,
                "status": "driver_init_failed",
                "message": "Failed to create Neo4j driver instance.",
                "uri": settings.masked_neo4j_uri()
            }
        try:
            driver.verify_connectivity()
            # Run quick lightweight ping using resilient session
            with self.get_session(driver) as session:
                result = session.run("RETURN 1 AS ping")
                record = result.single()
                if record and record["ping"] == 1:
                    return {
                        "connected": True,
                        "status": "healthy",
                        "message": "Connected to Neo4j AuraDB instance.",
                        "uri": settings.masked_neo4j_uri(),
                        "database": settings.neo4j_database
                    }
            return {
                "connected": False,
                "status": "query_failed",
                "message": "Ping query failed.",
                "uri": settings.masked_neo4j_uri()
            }
        except Exception as e:
            logger.warning(f"Neo4j health check failed: {type(e).__name__}")
            return {
                "connected": False,
                "status": "error",
                "message": f"Connection error: {type(e).__name__}",
                "uri": settings.masked_neo4j_uri()
            }

    def execute_read(self, cypher: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Execute a parameterized read query."""
        driver = self.get_driver()
        if not driver:
            raise ConnectionError("Neo4j driver not connected")
        with self.get_session(driver) as session:
            result = session.run(cypher, parameters or {})
            return [record.data() for record in result]

    def execute_write(self, cypher: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Execute a parameterized write query."""
        driver = self.get_driver()
        if not driver:
            raise ConnectionError("Neo4j driver not connected")
        with self.get_session(driver) as session:
            result = session.run(cypher, parameters or {})
            return [record.data() for record in result]

    def create_constraints(self) -> List[str]:
        """Apply idempotent schema uniqueness constraints."""
        constraints = [
            "CREATE CONSTRAINT role_id_unique IF NOT EXISTS FOR (r:Role) REQUIRE r.id IS UNIQUE",
            "CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE",
            "CREATE CONSTRAINT resource_id_unique IF NOT EXISTS FOR (res:Resource) REQUIRE res.id IS UNIQUE"
        ]
        applied = []
        for c in constraints:
            self.execute_write(c)
            applied.append(c)
        return applied

    def seed_database_idempotent(self) -> Dict[str, int]:
        """Idempotently seed Roles, Skills, Dependencies, and Resources using MERGE.

        This is strictly triggered by CLI or admin request, NEVER on page load.
        """
        self.create_constraints()

        # 1. Seed Roles
        role_cypher = """
        UNWIND $roles AS r
        MERGE (role:Role {id: r.id})
        ON CREATE SET
            role.title = r.title,
            role.category = r.category,
            role.summary = r.summary,
            role.marketDemand = r.marketDemand,
            role.typicalExperience = r.typicalExperience,
            role.tier = r.tier,
            role.hubFocus = r.hubFocus,
            role.targetCtcRange = r.targetCtcRange
        ON MATCH SET
            role.title = r.title,
            role.category = r.category,
            role.summary = r.summary,
            role.marketDemand = r.marketDemand,
            role.typicalExperience = r.typicalExperience,
            role.tier = r.tier,
            role.hubFocus = r.hubFocus,
            role.targetCtcRange = r.targetCtcRange
        """
        self.execute_write(role_cypher, {"roles": ROLES})

        # 2. Seed Skills
        skill_cypher = """
        UNWIND $skills AS s
        MERGE (skill:Skill {id: s.id})
        ON CREATE SET
            skill.name = s.name,
            skill.category = s.category,
            skill.description = s.description,
            skill.estimatedHours = s.estimatedHours,
            skill.difficulty = s.difficulty
        ON MATCH SET
            skill.name = s.name,
            skill.category = s.category,
            skill.description = s.description,
            skill.estimatedHours = s.estimatedHours,
            skill.difficulty = s.difficulty
        """
        self.execute_write(skill_cypher, {"skills": SKILLS})

        # 3. Seed Prerequisite Dependencies (Skill DEPENDS_ON Skill)
        dep_cypher = """
        UNWIND $deps AS d
        MATCH (child:Skill {id: d.child})
        MATCH (parent:Skill {id: d.parent})
        MERGE (child)-[rel:DEPENDS_ON]->(parent)
        ON CREATE SET rel.strictness = 'Required'
        """
        dep_data = [{"child": c, "parent": p} for c, p in DEPENDENCIES]
        self.execute_write(dep_cypher, {"deps": dep_data})

        # 4. Seed Role Requirements (Role REQUIRES Skill)
        req_cypher = """
        UNWIND $reqs AS r
        MATCH (role:Role {id: r.roleId})
        MATCH (skill:Skill {id: r.skillId})
        MERGE (role)-[rel:REQUIRES]->(skill)
        ON CREATE SET rel.importance = r.importance, rel.level = r.level
        ON MATCH SET rel.importance = r.importance, rel.level = r.level
        """
        req_data = [
            {"roleId": r_id, "skillId": s_id, "importance": imp, "level": lvl}
            for r_id, s_id, imp, lvl in ROLE_REQUIREMENTS
        ]
        self.execute_write(req_cypher, {"reqs": req_data})

        # 5. Seed Resources and TEACHES relationship
        res_cypher = """
        UNWIND $resources AS res
        MERGE (r:Resource {id: res.id})
        ON CREATE SET
            r.title = res.title,
            r.url = res.url,
            r.provider = res.provider,
            r.type = res.type,
            r.is_free = res.is_free,
            r.duration = res.duration,
            r.level = res.level
        ON MATCH SET
            r.title = res.title,
            r.url = res.url,
            r.provider = res.provider,
            r.type = res.type,
            r.is_free = res.is_free,
            r.duration = res.duration,
            r.level = res.level
        WITH r, res
        MATCH (s:Skill {id: res.skillId})
        MERGE (r)-[t:TEACHES]->(s)
        ON CREATE SET t.level = res.level
        """
        self.execute_write(res_cypher, {"resources": RESOURCES})

        return {
            "roles_seeded": len(ROLES),
            "skills_seeded": len(SKILLS),
            "dependencies_seeded": len(DEPENDENCIES),
            "role_requirements_seeded": len(ROLE_REQUIREMENTS),
            "resources_seeded": len(RESOURCES)
        }

neo4j_client = Neo4jClient()
