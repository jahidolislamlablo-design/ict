const fs = require('fs');
const html = fs.readFileSync('pages/reading-room.html', 'utf8');

const tags = html.match(/<(section|header|footer|nav|main)[^>]*>/gi);
console.log('Top level semantic tags:', tags);
