const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];
pMatches.forEach((p, idx) => {
    if (p[0].includes('১৬৮.')) {
        for (let i = 0; i <= 5; i++) {
            const raw = pMatches[idx + i] ? pMatches[idx + i][0] : '';
            const t = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('');
            const g = raw.includes('w:val="green"');
            console.log(`[P ${idx + i}] G:${g} -> ${t}`);
        }
    }
});
