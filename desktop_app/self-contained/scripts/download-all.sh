#!/bin/bash
# Download all dependencies for Proverbs Book AI

set -e

echo "=== Proverbs Book AI - Dependency Installer ==="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This installer is for macOS only"
    exit 1
fi

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo "Installing dependencies..."
echo ""

# Install Ollama
if ! command -v ollama &> /dev/null; then
    echo "1. Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "   ✓ Ollama installed"
else
    echo "1. ✓ Ollama already installed"
fi

# Install Pandoc
if ! command -v pandoc &> /dev/null; then
    echo "2. Installing Pandoc..."
    brew install pandoc
    echo "   ✓ Pandoc installed"
else
    echo "2. ✓ Pandoc already installed"
fi

# Start Ollama service
echo ""
echo "3. Starting Ollama service..."
ollama serve &
sleep 3
echo "   ✓ Ollama service started"

# Download default model
echo ""
echo "4. Downloading AI model (phi3:mini)..."
echo "   This may take several minutes (model is ~2GB)..."
ollama pull phi3:mini
echo "   ✓ Model downloaded"

echo ""
echo "=== Installation Complete! ==="
echo ""
echo "All dependencies are installed and ready to use."
echo "You can now run the Proverbs Book AI application."
