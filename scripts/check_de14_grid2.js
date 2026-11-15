const fs = require('fs');
const content = fs.readFileSync('temp_de14.html', 'utf8');

const s = content.indexOf('<div class="grid-2" style="margin-top: 1rem;">');
const e = content.indexOf('id="mcqSerialNo"');
console.log('de14 MCQ fields length:', e - s);
console.log(content.substring(s, e));
