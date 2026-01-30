#!/bin/bash
# Build DMG installer for macOS
# This creates a distributable DMG file

set -e

echo "Building macOS DMG installer..."
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on macOS"
    exit 1
fi

# Build the Tauri app first
echo "Step 1: Building Tauri application..."
cd "$(dirname "$0")/../.."
npm run tauri build -- --target x86_64-apple-darwin

# Create DMG
APP_NAME="ProverbsBookAI"
APP_PATH="src-tauri/target/x86_64-apple-darwin/release/bundle/macos/$APP_NAME.app"
DMG_NAME="${APP_NAME}-Installer.dmg"
DMG_PATH="installers/macos/$DMG_NAME"
VOLUME_NAME="Proverbs Book AI Installer"

echo ""
echo "Step 2: Creating DMG installer..."

# Create temporary directory for DMG contents
TEMP_DMG_DIR="installers/macos/temp_dmg"
rm -rf "$TEMP_DMG_DIR"
mkdir -p "$TEMP_DMG_DIR"

# Copy app to temp directory
cp -R "$APP_PATH" "$TEMP_DMG_DIR/"

# Copy installer script
cp "installers/macos/install.sh" "$TEMP_DMG_DIR/"

# Create Applications symlink
ln -s /Applications "$TEMP_DMG_DIR/Applications"

# Create README
cat > "$TEMP_DMG_DIR/README.txt" << EOF
Proverbs Book AI - Installation Instructions

1. Double-click "install.sh" to install all dependencies and set up the application
2. Or drag "ProverbsBookAI.app" to the Applications folder

The installer will automatically:
- Install Ollama (AI text generation)
- Install Pandoc (book export)
- Install Python packages (image generation)
- Download default AI models
- Set up the application

After installation, launch the app from Applications or use the Desktop shortcut.
EOF

# Create DMG
hdiutil create -volname "$VOLUME_NAME" -srcfolder "$TEMP_DMG_DIR" -ov -format UDZO "$DMG_PATH"

# Clean up
rm -rf "$TEMP_DMG_DIR"

echo ""
echo "DMG created successfully: $DMG_PATH"
echo ""
echo "You can now distribute this DMG file to install the application."
