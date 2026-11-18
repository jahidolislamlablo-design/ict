const fs = require('fs');

const text = fs.readFileSync('scripts/full_pdf_smart_unicode.txt', 'utf8');

// Print first 4000 characters
console.log(text.slice(0, 4000));
