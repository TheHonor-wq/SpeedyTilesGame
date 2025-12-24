"use strict";
const body = document.body;
body.addEventListener('click', handleBodyClick, { once: true });
function handleBodyClick() {
    const body = document.body;
    const projectMembers = body.querySelector('.projectMembers');
    const initialPageBacking = body.querySelector('.initialPageBacking');
    if (!projectMembers || !initialPageBacking) {
        throw new Error("Missing elements: .projectMembers or .initialPageBacking");
    }
    projectMembers.remove();
    const timerParagraph = document.createElement('p');
    timerParagraph.className = 'timerParagraph';
    initialPageBacking.appendChild(timerParagraph);
    let count = 3;
    timerParagraph.textContent = String(count);
    const countdownId = window.setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(countdownId);
            timerParagraph.remove();
        }
        else {
            timerParagraph.textContent = String(count);
        }
    }, 1000);
    window.setTimeout(() => {
        initialPageBacking.remove();
    }, 3500);
}

