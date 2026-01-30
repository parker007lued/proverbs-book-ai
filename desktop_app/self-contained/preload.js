const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Dependencies
    checkDependencies: () => ipcRenderer.invoke('check-dependencies'),
    downloadDependencies: (options) => ipcRenderer.invoke('download-dependencies', options),
    
    // Database
    getProverbsChapter: (chapter) => ipcRenderer.invoke('get-proverbs-chapter', chapter),
    searchProverbsSemantic: (query) => ipcRenderer.invoke('search-proverbs-semantic', query),
    saveSession: (session) => ipcRenderer.invoke('save-session', session),
    getSessions: () => ipcRenderer.invoke('get-sessions'),
    updateProgress: (progress) => ipcRenderer.invoke('update-progress', progress),
    getProgress: () => ipcRenderer.invoke('get-progress'),
    
    // Generation
    generateText: (options) => ipcRenderer.invoke('generate-text', options),
    generateImage: (options) => ipcRenderer.invoke('generate-image', options),
    
    // Export
    exportBook: (options) => ipcRenderer.invoke('export-book', options),
    
    // Copy functionality
    copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
    copyImage: (imagePath) => ipcRenderer.invoke('copy-image', imagePath),
    
    // Model config
    getModelConfig: () => ipcRenderer.invoke('get-model-config'),
    
    // Events
    onDependencyDialog: (callback) => {
        ipcRenderer.on('show-dependency-dialog', () => callback());
    },
    onModelDownloadProgress: (callback) => {
        ipcRenderer.on('model-download-progress', (event, data) => callback(data));
    }
});
