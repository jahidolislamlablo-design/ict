const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8').split('\n');
console.log('Lines 891 to 1015 of de14:');
console.log(de14.slice(890, 1015).join('\n'));
