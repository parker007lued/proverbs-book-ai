@echo off
REM Build portable Electron app on Windows
REM This creates a Mac-compatible app structure

echo === Building Portable Electron App ===
echo.

cd /d "%~dp0"

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Please install from https://nodejs.org
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Build portable version
echo.
echo Building portable app...
node build-portable.js

echo.
echo === Build Complete! ===
echo.
echo Created: portable\Proverbs Book AI.app
echo.
echo Next steps:
echo 1. Copy the "portable" folder to a Mac (or send to someone with Mac)
echo 2. On Mac, run: ./create-dmg.sh
echo 3. This creates the DMG installer
echo.
echo OR: Send the portable folder as-is - it works on Mac!
echo.
pause
