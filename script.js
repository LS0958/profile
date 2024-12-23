const pages = document.querySelectorAll('.page');
const max = document.body.scrollHeight - window.innerHeight;
let scrollp = 0;
// let index = 0;

const setTranform = () => {
    pages.forEach((e,i)=>{
        setTimeout(() => {
            e.style.transform = `translateZ(${scrollp - max/4*i}px)`;
        }, 100);
    })
}

setTranform();

window.addEventListener('scroll', e => {
    scrollp = document.body.scrollTop || document.documentElement.scrollTop;
    if(scrollp<max){
        setTranform();
    }
    // if(scrollp>arr[index])index++;
    // if(scrollp<arr[index])index--;
})


function target(n){
    console.log(n);
    const e = document.getElementById('page'+n)
    window.scrollTo(0,max/4*(n-1))
    e.style.transform=`translateZ(${max/4*(n-1)}px)`;
    scrollp = document.body.scrollTop || document.documentElement.scrollTop;
}
