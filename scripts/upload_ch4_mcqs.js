const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const DOCX_XML = path.join(__dirname, '..', 'temp_ch4_docx_extract', 'word', 'document.xml');
const LOCAL_MCQS_JSON = path.join(__dirname, '..', 'database', 'mcqs.json');
const ONEDRIVE_MCQS_JSON = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

if (!fs.existsSync(DOCX_XML)) {
    console.error('Document XML not found at', DOCX_XML);
    process.exit(1);
}

const xml = fs.readFileSync(DOCX_XML, 'utf8');

const ENGLISH_WORDS = [
    'HTML', 'CSS', 'PHP', 'ASP', 'JSP', 'XML', 'URL', 'IP', 'IPv4', 'IPv6', 'DNS', 'ISP',
    'HTTP', 'HTTPS', 'FTP', 'SMTP', 'VOIP', 'ICANN', 'W3C', 'CERN', 'RGB',
    'Google', 'Yahoo', 'Twitter', 'YouTube', 'Pipilika', 'Wikipedia', 'Mozilla', 'Opera',
    'Safari', 'Imo', 'Viber', 'Chrome',
    'DOCTYPE', 'DOCTYPE html', 'Internet', 'Browser', 'Search Engine',
    'Domain Name', 'Domain Name System', 'IP Address',
    'Server', 'Client', 'Web Server', 'Web Client', 'Website', 'Web page', 'Webpage',
    'Hosting', 'Publishing', 'Static', 'Dynamic', 'Linear', 'Hierarchical', 'Network', 'Combination', 'Hybrid',
    'Index', 'Cricket board', 'Bangladesh', 'Book', 'First Program', 'Test Website',
    'Pen.Jpg', 'Pen.jpg', 'Flag.jpg', 'HSC.jpg', 'Picture.jpg', 'rose.jpg', 'image.jpg', 'img.png', 'nature.jpg', 'Pic.jpg', 'pic.html', 'test.html',
    'table', 'tr', 'td', 'th', 'col', 'caption', 'tbody',
    'ul', 'ol', 'li', 'dt', 'dl', 'dd',
    'img', 'src', 'href', 'target', 'align', 'border', 'cellpadding', 'cellspacing', 'rowspan', 'colspan',
    'bgcolor', 'color', 'face', 'size', 'style', 'width', 'height',
    'font', 'span', 'div', 'p', 'b', 'i', 'u', 'sub', 'sup', 'del', 'em', 'big', 'small', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'circle', 'disc', 'square', 'none',
    'head', 'title', 'body',
    'HSC Exam', 'Final_Result', 'int main', 'our@college',
    '120Px', '150Px', '50Px', '300Px', '200Px', '700', '500', '1000', '800'
];

function smartConvert(text) {
    if (!text) return '';

    // Check if already predominantly Unicode Bengali
    const bnChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnChars > 0 && bnChars >= (text.replace(/\s+/g, '').length * 0.35)) {
        return text;
    }

    const puaMap = new Map();
    let puaIndex = 0;

    // 1. Word EQ fields eq \x(Page-X) -> [Page-X]
    text = text.replace(/eq\s*\\x\(([^)]+)\)/gi, '[$1]');

    // 2. Roman numerals: i, ii, iii
    text = text.replace(/(^|[\s\t\(\[])(i{1,3})([\.\)\,\s\t]|$)/g, (m, p1, roman, p2) => {
        const token = String.fromCharCode(0xE000 + (puaIndex++));
        puaMap.set(token, p1 + roman.toLowerCase() + p2);
        return token;
    });

    // 3. English keywords (exact case, safe boundaries)
    const sortedWords = [...ENGLISH_WORDS].sort((a, b) => b.length - a.length);
    const DELIM_PRE = '(?<=^|[\\s\\t\\(\\[\\{\\<\\>\\,\\.\\;\\:\\?\\!\\-\\+\\=\\*\\/\\\'\\"‘\\’“”|])';
    const DELIM_POST = '($|[\\s\\t\\)\\]\\}\\<\\>\\,\\.\\;\\:\\?\\!\\-\\+\\=\\*\\/\\\'\\"‘\\’“”|])';

    sortedWords.forEach(word => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(DELIM_PRE + escaped + DELIM_POST, 'g');
        text = text.replace(regex, (match) => {
            const token = String.fromCharCode(0xE000 + (puaIndex++));
            puaMap.set(token, match);
            return token;
        });
    });

    let converted = convertBijoyToUnicode(text);
    puaMap.forEach((orig, token) => {
        converted = converted.split(token).join(orig);
    });

    return converted;
}

