"""Grounded Gemini Career Coach Service for SkillRoute India.

Implementation Guidelines:
1. Direct Gemini v1beta REST API via httpx (100% Python 3.9 compatible, no deprecated SDKs).
2. Explicit GEMINI_MODEL configuration required. Missing GEMINI_MODEL returns 'not-configured' without guessing or default assumptions.
3. Grounded with graph evidence: target role requirements, completed skills,
   ready skills, and blocking prerequisites extracted directly from the graph engine.
4. Strict 10-second timeout on remote REST calls.
5. NEVER executes LLM-generated Cypher queries. Gemini operates solely as an advisory career coach.
6. Honest fallback mode when GEMINI_API_KEY or GEMINI_MODEL is not configured.
"""

import asyncio
import logging
import re
from typing import Any, Dict, List, Optional
import httpx
from pydantic import BaseModel, Field
from backend.app.config import settings
from backend.app.services.graph_service import graph_service
from backend.app.services.user_service import user_service

logger = logging.getLogger("skillroute.gemini")

class CoachChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User question or goal")
    roleId: Optional[str] = Field(default=None, description="Optional target role override")
    contextQuery: Optional[str] = Field(default=None, description="Contextual question type")

class CoachChatResponse(BaseModel):
    response: str
    isDemoMode: bool
    groundedEvidence: Dict[str, Any]
    modelUsed: str

def sanitize_input(text: str) -> str:
    """Sanitize user text input against control characters and excess whitespace."""
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
    return cleaned.strip()

