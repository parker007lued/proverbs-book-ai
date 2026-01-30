# PowerShell script to set up PostgreSQL databases on Windows
# Run this script to create both databases

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  SETTING UP POSTGRESQL DATABASES" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "ERROR: PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL from:" -ForegroundColor Yellow
    Write-Host "  https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, add PostgreSQL to PATH:" -ForegroundColor Yellow
    Write-Host "  C:\Program Files\PostgreSQL\15\bin" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host "PostgreSQL found!" -ForegroundColor Green
Write-Host ""

# Get PostgreSQL password
Write-Host "Enter PostgreSQL password (set during installation):" -ForegroundColor Cyan
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Set password as environment variable for psql
$env:PGPASSWORD = $passwordPlain

Write-Host ""
Write-Host "Creating databases..." -ForegroundColor Cyan

# Create proverbs_book database
Write-Host "Creating proverbs_book database..." -ForegroundColor Yellow
$createProverbs = "CREATE DATABASE proverbs_book;"
$result1 = echo $createProverbs | psql -U postgres -h localhost 2>&1

if ($LASTEXITCODE -eq 0 -or $result1 -match "already exists") {
    Write-Host "✓ proverbs_book database ready" -ForegroundColor Green
} else {
    Write-Host "⚠ Error creating proverbs_book: $result1" -ForegroundColor Yellow
}

# Create financial_advisor database
Write-Host "Creating financial_advisor database..." -ForegroundColor Yellow
$createFinancial = "CREATE DATABASE financial_advisor;"
$result2 = echo $createFinancial | psql -U postgres -h localhost 2>&1

if ($LASTEXITCODE -eq 0 -or $result2 -match "already exists") {
    Write-Host "✓ financial_advisor database ready" -ForegroundColor Green
} else {
    Write-Host "⚠ Error creating financial_advisor: $result2" -ForegroundColor Yellow
}

# Clear password
$env:PGPASSWORD = ""

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  DATABASE SETUP COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Configure .env files in backend-api/ and financial-advisor/" -ForegroundColor White
Write-Host "  2. Run: cd backend-api && npm install && npm start" -ForegroundColor White
Write-Host "  3. Run: cd financial-advisor && npm install && npm start" -ForegroundColor White
Write-Host ""
pause
