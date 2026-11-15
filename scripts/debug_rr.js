const fs = require('fs');
const html = fs.readFileSync('pages/reading-room.html', 'utf8');

const lines = html.split('\n');
console.log('Searching for onclick and functions in reading-room.html:');
lines.forEach((l, i) => {
    if (l.includes('onclick') && (l.includes('Detail') || l.includes('User') || l.includes('Modal'))) {
        console.log((i+1) + ': ' + l.trim());
    }
    if (l.includes('function showUserDetailView') || l.includes('function openUserProfileModal') || l.includes('user-detail-view')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
