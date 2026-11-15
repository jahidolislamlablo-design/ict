const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8');

// Check resetMcqForm in de14
const r1 = de14.indexOf('function resetMcqForm');
const r1_end = de14.indexOf('function ', r1 + 10);
console.log('=== de14 resetMcqForm ===\n', de14.substring(r1, r1_end));

// Check resetCqForm in de14
const r2 = de14.indexOf('function resetCqForm');
const r2_end = de14.indexOf('function ', r2 + 10);
console.log('=== de14 resetCqForm ===\n', de14.substring(r2, r2_end));
