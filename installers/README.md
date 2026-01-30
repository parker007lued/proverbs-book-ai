# Installers for All Platforms

## For Your Mother's MacBook

### Option 1: DMG Installer (Recommended)

1. **Build the DMG installer:**
   ```bash
   cd installers/macos
   chmod +x create_installer_package.sh
   ./create_installer_package.sh
   ```

2. **Send the DMG file:**
   - File: `installers/macos/ProverbsBookAI-Installer.dmg`
   - Send this file to your mother
   - She double-clicks it to install

3. **What happens:**
   - DMG opens showing the app and installer script
   - Double-click `install.sh` to install all dependencies automatically
   - Or drag app to Applications folder
   - Everything sets up automatically!

### Option 2: Simple Install Script

Send her the `install.sh` script:
- It installs everything automatically
- Downloads all dependencies
- Sets up the application
- Creates a launcher on Desktop

## Windows Installer

### Build Windows Installer:
```powershell
npm run tauri build
```

The installer will be in:
`src-tauri/target/release/bundle/nsis/ProverbsBookAI-Setup-1.0.0.exe`

## Linux Installer

### Build Linux Installer:
```bash
npm run tauri build
```

The installer will be in:
`src-tauri/target/release/bundle/appimage/` or `deb/`

## Docker Option (Alternative)

For easy deployment without local installation:

```bash
cd docker
docker-compose up --build
```

This runs everything in a container with all dependencies included.

## What Gets Installed Automatically

### macOS:
- ✅ Ollama (via Homebrew)
- ✅ Pandoc (via Homebrew)
- ✅ Python packages (via pip)
- ✅ Default AI model (phi3:mini)
- ✅ Application files

### Windows:
- ✅ Rust and Build Tools
- ✅ npm packages
- ✅ System dependencies (with instructions)
- ✅ Application files

### Linux:
- ✅ All dependencies via package managers
- ✅ Application files

## Distribution Checklist

- [ ] Build DMG for macOS
- [ ] Build EXE installer for Windows
- [ ] Build AppImage/Deb for Linux
- [ ] Test on clean system
- [ ] Verify all dependencies install
- [ ] Test first run experience
- [ ] Create distribution package
