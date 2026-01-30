@echo off
REM Quick launcher that adds Rust to PATH and runs the app

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Add Rust to PATH for this session
set "PATH=%PATH%;%USERPROFILE%\.cargo\bin"

echo Starting Proverbs Book AI...
echo.

REM Run the app
call npm run tauri dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Application failed to start.
    pause
)
