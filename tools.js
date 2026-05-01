function overlay(A, B, r_start, c_start) {
    const result = A.map(row => [...row])
    for (let r = 0; r < B.length; r++) {
        for (let c = 0; c < B[r].length; c++) {
            result[r_start + r][c_start + c] = B[r][c]
        }
    }
    return result
}

const zeros10 = Array.from({length: 10}, () => Array(10).fill(0))
const ones3 = Array.from({length: 3}, () => Array(3).fill(1))

// top left
const topLeft = overlay(zeros10, ones3, 0, 0)
// bottom right
const bottomRight = overlay(zeros10, ones3, 7, 7)

//OLD STUFF
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

export const demoPattern = overlay(bottomRight, [[1,1,1],[1,1,1],[1,1,1]], 0,0)
//overlay(topLeft,bottomRight,0,0)

//patternGetter(rndInit(300,.5), 300, getRule(drawNumber(255,1)[0]))


// console.log(demoPattern)