class GeminiCoachService:
    def __init__(self):
        self._verified: bool = False

    def check_health(self) -> Dict[str, Any]:
        """Health check for Gemini API credentials and model configuration."""
        configured_model = settings.gemini_model.strip() if settings.gemini_model.strip() else "not-configured"
        has_key = bool(settings.gemini_api_key.strip())
        has_model = bool(settings.gemini_model.strip())

        if not (has_key and has_model):
            missing_parts = []
            if not has_key:
                missing_parts.append("GEMINI_API_KEY")
            if not has_model:
                missing_parts.append("GEMINI_MODEL")
            return {
                "connected": False,
                "status": "not-configured",
                "message": f"Missing configuration: {', '.join(missing_parts)}. Running in grounded offline coaching mode.",
                "model": configured_model
            }

        if not self._verified:
            return {
                "connected": False,
                "status": "configured_unverified",
                "message": f"Credentials configured for model {configured_model}, awaiting live verification.",
                "model": configured_model
            }

        return {
            "connected": True,
            "status": "verified",
            "message": f"Gemini REST verified for model: {configured_model}",
            "model": configured_model
        }

    async def get_coaching_response(self, request: CoachChatRequest) -> CoachChatResponse:
        """Provide career coaching grounded strictly in graph evidence."""
        user_msg = sanitize_input(request.message)
        if not user_msg:
            user_msg = "What should I focus on learning next?"

        # 1. Fetch user profile and target role
        profile = user_service.get_profile()
        target_role_id = request.roleId or profile.get("targetRoleId", "fullstack-swe")
        completed_skills = profile.get("completedSkillIds", [])

        # 2. Extract genuine Graph Evidence
        gaps = graph_service.get_skill_gaps(target_role_id, completed_skills)
        role_info = gaps["role"]
        readiness_score = gaps["readinessScore"]
        ready_skills = [s["name"] for s in gaps["readyToLearn"][:4]]
        blocked_skills = [
            f"{s['name']} (Blocked by: {', '.join(p['name'] for p in s['missingPrerequisites'])})"
            for s in gaps["blockedSkills"][:4]
        ]
        completed_names = [s["name"] for s in gaps["completedSkills"]]

        # 3. Fetch curated resources for top ready skill
        recommended_resources = []
        if gaps["readyToLearn"]:
            top_skill_id = gaps["readyToLearn"][0]["id"]
            res_data = graph_service.get_resources(skill_id=top_skill_id)
            recommended_resources = [
                f"{r['title']} ({r['provider']}, {r.get('duration', 'Self-paced')})"
                for r in res_data.get("resources", [])[:2]
            ]

        grounded_evidence = {
            "targetRole": role_info["title"],
            "category": role_info["category"],
            "readinessScore": f"{readiness_score}%",
            "marketDemand": role_info.get("marketDemand", "High"),
            "targetCtcRange": role_info.get("targetCtcRange", "Market Standard"),
            "completedSkillsCount": len(completed_names),
            "completedSkills": completed_names,
            "readyToLearn": ready_skills,
            "blockedSkills": blocked_skills,
            "recommendedResources": recommended_resources
        }

        # 4. Attempt direct Gemini REST call if both GEMINI_API_KEY and GEMINI_MODEL are configured
        if settings.has_gemini_config:
            try:
                system_prompt = f"""You are Lumina, SkillRoute India's elite AI Career Coach & GCC Talent Navigation Advisor.
You give actionable, empowering, and pragmatic technical advice for engineers in India's top product and GCC ecosystem.

CRITICAL GROUNDING DIRECTIVES:
- You must ground all recommendations in the following Graph Evidence from the SkillRoute Knowledge Graph:
  * Target Role: {grounded_evidence['targetRole']} ({grounded_evidence['category']})
  * User Readiness Score: {grounded_evidence['readinessScore']}
  * User Acquired Skills: {', '.join(grounded_evidence['completedSkills']) if grounded_evidence['completedSkills'] else 'None marked yet'}
  * Ready to Learn Now (Prerequisites satisfied): {', '.join(grounded_evidence['readyToLearn']) if grounded_evidence['readyToLearn'] else 'All core skills mastered'}
  * Blocked Skills (Prerequisites missing): {'; '.join(grounded_evidence['blockedSkills']) if grounded_evidence['blockedSkills'] else 'None'}
  * Target Salary Benchmark: {grounded_evidence['targetCtcRange']} in major tech hubs ({role_info.get('hubFocus', 'India')})

RULES:
1. Explain WHY foundational skills must precede advanced ones using the prerequisite relationships above.
2. Prioritize skills in the 'Ready to Learn Now' list first.
3. Keep response concise, structured with bullet points, high-impact, and directly addressing the user query.
4. NEVER invent dependencies or hallucinate facts contrary to the Graph Evidence.
5. NEVER generate Cypher queries or database commands."""

                api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
                payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [{"text": user_msg}]
                        }
                    ],
                    "systemInstruction": {
                        "parts": [{"text": system_prompt}]
                    },
                    "generationConfig": {
                        "temperature": 0.4,
                        "maxOutputTokens": 800
                    }
                }

                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(
                        api_url,
                        params={"key": settings.gemini_api_key},
                        json=payload,
                        headers={"Content-Type": "application/json"}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                generated_text = parts[0].get("text", "").strip()
                                if generated_text:
                                    self._verified = True
                                    return CoachChatResponse(
                                        response=generated_text,
                                        isDemoMode=False,
                                        groundedEvidence=grounded_evidence,
                                        modelUsed=settings.gemini_model
                                    )
                    else:
                        logger.warning(f"Gemini REST returned HTTP {resp.status_code}: {resp.text[:200]}")
            except httpx.TimeoutException:
                logger.warning("Gemini REST call timed out after 10s. Using grounded fallback.")
            except Exception as e:
                logger.warning(f"Gemini REST invocation error ({type(e).__name__}): {e}. Using grounded fallback.")

        # 5. Deterministic Grounded Coaching Fallback (Demo Mode)
        fallback_text = self._build_grounded_fallback_response(
            user_msg, grounded_evidence, role_info
        )

        configured_model = settings.gemini_model.strip() if settings.gemini_model.strip() else "not-configured"

        return CoachChatResponse(
            response=fallback_text,
            isDemoMode=True,
            groundedEvidence=grounded_evidence,
            modelUsed=f"grounded-graph-coach (Model status: {configured_model})"
        )

    def _build_grounded_fallback_response(
        self,
        query: str,
        evidence: Dict[str, Any],
        role_info: Dict[str, Any]
    ) -> str:
        """Construct a high-quality, grounded coaching response from graph data."""
        role_title = evidence["targetRole"]
        readiness = evidence["readinessScore"]
        ready_list = evidence["readyToLearn"]
        blocked_list = evidence["blockedSkills"]
        ctc = evidence["targetCtcRange"]
        resources = evidence["recommendedResources"]

        lines = [
            f"### 🎯 Strategic Guidance: {role_title}",
            f"**Current Graph Readiness:** `{readiness}` | **Target CTC Benchmark:** `{ctc}`\n",
            "Based on the **SkillRoute India Prerequisite Graph**, here is your optimized sequence:\n"
        ]

        if ready_list:
            lines.append("#### 🚀 Immediate Next Actions (Prerequisites Complete)")
            for r in ready_list:
                lines.append(f"- **{r}**: Your prerequisite dependencies are cleared. Focus on practical projects here.")
            lines.append("")

        if blocked_list:
            lines.append("#### ⚠️ Upstream Prerequisite Blockers")
            lines.append("These high-value skills require prior foundations before tackling:")
            for b in blocked_list:
                lines.append(f"- {b}")
            lines.append("")

        if resources:
            lines.append("#### 📚 Recommended Curated Resources")
            for res in resources:
                lines.append(f"- {res}")
            lines.append("")

        lines.append(
            "💡 *Pro-tip for Indian GCCs & Product Startups:* "
            "Interview panels evaluate foundational mastery (Data Structures, System Protocols, Git) "
            "before advanced framework capabilities. Clear your Phase 1 prerequisites first."
        )

        model_note = settings.gemini_model if settings.gemini_model.strip() else "not-configured"
        lines.append(
            f"\n> ℹ️ *SkillRoute Demo Mode:* This recommendation is strictly grounded in graph evidence. "
            f"Configure `GEMINI_API_KEY` and `GEMINI_MODEL` (currently `{model_note}`) in `.env` for dynamic conversational generation."
        )

        return "\n".join(lines)

gemini_coach = GeminiCoachService()
