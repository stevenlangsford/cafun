function shuffle(arr) { //ugh now there's two copies of this :-(
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


function drawNumber(max, n) {
    const pool = Array.from({length: max + 1}, (_, i) => i)
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, n)
}

function getRule(n) {
    if(n>255){
        console.error("getRule overflow!"+n)
    }
    const hoods = ["111", "110", "101", "100", "011", "010", "001", "000"]
    const binary = n.toString(2).padStart(8, "0")
    const rule = {}
    for (let i = 0; i < 8; i++) {
        rule[hoods[i]] = parseInt(binary[i])
    }
    return rule
}

function updateLine(arr, HoodDictionary) {
    const n = arr.length
    const newArr = new Array(n)
    
    for (let i = 0; i < n; i++) {
        const left = arr[(i - 1 + n) % n]
        const center = arr[i]
        const right = arr[(i + 1) % n]
        const hood = `${left}${center}${right}`
        newArr[i] = HoodDictionary[hood]
    }
    
    return newArr
}

function patternGetter(init, steps, pattern) {
    const burnin = 100;
    const result = [init]
    for (let i = 0; i < steps + burnin; i++) {
        result.push(updateLine(result[result.length - 1], pattern))
    }
    return result.slice(burnin)
}

function rndInit(n, p) {
    return Array.from({length: n}, () => Math.random() < p ? 1 : 0)
}

function overlay(A, B, r_start, c_start) {
    const result = A.map(row => [...row])
    for (let r = 0; r < B.length; r++) {
        for (let c = 0; c < B[r].length; c++) {
            result[r_start + r][c_start + c] = B[r][c]
        }
    }
    return result
}

function getIntruderGrid(bg_pattern, intruder_pattern,intruder_location){
    const sidelen = 25 //assuming square grids
const quad_length = sidelen
    const quad_height = sidelen
    const bg_length = quad_length * 2
    const bg_height = quad_height * 2

var bg = patternGetter(rndInit(bg_length,.5), bg_height, getRule(drawNumber(255,1)[0]))
    var intruder = patternGetter(rndInit(quad_length,.5),quad_height, getRule(drawNumber(255,1)[0]))

    if(intruder_location=="UL") return(overlay(bg, intruder,0,0))
    if(intruder_location=="UR") return(overlay(bg, intruder,0,quad_length))
    if(intruder_location=="LL") return(overlay(bg, intruder,quad_height,0))
    if(intruder_location=="LR") return(overlay(bg, intruder,quad_height,quad_length))
}

//MAIN: run stuff
export function makeMemoryTrial(gapcounter, matchstatus){
const sidelen = 25; //hmmm how big should these be?
 var patternList = drawNumber(255, 4) //target, foil1, foil2, foil3. no repeats.

var promptGrid = patternGetter(rndInit(sidelen,.5),sidelen, getRule(patternList[0]))
    var foil1 = patternGetter(rndInit(sidelen,.5),sidelen, getRule(patternList[1]))
    var foil2 = patternGetter(rndInit(sidelen,.5),sidelen, getRule(patternList[2]))
    var foil3 = patternGetter(rndInit(sidelen,.5),sidelen, getRule(patternList[3]))
    var target = matchstatus == "exact" ? promptGrid : patternGetter(rndInit(sidelen, .5),sidelen, patternList[0])

var recall_locations = shuffle([[0,0],[sidelen,0],[0,sidelen],[sidelen,sidelen]]) //UL corners of four options.
var recallGrid = patternGetter(rndInit(sidelen *2, .5), sidelen*2, getRule(0)) //blank white background
    recallGrid = overlay(recallGrid, target, recall_locations[0][0], recall_locations[0][1])
    recallGrid = overlay(recallGrid, foil1, recall_locations[1][0], recall_locations[1][1])
    recallGrid = overlay(recallGrid, foil2, recall_locations[2][0], recall_locations[2][1])
    recallGrid = overlay(recallGrid, foil3, recall_locations[3][0], recall_locations[3][1])


return {
        trialtype:"MEM",
        gapcounter: gapcounter,
        targpattern: patternList[0],
        foil1_pattern:patternList[1],
        foil2_pattern:patternList[2],
        foil3_pattern:patternList[3],
        promptGrid: promptGrid,
        recallGrid:recallGrid,
        foil1: foil1,
        foil2:foil2,
        foil3:foil3,
        target:target,
        matchstatus:matchstatus
    }
}

//A trial needs: label the bg and intruder. Pick an intruder location. Listen to the response. console log instead of save for now
export function makeDetectionTrial(){

    var my_location = ["UL","UR","LL","LR"][Math.floor(Math.random() * 4)]
    const my_rulepair = drawNumber(255,2) //bans repeats: 2 distinct numbers
    const my_grid = getIntruderGrid(my_rulepair[0],my_rulepair[1],my_location)
 return {
        trialtype:"DIS",
        bg:my_rulepair[0],
        intruder:my_rulepair[1],
        location:my_location,
        grid:my_grid
}
}


//export const demoPattern = demoIntruder//overlay(bottomRight, [[1,1,1],[1,1,1],[1,1,1]], 0,0)
//overlay(topLeft,bottomRight,0,0)

//patternGetter(rndInit(300,.5), 300, getRule(drawNumber(255,1)[0]))


// console.log(demoPattern)
