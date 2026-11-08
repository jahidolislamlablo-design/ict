const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
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
    const lower = text.toLowerCase().trim();
    if (/\b(select|from|where|order|group|by|insert|into|values|update|set|delete|drop|alter|create|table|join|count|sum|avg|like|between|distinct|unique|primary|foreign|key|null|and|or|not|desc|asc|ddl|dml|dcl|tcl|sql|dbms|rdbms|oracle|mysql|access|db2|foxpro|dbase|one|to|many|entity|attribute|relationship|tuple|field|record|file|candidate|composite|super|index|char|varchar|number|integer|date|time|currency|memo|ole|hyperlink|lookup|wizard|datum|datium|datam|data|des|plain|cipher|text|security|encryption|decryption|cryptography|cryptology|caesar|code|sort|sorting|bubble|quick|selection|insertion|report|header|footer|style|form|query|design|row|column|savepoint|inner|outer|left|right|similar|equal|total|add|get|search|extract|change|rename|remove|truncate|transaction|control|definition|manipulation|management|system|integrity|redundancy|consistency|mining|dictionary|metadata|backup|open|source|model|rectangle|diamond|oval|circle|link|codd|babbage|ritchie|gosling|range|pattern|matching|wildcard|normalization)\b/i.test(text)) {
        return true;
    }
    if (/\b(id|name|city|dhaka|khulna|sylhet|tinni|arif|mim|student|result|sub|marks|math|ict|class|section|morning|five|table|mr|manager|officer|date|address|mobile|salary|tk|sunamganj|raj|richi|bir|arjun|ctg|dha|com|dob|roll|gpa|gap|atik|abir|asif|s01|s02|s03|e-101|e-102|e-103|e-104)\b/i.test(text)) {
        return true;
    }
    if (/[a-zA-Z]+\s*\(.*?\)|#include|[a-zA-Z_]\w*\s*==|[a-zA-Z_]\w*\s*<=|[a-zA-Z_]\w*\s*>=/.test(text)) {
        return true;
    }
    return false;
}

