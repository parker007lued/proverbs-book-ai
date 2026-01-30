# Proverbs Book AI - iPad Web App

A Progressive Web App (PWA) that works on iPad and can be installed like a native app.

## 🎯 Features

- ✅ **Installable** - Add to home screen like a real app
- ✅ **Cross Icon** - Beautiful cross icon ✝
- ✅ **Offline Support** - Works without internet after first load
- ✅ **Full Screen** - No browser bars when installed
- ✅ **iPad Optimized** - Touch-friendly interface
- ✅ **Generate Chapters** - AI-powered content generation
- ✅ **Copy Functionality** - Copy text to clipboard
- ✅ **Save & Export** - Save chapters and export book

## 📱 Installation

### For End Users (Your Mother):

1. Open Safari on iPad
2. Visit the website
3. Tap Share button → "Add to Home Screen"
4. App appears with cross icon ✝

### For Developers:

1. Host the files on a web server
2. Ensure HTTPS (required for PWA)
3. Users can install via Safari

## 📦 Files

- `index.html` - Main app
- `manifest.json` - PWA manifest
- `icons/` - Cross icons (192x192, 512x512)
- `create-cross-icon.py` - Icon generator script

## 🚀 Deployment

### Option 1: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages
3. Share the URL

### Option 2: Netlify/Vercel
1. Connect repository
2. Deploy automatically
3. Get HTTPS URL

### Option 3: Local Server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

## ✝️ Icon

The app uses a cross icon ✝ that appears on the iPad home screen.

## 📋 Requirements

- iPad with Safari
- HTTPS connection (for PWA features)
- Modern browser (iOS 11.3+)

## 🎉 Result

A beautiful, installable web app that works like a native iPad app!
