# 🖼️ Logo Conversion Instructions

## Current Status

- ✅ **logo.svg** - Already exists (SVG format, scalable)
- ⚠️ **logo.png** - Needs to be generated from SVG

## Conversion Methods

### Method 1: PowerShell Script (Easiest)

```powershell
.\scripts\convert-logo.ps1
```

This script will automatically detect and use:
- ImageMagick (if installed)
- Inkscape (if installed)
- Python with cairosvg (if installed)

### Method 2: ImageMagick (Recommended)

**Install:**
```powershell
choco install imagemagick
```

**Convert:**
```powershell
magick logo.svg -resize 512x512 logo.png
```

### Method 3: Inkscape

**Install:**
```powershell
choco install inkscape
```

**Convert:**
```powershell
inkscape logo.svg --export-filename=logo.png --export-width=512
```

### Method 4: Online Converter (No Installation)

1. Go to: https://cloudconvert.com/svg-to-png
2. Upload `logo.svg`
3. Set output size: 512x512
4. Download `logo.png`
5. Save to project root

### Method 5: Python (If Available)

**Install cairosvg:**
```powershell
pip install cairosvg
```

**Convert:**
```python
import cairosvg
cairosvg.svg2png(url='logo.svg', write_to='logo.png', output_width=512, output_height=512)
```

---

## Quick Command Reference

```powershell
# Try automatic conversion
.\scripts\convert-logo.ps1

# Or manually with ImageMagick
magick logo.svg -resize 512x512 logo.png

# Or with Inkscape
inkscape logo.svg --export-filename=logo.png --export-width=512
```

---

## Verification

After conversion, verify PNG was created:

```powershell
Get-Item logo.png
```

Should show file size > 1KB (not the 137 byte placeholder)

---

**License Updated: Indiana, Hamilton County ✓**
