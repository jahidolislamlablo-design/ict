const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8');

const s = de14.indexOf('function syncMultiSelectDisplay');
const e = de14.indexOf('function ', s + 10);
console.log(de14.substring(s, e));
