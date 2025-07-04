

const options = document.querySelectorAll('.difficulty-option');
const bg      = document.querySelector('.selector-background');

function moveBackgroundTo(el) {
    const rect = el.getBoundingClientRect();
    const containerRect = el.parentElement.getBoundingClientRect();

    const w = rect.width;
    const h = rect.height;
    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;

    bg.style.width = w + 'px';
    bg.style.height = h + 'px';
    bg.style.left = x + 'px';
    bg.style.top = y + 'px';

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
    localStorage.setItem('LBdifficulty', difficulty);
}

window.addEventListener('resize', () => {
    const active = document.querySelector('.difficulty-option.active');
    if (active) moveBackgroundTo(active);
});


// init
const init = document.querySelector('.difficulty-option.active');
if (init) moveBackgroundTo(init);
window.onload = __innit__();
// on click
options.forEach(opt => {
    opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        moveBackgroundTo(opt);
    });
});

async function __innit__(){
    const container = document.getElementById('leaderboard-container');
    const response = await fetch("http://127.0.0.1:8000/get/lb/" + localStorage.getItem("LBdifficulty"));
    const data = await response.json();
    console.log(data);
    data.forEach((entry, i) => {
        const entryDiv = document.createElement('div');
        entryDiv.setAttribute("id", "LB" + i);
        entryDiv.textContent = `${i + 1}. ${data.entry}`; // Personalizza secondo i tuoi dati
        container.appendChild(entryDiv);
    });
}