function newtab(arg1, arg2) {
  // Keep Track of current active tabs 
  Num = TABS.index + 1;
  // Create The Tab For the Corresponding Window
  var tab = document.createElement("DIV");
  tab.classList.add("leaflets");
  index = "Index".concat(TABS.index);
  tab.classList.add(index);
  //tab.innerHTML = index;
  tab.storedval = index;
  //tab.onclick = function () {switchupdate(tab.storedval)};
  var tabbar = document.getElementById("tabbar");
  tabbar.appendChild(tab);
  if (Num == 2){
    tab.setAttribute("style", "background-color: white; border-color: white;");
  }
  else {
    tab.setAttribute("style", "background-color: #F3F3F3; border-color: #F3F3F3;");
  }

  // Insert the naming process here
  var backdrop = document.createElement("DIV");
  backdrop.setAttribute("style", "height:100%; width:100%; position: absolute; z-index:1;");
  backdrop.onclick = function () {switchupdate(tab.storedval)};
  tab.appendChild(backdrop);
  
  // Call webview creation script
  newwindow(tab.storedval, arg1, arg2);
  closebtn(tab.storedval, tab);
  ptag(tab.storedval, tab);
  favicon(tab.storedval, tab);

  //Add a Click Listener
  tab.addEventListener('contextmenu', e => {
    updatecurrenttab(tab.storedval);
  });
  return Num; 
}

function newwindow(stored, arg1, arg2){
  window.app.newtab(arg1, arg2);
}


function closebtn(stored, tab){
  //Create Closebutton 
  var btn = document.createElement("IMG");
  btn.storedval = stored;
  btn.src="./img/close.png";
  btn.setAttribute("style", "width: 10px; position: absolute; right:8.5px; top: 11.5px; z-index:1; border-radius: 50%");
  btn.setAttribute("class", "closeleaflet");
  btn.onclick = function () {closetab(btn.storedval)};
  btn.setAttribute('draggable', false);
  tab.appendChild(btn);
}

function ptag(stored, tab){
  //Create the title ptag
  var ptag = document.createElement("P");
  ptag.setAttribute("style", "width: calc(100% - calc(8.5px + 16px + 16px + 8.5px + 10px)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: absolute; left:30px; top:-4px; z-index:0;");
  ptag.storedval = stored;
  ptag.innerHTML = "";
  tab.appendChild(ptag);
}

function favicon(stored, tab){
  //Create the favicon for the page
  var favicon = document.createElement("CANVAS");
  favicon.setAttribute("style", "width: 16px; position: absolute; top: 8px; left: 8.5px; min-width: 17px;");
  favicon.src = "./img/loading.gif";
  favicon.height =32;
  favicon.width =32;
  tab.appendChild(favicon);
  var canvas = favicon;
  var context = canvas.getContext("2d");

  var myImg = new Image();
  myImg.onload = function() {
    context.clearRect(2, 2, canvas.width, canvas.height);
    context.drawImage(myImg, 0, 0);
  };
  myImg.src="data:image/gif;base64,R0lGODlhHQAcAHAAACH/C05FVFNDQVBFMi4wAwEBAAAh+QQJAABPACwAAAAAHQAcAIYAAAA5OTkzMzM0NDRERET///9oaGhpaWlmZmY4ODgyMjI/Pz/GxsbNzc3MzMxfX19nZ2dqamo6OjpBQUHS0tLOz8/Ly8vQ0NBoZ2dnaGhra2vKysrOzs7Pz8/T09O/v788PDzJycmcnJybm5ttbW0rKysjIyPV1dXR0dGfn5+ZmZmYmJiRkZF1dXVFRUVkZGTIyMjU1NTLzs6enp6dnZ1lZWVdXV0wMDCvr6/S09OampqioqJsa2tmaWk9PT3W1taOjo6goKCqqqqVlZWXl5fCwsKzs7Pb29va2trZ2dl/f3/Nzs7Hx8fMzc3Lzc0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4IBPgoOEggKHAgSFi4xPCAiDiIeDDg6NhY+PhoiKTw5HlZeDmZoEnJ6VoaKOjy2QkgKeoKqLKoSkCCaIJrO0noQqwaOtpocIlaCUtMHMtqQ2iEK9qKmWT8FCzUKkxcjVP5/LzcFAkIvVDuC+gtq2jeGpos2X1efoDh8fq/epR/7//qzRA/gPngMK3vYFrNbr3qqG9QrN2vdJ1CwKyd41XDQLFMJ1gtBNC8nPIMN7E2XBo1Yy1EllAk16CweTEC2IMmmBJEmTocqdhQyytNRPID2aLI+ETEkRZkWSq95FFBUIADs=";
}