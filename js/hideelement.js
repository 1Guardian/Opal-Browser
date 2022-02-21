function hideelement( el, swapel, speed ) {
    var seconds = speed/2000;
    el.style.transition = "opacity "+seconds+"s ease";

    el.style.opacity = 0;
    setTimeout(function() {
        el.style.display = 'none';

        //bring in the new element after first one is collapsed
        swapel.style.display = 'flex';
        swapel.style.opacity = 0;
        swapel.style.transition = "opacity "+seconds+"s ease";
        swapel.style.opacity = 1;
    }, speed);
}