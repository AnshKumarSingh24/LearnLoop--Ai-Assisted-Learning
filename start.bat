@echo off
title LearnLoop - Unified Integrated Stack
cd /d "%~dp0"
echo ===================================================
echo     Starting LearnLoop (Backend + Frontend)
echo ===================================================
if exist .venv313\Scripts\python.exe (
    .venv313\Scripts\python.exe run_all.py
) else if exist .venv\Scripts\python.exe (
    .venv\Scripts\python.exe run_all.py
) else (
    python run_all.py
)
pause
