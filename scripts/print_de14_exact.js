const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8').split('\n');

console.log('=== de14 MCQ Metadata (lines 870 to 965) ===');
console.log(de14.slice(870, 965).join('\n'));

const cqFormIdx = de14.findIndex(l => l.includes('id="cqForm"'));
console.log('\n=== de14 CQ Metadata (lines ' + cqFormIdx + ' to ' + (cqFormIdx + 100) + ') ===');
console.log(de14.slice(cqFormIdx, cqFormIdx + 100).join('\n'));
