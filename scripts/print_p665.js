const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];
console.log('--- P 665 ---');
console.log(pMatches[665][0]);
console.log('--- P 666 ---');
console.log(pMatches[666][0]);
