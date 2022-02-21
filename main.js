// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, webviewTag, MenuItem, BrowserView} = require('electron')

//Menu.setApplicationMenu(false)
const path = require('path')
var holder;
var checkmax = 0;
var URL;
var targetURL;
var Term;
var mainwin;
var windows = ["0"]
var menumade = false;
var menushown = false;
var triplemenuholder;
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1919,
    height: 1079,
    frame: false,
    webPreferences: {
      allowRunningInsecureContent: false,
      webviewTag: false,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
      //sandbox: true,
      contextIsolation: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');
  holder = mainWindow;

  // Open the DevTools.
 // mainWindow.webContents.openDevTools()
}

//###########################################################################################
// Functions to control the views
//###########################################################################################

//Make new browserviews on command
function newview (arg1, arg2){
  const view = new BrowserView({
    webPreferences: {
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
    }
  })
    windows.push(view);
    var sizer = holder.getSize();
    if (windows[2] == undefined){
      holder.addBrowserView(view)
    }
    view.setBounds({ x: 0, y:75, width: sizer[0], height: sizer[1] - 75 })
    view.setAutoResize({width: true, height: true})
    if (arg1 != undefined){
      view.webContents.loadURL(arg1)
    }
    else {
      view.webContents.loadURL('https://www.duckduckgo.com/')
    }
    if (arg2 != undefined){
      view.webContents.setUserAgent(arg2);
    }
    //Update the page title
    view.webContents.on('page-title-updated', function () {
      var onethrough = view.webContents.getURL();
      var twothrough = view.webContents.getTitle();
      var index = windows.indexOf(view);
      //console.log('updateTab(' + index + ',' + '"' + onethrough + '"' + ',' + '"' + twothrough + '"' +')')
      holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + onethrough + '"' + ',' + '"' + twothrough + '"' +')')
    })
    //update the page favicon
    view.webContents.on('page-favicon-updated', (event, url) => {
      var index = windows.indexOf(view);
      holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + 'none' + '"' + ',' + '"' + 'none' + '"' + ',' + '"' + url + '"' + ')')
    })
    //listen for reasons a page wont load
    view.webContents.on('did-fail-load', (event, code) => {
      var index = windows.indexOf(view);
      console.log("FAILED: " + code)
      if (code == -105){
        view.webContents.loadURL(path.join(__dirname, '/404/404.html'))
        console.log("404")
        holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + 'none' + '"' + ',' + '"' + '404 Page Not Found' + '"' + ',' + '"' + 'error' + '"' + ')')
      }
      else if (code == -6){
        view.webContents.loadURL(path.join(__dirname, '/404/404.html'))
        console.log("404")
        holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + 'none' + '"' + ',' + '"' + '404 File Not Found' + '"' + ',' + '"' + 'error' + '"' + ')')
      }
      else if (code == -106){
        view.webContents.loadURL(path.join(__dirname, '/-106/nointernet.html'))
        console.log("No Internet")
        holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + 'none' + '"' + ',' + '"' + 'No Internet Connection' + '"' + ',' + '"' + 'error' + '"' + ')')
      }
    })
}

//Swap said browserviews on command
function swapview (arg, arg1){
  arg = arg.replace("Index", "");
  holder.removeBrowserView(windows[arg])
  arg1 = arg1.replace("Index", "");
  holder.addBrowserView(windows[arg1])
  holder.setBrowserView(windows[arg1])
}

//Get information on a browserview
function getinformation(arg){
  arg = arg.replace("Index", "");
  var info = [];
  info.push(windows[arg].webContents.getURL());
  info.push(windows[arg].webContents.getTitle());
  return info
}

//Load a url
function loadurltab (arg1, arg2){
  arg1 = arg1.replace("Index", "");
  windows[arg1].webContents.loadURL(arg2);
}

