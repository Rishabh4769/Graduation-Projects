#!/usr/bin/env bash
# NetScope launcher — starts backend and frontend together.
# Usage: ./NetScope.sh
# Stop everything with Ctrl+C.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# ── Colours ────────────────────────────────────────────────────────────
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}  ◈  NetScope v2.0${RESET}"
echo -e "${CYAN}     Network Traffic Monitor${RESET}"
echo ""

# ── Python venv ────────────────────────────────────────────────────────
if [ ! -d ".venv" ]; then
  echo -e "${YELLOW}[setup]${RESET} Creating Python virtual environment…"
  python3 -m venv .venv
fi

echo -e "${YELLOW}[setup]${RESET} Installing / verifying Python dependencies…"
.venv/bin/pip install -q -r backend/requirements.txt

# ── Node modules ───────────────────────────────────────────────────────
if [ ! -d "frontend/node_modules" ]; then
  echo -e "${YELLOW}[setup]${RESET} Installing npm dependencies…"
  npm install --prefix frontend --silent
fi

# ── Cleanup on exit ────────────────────────────────────────────────────
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo -e "${YELLOW}[stop]${RESET} Shutting down…"
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  [ -n "$BACKEND_PID"  ] && kill "$BACKEND_PID"  2>/dev/null
  # If backend was launched with sudo, also clean up any lingering uvicorn
  sudo kill "$BACKEND_PID" 2>/dev/null || true
  echo -e "${GREEN}[done]${RESET} NetScope stopped."
  exit 0
}
trap cleanup INT TERM

# ── Start backend ──────────────────────────────────────────────────────
echo -e "${GREEN}[backend]${RESET} Starting API server on ${BOLD}http://127.0.0.1:8000${RESET}…"

if [ "$(id -u)" -ne 0 ]; then
  # Raw packet capture requires root on macOS/Linux
  sudo "$ROOT/.venv/bin/uvicorn" backend.main:app \
    --host 127.0.0.1 --port 8000 \
    --log-level warning &
else
  .venv/bin/uvicorn backend.main:app \
    --host 127.0.0.1 --port 8000 \
    --log-level warning &
fi
BACKEND_PID=$!

# Wait until the backend is actually accepting connections (max 15s)
echo -n -e "${YELLOW}[wait]${RESET}  Waiting for backend"
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:8000/api/auth/status > /dev/null 2>&1; then
    echo -e " ${GREEN}ready${RESET}"
    break
  fi
  echo -n "."
  sleep 0.5
done

# ── Start frontend ─────────────────────────────────────────────────────
echo -e "${GREEN}[frontend]${RESET} Starting React dev server on ${BOLD}http://localhost:5173${RESET}…"
npm run dev --prefix frontend &
FRONTEND_PID=$!

echo ""
echo -e "${BOLD}  NetScope is running.${RESET}"
echo -e "  ${CYAN}→ Open http://localhost:5173 in your browser${RESET}"
echo -e "  Press ${BOLD}Ctrl+C${RESET} to stop both servers."
echo ""

# Keep the script alive until Ctrl+C
wait
