const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  readFolder: (path) => ipcRenderer.invoke('readFolder', path),
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
});