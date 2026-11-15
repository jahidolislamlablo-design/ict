const fs = require('fs');
const content = fs.readFileSync('pages/reading-room.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 1420 to 1550:');
console.log(lines.slice(1420, 1550).join('\n'));
