# Install Rust and Visual Studio Build Tools for Windows
# Required for building Tauri applications

Write-Host "Proverbs Book AI - Rust and Build Tools Installer" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Rust is already installed
Write-Host "Checking for Rust..." -ForegroundColor Yellow
$rustInstalled = $false
try {
    $null = Get-Command cargo -ErrorAction Stop
    $rustVersion = cargo --version
    Write-Host "[OK] Rust is already installed: $rustVersion" -ForegroundColor Green
    $rustInstalled = $true
} catch {
    Write-Host "[X] Rust is not installed" -ForegroundColor Red
}

# Check for Visual Studio Build Tools
Write-Host ""
Write-Host "Checking for Visual Studio Build Tools..." -ForegroundColor Yellow
$buildToolsInstalled = $false

# Check for Visual Studio Installer
$vsInstallerPath = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vs_installer.exe"
if (-not (Test-Path $vsInstallerPath)) {
    $vsInstallerPath = "${env:ProgramFiles}\Microsoft Visual Studio\Installer\vs_installer.exe"
}

if (Test-Path $vsInstallerPath) {
    Write-Host "[OK] Visual Studio Installer found" -ForegroundColor Green
    
    # Check if C++ build tools are installed
    $vsInstaller = & $vsInstallerPath --list 2>&1
    if ($vsInstaller -match "Microsoft.VisualStudio.Component.VC.Tools.x86.x64" -or 
        $vsInstaller -match "Microsoft.VisualStudio.Workload.VCTools") {
        Write-Host "[OK] C++ Build Tools are installed" -ForegroundColor Green
        $buildToolsInstalled = $true
    } else {
        Write-Host "[X] C++ Build Tools are not installed" -ForegroundColor Red
    }
} else {
    Write-Host "[X] Visual Studio Installer not found" -ForegroundColor Red
}

Write-Host ""

# Install Visual Studio Build Tools if needed
if (-not $buildToolsInstalled) {
    Write-Host "Installing Visual Studio Build Tools..." -ForegroundColor Cyan
    Write-Host "This will download and install the Visual Studio Build Tools installer." -ForegroundColor Yellow
    Write-Host ""
    
    $buildToolsUrl = "https://aka.ms/vs/17/release/vs_buildtools.exe"
    $buildToolsInstaller = "$env:TEMP\vs_buildtools.exe"
    
    Write-Host "Downloading Visual Studio Build Tools installer..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $buildToolsUrl -OutFile $buildToolsInstaller -UseBasicParsing
        Write-Host "[OK] Download complete" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Starting Visual Studio Build Tools installer..." -ForegroundColor Yellow
        Write-Host "In the installer, select:" -ForegroundColor Cyan
        Write-Host "  - Desktop development with C++" -ForegroundColor White
        Write-Host "  - Windows 10/11 SDK (latest version)" -ForegroundColor White
        Write-Host ""
        Write-Host "The installer will open now. Please complete the installation." -ForegroundColor Yellow
        Write-Host ""
        
        Start-Process -FilePath $buildToolsInstaller -ArgumentList "--quiet","--wait","--add","Microsoft.VisualStudio.Workload.VCTools","--includeRecommended" -Wait
        
        Write-Host "Visual Studio Build Tools installation completed!" -ForegroundColor Green
        $buildToolsInstalled = $true
    } catch {
        Write-Host "Failed to download/install Visual Studio Build Tools automatically." -ForegroundColor Red
        Write-Host "Please download and install manually from:" -ForegroundColor Yellow
        Write-Host "https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022" -ForegroundColor Cyan
        Start-Process "https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022"
    }
}

# Install Rust if needed
if (-not $rustInstalled) {
    Write-Host ""
    Write-Host "Installing Rust..." -ForegroundColor Cyan
    Write-Host "This will install Rust using rustup." -ForegroundColor Yellow
    Write-Host ""
    
    $rustupInstaller = "$env:TEMP\rustup-init.exe"
    $rustupUrl = "https://win.rustup.rs/x86_64"
    
    Write-Host "Downloading Rust installer..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $rustupUrl -OutFile $rustupInstaller -UseBasicParsing
        Write-Host "[OK] Download complete" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Starting Rust installer..." -ForegroundColor Yellow
        Write-Host "The installer will open. Press Enter to accept defaults." -ForegroundColor Cyan
        Write-Host ""
        
        # Run rustup-init
        Start-Process -FilePath $rustupInstaller -ArgumentList "-y" -Wait
        
        # Refresh PATH to include Rust
        $machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
        $userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
        $env:Path = $machinePath + ";" + $userPath
        
        Write-Host ""
        Write-Host "Rust installation completed!" -ForegroundColor Green
        Write-Host "Please restart your terminal/PowerShell for changes to take effect." -ForegroundColor Yellow
        
        # Try to verify installation
        Start-Sleep -Seconds 2
        try {
            $cargoPath = "$env:USERPROFILE\.cargo\bin"
            $env:Path += ";$cargoPath"
            $rustVersion = cargo --version
            Write-Host "[OK] Rust installed successfully: $rustVersion" -ForegroundColor Green
        } catch {
            Write-Host "[WARNING] Rust installed but not in PATH yet. Please restart your terminal." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Failed to download/install Rust automatically." -ForegroundColor Red
        Write-Host "Please install manually from: https://www.rust-lang.org/tools/install" -ForegroundColor Yellow
        Start-Process "https://www.rust-lang.org/tools/install"
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
if ($rustInstalled -and $buildToolsInstalled) {
    Write-Host "[OK] All required tools are installed!" -ForegroundColor Green
} else {
    Write-Host "Installation process completed." -ForegroundColor Green
    Write-Host "If any tools were just installed, you may need to restart your terminal." -ForegroundColor Yellow
}
Write-Host ""
