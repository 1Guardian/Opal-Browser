//Check if URL is valid
function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}

//Check if entered text is an ip
function is_ip(str)
{
  regexp =  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}

function loadurlbar(){
    var textbar = document.getElementById("searchholdingbar");
    var validitybar = document.getElementById("holdingbarforterm");
    var active = TABS.activeindex;
    var asserted = document.getElementsByClassName(active);
    validitybar.value = textbar.value;
    console.log(textbar.value)
    console.log(is_url(textbar.value))
    if (is_url(textbar.value) == false){
        if(is_ip(textbar.value) == false){
            var str = textbar.value;
            str = str.substring(0, str.indexOf(':'));
            if (is_ip(str) == false){
                if(textbar.value.startsWith("file://")){
                    window.app.loadurl(TABS.activeindex,textbar.value);
                }
                else {
                    window.app.loadurl(TABS.activeindex,"https://duckduckgo.com/?q=".concat(textbar.value));
                }
            }
            else {
                console.log("Loading IP")
                textbar.value = "http://".concat(textbar.value)
                window.app.loadurl(TABS.activeindex,textbar.value);
            }
        }
        else{
            console.log("Loading IP")
            textbar.value = "http://".concat(textbar.value)
            window.app.loadurl(TABS.activeindex,textbar.value);
        }
    }
    else{
        if(textbar.value.includes("https://") != true){
            textbar.value = "https://".concat(textbar.value)
        }
        console.log("Loading URL")
        window.app.loadurl(TABS.activeindex,textbar.value);
    }
}