const fs = require('fs');
const text = fs.readFileSync('scripts/pdf_pages/page_1.txt', 'utf8');
console.log(text);
