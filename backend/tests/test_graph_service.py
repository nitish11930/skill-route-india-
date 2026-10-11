"""Unit tests for Graph Engine traversal, topological sorting, and gap analysis."""

import pytest
from backend.app.db.memory_store import memory_store

def test_prerequisite_transitive_closure():
    """Verify that transitive prerequisites are correctly traced."""
    # kubernetes-k8s depends on docker-containers, which depends on linux-shell
    prereqs = memory_store.get_transitive_prerequisites("kubernetes-k8s")
    assert "docker-containers" in prereqs
    assert "linux-shell" in prereqs

def test_topological_sort_respects_dependencies():
    """Ensure foundational skills appear strictly before dependent skills."""
    skills = ["kubernetes-k8s", "linux-shell", "docker-containers", "python-prog", "fastapi-async"]
    sorted_skills = memory_store.topological_sort(skills)

    # linux-shell must precede docker-containers
    assert sorted_skills.index("linux-shell") < sorted_skills.index("docker-containers")
    # docker-containers must precede kubernetes-k8s
    assert sorted_skills.index("docker-containers") < sorted_skills.index("kubernetes-k8s")
    # python-prog must precede fastapi-async
    assert sorted_skills.index("python-prog") < sorted_skills.index("fastapi-async")

def test_skill_gap_calculation_and_readiness_scoring():
    """Verify readiness score increases and blocked skills become ready as prerequisites are completed."""
    role_id = "fullstack-swe"

    # Initial state: no completed skills
    gaps_initial = memory_store.calculate_skill_gaps(role_id, [])
    assert gaps_initial["readinessScore"] == 0.0
    assert gaps_initial["completedCount"] == 0
    # web-foundations, js-ts, python-prog, git-vcs should be READY because they have 0 prerequisites
    ready_ids = [s["id"] for s in gaps_initial["readyToLearn"]]
    assert "web-foundations" in ready_ids
    assert "js-ts" in ready_ids
    assert "python-prog" in ready_ids

    # react-ecosystem depends on js-ts and web-foundations, so it should initially be BLOCKED
    blocked_ids = [s["id"] for s in gaps_initial["blockedSkills"]]
    assert "react-ecosystem" in blocked_ids

    # Now simulate user completing web-foundations and js-ts
    gaps_after = memory_store.calculate_skill_gaps(role_id, ["web-foundations", "js-ts"])
    assert gaps_after["readinessScore"] > 0.0
    assert gaps_after["completedCount"] >= 2

    # Now react-ecosystem's prerequisites are satisfied -> should transition to READY!
    new_ready_ids = [s["id"] for s in gaps_after["readyToLearn"]]
    assert "react-ecosystem" in new_ready_ids

def test_phased_roadmap_generation():
    """Verify roadmap organizes skills into 3 pedagogical phases."""
    roadmap = memory_store.generate_roadmap("fullstack-swe", ["js-ts"])
    assert len(roadmap["phases"]) == 3
    assert roadmap["phases"][0]["phaseNumber"] == 1
    assert roadmap["phases"][1]["phaseNumber"] == 2
    assert roadmap["phases"][2]["phaseNumber"] == 3

    # Graph visualization payload should have nodes and edges
    assert len(roadmap["graph"]["nodes"]) > 0
    assert len(roadmap["graph"]["edges"]) > 0
