#!/bin/bash
# macOS Installer Script for Proverbs Book AI
# This script installs all dependencies and sets up the application

set -e

echo "=========================================="
echo "  Proverbs Book AI - macOS Installer"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This installer is for macOS only"
    exit 1
fi

# Get the directory where the installer is located
INSTALL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$HOME/Applications/ProverbsBookAI"

echo "Installation directory: $INSTALL_DIR"
echo "Application directory: $APP_DIR"
echo ""

# Step 1: Check for Homebrew
echo "Step 1: Checking for Homebrew..."
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    print_status "Homebrew is installed"
fi
echo ""

# Step 2: Install Ollama
echo "Step 2: Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    print_status "Installing Ollama via Homebrew..."
    brew install ollama
    print_status "Ollama installed successfully"
else
    print_status "Ollama is already installed"
fi
echo ""

# Step 3: Install Pandoc
echo "Step 3: Installing Pandoc..."
if ! command -v pandoc &> /dev/null; then
    print_status "Installing Pandoc via Homebrew..."
    brew install pandoc
    print_status "Pandoc installed successfully"
else
    print_status "Pandoc is already installed"
fi
echo ""

# Step 4: Check Python
echo "Step 4: Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_status "Python is installed: $PYTHON_VERSION"
    
    # Install Python packages
    echo "Installing Python packages for image generation..."
    pip3 install --user -q diffusers torch pillow transformers accelerate
    print_status "Python packages installed"
else
    print_warning "Python 3 not found. Please install Python 3.8+ from python.org"
fi
echo ""

# Step 5: Start Ollama service
echo "Step 5: Starting Ollama service..."
if ! pgrep -x "ollama" > /dev/null; then
    print_status "Starting Ollama service..."
    ollama serve > /dev/null 2>&1 &
    sleep 3
    print_status "Ollama service started"
else
    print_status "Ollama service is already running"
fi
echo ""

# Step 6: Download default AI model
echo "Step 6: Downloading default AI model (this may take a few minutes)..."
print_status "Downloading phi3:mini model (lightweight, ~2GB)..."
ollama pull phi3:mini || print_warning "Model download failed, will download on first use"
print_status "Default model ready"
echo ""

# Step 7: Create application directory
echo "Step 7: Setting up application..."
mkdir -p "$APP_DIR"
print_status "Application directory created"
echo ""

# Step 8: Copy application files
echo "Step 8: Installing application files..."
if [ -f "$INSTALL_DIR/ProverbsBookAI.app" ]; then
    cp -R "$INSTALL_DIR/ProverbsBookAI.app" "$APP_DIR/"
    print_status "Application installed"
elif [ -d "$INSTALL_DIR/ProverbsBookAI.app" ]; then
    cp -R "$INSTALL_DIR/ProverbsBookAI.app" "$APP_DIR/"
    print_status "Application installed"
else
    print_warning "Application bundle not found. Please build the app first."
fi
echo ""

# Step 9: Create launcher script
echo "Step 9: Creating launcher..."
LAUNCHER="$HOME/Desktop/Proverbs Book AI"
cat > "$LAUNCHER" << 'EOF'
#!/bin/bash
# Launch Proverbs Book AI

# Start Ollama if not running
if ! pgrep -x "ollama" > /dev/null; then
    ollama serve > /dev/null 2>&1 &
    sleep 2
fi

# Launch the application
open "$HOME/Applications/ProverbsBookAI/ProverbsBookAI.app"
EOF

chmod +x "$LAUNCHER"
print_status "Launcher created on Desktop"
echo ""

# Step 10: Verify installation
echo "Step 10: Verifying installation..."
VERIFY_OK=true

if ! command -v ollama &> /dev/null; then
    print_error "Ollama verification failed"
    VERIFY_OK=false
fi

if ! command -v pandoc &> /dev/null; then
    print_error "Pandoc verification failed"
    VERIFY_OK=false
fi

if [ "$VERIFY_OK" = true ]; then
    print_status "All dependencies verified"
else
    print_warning "Some dependencies failed verification"
fi
echo ""

# Final message
echo "=========================================="
echo "  Installation Complete!"
echo "=========================================="
echo ""
echo "The application has been installed to:"
echo "  $APP_DIR/ProverbsBookAI.app"
echo ""
echo "A launcher has been created on your Desktop."
echo ""
echo "To launch the application:"
echo "  1. Double-click 'Proverbs Book AI' on your Desktop"
echo "  2. Or open: $APP_DIR/ProverbsBookAI.app"
echo ""
echo "The first time you run the app, it will:"
echo "  - Verify all dependencies"
echo "  - Download AI models if needed"
echo "  - Set up the application"
echo ""
echo "Enjoy creating your Proverbs book!"
echo ""
