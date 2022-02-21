function backpage(page){
    var x = document.getElementsByClassName(page);
    x[1].goBack();
/*    var backbtn = document.getElementsByClassName(backbutton);
    var forwardbtn = document.getElementsByClassName(forwardbutton);
    
    if (x[1].canGoBack() == 0){
        backbtn.setAttribute("style", "opacity: .3;");
    }
    else {
        backbtn.setAttribute("style", "opacity: .7;");
    }
    if (x[1].canGoForward() == 0){
        forwardbtn.setAttribute("style", "opacity: .3;");
    }
    else {
        forwardbtn.setAttribute("style", "opacity: .7;");
    }*/
}

function forwardpage(page){
    var x = document.getElementsByClassName(page);
    x[1].goForward();
    /*var backbtn = document.getElementsByClassName(backbutton);
    var forwardbtn = document.getElementsByClassName(forwardbutton);
    
    if (x[1].canGoBack() == 0){
        backbtn.setAttribute("style", "opacity: .3;");
    }
    else {
        backbtn.setAttribute("style", "opacity: .7;");
    }
    if (x[1].canGoForward() == 0){
        forwardbtn.setAttribute("style", "opacity: .3;");
    }
    else {
        forwardbtn.setAttribute("style", "opacity: .7;");
    }*/
}

function reloadpage(page){
    var x = document.getElementsByClassName(page);
    x[1].reload();
}