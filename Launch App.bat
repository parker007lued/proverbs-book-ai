@echo off
REM Proverbs Book AI - Quick Launcher
REM Use this if everything is already installed

title Proverbs Book AI

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo Starting Proverbs Book AI...
echo.

call npm run tauri dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Application failed to start. Run "Install and Launch.bat" to set up dependencies.
    pause
)
