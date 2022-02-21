const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld(
  'app',
  {
    enableblocker: (arg) => ipcRenderer.invoke('enable-blocker', arg),
    disableblocker: (arg) => ipcRenderer.invoke('disable-blocker', arg),
    checkblocker: (arg) => ipcRenderer.sendSync('check-blocker', arg),
    closepanel: (arg) => ipcRenderer.invoke('close-panel', arg),
  }
)