const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const DOCX_XML = path.join(__dirname, '..', 'temp_ch2_docx_extract', 'word', 'document.xml');
const LOCAL_MCQS_JSON = path.join(__dirname, '..', 'database', 'mcqs.json');
const ONEDRIVE_MCQS_JSON = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

if (!fs.existsSync(DOCX_XML)) {
    console.error('Document XML not found at', DOCX_XML);
    process.exit(1);
}

const xml = fs.readFileSync(DOCX_XML, 'utf8');

function parseMathToText(mXml) {
    const fRegex = /<m:f>.*?<m:num>(.*?)<\/m:num>.*?<m:den>(.*?)<\/m:den>.*?<\/m:f>/gs;
    let res = mXml.replace(fRegex, (match, numXml, denXml) => {
        let numStr = '';
        const dMatch = /<m:d>.*?<m:e>(.*?)<\/m:e>.*?<\/m:d>/s.exec(numXml);
        if (dMatch) {
            const beforeD = numXml.slice(0, numXml.indexOf('<m:d>'));
            const beforeTexts = [...beforeD.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
            const dTexts = [...dMatch[1].matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
            numStr = `${beforeTexts}(${dTexts})`;
        } else {
            numStr = [...numXml.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        }
        const denStr = [...denXml.matchAll(/<m:t>(.*?)<\/m:t>/g)].map(m => m[1]).join('');
        return `${numStr}/${denStr}`;
    });
    return res.replace(/<m:t>(.*?)<\/m:t>/g, '$1').replace(/<[^>]+>/g, '').trim();
}

function parseP(pXml) {
    const childRegex = /(<w:r[\s>].*?<\/w:r>|<m:oMath>.*?<\/m:oMath>)/gs;
    let childMatch;
    let runs = [];
    while ((childMatch = childRegex.exec(pXml)) !== null) {
        const itemXml = childMatch[1];
        if (itemXml.startsWith('<m:oMath')) {
            const mathText = parseMathToText(itemXml);
            runs.push({ text: mathText, isGreen: false, isAObjective: false, isMath: true, font: 'Math' });
        } else {
            const isGreen = /<w:highlight\s+w:val="green"/.test(itemXml);
            const hasTab = /<w:tab\/>/.test(itemXml);
            let text = '';
            const tMatches = [...itemXml.matchAll(/<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>/gs)];
            if (tMatches.length > 0) text = tMatches.map(m => m[1]).join('');
            if (hasTab) text = '\t' + text;
            const isAObjective = /w:ascii="A-Objective"/.test(itemXml);
            const fontMatch = /w:ascii="([^"]+)"/.exec(itemXml);
            const font = fontMatch ? fontMatch[1] : '';
            runs.push({ text, isGreen, isAObjective, isMath: false, font });
        }
    }

    const allBlips = [...pXml.matchAll(/<a:blip[^>]*r:embed="([^"]+)"/g)].map(m => m[1]);
    return {
        fullText: runs.map(r => r.text).join('').trim(),
        runs,
        imageIds: allBlips
    };
}

const pRegex = /<w:p[\s>](.*?)<\/w:p>/gs;
const rawParagraphs = [];
let match;
while ((match = pRegex.exec(xml)) !== null) rawParagraphs.push(match[1]);

const paragraphs = rawParagraphs.map(parseP).filter(p => p.fullText.length > 0 || p.imageIds.length > 0);

function isOptionP(p) {
    const t = p.fullText.trim();
    if (/[ⒶⒷⒸⒹ]/.test(t)) return true;
    if (p.runs.some(r => r.isAObjective && ['K','L','M','N'].includes(r.text.trim()))) return true;
    return false;
}

const blocks = [];
let currentQPs = [];
let currentOptPs = [];

for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const isOpt = isOptionP(p);
    if (isOpt) {
        currentOptPs.push(p);
    } else {
        if (currentOptPs.length > 0) {
            blocks.push({ qPs: currentQPs, optPs: currentOptPs });
            currentQPs = [];
            currentOptPs = [];
        }
        if (p.fullText.includes('welq: Z_¨ I †hvM‡hvM cÖhyw³') || p.fullText.includes('JAHID SIR ICT-SHEET')) continue;
        currentQPs.push(p);
    }
}
if (currentOptPs.length > 0) blocks.push({ qPs: currentQPs, optPs: currentOptPs });

console.log(`Parsed ${blocks.length} MCQ blocks from docx.`);

