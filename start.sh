#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -x backend/.venv/bin/python ]; then
  python3 -m venv backend/.venv
fi
if ! backend/.venv/bin/python -c 'import fastapi, neo4j, httpx, pydantic_settings' >/dev/null 2>&1; then
  backend/.venv/bin/python -m pip install -r backend/requirements.txt
fi
if [ ! -d frontend/node_modules ]; then
  npm ci --prefix frontend --cache "$PWD/.npm-cache"
fi
if [ "${1:-}" = "--preview" ]; then
  npm run build --prefix frontend
  exec backend/.venv/bin/python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001
fi
backend/.venv/bin/python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload &
backend_pid=$!
trap 'kill "$backend_pid" 2>/dev/null || true' EXIT INT TERM
npm run dev --prefix frontend -- --host 127.0.0.1 --port 5173 --strictPort
