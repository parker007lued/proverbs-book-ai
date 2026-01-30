# How to Get the Installer

## 🎯 For Your Mother's MacBook

### Option 1: Build on macOS (If You Have Access)

**Run these commands on a Mac:**

```bash
# Navigate to project
cd "path/to/Moms AI Model For Proverbs"

# Build the app
npm run tauri build

# Create DMG installer
cd installers/macos
chmod +x create_installer_package.sh
./create_installer_package.sh
```

**Result:** `installers/macos/ProverbsBookAI-Installer.dmg`

### Option 2: Use GitHub Actions (Automated)

1. **Push to GitHub** (if not already there)
2. **Create a release tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. **GitHub Actions will automatically build** the installer
4. **Download from GitHub Releases**

### Option 3: Build Script for macOS

**Send this script to someone with a Mac:**

```bash
#!/bin/bash
# Build script for macOS installer

cd "$(dirname "$0")"
npm install
npm run tauri build
cd installers/macos
chmod +x create_installer_package.sh
./create_installer_package.sh

echo ""
echo "Installer created: installers/macos/ProverbsBookAI-Installer.dmg"
echo "Send this DMG file to your mother!"
```

### Option 4: Manual Build Instructions

**If you have access to a Mac:**

1. Clone/download the project
2. Install Node.js and Rust
3. Run: `npm install`
4. Run: `npm run tauri build`
5. Run: `cd installers/macos && ./create_installer_package.sh`
6. The DMG file will be created

## 📦 What's Included in the Installer

The DMG contains:
- ✅ `ProverbsBookAI.app` - The application
- ✅ `install.sh` - Automatic installer script
- ✅ `README.txt` - Installation instructions
- ✅ Applications shortcut

## 🚀 Quick Build Commands

**All-in-one command (on macOS):**

```bash
cd "path/to/project" && \
npm install && \
npm run tauri build && \
cd installers/macos && \
chmod +x create_installer_package.sh && \
./create_installer_package.sh && \
echo "Installer ready: installers/macos/ProverbsBookAI-Installer.dmg"
```

## 📝 Alternative: Use Docker

If you can't build on macOS, use Docker:

```bash
cd docker
docker-compose up --build
```

This runs the app in a container - works on any platform!

## ⚠️ Important Notes

- **macOS installers must be built on macOS** (or via CI/CD)
- **Windows can't build macOS DMG files directly**
- **Use GitHub Actions** for automated cross-platform builds
- **Or use Docker** as an alternative deployment method

## 🎁 Ready-to-Use Files

All installer scripts are ready:
- ✅ `installers/macos/install.sh` - Auto-installer
- ✅ `installers/macos/create_installer_package.sh` - DMG builder
- ✅ All dependencies configured
- ✅ Everything ready to build!

Just need to run on macOS to create the DMG file!
