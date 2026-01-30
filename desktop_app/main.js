const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const AuthManager = require('./auth');

let mainWindow;
let authWindow = null;
let privacyWindow = null;
let ollamaProcess = null;
const OLLAMA_URL = 'http://localhost:11434';
const authManager = new AuthManager();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#667eea'
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Auto-updater configuration
const UPDATE_SERVER_URL = process.env.UPDATE_SERVER_URL || 'https://your-api-domain.com/api/updates';
autoUpdater.setFeedURL({
  provider: 'generic',
  url: UPDATE_SERVER_URL
});

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info);
  }
});

autoUpdater.on('update-not-available', () => {
  console.log('No updates available');
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded', info);
  }
  // Auto-install on quit
  autoUpdater.quitAndInstall(false, true);
});

app.whenReady().then(async () => {
  // Check for updates
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates();
    // Check every hour
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 3600000);
  }

  // Check privacy policy acceptance first
  const privacyAccepted = await checkPrivacyPolicy();
  if (!privacyAccepted) {
    showPrivacyPolicyWindow();
    return;
  }

  // Initialize auth
  await authManager.init();

  // Check if user is logged in
  if (!authManager.user) {
    showLoginWindow();
  } else {
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (authManager.user) {
        createWindow();
      } else {
        showLoginWindow();
      }
    }
  });

  // Check dependencies on startup
  if (mainWindow) {
    checkDependenciesOnStartup();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Stop Ollama if we started it
  if (ollamaProcess) {
    ollamaProcess.kill();
  }
});

// Check dependencies on startup
async function checkDependenciesOnStartup() {
  try {
    const ollamaStatus = await checkOllama();
    if (!ollamaStatus.installed || !ollamaStatus.running) {
      // Show dependency dialog
      mainWindow.webContents.send('show-dependency-dialog', {
        ollama: ollamaStatus
      });
    }
  } catch (error) {
    console.error('Error checking dependencies:', error);
  }
}

// IPC Handlers
ipcMain.handle('check-ollama', async () => {
  return await checkOllama();
});

async function checkOllama() {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2000 });
    return { installed: true, running: true };
  } catch (error) {
    // Check if Ollama is installed
    return new Promise((resolve) => {
      const command = process.platform === 'win32' ? 'where ollama' : 'which ollama';
      exec(command, (err) => {
        if (err) {
          resolve({ installed: false, running: false });
        } else {
          resolve({ installed: true, running: false });
        }
      });
    });
  }
}

ipcMain.handle('install-ollama', async () => {
  return new Promise((resolve, reject) => {
    let command;
    if (process.platform === 'darwin') {
      // macOS - use curl to install
      command = 'curl -fsSL https://ollama.ai/install.sh | sh';
      exec(command, { shell: '/bin/bash' }, (error, stdout, stderr) => {
        if (error) {
          reject({ success: false, error: error.message });
        } else {
          resolve({ success: true, message: 'Ollama installed successfully' });
        }
      });
    } else if (process.platform === 'win32') {
      // Windows - use chocolatey or direct download
      command = 'choco install ollama -y';
      exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
        if (error) {
          // Try direct download
          shell.openExternal('https://ollama.ai/download');
          resolve({ success: true, message: 'Please complete installation from browser' });
        } else {
          resolve({ success: true, message: 'Ollama installed successfully' });
        }
      });
    } else {
      reject({ success: false, error: 'Platform not supported' });
    }
  });
});

ipcMain.handle('start-ollama', async () => {
  return new Promise((resolve) => {
    // Check if already running
    axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2000 })
      .then(() => {
        resolve({ success: true, message: 'Ollama is already running' });
      })
      .catch(() => {
        // Start Ollama
        if (process.platform === 'win32') {
          ollamaProcess = spawn('ollama', ['serve'], {
            detached: true,
            stdio: 'ignore'
          });
          ollamaProcess.unref();
        } else {
          ollamaProcess = spawn('ollama', ['serve'], {
            detached: true,
            stdio: 'ignore'
          });
          ollamaProcess.unref();
        }
        
        // Wait a bit and check
        setTimeout(() => {
          axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2000 })
            .then(() => {
              resolve({ success: true, message: 'Ollama started successfully' });
            })
            .catch(() => {
              resolve({ success: false, message: 'Ollama may need to be started manually' });
            });
        }, 3000);
      });
  });
});

