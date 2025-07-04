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


