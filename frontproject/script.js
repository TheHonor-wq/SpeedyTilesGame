"use strict";
const body = document.body;
body.addEventListener('click', handleBodyClick, { once: true });

function handleBodyClick() {
    const projectMembers = document.querySelector('.projectMembers');
    const initialPageBacking = document.querySelector('.initialPageBacking');
    projectMembers.remove();

    const timerParagraph = document.createElement('p');
    timerParagraph.className = 'timerParagraph';
    initialPageBacking.appendChild(timerParagraph);

    let count = 3;
    timerParagraph.textContent = count;
    const countdownId = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(countdownId);
            initialPageBacking.remove();
            if (typeof startGame === "function") startGame();
        } else {
            timerParagraph.textContent = count;
        }
    }, 1000);
}