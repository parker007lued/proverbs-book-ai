# Building Proverbs Book AI

This document provides detailed instructions for building the application for all platforms.

## Prerequisites

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/

2. **Rust** (latest stable)
   - Install from: https://www.rust-lang.org/tools/install
   - Or use: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

3. **System Dependencies**:

   **Windows**:
   - Microsoft Visual C++ Build Tools
   - Windows SDK

   **macOS**:
   - Xcode Command Line Tools: `xcode-select --install`

   **Linux** (Ubuntu/Debian):
   ```bash
   sudo apt-get update
   sudo apt-get install libwebkit2gtk-4.0-dev \
       build-essential \
       curl \
       wget \
       libssl-dev \
       libgtk-3-dev \
       libayatana-appindicator3-dev \
       librsvg2-dev
   ```

## Build Steps

1. **Clone and navigate to the project**:
   ```bash
   git clone https://github.com/yourusername/proverbs-book-app.git
   cd proverbs-book-app
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Build the application**:
   ```bash
   npm run tauri build
   ```

   This will create platform-specific installers in:
   - Windows: `src-tauri/target/release/bundle/nsis/`
   - macOS: `src-tauri/target/release/bundle/dmg/`
   - Linux: `src-tauri/target/release/bundle/appimage/` or `deb/`

## Platform-Specific Notes

### Windows

- Builds create an NSIS installer (.exe)
- Requires Windows 10 or later
- Code signing (optional): Set `TAURI_SIGNING_PRIVATE_KEY` environment variable

### macOS

- Builds create a DMG file
- Requires macOS 10.15 or later
- Code signing (optional): Set `APPLE_CERTIFICATE` and `APPLE_CERTIFICATE_PASSWORD`

### Linux

- Builds create AppImage, .deb, or .rpm packages
- AppImage is recommended for maximum compatibility
- .deb for Debian/Ubuntu systems
- .rpm for Fedora/RHEL systems

## Development Build

For development (faster builds, no installer):

```bash
npm run tauri dev
```

This runs the app in development mode with hot-reload.

## Troubleshooting Build Issues

### Rust Compilation Errors

- Ensure Rust is up to date: `rustup update`
- Clean build: `cd src-tauri && cargo clean && cd ..`

### Tauri Build Errors

- Clear Tauri cache: `rm -rf src-tauri/target`
- Reinstall dependencies: `npm install && cd src-tauri && cargo update`

### Missing System Libraries

- Windows: Install Visual C++ Redistributables
- macOS: Install Xcode Command Line Tools
- Linux: Install development packages listed in prerequisites

## Creating Release Builds

1. **Update version** in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. **Build for all platforms** (requires each OS or use CI/CD):
   ```bash
   npm run tauri build
   ```

3. **Create GitHub Release** with all platform installers attached

## CI/CD Setup

Example GitHub Actions workflow (`.github/workflows/build.yml`):

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        platform: [windows-latest, macos-latest, ubuntu-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions-rs/toolchain@v1
      - run: npm install
      - run: npm run tauri build
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.platform }}
          path: src-tauri/target/release/bundle/
```
