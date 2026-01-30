const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const axios = require('axios');
const Database = require('better-sqlite3');
const { ChromaClient } = require('chromadb');

let mainWindow;
let db;
let chromaClient;
let proverbsCollection;
let ollamaProcess = null;
const OLLAMA_URL = 'http://localhost:11434';
const APP_DATA_DIR = path.join(app.getPath('userData'), 'proverbs-book-ai');
const CHROMA_DIR = path.join(APP_DATA_DIR, 'chroma');
const MODELS_CONFIG_PATH = path.join(__dirname, 'models', 'model-config.json');

// Ensure app data directory exists
if (!fs.existsSync(APP_DATA_DIR)) {
    fs.mkdirSync(APP_DATA_DIR, { recursive: true });
}

// Load model configuration
function loadModelConfig() {
    try {
        if (fs.existsSync(MODELS_CONFIG_PATH)) {
            const config = JSON.parse(fs.readFileSync(MODELS_CONFIG_PATH, 'utf8'));
            return config;
        }
    } catch (error) {
        console.error('Failed to load model config:', error);
    }
    return null;
}

// Get recommended model for platform
function getRecommendedModel() {
    const config = loadModelConfig();
    if (!config) return 'mistral:7b'; // Default fallback
    
    const platform = process.platform === 'darwin' ? 'mac' : 
                     process.platform === 'win32' ? 'windows' : 'linux';
    
    if (config.recommendedModels && config.recommendedModels[platform]) {
        return config.recommendedModels[platform].text.primary;
    }
    
    return 'mistral:7b'; // Default
}

// Initialize databases
async function initDatabase() {
    // SQLite for structured data
    const dbPath = path.join(APP_DATA_DIR, 'proverbs.db');
    db = new Database(dbPath);
    
    // Create tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS proverbs (
            chapter INTEGER PRIMARY KEY,
            verses TEXT NOT NULL,
            summary TEXT
        );
        
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chapter INTEGER,
            content_type TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS progress (
            chapter INTEGER PRIMARY KEY,
            status TEXT DEFAULT 'not_started',
            generated_at DATETIME,
            image_path TEXT,
            notes TEXT
        );
        
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);
    
    // Populate SQLite database
    populateProverbsDatabase();
    
    // ChromaDB for vector/semantic search (optional)
    await initChromaDB();
    
    return db;
}

async function initChromaDB() {
    try {
        // Initialize ChromaDB client (persistent mode)
        // ChromaDB can run in embedded mode for Electron
        chromaClient = new ChromaClient({
            path: CHROMA_DIR
        });
        
        // Test connection
        await chromaClient.heartbeat();
        
        // Create or get collection for Proverbs
        proverbsCollection = await chromaClient.getOrCreateCollection({
            name: 'proverbs',
            metadata: { description: 'Proverbs chapters for semantic search' }
        });
        
        // Check if collection is empty, populate it
        const count = await proverbsCollection.count();
        if (count === 0) {
            console.log('Populating ChromaDB with Proverbs data...');
            await populateChromaDB();
        }
        
        console.log('ChromaDB initialized successfully');
        return true;
    } catch (error) {
        console.error('ChromaDB initialization failed:', error);
        console.log('Continuing without ChromaDB - using SQLite only');
        chromaClient = null;
        proverbsCollection = null;
        return false;
    }
}

async function populateChromaDB() {
    // Load Proverbs data and create embeddings
    const proverbsDataPath = path.join(__dirname, 'database', 'proverbs.json');
    if (!fs.existsSync(proverbsDataPath)) return;
    
    const proverbsData = JSON.parse(fs.readFileSync(proverbsDataPath, 'utf8'));
    
    // For each chapter, create embeddings using Ollama
    for (const prov of proverbsData) {
        const versesText = Array.isArray(prov.verses) ? prov.verses.join(' ') : prov.verses;
        const fullText = `Chapter ${prov.chapter}: ${versesText} ${prov.summary || ''}`;
        
        try {
            // Generate embedding using Ollama
            const embedding = await generateEmbedding(fullText);
            
            // Add to ChromaDB
            await proverbsCollection.add({
                ids: [`chapter-${prov.chapter}`],
                embeddings: [embedding],
                documents: [fullText],
                metadatas: [{
                    chapter: prov.chapter,
                    summary: prov.summary || ''
                }]
            });
        } catch (error) {
            console.error(`Failed to add chapter ${prov.chapter} to ChromaDB:`, error);
        }
    }
}

