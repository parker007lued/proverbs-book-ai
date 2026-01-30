# Proverbs Book AI - Desktop Application

A complete native macOS desktop application with installer.

## 🎯 What This Is

A **real desktop app** that:
- ✅ Installs like any Mac app (drag to Applications)
- ✅ Runs from Applications folder
- ✅ Looks and feels native
- ✅ Includes automatic dependency installation
- ✅ Works offline after setup

## 🚀 Building the Installer

### On macOS:

```bash
cd desktop_app
chmod +x build-installer.sh
./build-installer.sh
```

This creates: `dist/Proverbs Book AI-*.dmg`

### Manual Build:

```bash
npm install
npm run build:mac
```

## 📦 What Gets Created

1. **DMG Installer** (`Proverbs Book AI-*.dmg`)
   - Double-click to open
   - Drag app to Applications folder
   - Standard Mac installer experience

2. **Application Bundle** (`Proverbs Book AI.app`)
   - Native macOS app
   - Runs from Applications
   - Appears in Dock

## 🎁 For Your Mother

**Send her:** `Proverbs Book AI-*.dmg`

**She:**
1. Double-clicks the DMG
2. Drags the app to Applications
3. Opens from Applications folder
4. First launch installs dependencies automatically
5. Ready to use!

## ✨ Features

- **Native macOS App** - Looks and feels like a real Mac app
- **Automatic Setup** - Installs dependencies on first launch
- **AI Text Generation** - Generate chapters with Ollama
- **Book Export** - Export to PDF or EPUB
- **Chapter Management** - Save and organize chapters
- **Beautiful UI** - Modern, clean interface

## 🔧 Requirements for Building

- macOS (for building macOS installer)
- Node.js 18+
- npm

## 📋 App Structure

```
desktop_app/
├── main.js          # Electron main process
├── preload.js       # Secure IPC bridge
├── renderer.js      # Frontend logic
├── index.html       # UI
├── styles.css       # Styling
├── package.json     # Dependencies & build config
└── assets/          # Icons and resources
```

## 🆚 vs Simple Installer

| Feature | Desktop App | Simple Installer |
|---------|------------|------------------|
| Installation | DMG installer | Python script |
| Appearance | Native Mac app | Web browser |
| Location | Applications folder | Terminal |
| Updates | Rebuild DMG | Update script |
| User Experience | Professional | Simple |

**The desktop app is the professional solution - looks like a real Mac application!**
