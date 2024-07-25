const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { startBot, stopBot} = require('../bot/bot.js');

require('electron-reload')(path.join(__dirname, '..'), {
    electron: require(`${__dirname}/../node_modules/electron`)
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    ipcMain.on('open-file-dialog', (event) => {
        const { dialog } = require('electron');
        dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [{ name: 'JSON Files', extensions: ['json'] }]
        }).then(result => {
            if (result.canceled) return;
            const filePath = result.filePaths[0];
            event.reply('selected-file', filePath);
            startBot(filePath);
            mainWindow.webContents.send('bot-status', 'Bot is active');
        }).catch(err => {
            console.log(err);
        });
    });

    ipcMain.on('stop-bot', () => {
        stopBot();
        mainWindow.webContents.send('bot-status', 'Bot is stopped');
    });
}

app.whenReady().then(() => {
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
