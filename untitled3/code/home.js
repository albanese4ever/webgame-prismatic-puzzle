function change_class_bodyCont() {
    // Nasconde la sezione iniziale
    const bodyCont = document.getElementById("rimuovere");
    bodyCont.classList.remove("bodyCont");
    bodyCont.classList.add("displayNone");

    // Crea dinamicamente il blocco generalPlayCont
    const cont = document.querySelector(".cont");

    const generalPlayCont = document.createElement("div");
    generalPlayCont.className = "generalPlayCont";
    generalPlayCont.id = "aggiungere";
    generalPlayCont.style.display = "flex";

    generalPlayCont.innerHTML = `
        <div class="playCont">
            <button type="button">Crea</button>
            
            <div class="join">
                <input id="inserisci" name="inserisci" type="number" placeholder="Inserisci Codice" required>
                <button class="button" type="submit">Join</button>
            </div>
        </div>
    `;

    cont.appendChild(generalPlayCont);
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
