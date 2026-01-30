#!/bin/bash
# Complete Setup Script for Proverbs Book AI (macOS/Linux)
# This script navigates to the project directory and installs everything

PROJECT_PATH="$HOME/Desktop/Moms AI Model For Proverbs"

# If the default path doesn't exist, try to find it
if [ ! -d "$PROJECT_PATH" ]; then
    # Try common locations
    if [ -d "$HOME/OneDrive/Desktop/Moms AI Model For Proverbs" ]; then
        PROJECT_PATH="$HOME/OneDrive/Desktop/Moms AI Model For Proverbs"
    elif [ -d "./Moms AI Model For Proverbs" ]; then
        PROJECT_PATH="./Moms AI Model For Proverbs"
    else
        echo "ERROR: Project directory not found!"
        echo "Please update PROJECT_PATH in this script or run from the project directory"
        exit 1
    fi
fi

echo "Proverbs Book AI - Complete Setup"
echo "================================"
echo ""

# Navigate to project directory
echo "Navigating to project directory..."
cd "$PROJECT_PATH" || exit 1
echo "Current directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found. Are you in the correct directory?"
    echo "Expected: $PROJECT_PATH"
    exit 1
fi

# Install npm packages
echo "Step 1: Installing npm packages..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: npm install failed"
        exit 1
    fi
    echo "npm packages installed successfully!"
else
    echo "npm packages already installed, skipping..."
fi
echo ""

# Install system dependencies
echo "Step 2: Installing system dependencies..."
if [ -f "scripts/install_dependencies.sh" ]; then
    chmod +x scripts/install_dependencies.sh
    bash scripts/install_dependencies.sh
else
    echo "WARNING: install_dependencies.sh not found"
fi
echo ""

# Verify installations
echo "Step 3: Verifying installations..."

# Check Ollama
echo "Checking Ollama..."
if command -v ollama &> /dev/null; then
    OLLAMA_VERSION=$(ollama --version 2>&1)
    echo "  ✓ Ollama: $OLLAMA_VERSION"
else
    echo "  ✗ Ollama: Not found"
fi

# Check Pandoc
echo "Checking Pandoc..."
if command -v pandoc &> /dev/null; then
    PANDOC_VERSION=$(pandoc --version 2>&1 | head -n 1)
    echo "  ✓ Pandoc: $PANDOC_VERSION"
else
    echo "  ✗ Pandoc: Not found"
fi

# Check Python
echo "Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    echo "  ✓ Python: $PYTHON_VERSION"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1)
    echo "  ✓ Python: $PYTHON_VERSION"
else
    echo "  ✗ Python: Not found"
fi
echo ""

# Final message
echo "Setup Complete!"
echo ""
echo "To run the application:"
echo "  npm run tauri dev"
echo ""
echo "Or build for production:"
echo "  npm run tauri build"
echo ""
