const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 2035 to 2120 of current admin.html:');
console.log(lines.slice(2035, 2120).join('\n'));