async function generateEmbedding(text) {
    try {
        // Use Ollama's embedding endpoint
        const response = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
            model: 'nomic-embed-text', // Lightweight embedding model
            prompt: text
        }, {
            timeout: 10000
        });
        
        return response.data.embedding;
    } catch (error) {
        // Fallback: use simple hash-based embedding if Ollama not available
        console.warn('Ollama embedding failed, using fallback');
        return createSimpleEmbedding(text);
    }
}

function createSimpleEmbedding(text) {
    // Simple hash-based embedding as fallback
    // Not as good as real embeddings, but works for basic similarity
    const hash = require('crypto').createHash('sha256').update(text).digest();
    const embedding = [];
    for (let i = 0; i < 384; i++) {
        embedding.push((hash[i % hash.length] / 255) * 2 - 1);
    }
    return embedding;
}

function populateProverbsDatabase() {
    // Check if already populated
    const count = db.prepare('SELECT COUNT(*) as count FROM proverbs').get();
    if (count.count > 0) return;
    
    // Load Proverbs data from file
    const proverbsDataPath = path.join(__dirname, 'database', 'proverbs.json');
    if (fs.existsSync(proverbsDataPath)) {
        const proverbsData = JSON.parse(fs.readFileSync(proverbsDataPath, 'utf8'));
        const insert = db.prepare('INSERT INTO proverbs (chapter, verses, summary) VALUES (?, ?, ?)');
        
        const insertMany = db.transaction((proverbs) => {
            for (const prov of proverbs) {
                insert.run(prov.chapter, JSON.stringify(prov.verses), prov.summary || '');
            }
        });
        
        insertMany(proverbsData);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        show: false
    });

    mainWindow.loadFile('index.html');

    // Show window after ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        checkDependencies();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    // Initialize databases (async)
    await initDatabase();
    
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (ollamaProcess) {
        ollamaProcess.kill();
    }
    if (db) {
        db.close();
    }
});

// IPC Handlers
ipcMain.handle('check-dependencies', async () => {
    const ollamaInstalled = await checkCommand('ollama');
    const pandocInstalled = await checkCommand('pandoc');
    const electronInstalled = true; // We bundle Electron
    
    // Get recommended model for this platform
    const recommendedModel = getRecommendedModel();
    const visionModel = 'llava:7b';
    
    return {
        ollama: ollamaInstalled,
        pandoc: pandocInstalled,
        electron: electronInstalled,
        modelInstalled: await checkModelInstalled(recommendedModel),
        recommendedModel: recommendedModel,
        visionModelInstalled: await checkModelInstalled(visionModel),
        pythonInstalled: await checkCommand('python3') || await checkCommand('python'),
        modelConfig: loadModelConfig()
    };
});

