const fs = require('fs');
const path = require('path');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const docXmlPath = path.join(__dirname, '..', 'temp_ch6_docx', 'word', 'document.xml');
const relsXmlPath = path.join(__dirname, '..', 'temp_ch6_docx', 'word', '_rels', 'document.xml.rels');
const imageMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_map_ch6.json'), 'utf8'));

const xml = fs.readFileSync(docXmlPath, 'utf8');
const relsXml = fs.readFileSync(relsXmlPath, 'utf8');

const relMap = {};
const relRegex = /Id="([^"]+)"[^>]*Target="([^"]+)"/g;
let rMatch;
while ((rMatch = relRegex.exec(relsXml)) !== null) relMap[rMatch[1]] = rMatch[2];

const ENGLISH_FONTS = new Set([
    'Times New Roman', 'Algerian', 'Cambria Math', 'Yu Gothic UI Semibold',
    'Arial', 'Calibri', 'Segoe UI', 'Consolas', 'Courier New', 'Math', 'Symbol', 'PMingLiU', 'Nirmala UI', 'Cambria'
]);

function decodeXmlEntities(str) {
    if (!str) return '';
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

function isEnglishOrCode(text) {
    if (!text) return false;
    if (/\b(select|from|where|order|group|by|insert|into|values|update|set|delete|drop|alter|create|table|join|count|sum|avg|like|between|distinct|unique|primary|foreign|key|null|and|or|not|desc|asc|ddl|dml|dcl|tcl|sql|dbms|rdbms|oracle|mysql|access|db2|foxpro|dbase|one|to|many|entity|attribute|relationship|tuple|field|record|file|candidate|composite|super|index|char|varchar|number|integer|date|time|currency|memo|ole|hyperlink|lookup|wizard|datum|datium|datam|data|des|plain|cipher|text|security|encryption|decryption|cryptography|cryptology|caesar|code|sort|sorting|bubble|quick|selection|insertion|report|header|footer|style|form|query|design|row|column|savepoint|inner|outer|left|right|similar|equal|total|add|get|search|extract|change|rename|remove|truncate|transaction|control|definition|manipulation|management|system|integrity|redundancy|consistency|mining|dictionary|metadata|backup|open|source|model|rectangle|diamond|oval|circle|link|codd|babbage|ritchie|gosling|range|pattern|matching|wildcard|normalization)\b/i.test(text)) {
        return true;
    }
    if (/[a-zA-Z]+\s*\(.*?\)|#include|[a-zA-Z_]\w*\s*==|[a-zA-Z_]\w*\s*<=|[a-zA-Z_]\w*\s*>=/.test(text)) {
        return true;
    }
    return false;
}

function cleanTerms(text) {
    if (!text) return '';
    return text
        .replace(/welq:\s*Z_¨\s*I\s*†hvM‡hvM\s*cÖhyw³/g, '')
        .replace(/বিষয়:\s*তথ্য\s*ও\s*যোগাযোগ\s*প্রযুক্তি/g, '')
        .replace(/বিষয়:\s*তথ্য\s*ও\s*যোগযোগ\s*প্রযুক্তি/g, '')
        .replace(/JAHID\s*SIR\s*ICT-SHEET/g, '')
        .replace(/JAHID\s*SIRICT-SHEET/g, '')
        .replace(/wi‡jkbvj\s*†WUv‡eR/g, '')
        .replace(/‡WUv‡eR\s*wi‡jkb/g, '')
        .replace(/‡WUv‡eR\s*ˆZwi/g, '')
        .replace(/Kz‡qwi\s*e¨envi/g, '')
        .replace(/‡WUv\s*wmwKDwiwU/g, '')
        .replace(/eûc`x\s*mgvwßm~PK\s*eûwbe©vPwb\s*cÖkœ\s*I\s*DËi/g, '')
        .replace(/Awfbœ\s*Z_¨wfwËK\s*eûwbe©vPwb\s*cÖkœ\s*I\s*DËi/g, '')
        .replace(/\bররর\./g, 'iii.')
        .replace(/\bরর\./g, 'ii.')
        .replace(/\bর\./g, 'i.')
        .replace(/[\uE000-\uF8FF]/g, '');
}

function convertSmart(text, font) {
    if (!text) return '';
    const bnCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnCount > 0) {
        return cleanTerms(text);
    }
    if (ENGLISH_FONTS.has(font) || isEnglishOrCode(text)) {
        return cleanTerms(text);
    }
    try {
        return cleanTerms(convertBijoyToUnicode(text));
    } catch(e) {
        return text;
    }
}

function parseParagraphRuns(pXml) {
    const itemRegex = /(<w:r[\s>].*?<\/w:r>|<m:oMath>.*?<\/m:oMath>|<w:drawing>.*?<\/w:drawing>|<w:pict>.*?<\/w:pict>)/gs;
    const runs = [];
    let match;

    while ((match = itemRegex.exec(pXml)) !== null) {
        const itemXml = match[1];

        const blipMatch = itemXml.match(/<a:blip[^>]*r:embed="([^"]+)"/);
        const vImgMatch = itemXml.match(/<v:imagedata[^>]*r:id="([^"]+)"/);
        const rId = blipMatch ? blipMatch[1] : (vImgMatch ? vImgMatch[1] : '');
        if (rId && relMap[rId]) {
            const target = relMap[rId].replace('media/', '');
            if (!target.includes('.emf')) {
                const finalUrl = imageMap[target] || `/uploads/images/${target}`;
                runs.push({ type: 'image', image: finalUrl, text: '', isAnsKey: false, isMarker: false, marker: '' });
                continue;
            }
        }

        const isAnsKey = /<w:highlight\s+w:val="(?:green|cyan)"/.test(itemXml);
        const hasTab = /<w:tab\/>/.test(itemXml);

        let text = '';
        const tMatches = [...itemXml.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)];
        if (tMatches.length > 0) text = tMatches.map(m => m[1]).join('');
        const instrMatches = [...itemXml.matchAll(/<w:instrText(?:\s+[^>]*)?>(.*?)<\/w:instrText>/gs)];
        if (instrMatches.length > 0) text += instrMatches.map(m => m[1]).join('');
        text = decodeXmlEntities(text);
        if (hasTab) text = '\t' + text;

        const fontMatch = /w:ascii="([^"]+)"/.exec(itemXml);
        const font = fontMatch ? fontMatch[1] : '';
        const isAObjective = (font === 'A-Objective');
        const isMincho = (font === 'MS Mincho');

        let marker = '';
        let isMarker = false;

        const trimmed = text.trim();
        if (isAObjective && ['K', 'L', 'M', 'N'].includes(trimmed)) {
            const mObj = { 'K': 'ক', 'L': 'খ', 'M': 'গ', 'N': 'ঘ' };
            marker = mObj[trimmed] || trimmed;
            isMarker = true;
        } else if (isMincho && ['Ⓐ', 'Ⓑ', 'Ⓒ', 'Ⓓ'].includes(trimmed)) {
            const mObj = { 'Ⓐ': 'ক', 'Ⓑ': 'খ', 'Ⓒ': 'গ', 'Ⓓ': 'ঘ' };
            marker = mObj[trimmed] || trimmed;
            isMarker = true;
        } else if (/^[কখগঘKLMN][\.\)]?$/.test(trimmed) && (font.includes('Sutonny') || font === 'A-Objective')) {
            const mObj = { 'K': 'ক', 'L': 'খ', 'M': 'গ', 'N': 'ঘ' };
            marker = mObj[trimmed[0]] || trimmed[0];
            isMarker = true;
        }

        let convText = text;
        if (!isMarker) {
            convText = convertSmart(text, font);
        }

        runs.push({ type: 'text', text: convText, rawText: text, isAnsKey, isMarker, marker, font });
    }
    return runs;
}

function parseOptTable(rawXml) {
    const tcMatches = [...rawXml.matchAll(/<w:tc[\s>].*?<\/w:tc>/gs)];
    const markerMap = { 'K': 0, 'L': 1, 'M': 2, 'N': 3, 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'Ⓐ': 0, 'Ⓑ': 1, 'Ⓒ': 2, 'Ⓓ': 3 };
    const options = ['', '', '', ''];
    let correctIdx = -1;
    let currentOptIdx = -1;

    tcMatches.forEach(tc => {
        const isAnsKey = /<w:highlight\s+w:val="(?:green|cyan)"/.test(tc[0]);
        const blipMatch = tc[0].match(/<a:blip[^>]*r:embed="([^"]+)"/);
        const rId = blipMatch ? blipMatch[1] : '';
        const img = (rId && relMap[rId]) ? imageMap[relMap[rId].replace('media/', '')] : '';
        const text = [...tc[0].matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();

        if (markerMap[text] !== undefined) {
            currentOptIdx = markerMap[text];
            if (isAnsKey) correctIdx = currentOptIdx;
        } else if (currentOptIdx >= 0) {
            if (img) options[currentOptIdx] = `<img src="${img}" style="max-height: 48px; vertical-align: middle;">`;
            else if (text && !options[currentOptIdx]) options[currentOptIdx] = convertSmart(text, '');
            if (isAnsKey) correctIdx = currentOptIdx;
        }
    });

    return { options, correctIdx };
}

function convertTableToMarkdown(rawXml) {
    const trMatches = [...rawXml.matchAll(/<w:tr[\s>].*?<\/w:tr>/gs)];
    const rows = [];
    trMatches.forEach(tr => {
        const tcMatches = [...tr[0].matchAll(/<w:tc[\s>].*?<\/w:tc>/gs)];
        const rowCells = [];
        tcMatches.forEach(tc => {
            const runs = parseParagraphRuns(tc[0]);
            const cellText = runs.map(r => r.text).join('').trim().replace(/\|/g, '/');
            rowCells.push(cellText);
        });
        rows.push(rowCells);
    });

    if (rows.length === 0) return '';
    const maxCols = Math.max(...rows.map(r => r.length));
    const padRows = rows.map(r => {
        while (r.length < maxCols) r.push('');
        return r;
    });

    let md = '\n';
    md += '| ' + padRows[0].join(' | ') + ' |\n';
    md += '| ' + padRows[0].map(() => '---').join(' | ') + ' |\n';
    for (let i = 1; i < padRows.length; i++) {
        md += '| ' + padRows[i].join(' | ') + ' |\n';
    }
    return md + '\n';
}

const bodyMatch = /<w:body>(.*?)<\/w:body>/s.exec(xml);
const bodyXml = bodyMatch[1];
const childRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
let childMatch;
const rawElements = [];

while ((childMatch = childRegex.exec(bodyXml)) !== null) {
    const raw = childMatch[1];
    if (raw.startsWith('<w:tbl')) {
        const isOptTable = /<w:highlight\s+w:val="(?:green|cyan)"/.test(raw) && /<w:t[^>]*>[KLMNকখগঘⒶⒷⒸⒹ]<\/w:t>/.test(raw);
        if (isOptTable) {
            rawElements.push({ type: 'opt_table', raw });
        } else {
            const tableMd = convertTableToMarkdown(raw);
            rawElements.push({ type: 'p', runs: [{ type: 'text', text: tableMd, isAnsKey: false, isMarker: false }], fullText: tableMd, hasMarker: false, hasAnsKey: false, images: [], raw });
        }
    } else {
        const runs = parseParagraphRuns(raw);
        const fullText = runs.map(r => r.text).join('').trim();
        const hasMarker = runs.some(r => r.isMarker) || /^[কখগঘKLMNⒶⒷⒸⒹ][\.\s\)\t]/.test(fullText);
        const hasAnsKey = runs.some(r => r.isAnsKey);
        const images = runs.filter(r => r.type === 'image').map(r => r.image);
        rawElements.push({ type: 'p', runs, fullText, hasMarker, hasAnsKey, images, raw });
    }
}

function isOptionElement(el) {
    if (el.type === 'opt_table') return true;
    if (el.type !== 'p') return false;
    return el.hasMarker;
}

const blocks = [];
let curQEls = [];
let curOptEls = [];

for (let i = 0; i < rawElements.length; i++) {
    const el = rawElements[i];

    if (isOptionElement(el)) {
        curOptEls.push(el);
    } else {
        if (curOptEls.length > 0) {
            blocks.push({ qEls: curQEls, optEls: curOptEls });
            curQEls = [];
            curOptEls = [];
        }

        if (el.type === 'p') {
            const ft = el.fullText.trim();
            if (ft.includes('welq: Z_¨ I †hvM‡hvM cÖhyw³') ||
                ft.includes('JAHID SIR') ||
                ft.includes('ICT-SHEET') ||
                ft === ''
            ) {
                if (!el.images || el.images.length === 0) {
                    continue;
                }
            }
        }
        curQEls.push(el);
    }
}
if (curOptEls.length > 0) {
    blocks.push({ qEls: curQEls, optEls: curOptEls });
}

console.log('Total blocks extracted:', blocks.length);

const answeredBlocks = blocks.filter(b => {
    return b.optEls.some(e => {
        if (e.runs && e.runs.some(r => r.isAnsKey)) return true;
        if (e.type === 'opt_table' && /<w:highlight\s+w:val="(?:green|cyan)"/.test(e.raw)) return true;
        return false;
    });
});


    let multiCount = 0;
    blocks.forEach((b, idx) => {
        const greenCount = b.optEls.reduce((sum, e) => {
            const gr = (e.runs || []).filter(r => r.isAnsKey).length;
            const tableGr = e.type === 'opt_table' && e.raw.includes('w:val="green"') ? 1 : 0;
            return sum + gr + tableGr;
        }, 0);
        if (greenCount > 1) {
            multiCount++;
            console.log(`Block ${idx+1} has ${greenCount} green highlights!`);
            b.qEls.forEach(q => console.log('   Q:', q.fullText ? q.fullText.slice(0, 60) : ''));
            b.optEls.forEach(o => console.log('   Opt:', o.fullText ? o.fullText.slice(0, 60) : (o.type || '')));
        }
    });
    console.log('Blocks with multiple green highlights:', multiCount);
    
