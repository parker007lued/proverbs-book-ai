@echo off
REM Proverbs Book AI - Installer and Launcher
REM Double-click this file to install everything and launch the app

title Proverbs Book AI - Setup and Launch

echo.
echo ========================================
echo   Proverbs Book AI - Installer
echo ========================================
echo.

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo Current directory: %CD%
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Opening download page...
    start https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo Node.js found!
echo.

REM Install npm packages
echo [2/5] Installing npm packages...
if not exist "node_modules" (
    echo This may take a few minutes...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
    echo npm packages installed successfully!
) else (
    echo npm packages already installed, skipping...
)
echo.

REM Install system dependencies
echo [3/5] Installing system dependencies...
if exist "scripts\install_dependencies.ps1" (
    powershell -ExecutionPolicy Bypass -File "scripts\install_dependencies.ps1"
) else (
    echo WARNING: install_dependencies.ps1 not found
)
echo.

REM Check and install Rust and Build Tools
echo [4/5] Checking Rust and Visual Studio Build Tools...

REM Add Rust to PATH for this session
set "PATH=%PATH%;%USERPROFILE%\.cargo\bin"

where cargo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Rust is not installed. Installing now...
    echo This will also install Visual Studio Build Tools if needed.
    echo.
    powershell -ExecutionPolicy Bypass -File "scripts\install_rust_and_build_tools.ps1"
    echo.
    echo Adding Rust to PATH for this session...
    set "PATH=%PATH%;%USERPROFILE%\.cargo\bin"
    echo.
    echo Checking Rust installation again...
    where cargo >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo WARNING: Rust installation may require a terminal restart.
        echo Please close and reopen this window, then run this script again.
        echo.
        echo Or install manually from: https://www.rust-lang.org/tools/install
        pause
        exit /b 1
    )
)
cargo --version
echo Rust found!
echo.

REM Launch the application
echo [5/5] Launching application...
echo.
echo Starting Proverbs Book AI...
echo.

REM Run in development mode
call npm run tauri dev

REM If the app closes, keep window open to see any errors
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Application exited with an error.
    pause
)
