function change_class_bodyCont(){
    document.getElementById("rimuovere").classList.remove("bodyCont");
    document.getElementById("rimuovere").classList.add("displayNone");
    document.getElementById("aggiungere").style.display = "flex";
}






const options = document.querySelectorAll('.difficulty-option');
const bg      = document.querySelector('.selector-background');

function moveBackgroundTo(el) {
    const w = el.offsetWidth, h = el.offsetHeight;
    const x = el.offsetLeft,  y = el.offsetTop;
    bg.style.width  = w + 'px';
    bg.style.height = h + 'px';
    bg.style.left   = x + 'px';
    bg.style.top    = y + 'px';
}

// init
const init = document.querySelector('.difficulty-option.active');
if (init) moveBackgroundTo(init);

// on click
options.forEach(opt => {
    opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        moveBackgroundTo(opt);
    });
});