function parseMathToText(mXml) {
    let res = mXml.replace(/<m:sSup>.*?<m:e>(.*?)<\/m:e>.*?<m:sup>(.*?)<\/m:sup>.*?<\/m:sSup>/gs, (match, e, sup) => {
        const eT = [...e.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        const supT = [...sup.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        const supMap = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
        const supUni = supT.split('').map(c => supMap[c] || c).join('');
        return eT + supUni;
    });
    res = res.replace(/<m:sSub>.*?<m:e>(.*?)<\/m:e>.*?<m:sub>(.*?)<\/m:sub>.*?<\/m:sSub>/gs, (match, e, sub) => {
        const eT = [...e.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        const subT = [...sub.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        const subMap = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
        const subUni = subT.split('').map(c => subMap[c] || c).join('');
        return eT + subUni;
    });
    res = res.replace(/<m:f>.*?<m:num>(.*?)<\/m:num>.*?<m:den>(.*?)<\/m:den>.*?<\/m:f>/gs, (match, num, den) => {
        const numT = [...num.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        const denT = [...den.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        return numT + '/' + denT;
    });
    res = res.replace(/<m:mr>(.*?)<\/m:mr>/gs, (match, mr) => {
        const t = [...mr.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        return t + ' ';
    });
    res = res.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return res;
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

    let text = tagText.trim();
    if (!/[\u0980-\u09FF]/.test(text) || /[†Õ‡Ô]/.test(text)) {
        text = convertBijoyToUnicode(text);
    }
    text = text.replace(/[ÕÔ‘'’`""]/g, '');

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

// Extract body elements
const bodyMatch = /<w:body>(.*?)<\/w:body>/s.exec(xml);
const bodyXml = bodyMatch[1];
const childRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
let match;
const elements = [];

while ((match = childRegex.exec(bodyXml)) !== null) {
    const raw = match[1];
    const isTable = raw.startsWith('<w:tbl');
    
    if (isTable) {
        const isOptTable = /<w:tc[\s>].*?<w:t[^>]*>[KLMN]<\/w:t>/s.test(raw);
        elements.push({ type: isOptTable ? 'opt_table' : 'stem_table', raw });
    } else {
        const itemRegex = /(<w:r[\s>].*?<\/w:r>|<m:oMath>.*?<\/m:oMath>)/gs;
        let runs = [];
        let rMatch;
        while ((rMatch = itemRegex.exec(raw)) !== null) {
            const itemXml = rMatch[1];
            if (itemXml.startsWith('<m:oMath')) {
                const mathText = parseMathToText(itemXml);
                runs.push({ text: mathText, isGreen: false, isAObjective: false, font: 'Math' });
            } else {
                const isGreen = /<w:highlight\s+w:val="green"/.test(itemXml);
                const hasTab = /<w:tab\/>/.test(itemXml);
                let text = '';
                const tMatches = [...itemXml.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)];
                if (tMatches.length > 0) text = tMatches.map(m => m[1]).join('');
                const instrMatches = [...itemXml.matchAll(/<w:instrText(?:\s+[^>]*)?>(.*?)<\/w:instrText>/gs)];
                if (instrMatches.length > 0) text += instrMatches.map(m => m[1]).join('');
                if (hasTab) text = '\t' + text;
                const isAObjective = /w:ascii="A-Objective"/.test(itemXml);
                const fontMatch = /w:ascii="([^"]+)"/.exec(itemXml);
                const font = fontMatch ? fontMatch[1] : '';
                runs.push({ text, isGreen, isAObjective, font });
            }
        }
        const fullText = runs.map(r => r.text).join('').trim();
        const allBlips = [...raw.matchAll(/<a:blip[^>]*r:embed="([^"]+)"/g)].map(m => m[1]);
        elements.push({ type: 'p', runs, fullText, imageIds: allBlips, raw });
    }
}

function isOptionElement(el) {
    if (el.type === 'opt_table') return true;
    if (el.type !== 'p') return false;
    const t = el.fullText.trim();
    if (/[ⒶⒷⒸⒹ]/.test(t)) return true;
    if (el.runs.some(r => r.isAObjective && ['K','L','M','N'].includes(r.text.trim()))) return true;
    if (/^[KLMN]\s/.test(t) || t === 'K' || t === 'L' || t === 'M' || t === 'N') return true;
    return false;
}

const blocks = [];
let curQElements = [];
let curOptElements = [];

for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (isOptionElement(el)) {
        curOptElements.push(el);
    } else {
        if (curOptElements.length > 0) {
            blocks.push({ qEls: curQElements, optEls: curOptElements });
            curQElements = [];
            curOptElements = [];
        }
        if (el.type === 'p') {
            const ft = el.fullText.trim();
            if (ft.includes('welq: Z_¨ I †hvM‡hvM cÖhyw³') || 
                ft.includes('JAHID SIR') || 
                ft.includes('ICT-SHEET')
            ) {
                continue;
            }
            if (!ft.includes('[') && !ft.includes('?') && !ft.includes('DËi `vI')) {
                const TOPIC_HEADINGS = [
                    'I‡qe wWRvB‡bi aviYv',
                    'GBPwUGgGj-Gi †gŠwjK welqmg~n',
                    'HTML U¨vM I wmb‡U· cwiwPwZ',
                    'HTML bKkv I KvVv‡gv †j-AvDU',
                    'c¨vivMÖvd, †nwWs, Kvjvi Ges web¨v‡mi e¨envi',
                    'I‡qe †cBR-G ey‡jU Ges bv¤^vwis wj÷ Gi e¨envi',
                    'nvBcviwjsK',
                    'Qwe ev B‡gR',
                    'mviwY ev †Uwej',
                    '÷vBj A¨vwUªweDU',
                    'I‡qemvBU cvewjwks',
                    '‡nwWs',
                    '‡U·U dig¨vwUs',
                    'Qwe B‡gR',
                    'div I span Gwj‡g›U Ges ÷vBj A¨vwUªweDU',
                    'I‡qe †cB‡R evsjv †`Lv‡bv',
                    'div I span Gwj‡g›U',
                    'I‡qe †cBR wWRvBwbs',
                    'eûc`x mgvwßm~PK cÖ‡kœvËi',
                    'Awfbœ Z_¨wfwËK cÖ‡kœvËi'
                ];
                if (TOPIC_HEADINGS.includes(ft)) {
                    continue;
                }
            }
        }
        curQElements.push(el);
    }
}
if (curOptElements.length > 0) blocks.push({ qEls: curQElements, optEls: curOptElements });

console.log(`Parsed ${blocks.length} MCQ blocks from docx.`);

function formatStemTable(rawXml) {
    const trMatches = [...rawXml.matchAll(/<w:tr[\s>].*?<\/w:tr>/gs)];
    if (trMatches.length === 1) {
        const text = [...trMatches[0][0].matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();
        return `\`\`\`html\n${text}\n\`\`\``;
    }
    
    // Check if Table 1 (Row 1 X, Row 2 Y A B C...)
    const rows = trMatches.map(tr => {
        const tcMatches = [...tr[0].matchAll(/<w:tc[\s>].*?<\/w:tc>/gs)];
        return tcMatches.map(tc => {
            return [...tc[0].matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)].map(m => m[1]).join('').trim();
        });
    });

    if (rows.length === 4 && rows[0][0] === 'X') {
        return [
            '| X (colspan="4") | | | |',
            '| :---: | :---: | :---: | :---: |',
            '| Y (rowspan="3") | A | B | C |',
            '| | D | E | F |',
            '| | G | H | I |'
        ].join('\n');
    }

    if (rows.length === 2 && rows[0][0].includes('Index')) {
        return [
            '| ' + rows[0].join(' | ') + ' |',
            '| :--- |',
            '| ' + rows[1].join(' | ') + ' |'
        ].join('\n');
    }

    return rows.map(r => '| ' + r.join(' | ') + ' |').join('\n');
}

function extractOptionsAndAnswer(b) {
    const optTableEl = b.optEls.find(el => el.type === 'opt_table');
    if (optTableEl) {
        const raw = optTableEl.raw;
        const tcMatches = [...raw.matchAll(/<w:tc[\s>].*?<\/w:tc>/gs)];
        const images = [...raw.matchAll(/<a:blip[^>]*r:embed="([^"]+)"/g)].map(m => m[1]);

        // Table 5: 2x2 table outputs (rId21, 22, 23, 24)
        if (images.includes('rId21') || images.includes('rId24')) {
            return {
                options: ['চিত্র - K', 'চিত্র - L', 'চিত্র - M', 'চিত্র - N'],
                correctIndex: 3, // N has border=0 (no border)
                image: '/uploads/images/mcq_ch4_image1.png'
            };
        }

        // Table 3 & 4: Circle bullet question
        return {
            options: ['● ict', '■ ict', '□ ict', '○ ict'],
            correctIndex: 3, // type="circle" produces hollow circle '○'
            image: ''
        };
    }

    const allRuns = [];
    b.optEls.forEach(el => {
        if (el.runs) el.runs.forEach(r => allRuns.push(r));
    });

    const optTexts = ['', '', '', ''];
    let currentOpt = -1;
    let correctOpt = -1;

    for (let i = 0; i < allRuns.length; i++) {
        const run = allRuns[i];
        let t = run.text.trim();

        let markerFound = -1;
        if (t === 'Ⓐ' || (run.isAObjective && t === 'K')) markerFound = 0;
        else if (t === 'Ⓑ' || (run.isAObjective && t === 'L')) markerFound = 1;
        else if (t === 'Ⓒ' || (run.isAObjective && t === 'M')) markerFound = 2;
        else if (t === 'Ⓓ' || (run.isAObjective && t === 'N')) markerFound = 3;

        if (markerFound === -1) {
            if (t.startsWith('Ⓐ')) { markerFound = 0; run.text = t.substring(1).trim(); }
            else if (t.startsWith('Ⓑ')) { markerFound = 1; run.text = t.substring(1).trim(); }
            else if (t.startsWith('Ⓒ')) { markerFound = 2; run.text = t.substring(1).trim(); }
            else if (t.startsWith('Ⓓ')) { markerFound = 3; run.text = t.substring(1).trim(); }
            else if (/^K[\s\t\.\)]/.test(t) || t === 'K') { markerFound = 0; run.text = t.replace(/^K[\s\t\.\)]*/, '').trim(); }
            else if (/^L[\s\t\.\)]/.test(t) || t === 'L') { markerFound = 1; run.text = t.replace(/^L[\s\t\.\)]*/, '').trim(); }
            else if (/^M[\s\t\.\)]/.test(t) || t === 'M') { markerFound = 2; run.text = t.replace(/^M[\s\t\.\)]*/, '').trim(); }
            else if (/^N[\s\t\.\)]/.test(t) || t === 'N') { markerFound = 3; run.text = t.replace(/^N[\s\t\.\)]*/, '').trim(); }
        }

        if (markerFound !== -1) {
            currentOpt = markerFound;
            if (run.isGreen) correctOpt = currentOpt;
            if (['K','L','M','N','Ⓐ','Ⓑ','Ⓒ','Ⓓ'].includes(t)) {
                continue;
            }
        }

        if (currentOpt >= 0) {
            const convertedPart = smartConvert(run.text);
            optTexts[currentOpt] += convertedPart;
            if (run.isGreen) correctOpt = currentOpt;
        }
    }

    const cleanOptions = optTexts.map(o => o.trim().replace(/^[\s\t\.\)\-]+/, '').trim());
    return { options: cleanOptions, correctIndex: correctOpt, image: '' };
}

