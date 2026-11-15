const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');

const s = content.indexOf('<div class="grid-2" style="margin-top: 1rem;">');
const e = content.indexOf('id="mcqSerialNo"');
console.log('MCQ field block: length', e - s);
console.log(content.substring(s, s + 300));
console.log('...');
console.log(content.substring(e - 300, e + 50));
