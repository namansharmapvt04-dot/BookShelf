@echo off
echo ============================================================
echo   BookShelf - Backend Setup Script
echo ============================================================
echo.
echo PREREQUISITES:
echo   1. PostgreSQL must be installed and running
echo   2. Create a database named 'bookshelf':
echo      Open psql and run: CREATE DATABASE bookshelf;
echo   3. Update backend\.env with your DB credentials
echo   4. (Optional) Get a Google Books API key from:
echo      https://developers.google.com/books/docs/v1/using#APIKey
echo      and add it to backend\.env
echo.
echo ============================================================
echo.

cd /d "%~dp0backend"

echo [1/3] Running database migrations...
..\venv\Scripts\python manage.py migrate
if errorlevel 1 (
    echo.
    echo ERROR: Migration failed. Check your PostgreSQL connection.
    echo Make sure PostgreSQL is running and the 'bookshelf' database exists.
    pause
    exit /b 1
)

echo.
echo [2/3] Creating superuser (optional - press Ctrl+C to skip)...
..\venv\Scripts\python manage.py createsuperuser --noinput --username admin --email admin@bookshelf.com 2>nul
echo (If superuser already exists, this is fine)

echo.
echo [3/3] Starting Django development server on http://localhost:8000 ...
echo       Press Ctrl+C to stop.
echo.
..\venv\Scripts\python manage.py runserver

pause
