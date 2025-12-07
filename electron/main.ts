import { app, BrowserWindow, ipcMain, nativeImage, Tray, Menu } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';

const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Time Tracker">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5c6bc0" />
      <stop offset="100%" stop-color="#3949ab" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="12" fill="url(#g)" />
  <circle cx="32" cy="32" r="22" fill="#fff" opacity="0.9" />
  <circle cx="32" cy="32" r="19" fill="#e8eaf6" />
  <path d="M32 16v16l11 7" fill="none" stroke="#3f51b5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="32" cy="32" r="3" fill="#3f51b5" />
</svg>
`;

const iconDataUrl = `data:image/svg+xml;base64,${Buffer.from(ICON_SVG).toString('base64')}`;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;

const dataFile = path.join(app.getPath('userData'), 'time-tracker-data.json');

function loadIcon() {
  return nativeImage.createFromDataURL(iconDataUrl);
}

async function createWindow() {
  const icon = loadIcon();

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    show: true,
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = path.join(__dirname, '../dist/time-tracker/browser/index.html');
  await mainWindow.loadFile(indexPath);
  mainWindow.on('close', (event) => {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

function createTray() {
  const icon = loadIcon();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Exit',
      click: async () => {
        if (mainWindow) {
          mainWindow.webContents.send('timeTracker:finish');
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Time Tracker');
  tray.setContextMenu(contextMenu);
}

ipcMain.handle('timeTracker:loadSessions', async () => {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
});

ipcMain.handle('timeTracker:saveSessions', async (_event, sessions) => {
  const folder = path.dirname(dataFile);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(sessions, null, 2), 'utf-8');
});

app.whenReady().then(async () => {
  await createWindow();
  createTray();
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
  mainWindow?.show();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
