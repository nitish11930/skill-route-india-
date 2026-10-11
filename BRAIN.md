# SkillRoute India — working context

## State, 11 October 2026
Working local hackathon core implemented and verified. Exact hackathon Neo4j product rubric requirements are PENDING from user, never officially verified. Live service credentials are not configured; demo mode is explicit.

## Architecture and files
- Original Stitch export: `stitch_skillroute_india_ai_career_navigator/` — preserved.
- React 19 + TypeScript + Vite + Tailwind 4: `frontend/`.
- Python 3.9-compatible FastAPI: `backend/app/`.
- Neo4j graph schema: Role REQUIRES Skill, Skill DEPENDS_ON Skill, Resource TEACHES Skill.
- Graph service retrieves actual Neo4j catalog and relationships for live results. Python performs closure/topological sorting and readiness. Empty/offline/cyclic remote data falls back with a truthful source label.
- Gemini uses REST with key header, explicit model and 10-second timeout. Configured is not verified; actual generation success sets verified state. Fallback is deterministic.
- Local single-user profile persisted atomically in `backend/app/data/user_profile.json`; no multi-user authentication/deployment yet.

## Working flows
Onboarding (all 26 skills), five target roles, scored gaps, dependency graph, phase-ordered roadmap, progress/undo, curated resources and Markdown-rendered graph-grounded coaching. Six secondary labs are prototypes. Salary/demand and sample credentials/mentors are illustrative.

## Commands
- `./start.sh` → frontend 5173, backend 8000.
- `./start.sh --preview` → production build plus single-process demo at 8001.
- `backend/.venv/bin/python -m pytest -q backend/tests`.
- `npm run build --prefix frontend`.
- `npm audit --prefix frontend`.
- Explicit remote graph seed only: `backend/.venv/bin/python -m backend.seed_cli --force`.
- Read-only connection/schema check: `backend/.venv/bin/python -m backend.seed_cli --verify`.

## Verified evidence
- 19 backend tests pass, isolated from real profile and live services.
- TypeScript + production build pass.
- Dependency audit: zero reported vulnerabilities.
- Browser: skill completion changed readiness 33.8% → 38.5%; undo restored it. AI/ML role switching recalculated to 17.9%. Calibration save succeeded. Coach returned prerequisite evidence with demo label. Desktop and narrow navigation checked.
- Core API and preview are running locally. Final single-process demo URL: http://127.0.0.1:8001. Frontend and API are served together.

## Remaining user inputs
1. Actual hackathon rubric and names of mandatory Neo4j products.
2. Set six credential/model variables in root `.env` locally. Do not put secrets in chat. The existing template contains an obsolete model name; choose an available model when adding the real key.
3. Then restart backend, explicitly seed the intended database, test real retrieval and Gemini generation, and record results. Do not claim this has already succeeded.

## Review rules
Read this file first; avoid rereading the whole project. Preserve reviewed graph-source labeling, deterministic ordering, input validation, atomic persistence and isolated tests. Never overwrite `.env`, leak credentials, silently seed remotely, or execute LLM-generated Cypher. Update this context only with actual results.
