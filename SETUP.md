# Setup Instructions

## Quick Start

1. **Install Dependencies**:
   - Install [Ollama](https://ollama.ai) for text generation
   - Install [Pandoc](https://pandoc.org/installing.html) for book export
   - Install Python 3.8+ for image generation (optional)

2. **Download AI Models**:
   ```bash
   ollama pull mistral:7b
   ```

3. **Install Python Packages** (for image generation):
   ```bash
   pip install -r scripts/requirements.txt
   ```

4. **Run the Application**:
   ```bash
   npm install
   npm run tauri dev
   ```

## Detailed Setup

### Windows

1. **Install Ollama**:
   - Download from https://ollama.ai/download/windows
   - Run the installer
   - Restart your computer

2. **Install Pandoc**:
   - Download from https://github.com/jgm/pandoc/releases
   - Run the installer
   - Add to PATH if not automatic

3. **Install Python**:
   - Download from https://www.python.org/downloads/
   - Check "Add Python to PATH" during installation
   - Install packages: `pip install -r scripts/requirements.txt`

### macOS

1. **Install Ollama**:
   ```bash
   brew install ollama
   ```
   Or download from https://ollama.ai/download/mac

2. **Install Pandoc**:
   ```bash
   brew install pandoc
   ```

3. **Install Python** (usually pre-installed):
   ```bash
   pip3 install -r scripts/requirements.txt
   ```

### Linux (Ubuntu/Debian)

1. **Install Ollama**:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Install Pandoc**:
   ```bash
   sudo apt-get install pandoc
   ```

3. **Install Python packages**:
   ```bash
   pip3 install -r scripts/requirements.txt
   ```

## Verification

After installation, verify everything works:

1. **Check Ollama**:
   ```bash
   ollama --version
   ```

2. **Check Pandoc**:
   ```bash
   pandoc --version
   ```

3. **Check Python**:
   ```bash
   python --version
   # or
   python3 --version
   ```

4. **Test Model Download**:
   ```bash
   ollama pull mistral:7b
   ```

## Troubleshooting

### Ollama Not Found

- Ensure Ollama is in your PATH
- Restart terminal/application after installation
- On Windows, restart computer if needed

### Pandoc Not Found

- Verify installation: `pandoc --version`
- Add to PATH manually if needed
- Restart terminal/application

### Python Issues

- Use `python3` instead of `python` on some systems
- Ensure pip is installed: `python -m ensurepip --upgrade`
- Use virtual environment if needed: `python -m venv venv`
