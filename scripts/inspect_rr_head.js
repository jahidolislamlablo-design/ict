const fs = require('fs');
const content = fs.readFileSync('pages/reading-room.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 1 to 100:');
console.log(lines.slice(0, 100).join('\n'));
