const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Ollama
  checkOllama: () => ipcRenderer.invoke('check-ollama'),
  installOllama: () => ipcRenderer.invoke('install-ollama'),
  startOllama: () => ipcRenderer.invoke('start-ollama'),
  
  // Models
  checkModel: (modelName) => ipcRenderer.invoke('check-model', modelName),
  downloadModel: (modelName) => ipcRenderer.invoke('download-model', modelName),
  
  // Generation
  generateText: (options) => ipcRenderer.invoke('generate-text', options),
  
  // Export
  exportBook: (options) => ipcRenderer.invoke('export-book', options),
  
  // Pandoc
  checkPandoc: () => ipcRenderer.invoke('check-pandoc'),
  installPandoc: () => ipcRenderer.invoke('install-pandoc'),
  
  // Orthodox Calendar & Daily Scripture
  getOrthodoxCalendarInfo: () => ipcRenderer.invoke('get-orthodox-calendar-info'),
  getDailyScripture: () => ipcRenderer.invoke('get-daily-scripture'),
  
  // Authentication
  register: (data) => ipcRenderer.invoke('register', data),
  login: (data) => ipcRenderer.invoke('login', data),
  logout: () => ipcRenderer.invoke('logout'),
  getUser: () => ipcRenderer.invoke('get-user'),
  syncData: (data) => ipcRenderer.invoke('sync-data', data),
  getSyncedData: () => ipcRenderer.invoke('get-synced-data'),
  privacyAccepted: () => ipcRenderer.invoke('privacy-accepted'),
  
  // Events
  onModelDownloadProgress: (callback) => {
    ipcRenderer.on('model-download-progress', (event, data) => callback(data));
  },
  
  onDependencyStatus: (callback) => {
    ipcRenderer.on('dependency-status', (event, data) => callback(data));
  }
});
