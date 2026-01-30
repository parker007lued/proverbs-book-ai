#!/bin/bash
# Complete macOS installer package creator
# Creates a ready-to-distribute package for your mother's MacBook

set -e

echo "=========================================="
echo "  Creating macOS Installer Package"
echo "=========================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on macOS"
    exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "Project root: $PROJECT_ROOT"
echo ""

# Step 1: Build the application
echo "Step 1: Building Tauri application..."
npm run tauri build -- --target universal-apple-darwin || npm run tauri build

echo ""

# Step 2: Create installer package structure
echo "Step 2: Creating installer package structure..."
INSTALLER_DIR="installers/macos/ProverbsBookAI-Installer"
rm -rf "$INSTALLER_DIR"
mkdir -p "$INSTALLER_DIR"

# Find the built app
APP_PATH=$(find src-tauri/target -name "ProverbsBookAI.app" -type d | head -n 1)

if [ -z "$APP_PATH" ]; then
    echo "Error: Application not found. Build may have failed."
    exit 1
fi

echo "Found app at: $APP_PATH"

# Copy app to installer directory
cp -R "$APP_PATH" "$INSTALLER_DIR/"

# Copy installer script
cp "installers/macos/install.sh" "$INSTALLER_DIR/"
chmod +x "$INSTALLER_DIR/install.sh"

# Create README
cat > "$INSTALLER_DIR/README.txt" << 'EOF'
Proverbs Book AI - Installation Guide

INSTALLATION STEPS:

1. Double-click "install.sh" to automatically install everything
   OR
   Drag "ProverbsBookAI.app" to your Applications folder

2. The installer will automatically:
   - Install Ollama (for AI text generation)
   - Install Pandoc (for book export)
   - Install Python packages (for image generation)
   - Download the default AI model
   - Set up the application

3. After installation, launch the app from:
   - Applications folder → ProverbsBookAI.app
   - Or use the Desktop shortcut (created automatically)

FIRST RUN:

When you first open the app:
- It will check all dependencies
- Download any missing AI models automatically
- Be ready to use immediately!

TROUBLESHOOTING:

If you see "App can't be opened":
1. Right-click the app
2. Select "Open"
3. Click "Open" in the security dialog

For help, see the README.md file in the application folder.
EOF

# Create Applications symlink
ln -s /Applications "$INSTALLER_DIR/Applications"

# Create DMG
echo ""
echo "Step 3: Creating DMG installer..."
DMG_NAME="ProverbsBookAI-Installer.dmg"
DMG_PATH="installers/macos/$DMG_NAME"
VOLUME_NAME="Proverbs Book AI"

# Remove existing DMG
rm -f "$DMG_PATH"

# Create DMG
hdiutil create -volname "$VOLUME_NAME" \
    -srcfolder "$INSTALLER_DIR" \
    -ov \
    -format UDZO \
    "$DMG_PATH"

echo ""
echo "=========================================="
echo "  Installer Created Successfully!"
echo "=========================================="
echo ""
echo "DMG file: $DMG_PATH"
echo ""
echo "You can now:"
echo "  1. Send this DMG file to your mother"
echo "  2. She can double-click it to install"
echo "  3. The installer will set up everything automatically"
echo ""
echo "File size:"
du -h "$DMG_PATH"
echo ""