function cleanChapterTerms(text) {
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
        .replace(/eûc`x\s*mgvwßm~PK\s*cÖ‡kœvËi/g, '')
        .replace(/Awfbœ\s*Z_¨wfwËK\s*cÖ‡kœvËi/g, '')
        .replace(/\bররর\./g, 'iii.')
        .replace(/\bরর\./g, 'ii.')
        .replace(/\bর\./g, 'i.')
        .replace(/[\uE000-\uF8FF]/g, '');
}

function convertSmart(text, font) {
    if (!text) return '';
    const bnCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnCount > 0) {
        return cleanChapterTerms(text);
    }
    if (ENGLISH_FONTS.has(font) || isEnglishOrCode(text)) {
        return cleanChapterTerms(text);
    }
    try {
        return cleanChapterTerms(convertBijoyToUnicode(text));
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

        const trimmed = text.trim();

        // Check if run starts with or contains paren marker e.g. (ক), (খ), (গ), (ঘ)
        const parenMatch = trimmed.match(/^\(([কখগঘKLMN])\)/);
        if (parenMatch) {
            const mObj = { 'K': 'ক', 'L': 'খ', 'M': 'গ', 'N': 'ঘ' };
            const mChar = mObj[parenMatch[1]] || parenMatch[1];
            runs.push({ type: 'text', text: parenMatch[0], rawText: parenMatch[0], isAnsKey, isMarker: true, marker: mChar, font });
            
            const remaining = trimmed.slice(parenMatch[0].length).trim();
            if (remaining) {
                const convRemaining = convertSmart(remaining, font);
                runs.push({ type: 'text', text: convRemaining, rawText: remaining, isAnsKey, isMarker: false, marker: '', font });
            }
            continue;
        }

        let marker = '';
        let isMarker = false;

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
            rawElements.push({
                type: 'p',
                runs: [{ type: 'text', text: tableMd, isAnsKey: false, isMarker: false }],
                fullText: tableMd,
                hasMarker: false,
                hasAnsKey: false,
                images: [],
                raw
            });
        }
    } else {
        const runs = parseParagraphRuns(raw);
        const fullText = runs.map(r => r.text).join('').trim();
        const hasMarker = runs.some(r => r.isMarker) || /^(\([কখগঘKLMN]\)|[কখগঘKLMNⒶⒷⒸⒹ][\.\s\)\t])/.test(fullText);
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

function cleanSingleOption(optText) {
    if (!optText) return '';
    let cleaned = optText.trim();
    cleaned = cleaned.replace(/^(\([কখগঘKLMN]\)|[কখগঘ][\.\)\:\-\s]|[KLMN][\.\)\:\-]|[ⒶⒷⒸⒹ])\s*/, '').trim();
    cleaned = cleaned.replace(/\s*উত্তর:\s*.*$/, '').trim();
    return cleaned;
}

function parseOptionsFromBlock(optEls) {
    const optTable = optEls.find(e => e.type === 'opt_table');
    if (optTable) {
        const res = parseOptTable(optTable.raw);
        res.options = res.options.map(cleanSingleOption);
        return res;
    }

    const allRuns = [];
    optEls.forEach(el => {
        if (el.runs) allRuns.push(...el.runs);
    });

    const options = [];
    let curOptionRuns = [];
    let curIsAnsKey = false;
    let correctIdx = -1;
    let seenFirstMarker = false;

    function flushOption() {
        const optText = curOptionRuns.map(r => {
            if (r.type === 'image') return `<img src="${r.image}" style="max-height: 48px; vertical-align: middle;">`;
            return r.text;
        }).join('').trim();

        if (curIsAnsKey) correctIdx = options.length;
        options.push(cleanSingleOption(optText));
        curOptionRuns = [];
        curIsAnsKey = false;
    }

    for (let i = 0; i < allRuns.length; i++) {
        const run = allRuns[i];
        let isMarker = run.isMarker;

        if (!isMarker && run.type === 'text') {
            const mMatch = run.text.match(/^([ⒶⒷⒸⒹ])/);
            if (mMatch) {
                isMarker = true;
                run.text = run.text.slice(1).trim();
            }
        }

        if (isMarker) {
            if (seenFirstMarker) {
                flushOption();
            } else {
                curOptionRuns = [];
                curIsAnsKey = false;
                seenFirstMarker = true;
            }
            if (run.isAnsKey) curIsAnsKey = true;
        } else {
            if (run.isAnsKey) curIsAnsKey = true;
            if (seenFirstMarker) {
                curOptionRuns.push(run);
            }
        }
    }

    if (seenFirstMarker) {
        flushOption();
    }

    return { options, correctIdx };
}

const TOPIC_HEADINGS = [
    'বিষয়: তথ্য ও যোগাযোগ প্রযুক্তি',
    'বিষয়: তথ্য ও যোগযোগ প্রযুক্তি',
    'রিলেশনাল ডেটাবেজ',
    'ডেটাবেজ রিলেশন',
    'ডেটাবেজ তৈরি',
    'কুয়েরি ব্যবহার',
    'ডেটা সিকিউরিটি',
    'বহুপদী সমাপ্তিসূচক বহুনির্বাচনি প্রশ্ন ও উত্তর',
    'বহুপদী সমাপ্তিসূচক প্রশ্নোত্তর',
    'অভিন্ন তথ্যভিত্তিক বহুনির্বাচনি প্রশ্ন ও উত্তর',
    'অভিন্ন তথ্যভিত্তিক প্রশ্নোত্তর'
];

const answeredBlocks = blocks.filter(b => {
    return b.optEls.some(e => {
        if (e.runs && e.runs.some(r => r.isAnsKey)) return true;
        if (e.type === 'opt_table' && /<w:highlight\s+w:val="(?:green|cyan)"/.test(e.raw)) return true;
        return false;
    });
});

console.log('Total answered blocks:', answeredBlocks.length);

const TARGET_CHAPTER = 'Chapter 6: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)';
const allCh6MCQs = [];

answeredBlocks.forEach((b, idx) => {
    let qImages = [];
    let qLines = [];

    b.qEls.forEach(el => {
        if (el.images) qImages.push(...el.images);
        let t = el.fullText ? el.fullText.trim() : '';
        if (t) {
            for (const h of TOPIC_HEADINGS) {
                if (t === h) {
                    t = '';
                    break;
                }
                if (t.startsWith(h)) {
                    t = t.slice(h.length).trim();
                }
            }
            if (!t) return;

            if (/^উত্তর:\s*[কখগঘKLMN]/i.test(t)) {
                return;
            }

            if (t) qLines.push(t);
        }
    });

    let qText = qLines.join('\n').trim();
    qText = qText.replace(/^[০-৯\d]+[\.\s।\-]+/, '').trim();
    qText = qText.replace(/[\[\]]+$/, '').trim();

    const { options, correctIdx } = parseOptionsFromBlock(b.optEls);
    const corrAns = (correctIdx >= 0 && options[correctIdx]) ? options[correctIdx] : options[0];
    let qImage = qImages.length > 0 ? qImages[0] : '';

    const _id = new mongoose.Types.ObjectId().toString();
    const createdAt = new Date().toISOString();

    allCh6MCQs.push({
        _id,
        serialNo: idx + 1,
        categoryTypes: ['Chapter Practice'],
        categoryType: 'Chapter Practice',
        chapter: TARGET_CHAPTER,
        collegeName: '',
        boardName: '',
        examYear: '2025',
        testPaperName: '',
        modelTestNo: '',
        question: qText,
        image: qImage,
        options,
        correctAnswer: corrAns,
        explanation: '',
        createdAt,
        __v: 0
    });
});

console.log(`Generated ${allCh6MCQs.length} Chapter 6 MCQs!`);

// Rigorous validation
let errors = 0;
allCh6MCQs.forEach((m, i) => {
    if (!m.question || m.question.length < 5) {
        console.error(`[Error] MCQ ${i + 1}: Short or empty question`);
        errors++;
    }
    if (!m.options || m.options.length !== 4) {
        console.error(`[Error] MCQ ${i + 1}: Options count is ${m.options ? m.options.length : 0}`);
        errors++;
    }
    if (m.options.some(o => !o || o.trim() === '')) {
        console.error(`[Error] MCQ ${i + 1}: Has empty option:`, m.options);
        errors++;
    }
    if (!m.correctAnswer || !m.options.includes(m.correctAnswer)) {
        console.error(`[Error] MCQ ${i + 1}: Correct answer "${m.correctAnswer}" not in options:`, m.options);
        errors++;
    }
});

if (errors > 0) {
    console.error(`Validation failed with ${errors} errors. Aborting upload.`);
    process.exit(1);
}

console.log('ALL 187 MCQS PASSED VALIDATION WITH ZERO ERRORS!');

async function executeUpload() {
    const jsonPath = path.join(__dirname, '..', 'database', 'mcqs.json');
    const oneDriveJsonPath = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

    let existingData = [];
    if (fs.existsSync(jsonPath)) {
        existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }

    // Keep other chapters, remove existing Chapter 6 if any
    const otherChapterMcqs = existingData.filter(m => {
        if (!m.chapter) return false;
        return !m.chapter.includes('Chapter 6') && !m.chapter.includes('৬ষ্ঠ অধ্যায়');
    });

    console.log(`Retaining ${otherChapterMcqs.length} MCQs from other chapters.`);
    const combinedData = [...otherChapterMcqs, ...allCh6MCQs];

    fs.writeFileSync(jsonPath, JSON.stringify(combinedData, null, 2), 'utf8');
    console.log(`Saved ${combinedData.length} MCQs to local ${jsonPath}`);

    if (fs.existsSync(oneDriveJsonPath)) {
        fs.writeFileSync(oneDriveJsonPath, JSON.stringify(combinedData, null, 2), 'utf8');
        console.log(`Saved ${combinedData.length} MCQs to OneDrive mirror ${oneDriveJsonPath}`);
    }

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning', { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB.');

        const mcqCol = mongoose.connection.collection('mcqs');
        const delRes = await mcqCol.deleteMany({
            $or: [
                { chapter: TARGET_CHAPTER },
                { chapter: { $regex: /Chapter 6|৬ষ্ঠ অধ্যায়/i } }
            ]
        });
        console.log(`Deleted ${delRes.deletedCount} existing Chapter 6 MCQs from MongoDB.`);

        const docsToInsert = allCh6MCQs.map(m => {
            const doc = { ...m };
            doc._id = new mongoose.Types.ObjectId(m._id);
            doc.createdAt = new Date(m.createdAt);
            return doc;
        });

        const insRes = await mcqCol.insertMany(docsToInsert);
        console.log(`Successfully inserted ${insRes.insertedCount} Chapter 6 MCQs into MongoDB!`);

        const totalDbCount = await mcqCol.countDocuments();
        console.log(`Total MCQs now in MongoDB: ${totalDbCount}`);

        const ch6DbCount = await mcqCol.countDocuments({ chapter: TARGET_CHAPTER });
        console.log(`Chapter 6 MCQs in MongoDB: ${ch6DbCount}`);

        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    } catch (e) {
        console.error('MongoDB operation error:', e.message);
    }
}

executeUpload();
