const rule110 = {
    "111": 0,
    "110": 1,
    "101": 1,
    "100": 0,
    "011": 1,
    "010": 1,
    "001": 1,
    "000": 0
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
    const result = [init]
    for (let i = 0; i < steps; i++) {
        result.push(updateLine(result[result.length - 1], pattern))
    }
    return result
}

function rndInit(n, p) {
    return Array.from({length: n}, () => Math.random() < p ? 1 : 0)
}

export const demoPattern = patternGetter(rndInit(300,.5), 300, rule110)


// console.log(demoPattern)
