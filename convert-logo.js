// Convert SVG to PNG
const sharp = require('sharp');
const fs = require('fs');

async function convertLogo() {
  try {
    console.log('Converting logo.svg to logo.png...');
    
    await sharp('logo.svg')
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile('logo.png');
    
    const stats = fs.statSync('logo.png');
    console.log(`✓ Success! PNG created: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('Opening logo.png...');
    
    // Open file
    const { exec } = require('child_process');
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      command = 'start logo.png';
    } else if (platform === 'darwin') {
      command = 'open logo.png';
    } else {
      command = 'xdg-open logo.png';
    }
    
    exec(command);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nTrying alternative method...');
    
    // Fallback: Create HTML file to view SVG
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>WilhelmTechCo Logo</title>
  <style>
    body { 
      background: #000; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      margin: 0; 
    }
    svg { 
      width: 512px; 
      height: 512px; 
    }
  </style>
</head>
<body>
${fs.readFileSync('logo.svg', 'utf8')}
</body>
</html>`;
    
    fs.writeFileSync('logo-preview.html', html);
    console.log('Created logo-preview.html - open in browser and save as PNG');
  }
}

convertLogo();
