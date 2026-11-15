const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8').split('\n');
const subIdx = de14.findIndex(l => l.includes('function handleMcqSubmit'));
console.log('de14 handleMcqSubmit:');
console.log(de14.slice(subIdx, subIdx + 50).join('\n'));
