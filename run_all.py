"""
LearnLoop Unified Server Runner
Runs both FastAPI backend (port 8080) and Express/Vite frontend (port 3000)
Hosts across all network interfaces (0.0.0.0) for local and LAN access.
"""

import os
import sys
import socket
import subprocess
import time
import signal
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
CAPTURE_API_DIR = ROOT_DIR / "capture_api"
FRONTEND_DIR = ROOT_DIR / "frontend"

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def find_python():
    # Check project virtualenvs
    candidates = [
        ROOT_DIR / ".venv313" / "Scripts" / "python.exe",
        ROOT_DIR / ".venv" / "Scripts" / "python.exe",
        ROOT_DIR / ".venv313" / "bin" / "python",
        ROOT_DIR / ".venv" / "bin" / "python",
    ]
    for c in candidates:
        if c.exists():
            return str(c)
    return sys.executable

def main():
    python_bin = find_python()
    lan_ip = get_lan_ip()

    print("=" * 65)
    print("           LEARNLOOP INTEGRATED STACK RUNNER           ")
    print("=" * 65)
    print(f" Root Directory:    {ROOT_DIR}")
    print(f" Python Executable: {python_bin}")
    print(f" Local Access:      http://localhost:3000")
    print(f" Network (LAN) URL: http://{lan_ip}:3000")
    print(f" Backend API URL:   http://localhost:8080")
    print(f" API Documentation: http://localhost:8080/docs")
    print("=" * 65)
    print(" Starting servers...\n")

    env = os.environ.copy()
    env["HOST"] = "0.0.0.0"
    env["PORT"] = "3000"
    env["NODE_ENV"] = "development"
    env["CAPTURE_API_URL"] = "http://localhost:8080"

    # Start capture_api backend
    backend_cmd = [
        python_bin, "-m", "uvicorn", "main:app",
        "--host", "0.0.0.0",
        "--port", "8080"
    ]
    print(f"[Backend] Starting FastAPI on 0.0.0.0:8080...")
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(CAPTURE_API_DIR),
        env=env
    )

    # Start frontend
    frontend_cli = FRONTEND_DIR / "node_modules" / "tsx" / "dist" / "cli.mjs"
    server_entry = FRONTEND_DIR / "server" / "_core" / "index.ts"

    if frontend_cli.exists():
        frontend_cmd = ["node", str(frontend_cli), str(server_entry)]
    else:
        frontend_cmd = ["npm.cmd" if sys.platform == "win32" else "npm", "run", "dev"]

    print(f"[Frontend] Starting Express + Vite on 0.0.0.0:3000...")
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(FRONTEND_DIR),
        env=env
    )

    procs = [backend_proc, frontend_proc]

    def shutdown(signum=None, frame=None):
        print("\n\nShutting down servers...")
        for p in procs:
            if p.poll() is None:
                p.terminate()
        time.sleep(1)
        for p in procs:
            if p.poll() is None:
                p.kill()
        print("All servers stopped.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    print("\n LearnLoop is up and running!")
    print(f" Open your browser: http://localhost:3000\n")

    try:
        while True:
            for p in procs:
                ret = p.poll()
                if ret is not None:
                    print(f"A server process exited unexpectedly with code {ret}")
                    shutdown()
            time.sleep(1)
    except KeyboardInterrupt:
        shutdown()

if __name__ == "__main__":
    main()
