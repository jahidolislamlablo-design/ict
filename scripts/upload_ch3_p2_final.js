const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { convertBijoyToUnicode } = require('bijoy2unicode');
const { parseMathXml } = require('./test_math_ast');

const docXmlPath = path.join(__dirname, '..', 'temp_ch3_p2_docx', 'word', 'document.xml');
const relsXmlPath = path.join(__dirname, '..', 'temp_ch3_p2_docx', 'word', '_rels', 'document.xml.rels');
const imageMapPath = path.join(__dirname, 'image_map_ch3_p2.json');

const xml = fs.readFileSync(docXmlPath, 'utf8');
const relsXml = fs.readFileSync(relsXmlPath, 'utf8');
const imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf8'));

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

function cleanLogicTerms(text) {
    if (!text) return '';
    return text
        .replace(/\bঅঘউ\b/g, 'AND')
        .replace(/অঘউ(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, 'AND')
        .replace(/\bঘঅঘউ\b/g, 'NAND')
        .replace(/ঘঅঘউ(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, 'NAND')
        .replace(/\bঘঙঞ\b/g, 'NOT')
        .replace(/ঘঙঞ(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, 'NOT')
        .replace(/\bঢ-ঙজ\b|\bঢঙজ\b/g, 'X-OR')
        .replace(/(?:ঢ-ঙজ|ঢঙজ)(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, 'X-OR')
        .replace(/\bঢ-ঘঙজ\b|\bঢঘঙজ\b/g, 'X-NOR')
        .replace(/(?:ঢ-ঘঙজ|ঢঘঙজ)(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, 'X-NOR')
        .replace(/\bঘঙজ\b/g, 'NOR')
        .replace(/ঘঙজ(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, 'NOR')
        .replace(/(^|\s)ঙজ(?=\s|গেইট|গেট|Gate|gate|[)\].,;])/g, '$1OR')
        .replace(/ওহঢ়ঁঃ/g, 'Input')
        .replace(/ঙঁঃঢ়ঁঃ/g, 'Output')
        .replace(/এধঃব/g, 'Gate')
        .replace(/মধঃব/g, 'gate')
        .replace(/অফফবৎ/g, 'Adder')
        .replace(/ঊঘঈঙউঊ্/g, 'ENCODER')
        .replace(/ঊইঈউওঈ/g, 'EBCDIC')
        .replace(/নরঃ পড়ঁহঃবৎ/g, 'bit counter')
        .replace(/পড়ঁহঃবৎ/g, 'counter')
        .replace(/\bররর\./g, 'iii.')
        .replace(/\bরর\./g, 'ii.')
        .replace(/\bর\./g, 'i.')
        .replace(/[\uE000-\uF8FF]/g, '');
}

function convertSmart(text, font) {
    if (!text) return '';
    const bnCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnCount > 0) {
        return cleanLogicTerms(text);
    }
    if (ENGLISH_FONTS.has(font)) {
        return text;
    }
    try {
        return cleanLogicTerms(convertBijoyToUnicode(text));
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
        if (itemXml.startsWith('<m:oMath')) {
            const mathText = parseMathXml(itemXml.slice(9, -10)).trim();
            runs.push({ type: 'math', text: mathText, isGreen: false, isMarker: false, marker: '' });
            continue;
        }

        const blipMatch = itemXml.match(/<a:blip[^>]*r:embed="([^"]+)"/);
        const vImgMatch = itemXml.match(/<v:imagedata[^>]*r:id="([^"]+)"/);
        const rId = blipMatch ? blipMatch[1] : (vImgMatch ? vImgMatch[1] : '');
        if (rId && relMap[rId]) {
            const target = relMap[rId].replace('media/', '');
            const finalUrl = imageMap[target] || `/uploads/images/${target}`;
            runs.push({ type: 'image', image: finalUrl, text: '', isGreen: false, isMarker: false, marker: '' });
            continue;
        }

        const isGreen = /<w:highlight\s+w:val="green"/.test(itemXml);
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
        } else if (/^[কখগঘ]$/.test(trimmed)) {
            marker = trimmed;
            isMarker = true;
        }

        let convText = text;
        if (!isMarker) {
            convText = convertSmart(text, font);
        }

        runs.push({ type: 'text', text: convText, rawText: text, isGreen, isMarker, marker, font });
    }
    return runs;
}

