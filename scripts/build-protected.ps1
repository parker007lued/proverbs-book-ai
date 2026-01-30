# WilhelmTechCo LLC - Protected Build Script (PowerShell)
# Builds application with code protection

Write-Host "🔒 WilhelmTechCo LLC - Protected Build" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Install obfuscator
Write-Host "Installing code obfuscator..." -ForegroundColor Yellow
npm install -g javascript-obfuscator

# Build backend with protection
Write-Host "Building backend with protection..." -ForegroundColor Yellow
Set-Location backend-api
npm install

# Obfuscate critical files
Write-Host "Obfuscating critical files..." -ForegroundColor Yellow
javascript-obfuscator routes/donations.js --output routes/donations.protected.js --compact true --control-flow-flattening true
javascript-obfuscator routes/auth.js --output routes/auth.protected.js --compact true
javascript-obfuscator config/database.js --output config/database.protected.js --compact true

# Build desktop app
Write-Host "Building desktop app..." -ForegroundColor Yellow
Set-Location ../desktop_app
npm install
npm run build

Write-Host ""
Write-Host "✓ Protected build complete" -ForegroundColor Green
Write-Host "⚠️  Review protected files before deployment" -ForegroundColor Yellow
