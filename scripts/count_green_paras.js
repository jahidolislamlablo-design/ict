const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];
let greenRunsCount = 0;
let greenParasCount = 0;

pMatches.forEach((p, idx) => {
    const raw = p[0];
    const hMatches = raw.match(/<w:highlight\s+w:val="green"/g);
    if (hMatches) {
        greenParasCount++;
        greenRunsCount += hMatches.length;
        const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('');
        // console.log(`[P ${idx}] Green runs: ${hMatches.length} | Text: ${text.slice(0, 50)}`);
    }
});

console.log('Total paragraphs with green highlight:', greenParasCount);
console.log('Total green highlight runs:', greenRunsCount);
