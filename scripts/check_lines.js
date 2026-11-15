const fs = require('fs');
const content = fs.readFileSync('pages/reading-room.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 620 to 700:');
console.log(lines.slice(620, 700).join('\n'));
