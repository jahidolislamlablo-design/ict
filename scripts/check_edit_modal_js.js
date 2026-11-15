const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');

const editModalIdx = lines.findIndex(l => l.includes('function openEditModal'));
console.log('openEditModal line:', editModalIdx + 1);
console.log(lines.slice(editModalIdx, editModalIdx + 80).join('\n'));
