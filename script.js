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

document.addEventListener('DOMContentLoaded', function() {
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgb(0,0,0)';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    modal.innerHTML = `
        <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
            <span id="closeModal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
            <p>This is a modal!</p>
        </div>
    `;
    document.body.appendChild(modal);

    // Get the modal
    const myModal = document.getElementById('myModal');

    // Get the element that opens the modal
    const btn = document.getElementById('myBtn');

    // Get the <span> element that closes the modal
    const span = document.getElementById('closeModal');

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        myModal.style.display = 'block';
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        myModal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == myModal) {
            myModal.style.display = 'none';
        }
    }
});
