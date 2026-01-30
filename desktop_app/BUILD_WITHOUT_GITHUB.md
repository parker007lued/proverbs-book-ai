# Building macOS Installer on Windows (Without GitHub)

## 🎯 Solution: Portable App + Mac Script

Build a portable app on Windows, then create the DMG on any Mac (even borrowed for 5 minutes).

## 🚀 Step 1: Build Portable App (On Windows)

**Run this on your Windows computer:**

```batch
cd desktop_app
build-on-windows.bat
```

Or manually:
```batch
npm install
node build-portable.js
```

**This creates:** `desktop_app/portable/Proverbs Book AI.app`

## 📦 Step 2: Create DMG (On Any Mac)

**You need access to ANY Mac for 5 minutes** (borrow a friend's, use library computer, etc.)

### Option A: Use the Script (Easiest)

1. Copy the `portable` folder to the Mac
2. Copy `create-dmg.sh` to the Mac
3. Open Terminal on Mac
4. Run:
   ```bash
   cd /path/to/portable
   chmod +x create-dmg.sh
   ./create-dmg.sh
   ```
5. **Done!** You now have `Proverbs Book AI Installer.dmg`

### Option B: Manual DMG Creation

1. Copy `portable/Proverbs Book AI.app` to Mac
2. Open Disk Utility (Applications → Utilities)
3. File → New Image → Image from Folder
4. Select the app
5. Choose "read-only" format
6. Save as DMG

## 🎁 Alternative: Send Portable App As-Is

**You can send the portable app directly!**

1. Build portable app on Windows (Step 1)
2. Zip the `portable` folder
3. Send to your mother
4. She extracts and double-clicks the app

**Note:** She'll need Electron installed:
```bash
brew install --cask electron
```

Or use the simple installer instead (no building needed).

## 📋 What Gets Created

### On Windows:
- `portable/Proverbs Book AI.app/` - Mac app bundle
- `portable/README.txt` - Instructions
- `portable/create-dmg.sh` - DMG creation script

### On Mac (after running script):
- `Proverbs Book AI Installer.dmg` - Ready to send!

## ⚡ Quick Method: Use Simple Installer

**Even easier:** Skip building entirely!

Send your mother: `simple_installer/install.py`

She runs: `python3 install.py`

**That's it!** No building, no Mac needed, works immediately.

## 🆚 Comparison

| Method | Windows Build | Mac Needed | Complexity |
|--------|--------------|-------------|------------|
| **Portable App** | ✅ Yes | ⏱️ 5 min | Medium |
| **Simple Installer** | ❌ No | ❌ No | Easy |
| **GitHub Actions** | ✅ Yes | ❌ No | Easy |

## 💡 Recommendation

**For fastest delivery:** Use the simple installer (`simple_installer/install.py`)

**For professional app:** Build portable on Windows, create DMG on any Mac

## 🎉 Result

Either way, your mother gets a working application!
