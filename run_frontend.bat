@echo off
echo ============================================================
echo   BookShelf — Frontend (React + Vite)
echo ============================================================
echo   Starting development server at http://localhost:5173
echo   Backend should be running at http://localhost:8000
echo   Press Ctrl+C to stop
echo ============================================================
echo.
cd /d "%~dp0frontend"
npm run dev
pause
