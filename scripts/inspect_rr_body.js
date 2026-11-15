const fs = require('fs');
const content = fs.readFileSync('pages/reading-room.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
console.log('Lines 1350 to 1420:');
console.log(lines.slice(1350, 1420).join('\n'));
