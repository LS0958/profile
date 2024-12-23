const pages = document.querySelectorAll('.page');
const max = document.body.scrollHeight - window.innerHeight;
let scrollp = 0;
let arr = [0,max / 4, max / 3, max / 2, max];
let index = 0;

const setTranform = () => {
    pages.forEach((e,i)=>{
        // e.setAttribute('data-n',arr[index]);
        e.style.transform = `translateZ(${scrollp - arr[i]}px)`;
    })
}

setTranform();

window.addEventListener('scroll', e => {
    scrollp = document.body.scrollTop || document.documentElement.scrollTop;
    setTranform();
    if(scrollp>arr[index])index++;
    if(scrollp<arr[index])index--;
    console.log(scrollp, arr[index]);
})
