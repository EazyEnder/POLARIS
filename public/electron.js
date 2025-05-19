const os = require('os');
const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs/promises');

let backendProcess;
const backendPath = path.join(__dirname, 'backend');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  backendProcess = spawn(
    //'C:/Users/Zack/AppData/Local/Microsoft/WindowsApps/python3.11.exe',
    path.join(os.homedir(), 'novae', 'bin', 'python3'),
    ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'],
    { cwd: backendPath }
  );

  backendProcess.stdout.on('data', (data) => {
    console.log(`FastAPI: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`FastAPI Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`FastAPI process exited with code ${code}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    backendProcess.kill();
    app.quit();
  }
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

async function readDirectoryRecursive(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const result = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: 'folder',
        children: await readDirectoryRecursive(fullPath),
      };
    } else {
      return {
        name: entry.name,
        type: 'file',
      };
    }
  }));

  return result;
}

ipcMain.handle('readFolder', async (event, folderPath) => {
  return await readDirectoryRecursive(folderPath);
});
