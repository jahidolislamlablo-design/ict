const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];
console.log('--- P 704 ---');
console.log(pMatches[704][0]);
console.log('--- P 705 ---');
console.log(pMatches[705][0]);
