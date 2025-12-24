let container = document.querySelector(".container");
let scoreVal = document.getElementById("score-val");
let time = document.getElementById("time");
let hiscoreVal = document.getElementById("hiscore-val");
let overlay = document.getElementById("overlay");
let statusMsg = document.getElementById("status-message");

let score = 0;
let currentTilePoints = 10;
let blackTiles = [];
let pointCounterInterval;
let storedHiScore = localStorage.getItem("ctis255_hiscore") || 0;


hiscoreVal.textContent = storedHiScore;

function startGame() {
    while (blackTiles.length < 3) {
        let r = Math.floor(Math.random() * 16);
        if (!blackTiles.includes(r)) 
            blackTiles.push(r);
    }
    
    createLayout();
    startPointCounter();

    const gameTimer = setInterval(() => {
        let currentSeconds = parseInt(time.textContent);
        if (currentSeconds <= 0) {
            clearInterval(gameTimer);
            time.textContent = 0;
            endGame();
        } else {
            time.textContent = currentSeconds - 1;
        }
    }, 1000);
}

function createLayout() {
    let currentBoxIndex = 0; 
    for (let i = 0; i < 4; i++) { 
        for (let j = 0; j < 4; j++) { 
            let box = document.createElement("div");
            box.classList.add("box");
            box.style.top = `${i * 75}px`;
            box.style.left = `${j * 75}px`; 
            box.dataset.index = currentBoxIndex;
            if (blackTiles.includes(currentBoxIndex)) {
                box.classList.add("black");
            }
            container.appendChild(box);
            currentBoxIndex++;
        }
    }
}

function startPointCounter() {
    currentTilePoints = 10;
    let bar = document.getElementById("pointbar");
    
    bar.style.transition = "none";
    bar.style.width = "100%";
    

    setTimeout(() => {
        bar.style.transition = "width 1s linear";
        bar.style.width = "0%";
    }, 10);

    clearInterval(pointCounterInterval);
    pointCounterInterval = setInterval(() => {
        if (currentTilePoints > 0) currentTilePoints--;
    }, 100);
}

container.addEventListener("click", function(e){
    let selectedBox = e.target; 
    if (selectedBox.classList.contains("black")) {
        let index = parseInt(selectedBox.dataset.index);
        blackTiles = blackTiles.filter(t => t !== index);
        
        selectedBox.classList.remove("black");
        selectedBox.classList.add("green");
        selectedBox.textContent = `+${currentTilePoints}`;
        score += currentTilePoints;
        scoreVal.textContent = score;

        let newIndex;
        do { 
            newIndex = Math.floor(Math.random() * 16); 
        } while (blackTiles.includes(newIndex));
        
        blackTiles.push(newIndex);
        container.children[newIndex].classList.add("black");

        startPointCounter();

        setTimeout(function(){ 
            selectedBox.classList.remove("green"); 
            selectedBox.textContent = ""; 
        }, 300);
    }
});

function endGame() {
    container.style.pointerEvents = "none";
    document.querySelector(".pointbarcontainer").classList.add("hidden");
    overlay.classList.remove("hidden");

    if (score > storedHiScore) {
        localStorage.setItem("ctis255_hiscore", score);
        statusMsg.innerHTML = "New<br>Hiscore";
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
        statusMsg.textContent = "Time is up";
    }
}