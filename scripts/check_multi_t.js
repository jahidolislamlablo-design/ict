const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const tMatches = [...xml.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)];
let multipleMarkersInOneT = 0;

tMatches.forEach(m => {
    const text = m[1];
    const pMatches = text.match(/\([কখগঘKLMN]\)/g) || [];
    if (pMatches.length > 1) {
        multipleMarkersInOneT++;
        console.log('Multiple markers in single <w:t>:', text);
    }
});

console.log('Total <w:t> with multiple paren markers:', multipleMarkersInOneT);
