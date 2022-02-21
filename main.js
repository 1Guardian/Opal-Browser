// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, webviewTag, MenuItem, BrowserView} = require('electron')
const session = require('electron').session;
var fs = require('fs');
var uuid = require('uuid');
const path = require('path');
const nativeImage = require('electron').nativeImage
const imageToBase64 = require('image-to-base64');

//Bookmarks variables
var jsonfile = require('jsonfile');
var bookmarks = path.join(__dirname, 'bookmarks.json');

//app.disableHardwareAcceleration();

//Menu.setApplicationMenu(false)
var adsblocked = 0;
var currentview = 1;
var holder;
var panelholder;
var checkmax = 0;
var URL;
var targetURL;
var Term;
var windows = ["0"]
var sessionsblocked = ["0"]
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

  //Listen for when a window is maximized
  mainWindow.on('maximize', async function () {
    //Reset BrowserView Size
    var sizer = holder.getSize();
    windows[currentview].setBounds({ x: 0, y:75, width: sizer[0] - 15, height: sizer[1] - 75 });
  })

    //Listen for when a window is unmaximized
    mainWindow.on('unmaximize', async function () {
      //Reset BrowserView Size
      var sizer = holder.getSize();
     windows[currentview].setBounds({ x: 0, y:75, width: sizer[0], height: sizer[1] - 75 });
    })
}

//###########################################################################################
// Functions to control the views
//###########################################################################################

//Make new browserviews on command
async function newview (arg1, arg2){
  var sesindex = "index".concat(windows.length)
  console.log(sesindex);
  const sespass = session.fromPartition(sesindex)
  const view = new BrowserView({
    webPreferences: {
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      session: sespass,
    }
  })
    windows.push(view);
    var sizer = holder.getSize();
    //Enable the Adblocker for the new session
    initblocker(windows[windows.indexOf(view)].webContents);
    sessionsblocked.push(true);
    if (windows[2] == undefined){
      holder.addBrowserView(view)
    }
    if (holder.isMaximized() == false){
      view.setBounds({ x: 0, y:75, width: sizer[0], height: sizer[1] - 75 })
    }
    else {
      view.setBounds({ x: 0, y:75, width: sizer[0] -15, height: sizer[1] - 75 })
    }
    //view.setBackgroundColor("#D9FFFFFF");
    view.setAutoResize({width: true, height: true})
    if (arg1 != undefined){
      view.webContents.loadURL(arg1)
    }
    else {
      view.webContents.loadURL('https://www.duckduckgo.com')
    }
    if (arg2 != undefined){
      view.webContents.setUserAgent(arg2);
    }
    //Update the page title
    view.webContents.on('page-title-updated', async function () {
      var onethrough = view.webContents.getURL();
      var twothrough = view.webContents.getTitle().replaceAll('"',"&quot;");
      twothrough = twothrough.replaceAll("'","&#39;");
      console.log(twothrough)
      var index = windows.indexOf(view);
      holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + onethrough + '"' + ',' + '"' + twothrough + '"' +')')
    })
    //update the page favicon
    view.webContents.on('page-favicon-updated', async (event, url) => {
      var index = windows.indexOf(view);
      holder.webContents.executeJavaScript('updateTab(' + index + ',' + '"' + 'none' + '"' + ',' + '"' + 'none' + '"' + ',' + '"' + url + '"' + ')')
    })
    //Listening For Fullscreen events
    view.webContents.on('enter-html-full-screen', async function () {
      //Set BrowserView Size to Fullscreen
      var indexof = windows.indexOf(view);
      var sizer = holder.getSize();
      windows[indexof].setBounds({ x: 0, y:0, width: sizer[0], height: sizer[1]});
    })
    view.webContents.on('leave-html-full-screen', async function () {
      //Reset BrowserView Size
      var indexof = windows.indexOf(view);
      var sizer = holder.getSize();
      windows[indexof].setBounds({ x: 0, y:75, width: sizer[0], height: sizer[1] - 75 });
    })
    //Listen For Certificate Errors
    view.webContents.on('certificate-error', async (event, url, error, certificate) => {
      console.log("Cert Error")
    })
    //Open a new tab in browser instead of new window in random
    view.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
      event.preventDefault();
      holder.webContents.executeJavaScript('countance(' + '"' + url + '"' + ');')
    })
    //listen for reasons a page wont load
    view.webContents.on('did-fail-load', async (event, code) => {
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
    //Listening for the destruction event to delete self
    view.webContents.on('destroyed', (event, url) => {
      delete view;   
    })
}

//Swap said browserviews on command
async function swapview (arg, arg1){
  arg = arg.replace("Index", "");
  holder.removeBrowserView(windows[arg])
  arg1 = arg1.replace("Index", "");
  var sizer = holder.getSize();
  if (holder.isMaximized() == false){
    windows[arg1].setBounds({ x: 0, y:75, width: sizer[0], height: sizer[1] - 75 })
  }
  else {
    windows[arg1].setBounds({ x: 0, y:75, width: sizer[0] -15, height: sizer[1] - 75 })
  }
  holder.addBrowserView(windows[arg1])
  holder.setBrowserView(windows[arg1])
  currentview = arg1;
}

//Get information on a browserview
function getinformation(arg){
  arg = arg.replace("Index", "");
  var info = [];
  info.push(windows[arg].webContents.getURL());
  var title = windows[arg].webContents.getTitle().replaceAll('"',"&quot;");
  title = title.replaceAll("'","&#39;");
  info.push(title);
  return info
}

//Load a url
async function loadurltab (arg1, arg2){
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
        currentview = i;
        return [i];
      }
    }
  
    return "Nothing";
  }
  
}

