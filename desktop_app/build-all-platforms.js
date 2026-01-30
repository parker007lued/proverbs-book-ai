// Build script for all platforms
// Creates installers for Windows, Mac, and Linux

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  BUILDING PROVERBS BOOK AI - ALL PLATFORMS');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// Check if privacy policy exists
if (!fs.existsSync('privacy-policy.html')) {
    console.error('ERROR: privacy-policy.html not found!');
    process.exit(1);
}

// Build function
function build(platform) {
    console.log(`Building for ${platform}...`);
    try {
        execSync(`npm run build:${platform}`, { stdio: 'inherit' });
        console.log(`✓ ${platform} build complete!\n`);
    } catch (error) {
        console.error(`✗ ${platform} build failed:`, error.message);
    }
}

// Get platform
const platform = process.platform;
const buildAll = process.argv.includes('--all');

if (buildAll) {
    // Build for all platforms
    console.log('Building for ALL platforms...\n');
    build('win');
    build('mac');
    build('linux');
} else {
    // Build for current platform
    if (platform === 'win32') {
        build('win');
    } else if (platform === 'darwin') {
        build('mac');
    } else if (platform === 'linux') {
        build('linux');
    } else {
        console.log('Unknown platform. Use --all to build for all platforms.');
    }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  BUILD COMPLETE!');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log('Installers created in: dist/');
console.log('');
