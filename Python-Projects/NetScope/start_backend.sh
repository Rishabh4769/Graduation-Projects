#!/usr/bin/env bash
# Run from the NetScope root directory.
# Packet capture requires elevated privileges on most systems.
set -e

# Always resolve to the project root regardless of where the script is called from
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [ ! -d ".venv" ]; then
  echo "Creating virtual environment…"
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -q -r backend/requirements.txt

echo ""
echo "Starting NetScope backend on http://127.0.0.1:8000"
echo "API docs: http://127.0.0.1:8000/api/docs"
echo ""

# uvicorn must be launched from the project root so that
# 'backend' is a resolvable top-level package.
if [ "$(id -u)" -ne 0 ]; then
  echo "Note: raw packet capture requires elevated privileges. Running with sudo."
  sudo "$ROOT/.venv/bin/uvicorn" backend.main:app --host 127.0.0.1 --port 8000
else
  uvicorn backend.main:app --host 127.0.0.1 --port 8000
fi
