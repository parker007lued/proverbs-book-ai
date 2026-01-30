# Complete Windows Installer for Proverbs Book AI
# Downloads and installs everything automatically

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  PROVERBS BOOK AI - WINDOWS INSTALLER" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: This script requires Administrator privileges" -ForegroundColor Yellow
    Write-Host "Right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Step 1: Install Chocolatey (if needed)
Write-Host "Step 1: Installing Chocolatey (if needed)..." -ForegroundColor Green
$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue
if (-not $chocoInstalled) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host "OK: Chocolatey installed" -ForegroundColor Green
} else {
    Write-Host "OK: Chocolatey already installed" -ForegroundColor Green
}

# Refresh environment
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host ""
Write-Host "Step 2: Installing Ollama..." -ForegroundColor Green
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollamaInstalled) {
    Write-Host "Downloading and installing Ollama..."
    choco install ollama -y
    Write-Host "OK: Ollama installed" -ForegroundColor Green
} else {
    Write-Host "OK: Ollama already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Installing Pandoc..." -ForegroundColor Green
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue
if (-not $pandocInstalled) {
    Write-Host "Installing Pandoc..."
    choco install pandoc -y
    Write-Host "OK: Pandoc installed" -ForegroundColor Green
} else {
    Write-Host "OK: Pandoc already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 4: Installing Node.js (if needed)..." -ForegroundColor Green
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "Installing Node.js..."
    choco install nodejs -y
    Write-Host "OK: Node.js installed" -ForegroundColor Green
} else {
    Write-Host "OK: Node.js already installed" -ForegroundColor Green
}

# Refresh PATH again
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host ""
Write-Host "Step 5: Starting Ollama service..." -ForegroundColor Green
# Stop any existing Ollama processes
Stop-Process -Name ollama -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Ollama service
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 5

# Check if Ollama is running
$ollamaRunning = $false
try {
    $null = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop
    $ollamaRunning = $true
    Write-Host "OK: Ollama service started" -ForegroundColor Green
}
catch {
    Write-Host "WARNING: Ollama service may need manual start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Downloading AI Model (phi3:mini)..." -ForegroundColor Green
Write-Host "This may take several minutes (model is ~2GB)..." -ForegroundColor Yellow

if ($ollamaRunning -eq $true) {
    $modelCheck = ollama list 2>&1
    $modelExists = $modelCheck -match "phi3:mini"
    if ($modelExists) {
        Write-Host "OK: Model already downloaded" -ForegroundColor Green
    }
    else {
        ollama pull phi3:mini
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK: Model downloaded" -ForegroundColor Green
        }
        else {
            Write-Host "WARNING: Model download may have failed. You can download it later." -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "WARNING: Skipping model download - Ollama not running." -ForegroundColor Yellow
    Write-Host "  Start Ollama and run: ollama pull phi3:mini" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 7: Installing Node.js dependencies..." -ForegroundColor Green
$packageJsonExists = Test-Path "package.json"
if ($packageJsonExists) {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "WARNING: Some dependencies may have failed to install" -ForegroundColor Yellow
    }
}
else {
    Write-Host "WARNING: package.json not found in current directory" -ForegroundColor Yellow
    Write-Host "  Make sure you're running this script from the desktop_app folder" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "To run the app:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Or double-click the .exe file if you have one" -ForegroundColor White
Write-Host ""
pause
