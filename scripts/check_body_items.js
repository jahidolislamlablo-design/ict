const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

// Find all children of <w:body>
const bodyMatch = /<w:body>(.*?)<\/w:body>/s.exec(xml);
const bodyXml = bodyMatch[1];
const childRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
let childMatch;
let pIdx = 0;
let tblIdx = 0;

for (let i = 0; i < 40; i++) {
    childMatch = childRegex.exec(bodyXml);
    if (!childMatch) break;
    const raw = childMatch[1];
    if (raw.startsWith('<w:tbl')) {
        console.log(`[Item ${i}] TABLE #${tblIdx++}`);
    } else {
        const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('');
        console.log(`[Item ${i}] P #${pIdx++} -> ${text.slice(0, 50)}`);
    }
}
