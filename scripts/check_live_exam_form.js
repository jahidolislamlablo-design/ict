const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');

const liveExamStart = lines.findIndex(l => l.includes('id="liveExamForm"') || l.includes('লাইভ এক্সাম') && l.includes('<form'));
console.log('Live exam form line:', liveExamStart + 1);
console.log(lines.slice(liveExamStart - 10, liveExamStart + 120).join('\n'));
