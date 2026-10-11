# SkillRoute India

A career learning navigator built from the supplied Stitch Lumina screens: React/TypeScript + Vite + Tailwind, Python/FastAPI, Neo4j AuraDB and Gemini REST.

## Current delivery

Working core: career calibration, five target roles, skill-gap scoring, prerequisite graph exploration, dependency-ordered learning phases, curated resource filters, persistent skill completion and graph-grounded coaching. Six secondary labs are clearly labeled prototypes. They do not represent live recruitment, verified credentials, real mentors or verified salary data.

Exact hackathon Neo4j product rubric requirements are PENDING from user, never officially verified. Live Neo4j/Gemini tests are pending local credentials; the current demo is explicitly offline. Salary/demand figures are sample estimates, and readiness uses self-reported skill completion.

## Run locally

Requires Node 20.20+ and Python 3.9+.

```sh
./start.sh
```

Open http://127.0.0.1:5173. Keep the terminal open. Stop with Ctrl+C. If ports are already occupied by this demo, use those existing servers rather than starting duplicates.

For a single-process built demo (frontend and API on the same origin):

```sh
./start.sh --preview
```

Open http://127.0.0.1:8001. This builds the frontend first and serves it with Python.

Manual backend:

```sh
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
backend/.venv/bin/python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

Manual frontend:

```sh
cd frontend
npm ci
npm run dev
```

`npm run build` performs TypeScript validation and produces `frontend/dist`. `npm run preview` proxies the API to the local backend. The frontend must not run without its backend.

## Configure live services

Preserve the existing root `.env`; set these six values locally. Never paste secrets into chat, browser code or screenshots.

```dotenv
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=
NEO4J_DATABASE=neo4j
GEMINI_API_KEY=
GEMINI_MODEL=
```

Choose a model available to your Gemini account. Do not use the old retired model name from an earlier template. Restart backend after changing `.env`.

Neo4j graph seed is an explicit action:

```sh
backend/.venv/bin/python -m backend.seed_cli --help
backend/.venv/bin/python -m backend.seed_cli --force
```

The seed adds/updates this application's catalog with MERGE and uniqueness constraints. It does not delete the database. Review the target database first. Loading pages never seeds a remote database.

`GET /api/health` checks Neo4j connectivity. A configured Gemini key is reported as unverified until an actual coach generation succeeds. Test with the AI Career Coach, then check health again. Missing/unavailable/empty remote graph returns the labeled seed demo.

## Why a graph

`Role -[:REQUIRES]-> Skill`, `Skill -[:DEPENDS_ON]-> Skill`, `Resource -[:TEACHES]-> Skill`. Live recommendations use properties and relationships retrieved from Neo4j, with parameterized Cypher prerequisite-path evidence. Python computes transitive closure, deterministic topological ordering, readiness and phases from that retrieved graph. Cycles cause a labeled fallback rather than an invalid learning sequence. Demo mode uses the same algorithm on sample data.

Gemini receives graph evidence through the backend and a bounded user question. Keys are sent in request headers. There is a 10-second request timeout. No generated Cypher is executed. Responses include evidence and mode labels; fallback coaching is deterministic.

## Validation

```sh
backend/.venv/bin/python -m pytest -q backend/tests
npm run build --prefix frontend
npm audit --prefix frontend
```

Backend tests isolate local profile files and disable real service calls. They cover traversal, phase order, readiness updates, persistence, API validation, remote graph provenance, unavailable service labeling and configured-versus-verified Gemini status. Frontend verification includes TypeScript/build and manual browser flows. There is no claimed frontend automated test suite.

Local profile is `backend/app/data/user_profile.json`, atomically written and ignored by Git. This is a single-user hackathon demo; multi-user authentication and deployment are not implemented. All original Stitch exports remain untouched. See BRAIN.md for current status and AGENTS.md for engineering rules.

Primary API references: [Neo4j Python driver](https://neo4j.com/docs/python-manual/current/query-simple/) and [Gemini REST API](https://ai.google.dev/api).
