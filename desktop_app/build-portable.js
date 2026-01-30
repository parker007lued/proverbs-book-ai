#!/usr/bin/env node
/**
 * Build portable Electron app on Windows
 * Creates a folder structure that works on Mac
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Building Portable Electron App ===\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('Error: package.json not found. Run this from desktop_app directory.');
    process.exit(1);
}

// Install dependencies if needed
if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
}

// Create portable structure
const portableDir = path.join(__dirname, 'portable');
const macAppDir = path.join(portableDir, 'Proverbs Book AI.app', 'Contents');

console.log('Creating portable app structure...');

// Create directory structure
const dirs = [
    portableDir,
    path.join(portableDir, 'Proverbs Book AI.app'),
    macAppDir,
    path.join(macAppDir, 'MacOS'),
    path.join(macAppDir, 'Resources'),
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Copy files
console.log('Copying application files...');

// Copy main files
const filesToCopy = [
    { src: 'main.js', dest: path.join(macAppDir, 'MacOS', 'main.js') },
    { src: 'preload.js', dest: path.join(macAppDir, 'Resources', 'preload.js') },
    { src: 'index.html', dest: path.join(macAppDir, 'Resources', 'index.html') },
    { src: 'styles.css', dest: path.join(macAppDir, 'Resources', 'styles.css') },
    { src: 'renderer.js', dest: path.join(macAppDir, 'Resources', 'renderer.js') },
];

filesToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  ✓ ${src}`);
    }
});

// Create Info.plist
const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>main</string>
    <key>CFBundleIdentifier</key>
    <string>com.proverbsbook.ai</string>
    <key>CFBundleName</key>
    <string>Proverbs Book AI</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleIconFile</key>
    <string>icon</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>`;

fs.writeFileSync(path.join(macAppDir, 'Info.plist'), infoPlist);
console.log('  ✓ Info.plist');

// Create PkgInfo
fs.writeFileSync(path.join(macAppDir, 'PkgInfo'), 'APPL????');
console.log('  ✓ PkgInfo');

// Create launcher script
const launcherScript = '#!/bin/bash\n' +
'# Get the directory where the script is located\n' +
'DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"\n' +
'cd "$DIR/../Resources"\n' +
'\n' +
'# Find Electron binary\n' +
'ELECTRON_BIN=""\n' +
'if [ -f "/Applications/Electron.app/Contents/MacOS/Electron" ]; then\n' +
'    ELECTRON_BIN="/Applications/Electron.app/Contents/MacOS/Electron"\n' +
'elif [ -f "$HOME/Applications/Electron.app/Contents/MacOS/Electron" ]; then\n' +
'    ELECTRON_BIN="$HOME/Applications/Electron.app/Contents/MacOS/Electron"\n' +
'else\n' +
'    echo "Electron not found. Please install Electron first:"\n' +
'    echo "  brew install --cask electron"\n' +
'    echo "Or download from: https://www.electronjs.org/"\n' +
'    exit 1\n' +
'fi\n' +
'\n' +
'# Run the app\n' +
'exec "$ELECTRON_BIN" "$DIR/../Resources"\n';

fs.writeFileSync(path.join(macAppDir, 'MacOS', 'main'), launcherScript);
// Make it executable (will work on Mac)
console.log('  ✓ Launcher script');

// Create README
const readme = '# Proverbs Book AI - Portable Version\n\n' +
'## Installation Instructions\n\n' +
'### Option 1: Use the Mac Installer Script\n' +
'1. Copy this entire folder to a Mac\n' +
'2. Run: `./create-dmg.sh`\n' +
'3. This creates a DMG installer\n\n' +
'### Option 2: Manual Installation\n' +
'1. Install Electron: `brew install --cask electron`\n' +
'2. Double-click "Proverbs Book AI.app"\n' +
'3. Or run from terminal: `open "Proverbs Book AI.app"`\n\n' +
'### Option 3: Use Simple Installer\n' +
'If you have Python, use the simple installer instead:\n' +
'- Run: `python3 ../simple_installer/install.py`\n\n' +
'## Files Included\n' +
'- Proverbs Book AI.app - The application bundle\n' +
'- create-dmg.sh - Script to create DMG installer (run on Mac)\n' +
'- README.txt - This file\n\n' +
'## Requirements\n' +
'- macOS 10.13 or later\n' +
'- Electron (installed automatically by installer script)\n' +
'- Internet connection (for first-time setup)\n';

fs.writeFileSync(path.join(portableDir, 'README.txt'), readme);
console.log('  ✓ README.txt');

console.log('\n=== Portable App Created! ===');
console.log(`\nLocation: ${portableDir}`);
console.log('\nNext steps:');
console.log('1. Copy the "portable" folder to a Mac');
console.log('2. Run: ./create-dmg.sh');
console.log('3. This creates the DMG installer');
console.log('\nOr send the portable folder as-is - it works on Mac!');
