const fs = require('fs');
const content = fs.readFileSync('scripts/sync_all_and_bump.js', 'utf8');
console.log(content);
