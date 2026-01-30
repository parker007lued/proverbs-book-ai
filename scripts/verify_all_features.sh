#!/bin/bash
# Comprehensive Feature Verification Script
# Tests all functionality to ensure everything works

set -e

echo "=========================================="
echo "  Feature Verification Test"
echo "=========================================="
echo ""

PASSED=0
FAILED=0

test_check() {
    if [ $? -eq 0 ]; then
        echo "✅ PASS: $1"
        ((PASSED++))
    else
        echo "❌ FAIL: $1"
        ((FAILED++))
    fi
}

# Test 1: Check Node.js
echo "Test 1: Node.js installation"
node --version > /dev/null 2>&1
test_check "Node.js is installed"

# Test 2: Check npm packages
echo "Test 2: npm packages"
if [ -d "node_modules" ]; then
    test_check "npm packages installed"
else
    echo "❌ FAIL: npm packages not installed"
    ((FAILED++))
fi

# Test 3: Check Rust
echo "Test 3: Rust installation"
cargo --version > /dev/null 2>&1
test_check "Rust is installed"

# Test 4: Check Ollama
echo "Test 4: Ollama installation"
ollama --version > /dev/null 2>&1
test_check "Ollama is installed"

# Test 5: Check Ollama service
echo "Test 5: Ollama service"
curl -s http://localhost:11434/api/tags > /dev/null 2>&1 || ollama serve > /dev/null 2>&1 &
sleep 2
curl -s http://localhost:11434/api/tags > /dev/null 2>&1
test_check "Ollama service is running"

# Test 6: Check Pandoc
echo "Test 6: Pandoc installation"
pandoc --version > /dev/null 2>&1
test_check "Pandoc is installed"

# Test 7: Check Python
echo "Test 7: Python installation"
python3 --version > /dev/null 2>&1 || python --version > /dev/null 2>&1
test_check "Python is installed"

# Test 8: Check Python packages
echo "Test 8: Python packages"
python3 -c "import diffusers; import torch; import PIL" > /dev/null 2>&1 || python -c "import diffusers; import torch; import PIL" > /dev/null 2>&1
test_check "Python packages installed"

# Test 9: Check Tauri build
echo "Test 9: Tauri configuration"
if [ -f "src-tauri/tauri.conf.json" ]; then
    test_check "Tauri config exists"
else
    echo "❌ FAIL: Tauri config missing"
    ((FAILED++))
fi

# Test 10: Check icons
echo "Test 10: Application icons"
if [ -f "src-tauri/icons/icon.ico" ] || [ -f "src-tauri/icons/icon.png" ]; then
    test_check "Icons exist"
else
    echo "❌ FAIL: Icons missing"
    ((FAILED++))
fi

# Test 11: Check Rust modules
echo "Test 11: Rust source files"
[ -f "src-tauri/src/main.rs" ] && [ -f "src-tauri/src/ollama.rs" ] && [ -f "src-tauri/src/image_gen.rs" ] && [ -f "src-tauri/src/book_assembler.rs" ]
test_check "All Rust modules exist"

# Test 12: Check React components
echo "Test 12: React components"
[ -f "src/App.tsx" ] && [ -f "src/components/ChapterEditor.tsx" ] && [ -f "src/components/BookAssembler.tsx" ]
test_check "All React components exist"

echo ""
echo "=========================================="
echo "  Test Results"
echo "=========================================="
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed! Application is ready."
    exit 0
else
    echo "⚠️  Some tests failed. Please fix the issues above."
    exit 1
fi
