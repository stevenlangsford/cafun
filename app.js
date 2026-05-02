const app = document.getElementById("app")
import {makeDetectionTrial} from "./tools.js"
//Setup globals: (why are you using globals at all you clown)
    const cssWidth = 750 //canvas width and height.
    const cssHeight = 400

//State globals:
var boardState; //store a [[],[]] of 1/0 here: state of the canvas display
var canvasDraw; //store a drawing function here, gets redrawn on screen resize. Hacky bs.
var promptState; //same thing for the prompt redraw. Still hacky bs
var listenerState; //legal states are ['off', 'detection_trial', 'memory_trial']. Determines what happens on keypresses.

function rndGrid(n, p) {
    return Array.from({length: n}, () =>
        Array.from({length: n}, () => Math.random() < p ? 1 : 0)
    )
}

function checkerboard(grid) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    
    const nrows = grid.length
	const ncols = grid[0].length
    // const tileW = canvas.width / ncols
    // const tileH = canvas.height / nrows
const tileW = canvas.offsetWidth / ncols
const tileH = canvas.offsetHeight / nrows
    
    for (let row = 0; row < nrows; row++) {
        for (let col = 0; col < ncols; col++) {
            ctx.fillStyle = grid[row][col] === 1 ? "black" : "white"
            ctx.fillRect(col * tileW, row * tileH, tileW, tileH)
        }
    }
}
// function renderCanvas() {
//     const canvas = document.getElementById("canvas")
//     if (canvas) {
//         canvas.width = window.innerWidth
//         canvas.height = window.innerHeight
//     } else {
//         app.innerHTML = "<h2>"+promptState+"</h2>"+//omg the nastiness of global var here
// 			"<canvas id=\"canvas\" width=\"${window.innerWidth}\" height=\"${window.innerHeight}\" style=\"display:block\"></canvas>"
//     }
// 	canvasDraw() //naaaaasty
// }
//
function renderCanvas() {
    const dpr = window.devicePixelRatio || 1
    const canvas = document.getElementById("canvas")
    if (canvas) {
        canvas.width = cssWidth * dpr
        canvas.height = cssHeight * dpr
        canvas.style.width = `${cssWidth}px`
        canvas.style.height = `${cssHeight}px`
    } else {
        app.innerHTML = "<h2>"+promptState+"</h2>" +
            `<canvas id="canvas" style="display:block; width:${cssWidth}px; height:${cssHeight}px"></canvas>`
        const newCanvas = document.getElementById("canvas")
        newCanvas.width = cssWidth * dpr
        newCanvas.height = cssHeight * dpr
    }
    const ctx = document.getElementById("canvas").getContext("2d")
    ctx.scale(dpr, dpr)
    canvasDraw()
}

function landingpage() {
app.innerHTML = `
    <h1>A landing page</h1>
    <p>This doesn't have ethics approval, so continue at your own risk</p>
    <p>One day when it's approved, there will be a consent form here</p>
    <p>Here are some design decision points for you to try out:</p>
    <ul>
	    <li> Discrimination task: borders or no borders?</li>
	    <li> Memory task: number of foils</li>
    </ul>
    <button onclick=taskpage()>Continue</button>
`
}

function taskpage(){
app.innerHTML = `
	<h1>LET'S TASK</h1>
	`
}
//LISTENERS:
window.addEventListener("keydown", (e) => {
    if(listenerState == "detection_trial"){
    if (["q", "p", "z", "m"].includes(e.key)) {
        console.log(`${e.key} was pressed`)
            detection_index = detection_index +1
            drawDetectionTrial() //has to change to 'do next thing' instead. TODO
    }
    }
})
// MAIN
const hm_detection_trials = 10;
var detection_index = 0; //which trial are you on now
const detectionTrials = Array.from({length: hm_detection_trials}, () => makeDetectionTrial()) //defined in tools.js
// set state (in global vars because you redraw the canvas every screen resize, yuk)

function drawDetectionTrial(){
    console.log("you are in detection trial "+detection_index)
if (detection_index >= detectionTrials.length){
console.log("All gone. No more")
document.getElementById("overlay").style.display = "none" //turn off corner response prompts
        return
    }
    boardState = detectionTrials[detection_index].grid
    listenerState = "detection_trial" //activates eventListener
    promptState = "Which part is different?"
document.getElementById("overlay").style.display = "block" //corner response prompts
    //DOES NOT ADVANCE. Get the response listener to do that. 

    renderCanvas()
}
//boardState = demoPattern
// boardState = rndGrid(500,.5)

canvasDraw = ()=> {checkerboard(boardState)}
promptState = "Do the thing"
window.addEventListener("resize", ()=>renderCanvas())

drawDetectionTrial()//GO!
//landingpage() //actual start point
