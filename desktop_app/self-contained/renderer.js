let chapters = [];
let currentModel = 'mistral:7b'; // Default to best quality model
let progress = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadProgress();
    await loadSessions();
    
    // Check for dependency dialog
    window.electronAPI.onDependencyDialog(() => {
        showDependencyDialog();
    });
    
    // Check dependencies on startup
    const deps = await window.electronAPI.checkDependencies();
    
    // Update model selection based on recommended model
    if (deps.recommendedModel) {
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.value = deps.recommendedModel;
            currentModel = deps.recommendedModel;
        }
        
        // Update download dialog label
        const modelLabel = document.getElementById('modelLabel');
        if (modelLabel && deps.modelConfig) {
            const modelSpec = deps.modelConfig.modelSpecs[deps.recommendedModel];
            if (modelSpec) {
                modelLabel.textContent = `AI Model (${modelSpec.name}) - ${modelSpec.size} - ${modelSpec.quality} quality`;
            }
        }
    }
    
    if (!deps.ollama || !deps.pandoc || !deps.modelInstalled) {
        showDependencyDialog();
    }
});

function showDependencyDialog() {
    const dialog = document.getElementById('dependencyDialog');
    dialog.style.display = 'flex';
}

function hideDependencyDialog() {
    const dialog = document.getElementById('dependencyDialog');
    dialog.style.display = 'none';
}

async function loadProgress() {
    progress = {};
    const progressData = await window.electronAPI.getProgress();
    progressData.forEach(p => {
        progress[p.chapter] = p;
    });
    updateProgressDisplay();
}

async function loadSessions() {
    const sessions = await window.electronAPI.getSessions();
    chapters = sessions.map(s => ({
        number: s.chapter,
        contentType: s.content_type,
        content: s.content
    }));
    updateChaptersList();
}

function setupEventListeners() {
    // Dependency dialog
    document.getElementById('downloadBtn').addEventListener('click', async () => {
        const options = {
            skipOllama: !document.getElementById('downloadOllama').checked,
            skipPandoc: !document.getElementById('downloadPandoc').checked,
            skipModel: !document.getElementById('downloadModel').checked,
            downloadVisionModel: document.getElementById('downloadVisionModel').checked
        };
        
        const progressDiv = document.getElementById('downloadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressDiv.style.display = 'block';
        document.getElementById('downloadBtn').disabled = true;
        
        try {
            progressText.textContent = 'Downloading dependencies...';
            const result = await window.electronAPI.downloadDependencies(options);
            
            if (result.success) {
                progressFill.style.width = '100%';
                progressText.textContent = 'Installation complete!';
                setTimeout(() => {
                    hideDependencyDialog();
                    location.reload();
                }, 2000);
            } else {
                progressText.textContent = 'Error: ' + result.error;
            }
        } catch (error) {
            progressText.textContent = 'Error: ' + error.message;
        }
    });
    
    document.getElementById('skipBtn').addEventListener('click', () => {
        hideDependencyDialog();
    });
    
    // Load chapter
    document.getElementById('loadChapterBtn').addEventListener('click', async () => {
        const chapter = parseInt(document.getElementById('chapterInput').value);
        const preview = document.getElementById('chapterPreview');
        preview.textContent = 'Loading...';
        
        const data = await window.electronAPI.getProverbsChapter(chapter);
        if (data) {
            preview.innerHTML = `
                <strong>Chapter ${chapter}</strong><br>
                ${data.verses.slice(0, 5).join('<br>')}
                ${data.verses.length > 5 ? '<br>...' : ''}
            `;
        } else {
            preview.textContent = 'Chapter data not found in database';
        }
    });
    
    // Generate
    document.getElementById('generateBtn').addEventListener('click', generateChapter);
    
    // Save
    document.getElementById('saveChapterBtn').addEventListener('click', saveChapter);
    
    // Copy text
    document.getElementById('copyTextBtn').addEventListener('click', async () => {
        const text = document.getElementById('contentTextarea').value;
        if (!text.trim()) {
            alert('No text to copy!');
            return;
        }
        try {
            await window.electronAPI.copyToClipboard(text);
            const statusDiv = document.getElementById('generateStatus');
            statusDiv.style.display = 'block';
            statusDiv.className = 'status-message success';
            statusDiv.textContent = 'Text copied to clipboard!';
        } catch (error) {
            alert('Failed to copy: ' + error.message);
        }
    });
    
    // Generate image
    document.getElementById('generateImageBtn').addEventListener('click', generateImage);
    
    // Clear
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('contentTextarea').value = '';
    });
    
    // Export
    document.getElementById('exportPdfBtn').addEventListener('click', () => exportBook('pdf'));
    document.getElementById('exportEpubBtn').addEventListener('click', () => exportBook('epub'));
}

