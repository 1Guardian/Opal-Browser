const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld(
  'app',
  {
    closeApp: (flag) => ipcRenderer.invoke('close-message', flag),
    maxApp: (flag) => ipcRenderer.invoke('maximize-message', flag),
    minApp: (flag) => ipcRenderer.invoke('min-message', flag),
    newtab: (arg1, arg2) => ipcRenderer.invoke('newtab-message', arg1, arg2),
    switchtab: (arg, arg1) => ipcRenderer.invoke('swaptab-message', arg, arg1),
    getinfo: (arg) => ipcRenderer.invoke('getinfo-message', arg),
    loadurl: (arg, arg1) => ipcRenderer.invoke('loadurl-message', arg, arg1),
    closeview: (arg, arg1) => ipcRenderer.sendSync('closeview-message', arg, arg1),
    reload: (arg) => ipcRenderer.invoke('reload-message', arg),
    back: (arg) => ipcRenderer.invoke('back-message', arg),
    forward: (arg) => ipcRenderer.invoke('forward-message', arg),
    menu: (arg) => ipcRenderer.invoke('menu-message', arg),
    tabmenu: (arg) => ipcRenderer.invoke('tab-menu-message', arg),
    bookmark: (arg) => ipcRenderer.invoke('bookmark-message', arg),
    adpanel: () => ipcRenderer.invoke('adblock-panel-message'),
    enableblocker: (arg) => ipcRenderer.invoke('enable-blocker', arg),
    disableblocker: (arg) => ipcRenderer.invoke('disable-blocker', arg),
  }
)