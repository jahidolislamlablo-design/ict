const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');

console.log(lines.slice(2030, 2140).join('\n'));