const ENGLISH_WORDS = [
    '10 BASE-2', '10 BASE-5', '10 BASE-T', '10 BASE-FL', '100 BASE-TX', '100 BASE-FX',
    '1000 BASE-SX', '1000 BASE-LX',
    'Twisted pair cable', 'optical fiber cable', 'Twisted pair', 'Shield Twisted Pair',
    'Unshielded Twisted Pair', 'optical fiber',
    'Radio wave', 'Microwave', 'Infrared', 'Bluetooth', 'Wi-Fi', 'WiFi', 'WiMAX',
    'Hotspot', 'Simplex', 'Half-duplex', 'Full-duplex',
    'Point-to-Point', 'Multipoint',
    'Unicast', 'Broadcast', 'Multicast',
    'bps', 'Kbps', 'kbps', 'Mbps', 'Gbps', 'Tbps', 'Bps',
    'RJ-45', 'RJ45', 'RJ-11', 'RJ11', 'BNC',
    'UTP', 'STP', 'STP/UTP', 'UTP/STP',
    'LAN', 'WAN', 'MAN', 'PAN', 'WLAN', 'SAN', 'CAN',
    'HUB', 'Switch', 'Router', 'Bridge', 'Gateway', 'Repeater', 'Modem', 'NIC',
    'LTE', 'MIMO', 'UMTS', 'WCDMA', 'CDMA', 'GSM', 'GPRS', 'EDGE', 'SIM', 'SMS',
    '3GPP', '4G', '5G', '3G', '2G', '1G', '4G/5G', '4K',
    'Group SMS', 'SMS',
    'IEEE 802.11', 'IEEE 802.15', 'IEEE 802.16', 'IEEE', 'ISO', 'OSI',
    'BSS', 'ESS', 'BSA', 'ESA', 'AP',
    'AM', 'FM', 'PM', 'FSK', 'PSK', 'ASK', 'QAM',
    'CAD', 'LISP', 'CSS', 'HTML', 'SQL', 'AI', 'ATM', 'GPS',
    'URL', 'IP', 'MAC', 'HTTP', 'HTTPS', 'FTP', 'TCP', 'UDP', 'VOIP',
    'FDDI', 'Star', 'Ring', 'Bus', 'Mesh', 'Tree', 'Hybrid',
    'n(n-1)/2', 'n(n+1)/2', 'n(2n-1)/2', 'n(2n+1)/2',
    'n(n - 1)/2', '(n - 1)/2', '(n - 1)'
];

function smartConvertRun(run) {
    if (run.isMath) return run.text;
    if (!run.text) return '';
    let text = run.text;

    // English fonts
    const isEnglishFont = ['Times New Roman', 'Algerian', 'Nirmala UI', 'Cambria Math', 'Arial', 'Calibri'].includes(run.font);
    if (isEnglishFont) {
        return text;
    }

    // Already Bengali Unicode
    const bnChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnChars > 0 && bnChars >= (text.replace(/\s+/g, '').length * 0.35)) {
        return text;
    }

    const puaMap = new Map();
    let puaIndex = 0;

    // 1. Math formulas like n(n-1)/2
    text = text.replace(/n\s*\(\s*n\s*[-+]\s*1\s*\)\s*\/\s*2/g, (m) => {
        const token = String.fromCharCode(0xE000 + (puaIndex++));
        puaMap.set(token, m);
        return token;
    });

    // 2. Roman numerals: ONLY i, ii, iii (HSC ICT never has iv, iv in Bijoy is 'রা' as in রাউটার, রাসেল, রা.বো.)
    text = text.replace(/(^|[\s\t\(\[])(i{1,3})([\.\)\,\s\t]|$)/g, (m, p1, roman, p2) => {
        const token = String.fromCharCode(0xE000 + (puaIndex++));
        puaMap.set(token, p1 + roman.toLowerCase() + p2);
        return token;
    });

    // 3. English keywords (exact case with safe lookaround boundaries)
    const sortedWords = [...ENGLISH_WORDS].sort((a, b) => b.length - a.length);
    const DELIM_PRE = '(?<=^|[\\s\\t\\(\\[\\{\\<\\>\\,\\.\\;\\:\\?\\!\\-\\+\\=\\*\\/\\\'\\"‘\\’“”])';
    const DELIM_POST = '(?=$|[\\s\\t\\)\\]\\}\\<\\>\\,\\.\\;\\:\\?\\!\\-\\+\\=\\*\\/\\\'\\"‘\\’“”])';

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

function convertParagraph(p) {
    return p.runs.map(r => smartConvertRun(r)).join('').trim();
}

function extractOptionsAndAnswer(optPs) {
    const allRuns = [];
    optPs.forEach(p => {
        p.runs.forEach(r => allRuns.push(r));
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
        }

        if (markerFound !== -1) {
            currentOpt = markerFound;
            if (run.isGreen) correctOpt = currentOpt;
            if (['K','L','M','N','Ⓐ','Ⓑ','Ⓒ','Ⓓ'].includes(t)) {
                continue;
            }
        }

        if (currentOpt >= 0) {
            const convertedPart = smartConvertRun(run);
            optTexts[currentOpt] += convertedPart;
            if (run.isGreen) correctOpt = currentOpt;
        }
    }

    const cleanOptions = optTexts.map(o => o.trim().replace(/^[\s\t\.\)\-]+/, '').trim());
    return { options: cleanOptions, correctIndex: correctOpt };
}

