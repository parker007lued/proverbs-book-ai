# Quick Fix - Wrong Directory Error

## The Problem
You're getting `ENOENT: no such file or directory` because you're not in the project folder.

## The Solution

**Always navigate to the project directory first:**

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
```

**Then run your commands:**

```powershell
npm run tauri dev
```

## Quick Reference

**Full command sequence:**

```powershell
# Step 1: Navigate to project
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"

# Step 2: Run the app
npm run tauri dev
```

## Or Use the Installer

**Just double-click:** `Install and Launch.bat`

It handles navigation automatically!

## Check You're in the Right Place

You should see `package.json` in the current directory:

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
dir package.json
```

If you see the file, you're in the right place!
