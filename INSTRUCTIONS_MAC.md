# 📱 Mac Installation Instructions

## For Your Mother - Simple Mac Setup

### What You Need
- A Mac computer (MacBook, iMac, Mac Mini, etc.)
- Internet connection (for first-time setup)
- The file: `Proverbs-Book-AI-Standalone.zip`

---

## 📖 Before You Start

**Need help opening Terminal?**  
See **`HOW_TO_OPEN_TERMINAL.md`** for detailed instructions with pictures!

**Quick way to open Terminal:**
1. Press **Command (⌘) + Space**
2. Type: **Terminal**
3. Press **Enter**

---

## Step-by-Step Installation

### Step 1: Download the File
1. You'll receive a file called: **`Proverbs-Book-AI-Standalone.zip`**
2. Save it to your **Downloads** folder (or Desktop)

### Step 2: Extract the ZIP File
1. **Double-click** the ZIP file
2. It will automatically extract to a folder
3. You'll see a folder called: **`self-contained`**

### Step 3: Open Terminal

**What is Terminal?**  
Terminal is a program on your Mac that lets you type commands. Don't worry - it's safe and we'll guide you through it!

**How to Open Terminal (Choose One Method):**

**Method 1: Using Spotlight (Easiest)**
1. Press and hold the **Command** key (⌘) and the **Space** bar at the same time
2. A search box appears at the top center of your screen
3. Type: **Terminal** (you'll see it appear as you type)
4. Press **Enter** or click on "Terminal" when it appears
5. A black or white window opens - that's Terminal!

**Method 2: Using Finder**
1. Click the **Finder** icon in your Dock (bottom of screen)
2. Click **Applications** in the left sidebar
3. Open the **Utilities** folder
4. Double-click **Terminal**
5. Terminal window opens

**Method 3: Using Launchpad**
1. Press **F4** or pinch with thumb and three fingers on trackpad
2. Type: **Terminal**
3. Click on the Terminal icon
4. Terminal window opens

**What Terminal Looks Like:**
- A window with a black or white background
- Text that says something like: `YourName@YourMac ~ %`
- A blinking cursor where you can type
- This is normal and safe!

### Step 4: Navigate to the Folder
1. In Terminal, type:
   ```
   cd Downloads/self-contained
   ```
   (Or wherever you saved the file)
2. Press **Enter**

### Step 5: Install Dependencies
1. Type this command:
   ```
   npm install
   ```
2. Press **Enter**
3. Wait for installation (2-5 minutes)
4. This installs everything needed

### Step 6: Install AI Models (Optional but Recommended)
1. Type:
   ```
   chmod +x models/install-models.sh
   ./models/install-models.sh
   ```
2. Press **Enter**
3. Enter your password when asked
4. Wait for models to download (5-10 minutes, ~4GB)
5. This downloads the AI models

### Step 7: Start the App
1. Type:
   ```
   npm start
   ```
2. Press **Enter**
3. The app window opens!

---

## First Time Using the App

### When the App Opens:
1. **Dependency Check Dialog** appears
2. Click **"Download & Install"** if anything is missing
3. Wait for downloads to complete
4. App restarts automatically
5. Ready to use!

### Using the App:
1. **Select a chapter** (1-31)
2. **Choose content type** (Commentary, Summary, Devotional, etc.)
3. **Click "Generate Chapter"**
4. Wait 30-60 seconds
5. **Review and edit** the generated text
6. **Click "Save Chapter"**
7. **Repeat** for more chapters
8. **Click "Export as PDF"** when done!

---

## Troubleshooting

### "npm: command not found"
- Install Node.js: https://nodejs.org
- Download the Mac installer
- Run it and follow instructions

### "Permission denied"
- Make sure you're in the right folder
- Try: `chmod +x models/install-models.sh` again

### App won't start
- Make sure Terminal is in the correct folder
- Check that `npm install` completed successfully
- Try running `npm start` again

### Models won't download
- Make sure you have internet connection
- Check that Ollama is installed: `ollama --version`
- Try manually: `ollama pull mistral:7b`

---

## Quick Reference

### To Start the App:
```bash
cd Downloads/self-contained
npm start
```

### To Install Models:
```bash
./models/install-models.sh
```

### To Check if Everything Works:
```bash
npm start
```

---

## Features Available

✅ **Generate Chapters** - AI-powered text generation  
✅ **Save Progress** - All chapters saved automatically  
✅ **Export Book** - PDF and EPUB export  
✅ **Copy Text** - Copy to clipboard  
✅ **Image Generation** - Create images for chapters  
✅ **Progress Tracking** - See which chapters are done  

---

## Need Help?

- Check the Terminal window for error messages
- Make sure all steps completed successfully
- Try restarting Terminal and running commands again
- The app includes help text for each feature

---

## 🎉 You're All Set!

The app is now installed and ready to use on your Mac!
