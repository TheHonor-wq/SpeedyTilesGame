let container = document.querySelector(".container")
let scoreBoard= document.getElementById("score")
let time = document.getElementById("time")
let currentBoxIndex=0;
let score = 0;
const TILE_SIZE = 75;
let blackTiles = [];
while (blackTiles.length < 3) {
    let r = Math.floor(Math.random() * 16);
    if (!blackTiles.includes(r)) 
        blackTiles.push(r);
}
const timer = setInterval(function(){
    let currentSeconds = parseInt(time.textContent);
    if(currentSeconds===0)
    {
        clearInterval(timer)
        time.textContent=0
        container.style.display="none" 
    }
    else
        time.textContent=currentSeconds-1   
},1000)


function createLayout(){
    for(let i=0;i<4;i++)
        {
            for(let j=0;j<4;j++)
            {
                let box = document.createElement("div")
                box.classList.add("box")
                box.style.top=`${i*TILE_SIZE}px`;
                box.style.left=`${j*TILE_SIZE}px`; 
                box.dataset.index=currentBoxIndex;
                if(blackTiles.includes(currentBoxIndex)){
                    box.classList.add("black")
                }
                container.appendChild(box)
                currentBoxIndex++;
            }
}}
createLayout()

container.addEventListener("click",function(e){
    let selectedBox = e.target
    if(selectedBox.classList.contains("black"))
        {
        let index = parseInt(selectedBox.dataset.index);
        blackTiles = blackTiles.filter(t => t !== index);    
        selectedBox.classList.remove("black")    
        selectedBox.classList.add("green");
        selectedBox.textContent = "+10"; 
        score += parseInt(selectedBox.textContent)
        scoreBoard.textContent = `Score:${score}`
        setTimeout(function() {
            selectedBox.classList.remove("green");
            selectedBox.textContent = "";
        }, 300);
        

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * 16);
        } while (blackTiles.includes(newIndex));
        blackTiles.push(newIndex)
        let newBox = container.querySelector(`[data-index='${newIndex}']`)

        newBox.classList.add("black")
        }

})

