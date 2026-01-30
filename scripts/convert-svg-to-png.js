/**
 * Convert SVG to PNG using Node.js
 * WilhelmTechCo LLC
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function convertSVGtoPNG() {
  const svgPath = path.join(__dirname, '..', 'logo.svg');
  const pngPath = path.join(__dirname, '..', 'logo.png');

  console.log('🖼️  Converting SVG to PNG...\n');

  // Try ImageMagick
  try {
    execSync(`magick "${svgPath}" -resize 512x512 -background none "${pngPath}"`, { stdio: 'ignore' });
    if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 1000) {
      console.log('✓ Converted using ImageMagick');
      return true;
    }
  } catch (e) {
    // ImageMagick not available
  }

  // Try Inkscape
  try {
    execSync(`inkscape "${svgPath}" --export-filename="${pngPath}" --export-width=512 --export-background-opacity=0`, { stdio: 'ignore' });
    if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 1000) {
      console.log('✓ Converted using Inkscape');
      return true;
    }
  } catch (e) {
    // Inkscape not available
  }

  // Try sharp (Node.js library)
  try {
    const sharp = require('sharp');
    sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(pngPath)
      .then(() => {
        console.log('✓ Converted using Sharp');
        return true;
      })
      .catch(() => false);
  } catch (e) {
    // Sharp not available
  }

  console.log('⚠️  No conversion tool found. Install ImageMagick or use online converter.');
  return false;
}

if (require.main === module) {
  convertSVGtoPNG();
}

module.exports = { convertSVGtoPNG };
