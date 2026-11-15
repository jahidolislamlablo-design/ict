const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split('\n');

const mcqFieldStart = lines.findIndex(l => l.includes('<div class="grid-2" style="margin-top: 1rem;">'));
const mcqFieldEnd = lines.findIndex((l, i) => i > mcqFieldStart && l.includes('<div class="grid-2" style="margin-bottom: 0.75rem;">'));

console.log('Current MCQ field lines:', mcqFieldStart + 1, 'to', mcqFieldEnd + 1);

const cqFieldStart = lines.findIndex((l, i) => i > mcqFieldEnd && l.includes('<div class="grid-2" style="margin-top: 1rem;">'));
const cqFieldEnd = lines.findIndex((l, i) => i > cqFieldStart && l.includes('<!-- উদ্দীপক (Creative Stem) -->'));

console.log('Current CQ field lines:', cqFieldStart + 1, 'to', cqFieldEnd + 1);
