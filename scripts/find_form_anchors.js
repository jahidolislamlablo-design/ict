const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
    if (l.includes('id="mcqQuestion"') || l.includes('id="cqQuestion"') || l.includes('id="cqStem"') || l.includes('id="mcqForm"') || l.includes('id="cqForm"')) {
        console.log((i+1) + ': ' + l.trim());
    }
});
