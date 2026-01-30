# Proverbs Book AI - Installer and Launcher (PowerShell)
# Double-click this file to install everything and launch the app

$ErrorActionPreference = "Stop"

# Get the directory where this script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Proverbs Book AI - Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Current directory: $ScriptDir" -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Opening download page..." -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Install npm packages
Write-Host "[2/5] Installing npm packages..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "This may take a few minutes..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "npm packages installed successfully!" -ForegroundColor Green
} else {
    Write-Host "npm packages already installed, skipping..." -ForegroundColor Yellow
}
Write-Host ""

# Install system dependencies
Write-Host "[3/5] Installing system dependencies..." -ForegroundColor Cyan
if (Test-Path "scripts\install_dependencies.ps1") {
    & powershell -ExecutionPolicy Bypass -File "scripts\install_dependencies.ps1"
} else {
    Write-Host "WARNING: install_dependencies.ps1 not found" -ForegroundColor Yellow
}
Write-Host ""

# Check and install Rust and Build Tools
Write-Host "[4/5] Checking Rust and Visual Studio Build Tools..." -ForegroundColor Cyan

# Add Rust to PATH for this session
$cargoPath = "$env:USERPROFILE\.cargo\bin"
if (Test-Path $cargoPath) {
    $env:Path += ";$cargoPath"
}

try {
    $cargoVersion = cargo --version
    Write-Host "Rust found: $cargoVersion" -ForegroundColor Green
} catch {
    Write-Host "Rust is not installed. Installing now..." -ForegroundColor Yellow
    Write-Host "This will also install Visual Studio Build Tools if needed." -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path "scripts\install_rust_and_build_tools.ps1") {
        & powershell -ExecutionPolicy Bypass -File "scripts\install_rust_and_build_tools.ps1"
    } else {
        Write-Host "Installer script not found. Opening manual installation page..." -ForegroundColor Yellow
        Start-Process "https://www.rust-lang.org/tools/install"
        Write-Host ""
        Write-Host "Please install Rust and run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Host "Adding Rust to PATH for this session..." -ForegroundColor Cyan
    $env:Path += ";$cargoPath"
    
    Write-Host ""
    Write-Host "Checking Rust installation again..." -ForegroundColor Cyan
    try {
        $cargoVersion = cargo --version
        Write-Host "Rust found: $cargoVersion" -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Rust installation may require a terminal restart." -ForegroundColor Yellow
        Write-Host "Please close and reopen this window, then run this script again." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or install manually from: https://www.rust-lang.org/tools/install" -ForegroundColor Cyan
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host ""

# Launch the application
Write-Host "[5/5] Launching application..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Proverbs Book AI..." -ForegroundColor Green
Write-Host ""

# Run in development mode
npm run tauri dev

# If there was an error, keep window open
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Application exited with an error." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
