// main.js
import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const MAIN_DIST = join(__dirname, '../dist-electron');
const RENDERER_DIST = join(__dirname, '../dist');
const PRELOAD_PATH = join(MAIN_DIST, 'preload.mjs');
const INDEX_HTML = join(RENDERER_DIST, 'index.html');

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: PRELOAD_PATH,
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    // Test active push message to Renderer-process.
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(INDEX_HTML);
    }
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
