const boxes = Array.from(document.querySelectorAll('.box'));

// Parameters — tweak as desired
const MAX_DIST   = 300;
const MIN_OPACITY = 0.0;
const MAX_OPACITY = 0.8;

document.addEventListener('mousemove', e => {
    boxes.forEach(box => {
        const r = box.getBoundingClientRect();

        const cx = Math.max(r.left, Math.min(e.clientX, r.right));
        const cy = Math.max(r.top,  Math.min(e.clientY, r.bottom));

        const pctX = ((cx - r.left) / r.width) * 100;
        const pctY = ((cy - r.top ) / r.height) * 100;
        box.style.setProperty('--x', pctX + '%');
        box.style.setProperty('--y', pctY + '%');

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        let opacity = MAX_OPACITY * Math.max(0, (MAX_DIST - dist) / MAX_DIST);

        box.style.setProperty('--shine-opacity', opacity.toFixed(3));
    });
});
