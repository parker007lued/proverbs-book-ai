# Building macOS Installer for Your Mother

## Quick Build (On macOS)

### Step 1: Build the Application

```bash
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
npm run tauri build -- --target universal-apple-darwin
```

Or if you don't have universal target:
```bash
npm run tauri build
```

### Step 2: Create DMG Installer

```bash
cd installers/macos
chmod +x create_installer_package.sh
./create_installer_package.sh
```

This creates: `installers/macos/ProverbsBookAI-Installer.dmg`

### Step 3: Send to Your Mother

1. **Send the DMG file** to your mother
2. **She double-clicks it** to open
3. **Double-clicks `install.sh`** to install everything
4. **Done!** The app is ready to use

## What the Installer Does

The `install.sh` script automatically:
1. ✅ Installs Homebrew (if needed)
2. ✅ Installs Ollama via Homebrew
3. ✅ Installs Pandoc via Homebrew
4. ✅ Installs Python packages
5. ✅ Starts Ollama service
6. ✅ Downloads default AI model (phi3:mini)
7. ✅ Sets up the application
8. ✅ Creates Desktop launcher

## Alternative: Build on Windows for macOS

If you're on Windows, you'll need to:
1. Use GitHub Actions CI/CD
2. Or build on a Mac
3. Or use cross-compilation (more complex)

## Distribution Checklist

- [ ] Build application for macOS
- [ ] Create DMG installer
- [ ] Test installer on clean macOS system
- [ ] Verify all dependencies install
- [ ] Test first run experience
- [ ] Create user guide (MOM_INSTALLER_GUIDE.md)
- [ ] Package everything together

## File to Send

**Send this single file:**
`installers/macos/ProverbsBookAI-Installer.dmg`

That's it! Everything else is included.
