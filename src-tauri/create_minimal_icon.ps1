# Create a minimal valid ICO file for Tauri
# Creates a simple 16x16 transparent icon

$iconPath = "icons\icon.ico"

if (-not (Test-Path "icons")) {
    New-Item -ItemType Directory -Path "icons" | Out-Null
}

# Create minimal ICO file bytes
$icoHeader = @(
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00,
    0x20, 0x00, 0x40, 0x02, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
)

$bmpHeader = @(
    0x28, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
)

# 16x16 pixels * 4 bytes (RGBA) = 1024 bytes of image data (all zeros = transparent)
$imageData = New-Object byte[] 1024

# AND mask: 16x16 pixels / 8 = 32 bytes (all zeros)
$andMask = New-Object byte[] 32

# Combine all parts
$icoBytes = $icoHeader + $bmpHeader + $imageData + $andMask

# Write ICO file
$fullPath = Join-Path (Get-Location) $iconPath
[System.IO.File]::WriteAllBytes($fullPath, $icoBytes)

Write-Host "Created minimal icon.ico file at: $iconPath" -ForegroundColor Green
Write-Host "You can replace this with your own icon later." -ForegroundColor Yellow