function formatStemTable(rawXml) {
    const trMatches = [...rawXml.matchAll(/<w:tr[\s>].*?<\/w:tr>/gs)];
    if (trMatches.length === 0) return '';

    const rows = trMatches.map(tr => {
        const tcMatches = [...tr[0].matchAll(/<w:tc[\s>].*?<\/w:tc>/gs)];
        return tcMatches.map(tc => {
            const runs = parseParagraphRuns(tc[0]);
            let t = runs.map(r => {
                if (r.type === 'image') return `<img src="${r.image}" style="max-height: 48px; vertical-align: middle;">`;
                return r.text;
            }).join('').trim();
            return t.replace(/[\r\n\t]+/g, ' ');
        });
    });

    if (rows.length === 0 || rows[0].length === 0) return '';
    const numCols = Math.max(...rows.map(r => r.length));
    const padRow = (r) => {
        const res = [...r];
        while (res.length < numCols) res.push('');
        return res;
    };

    const header = padRow(rows[0]);
    const lines = [];
    lines.push('| ' + header.join(' | ') + ' |');
    lines.push('| ' + header.map(() => ':---:').join(' | ') + ' |');

    for (let i = 1; i < rows.length; i++) {
        lines.push('| ' + padRow(rows[i]).join(' | ') + ' |');
    }

    return lines.join('\n');
}

function parseOptTableSmart(rawXml) {
    const tcMatches = [...rawXml.matchAll(/<w:tc[\s>].*?<\/w:tc>/gs)];
    const markerMap = { 'K': 0, 'L': 1, 'M': 2, 'N': 3, 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'Ⓐ': 0, 'Ⓑ': 1, 'Ⓒ': 2, 'Ⓓ': 3 };
    const options = ['', '', '', ''];
    let correctIdx = -1;
    let currentOptIdx = -1;

    tcMatches.forEach(tc => {
        const isGreen = /<w:highlight\s+w:val="green"/.test(tc[0]);
        const blipMatch = tc[0].match(/<a:blip[^>]*r:embed="([^"]+)"/);
        const rId = blipMatch ? blipMatch[1] : '';
        const img = rId ? imageMap[relMap[rId].replace('media/', '')] : '';
        const text = [...tc[0].matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();

        if (markerMap[text] !== undefined) {
            currentOptIdx = markerMap[text];
            if (isGreen) correctIdx = currentOptIdx;
        } else if (currentOptIdx >= 0 && (img || text)) {
            if (img) options[currentOptIdx] = `<img src="${img}" style="max-height: 48px; vertical-align: middle;">`;
            else if (!options[currentOptIdx]) options[currentOptIdx] = convertSmart(text, '');
            if (isGreen) correctIdx = currentOptIdx;
        }
    });

    return { options, correctIdx };
}

// Body parse
const bodyMatch = /<w:body>(.*?)<\/w:body>/s.exec(xml);
const bodyXml = bodyMatch[1];
const childRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
let childMatch;
const rawElements = [];

while ((childMatch = childRegex.exec(bodyXml)) !== null) {
    const raw = childMatch[1];
    if (raw.startsWith('<w:tbl')) {
        const isOptTable = /<w:tc[\s>].*?(?:[KLMN]|Ⓐ|Ⓑ|Ⓒ|Ⓓ|ক|খ|গ|ঘ)<\/w:t>/s.test(raw);
        rawElements.push({ type: isOptTable ? 'opt_table' : 'stem_table', raw });
    } else {
        const runs = parseParagraphRuns(raw);
        const fullText = runs.map(r => r.text).join('').trim();
        const hasMarker = runs.some(r => r.isMarker) || /[ⒶⒷⒸⒹ]/.test(fullText);
        const hasGreen = runs.some(r => r.isGreen);
        const images = runs.filter(r => r.type === 'image').map(r => r.image);
        rawElements.push({ type: 'p', runs, fullText, hasMarker, hasGreen, images, raw });
    }
}

