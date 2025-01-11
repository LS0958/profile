const pages = document.querySelectorAll('.page');
const audio = document.querySelector('#audio');
const max = document.body.scrollHeight - window.innerHeight;
const totalpages = 5; //except home page
let scrollp = 0;
let currentpage = 1;

window.scrollTo(0,0);

const setTranform = () => {
    pages.forEach((e, i) => {
        setTimeout(() => {
            e.style.transform = `translateZ(${scrollp - max / totalpages * i}px)`;
        }, 50);
    })
}

setTranform();

window.addEventListener('scroll', e => {
    scrollp = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollp < max) setTranform();
})


function target(n) {
    if(currentpage!=n){
        currentpage=n;
        audio.src="./assets/click.wav";
        audio.playbackRate = '2.2';
        audio.play();
        audio.onended = function() { 
            audio.src = './assets/transition.wav'; 
            audio.playbackRate = '2.0';
            audio.volume='0.5'
            audio.play();
            audio.onended = null;
        };
        setTranform();
        scrollp = document.body.scrollTop || document.documentElement.scrollTop;
        window.scrollTo(0, max / totalpages * (n - 1))
    }
}

