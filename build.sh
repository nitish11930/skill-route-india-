#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "==> Installing Node dependencies..."
npm ci --prefix frontend

echo "==> Building React frontend..."
npm run build --prefix frontend

echo "==> Build complete. Frontend dist ready at frontend/dist/"
ls -la frontend/dist/