async function uploadToDatabase() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    console.log('Connected to MongoDB.');

    const Mcq = mongoose.connection.collection('mcqs');

    // 1. Delete previous Chapter 4 items if any
    const delRes = await Mcq.deleteMany({ chapter: { $regex: 'Chapter 4|ওয়েব ডিজাইন', $options: 'i' } });
    console.log(`Deleted ${delRes.deletedCount} old Chapter 4 MCQ items.`);

    // 2. Prepare documents with stem inheritance
    const documents = [];
    let currentStemMeta = null;
    let stemRemaining = 0;

    for (let idx = 0; idx < blocks.length; idx++) {
        const b = blocks[idx];
        const qLines = b.qEls.map(el => {
            if (el.type === 'stem_table') return formatStemTable(el.raw);
            return smartConvert(el.fullText);
        }).filter(Boolean);
        const fullQText = qLines.join('\n');

        let tag = '';
        const m = fullQText.match(/\[([^\]\n\r]+)(?:\]|$)/);
        if (m) tag = m[1];

        let meta = parseMetadata(tag);

        const isStem = /প্রশ্নের উত্তর দাও|DËi `vI/i.test(fullQText) || /উদ্দীপক|DÏxcK/i.test(fullQText);
        if (meta.boardName) {
            if (isStem) {
                currentStemMeta = meta;
                stemRemaining = 1;
            } else {
                currentStemMeta = null;
                stemRemaining = 0;
            }
        } else {
            if (stemRemaining > 0 && currentStemMeta) {
                meta = { ...currentStemMeta };
                stemRemaining--;
            } else {
                currentStemMeta = null;
            }
        }

        const optRes = extractOptionsAndAnswer(b);
        let correctIndex = optRes.correctIndex;
        // Default Block 72 text formatting question
        if (correctIndex === -1 && fullQText.includes('টেক্সট ফরমেটিং এলিমেন্ট')) {
            correctIndex = 0; // <b> tag
        }
        if (correctIndex === -1) correctIndex = 0;

        const doc = {
            serialNo: idx + 1,
            categoryTypes: meta.categoryTypes,
            categoryType: meta.categoryType,
            chapter: 'Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML',
            collegeName: meta.collegeName,
            boardName: meta.boardName,
            examYear: meta.examYear,
            testPaperName: '',
            modelTestNo: '',
            question: fullQText,
            image: optRes.image || '',
            options: optRes.options,
            correctAnswer: optRes.options[correctIndex] || optRes.options[0],
            explanation: '',
            createdAt: new Date()
        };
        documents.push(doc);
    }

    // 3. Insert documents
    const insertRes = await Mcq.insertMany(documents);
    console.log(`Successfully inserted ${insertRes.insertedCount} Chapter 4 MCQs into MongoDB!`);

    // 4. Read all MCQs from database and write to local and OneDrive database/mcqs.json
    const allDbMcqs = await Mcq.find({}).sort({ serialNo: 1, createdAt: 1 }).toArray();
    console.log(`Total MCQs in database now: ${allDbMcqs.length}`);

    fs.writeFileSync(LOCAL_MCQS_JSON, JSON.stringify(allDbMcqs, null, 2), 'utf8');
    console.log(`Wrote full collection to ${LOCAL_MCQS_JSON}`);

    if (fs.existsSync(path.dirname(ONEDRIVE_MCQS_JSON))) {
        fs.writeFileSync(ONEDRIVE_MCQS_JSON, JSON.stringify(allDbMcqs, null, 2), 'utf8');
        console.log(`Synced full collection to OneDrive: ${ONEDRIVE_MCQS_JSON}`);
    }

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
}

uploadToDatabase().catch(err => {
    console.error('Upload failed:', err);
    process.exit(1);
});
