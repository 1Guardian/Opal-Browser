function addpin(arg){
    sel = document.getElementsByClassName(arg);
    if (sel[0].getAttribute("pinned") == "true"){
        console.log("PINNED")
        restoretab(arg);
    }
    else {
        var tab = document.createElement("DIV");
        tab.classList.add("item");

        //Go through standard New Tab Movements
        index = arg;
        tab.classList.add(index);
        tab.storedval = index;
        tab.setAttribute("pinned", "true");
        

        //Get favicon to carry over
        var sel = document.getElementsByClassName(arg);
        var oldcanvas = sel[0].children[3];
        var storedimg = oldcanvas.toDataURL("image/png");
        var storedptag = sel[0].children[2].textContent

        //Making the Backdrop And Adding it
        var backdrop = document.createElement("DIV");
        if (TABS.activeindex == arg){
            tab.setAttribute("style", "background-color:white;");
        }
        else {
            tab.setAttribute("style", "background-color:#F3F3F3;");
        }
        backdrop.setAttribute("style", "height:100%; width:100%; position: absolute; z-index:1;");
        backdrop.onclick = function () {switchupdate(tab.storedval)};
        tab.appendChild(backdrop);

        //Close the non-pinned version of the tab
        closewindow(arg);

        //Add the required compontents
        addhiddenclosebutton(tab.storedval, tab);
        hiddenptag(tab.storedval, tab, storedptag);
        shownfavicon(storedimg, tab);

        //Add The Pin To The Tabbar
        var pinbar = document.getElementById("pinbar");
        pinbar.appendChild(tab);

        //Keep the listener Active
        tab.addEventListener('contextmenu', e => {
            updatecurrenttab(tab.storedval);
        });
    }
}

function addhiddenclosebutton(stored, tab){
    //Create Closebutton 
    var btn = document.createElement("IMG");
    btn.storedval = stored;
    btn.src="./img/close.png";
    btn.setAttribute("style", "display: none; width: 10px; position: absolute; right:8.5px; top: 11.5px; z-index:1; border-radius: 50%");
    btn.setAttribute("class", "closeleaflet");
    btn.setAttribute('draggable', false);
    tab.appendChild(btn);
}

function hiddenptag(stored, tab, storedptag){
    //Create the title ptag
    var ptag = document.createElement("P");
    ptag.setAttribute("style", "display: none; width: calc(100% - calc(8.5px + 16px + 16px + 8.5px + 10px)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: absolute; left:30px; top:-4px; z-index:0;");
    ptag.storedval = stored;
    ptag.innerHTML = storedptag;
    tab.appendChild(ptag);
}

function shownfavicon(storedimg, tab){
    //Create the favicon for the page
    var favicon = document.createElement("CANVAS");
    favicon.setAttribute("style", "width: 16px; position: absolute; top: 10px; left: 12px; min-width: 17px;");
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
