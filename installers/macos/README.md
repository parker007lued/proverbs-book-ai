# macOS Installer for Proverbs Book AI

## Quick Install (For Your Mother)

**Simply double-click:** `ProverbsBookAI-Installer.dmg`

Then:
1. Drag `ProverbsBookAI.app` to Applications folder
2. Double-click `install.sh` to install all dependencies automatically
3. Launch the app from Applications

## What Gets Installed Automatically

- ✅ Ollama (AI text generation)
- ✅ Pandoc (book export)
- ✅ Python packages (image generation)
- ✅ Default AI model (phi3:mini)
- ✅ Application files

## Manual Installation

If the DMG installer doesn't work:

1. **Install Homebrew** (if not installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Run the installer script**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Launch the app**:
   ```bash
   open ~/Applications/ProverbsBookAI/ProverbsBookAI.app
   ```

## Building the DMG Installer

To create the DMG installer:

```bash
cd installers/macos
chmod +x build_dmg.sh
./build_dmg.sh
```

This will create `ProverbsBookAI-Installer.dmg` that you can distribute.

## Troubleshooting

### "App can't be opened because it's from an unidentified developer"

1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog
4. Or go to System Preferences → Security & Privacy → Allow

### Ollama not starting

```bash
ollama serve
```

### Models not downloading

The app will automatically download models on first use. You can also download manually:

```bash
ollama pull phi3:mini
```
