#!/bin/bash
# Create DMG installer from portable app
# Run this on macOS

set -e

echo "=== Creating DMG Installer ==="
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on macOS"
    exit 1
fi

# Check if portable folder exists
if [ ! -d "portable" ]; then
    echo "Error: 'portable' folder not found"
    echo "Run 'node build-portable.js' first on Windows"
    exit 1
fi

APP_NAME="Proverbs Book AI"
DMG_NAME="${APP_NAME} Installer"
VOLUME_NAME="${APP_NAME}"

# Clean up old builds
rm -rf "${DMG_NAME}.dmg"
rm -rf dist

# Create dist directory
mkdir -p dist

# Copy app to dist
cp -R "portable/${APP_NAME}.app" dist/

# Create Applications link
ln -s /Applications dist/Applications

# Create DMG
echo "Creating DMG..."
hdiutil create -volname "${VOLUME_NAME}" \
    -srcfolder dist \
    -ov \
    -format UDZO \
    "${DMG_NAME}.dmg"

# Clean up
rm -rf dist

echo ""
echo "=== DMG Created Successfully! ==="
echo ""
echo "File: ${DMG_NAME}.dmg"
echo ""
echo "Send this DMG to your mother - she can install it like any Mac app!"
