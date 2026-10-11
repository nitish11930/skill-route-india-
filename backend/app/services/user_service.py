"""User profile and calibration persistence service.

Maintains:
- Current selected target role
- Set of completed / acquired skill IDs
- Experience level and preferences
Persisted locally to ensure state persists across page reloads.
"""

import json
import os
import tempfile
from copy import deepcopy
from datetime import datetime, timezone
from threading import RLock
from pathlib import Path
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PROFILE_FILE = DATA_DIR / "user_profile.json"

DEFAULT_PROFILE = {
    "name": "Aarav Sharma",
    "targetRoleId": "fullstack-swe",
    "experienceYears": 1,
    "currentTitle": "Junior Frontend Developer",
    "completedSkillIds": [
        "web-foundations",
        "js-ts",
        "git-vcs"
    ],
    "targetLocation": "Bengaluru / Remote",
    "targetSalary": "₹16,00,000",
    "learningPaceHoursPerWeek": 12,
    "updatedAt": "2026-10-11T12:00:00Z"
}

class UserProfileUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    targetRoleId: Optional[str] = Field(default=None, max_length=100)
    experienceYears: Optional[int] = Field(default=None, ge=0, le=40)
    currentTitle: Optional[str] = Field(default=None, max_length=150)
    completedSkillIds: Optional[List[str]] = Field(default=None, max_length=200)
    targetLocation: Optional[str] = Field(default=None, max_length=150)
    targetSalary: Optional[str] = Field(default=None, max_length=100)
    learningPaceHoursPerWeek: Optional[int] = Field(default=None, ge=1, le=80)

class UserService:
    def __init__(self):
        self._lock = RLock()
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        if not PROFILE_FILE.exists():
            self._save(DEFAULT_PROFILE)

    def _load(self) -> Dict[str, Any]:
        try:
            if PROFILE_FILE.exists():
                with open(PROFILE_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception:
            pass
        return deepcopy(DEFAULT_PROFILE)

    def _save(self, data: Dict[str, Any]) -> None:
        PROFILE_FILE.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=PROFILE_FILE.parent, delete=False) as temporary:
                temporary_path = temporary.name
                json.dump(data, temporary, indent=2)
                temporary.flush()
                os.fsync(temporary.fileno())
            os.replace(temporary_path, PROFILE_FILE)
        finally:
            if temporary_path and os.path.exists(temporary_path):
                os.unlink(temporary_path)

    def get_profile(self) -> Dict[str, Any]:
        return self._load()

    def update_profile(self, update: UserProfileUpdate) -> Dict[str, Any]:
        from backend.app.services.graph_service import graph_service
        changes = update.model_dump(exclude_unset=True, exclude_none=True)
        if "targetRoleId" in changes and not graph_service.get_role_detail(changes["targetRoleId"]).get("role"):
            raise ValueError("Unknown target role")
        if "completedSkillIds" in changes:
            catalog = {s["id"] for s in graph_service.get_skills()["skills"]}
            if set(changes["completedSkillIds"]) - catalog:
                raise ValueError("Unknown skill in profile")
            changes["completedSkillIds"] = sorted(set(changes["completedSkillIds"]))
        with self._lock:
            profile = self._load()
            profile.update(changes)
            profile["updatedAt"] = datetime.now(timezone.utc).isoformat()
            self._save(profile)
            return profile

    def toggle_skill(self, skill_id: str) -> Dict[str, Any]:
        from backend.app.services.graph_service import graph_service
        if skill_id not in {s["id"] for s in graph_service.get_skills()["skills"]}:
            raise ValueError("Unknown skill")
        with self._lock:
            profile = self._load()
            skills = set(profile.get("completedSkillIds", []))
            added = skill_id not in skills
            if added:
                skills.add(skill_id)
            else:
                skills.remove(skill_id)
            profile["completedSkillIds"] = sorted(skills)
            profile["updatedAt"] = datetime.now(timezone.utc).isoformat()
            self._save(profile)
            return {"skillId": skill_id, "completed": added, "completedSkillIds": profile["completedSkillIds"]}

    def reset_profile(self) -> Dict[str, Any]:
        with self._lock:
            self._save(deepcopy(DEFAULT_PROFILE))
            return deepcopy(DEFAULT_PROFILE)

user_service = UserService()
