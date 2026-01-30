# Proverbs Book AI - Self-Contained Application

A complete, self-contained Electron application that downloads all dependencies automatically and includes a local database of all Proverbs chapters.

## 🎯 Features

- ✅ **Self-Contained** - Everything bundled in one app
- ✅ **Auto-Download** - Downloads dependencies on first launch
- ✅ **Local Database** - All 31 Proverbs chapters included
- ✅ **Session Storage** - Saves progress and generated content
- ✅ **Image Generation** - Creates images for chapters
- ✅ **Progress Tracking** - Tracks which chapters are completed
- ✅ **Book Export** - Export to PDF or EPUB

## 🚀 Building

### On Windows:

```batch
build-standalone.bat
```

This creates: `Proverbs-Book-AI-Standalone.zip`

### On macOS:

```bash
npm install
npm run build:mac
```

## 📦 What's Included

- **Electron App** - Complete desktop application
- **Proverbs Database** - All 31 chapters with verses
- **Dependency Installer** - Auto-downloads Ollama, Pandoc, models
- **Image Generation** - Stable Diffusion integration
- **Session Storage** - SQLite database for progress

## 🎁 For Your Mother

**Send:** `Proverbs-Book-AI-Standalone.zip`

**She:**
1. Extracts the ZIP
2. Double-clicks the app
3. Clicks "Download & Install" when prompted
4. Waits for dependencies to download
5. App opens automatically
6. Ready to use!

## 📋 First Launch Flow

1. App opens
2. Shows dependency dialog
3. User clicks "Download & Install"
4. Downloads:
   - Ollama (~50MB)
   - Pandoc (~20MB)
   - AI Model (~2GB)
5. App restarts
6. Ready to generate chapters!

## 💾 Database Structure

- **proverbs** - All 31 chapters with verses
- **sessions** - Generated content for each chapter
- **progress** - Completion status and metadata
- **settings** - User preferences

## 🎨 Image Generation

Uses Stable Diffusion (or similar) to generate:
- Illustrations
- Decorative elements
- Symbolic images

Images saved to: `~/Library/Application Support/proverbs-book-ai/images/`

## 📖 Usage

1. **Load Chapter** - Click "Load Chapter" to see verses
2. **Generate** - Select content type and generate
3. **Save** - Save generated content
4. **Generate Image** - Create image for chapter
5. **Export** - Export complete book as PDF/EPUB

## 🔧 Technical Details

- **Electron** - Desktop framework
- **SQLite** - Local database (better-sqlite3)
- **Ollama** - Local LLM for text generation
- **Pandoc** - Book export
- **Stable Diffusion** - Image generation

## 🎉 Result

A complete, professional application that works offline after initial setup!
