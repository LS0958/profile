const pages = document.querySelectorAll('.page');
const max = document.body.scrollHeight - window.innerHeight;
let scrollp = 0;
const totalpages = 5; //except home page
// let index = 0;

const setTranform = () => {
    pages.forEach((e, i) => {
        setTimeout(() => {
            e.style.transform = `translateZ(${scrollp - max / totalpages * i}px)`;
        }, 100);
    })
}

setTranform();

window.addEventListener('scroll', e => {
    scrollp = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollp < max) setTranform();
    // if(scrollp>arr[index])index++;
    // if(scrollp<arr[index])index--;
})


function target(n) {
    scrollp = document.body.scrollTop || document.documentElement.scrollTop;
    window.scrollTo(0, max / totalpages * (n - 1))
    setTranform();
}
