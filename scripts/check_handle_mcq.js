const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');

const subIdx = lines.findIndex(l => l.includes('function handleMcqSubmit'));
console.log('handleMcqSubmit start line:', subIdx + 1);
console.log(lines.slice(subIdx, subIdx + 60).join('\n'));
