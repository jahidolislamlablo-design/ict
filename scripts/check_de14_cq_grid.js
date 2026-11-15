const fs = require('fs');
const content = fs.readFileSync('temp_de14.html', 'utf8');

const cqFormIdx = content.indexOf('id="cqForm"');
const s = content.indexOf('<div class="grid-2" style="margin-top: 1rem;">', cqFormIdx);
const e = content.indexOf('id="cqSerialNo"', s);
console.log('de14 CQ fields length:', e - s);
console.log(content.substring(s, e));
