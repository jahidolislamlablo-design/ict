const fs = require('fs');
const content = fs.readFileSync('pages/reading-room.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 1550 to 1750:');
console.log(lines.slice(1550, 1750).join('\n'));
