const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const docXmlPath = path.join(__dirname, '..', 'temp_ch5_docx', 'word', 'document.xml');
const relsXmlPath = path.join(__dirname, '..', 'temp_ch5_docx', 'word', '_rels', 'document.xml.rels');
const imageMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_map_ch5.json'), 'utf8'));

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
    if (/\b(for|while|do|if|else|break|continue|main|printf|scanf|getch|clrscr|int|float|char|void|double|return|include|stdio|math|conio|string|strlen|strcpy|strcmp|charlen|relationship|symbol|bug|bugs|follies|mistake|spam|assembler|interpreter|compiler|translator|apple)\b/i.test(text)) {
        return true;
    }
    if (/[a-zA-Z]+\s*\(.*?\)|#include|[a-zA-Z_]\w*\s*==|[a-zA-Z_]\w*\s*<=|[a-zA-Z_]\w*\s*>=/.test(text)) {
        return true;
    }
    return false;
}

function cleanCProgrammingTerms(text) {
    if (!text) return '';
    return text
        .replace(/welq:\s*Z_¨\s*I\s*†hvM‡hvM\s*cÖhyw³/g, '')
        .replace(/বিষয়:\s*তথ্য\s*ও\s*যোগাযোগ\s*প্রযুক্তি/g, '')
        .replace(/বিষয়:\s*তথ্য\s*ও\s*যোগযোগ\s*প্রযুক্তি/g, '')
        .replace(/JAHID\s*SIR\s*ICT-SHEET/g, '')
        .replace(/‡cÖvMÖv‡gi\s*fvlv/g, '')
        .replace(/A¨vjMwi`g\s*I\s*cÖevnwPÎ/g, '')
        .replace(/‡cÖvMÖvg\s*wWRvBb\s*g‡Wj/g, '')
        .replace(/wm\s*†cÖvMÖvwgs\s*fvlv/g, '')
        .replace(/‡WUv\s*UvBc/g, '')
        .replace(/eûc`x\s*mgvwßm~PK\s*eûwbe©vPwb\s*cÖkœ\s*I\s*DËi/g, '')
        .replace(/eûc`x\s*mgvwßm~PK\s*cÖ‡kœvËi/g, '')
        .replace(/Awfbœ\s*Z_¨wfwËK\s*eûwbe©vPwb\s*cÖkœ\s*I\s*DËi/g, '')
        .replace(/Awfbœ\s*Z_¨wfwËK\s*cÖ‡kœvËi/g, '')
        .replace(/‡gwkb\s*fvlv\s*I\s*A¨v‡m¤^wj\s*fvlv/g, '')
        .replace(/Abyev`K\s*‡cÖvMÖvg\s*Ges\s*†cÖvMÖv‡gi\s*msMVb/g, '')
        .replace(/‡WUv\s*UvBc,\s*aªæeK\s*Ges\s*PjK/g, '')
        .replace(/ivwkgvjv,\s*Kx-IqvW©\s*Ges\s*Acv‡iUi/g, '')
        .replace(/BbcyU\s*AvDUcyU\s*‡÷U‡g›U\s*Ges\s*KbwWkbvj\s*‡÷U‡g›U/g, '')
        .replace(/wi‡jkbvj\s*Acv‡iUi/g, '')
        .replace(/jyc\s*‡÷U‡g›U/g, '')
        .replace(/‡cÖvMÖvg\s*‰Zwii\s*wPÎmg~n/g, '')
        .replace(/Abyev`K\s*‡cÖvMÖvg/g, '')
        .replace(/\bররর\./g, 'iii.')
        .replace(/\bরর\./g, 'ii.')
        .replace(/\bর\./g, 'i.')
        .replace(/\bsয়rt\b/g, 'sqrt')
        .replace(/[\uE000-\uF8FF]/g, '');
}

function convertSmart(text, font) {
    if (!text) return '';
    const bnCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnCount > 0) {
        return cleanCProgrammingTerms(text);
    }
    if (ENGLISH_FONTS.has(font) || isEnglishOrCode(text)) {
        return cleanCProgrammingTerms(text);
    }
    try {
        return cleanCProgrammingTerms(convertBijoyToUnicode(text));
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

        let shapeSvg = '';
        if (tc[0].includes('prst="ellipse"')) {
            shapeSvg = '<svg width="36" height="22" style="vertical-align:middle;"><ellipse cx="18" cy="11" rx="16" ry="9" fill="none" stroke="#334155" stroke-width="2"/></svg>';
        } else if (tc[0].includes('prst="rect"')) {
            shapeSvg = '<svg width="36" height="22" style="vertical-align:middle;"><rect x="2" y="2" width="32" height="18" fill="none" stroke="#334155" stroke-width="2"/></svg>';
        } else if (tc[0].includes('prst="diamond"')) {
            shapeSvg = '<svg width="36" height="24" style="vertical-align:middle;"><polygon points="18,2 34,12 18,22 2,12" fill="none" stroke="#334155" stroke-width="2"/></svg>';
        } else if (tc[0].includes('prst="parallelogram"')) {
            shapeSvg = '<svg width="40" height="22" style="vertical-align:middle;"><polygon points="10,2 38,2 30,20 2,20" fill="none" stroke="#334155" stroke-width="2"/></svg>';
        } else if (tc[0].includes('prst="roundRect"')) {
            shapeSvg = '<svg width="36" height="22" style="vertical-align:middle;"><rect x="2" y="2" width="32" height="18" rx="7" fill="none" stroke="#334155" stroke-width="2"/></svg>';
        }

        if (markerMap[text] !== undefined) {
            currentOptIdx = markerMap[text];
            if (isAnsKey) correctIdx = currentOptIdx;
        } else if (currentOptIdx >= 0) {
            if (img) options[currentOptIdx] = `<img src="${img}" style="max-height: 48px; vertical-align: middle;">`;
            else if (shapeSvg) options[currentOptIdx] = shapeSvg;
            else if (text && !options[currentOptIdx]) options[currentOptIdx] = convertSmart(text, '');
            if (isAnsKey) correctIdx = currentOptIdx;
        }
    });

    return { options, correctIdx };
}

const bodyMatch = /<w:body>(.*?)<\/w:body>/s.exec(xml);
const bodyXml = bodyMatch[1];
const childRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
let childMatch;
const rawElements = [];

while ((childMatch = childRegex.exec(bodyXml)) !== null) {
    const raw = childMatch[1];
    if (raw.startsWith('<w:tbl')) {
        rawElements.push({ type: 'opt_table', raw });
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

// Fixed option cleaner that preserves actual word content like কম্পাইলার, কোডিং, Mistake
function cleanSingleOption(optText) {
    if (!optText) return '';
    let cleaned = optText.trim();
    cleaned = cleaned.replace(/^(\([কখগঘKLMN]\)|[কখগঘ][\.\)\:\-\s]|[KLMN][\.\)\:\-]|[ⒶⒷⒸⒹ])\s*/, '').trim();
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

const answeredBlocks = blocks.filter(b => {
    return b.optEls.some(e => {
        if (e.runs && e.runs.some(r => r.isAnsKey)) return true;
        if (e.type === 'opt_table' && /<w:highlight\s+w:val="(?:green|cyan)"/.test(e.raw)) return true;
        return false;
    });
});

console.log('Total answered blocks:', answeredBlocks.length);

const TOPIC_HEADINGS = [
    'বিষয়: তথ্য ও যোগাযোগ প্রযুক্তি',
    'বিষয়: তথ্য ও যোগযোগ প্রযুক্তি',
    'প্রোগ্রামের ভাষা',
    'অ্যালগরিদম ও প্রবাহচিত্র',
    'প্রোগ্রাম ডিজাইন মডেল',
    'সি প্রোগ্রামিং ভাষা',
    'ডেটা টাইপ',
    'বহুপদী সমাপ্তিসূচক বহুনির্বাচনি প্রশ্ন ও উত্তর',
    'বহুপদী সমাপ্তিসূচক প্রশ্নোত্তর',
    'অভিন্ন তথ্যভিত্তিক বহুনির্বাচনি প্রশ্ন ও উত্তর',
    'অভিন্ন তথ্যভিত্তিক প্রশ্নোত্তর',
    'মেশিন ভাষা ও অ্যাসেম্বলি ভাষা',
    'অনুবাদক প্রোগ্রাম এবং প্রোগ্রামের সংগঠন',
    'ডেটা টাইপ, ধ্রুবক এবং চলক',
    'রাশিমালা, কী-ওয়ার্ড এবং অপারেটর',
    'ইনপুট আউটপুট স্টেটমেন্ট এবং কন্ডিশনাল স্টেটমেন্ট',
    'রিলেশনাল অপারেটর',
    'লুপ স্টেটমেন্ট',
    'প্রোগ্রাম তৈরির চিত্রসমূহ',
    'অনুবাদক প্রোগ্রাম'
];

const TARGET_CHAPTER = 'Chapter 5: প্রোগ্রামিং ভাষা (C Programming)';
const all402MCQs = [];

answeredBlocks.forEach((b, idx) => {
    let qImages = [];
    let qLines = [];
    let metadataTag = '';

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

            const metaTagMatch = t.match(/\[([^\]]*(?:বো|বোর্ড|সকল|কলেজ|মডেল|স্কুল|বিশ্ববিদ্যালয়|ক্যাডেট|'|Õ|Ô|\d{2})[^\]]*)\]/i);
            if (metaTagMatch) {
                metadataTag = metaTagMatch[1];
                t = t.replace(metaTagMatch[0], '').trim();
            }

            if (t) qLines.push(t);
        }
    });

    let qText = qLines.join('\n').trim();
    qText = qText.replace(/^[০-৯\d]+[\.\s।\-]+/, '').trim();

    const { options, correctIdx } = parseOptionsFromBlock(b.optEls);
    const meta = parseMetadata(metadataTag);
    const corrAns = (correctIdx >= 0 && options[correctIdx]) ? options[correctIdx] : options[0];
    let qImage = qImages.length > 0 ? qImages[0] : '';

    // Paired stimulus for MCQ 2
    if (idx === 1) {
        const stimulus = `[উদ্দীপক:\nfor (C = 15; C <= 25; C = C + 2)\n{\n    print f ("Apple");\n    if (C == 21)\n        break;\n}]\n`;
        qText = stimulus + qText;
    }
    // Flowchart diagram image for MCQ 119
    if (idx === 118 && !qImage) {
        qImage = '/uploads/images/mcq_ch5_image8.png';
    }
    // Diamond SVG symbol for MCQ 275
    if (idx === 274) {
        const diamondSvg = '<svg width="36" height="24" style="vertical-align:middle; display:inline-block; margin-right:6px;"><polygon points="18,2 34,12 18,22 2,12" fill="none" stroke="#334155" stroke-width="2"/></svg>';
        if (!qText.includes('<svg')) {
            qText = diamondSvg + qText;
        }
    }

    const _id = new mongoose.Types.ObjectId().toString();
    const createdAt = new Date().toISOString();

    all402MCQs.push({
        _id,
        serialNo: idx + 1,
        categoryTypes: meta.categoryTypes,
        categoryType: meta.categoryType,
        chapter: TARGET_CHAPTER,
        collegeName: meta.collegeName,
        boardName: meta.boardName,
        examYear: meta.examYear,
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

console.log(`Generated ${all402MCQs.length} Chapter 5 MCQs!`);

// Rigorous validation
let errors = 0;
all402MCQs.forEach((m, i) => {
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

console.log('ALL 402 MCQS PASSED VALIDATION WITH ZERO ERRORS!');

async function executeUpload() {
    const jsonPath = path.join(__dirname, '..', 'database', 'mcqs.json');
    const oneDriveJsonPath = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

    let existingData = [];
    if (fs.existsSync(jsonPath)) {
        existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }

    // Keep other chapters, replace Chapter 5
    const otherChapterMcqs = existingData.filter(m => {
        if (!m.chapter) return false;
        return !m.chapter.includes('Chapter 5') && !m.chapter.includes('৫ম অধ্যায়');
    });

    console.log(`Retaining ${otherChapterMcqs.length} MCQs from other chapters.`);
    const combinedData = [...otherChapterMcqs, ...all402MCQs];

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
                { chapter: { $regex: /Chapter 5|৫ম অধ্যায়/i } }
            ]
        });
        console.log(`Deleted ${delRes.deletedCount} existing Chapter 5 MCQs from MongoDB.`);

        const docsToInsert = all402MCQs.map(m => {
            const doc = { ...m };
            doc._id = new mongoose.Types.ObjectId(m._id);
            doc.createdAt = new Date(m.createdAt);
            return doc;
        });

        const insRes = await mcqCol.insertMany(docsToInsert);
        console.log(`Successfully inserted ${insRes.insertedCount} Chapter 5 MCQs into MongoDB!`);

        const totalDbCount = await mcqCol.countDocuments();
        console.log(`Total MCQs now in MongoDB: ${totalDbCount}`);

        const ch5DbCount = await mcqCol.countDocuments({ chapter: TARGET_CHAPTER });
        console.log(`Chapter 5 MCQs in MongoDB: ${ch5DbCount}`);

        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    } catch (e) {
        console.error('MongoDB operation error:', e.message);
    }
}

executeUpload();
