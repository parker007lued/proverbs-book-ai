# Automatic dependency installation script for Windows
# Run as Administrator for best results

Write-Host "Proverbs Book AI - Dependency Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Ollama
$ollamaInstalled = $false
try {
    $null = Get-Command ollama -ErrorAction Stop
    $ollamaInstalled = $true
} catch {
    $ollamaInstalled = $false
}

if (-not $ollamaInstalled) {
    Write-Host "Ollama is not installed." -ForegroundColor Yellow
    Write-Host "Please download and install Ollama from: https://ollama.ai/download/windows" -ForegroundColor Yellow
    Write-Host "Opening download page..." -ForegroundColor Yellow
    Start-Process "https://ollama.ai/download/windows"
} else {
    Write-Host "Ollama is already installed." -ForegroundColor Green
}

# Check for Pandoc
$pandocInstalled = $false
try {
    $null = Get-Command pandoc -ErrorAction Stop
    $pandocInstalled = $true
} catch {
    $pandocInstalled = $false
}

if (-not $pandocInstalled) {
    Write-Host "Pandoc is not installed." -ForegroundColor Yellow
    Write-Host "Please download and install Pandoc from: https://github.com/jgm/pandoc/releases" -ForegroundColor Yellow
    Write-Host "Opening download page..." -ForegroundColor Yellow
    Start-Process "https://github.com/jgm/pandoc/releases/latest"
} else {
    Write-Host "Pandoc is already installed." -ForegroundColor Green
}

# Check for Python
$pythonInstalled = $false
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pythonInstalled = $true
        Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
    }
} catch {
    try {
        $pythonVersion = python3 --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pythonInstalled = $true
            Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
        }
    } catch {
        $pythonInstalled = $false
    }
}

if (-not $pythonInstalled) {
    Write-Host "Python is not installed." -ForegroundColor Yellow
    Write-Host "Please download and install Python 3.8+ from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Opening download page..." -ForegroundColor Yellow
    Start-Process "https://www.python.org/downloads/"
} else {
    # Install Python packages
    Write-Host "Installing Python packages..." -ForegroundColor Cyan
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $requirementsFile = Join-Path $scriptDir "requirements.txt"
    
    if (Test-Path $requirementsFile) {
        python -m pip install -r $requirementsFile
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Python packages installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to install Python packages." -ForegroundColor Red
        }
    } else {
        Write-Host "Requirements file not found at: $requirementsFile" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Dependency check complete!" -ForegroundColor Cyan
Write-Host "Note: Some dependencies may require manual installation." -ForegroundColor Yellow
