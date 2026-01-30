@echo off
REM Batch script to set up PostgreSQL databases on Windows

echo.
echo ===============================================================
echo   SETTING UP POSTGRESQL DATABASES
echo ===============================================================
echo.

REM Check if psql exists
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo.
    echo Please install PostgreSQL from:
    echo   https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add PostgreSQL to PATH:
    echo   C:\Program Files\PostgreSQL\15\bin
    echo.
    pause
    exit /b 1
)

echo PostgreSQL found!
echo.

REM Prompt for password
set /p PGPASSWORD="Enter PostgreSQL password (set during installation): "

echo.
echo Creating databases...
echo.

REM Create proverbs_book database
echo Creating proverbs_book database...
echo CREATE DATABASE proverbs_book; | psql -U postgres -h localhost
if %ERRORLEVEL% EQU 0 (
    echo OK: proverbs_book database created
) else (
    echo WARNING: proverbs_book may already exist or error occurred
)

echo.
echo ===============================================================
echo   DATABASE SETUP COMPLETE!
echo ===============================================================
echo.
echo Next steps:
echo   1. Configure .env file in backend-api/
echo   2. Run: cd backend-api && npm install && npm start
echo.
pause
