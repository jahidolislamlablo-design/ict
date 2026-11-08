const fs = require('fs');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');
const pMatches = [...xml.matchAll(/<w:p[\s>].*?<\/w:p>/gs)];

console.log('Sample first 25 paragraphs:');
for (let i = 0; i < Math.min(25, pMatches.length); i++) {
    const raw = pMatches[i][0];
    const text = [...raw.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('');
    const font = (/w:ascii="([^"]+)"/.exec(raw) || [])[1] || '';
    const isGreen = /<w:highlight\s+w:val="green"/.test(raw);
    let uni = '';
    try {
        uni = convertBijoyToUnicode(text);
    } catch(e) {
        uni = text;
    }
    console.log(`[P ${i}] G:${isGreen} Font:${font} -> Raw: ${text.slice(0, 40)} | Uni: ${uni.slice(0, 40)}`);
}
