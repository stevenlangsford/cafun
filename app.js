const app = document.getElementById("app")
import {demoPattern} from "./tools.js"
//Setup globals: (why are you using globals at all you clown)
    const cssWidth = 750 //canvas width and height.
    const cssHeight = 400

//State globals:
var boardState; //store a [[],[]] of 1/0 here: state of the canvas display
var canvasDraw; //store a drawing function here, gets redrawn on screen resize. Hacky bs.
var promptState; //same thing for the prompt redraw. Still hacky bs


function spit(){
	console.log(boardState)
}

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
    const tileW = canvas.width / ncols
    const tileH = canvas.height / nrows
    
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

// MAIN
// set state (in global vars because you redraw the canvas every screen resize, yuk)
boardState = demoPattern
// boardState = rndGrid(500,.5)

canvasDraw = ()=> {checkerboard(boardState)}
promptState = "Do the thing"
window.addEventListener("resize", ()=>renderCanvas())

renderCanvas()//Go!
spit()

//landingpage()
