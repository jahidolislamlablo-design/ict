const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8').split('\n');

const s = de14.findIndex(l => l.includes('<div class="grid-2" style="margin-top: 1rem;">'));
const e = de14.findIndex((l, i) => i > s && l.includes('<div class="grid-2" style="margin-bottom: 0.75rem;">'));

console.log('Start line:', s + 1, 'End line:', e + 1);
console.log(de14.slice(s, e).join('\n'));
