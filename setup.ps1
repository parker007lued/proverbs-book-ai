# Complete Setup Script for Proverbs Book AI
# This script navigates to the project directory and installs everything

$projectPath = "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"

Write-Host "Proverbs Book AI - Complete Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Write-Host "Navigating to project directory..." -ForegroundColor Yellow
Set-Location $projectPath
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Are you in the correct directory?" -ForegroundColor Red
    Write-Host "Expected: $projectPath" -ForegroundColor Red
    exit 1
}

# Install npm packages
Write-Host "Step 1: Installing npm packages..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "npm packages installed successfully!" -ForegroundColor Green
} else {
    Write-Host "npm packages already installed, skipping..." -ForegroundColor Yellow
}
Write-Host ""

# Install system dependencies
Write-Host "Step 2: Installing system dependencies..." -ForegroundColor Cyan
if (Test-Path "scripts\install_dependencies.ps1") {
    powershell -ExecutionPolicy Bypass -File "scripts\install_dependencies.ps1"
} else {
    Write-Host "WARNING: install_dependencies.ps1 not found" -ForegroundColor Yellow
}
Write-Host ""

# Verify installations
Write-Host "Step 3: Verifying installations..." -ForegroundColor Cyan

# Check Ollama
Write-Host "Checking Ollama..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Ollama: $ollamaVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Ollama: Not found" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Ollama: Not found" -ForegroundColor Red
}

# Check Pandoc
Write-Host "Checking Pandoc..." -ForegroundColor Yellow
try {
    $pandocVersion = pandoc --version 2>&1 | Select-Object -First 1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Pandoc: $pandocVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Pandoc: Not found" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Pandoc: Not found" -ForegroundColor Red
}

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Python: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Python: Not found" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Python: Not found" -ForegroundColor Red
}
Write-Host ""

# Final message
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Cyan
Write-Host "  npm run tauri dev" -ForegroundColor White
Write-Host ""
Write-Host "Or build for production:" -ForegroundColor Cyan
Write-Host "  npm run tauri build" -ForegroundColor White
Write-Host ""
