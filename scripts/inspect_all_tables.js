const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const tblMatches = [...xml.matchAll(/<w:tbl[\s>].*?<\/w:tbl>/gs)];
console.log(`Found ${tblMatches.length} tables:`);

tblMatches.forEach((tbl, idx) => {
    const raw = tbl[0];
    const isAnsKey = /<w:highlight\s+w:val="(?:green|cyan)"/.test(raw);
    const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join(' | ');
    const hasK = /\b[KkকⒶ]\b/.test(text);
    console.log(`\n--- TABLE #${idx} (AnsKey: ${isAnsKey}) ---`);
    console.log('Text preview:', text.slice(0, 200));
});
