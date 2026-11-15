const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8').split('\n');

const de14McqForm = de14.findIndex(l => l.includes('id="mcqForm"'));
const de14McqQ = de14.findIndex(l => l.includes('id="mcqQuestion"'));
console.log('de14 mcqForm to mcqQuestion lines:', de14McqForm + 1, 'to', de14McqQ + 1);

const de14CqForm = de14.findIndex(l => l.includes('id="cqForm"'));
const de14CqStem = de14.findIndex(l => l.includes('id="cqStem"'));
console.log('de14 cqForm to cqStem lines:', de14CqForm + 1, 'to', de14CqStem + 1);