//Replaced Ad Blocker 
const ElectronBlocker = require ('@cliqz/adblocker-electron').ElectronBlocker;
const fetch = require('cross-fetch');

//Initialize the Adblocker
async function initblocker(arg){
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(arg.session);
  });
}

//Enable the Adblocker
async function enableblocker(arg){
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(windows[currentview].webContents.session);
    sessionsblocked[currentview] = true;
  });
}

//Disable The Adblocker
async function disableblocker(arg){
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(windows[currentview].webContents.session);
    blocker.disableBlockingInSession(windows[currentview].webContents.session);
    sessionsblocked[currentview] = false;
  });
}

//Insecure run switches

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');


app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


//################################################################################################
// listeners 
//################################################################################################


// Button Controls for topbar
const { ipcMain } = require('electron');
const console = require('console');
const { setTimeout } = require('globalthis/implementation');

//Close command
ipcMain.handle('close-message', async (event, someArgument) => {
  app.exit(1);
  return "1"
})

//Maximize command
ipcMain.handle('maximize-message', async (event, arg) => {
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
  windows[currentview].webContents.goBack();
  return "1"
})

//reload command
ipcMain.handle('reload-message', async (event, arg1) => {
  console.log(currentview)
  windows[currentview].webContents.reload();
  return "1"
})

//forward command
ipcMain.handle('forward-message', async (event, arg1) => {
  arg1 = arg1.replace("Index", "");
  windows[currentview].webContents.goForward();
  return "1"
})

