const fs = require('fs');
const path = require('path');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const DOCX_XML = path.join(__dirname, '..', 'temp_ch2_docx_extract', 'word', 'document.xml');
const xml = fs.readFileSync(DOCX_XML, 'utf8');

function parseP(pXml) {
    const childRegex = /(<w:r[\s>].*?<\/w:r>|<m:oMath>.*?<\/m:oMath>)/gs;
    let childMatch;
    let runs = [];
    while ((childMatch = childRegex.exec(pXml)) !== null) {
        const itemXml = childMatch[1];
        if (!itemXml.startsWith('<m:oMath')) {
            let text = '';
            const tMatches = [...itemXml.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)];
            if (tMatches.length > 0) text = tMatches.map(m => m[1]).join('');
            const isAObjective = /w:ascii="A-Objective"/.test(itemXml);
            runs.push({ text, isAObjective });
        }
    }
    return { fullText: runs.map(r => r.text).join('').trim(), runs };
}

const pRegex = /<w:p[\s>](.*?)<\/w:p>/gs;
const rawParagraphs = [];
let match;
while ((match = pRegex.exec(xml)) !== null) rawParagraphs.push(match[1]);
const paragraphs = rawParagraphs.map(parseP).filter(p => p.fullText.length > 0);

function isOptionP(p) {
    const t = p.fullText.trim();
    if (/[ⒶⒷⒸⒹ]/.test(t)) return true;
    if (p.runs.some(r => r.isAObjective && ['K','L','M','N'].includes(r.text.trim()))) return true;
    return false;
}

const blocks = [];
let curQ = [];
let curOpt = [];
for (let p of paragraphs) {
    if (isOptionP(p)) curOpt.push(p);
    else {
        if (curOpt.length > 0) {
            blocks.push({ qPs: curQ, optPs: curOpt });
            curQ = [];
            curOpt = [];
        }
        if (p.fullText.includes('welq: Z_¨ I †hvM‡hvM cÖhyw³') || p.fullText.includes('JAHID SIR ICT-SHEET')) continue;
        curQ.push(p);
    }
}
if (curOpt.length > 0) blocks.push({ qPs: curQ, optPs: curOpt });

const IMAGE_MAPPING = {
    2: '/uploads/images/mcq_ch2_image1.png',
    3: '/uploads/images/mcq_ch2_image1.png',
    25: '/uploads/images/mcq_ch2_image2.png',
    26: '/uploads/images/mcq_ch2_image2.png',
    67: '/uploads/images/mcq_ch2_image3.png',
    68: '/uploads/images/mcq_ch2_image3.png',
    90: '/uploads/images/mcq_ch2_image4.png',
    91: '/uploads/images/mcq_ch2_image4.png',
    122: '/uploads/images/mcq_ch2_image5.png',
    125: '/uploads/images/mcq_ch2_image6.png',
    171: '/uploads/images/mcq_ch2_image7.png',
    175: '/uploads/images/mcq_ch2_image8.png',
    182: '/uploads/images/mcq_ch2_image9.png',
    225: '/uploads/images/mcq_ch2_image10.png',
    226: '/uploads/images/mcq_ch2_image10.png',
    229: '/uploads/images/mcq_ch2_image11.png',
    230: '/uploads/images/mcq_ch2_image11.png',
    235: '/uploads/images/mcq_ch2_image12.png',
    236: '/uploads/images/mcq_ch2_image12.png',
};

Object.entries(IMAGE_MAPPING).forEach(([idx, imgPath]) => {
    const b = blocks[idx];
    const qText = b.qPs.map(p => p.fullText).join(' ');
    console.log(`Block ${parseInt(idx) + 1} -> ${imgPath}`);
    console.log(`   Text: ${qText.slice(0, 60)}...`);
});
