const app = document.getElementById("app")
import {makeDetectionTrial, makeMemoryTrial} from "./tools.js"
//Setup globals: (why are you using globals at all you clown)
    const cssWidth = 750 //canvas width and height.
    const cssHeight = 400

//State globals:
var boardState; //store a [[],[]] of 1/0 here: state of the canvas display
var canvasDraw = ()=> {checkerboard(boardState)}//in this format so you can call it on screen resize
var promptState; //same thing for the prompt redraw. Still hacky bs
var listenerState; //legal states are ['off', 'detection_trial', 'memory_trial']. Determines what happens on keypresses.
var drawTime;

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
        app.innerHTML = "<h2 id=\"theprompt\">"+promptState+"</h2>" +
            `<canvas id="canvas" style="display:block; width:${cssWidth}px; height:${cssHeight}px"></canvas>`
        const newCanvas = document.getElementById("canvas")
        newCanvas.width = cssWidth * dpr
        newCanvas.height = cssHeight * dpr
    }
    document.getElementById('theprompt').textContent = promptState;
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

function outropage(){
app.innerHTML = "<h1> Thanks for participating!</h1>"
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
            var mytrial = alltrials[trial_index]
            mytrial.response = e.key
            mytrial.drawTime = drawTime //Make sure this is current! You're kinda unprotected here. Set by draw[type]Trial
            mytrial.responseTime = Date.now() //Pretty hacky timer, only ok if you believe system noise is small beer in the uncontrolled 'participate from home' environment. Which is probably true?
            console.log(mytrial) //TODO, save this.
            trial_index = trial_index +1
            nextTrial()
    }
    }
    if(listenerState == "memory_trial"){
        console.log("mem response listener")
        console.log(e.key)
        trial_index = trial_index +1
        nextTrial()
    }
})

function makeShuffledBooleans(n) {
  const arr = [...Array(n).fill(true), ...Array(n).fill(false)];
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// MAIN: setup stim here!
const hm_mem_trials_EACHTYPE = 1;
const mem_trial_gaplevels = [1,3];
const detection_n_intro_outro = 5; //if this is larger than the largest gap, don't have to worry about overflow.

//consequences of the setup:
const hm_detection_trials = hm_mem_trials_EACHTYPE * 2 * mem_trial_gaplevels.reduce((acc, k) => acc + k, 0) + detection_n_intro_outro*2; 

const mem_match_status_setup = makeShuffledBooleans(hm_mem_trials_EACHTYPE)//note you get 2*eachtype returned: hm_eachtype true and hm_eachtype false.
const memTrials = shuffle(mem_trial_gaplevels.flatMap(gVal => mem_match_status_setup.map(mVal => makeMemoryTrial(gVal, mVal))));

//const detectionTrials = Array.from({length: hm_detection_trials}, () => makeDetectionTrial()) //defined in tools.js
//ok, let's combine everything:
var alltrials = Array.from({length: detection_n_intro_outro}, () => makeDetectionTrial()) //intro buffer of detection trials

memTrials.forEach((x) => {
  alltrials.push({ ...x, instance: 1 });
    for (let i = 0; i < x.gapcounter; i++) {
        alltrials.push(makeDetectionTrial());
}
  alltrials.push({ ...x, instance: 2 });
});

alltrials.push(Array.from({length: detection_n_intro_outro}, () => makeDetectionTrial()))
//
//Run the trials:
var trial_index = 0; //which trial are you on now
console.log(alltrials) //looks ok up to here.

function nextTrial(){
 if(trial_index >= alltrials.length){
        listenerState = "off"
        document.getElementById("overlay").style.display = "none"
        outropage()
        return
    }
    console.log("You are in trial "+trial_index)
    var mytrial = alltrials[trial_index]

    if(mytrial.trialtype == "DIS"){
    boardState = alltrials[trial_index].grid
    listenerState = "detection_trial" //activates eventListener
    promptState = "Which part is different?"
        document.getElementById("overlay").style.display = "block" //corner response prompts
    }
    if(mytrial.trialtype == "MEM"){
        boardState = alltrials[trial_index].promptGrid //ffs decide if you're camel or dash
        listenerState = "memory_trial"
        promptState = "Remember this"
        document.getElementById("overlay").style.display = "none"
        console.log("TODO, draw mem properly") //TODO: draw mem
    }

drawTime = Date.now()

    canvasDraw = ()=> {checkerboard(boardState)}//Hacky bs! Breaks without this reset though.
renderCanvas()
if (!["DIS","MEM"].includes(mytrial.trialtype)){
        console.error("trialtype washout")
        console.error(mytrial)
    }
}


 canvasDraw = 

nextTrial()


// function drawDetectionTrial(){
//     console.log("you are in detection trial "+detection_index)
//     drawTime = Date.now() //millis since 1970
// if (detection_index >= detectionTrials.length){
// console.log("All gone. No more")
//         listenerState = "off" //THERE MIGHT BE MEMORY TRIALS LEFT, FIGURE OUT WHAT YOU'RE ACTUALLY DOING HERE.
//         outropage() //there might be memory trials left, this is the detection index only
// document.getElementById("overlay").style.display = "none" //turn off corner response prompts
//         return
//     }
//     boardState = detectionTrials[detection_index].grid
//     listenerState = "detection_trial" //activates eventListener
//     promptState = "Which part is different?"
// document.getElementById("overlay").style.display = "block" //corner response prompts
//     //DOES NOT ADVANCE. Get the response listener to do that. 
//
//     renderCanvas()
// }
// //boardState = demoPattern
// // boardState = rndGrid(500,.5)
//
// canvasDraw = ()=> {checkerboard(boardState)}
// promptState = "Do the thing"
// window.addEventListener("resize", ()=>renderCanvas())
//
// drawDetectionTrial()//GO!
// //landingpage() //actual start point
