#!/bin/bash
# Build Mac Installer for Proverbs Book AI

echo "═══════════════════════════════════════════════════════════════"
echo "  BUILDING MAC INSTALLER"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on macOS"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build Mac installer
echo ""
echo "Building Mac DMG installer..."
npm run build:mac

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  BUILD COMPLETE!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Installer created in: dist/"
echo "File: Proverbs-Book-AI-*.dmg"
echo ""
