const fs = require('fs');
const html = fs.readFileSync('pages/reading-room.html', 'utf8');

const lines = html.split('\n');
console.log('Total lines:', lines.length);
console.log('Lines from 1850 to end:');
console.log(lines.slice(1850).join('\n'));
