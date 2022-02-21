function switchfocus(activeindex){
    // Hide the window previously being used
    var x = document.getElementsByClassName(TABS.activeindex);
    x[0].setAttribute("style", "background-color: #F3F3F3; border-color: #F3F3F3;");

    //show the new window
    var y = document.getElementsByClassName(activeindex);
    window.app.getinfo(activeindex).then(ret_val => {
        var bar = document.getElementById('searchholdingbar').value;
        bar = ret_val[0];
        //Change Secure Icon If Using Http
        if(bar.startsWith("http://")){
            document.getElementById('secure-icon').setAttribute("style", "user-select: none; position: absolute; height:18px; top: 4px; left:4px; opacity:0; transform: rotate(360deg);")
            document.getElementById('insecure-icon').setAttribute("style", "user-select: none; position: absolute; height:18px; top: 4px; left:4px; opacity:.5; transform: rotate(360deg);")
        }
        else {
            document.getElementById('secure-icon').setAttribute("style", "user-select: none; position: absolute; height:18px; top: 4px; left:4px; opacity:.5; transform: rotate(360deg);")
            document.getElementById('insecure-icon').setAttribute("style", "user-select: none; position: absolute; height:18px; top: 4px; left:4px; opacity:0; transform: rotate(360deg);")
        }
     })
    y[0].setAttribute("style", "background-color: white; border-color: white;");

    //update the namespace
    window.app.switchtab(TABS.activeindex, activeindex);
    return activeindex;
}
