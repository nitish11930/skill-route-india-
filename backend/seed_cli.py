"""Standalone Idempotent Seed CLI for Neo4j AuraDB.

Usage:
    python -m backend.seed_cli
    python -m backend.seed_cli --force
    python -m backend.seed_cli --verify

This script MUST be run explicitly. Seeding is never performed silently on application startup.
"""

import sys
import argparse
from backend.app.config import settings
from backend.app.db.neo4j_client import neo4j_client

def main():
    parser = argparse.ArgumentParser(
        description="SkillRoute India - Explicit Idempotent Neo4j Graph Seeder"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Execute idempotent seeding against configured Neo4j instance"
    )
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Read connection and existing schema constraints without writes"
    )
    args = parser.parse_args()

    print("=" * 60)
    print("SkillRoute India - Neo4j Graph CLI")
    print("=" * 60)

    if not settings.has_neo4j_config:
        print("❌ Error: Neo4j credentials are not configured in .env.")
        print("Please configure NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in .env")
        print("Current target URI:", settings.masked_neo4j_uri())
        sys.exit(1)

    print(f"Connecting to: {settings.masked_neo4j_uri()} (database: {settings.neo4j_database})")
    health = neo4j_client.check_health()

    if not health.get("connected"):
        print(f"❌ Connection check failed: {health.get('message')}")
        sys.exit(1)

    print(" Connected successfully to Neo4j AuraDB.")

    if args.verify:
        print("\nVerifying constraints...")
        try:
            constraints = neo4j_client.execute_read("SHOW CONSTRAINTS YIELD name RETURN name")
            print(f" Found {len(constraints)} existing constraints.")
            print("Verification passed.")
        except Exception as e:
            print(f"❌ Constraint verification failed: {type(e).__name__}")
            sys.exit(1)
        sys.exit(0)

    print("\nExecuting idempotent graph seed...")
    try:
        stats = neo4j_client.seed_database_idempotent()
        print("✨ Database seed completed successfully!")
        print(f"  • Roles:             {stats['roles_seeded']}")
        print(f"  • Skills:            {stats['skills_seeded']}")
        print(f"  • Dependencies:      {stats['dependencies_seeded']}")
        print(f"  • Role Requirements: {stats['role_requirements_seeded']}")
        print(f"  • Curated Resources: {stats['resources_seeded']}")
        print("\nGraph ready for Cypher traversals.")
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
