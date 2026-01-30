#!/bin/bash
# Complete Mac Installer for Proverbs Book AI
# Downloads and installs everything automatically

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  PROVERBS BOOK AI - MAC INSTALLER"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}Error: This installer is for macOS only${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Installing Homebrew (if needed)...${NC}"
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Add Homebrew to PATH
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f "/usr/local/bin/brew" ]]; then
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}✓ Homebrew already installed${NC}"
fi

echo ""
echo -e "${GREEN}Step 2: Installing Ollama...${NC}"
if ! command -v ollama &> /dev/null; then
    echo "Downloading and installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo -e "${GREEN}✓ Ollama installed${NC}"
else
    echo -e "${GREEN}✓ Ollama already installed${NC}"
fi

echo ""
echo -e "${GREEN}Step 3: Installing Pandoc...${NC}"
if ! command -v pandoc &> /dev/null; then
    echo "Installing Pandoc..."
    brew install pandoc
    echo -e "${GREEN}✓ Pandoc installed${NC}"
else
    echo -e "${GREEN}✓ Pandoc already installed${NC}"
fi

echo ""
echo -e "${GREEN}Step 4: Installing Node.js (if needed)...${NC}"
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    brew install node
    echo -e "${GREEN}✓ Node.js installed${NC}"
else
    echo -e "${GREEN}✓ Node.js already installed${NC}"
fi

echo ""
echo -e "${GREEN}Step 5: Starting Ollama service...${NC}"
# Kill any existing Ollama processes
pkill -f ollama || true
sleep 1

# Start Ollama in background
nohup ollama serve > /dev/null 2>&1 &
sleep 3

# Check if Ollama is running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ollama service started${NC}"
else
    echo -e "${YELLOW}⚠ Ollama service may need manual start${NC}"
fi

echo ""
echo -e "${GREEN}Step 6: Downloading AI Model (phi3:mini)...${NC}"
echo "This may take several minutes (model is ~2GB)..."
if ollama list | grep -q "phi3:mini"; then
    echo -e "${GREEN}✓ Model already downloaded${NC}"
else
    ollama pull phi3:mini
    echo -e "${GREEN}✓ Model downloaded${NC}"
fi

echo ""
echo -e "${GREEN}Step 7: Installing Node.js dependencies...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ package.json not found in current directory${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}  INSTALLATION COMPLETE!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "To run the app:"
echo "  npm start"
echo ""
echo "Or double-click the app icon if you have a .app file"
echo ""
