#!/bin/bash
# Build script for macOS installer

set -e

echo "=== Building Proverbs Book AI Desktop App ==="
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on macOS"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install from https://nodejs.org"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

echo "✓ Node.js $(node -v)"
echo "✓ npm $(npm -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

# Create assets directory if it doesn't exist
mkdir -p assets

# Create a simple icon if one doesn't exist
if [ ! -f "assets/icon.png" ]; then
    echo "Creating placeholder icon..."
    # Create a simple icon using ImageMagick or sips
    if command -v sips &> /dev/null; then
        # Create a simple colored square as icon
        python3 << EOF
from PIL import Image, ImageDraw, ImageFont
import os

img = Image.new('RGB', (512, 512), color='#667eea')
draw = ImageDraw.Draw(img)

# Draw a book icon
draw.rectangle([100, 150, 412, 362], fill='white', outline='#333', width=5)
draw.line([256, 150, 256, 362], fill='#333', width=3)
draw.text((200, 400), 'Proverbs', fill='white', anchor='mm')

img.save('assets/icon.png')
EOF
    fi
fi

# Convert PNG to ICNS if needed
if [ -f "assets/icon.png" ] && [ ! -f "assets/icon.icns" ]; then
    echo "Converting icon to ICNS format..."
    if command -v iconutil &> /dev/null; then
        mkdir -p icon.iconset
        sips -z 16 16 assets/icon.png --out icon.iconset/icon_16x16.png
        sips -z 32 32 assets/icon.png --out icon.iconset/icon_16x16@2x.png
        sips -z 32 32 assets/icon.png --out icon.iconset/icon_32x32.png
        sips -z 64 64 assets/icon.png --out icon.iconset/icon_32x32@2x.png
        sips -z 128 128 assets/icon.png --out icon.iconset/icon_128x128.png
        sips -z 256 256 assets/icon.png --out icon.iconset/icon_128x128@2x.png
        sips -z 256 256 assets/icon.png --out icon.iconset/icon_256x256.png
        sips -z 512 512 assets/icon.png --out icon.iconset/icon_256x256@2x.png
        sips -z 512 512 assets/icon.png --out icon.iconset/icon_512x512.png
        sips -z 1024 1024 assets/icon.png --out icon.iconset/icon_512x512@2x.png
        iconutil -c icns icon.iconset -o assets/icon.icns
        rm -rf icon.iconset
    fi
fi

# Build the app
echo ""
echo "Building macOS application..."
npm run build:mac

echo ""
echo "=== Build Complete! ==="
echo ""
echo "The installer DMG is located in:"
echo "  dist/Proverbs Book AI-*.dmg"
echo ""
echo "Send this DMG file to your mother!"
echo "She can double-click it to install the app."
