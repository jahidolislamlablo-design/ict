const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');

const qIdx = content.indexOf('id="mcqQuestion"');
console.log(content.substring(qIdx - 300, qIdx + 100));
