const fs = require('fs');
const content = fs.readFileSync('temp_de14.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 890 to 960 of temp_de14:');
console.log(lines.slice(890, 960).join('\n'));
