const options = document.querySelectorAll('.difficulty-option');
const bg      = document.querySelector('.selector-background');
if (document.readyState === 'complete') {
    if(localStorage.getItem('token')=== null){
        document.getElementById("logout").innerHTML="Login";
    }else{
        document.getElementById("logout").innerHTML="Logout";
    }
} else {
    window.addEventListener('load', () => {
        if(localStorage.getItem('token')=== null){
            document.getElementById("logout").innerHTML="Login";
        }else{
            document.getElementById("logout").innerHTML="Logout";
        }
    });
}
let difficulty;
function multiplayerclick(){
    localStorage.setItem("multi","1");
    localStorage.setItem("difficulty", "2");
    window.location.href='partita.html'

}
function singleplayerclick(){
    localStorage.setItem("multi","0");
    localStorage.setItem("difficulty", difficulty);
    window.location.href='index.html'
}
function logincheck(){
    if(localStorage.getItem("token") === null){
        window.location.href="login.html";
    }else{
        alert("Sei gia loggato ad un profilo.")
    }
}
function logout(){
    if(localStorage.getItem("token") !== null){
        localStorage.removeItem("token");
        alert("Logout effettuato")
        window.location.href="home.html";
    }
    window.location.href="login.html";

}
function moveBackgroundTo(el) {
    const w = el.offsetWidth, h = el.offsetHeight;
    const x = el.offsetLeft,  y = el.offsetTop;
    bg.style.width  = w + 'px';
    bg.style.height = h + 'px';
    bg.style.left   = x + 'px';
    bg.style.top    = y + 'px';
    const activeElement = document.querySelector('.difficulty-option.active');
    const dataValue = activeElement.getAttribute('data-value');
    console.log(dataValue);
    switch (dataValue) {
        case 'easy':
            difficulty = 1;
            break;
        case 'medium':
            difficulty = 2;
            break;
        case 'hard':
            difficulty = 3;
            break;
    }
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




//HELP
document.addEventListener("DOMContentLoaded", () => {
    const helpBtn = document.getElementById("helpBtn");
    const helpPanel = document.getElementById("helpPanel0");
    const sidebarToggle = document.getElementById("sidebar-toggle");

    if (helpBtn && helpPanel && sidebarToggle) {
        helpBtn.addEventListener("click", (e) => {
            e.preventDefault();
            helpPanel.classList.toggle("active");
        });

        sidebarToggle.addEventListener("change", () => {
            if (!sidebarToggle.checked) {
                helpPanel.classList.remove("active");
            }
        });
    }
});
