#!/bin/bash
# WilhelmTechCo LLC - Protected Build Script
# Builds application with code protection

echo "🔒 WilhelmTechCo LLC - Protected Build"
echo "======================================"
echo ""

# Install obfuscator
npm install -g javascript-obfuscator

# Build backend with protection
echo "Building backend with protection..."
cd backend-api
npm install

# Obfuscate critical files
javascript-obfuscator routes/donations.js --output routes/donations.protected.js --compact true --control-flow-flattening true
javascript-obfuscator routes/auth.js --output routes/auth.protected.js --compact true
javascript-obfuscator config/database.js --output config/database.protected.js --compact true

# Build desktop app
echo "Building desktop app..."
cd ../desktop_app
npm install
npm run build

echo ""
echo "✓ Protected build complete"
echo "⚠️  Review protected files before deployment"
