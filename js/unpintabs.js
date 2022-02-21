function restoretab(arg1, arg2, activetab) {
    // Create The Tab For the restored Pin
    var tab = document.createElement("DIV");

    //Get the favicon from the old tab
    var sel = document.getElementsByClassName(arg1);
    var oldcanvas = sel[0].children[3];
    var storedimg = oldcanvas.toDataURL("image/png");
    var storedtitle = sel[0].children[2].textContent;
    console.log(sel[0].children[2].textContent)

    tab.classList.add("leaflets");
    index = arg1;
    tab.classList.add(index);
    tab.storedval = index;
    var tabbar = document.getElementById("tabbar");
    tabbar.appendChild(tab);
    if (arg1 == TABS.activeindex){
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
    
    //Close the pinned tab
    closewindow(arg1);

    // Call webview creation script
    restoreclosebtn(tab.storedval, tab);
    restoreptag(tab.storedval, tab, storedtitle);
    restorefavicon(storedimg, tab);
  
    //Add a Click Listener
    tab.addEventListener('contextmenu', e => {
      updatecurrenttab(tab.storedval);
    });
    return Num; 
}
  
function restoreclosebtn(stored, tab){
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
  
function restoreptag(stored, tab, oldtitle){
    //Create the title ptag
    var ptag = document.createElement("P");
    ptag.setAttribute("style", "width: calc(100% - calc(8.5px + 16px + 16px + 8.5px + 10px)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: absolute; left:30px; top:-4px; z-index:0;");
    ptag.storedval = stored;
    ptag.innerHTML = oldtitle;
    tab.appendChild(ptag);
}
  
function restorefavicon(storedimg, tab){
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
    myImg.src=storedimg;
}