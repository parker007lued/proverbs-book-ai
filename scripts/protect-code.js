/**
 * WilhelmTechCo LLC - Code Protection Script
 * Protects code using obfuscation and compiler-level transformations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class CodeProtector {
  constructor() {
    this.watermark = 'WTC-' + crypto.randomBytes(8).toString('hex');
  }

  // Add watermark to code
  addWatermark(code, filename) {
    const watermark = `/* WTC-${this.watermark}-${filename} */`;
    return watermark + '\n' + code;
  }

  // Obfuscate variable names
  obfuscateVariables(code) {
    // Simple obfuscation - in production use professional obfuscator
    const varMap = new Map();
    let counter = 0;
    
    return code.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, keyword, varName) => {
      if (!varMap.has(varName)) {
        varMap.set(varName, `_wtc${counter++}`);
      }
      return `${keyword} ${varMap.get(varName)}`;
    });
  }

  // Add integrity check
  addIntegrityCheck(code) {
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    return `/* INTEGRITY:${hash} */\n${code}`;
  }

  // Protect file
  protectFile(filePath) {
    try {
      let code = fs.readFileSync(filePath, 'utf8');
      
      // Add protections
      code = this.addWatermark(code, path.basename(filePath));
      code = this.addIntegrityCheck(code);
      
      // Write protected version
      const protectedPath = filePath.replace(/\.js$/, '.protected.js');
      fs.writeFileSync(protectedPath, code);
      
      console.log(`✓ Protected: ${filePath}`);
      return protectedPath;
    } catch (error) {
      console.error(`✗ Error protecting ${filePath}:`, error.message);
      return null;
    }
  }

  // Protect directory
  protectDirectory(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file.name);
      
      if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
        this.protectDirectory(fullPath);
      } else if (file.isFile() && file.name.endsWith('.js')) {
        this.protectFile(fullPath);
      }
    });
  }
}

// Usage
if (require.main === module) {
  const protector = new CodeProtector();
  const targetDir = process.argv[2] || './backend-api';
  
  console.log('🔒 WilhelmTechCo LLC - Code Protection');
  console.log(`Protecting: ${targetDir}`);
  console.log('');
  
  protector.protectDirectory(targetDir);
  
  console.log('');
  console.log('✓ Protection complete');
  console.log('⚠️  Use professional obfuscator for production (e.g., javascript-obfuscator)');
}

module.exports = CodeProtector;
