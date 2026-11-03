#!/usr/bin/env bash
# ===============================================================
#  start.sh — Cross-platform startup for LearnLoop Integrated Stack
# ===============================================================
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

if [ -f "$REPO_DIR/.venv313/bin/python" ]; then
    PYTHON="$REPO_DIR/.venv313/bin/python"
elif [ -f "$REPO_DIR/.venv/bin/python" ]; then
    PYTHON="$REPO_DIR/.venv/bin/python"
else
    PYTHON="python3"
fi

exec "$PYTHON" "$REPO_DIR/run_all.py"
