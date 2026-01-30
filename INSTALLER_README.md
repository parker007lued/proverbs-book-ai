# Easy Installer and Launcher

## 🚀 Quick Start - Just Double-Click!

### Option 1: Full Installer (First Time)
**Double-click:** `Install and Launch.bat`

This will:
1. ✅ Check and install Node.js (if needed)
2. ✅ Install all npm packages
3. ✅ Install system dependencies (Ollama, Pandoc, Python packages)
4. ✅ Check for Rust
5. ✅ Launch the application

### Option 2: Quick Launcher (After First Install)
**Double-click:** `Launch App.bat`

Use this if everything is already installed - it just launches the app quickly.

### Option 3: Create Desktop Shortcut
**Double-click:** `Create Shortcut.vbs`

This creates a shortcut on your desktop that you can use anytime.

## 📋 What Each File Does

| File | Purpose | When to Use |
|------|---------|-------------|
| `Install and Launch.bat` | Full installer + launcher | First time setup |
| `Install and Launch.ps1` | PowerShell version (same as .bat) | If .bat doesn't work |
| `Launch App.bat` | Quick launcher | After everything is installed |
| `Create Shortcut.vbs` | Creates desktop shortcut | Once, to create shortcut |

## 🎯 Recommended Workflow

1. **First Time:**
   - Double-click `Install and Launch.bat`
   - Wait for everything to install
   - App will launch automatically

2. **Create Shortcut (Optional):**
   - Double-click `Create Shortcut.vbs`
   - Now you have a desktop shortcut

3. **Future Use:**
   - Double-click the desktop shortcut, OR
   - Double-click `Launch App.bat`

## ⚠️ Troubleshooting

### "Node.js is not installed"
- The installer will open the Node.js download page
- Install Node.js and run the installer again

### "Rust is not installed"
- The installer will open the Rust installation page
- Install Rust and run the installer again

### Script won't run (Windows Security)
- Right-click the .bat file
- Select "Run as Administrator"
- Or right-click → Properties → Unblock → OK

### PowerShell Script Blocked
- Open PowerShell as Administrator
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then try the .ps1 file

## 📝 Manual Installation

If the automated installer doesn't work, see:
- `QUICK_START.md` for manual setup instructions
- `SETUP.md` for detailed setup guide

## 🔧 Advanced Users

If you prefer command line:
```powershell
.\setup.ps1
npm run tauri dev
```
