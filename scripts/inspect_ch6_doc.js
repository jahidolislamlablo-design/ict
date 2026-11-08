const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const highlights = {};
const regex = /<w:highlight\s+w:val="([^"]+)"/g;
let m;
while ((m = regex.exec(xml)) !== null) {
    highlights[m[1]] = (highlights[m[1]] || 0) + 1;
}
console.log('Highlight counts in Chapter 6 docx:', highlights);

// Check total paragraphs and tables
const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];
const tblMatches = [...xml.matchAll(/<w:tbl[\s>].*?<\/w:tbl>/gs)];
console.log('Total paragraphs:', pMatches.length);
console.log('Total tables:', tblMatches.length);
