@echo off
REM Build self-contained Electron app with all dependencies

echo === Building Self-Contained Proverbs Book AI ===
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

echo Installing dependencies...
call npm install

echo.
echo Building Electron app...
call npm run build:mac

echo.
echo Creating distribution package...
if exist "dist" (
    echo Packaging files...
    REM Copy database and scripts to dist
    xcopy /E /I /Y database dist\database
    xcopy /E /I /Y scripts dist\scripts
    
    echo.
    echo Creating ZIP file...
    powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'Proverbs-Book-AI-Standalone.zip' -Force"
    
    echo.
    echo === Build Complete! ===
    echo.
    echo File created: Proverbs-Book-AI-Standalone.zip
    echo.
    echo This ZIP contains everything needed:
    echo   - Electron app (bundled)
    echo   - Proverbs database (all 31 chapters)
    echo   - Dependency installer script
    echo   - Image generation support
    echo.
    echo Send this ZIP file to your mother!
    echo.
) else (
    echo Error: Build failed. Check npm errors above.
)

pause
