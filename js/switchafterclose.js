function switchafterclose(activeindex){    
    //show the new window
    var newone;
    console.log(activeindex)
    console.log(TABS.activeindex)
    if (activeindex != TABS.activeindex){
        newone = window.app.closeview(activeindex, true);
    }
    else {
        newone = window.app.closeview(activeindex);
    }
        console.log(newone)
        if (newone == "Nothing"){
            console.log("returning nothing")
            TABS.activeindex = "Nothing"
        }
        else if (activeindex != TABS.activeindex){
            console.log("no swap needed")
        }
        else if ("Index".concat(newone) == TABS.activeindex){
            console.log("not swapping")
        }
        else {
            var z = document.getElementsByClassName("Index".concat(newone));
            z[0].setAttribute("style", "background-color: white; border-color: white;");
            window.app.getinfo("Index".concat(newone)).then(ret_val => {
                document.getElementById('searchholdingbar').value = ret_val[0];
            })
            TABS.activeindex = "Index".concat(newone);
        }
    console.log("Finishing")
}