function isOptionElement(el, inOptions) {
    if (el.type === 'opt_table') return true;
    if (el.type !== 'p') return false;
    if (el.hasMarker) return true;
    if (inOptions) {
        if (!el.fullText.trim() && el.images && el.images.length > 0) return true;
        if (!el.fullText.trim() && el.images.length === 0) return true;
    }
    return false;
}

const blocks = [];
let curQEls = [];
let curOptEls = [];

for (let i = 0; i < rawElements.length; i++) {
    const el = rawElements[i];

    if (isOptionElement(el, curOptEls.length > 0)) {
        curOptEls.push(el);
    } else {
        if (curOptEls.length > 0) {
            blocks.push({ qEls: curQEls, optEls: curOptEls });
            curQEls = [];
            curOptEls = [];
        }

        if (el.type === 'p') {
            const ft = el.fullText.trim();
            if (ft.includes('বিষয়: তথ্য ও যোগাযোগ') ||
                ft.includes('JAHID SIR') ||
                ft.includes('ICT-SHEET') ||
                ft.includes('অধ্যায়-৩') ||
                ft.includes('লজিক গেইট ও ডিজিটাল ডিভাইস') ||
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

function parseOptionsFromBlock(optEls) {
    const optTable = optEls.find(e => e.type === 'opt_table');
    if (optTable) {
        return parseOptTableSmart(optTable.raw);
    }

    const allRuns = [];
    optEls.forEach(el => {
        if (el.runs) allRuns.push(...el.runs);
    });

    const options = [];
    let curOptionRuns = [];
    let curIsGreen = false;
    let correctIdx = -1;
    let seenFirstMarker = false;

    function flushOption() {
        const optText = curOptionRuns.map(r => {
            if (r.type === 'image') return `<img src="${r.image}" style="max-height: 48px; vertical-align: middle;">`;
            return r.text;
        }).join('').trim();

        if (curIsGreen) correctIdx = options.length;
        options.push(optText);
        curOptionRuns = [];
        curIsGreen = false;
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
                curIsGreen = false;
                seenFirstMarker = true;
            }
            if (run.isGreen) curIsGreen = true;
        } else {
            if (run.isGreen) curIsGreen = true;
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

function parseBoard(text) {
    if (/সকল/i.test(text)) return 'সকল বোর্ড';
    const found = [];
    if (/(?:^|[\s\[,;])দি(?:\.|\s|বো)|দিনাজপুর/i.test(text)) found.push('দিনাজপুর বোর্ড');
    if (/(?:^|[\s\[,;])(?:রঢা|ঢ|ঢা)(?:\.|\s|বো)|ঢাকা/i.test(text)) found.push('ঢাকা বোর্ড');
    if (/(?:^|[\s\[,;])চ(?:\.|\s|বো)|চট্টগ্রাম|চট্ট/i.test(text)) found.push('চট্টগ্রাম বোর্ড');
    if (/(?:^|[\s\[,;])কু(?:\.|\s|বো)|কুমিল্লা/i.test(text)) found.push('কুমিল্লা বোর্ড');
    if (/(?:^|[\s\[,;])রা(?:\.|\s|বো)|রাজশাহী/i.test(text)) found.push('রাজশাহী বোর্ড');
    if (/(?:^|[\s\[,;])য(?:\.|\s|বো)|যশোর/i.test(text)) found.push('যশোর বোর্ড');
    if (/(?:^|[\s\[,;])সি(?:\.|\s|বো)|সিলেট/i.test(text)) found.push('সিলেট বোর্ড');
    if (/(?:^|[\s\[,;])ম(?:\.|\s|বো)|ময়মনসিংহ/i.test(text)) found.push('ময়মনসিংহ বোর্ড');
    if (/(?:^|[\s\[,;])মা(?:\.|\s|বো)|মাদ্রাসা/i.test(text)) found.push('মাদ্রাসা বোর্ড');
    if (/(?:^|[\s\[,;])ব(?:\.|\s|বো)|বরিশাল/i.test(text)) found.push('বরিশাল বোর্ড');

    if (found.length === 0) return '';
    if (found.length === 1) return found[0];
    return found.join(', ');
}

function parseMetadata(tagText) {
    if (!tagText) {
        return {
            boardName: '',
            collegeName: '',
            examYear: '2025',
            categoryType: 'Chapter Practice',
            categoryTypes: ['Chapter Practice']
        };
    }

    let text = tagText.trim().replace(/[ÕÔ‘'’`""]/g, '');

    let examYear = '';
    const yr4 = text.match(/(20[12][0-9])/);
    if (yr4) {
        examYear = yr4[1];
    } else {
        const bn4 = text.match(/([২০১২]{2}[০-৯]{2})/);
        if (bn4) {
            const bnToEn = { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' };
            examYear = bn4[1].split('').map(c => bnToEn[c] || c).join('');
        } else {
            const bn2 = text.match(/([০-৯]{2})/);
            if (bn2) {
                const bnToEn = { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' };
                examYear = '20' + bn2[1].split('').map(c => bnToEn[c] || c).join('');
            } else {
                const en2 = text.match(/\b([12][0-9])\b/);
                if (en2) examYear = '20' + en2[1];
            }
        }
    }
    if (!examYear) examYear = '2025';

    let boardName = parseBoard(text);
    let collegeName = '';
    let categoryType = 'Chapter Practice';

    const isVarsity = /ইউনিট|বিশ্ববিদ্যালয়|বি\.|ঢাবি|রাবি|জবি|চবি|কুবি|শাবি|গুচ্ছ|কৃষি/i.test(text);
    const isCollege = /কলেজ|মডেল|স্কুল|ক্যাডেট|মহাবিদ্যালয়/i.test(text);

    if (isVarsity) {
        categoryType = 'University Admission';
        collegeName = text.replace(/\[|\]/g, '').trim();
        boardName = '';
    } else if (isCollege) {
        categoryType = 'College Test Paper';
        collegeName = text.replace(/\[|\]/g, '').trim();
    } else if (boardName) {
        categoryType = 'Board Question';
    }

    const categoryTypes = [categoryType];
    if (!categoryTypes.includes('Chapter Practice')) {
        categoryTypes.push('Chapter Practice');
    }

    return { boardName, collegeName, examYear, categoryType, categoryTypes };
}

const allMcqs = [];

blocks.forEach((b, idx) => {
    if (idx === 2) {
        // Question 4
        allMcqs.push({
            serialNo: allMcqs.length + 1,
            categoryTypes: ['Chapter Practice'],
            categoryType: 'Chapter Practice',
            chapter: 'Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট',
            collegeName: '',
            boardName: '',
            examYear: '2025',
            testPaperName: '',
            modelTestNo: '',
            question: 'উপরের লজিক চিত্রটির জন্য সরলীকৃত মান নিচের কোনটি?',
            image: '/uploads/images/mcq_ch3_p2_image4.png',
            options: ['(ক)', '(খ)', '(গ)', '(ঘ)'],
            correctAnswer: '(গ)',
            explanation: 'উপরের সার্কিটের সমীকরণ F = ((A+B)̅ · (B+C)̅)̅ = (A+B) + (B+C) = A + B + C, যা ৩-ইনপুট বিশিষ্ট OR গেট (গ) নির্দেশ করে।'
        });

        // Question 5
        const { options, correctIdx } = parseOptionsFromBlock(b.optEls);
        allMcqs.push({
            serialNo: allMcqs.length + 1,
            categoryTypes: ['Chapter Practice'],
            categoryType: 'Chapter Practice',
            chapter: 'Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট',
            collegeName: '',
            boardName: '',
            examYear: '2025',
            testPaperName: '',
            modelTestNo: '',
            question: 'ডি-মরগানের উপপাদ্য কোনটি?',
            image: '',
            options,
            correctAnswer: options[correctIdx] || options[1],
            explanation: ''
        });
        return;
    }

    let qLines = [];
    let qImage = '';
    let metadataTag = '';

    b.qEls.forEach(el => {
        if (el.type === 'stem_table') {
            const tableMd = formatStemTable(el.raw);
            if (tableMd) qLines.push(tableMd);
        } else if (el.type === 'p') {
            if (el.images && el.images.length > 0 && !qImage) {
                if (!el.images[0].includes('.emf')) {
                    qImage = el.images[0];
                }
            }
            let t = el.fullText.trim();
            if (idx === 0) {
                t = t.replace(/বিষয়:.*|JAHID SIR.*|ICT-SHEET.*/g, '').trim();
            }
            const tagMatch = t.match(/\[(.*?)\]/);
            if (tagMatch) {
                metadataTag = tagMatch[1];
                t = t.replace(/\[.*?\]/, '').trim();
            }
            if (t) qLines.push(t);
        }
    });

    let qText = qLines.join('\n').trim();
    qText = qText.replace(/^[০-৯\d]+[\.\s।\-]+/, '').trim();

    const { options, correctIdx } = parseOptionsFromBlock(b.optEls);
    const meta = parseMetadata(metadataTag);
    const corrAns = (correctIdx >= 0 && options[correctIdx]) ? options[correctIdx] : options[0];

    allMcqs.push({
        serialNo: allMcqs.length + 1,
        categoryTypes: meta.categoryTypes,
        categoryType: meta.categoryType,
        chapter: 'Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট',
        collegeName: meta.collegeName,
        boardName: meta.boardName,
        examYear: meta.examYear,
        testPaperName: '',
        modelTestNo: '',
        question: qText,
        image: qImage,
        options,
        correctAnswer: corrAns,
        explanation: ''
    });
});

console.log(`Generated ${allMcqs.length} MCQs for Chapter 3 Part 2.`);

// Database upload
async function runUpload() {
    const jsonPath = path.join(__dirname, '..', 'database', 'mcqs.json');
    const oneDriveJsonPath = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

    let existingData = [];
    if (fs.existsSync(jsonPath)) {
        existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }

    // Filter out any existing MCQs with target chapter name
    const targetChapter = 'Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট';
    const otherChapterMcqs = existingData.filter(m => m.chapter !== targetChapter);

    console.log(`Retaining ${otherChapterMcqs.length} MCQs from other chapters.`);
    
    // Assign _id and timestamps to allMcqs if not present
    allMcqs.forEach((m, idx) => {
        if (!m._id) {
            m._id = new mongoose.Types.ObjectId().toString();
        }
        m.createdAt = new Date().toISOString();
        m.__v = 0;
    });

    const combinedJson = [...otherChapterMcqs, ...allMcqs];
    fs.writeFileSync(jsonPath, JSON.stringify(combinedJson, null, 2), 'utf8');
    console.log(`Saved ${combinedJson.length} total MCQs to local database/mcqs.json`);

    if (fs.existsSync(oneDriveJsonPath)) {
        fs.writeFileSync(oneDriveJsonPath, JSON.stringify(combinedJson, null, 2), 'utf8');
        console.log(`Saved ${combinedJson.length} total MCQs to OneDrive database/mcqs.json`);
    }

    // Connect to MongoDB and sync
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning', { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB.');

        const mcqCol = mongoose.connection.collection('mcqs');
        const delRes = await mcqCol.deleteMany({ chapter: targetChapter });
        console.log(`Deleted ${delRes.deletedCount} old MCQs for "${targetChapter}" from MongoDB.`);

        // Convert _id to ObjectId or insert
        const docsToInsert = allMcqs.map(m => {
            const doc = { ...m };
            doc._id = new mongoose.Types.ObjectId(m._id);
            doc.createdAt = new Date(m.createdAt);
            return doc;
        });

        const insRes = await mcqCol.insertMany(docsToInsert);
        console.log(`Successfully inserted ${insRes.insertedCount} new MCQs into MongoDB!`);

        const totalDbCount = await mcqCol.countDocuments();
        console.log(`Total MCQs in MongoDB: ${totalDbCount}`);

        await mongoose.disconnect();
    } catch (e) {
        console.error('MongoDB upload warning:', e.message);
    }
}

runUpload();
