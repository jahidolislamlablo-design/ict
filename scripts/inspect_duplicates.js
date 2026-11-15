const fs = require('fs');
const html = fs.readFileSync('pages/reading-room.html', 'utf8');

const lines = html.split('\n');
console.log('Lines 1550 to 1780:');
console.log(lines.slice(1550, 1780).join('\n'));
