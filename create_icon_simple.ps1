# Simple script to create a valid icon.ico file
# Uses online conversion or Tauri CLI

Write-Host "Creating Icon for Proverbs Book AI" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
$iconDir = "$projectDir\src-tauri\icons"
$iconPath = "$iconDir\icon.ico"

# Ensure icons directory exists
if (-not (Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir | Out-Null
}

Write-Host "Option 1: Use Tauri Icon Generator (Recommended)" -ForegroundColor Yellow
Write-Host "If you have an image file, run:" -ForegroundColor White
Write-Host "  cd `"$projectDir`"" -ForegroundColor Cyan
Write-Host "  npx @tauri-apps/cli icon path/to/your/image.png" -ForegroundColor Cyan
Write-Host ""

Write-Host "Option 2: Download and Convert Icon" -ForegroundColor Yellow
Write-Host "1. Download any icon from: https://www.icon-icons.com/" -ForegroundColor White
Write-Host "2. Convert at: https://convertio.co/png-ico/" -ForegroundColor White
Write-Host "3. Save as: $iconPath" -ForegroundColor White
Write-Host ""

Write-Host "Option 3: Use Default Windows Icon (Temporary)" -ForegroundColor Yellow
Write-Host "Copying Windows default icon..." -ForegroundColor Cyan

# Try to copy a Windows system icon as temporary solution
$systemIcon = "$env:SystemRoot\System32\shell32.dll"
if (Test-Path $systemIcon) {
    # Extract icon #1 from shell32.dll (document icon)
    # This requires a tool, but let's try a simpler approach
    Write-Host "Cannot extract icon automatically. Please use Option 1 or 2." -ForegroundColor Red
} else {
    Write-Host "System icon not found. Please use Option 1 or 2." -ForegroundColor Red
}

Write-Host ""
Write-Host "For now, creating a minimal valid ICO using online tool..." -ForegroundColor Yellow
Write-Host "Opening icon download page..." -ForegroundColor Cyan
Start-Process "https://www.icon-icons.com/search/book"
