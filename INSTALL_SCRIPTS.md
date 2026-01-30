# Running Installation Scripts

## Quick Commands

### Windows (PowerShell)

**Option 1: Run directly (if execution policy allows)**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/install_dependencies.ps1
```

**Option 2: Run as Administrator (recommended)**
1. Right-click on PowerShell
2. Select "Run as Administrator"
3. Navigate to the project directory:
   ```powershell
   cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
   ```
4. Run the script:
   ```powershell
   .\scripts\install_dependencies.ps1
   ```

**Option 3: If you get execution policy errors**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\install_dependencies.ps1
```

### macOS / Linux

**Make script executable and run:**
```bash
chmod +x scripts/install_dependencies.sh
./scripts/install_dependencies.sh
```

**Or run directly with bash:**
```bash
bash scripts/install_dependencies.sh
```

**Note:** You may need sudo for some installations:
```bash
sudo bash scripts/install_dependencies.sh
```

## What the Scripts Do

### Windows Script (`install_dependencies.ps1`)
- Checks if Ollama is installed, opens download page if not
- Checks if Pandoc is installed, opens download page if not
- Checks if Python is installed, opens download page if not
- Installs Python packages automatically if Python is available

### macOS/Linux Script (`install_dependencies.sh`)
- Installs Ollama automatically via curl script
- Installs Pandoc via Homebrew (macOS) or apt-get (Linux)
- Checks Python installation
- Installs Python packages automatically

## Alternative: Let the App Install Dependencies

The easiest way is to just **run the application** - it will automatically check and install dependencies on startup!

```bash
npm install
npm run tauri dev
```

The app will show a dependency checker UI that allows you to install missing dependencies with one click.
