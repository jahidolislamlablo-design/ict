const fs = require('fs');
const content = fs.readFileSync('temp_admin_before.html', 'utf8');
const lines = content.split('\n');

function findSection(startStr, endStr) {
    const s = lines.findIndex(l => l.includes(startStr));
    const e = lines.findIndex((l, idx) => idx > s && l.includes(endStr));
    return { s, e, text: lines.slice(s, e + 1).join('\n') };
}

console.log('--- MCQ Form fields in 26808e3 ---');
const mcqSec = findSection('id="mcqForm"', 'id="mcqQuestion"');
console.log(mcqSec.text);
