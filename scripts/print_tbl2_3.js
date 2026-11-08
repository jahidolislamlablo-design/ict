const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const tblMatches = [...xml.matchAll(/<w:tbl[\s>].*?<\/w:tbl>/gs)];

console.log('--- TABLE #2 ---');
console.log(tblMatches[2][0]);

console.log('--- TABLE #3 ---');
console.log(tblMatches[3][0]);
