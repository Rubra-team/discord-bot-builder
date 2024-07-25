const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => ipcRenderer.send('open-file-dialog'),
    onFileSelected: (callback) => ipcRenderer.on('selected-file', (event, filePath) => callback(filePath)),
    stopBot: () => ipcRenderer.send('stop-bot'),
    onBotStatus: (callback) => ipcRenderer.on('bot-status', (event, status) => callback(status))
});
