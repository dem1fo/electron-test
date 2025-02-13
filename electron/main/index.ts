// main.js
import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MAIN_DIST = join(__dirname, '../../dist-electron');
const RENDERER_DIST = join(__dirname, '../../dist');
const PRELOAD_PATH = join(__dirname, '../preload/index.mjs');
const INDEX_HTML = join(RENDERER_DIST, 'src', 'index.html');
const VITE_DEV_SERVER_URL = 'http://localhost:3000/';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: PRELOAD_PATH,
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    mainWindow.webContents.openDevTools();
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(INDEX_HTML);
    }
}

app.whenReady().then(createWindow);

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
