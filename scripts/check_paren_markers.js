const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];
let parenMarkerCount = 0;

pMatches.forEach((p, idx) => {
    const raw = p[0];
    const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();
    if (/^\([কখগঘ]\)/.test(text)) {
        parenMarkerCount++;
    }
});

console.log('Total paragraphs starting with (ক)/(খ)/(গ)/(ঘ):', parenMarkerCount);
