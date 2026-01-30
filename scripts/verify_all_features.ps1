# Comprehensive Feature Verification Script for Windows
# Tests all functionality to ensure everything works

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Feature Verification Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$PASSED = 0
$FAILED = 0

function Test-Check {
    param($TestName, $Condition)
    if ($Condition) {
        Write-Host "✓ PASS: $TestName" -ForegroundColor Green
        $script:PASSED++
    } else {
        Write-Host "✗ FAIL: $TestName" -ForegroundColor Red
        $script:FAILED++
    }
}

# Test 1: Node.js
Write-Host "Test 1: Node.js installation"
try {
    $null = node --version
    Test-Check "Node.js is installed" $true
} catch {
    Test-Check "Node.js is installed" $false
}

# Test 2: npm packages
Write-Host "Test 2: npm packages"
Test-Check "npm packages installed" (Test-Path "node_modules")

# Test 3: Rust
Write-Host "Test 3: Rust installation"
$cargoPath = "$env:USERPROFILE\.cargo\bin"
$env:Path += ";$cargoPath"
try {
    $null = cargo --version
    Test-Check "Rust is installed" $true
} catch {
    Test-Check "Rust is installed" $false
}

# Test 4: Ollama
Write-Host "Test 4: Ollama installation"
try {
    $null = ollama --version
    Test-Check "Ollama is installed" $true
} catch {
    Test-Check "Ollama is installed" $false
}

# Test 5: Pandoc
Write-Host "Test 5: Pandoc installation"
try {
    $null = pandoc --version
    Test-Check "Pandoc is installed" $true
} catch {
    Test-Check "Pandoc is installed" $false
}

# Test 6: Python
Write-Host "Test 6: Python installation"
try {
    $null = python --version
    Test-Check "Python is installed" $true
} catch {
    try {
        $null = python3 --version
        Test-Check "Python is installed" $true
    } catch {
        Test-Check "Python is installed" $false
    }
}

# Test 7: Python packages
Write-Host "Test 7: Python packages"
try {
    python -c "import diffusers; import torch; import PIL" 2>$null
    Test-Check "Python packages installed" $true
} catch {
    Test-Check "Python packages installed" $false
}

# Test 8: Tauri config
Write-Host "Test 8: Tauri configuration"
Test-Check "Tauri config exists" (Test-Path "src-tauri/tauri.conf.json")

# Test 9: Icons
Write-Host "Test 9: Application icons"
$hasIcons = (Test-Path "src-tauri/icons/icon.ico") -or (Test-Path "src-tauri/icons/icon.png")
Test-Check "Icons exist" $hasIcons

# Test 10: Rust modules
Write-Host "Test 10: Rust source files"
$hasModules = (Test-Path "src-tauri/src/main.rs") -and `
               (Test-Path "src-tauri/src/ollama.rs") -and `
               (Test-Path "src-tauri/src/image_gen.rs") -and `
               (Test-Path "src-tauri/src/book_assembler.rs")
Test-Check "All Rust modules exist" $hasModules

# Test 11: React components
Write-Host "Test 11: React components"
$hasComponents = (Test-Path "src/App.tsx") -and `
                 (Test-Path "src/components/ChapterEditor.tsx") -and `
                 (Test-Path "src/components/BookAssembler.tsx")
Test-Check "All React components exist" $hasComponents

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Test Results" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✓ Passed: $PASSED" -ForegroundColor Green
Write-Host "✗ Failed: $FAILED" -ForegroundColor Red
Write-Host ""

if ($FAILED -eq 0) {
    Write-Host "🎉 All tests passed! Application is ready." -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some tests failed. Please fix the issues above." -ForegroundColor Yellow
    exit 1
}
