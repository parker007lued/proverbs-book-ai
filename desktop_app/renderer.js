let chapters = [];
let currentModel = 'phi3:mini';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkDependencies();
    await loadDailyScripture();
    await loadOrthodoxCalendar();
    setupEventListeners();
});

// Load Daily Scripture & Orthodox Calendar
async function loadDailyScripture() {
    try {
        const scripture = await window.electronAPI.getDailyScripture();
        if (scripture.success && scripture.readings) {
            displayScripture(scripture.readings);
        }
    } catch (error) {
        console.error('Error loading scripture:', error);
    }
}

async function loadOrthodoxCalendar() {
    try {
        const calendar = await window.electronAPI.getOrthodoxCalendarInfo();
        if (calendar.success && calendar.info) {
            displayCalendarInfo(calendar.info);
        }
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

function displayScripture(readings) {
    const scriptureText = document.getElementById('scriptureText');
    if (!scriptureText) return;
    
    let html = `<div style="margin-bottom: 15px;">`;
    html += `<p><strong>${readings.date}</strong></p>`;
    
    if (readings.epistle) {
        html += `<div style="margin-bottom: 12px;"><strong>Epistle:</strong> ${readings.epistle.citation}</div>`;
        html += `<div style="margin-left: 20px; font-style: italic; color: #555;">${readings.epistle.text}</div>`;
    }
    
    if (readings.gospel) {
        html += `<div style="margin-bottom: 12px; margin-top: 15px;"><strong>Gospel:</strong> ${readings.gospel.citation}</div>`;
        html += `<div style="margin-left: 20px; font-style: italic; color: #555;">${readings.gospel.text}</div>`;
    }
    
    if (readings.oldTestament) {
        html += `<div style="margin-bottom: 12px; margin-top: 15px;"><strong>Old Testament:</strong> ${readings.oldTestament.citation}</div>`;
        html += `<div style="margin-left: 20px; font-style: italic; color: #555;">${readings.oldTestament.text}</div>`;
    }
    
    html += `</div>`;
    scriptureText.innerHTML = html;
}

function displayCalendarInfo(info) {
    const feastInfo = document.getElementById('feastInfo');
    const fastingInfo = document.getElementById('fastingInfo');
    const normalDay = document.getElementById('normalDay');
    const feastName = document.getElementById('feastName');
    const fastingName = document.getElementById('fastingName');
    const fastingReason = document.getElementById('fastingReason');
    
    if (info.isFeast) {
        feastInfo.style.display = 'block';
        feastName.textContent = info.feast.name;
    } else {
        feastInfo.style.display = 'none';
    }
    
    if (info.isFasting) {
        fastingInfo.style.display = 'block';
        fastingName.textContent = info.fastingInfo.name;
        if (info.fastingInfo.reason) {
            fastingReason.textContent = info.fastingInfo.reason;
        }
        normalDay.style.display = 'none';
    } else if (!info.isFeast) {
        fastingInfo.style.display = 'none';
        normalDay.style.display = 'block';
    } else {
        fastingInfo.style.display = 'none';
    }
}

async function checkDependencies() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const dependencyPanel = document.getElementById('dependencyPanel');
    
    // Check Ollama
    const ollamaCheck = await window.electronAPI.checkOllama();
    const ollamaStatus = document.getElementById('ollamaStatus');
    const installOllamaBtn = document.getElementById('installOllamaBtn');
    
    if (!ollamaCheck.installed) {
        ollamaStatus.textContent = 'Not installed';
        ollamaStatus.className = 'dependency-status missing';
        installOllamaBtn.style.display = 'inline-block';
        dependencyPanel.style.display = 'block';
    } else if (!ollamaCheck.running) {
        ollamaStatus.textContent = 'Installed (not running)';
        ollamaStatus.className = 'dependency-status';
        await window.electronAPI.startOllama();
        setTimeout(() => checkDependencies(), 2000);
    } else {
        ollamaStatus.textContent = 'Installed & Running';
        ollamaStatus.className = 'dependency-status installed';
    }
    
    // Check Pandoc
    const pandocCheck = await window.electronAPI.checkPandoc();
    const pandocStatus = document.getElementById('pandocStatus');
    const installPandocBtn = document.getElementById('installPandocBtn');
    
    if (!pandocCheck.installed) {
        pandocStatus.textContent = 'Not installed';
        pandocStatus.className = 'dependency-status missing';
        installPandocBtn.style.display = 'inline-block';
        dependencyPanel.style.display = 'block';
    } else {
        pandocStatus.textContent = 'Installed';
        pandocStatus.className = 'dependency-status installed';
    }
    
    // Check Model
    if (ollamaCheck.running) {
        await checkModel();
    }
    
    // Update status indicator
    if (ollamaCheck.installed && ollamaCheck.running && pandocCheck.installed) {
        statusIndicator.querySelector('.status-dot').className = 'status-dot ready';
        statusText.textContent = 'Ready';
    }
}

async function checkModel() {
    const modelStatus = document.getElementById('modelStatus');
    const downloadModelBtn = document.getElementById('downloadModelBtn');
    const modelSelect = document.getElementById('modelSelect');
    currentModel = modelSelect.value;
    
    const modelCheck = await window.electronAPI.checkModel(currentModel);
    
    if (!modelCheck.installed) {
        modelStatus.textContent = 'Not downloaded';
        modelStatus.className = 'dependency-status missing';
        downloadModelBtn.style.display = 'inline-block';
    } else {
        modelStatus.textContent = 'Downloaded';
        modelStatus.className = 'dependency-status installed';
        downloadModelBtn.style.display = 'none';
    }
}

function setupEventListeners() {
    // Daily Scripture toggle
    const toggleScriptureBtn = document.getElementById('toggleScriptureBtn');
    const scriptureContent = document.getElementById('scriptureContent');
    
    if (toggleScriptureBtn && scriptureContent) {
        toggleScriptureBtn.addEventListener('click', () => {
            const isHidden = scriptureContent.style.display === 'none';
            scriptureContent.style.display = isHidden ? 'block' : 'none';
            toggleScriptureBtn.textContent = isHidden ? 'Hide' : 'Show';
            localStorage.setItem('scriptureHidden', !isHidden);
        });
        
        // Check if user previously hid scripture
        const wasHidden = localStorage.getItem('scriptureHidden') === 'true';
        if (wasHidden) {
            scriptureContent.style.display = 'none';
            toggleScriptureBtn.textContent = 'Show';
        }
    }
    
    // Refresh scripture button
    const refreshScriptureBtn = document.getElementById('refreshScriptureBtn');
    if (refreshScriptureBtn) {
        refreshScriptureBtn.addEventListener('click', async () => {
            await loadDailyScripture();
        });
    }
    
    // Hide scripture for today
    const hideScriptureBtn = document.getElementById('hideScriptureBtn');
    if (hideScriptureBtn) {
        hideScriptureBtn.addEventListener('click', () => {
            if (scriptureContent) {
                scriptureContent.style.display = 'none';
                if (toggleScriptureBtn) toggleScriptureBtn.textContent = 'Show';
                localStorage.setItem('scriptureHidden', 'true');
            }
        });
    }
    
    // Install buttons
    document.getElementById('installOllamaBtn').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.installOllama();
            if (result.success) {
                alert('Ollama installed! Please restart the app.');
            }
        } catch (error) {
            alert('Installation failed: ' + error.error);
        }
    });
    
    document.getElementById('installPandocBtn').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.installPandoc();
            if (result.success) {
                alert('Pandoc installed successfully!');
                await checkDependencies();
            }
        } catch (error) {
            alert('Installation failed: ' + error.error);
        }
    });
    
    document.getElementById('downloadModelBtn').addEventListener('click', async () => {
        const modelSelect = document.getElementById('modelSelect');
        const modelName = modelSelect.value;
        const progressBar = document.getElementById('modelProgress');
        const progressFill = document.getElementById('modelProgressFill');
        
        progressBar.style.display = 'block';
        downloadModelBtn.disabled = true;
        
        // Listen for progress updates
        window.electronAPI.onModelDownloadProgress((event, status) => {
            if (status.includes('%')) {
                const percent = parseInt(status.match(/\d+/)[0]);
                progressFill.style.width = percent + '%';
            }
        });
        
        try {
            const result = await window.electronAPI.downloadModel(modelName);
            if (result.success) {
                progressBar.style.display = 'none';
                await checkModel();
            }
        } catch (error) {
            alert('Download failed: ' + error.error);
            progressBar.style.display = 'none';
        }
        
        downloadModelBtn.disabled = false;
    });
    
    // Model selection change
    document.getElementById('modelSelect').addEventListener('change', async () => {
        await checkModel();
    });
    
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateChapter);
    
    // Save chapter
    document.getElementById('saveChapterBtn').addEventListener('click', saveChapter);
    
    // Clear
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('contentTextarea').value = '';
    });
    
    // Export buttons
    document.getElementById('exportPdfBtn').addEventListener('click', () => exportBook('pdf'));
    document.getElementById('exportEpubBtn').addEventListener('click', () => exportBook('epub'));
}

