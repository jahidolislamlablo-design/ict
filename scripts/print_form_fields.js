const fs = require('fs');

const cur = fs.readFileSync('admin.html', 'utf8').split('\n');
const old = fs.readFileSync('temp_de14.html', 'utf8').split('\n');

console.log('=== Old de14 lines 860 to 950 ===');
console.log(old.slice(860, 950).join('\n'));

console.log('=== Current admin.html lines 960 to 1120 ===');
console.log(cur.slice(960, 1120).join('\n'));