ipcMain.handle('download-model', async (event, modelName = 'phi3:mini') => {
  return new Promise((resolve, reject) => {
    exec(`ollama pull ${modelName}`, (error, stdout, stderr) => {
      if (error) {
        reject({ success: false, error: error.message });
      } else {
        resolve({ success: true, message: `Model ${modelName} downloaded successfully` });
      }
    });
  });
});

ipcMain.handle('check-model-installed', async (event, modelName = 'phi3:mini') => {
  return new Promise((resolve) => {
    exec('ollama list', (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(stdout.includes(modelName));
      }
    });
  });
});

ipcMain.handle('generate-text', async (event, { chapter, contentType, model = 'phi3:mini' }) => {
  try {
    // Get Proverbs chapter data
    const proverbsPath = path.join(__dirname, 'database', 'proverbs.json');
    let proverbsData = {};
    if (fs.existsSync(proverbsPath)) {
      proverbsData = JSON.parse(fs.readFileSync(proverbsPath, 'utf8'));
    }
    
    const chapterData = proverbsData[chapter] || { verses: [], summary: '' };
    const verses = chapterData.verses || [];
    
    // Build prompt
    const prompt = `Write an original ${contentType} on Proverbs chapter ${chapter}. 
    
The verses are:
${verses.map((v, i) => `${i + 1}. ${v}`).join('\n')}

Make it personal, insightful, and original. Do not plagiarize. Write in a warm, engaging style.`;

    // Call Ollama
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false
    }, {
      timeout: 120000 // 2 minutes
    });

    return {
      success: true,
      text: response.data.response || response.data.text
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('check-pandoc', async () => {
  return new Promise((resolve) => {
    exec('pandoc --version', (error) => {
      resolve({ installed: !error });
    });
  });
});

// Orthodox Calendar & Daily Scripture
ipcMain.handle('get-orthodox-calendar-info', async () => {
  try {
    const orthodoxCalendar = require('./orthodox-calendar');
    const todayInfo = orthodoxCalendar.getTodayInfo();
    return { success: true, info: todayInfo };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-daily-scripture', async () => {
  try {
    // Fetch from Orthodox lectionary API or use local data
    // For now, return structure - in production would fetch from:
    // https://www.oca.org/readings or similar Orthodox lectionary
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Simplified daily reading - in production would use actual lectionary
    const readings = {
      date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      epistle: {
        citation: 'Romans 8:28-39',
        text: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose...'
      },
      gospel: {
        citation: 'Matthew 10:32-33, 37-38, 19:27-30',
        text: 'Therefore whoever confesses Me before men, him I will also confess before My Father who is in heaven...'
      },
      oldTestament: {
        citation: 'Proverbs 10:31-11:12',
        text: 'The mouth of the righteous brings forth wisdom, but the perverse tongue will be cut out...'
      },
      psalms: {
        citation: 'Psalm 33',
        text: 'Rejoice in the Lord, O you righteous! For praise from the upright is beautiful...'
      }
    };
    
    return { success: true, readings };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-book', async (event, { chapters, format = 'pdf' }) => {
  try {
    // Create markdown content
    let markdown = '# Proverbs Book\n\n';
    markdown += '*Generated with Proverbs Book AI*\n\n';
    
    chapters.forEach(ch => {
      markdown += `## Chapter ${ch.number}: ${ch.contentType}\n\n${ch.content}\n\n---\n\n`;
    });

    // Save markdown
    const outputDir = path.join(app.getPath('documents'), 'Proverbs Book');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const mdPath = path.join(outputDir, 'proverbs-book.md');
    fs.writeFileSync(mdPath, markdown);

    // Convert to PDF/EPUB if Pandoc is available
    if (format !== 'md') {
      const pandocCheck = await ipcMain.handle('check-pandoc');
      if (pandocCheck && pandocCheck.installed) {
        const outputPath = path.join(outputDir, `proverbs-book.${format}`);
        exec(`pandoc "${mdPath}" -o "${outputPath}"`, (error) => {
          if (error) {
            dialog.showErrorBox('Export Error', 'Failed to export book. Markdown saved instead.');
          } else {
            shell.openPath(outputDir);
          }
        });
      } else {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Pandoc Not Installed',
          message: 'Pandoc is required for PDF/EPUB export. Markdown file saved instead.'
        });
        shell.openPath(outputDir);
      }
    } else {
      shell.openPath(outputDir);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
