function closewindow(tabtoclose){
    //Close the window
    var y = document.getElementsByClassName(tabtoclose);
    y[0].parentNode.removeChild(y[0]);
}