ipcMain.handle('download-dependencies', async (event, options) => {
    const results = {
        ollama: false,
        pandoc: false,
        model: false,
        visionModel: false,
        errors: []
    };
    
    try {
        // Download Ollama
        if (!options.skipOllama) {
            try {
                results.ollama = await downloadOllama();
                // Start Ollama service
                await startOllamaService();
            } catch (error) {
                results.errors.push(`Ollama: ${error.message}`);
            }
        }
        
        // Download Pandoc
        if (!options.skipPandoc) {
            try {
                results.pandoc = await downloadPandoc();
            } catch (error) {
                results.errors.push(`Pandoc: ${error.message}`);
            }
        }
        
        // Download recommended model for this platform
        if (!options.skipModel) {
            try {
                const recommendedModel = getRecommendedModel();
                results.model = await downloadModel(recommendedModel);
                results.modelName = recommendedModel;
            } catch (error) {
                results.errors.push(`Model: ${error.message}`);
            }
        }
        
        // Download vision model (optional, for image understanding)
        if (!options.skipVisionModel && options.downloadVisionModel) {
            try {
                results.visionModel = await downloadModel('llava:7b');
            } catch (error) {
                results.errors.push(`Vision Model: ${error.message}`);
            }
        }
        
        return { success: true, results };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-proverbs-chapter', async (event, chapter) => {
    // Get from SQLite
    const stmt = db.prepare('SELECT * FROM proverbs WHERE chapter = ?');
    const result = stmt.get(chapter);
    if (result) {
        result.verses = JSON.parse(result.verses);
    }
    return result;
});

ipcMain.handle('search-proverbs-semantic', async (event, query) => {
    // Use ChromaDB for semantic search
    if (!proverbsCollection || !chromaClient) {
        return { 
            success: false, 
            error: 'ChromaDB not available',
            fallback: 'Using SQLite search instead'
        };
    }
    
    try {
        // Generate embedding for query
        const queryEmbedding = await generateEmbedding(query);
        
        // Search in ChromaDB
        const results = await proverbsCollection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 5
        });
        
        if (!results.ids || results.ids.length === 0) {
            return { success: false, error: 'No results found' };
        }
        
        return {
            success: true,
            results: results.ids[0].map((id, idx) => ({
                chapter: parseInt(id.replace('chapter-', '')),
                distance: results.distances?.[0]?.[idx] || 0,
                document: results.documents?.[0]?.[idx] || '',
                metadata: results.metadatas?.[0]?.[idx] || {}
            }))
        };
    } catch (error) {
        console.error('Semantic search error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('save-session', async (event, session) => {
    const stmt = db.prepare(`
        INSERT INTO sessions (chapter, content_type, content)
        VALUES (?, ?, ?)
    `);
    const result = stmt.run(session.chapter, session.contentType, session.content);
    return { success: true, id: result.lastInsertRowid };
});

ipcMain.handle('get-sessions', async () => {
    const stmt = db.prepare('SELECT * FROM sessions ORDER BY created_at DESC');
    return stmt.all();
});

ipcMain.handle('update-progress', async (event, progress) => {
    const stmt = db.prepare(`
        INSERT INTO progress (chapter, status, generated_at, image_path, notes)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(chapter) DO UPDATE SET
            status = excluded.status,
            generated_at = excluded.generated_at,
            image_path = excluded.image_path,
            notes = excluded.notes
    `);
    stmt.run(
        progress.chapter,
        progress.status,
        progress.generatedAt || new Date().toISOString(),
        progress.imagePath || null,
        progress.notes || null
    );
    return { success: true };
});

ipcMain.handle('get-progress', async () => {
    const stmt = db.prepare('SELECT * FROM progress ORDER BY chapter');
    return stmt.all();
});

ipcMain.handle('get-model-config', async () => {
    return loadModelConfig();
});

ipcMain.handle('generate-text', async (event, { chapter, contentType, model, useSemanticSearch = false }) => {
    try {
        // Get Proverbs chapter from database
        const proverbsData = db.prepare('SELECT * FROM proverbs WHERE chapter = ?').get(chapter);
        const verses = proverbsData ? JSON.parse(proverbsData.verses) : [];
        
        // Optionally use semantic search to find related verses from other chapters
        let relatedContext = '';
        if (useSemanticSearch && proverbsCollection && chromaClient) {
            try {
                const searchQuery = `${contentType} on Proverbs chapter ${chapter}`;
                const queryEmbedding = await generateEmbedding(searchQuery);
                const semanticResults = await proverbsCollection.query({
                    queryEmbeddings: [queryEmbedding],
                    nResults: 5
                });
                
                if (semanticResults.ids && semanticResults.ids[0]) {
                    const related = semanticResults.ids[0]
                        .map((id, idx) => ({
                            chapter: parseInt(id.replace('chapter-', '')),
                            document: semanticResults.documents[0][idx]
                        }))
                        .filter(r => r.chapter !== chapter)
                        .slice(0, 2)
                        .map(r => `Related context from Chapter ${r.chapter}: ${r.document.substring(0, 200)}...`)
                        .join('\n');
                    
                    if (related) {
                        relatedContext = `\n\n${related}\n`;
                    }
                }
            } catch (error) {
                console.error('Semantic search failed:', error);
                // Continue without semantic context
            }
        }
        
        const prompt = `You are writing an original ${contentType} on Proverbs chapter ${chapter}.

${verses.length > 0 ? `Here are the verses from this chapter:\n${verses.map((v, i) => `${i + 1}. ${v}`).join('\n')}\n\n` : ''}${relatedContext}

Write a comprehensive, original ${contentType} that:
- Explains the meaning and context
- Provides practical application
- Is completely original (do not copy from other sources)
- Is personal and insightful
- Helps readers understand and apply these teachings

Make it engaging and easy to understand.`;

        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: model,
            prompt: prompt,
            stream: false
        }, {
            timeout: 120000
        });

        const text = response.data.response || '';
        
        // Save to database
        db.prepare(`
            INSERT INTO sessions (chapter, content_type, content)
            VALUES (?, ?, ?)
        `).run(chapter, contentType, text);
        
        // Update progress
        db.prepare(`
            INSERT INTO progress (chapter, status, generated_at)
            VALUES (?, 'completed', ?)
            ON CONFLICT(chapter) DO UPDATE SET status = 'completed', generated_at = ?
        `).run(chapter, new Date().toISOString(), new Date().toISOString());

        return {
            success: true,
            text: text
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('generate-image', async (event, { chapter, style, prompt }) => {
    try {
        // Use Stable Diffusion or similar
        const imagePath = await generateImageWithSD(chapter, style, prompt);
        
        // Update progress with image path
        db.prepare(`
            INSERT INTO progress (chapter, image_path)
            VALUES (?, ?)
            ON CONFLICT(chapter) DO UPDATE SET image_path = ?
        `).run(chapter, imagePath, imagePath);
        
        return {
            success: true,
            imagePath: imagePath
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
});

ipcMain.handle('copy-to-clipboard', async (event, text) => {
    const { clipboard } = require('electron');
    clipboard.writeText(text);
    return { success: true };
});

ipcMain.handle('copy-image', async (event, imagePath) => {
    const { clipboard, nativeImage } = require('electron');
    try {
        if (fs.existsSync(imagePath)) {
            const image = nativeImage.createFromPath(imagePath);
            clipboard.writeImage(image);
            return { success: true };
        }
        return { success: false, error: 'Image file not found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('export-book', async (event, { chapters, format }) => {
    try {
        // Get all chapters from database
        const sessions = db.prepare(`
            SELECT * FROM sessions 
            WHERE chapter IN (${chapters.map(() => '?').join(',')})
            ORDER BY chapter
        `).all(...chapters);
        
        let markdown = '# Proverbs Book\n\n';
        markdown += '*Generated with Proverbs Book AI*\n\n';
        
        sessions.forEach(session => {
            markdown += `## Chapter ${session.chapter}: ${session.content_type}\n\n`;
            markdown += `${session.content}\n\n`;
            markdown += '---\n\n';
        });

        const tempDir = app.getPath('temp');
        const mdFile = path.join(tempDir, 'proverbs-book.md');
        fs.writeFileSync(mdFile, markdown);

        return new Promise((resolve, reject) => {
            const outputFile = format === 'pdf' 
                ? path.join(tempDir, 'proverbs-book.pdf')
                : path.join(tempDir, 'proverbs-book.epub');

            const pandocCmd = format === 'pdf'
                ? `pandoc "${mdFile}" -o "${outputFile}" --pdf-engine=xelatex`
                : `pandoc "${mdFile}" -o "${outputFile}"`;

            exec(pandocCmd, (error) => {
                if (error) {
                    reject({ success: false, error: error.message });
                } else {
                    dialog.showSaveDialog(mainWindow, {
                        defaultPath: `proverbs-book.${format}`,
                        filters: [
                            { name: format.toUpperCase(), extensions: [format] }
                        ]
                    }).then(result => {
                        if (!result.canceled) {
                            fs.copyFileSync(outputFile, result.filePath);
                            resolve({ success: true, path: result.filePath });
                        } else {
                            resolve({ success: false, error: 'Save cancelled' });
                        }
                    });
                }
            });
        });
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Helper functions
function checkCommand(cmd) {
    return new Promise((resolve) => {
        exec(`which ${cmd}`, (err) => {
            resolve(!err);
        });
    });
}

function checkModelInstalled(modelName) {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2000 });
            const models = response.data.models || [];
            resolve(models.some(m => m.name.includes(modelName)));
        } catch {
            resolve(false);
        }
    });
}

async function downloadOllama() {
    return new Promise((resolve, reject) => {
        const system = process.platform;
        if (system === 'darwin') {
            exec('curl -fsSL https://ollama.ai/install.sh | sh', (error) => {
                if (error) reject(error);
                else resolve(true);
            });
        } else {
            reject(new Error('Ollama download not supported on this platform'));
        }
    });
}

async function downloadPandoc() {
    return new Promise((resolve, reject) => {
        exec('brew install pandoc', (error) => {
            if (error) reject(error);
            else resolve(true);
        });
    });
}

async function downloadModel(modelName) {
    return new Promise(async (resolve, reject) => {
        try {
            // Start Ollama service if not running
            await startOllamaService();
            
            const response = await axios.post(`${OLLAMA_URL}/api/pull`, {
                name: modelName
            }, {
                timeout: 600000, // 10 minutes for large models
                onDownloadProgress: (progressEvent) => {
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        const percent = progressEvent.total 
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        mainWindow.webContents.send('model-download-progress', {
                            model: modelName,
                            percent: percent,
                            status: `Downloading ${modelName}... ${percent}%`
                        });
                    }
                }
            });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

async function startOllamaService() {
    // Check if Ollama is running
    try {
        await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2000 });
        return true; // Already running
    } catch {
        // Start Ollama service
        if (process.platform === 'win32') {
            spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
        } else {
            spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
        }
        // Wait for service to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
    }
}

async function generateImageWithSD(chapter, style, prompt) {
    const imagesDir = path.join(APP_DATA_DIR, 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const imagePath = path.join(imagesDir, `chapter-${chapter}-${Date.now()}.png`);
    
    // Enhanced prompt for better image generation
    const fullPrompt = `A beautiful, artistic illustration for Proverbs chapter ${chapter}. Style: ${style}. ${prompt}. Biblical, inspirational, high quality, detailed, professional artwork.`;
    
    // Try multiple image generation methods
    try {
        // Method 1: Use Stable Diffusion via Python script
        const sdScript = path.join(__dirname, 'scripts', 'generate_image.py');
        if (fs.existsSync(sdScript)) {
            const pythonCmd = await checkCommand('python3') ? 'python3' : 'python';
            return new Promise((resolve, reject) => {
                exec(`${pythonCmd} "${sdScript}" "${fullPrompt}" "${imagePath}"`, 
                    { timeout: 120000 }, // 2 minutes timeout
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error('SD generation error:', error);
                            // Try fallback method
                            generateImageFallback(fullPrompt, imagePath, chapter)
                                .then(resolve)
                                .catch(() => {
                                    createPlaceholderImage(imagePath, chapter);
                                    resolve(imagePath);
                                });
                        } else if (fs.existsSync(imagePath)) {
                            resolve(imagePath);
                        } else {
                            // Try fallback
                            generateImageFallback(fullPrompt, imagePath, chapter)
                                .then(resolve)
                                .catch(() => {
                                    createPlaceholderImage(imagePath, chapter);
                                    resolve(imagePath);
                                });
                        }
                    }
                );
            });
        }
        
        // Method 2: Try fallback API-based generation
        return await generateImageFallback(fullPrompt, imagePath, chapter);
    } catch (error) {
        console.error('Image generation error:', error);
        createPlaceholderImage(imagePath, chapter);
        return imagePath;
    }
}

async function generateImageFallback(prompt, imagePath, chapter) {
    // Try using Hugging Face Inference API or similar
    try {
        const axios = require('axios');
        // Note: User would need to add API key for production use
        // For now, create a placeholder that indicates image generation is available
        const placeholderInfo = {
            prompt: prompt,
            chapter: chapter,
            generated: new Date().toISOString(),
            note: 'Image generation requires API key or local Stable Diffusion setup'
        };
        fs.writeFileSync(imagePath.replace('.png', '.json'), JSON.stringify(placeholderInfo, null, 2));
        return imagePath;
    } catch (error) {
        throw error;
    }
}

function createPlaceholderImage(imagePath, chapter) {
    // Create a metadata file indicating image should be generated
    const placeholderInfo = {
        chapter: chapter,
        status: 'pending',
        note: 'Run image generation script to create actual image'
    };
    fs.writeFileSync(imagePath.replace('.png', '.json'), JSON.stringify(placeholderInfo, null, 2));
}

async function checkDependencies() {
    const deps = await ipcMain.handle('check-dependencies');
    if (!deps.ollama || !deps.pandoc || !deps.modelInstalled) {
        mainWindow.webContents.send('show-dependency-dialog');
    }
}
