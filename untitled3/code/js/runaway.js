document.addEventListener("DOMContentLoaded", () => {
    const squares = document.querySelectorAll(".smallSquares");
    const cooldownTime = 2000; // 2 seconds

    squares.forEach(square => {
        square.dataset.lastToggle = "0";

        square.addEventListener("mouseenter", (e) => {
            const now = Date.now();
            const lastToggle = parseInt(square.dataset.lastToggle, 10);

            if (now - lastToggle < cooldownTime) return;

            // Toggle the class instead of using animationDirection
            square.classList.toggle("reverse");
            square.dataset.lastToggle = now.toString();
        });
    });
});