function parseBoard(text) {
    if (/সকল/i.test(text)) return 'সকল বোর্ড';
    const found = [];
    if (/(?:^|[\s\[,])দি(?:\.|\s|বো)|দিনাজপুর/i.test(text)) found.push('দিনাজপুর বোর্ড');
    if (/(?:^|[\s\[,])(?:ঢ|ঢা)(?:\.|\s|বো)|ঢাকা/i.test(text)) found.push('ঢাকা বোর্ড');
    if (/(?:^|[\s\[,])চ(?:\.|\s|বো)|চট্টগ্রাম|চট্ট/i.test(text)) found.push('চট্টগ্রাম বোর্ড');
    if (/(?:^|[\s\[,])কু(?:\.|\s|বো)|কুমিল্লা/i.test(text)) found.push('কুমিল্লা বোর্ড');
    if (/(?:^|[\s\[,])রা(?:\.|\s|বো)|রাজশাহী/i.test(text)) found.push('রাজশাহী বোর্ড');
    if (/(?:^|[\s\[,])য(?:\.|\s|বো)|যশোর/i.test(text)) found.push('যশোর বোর্ড');
    if (/(?:^|[\s\[,])সি(?:\.|\s|বো)|সিলেট/i.test(text)) found.push('সিলেট বোর্ড');
    if (/(?:^|[\s\[,])ম(?:\.|\s|বো)|ময়মনসিংহ/i.test(text)) found.push('ময়মনসিংহ বোর্ড');
    if (/(?:^|[\s\[,])মা(?:\.|\s|বো)|মাদ্রাসা/i.test(text)) found.push('মাদ্রাসা বোর্ড');
    if (/(?:^|[\s\[,])ব(?:\.|\s|বো)|বরিশাল/i.test(text)) found.push('বরিশাল বোর্ড');

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

async function uploadToDatabase() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    console.log('Connected to MongoDB.');

    const Mcq = mongoose.connection.collection('mcqs');

    // 1. Delete previous Chapter 2 dummy items
    const delRes = await Mcq.deleteMany({ chapter: { $regex: 'Chapter 2|কমিউনিকেশন', $options: 'i' } });
    console.log(`Deleted ${delRes.deletedCount} old Chapter 2 MCQ items.`);

    // 2. Prepare documents with stem inheritance
    const documents = [];
    let currentStemMeta = null;
    let stemRemaining = 0;

    for (let idx = 0; idx < blocks.length; idx++) {
        const b = blocks[idx];
        const qLines = b.qPs.map(p => convertParagraph(p)).filter(Boolean);
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

        const optRes = extractOptionsAndAnswer(b.optPs);
        const imagePath = IMAGE_MAPPING[idx] || '';

        const doc = {
            serialNo: idx + 1,
            categoryTypes: meta.categoryTypes,
            categoryType: meta.categoryType,
            chapter: 'Chapter 2: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং',
            collegeName: meta.collegeName,
            boardName: meta.boardName,
            examYear: meta.examYear,
            testPaperName: '',
            modelTestNo: '',
            question: fullQText,
            image: imagePath,
            options: optRes.options,
            correctAnswer: optRes.options[optRes.correctIndex] || optRes.options[0],
            explanation: '',
            createdAt: new Date()
        };
        documents.push(doc);
    }

    // 3. Insert documents
    const insertRes = await Mcq.insertMany(documents);
    console.log(`Successfully inserted ${insertRes.insertedCount} Chapter 2 MCQs into MongoDB!`);

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
