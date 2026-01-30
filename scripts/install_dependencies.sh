#!/bin/bash
# Automatic dependency installation script for Linux/macOS

set -e

echo "Proverbs Book AI - Dependency Installer"
echo "========================================"
echo ""

# Check for Ollama
if ! command -v ollama &> /dev/null; then
    echo "Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "Ollama installed successfully!"
else
    echo "Ollama is already installed."
fi

# Check for Pandoc
if ! command -v pandoc &> /dev/null; then
    echo "Installing Pandoc..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install pandoc
        else
            echo "Homebrew not found. Please install Pandoc manually from https://pandoc.org/installing.html"
            exit 1
        fi
    else
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y pandoc
        elif command -v yum &> /dev/null; then
            sudo yum install -y pandoc
        else
            echo "Package manager not found. Please install Pandoc manually."
            exit 1
        fi
    fi
    echo "Pandoc installed successfully!"
else
    echo "Pandoc is already installed."
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.8+ from https://www.python.org/downloads/"
    exit 1
else
    echo "Python is installed."
fi

# Install Python packages
echo "Installing Python packages..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
python3 -m pip install -r "$SCRIPT_DIR/requirements.txt"
echo "Python packages installed successfully!"

echo ""
echo "All dependencies installed successfully!"
echo "You can now run the application."
