@echo off
REM Build Windows Installer for Proverbs Book AI

echo ===============================================================
echo   BUILDING WINDOWS INSTALLER
echo ===============================================================
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

REM Build Windows installer
echo.
echo Building Windows installer...
call npm run build:win

echo.
echo ===============================================================
echo   BUILD COMPLETE!
echo ===============================================================
echo.
echo Installer created in: dist\
echo File: Proverbs-Book-AI-Setup.exe
echo.
pause
