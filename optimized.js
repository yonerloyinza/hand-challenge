/*
  Optimized version
  By Yonerloy Inza Lorenzo
  yonerloy@gmail.com
  Cuba
*/

console.time();

const fs = require('fs');
const programCode = [...fs.readFileSync(process.argv[2] || 'input.hand', 'utf-8')];
const compactCode = [];
const memory = [0];
const stack = [];
const loops = {};
let memoryPointer = 0;
let codePointer = 0;

while (codePointer < programCode.length) {
    const instruction = programCode[codePointer];
    const index = compactCode.length;
    let counter = 1;

    if (instruction == '🤜') {
        stack.push(index);
    } else if (instruction == '🤛') {
        const loopStart = stack.pop();
        loops[loopStart] = index;
        loops[index] = loopStart;
    } else {
       while (programCode[codePointer + counter] == instruction) counter++;
    }

    compactCode.push({
        instruction: programCode[codePointer],
        counter
    })

    codePointer += counter;
}

const actions = {
    '👉': (counter) => {
        memoryPointer += counter;
        if (memoryPointer + 1 > memory.length) 
            memory.push(...new Array(memoryPointer - memory.length + 1).fill(0));
    },
    '👈': (counter) => memoryPointer -= counter,
    '👆': (counter) => memory[memoryPointer] = (memory[memoryPointer] + counter) % 256,
    '👇': (counter) => memory[memoryPointer] = (memory[memoryPointer] - counter + 256) % 256,
                // showing the result at the end is faster but boring
    '👊': () => process.stdout.write(String.fromCharCode(memory[memoryPointer])),
    '🤜': () => {
        if (memory[memoryPointer] == 0) {
            codePointer = loops[codePointer];
        }
    },
    '🤛': () => {
        if (memory[memoryPointer] != 0) {
            codePointer = loops[codePointer];
        }
    },
}

codePointer = 0;
while (codePointer < compactCode.length) {
    const instruction = compactCode[codePointer];
    actions[instruction.instruction](instruction.counter);
    codePointer++;
}

console.log();
console.timeEnd();