//close a view
function closeview (arg1, arg2){
  arg1 = arg1.replace("Index", "");
  holder.removeBrowserView(windows[arg1])
  windows[arg1].webContents.destroy();
  windows[arg1] = "0";
  if (arg2 == undefined){
    for (var i = windows.length -1; i > 0; i--) {
      if (windows[i] != "0"){
        holder.setBrowserView(windows[i])
        holder.setBrowserView(windows[i])
        return [i];
      }
    }
  
    return "Nothing";
  }
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

//Insecure run switches
/*
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
*/
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


//################################################################################################
// listeners 
//################################################################################################


// Button Controls for topbar
const { ipcMain } = require('electron');

//Close command
ipcMain.handle('close-message', async (event, someArgument) => {
  app.exit(1);
  return "1"
})

//Maximize command
ipcMain.handle('maximize-message', (event, arg) => {
  checkmax = holder.isMaximized();
    if (checkmax == 0){
      holder.maximize();
    }
    else {
      holder.unmaximize();
    }
  checkmax = holder.isMaximized();
})

//Maximize command
ipcMain.handle('min-message', async (event, someArgument) => {
  holder.minimize();
  return "1"
})

//New Tab command
ipcMain.handle('newtab-message', async (event, arg1, arg2) => {
  newview(arg1, arg2);
  return "1"
})

//swap Tab command
ipcMain.handle('swaptab-message', async (event, arg1, arg2) => {
  swapview(arg1, arg2);
  return "1"
})

//get info on Tab command
ipcMain.handle('getinfo-message', async (event, arg1) => {
  var info = getinformation(arg1)
  return info
})

//load a url on Tab command
ipcMain.handle('loadurl-message', async (event, arg1, arg2) => {
  loadurltab(arg1, arg2);
  return "1"
})

//close a url on Tab command
ipcMain.on('closeview-message', async (event, arg1, arg2) => {
  var tab = closeview(arg1, arg2);
  event.returnValue = tab
})

//back command
ipcMain.handle('back-message', async (event, arg1) => {
  arg1 = arg1.replace("Index", "");
  windows[arg1].webContents.goBack();
  return "1"
})

//reload command
ipcMain.handle('reload-message', async (event, arg1) => {
  arg1 = arg1.replace("Index", "");
  windows[arg1].webContents.reload();
  return "1"
})

//forward command
ipcMain.handle('forward-message', async (event, arg1) => {
  arg1 = arg1.replace("Index", "");
  windows[arg1].webContents.goForward();
  return "1"
})

//barmenu command
ipcMain.handle('menu-message', async (event, arg1) => {
  arg1 = arg1.replace("Index", "");
  var sizer = holder.getSize();
  triplebar.popup({x:sizer[0]-205, y:75});
  return "1"
})

//Tab Menu Handler
ipcMain.handle('tab-menu-message', async (event, arg) => {
  SELECTEDTAB = arg
  TABNUM = arg;
  arg = arg.replace("Index", "");
  TABSEL = windows[arg].webContents;
  tabbar.popup(windows[arg].webContents);
})


//==========================================================================================================
//Testing Shit (WORKING WORKING WORKING!!!!! WEBVIEW IS RECEIVING THE CONTEXT REQUESTS WITHOUT REMOTE OR NODES)
//==========================================================================================================

//text highlight Menu
var highlight = new Menu();
highlight.append(new MenuItem({ label: 'Copy', role: 'copy' }));
highlight.append(new MenuItem({ label: 'Search For Selected Text', click: function() { URL.loadURL("https://duckduckgo.com/?q=".concat(Term)) } }));
highlight.append(new MenuItem({ label: 'Print', role: 'paste' }));
highlight.append(new MenuItem({ type: 'separator' }));
highlight.append(new MenuItem({ label: 'Inspect Elements', click: function() { URL.openDevTools() } }));

//input Menu
var input = new Menu();
input.append(new MenuItem({ label: 'Cut', role: 'cut' }));
input.append(new MenuItem({ label: 'Copy', role: 'copy' }));
input.append(new MenuItem({ label: 'Paste', role: 'paste' }));
input.append(new MenuItem({ label: 'Paste With Target Style', role: 'pasteAndMatchStyle' }));
input.append(new MenuItem({ label: 'Select All', role: 'selectAll' }));
input.append(new MenuItem({ type: 'separator' }));
input.append(new MenuItem({ label: 'Inspect Elements', click: function() { URL.openDevTools() } }));

//pagebody Menu
var pagebody = new Menu();
pagebody.append(new MenuItem({ label: 'Back', click: function() { URL.goBack() } }));
pagebody.append(new MenuItem({ label: 'Forward', click: function() { URL.goForward() } }));
pagebody.append(new MenuItem({ label: 'Reload', click: function() { URL.reload() } }));
pagebody.append(new MenuItem({ type: 'separator' }));
pagebody.append(new MenuItem({ label: 'Save As', click: function() { URL.downloadURL(URL.getURL()); } }));
pagebody.append(new MenuItem({ label: 'Print', click: function() { URL.print() } }));
pagebody.append(new MenuItem({ type: 'separator' }));
pagebody.append(new MenuItem({ label: 'View Source', click: function() { URL.loadURL("view-source:".concat(URL.getURL())) } }));
pagebody.append(new MenuItem({ label: 'Inspect Elements', click: function() { URL.openDevTools() } }));

//link Menu
var link = new Menu();
link.append(new MenuItem({ label: 'Open Link in New Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
link.append(new MenuItem({ label: 'Open Link in New Window', click: function() { console.log("YES"); } })); //Still to be done
link.append(new MenuItem({ label: 'Open Link in Obfuscated Agent Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
link.append(new MenuItem({ type: 'separator' }));
link.append(new MenuItem({ label: 'Save Link As', click: function() { URL.downloadURL(targetURL); } }));
link.append(new MenuItem({ type: 'separator' }));
link.append(new MenuItem({ label: 'Inspect Elements', click: function() { URL.openDevTools() } }));

//triplebar Menu
var triplebar = new Menu();
triplebar.append(new MenuItem({ label: 'New Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"' + ');') } }));
triplebar.append(new MenuItem({ label: 'New Camouflaged Tab', submenu: [{ label: 'Firefox', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'firefoxagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'firefoxagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'firefoxagent(3)' + ');') } }]}, { label: 'Chrome', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'chromeagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'chromeagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'chromeagent(3)' + ');') } }] }, { label: 'Edge', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'edgeagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'edgeagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'edgeagent(3)' + ');') } }] }, { label: 'Internet Explorer', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'ieagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'ieagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'ieagent(3)' + ');') } }] }], click: function() { console.log("YES"); } })); //Still to be done
triplebar.append(new MenuItem({ label: 'New Obfuscated Agent Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'obfuscate()' + ');') } }));
triplebar.append(new MenuItem({ label: 'New Mobile Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'mobileagent(1)' + ');') } }));
triplebar.append(new MenuItem({ label: 'New Incognito Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
triplebar.append(new MenuItem({ type: 'separator' }));
triplebar.append(new MenuItem({ label: 'Downloads', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
triplebar.append(new MenuItem({ label: 'History', click: function() { console.log("YES"); } })); //Still to be done
triplebar.append(new MenuItem({ label: 'Bookmarks', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
triplebar.append(new MenuItem({ type: 'separator' }));
triplebar.append(new MenuItem({ label: 'Zoom', click: function() { URL.openDevTools() } }));
triplebar.append(new MenuItem({ type: 'separator' }));
triplebar.append(new MenuItem({ label: 'Print', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
triplebar.append(new MenuItem({ label: 'Find in Page', click: function() { console.log("YES"); } })); //Still to be done
triplebar.append(new MenuItem({ label: 'Settings', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
triplebar.append(new MenuItem({ type: 'separator' }));
triplebar.append(new MenuItem({ label: 'About', click: function() { URL.openDevTools() } }));

//tabs Menu
var tabbar = new Menu();
tabbar.append(new MenuItem({ label: 'New Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"' + ');') } }));
tabbar.append(new MenuItem({ label: 'Reload', click: function() { TABSEL.reload() } }));
tabbar.append(new MenuItem({ label: 'Move Tab To A New Window', click: function() { URL.openDevTools() } })); // Still to be done
tabbar.append(new MenuItem({ type: 'separator' }));
tabbar.append(new MenuItem({ label: 'Pin Tab', click: function() { holder.webContents.executeJavaScript('addpin(' + '"' + SELECTEDTAB + '"' + ');') } }));
tabbar.append(new MenuItem({ label: 'Duplicate Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + TABSEL.getURL() + '"' + ');') } }));
tabbar.append(new MenuItem({ label: 'Toggle Audio From Tab', click: function() { if (TABSEL.isAudioMuted() == true){ TABSEL.setAudioMuted(false)} else {TABSEL.setAudioMuted(true)} } }));
tabbar.append(new MenuItem({ label: 'Close Tab', click: function() { holder.webContents.executeJavaScript('closetab(' + '"' + TABNUM + '"' + ');') } }));

app.on("web-contents-created", (...[/* event */, webContents]) => {
  //Webview is being shown here as a window type
  webContents.on("context-menu", (event, click) => {
    URL = webContents
    str = (("file:///".concat(path.join(__dirname, 'index.html'))).replaceAll("\\","/"))
    //If a tab is right clicked:
    if (click.y <= 36 && click.pageURL == ("file:///".concat(path.join(__dirname, 'index.html'))).replaceAll("\\","/")){
      //event.preventDefault();
      tabbar.popup(webContents);
    }
    else{
      if (click.linkURL != ''){
        targetURL = click.linkURL;
        event.preventDefault();
        link.popup(webContents);
      }
      if (click.selectionText != '' && click.inputFieldType != 'none'){
        event.preventDefault();
        input.popup(webContents);
      }
      if (click.selectionText != ''){
        Term = click.selectionText;
        event.preventDefault();
        highlight.popup(webContents);
      }
      if (click.inputFieldType != 'none'){
        event.preventDefault();
        input.popup(webContents);
      }
      if (click.linkURL == '' && click.selectionText == '' && click.inputFieldType == 'none'){
        event.preventDefault();
        pagebody.popup(webContents);
      }
    }
    }, false);
});