async function generateChapter() {
    const chapter = parseInt(document.getElementById('chapterInput').value);
    const contentType = document.getElementById('contentTypeSelect').value;
    const model = document.getElementById('modelSelect').value;
    const generateBtn = document.getElementById('generateBtn');
    const statusDiv = document.getElementById('generateStatus');
    const textarea = document.getElementById('contentTextarea');
    
    generateBtn.disabled = true;
    statusDiv.style.display = 'block';
    statusDiv.className = 'status-message info';
    statusDiv.textContent = 'Generating... This may take 30-60 seconds. Please wait...';
    textarea.value = '';
    
    try {
        const result = await window.electronAPI.generateText({
            chapter,
            contentType,
            model
        });
        
        if (result.success) {
            textarea.value = result.text;
            statusDiv.className = 'status-message success';
            statusDiv.textContent = 'Generated successfully!';
            await loadProgress();
        } else {
            statusDiv.className = 'status-message error';
            statusDiv.textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        statusDiv.className = 'status-message error';
        statusDiv.textContent = 'Error: ' + error.message;
    }
    
    generateBtn.disabled = false;
}

async function saveChapter() {
    const chapter = parseInt(document.getElementById('chapterInput').value);
    const contentType = document.getElementById('contentTypeSelect').value;
    const content = document.getElementById('contentTextarea').value;
    
    if (!content.trim()) {
        alert('Please generate content first!');
        return;
    }
    
    await window.electronAPI.saveSession({
        chapter,
        contentType,
        content
    });
    
    await loadSessions();
    
    const statusDiv = document.getElementById('generateStatus');
    statusDiv.style.display = 'block';
    statusDiv.className = 'status-message success';
    statusDiv.textContent = `Chapter ${chapter} saved!`;
}

async function generateImage() {
    const chapter = parseInt(document.getElementById('chapterInput').value);
    const contentType = document.getElementById('contentTypeSelect').value;
    const prompt = `Illustration for Proverbs chapter ${chapter}, ${contentType} style, biblical, artistic`;
    
    const statusDiv = document.getElementById('generateStatus');
    statusDiv.style.display = 'block';
    statusDiv.className = 'status-message info';
    statusDiv.textContent = 'Generating image... This may take 30-60 seconds.';
    
    try {
        const result = await window.electronAPI.generateImage({
            chapter,
            style: contentType,
            prompt
        });
        
        if (result.success) {
            statusDiv.className = 'status-message success';
            statusDiv.textContent = 'Image generated! Check your images folder.';
            
            // Offer to copy image
            if (result.imagePath) {
                const copyImage = confirm('Image generated! Would you like to copy it to clipboard?');
                if (copyImage) {
                    try {
                        await window.electronAPI.copyImage(result.imagePath);
                        statusDiv.textContent = 'Image generated and copied to clipboard!';
                    } catch (error) {
                        console.error('Failed to copy image:', error);
                    }
                }
            }
            
            await loadProgress();
        } else {
            statusDiv.className = 'status-message error';
            statusDiv.textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        statusDiv.className = 'status-message error';
        statusDiv.textContent = 'Error: ' + error.message;
    }
}

function updateProgressDisplay() {
    const progressList = document.getElementById('progressList');
    const chapters = Array.from({ length: 31 }, (_, i) => i + 1);
    
    if (Object.keys(progress).length === 0) {
        progressList.innerHTML = '<p class="empty-state">No progress yet.</p>';
        return;
    }
    
    progressList.innerHTML = chapters.map(ch => {
        const p = progress[ch];
        const status = p ? p.status : 'not_started';
        const statusClass = status === 'completed' ? 'completed' : 
                           status === 'in_progress' ? 'in-progress' : '';
        
        return `
            <div class="progress-item ${statusClass}">
                <div class="progress-item-number">${ch}</div>
                <div class="progress-item-status">${status.replace('_', ' ')}</div>
            </div>
        `;
    }).join('');
}

function updateChaptersList() {
    const listDiv = document.getElementById('chaptersList');
    
    if (chapters.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No chapters saved yet. Generate your first chapter above!</p>';
        return;
    }
    
    chapters.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    
    listDiv.innerHTML = chapters.map(ch => `
        <div class="chapter-item">
            <div class="chapter-info">
                <div class="chapter-title">Chapter ${ch.number}: ${ch.contentType}</div>
                <div class="chapter-meta">${ch.content.length} characters</div>
            </div>
        </div>
    `).join('');
}

async function exportBook(format) {
    if (chapters.length === 0) {
        alert('Please generate and save at least one chapter first!');
        return;
    }
    
    const chapterNumbers = chapters.map(ch => parseInt(ch.number));
    
    try {
        const result = await window.electronAPI.exportBook({
            chapters: chapterNumbers,
            format
        });
        
        if (result.success) {
            alert(`Book exported successfully to:\n${result.path}`);
        } else {
            alert('Export failed: ' + result.error);
        }
    } catch (error) {
        alert('Export error: ' + error.message);
    }
}
