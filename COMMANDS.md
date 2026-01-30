# Quick Commands Reference

## 🚀 Easiest Way - Just Double-Click!

**Double-click this file:** `Install and Launch.bat`

That's it! It does everything automatically.

---

## 📋 Manual Commands (Copy & Paste)

### Option 1: Full Setup and Launch (Recommended)

**Open PowerShell in the project folder, then run:**

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
.\Install and Launch.bat
```

**Or use PowerShell script:**

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
powershell -ExecutionPolicy Bypass -File "Install and Launch.ps1"
```

### Option 2: Just Launch (After First Install)

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
.\Launch App.bat
```

### Option 3: Step-by-Step Manual Commands

```powershell
# Navigate to project
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"

# Install npm packages (if not done)
npm install

# Install system dependencies
powershell -ExecutionPolicy Bypass -File "scripts\install_dependencies.ps1"

# Install Rust and Build Tools (if needed)
powershell -ExecutionPolicy Bypass -File "scripts\install_rust_and_build_tools.ps1"

# Launch the app
npm run tauri dev
```

---

## 🔧 Individual Component Commands

### Check What's Installed

```powershell
# Check Node.js
node --version

# Check npm
npm --version

# Check Rust
$env:Path += ";$env:USERPROFILE\.cargo\bin"
cargo --version

# Check Ollama
ollama --version

# Check Pandoc
pandoc --version

# Check Python
python --version
```

### Install Individual Components

```powershell
# Install Rust and Build Tools
powershell -ExecutionPolicy Bypass -File "scripts\install_rust_and_build_tools.ps1"

# Install system dependencies (Ollama, Pandoc, Python packages)
powershell -ExecutionPolicy Bypass -File "scripts\install_dependencies.ps1"

# Install npm packages only
npm install
```

### Run Development Server Only

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
npm run tauri dev
```

### Build for Production

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
npm run tauri build
```

---

## 🎯 Most Common Commands

**First time setup:**
```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
.\Install and Launch.bat
```

**After setup, just launch:**
```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
npm run tauri dev
```

---

## ⚡ Quick Copy-Paste (All-in-One)

**Copy this entire block into PowerShell:**

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
$env:Path += ";$env:USERPROFILE\.cargo\bin"
npm install
powershell -ExecutionPolicy Bypass -File "scripts\install_dependencies.ps1"
npm run tauri dev
```

---

## 🆘 Troubleshooting Commands

**If Rust not found:**
```powershell
$env:Path += ";$env:USERPROFILE\.cargo\bin"
cargo --version
```

**If npm packages need update:**
```powershell
npm install
```

**If you need to restart everything:**
```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
.\Install and Launch.bat
```
