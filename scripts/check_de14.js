const cp = require('child_process');
const fs = require('fs');

const de14 = cp.execSync('git show de14b75:admin.html', { maxBuffer: 20 * 1024 * 1024 }).toString('utf8');
fs.writeFileSync('temp_de14.html', de14, 'utf8');

const lines = de14.split('\n');
console.log('de14b75 line count:', lines.length);

const mcqIdx = lines.findIndex(l => l.includes('id="mcqForm"') || l.includes('MCQ এন্ট্রি'));
console.log('MCQ Form start line:', mcqIdx + 1);
console.log(lines.slice(mcqIdx, mcqIdx + 120).join('\n'));
