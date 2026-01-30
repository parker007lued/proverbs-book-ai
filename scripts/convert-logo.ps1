# Convert SVG to PNG using available tools
# WilhelmTechCo LLC Logo Conversion

$svgPath = "logo.svg"
$pngPath = "logo.png"

Write-Host "🖼️  Converting SVG to PNG..." -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is available
$magick = Get-Command magick -ErrorAction SilentlyContinue
if ($magick) {
    Write-Host "Using ImageMagick..." -ForegroundColor Green
    magick $svgPath -resize 512x512 $pngPath
    if (Test-Path $pngPath) {
        Write-Host "✓ PNG created successfully!" -ForegroundColor Green
        exit 0
    }
}

# Check if Inkscape is available
$inkscape = Get-Command inkscape -ErrorAction SilentlyContinue
if ($inkscape) {
    Write-Host "Using Inkscape..." -ForegroundColor Green
    inkscape $svgPath --export-filename=$pngPath --export-width=512
    if (Test-Path $pngPath) {
        Write-Host "✓ PNG created successfully!" -ForegroundColor Green
        exit 0
    }
}

# Check if Python with cairosvg is available
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "Attempting Python conversion..." -ForegroundColor Yellow
    $pythonScript = @"
import sys
try:
    import cairosvg
    cairosvg.svg2png(url='$svgPath', write_to='$pngPath', output_width=512, output_height=512)
    print('✓ PNG created successfully!')
    sys.exit(0)
except ImportError:
    print('cairosvg not installed. Install with: pip install cairosvg')
    sys.exit(1)
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
"@
    $pythonScript | python
    if ($LASTEXITCODE -eq 0 -and (Test-Path $pngPath)) {
        exit 0
    }
}

# Fallback: Instructions
Write-Host ""
Write-Host "⚠️  No conversion tool found. Use one of these:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Online Converter" -ForegroundColor Cyan
Write-Host "  https://cloudconvert.com/svg-to-png" -ForegroundColor White
Write-Host "  Upload logo.svg, set size 512x512, download" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Install ImageMagick" -ForegroundColor Cyan
Write-Host "  choco install imagemagick" -ForegroundColor White
Write-Host "  Then run: magick logo.svg -resize 512x512 logo.png" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Install Inkscape" -ForegroundColor Cyan
Write-Host "  choco install inkscape" -ForegroundColor White
Write-Host "  Then run: inkscape logo.svg --export-filename=logo.png --export-width=512" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 4: Python with cairosvg" -ForegroundColor Cyan
Write-Host "  pip install cairosvg" -ForegroundColor White
Write-Host "  Then run this script again" -ForegroundColor Gray
Write-Host ""