async function generateChapter() {
    const chapter = document.getElementById('chapterInput').value;
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

function saveChapter() {
    const chapter = document.getElementById('chapterInput').value;
    const contentType = document.getElementById('contentTypeSelect').value;
    const content = document.getElementById('contentTextarea').value;
    
    if (!content.trim()) {
        alert('Please generate content first!');
        return;
    }
    
    // Check if chapter already exists
    const existingIndex = chapters.findIndex(ch => ch.number === chapter);
    if (existingIndex >= 0) {
        chapters[existingIndex] = { number: chapter, contentType, content };
    } else {
        chapters.push({ number: chapter, contentType, content });
    }
    
    updateChaptersList();
    
    const statusDiv = document.getElementById('generateStatus');
    statusDiv.style.display = 'block';
    statusDiv.className = 'status-message success';
    statusDiv.textContent = `Chapter ${chapter} saved!`;
}

function updateChaptersList() {
    const listDiv = document.getElementById('chaptersList');
    
    if (chapters.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No chapters yet. Generate your first chapter above!</p>';
        return;
    }
    
    // Sort by chapter number
    chapters.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    
    listDiv.innerHTML = chapters.map(ch => `
        <div class="chapter-item">
            <div class="chapter-info">
                <div class="chapter-title">Chapter ${ch.number}: ${ch.contentType}</div>
                <div class="chapter-meta">${ch.content.length} characters</div>
            </div>
            <button class="btn btn-secondary" onclick="deleteChapter(${ch.number})">Delete</button>
        </div>
    `).join('');
}

function deleteChapter(chapterNumber) {
    chapters = chapters.filter(ch => ch.number !== chapterNumber);
    updateChaptersList();
}

async function exportBook(format) {
    if (chapters.length === 0) {
        alert('Please generate and save at least one chapter first!');
        return;
    }
    
    try {
        const result = await window.electronAPI.exportBook({
            chapters,
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
