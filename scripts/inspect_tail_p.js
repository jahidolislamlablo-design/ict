const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];

let found = false;
for (let i = 0; i < pMatches.length; i++) {
    const raw = pMatches[i][0];
    const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();
    if (text.includes('DBMS এর পূর্ণরূপ কী?')) {
        found = true;
    }
    if (found) {
        const isGreen = raw.includes('w:val="green"');
        console.log(`[P ${i}] G:${isGreen} -> ${text}`);
        if (text.includes('১৮৩.')) {
            // print 5 more
            for (let j = 1; j <= 5; j++) {
                const nextRaw = pMatches[i+j] ? pMatches[i+j][0] : '';
                const nextText = [...nextRaw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();
                const nextG = nextRaw.includes('w:val="green"');
                console.log(`[P ${i+j}] G:${nextG} -> ${nextText}`);
            }
            break;
        }
    }
}
