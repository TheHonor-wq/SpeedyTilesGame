const STORAGE_KEY = "ctis255_hiscore";

const body = document.body;
const container = document.querySelector(".container");
const scoreVal = document.getElementById("score-val");
const time = document.getElementById("time");
const hiscoreVal = document.getElementById("hiscore-val");
const overlay = document.getElementById("overlay");
const statusMsg = document.getElementById("status-message");

let score = 0;
let currentTilePoints = 10;
const blackTiles = new Set();
let pointCounterIntervalId = null;
let gameTimerId = null;
let hiScore = Number(localStorage.getItem(STORAGE_KEY)) || 0;

hiscoreVal.textContent = String(hiScore);

body.addEventListener("click", handleBodyClick, { once: true });
container.addEventListener("click", handleContainerClick);

function getRandomIndex(max) {
	return Math.floor(Math.random() * max);
}

function handleBodyClick() {
	const projectMembers = document.querySelector(".projectMembers");
	const initialPageBacking = document.querySelector(".initialPageBacking");

	if (projectMembers) projectMembers.remove();

	const timerParagraph = document.createElement("p");
	timerParagraph.className = "timerParagraph";
	initialPageBacking?.appendChild(timerParagraph);

	let count = 3;
	timerParagraph.textContent = String(count);

	const countdownId = setInterval(() => {
		count -= 1;
		if (count <= 0) {
			clearInterval(countdownId);
			initialPageBacking?.remove();
			startGame();
			return;
		}
		timerParagraph.textContent = String(count);
	}, 1000);
}

function startGame() {
	// Add "Click on the black tiles!" message
	const tapMessage = document.createElement("div");
	tapMessage.className = "tap-message";
	tapMessage.textContent = "Click on the black tiles!";
	document.body.appendChild(tapMessage);
	
	// Remove message after 2 seconds
	setTimeout(() => {
		if (tapMessage.parentNode) {
			tapMessage.remove();
		}
	}, 2000);
	
	while (blackTiles.size < 3) {
		blackTiles.add(getRandomIndex(16));
	}

	createLayout();
	startPointCounter();

	gameTimerId = setInterval(() => {
		const currentSeconds = Number.parseInt(time.textContent, 10);
		if (currentSeconds <= 0) {
			clearInterval(gameTimerId);
			time.textContent = "0";
			endGame();
			return;
		}
		time.textContent = String(currentSeconds - 1);
	}, 1000);
}

function createLayout() {
	container.innerHTML = "";

	let currentBoxIndex = 0;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			const box = document.createElement("div");
			box.classList.add("box");
			box.style.top = `${i * 75}px`;
			box.style.left = `${j * 75}px`;
			box.dataset.index = String(currentBoxIndex);

			if (blackTiles.has(currentBoxIndex)) {
				box.classList.add("black");
			}

			container.appendChild(box);
			currentBoxIndex++;
		}
	}
}

function startPointCounter() {
	currentTilePoints = 10;

	const bar = document.getElementById("pointbar");
	if (!bar) return;

	bar.style.transition = "none";
	bar.style.width = "100%";

	setTimeout(() => {
		bar.style.transition = "width 1s linear";
		bar.style.width = "0%";
	}, 10);

	clearInterval(pointCounterIntervalId);
	pointCounterIntervalId = setInterval(() => {
		if (currentTilePoints > 0) currentTilePoints -= 1;
	}, 100);
}

function handleContainerClick(e) {
	const selectedBox = e.target;
	if (!(selectedBox instanceof HTMLElement)) return;
	if (!selectedBox.classList.contains("black")) return;

	const index = Number.parseInt(selectedBox.dataset.index, 10);
	blackTiles.delete(index);

	selectedBox.classList.remove("black");
	selectedBox.classList.add("green");
	selectedBox.textContent = `+${currentTilePoints}`;

	score += currentTilePoints;
	scoreVal.textContent = String(score);

	let newIndex;
	do {
		newIndex = getRandomIndex(16);
	} while (blackTiles.has(newIndex));

	blackTiles.add(newIndex);
	container.children[newIndex]?.classList.add("black");

	startPointCounter();

	setTimeout(() => {
		selectedBox.classList.remove("green");
		selectedBox.textContent = "";
	}, 300);
}

function endGame() {
	container.style.pointerEvents = "none";
	document.querySelector(".pointbarcontainer")?.classList.add("hidden");
	overlay.classList.remove("hidden");

	clearInterval(pointCounterIntervalId);

	if (score > hiScore) {
		hiScore = score;
		localStorage.setItem(STORAGE_KEY, String(score));

		hiscoreVal.textContent = String(score);
		hiscoreVal.classList.add("highlight-update");
		setTimeout(() => hiscoreVal.classList.remove("highlight-update"), 2000);

		statusMsg.innerHTML = "New<br>Hiscore";
		statusMsg.classList.add("pulse-animation");

		if (typeof confetti === "function") {
			confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
		}
	} else {
		statusMsg.textContent = "Time is up";
		statusMsg.classList.remove("pulse-animation");
	}
}