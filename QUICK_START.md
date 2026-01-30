# Quick Start Guide

## Windows - One Command Setup

**Just run this single command from anywhere:**

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs\setup.ps1"
```

**Or if you're already in PowerShell, navigate and run:**

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
.\setup.ps1
```

## macOS/Linux - One Command Setup

**Just run this single command from anywhere:**

```bash
bash "~/Desktop/Moms AI Model For Proverbs/setup.sh"
```

**Or if the path is different, navigate first:**

```bash
cd "/path/to/Moms AI Model For Proverbs"
bash setup.sh
```

## What the Setup Scripts Do

1. **Navigate to project directory** automatically
2. **Install npm packages** (Node.js dependencies)
3. **Install system dependencies** (Ollama, Pandoc, Python packages)
4. **Verify installations** and show status

## After Setup

Once setup is complete, run the application:

```bash
# Development mode
npm run tauri dev

# Or build for production
npm run tauri build
```

## Manual Steps (if needed)

If automatic installation fails, you can run individual scripts:

**Windows:**
```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
npm install
powershell -ExecutionPolicy Bypass -File scripts\install_dependencies.ps1
```

**macOS/Linux:**
```bash
cd ~/Desktop/Moms\ AI\ Model\ For\ Proverbs
npm install
bash scripts/install_dependencies.sh
```

## Troubleshooting

### "Cannot find path" error
- Make sure the project path is correct
- Update the path in `setup.ps1` or `setup.sh` if needed

### Permission errors
- Windows: Run PowerShell as Administrator
- macOS/Linux: Use `sudo` if needed (for system package installation)

### npm install fails
- Make sure Node.js is installed: `node --version`
- Install Node.js from: https://nodejs.org/
