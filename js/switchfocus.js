function switchfocus(activeindex){
    // Hide the window previously being used
    var x = document.getElementsByClassName(TABS.activeindex);
    x[0].setAttribute("style", "background-color: #F3F3F3; border-color: #F3F3F3;");

    //show the new window
    var y = document.getElementsByClassName(activeindex);
    window.app.getinfo(activeindex).then(ret_val => {
        document.getElementById('searchholdingbar').value = ret_val[0];
     })
    y[0].setAttribute("style", "background-color: white; border-color: white;");

    //update the namespace
    window.app.switchtab(TABS.activeindex, activeindex);
    return activeindex;
}