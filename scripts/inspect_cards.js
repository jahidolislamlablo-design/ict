const fs = require('fs');

console.log('--- Sample board-card ---');
const bq = fs.readFileSync('pages/board-question.html', 'utf8');
const bqIdx = bq.indexOf('class="board-card"');
console.log(bq.substring(bqIdx, bqIdx + 500));

console.log('--- Sample college-card ---');
const tp = fs.readFileSync('pages/test-paper.html', 'utf8');
const tpIdx = tp.indexOf('class="college-card"');
console.log(tp.substring(tpIdx, tpIdx + 500));
