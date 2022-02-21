function obfuscate(){
var id = random(5).concat('/5.0', '(X', random(3), '; ', random(6), '; *NIX ', random(6), '; rv:', random(3), ') Gecko/20100101');
return id
}
function chromeagent(arg){
    if (arg == 1){
        var id = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36";
    }
    else if (arg == 2){
        var id = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36";
    }
    else if (arg == 3){
        var id = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36";
    }
    return id
}
function firefoxagent(arg){
    if (arg == 1){
        var id = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:10.0) Gecko/20100101 Firefox/84.0";
    }
    else if (arg == 2){
        var id = "Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/84.0";
    }
    else if (arg == 3){
        var id = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4; rv:10.0) Gecko/20100101 Firefox/84.0";
    }
    return id
}
function ieagent(arg){
    if (arg == 1){
        var id = "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko";
    }
    else if (arg == 2){
        var id = "Mozilla/5.0 (X11; Linux x86_64; Trident/7.0; AS; rv:11.0) like Gecko";
    }
    else if (arg == 3){
        var id = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4; Trident/7.0; AS; rv:11.0) like Gecko";
    }
    return id
}
function edgeagent(arg){
    if (arg == 1){
        var id = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43";
    }
    else if (arg == 2){
        var id = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43";
    }
    else if (arg == 3){
        var id = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43";
    }
    return id
}
function mobileagent(arg){
    if (arg == 1){
        var id = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36";
    }
    return id
}