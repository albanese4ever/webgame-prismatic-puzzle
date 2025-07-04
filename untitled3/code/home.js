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
function logout() {
    if (localStorage.getItem("token") !== null) {
        localStorage.removeItem("token");
        alert("Logout effettuato")
        window.location.href = "home.html";
    }
    window.location.href = "login.html";
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

document.addEventListener("DOMContentLoaded", () => {
    const sidebarToggle = document.getElementById("sidebar-toggle");

    const helpBtn = document.getElementById("helpBtn");
    const helpPanel = document.getElementById("helpPanel0");

    const profileBtn = document.getElementById("profileBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const profilePanel = document.getElementById("profilePanel0");
    const settingsPanel = document.getElementById("settingsPanel0");

    const panels = [helpPanel, profilePanel, settingsPanel];

    function togglePanel(panel) {
        panels.forEach(p => {
            if (p === panel) {
                p.classList.toggle("active");
            } else {
                p.classList.remove("active");
            }
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener("click", (e) => {
            e.preventDefault();
            togglePanel(helpPanel);
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            togglePanel(profilePanel);
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            togglePanel(settingsPanel);
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("change", () => {
            if (!sidebarToggle.checked) {
                panels.forEach(p => p.classList.remove("active"));
            }
        });
    }
});


