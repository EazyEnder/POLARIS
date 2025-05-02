const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;
const backendPath = path.join(__dirname, 'backend');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  backendProcess = spawn(
    'C:/Users/Zack/AppData/Local/Microsoft/WindowsApps/python3.11.exe',
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
