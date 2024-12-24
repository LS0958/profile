let page = (1600-window.innerHeight)/4;
window.addEventListener('scroll', function() {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    console.log(scrollTop,page);  
    if(scrollTop>=page){
        page+=page
    }
});
