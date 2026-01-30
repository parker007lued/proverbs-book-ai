# Quick Build Guide - Building from Windows

## 🎯 Problem
You're on Windows but need to build a macOS installer.

## ✅ Solution: GitHub Actions (Automatic)

GitHub Actions will build the macOS installer automatically - no Mac needed!

## 🚀 Steps:

### 1. Push to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create a GitHub repository first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Trigger Build

**Option A: Automatic (on push)**
- Just push your code - it builds automatically!

**Option B: Manual trigger**
1. Go to GitHub repository
2. Click **"Actions"** tab
3. Select **"Build macOS Installer"** workflow
4. Click **"Run workflow"**
5. Click the green **"Run workflow"** button

### 3. Download Installer

1. Go to **"Actions"** tab
2. Click on the latest workflow run
3. Scroll down to **"Artifacts"**
4. Download **"Proverbs-Book-AI-macOS-Installer"**
5. Extract the DMG file

### 4. Send to Your Mother

Send her the DMG file - she can install it like any Mac app!

## 📋 Alternative: Create a Release

For easier distribution:

```bash
# Create a release tag
git tag v1.0.0
git push origin v1.0.0
```

Then:
1. Go to **"Releases"** in your GitHub repo
2. Edit the release
3. Download the DMG from the release page

## 🎉 That's It!

No Mac needed - GitHub builds it for you automatically!

## 🔧 Troubleshooting

### Build fails?
- Check the "Actions" tab for error messages
- Make sure `desktop_app/package.json` exists
- Ensure Node.js dependencies are correct

### Can't find the DMG?
- Check "Artifacts" section in the workflow run
- Make sure the build completed successfully
- Artifacts expire after 30 days

### Need help?
- Check GitHub Actions logs
- Verify all files are committed
- Make sure workflow file is in `.github/workflows/`
