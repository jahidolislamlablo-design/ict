const fs = require('fs');
const content = fs.readFileSync('pages/reading-room.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((l, idx) => {
    if (l.includes('<body') || l.includes('reading-room-app') || l.includes('site-header') || l.includes('<footer') || l.includes('<script')) {
        console.log(`${idx + 1}: ${l.trim().slice(0, 100)}`);
    }
});