//barmenu command
ipcMain.handle('menu-message', async (event, arg1) => {
  GenerateBooktab(arg1);
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

//Adblock Control Panel Handler
ipcMain.handle('adblock-panel-message', async (event) => {
  const adpanel = new BrowserWindow({
    frame: false,
    skipTaskbar: true,
    //hasShadow: false,
    //transparent: true,
    webPreferences: {
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'panelpreload.js'),
    }
  })
  panelholder = adpanel
  var sizer = holder.getSize();
  var deltax = sizer[0] - 330;
  var pozer = holder.getPosition();
  adpanel.webContents.loadFile('adblock-control.html');
  if (holder.isMaximized() == true){
    deltax = deltax - 10;
    adpanel.setBounds({ x: pozer[0] + deltax, y:pozer[1] + 83, width: 250, height: 275 });
  }
  else {
    adpanel.setBounds({ x: pozer[0] + deltax, y:pozer[1] + 75, width: 250, height: 275 });
  }
  adpanel.on('blur', (event) => {
    panelholder = undefined; 
    adpanel.hide();
    adpanel.close();
  })
})

//Ad Parse Listener
ipcMain.handle('parse-ads-message', async (event, arg, arg2) => {
  //checkURL(arg, arg2);
})

//Ad Bookmark Listener
ipcMain.handle('bookmark-message', async (event, arg) => {
  addBookmark(arg);
})

//enable adblocker
ipcMain.handle('enable-blocker', async (event, arg) => {
  enableblocker(arg);
})

//disable adblocker
ipcMain.handle('disable-blocker', async (event, arg) => {
  disableblocker(arg);
})

//close panel listener
ipcMain.handle('close-panel', async (event, arg) => {
  panelholder.close();
})

ipcMain.on('check-blocker', (event, arg) => {
  panelholder.webContents.executeJavaScript('populateBody(' + sessionsblocked[currentview] + ');')
  event.returnValue = 'pong'
})

//==========================================================================================================
//Testing stuff (WORKING WORKING WORKING!!!!! WEBVIEW IS RECEIVING THE CONTEXT REQUESTS WITHOUT REMOTE OR NODES)
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
var triplebar;

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

//#############################################################################################################3
//Book Marking Functions
//############################################################################################################3
//Add a bookmark
var Bookmark = function (id, url, faviconUrl, title) {
  this.id = id;
  this.url = url;
  this.icon = faviconUrl;
  this.title = title;
}

function addBookmark (arg) {
  arg = arg.replace("Index", "");
  var check = false;
  let url = windows[arg].webContents.getURL();
  let title = windows[arg].webContents.getTitle().replaceAll('"',"&quot;");
  title = title.replaceAll("'","&#39;");
  let fav1 = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url

  //Convert Url to base64 encoded string for use in context menus
  imageToBase64(fav1) // Path to the image
  .then(
      (response) => {
          let booktag = new Bookmark(uuid.v1(), url, response, title);
          jsonfile.readFile(bookmarks, function(err, books) {
              if (books == undefined) {
                jsonfile.writeFile(bookmarks, booktag, function (err) {});
              }
              else if (!Array.isArray(books)) {
                  if (booktag.url == books.url){

                  }
                  else{          
                    var bookarr = new Array(books, booktag);
                    jsonfile.writeFile(bookmarks, bookarr, function (err) {
                  });
                }
              }
              else {
                for(i=0; i < books.length; i++){
                  if (booktag.url == books[i].url){
                    books.splice(i, 1);
                    check = true;
                  }
                }
                if (check == false){
                  books.push(booktag);
                }
                jsonfile.writeFile(bookmarks, books, function (err) {
                });
              }
          });
      }
  )
  .catch(
      (error) => {
          console.log(error); // Logs an error if there was one
      }
  )
}

//#############################################################################################################################3
// Generating the triple-circle icon context menu
//#############################################################################################################################3

async function GenerateBooktab(arg1){

  //Create the code needed to generate the tabs in the menu
  var Booktabs = "new MenuItem({ label: 'Bookmarks', submenu: [{ label: 'Bookmark This Page', click: function() { holder.webContents.executeJavaScript('window.app.bookmark(TABS.activeindex)') } },{ label: 'Bookmark All Open Pages', click: function() { URL.openDevTools() } },{ type: 'separator'}, { label: 'Show Bookmark Manager', click: function() { holder.webContents.executeJavaScript('countance(' + '\"' + path.join(__dirname, '/Bookmarks/bookmarks.html').replaceAll(\"\\\\\",\"/\") + '\"' + ');') } },{ type: 'separator'},"
  var EndingBooktabs = "]})"
  var AppendingString= ""
  var TemplateStringFront = "{ label: \'"
  var TemplateString = "\', icon: nativeImage.createFromDataURL(\'data:image/png;base64,"
  var TemplateIconString ="\'), click: function() { holder.webContents.executeJavaScript('countance(' + '\"' +  \""
  var TemplateEndString = "\" + '\"' + ');') } },"
  var tempbase;

  //Append First Part of Menu
  triplebar = null;
  triplebar = new Menu()
  triplebar.append(new MenuItem({ label: 'New Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"' + ');') } }));
  triplebar.append(new MenuItem({ label: 'New Camouflaged Tab', submenu: [{ label: 'Firefox', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'firefoxagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'firefoxagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'firefoxagent(3)' + ');') } }]}, { label: 'Chrome', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'chromeagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'chromeagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'chromeagent(3)' + ');') } }] }, { label: 'Edge', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'edgeagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'edgeagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'edgeagent(3)' + ');') } }] }, { label: 'Internet Explorer', submenu: [{ label: 'Windows', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'ieagent(1)' + ');') } }, { label: 'Linux', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'ieagent(2)' + ');') } }, { label: 'OSX', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'ieagent(3)' + ');') } }] }], click: function() { console.log("YES"); } })); //Still to be done
  triplebar.append(new MenuItem({ label: 'New Obfuscated Agent Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'obfuscate()' + ');') } }));
  triplebar.append(new MenuItem({ label: 'New Mobile Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + "https://duckduckgo.com/" + '"'+ ',' + 'mobileagent(1)' + ');') } }));
  triplebar.append(new MenuItem({ label: 'New Incognito Tab', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
  triplebar.append(new MenuItem({ type: 'separator' }));
  triplebar.append(new MenuItem({ label: 'Downloads', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
  triplebar.append(new MenuItem({ label: 'History', click: function() { console.log("YES"); } })); //Still to be done

  jsonfile.readFile(bookmarks, function(err, books) {
    if (books == undefined) {
      //Generate the New Menu
      Booktabs = Booktabs.concat(EndingBooktabs);
      triplebar.append(eval(Booktabs)); 

      triplebar.append(new MenuItem({ type: 'separator' }));
      triplebar.append(new MenuItem({ label: 'Zoom', click: function() { URL.openDevTools() } }));
      triplebar.append(new MenuItem({ type: 'separator' }));
      triplebar.append(new MenuItem({ label: 'Print', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
      triplebar.append(new MenuItem({ label: 'Find in Page', click: function() { console.log("YES"); } })); //Still to be done
      triplebar.append(new MenuItem({ label: 'Settings', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
      triplebar.append(new MenuItem({ type: 'separator' }));
      triplebar.append(new MenuItem({ label: 'About', click: function() { URL.openDevTools() } }));
      setTimeout(function(arg){PopupTheMenu(arg1)}, 1);
    }
    else if (!Array.isArray(books)) {
        if (books.url == books.url){
          AppendingString = AppendingString.concat(TemplateStringFront.concat(books.title.replaceAll('&quot;',"\"").replaceAll("&#39;",'’').concat(TemplateString.concat(books.icon.concat(TemplateIconString.concat(books.url.concat(TemplateEndString)))))));
          AppendingString = AppendingString.concat(",");
          Booktabs = Booktabs.concat(AppendingString);
          AppendingString=""
          Booktabs = Booktabs.substring(0, Booktabs.length - 1);
          Booktabs = Booktabs.concat(EndingBooktabs);
          triplebar.append(eval(Booktabs)); 

          //Appending Ending Part 
          triplebar.append(new MenuItem({ type: 'separator' }));
          triplebar.append(new MenuItem({ label: 'Zoom', click: function() { URL.openDevTools() } }));
          triplebar.append(new MenuItem({ type: 'separator' }));
          triplebar.append(new MenuItem({ label: 'Print', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
          triplebar.append(new MenuItem({ label: 'Find in Page', click: function() { console.log("YES"); } })); //Still to be done
          triplebar.append(new MenuItem({ label: 'Settings', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
          triplebar.append(new MenuItem({ type: 'separator' }));
          triplebar.append(new MenuItem({ label: 'About', click: function() { URL.openDevTools() } }));
          setTimeout(function(arg){PopupTheMenu(arg1)}, 1);
        }
    }
    else {
      for(i=0; i < books.length; i++){
        AppendingString = AppendingString.concat(TemplateStringFront.concat(books[i].title.replaceAll('&quot;',"\"").replaceAll("&#39;",'’').concat(TemplateString.concat(books[i].icon.concat(TemplateIconString.concat(books[i].url.concat(TemplateEndString)))))));
        AppendingString = AppendingString.concat(",");
        Booktabs = Booktabs.concat(AppendingString);
        AppendingString=""
      }
      Booktabs = Booktabs.substring(0, Booktabs.length - 1);
      Booktabs = Booktabs.concat(EndingBooktabs);
      triplebar.append(eval(Booktabs)); 

      //Appending Ending Part 
      triplebar.append(new MenuItem({ type: 'separator' }));
      triplebar.append(new MenuItem({ label: 'Zoom', click: function() { URL.openDevTools() } }));
      triplebar.append(new MenuItem({ type: 'separator' }));
      triplebar.append(new MenuItem({ label: 'Print', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"' + ');') } }));
      triplebar.append(new MenuItem({ label: 'Find in Page', click: function() { console.log("YES"); } })); //Still to be done
      triplebar.append(new MenuItem({ label: 'Settings', click: function() { holder.webContents.executeJavaScript('countance(' + '"' + targetURL + '"'+ ',' + 'obfuscate()' + ');') } }));
      triplebar.append(new MenuItem({ type: 'separator' }));
      triplebar.append(new MenuItem({ label: 'About', click: function() { URL.openDevTools() } }));
      setTimeout(function(arg){PopupTheMenu(arg1)}, 1);
    }
  });
}


async function PopupTheMenu(arg1){
  arg1 = arg1.replace("Index", "");
  var sizer = holder.getSize();
  triplebar.popup({x:sizer[0]-205, y:75});
}