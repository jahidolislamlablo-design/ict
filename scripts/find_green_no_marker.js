const fs = require('fs');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');
const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];

// Check how options are formatted in paragraphs that have green highlight
pMatches.forEach((p, idx) => {
    const raw = p[0];
    if (raw.includes('w:val="green"')) {
        const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('');
        const font = (/w:ascii="([^"]+)"/.exec(raw) || [])[1] || '';
        let uni = text;
        try { uni = convertBijoyToUnicode(text); } catch(e) {}
        
        // Check if it starts with marker
        const hasMarker = /^[কখগঘKLMNⒶⒷⒸⒹ\(\)]/.test(text.trim()) || /^[কখগঘKLMNⒶⒷⒸⒹ\(\)]/.test(uni.trim());
        if (!hasMarker) {
            console.log(`[P ${idx}] Green highlight but NO MARKER: Raw="${text.slice(0, 40)}" | Uni="${uni.slice(0, 40)}"`);
        }
    }
});
