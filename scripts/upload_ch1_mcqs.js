const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const DOCX_XML = path.join(__dirname, '..', 'temp_docx_extract', 'word', 'document.xml');
const LOCAL_MCQS_JSON = path.join(__dirname, '..', 'database', 'mcqs.json');
const ONEDRIVE_MCQS_JSON = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

if (!fs.existsSync(DOCX_XML)) {
    console.error('Document XML not found at', DOCX_XML);
    process.exit(1);
}

const xml = fs.readFileSync(DOCX_XML, 'utf8');
const pRegex = /<w:p[\s>](.*?)<\/w:p>/gs;
const rawParagraphs = [];
let match;
while ((match = pRegex.exec(xml)) !== null) rawParagraphs.push(match[1]);

function parseP(pXml) {
    const rRegex = /<w:r[\s>](.*?)<\/w:r>/gs;
    let rMatch;
    let runs = [];
    while ((rMatch = rRegex.exec(pXml)) !== null) {
        const rXml = rMatch[1];
        const isGreen = /<w:highlight\s+w:val="green"/.test(rXml);
        const hasTab = /<w:tab\/>/.test(rXml);
        const tMatch = /<w:t[^>]*>(.*?)<\/w:t>/gs.exec(rXml);
        let text = tMatch ? tMatch[1] : '';
        if (hasTab) text = '\t' + text;
        const isAObjective = /w:ascii="A-Objective"/.test(rXml);
        runs.push({ text, isGreen, isAObjective });
    }
    return { fullText: runs.map(r => r.text).join('').trim(), runs };
}

const paragraphs = rawParagraphs.map(parseP).filter(p => p.fullText.length > 0);

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
        if (p.fullText.includes('welq: Z_¨ I †hvM‡hvM cÖhyw³') || p.fullText.includes('JAHID SIRICT-SHEET')) continue;
        currentQPs.push(p);
    }
}
if (currentOptPs.length > 0) blocks.push({ qPs: currentQPs, optPs: currentOptPs });

console.log(`Parsed ${blocks.length} MCQ blocks from docx.`);

const ENGLISH_WORDS = [
    'CAD', 'LISP', 'CSS', 'HTML', 'SQL', 'COBOL', 'ORACLE', 'PROLOG', 'PYTHON',
    'BASIC', 'FORTRAN', 'PASCAL', 'PAT', 'PLC', 'NAT', 'SWIFT', 'CNN', 'BBC',
    'BSS', 'ATM', 'POS', 'FDR', 'Bkash', 'B2C', 'C2B', 'B2G', 'B2B', 'C2C',
    'CIBIL', 'MUCR', 'MYCR', 'MRCR', 'MICR', 'RADAR', 'EVM', 'E-GP',
    'Q – cash', 'Q-cash', 'Q-Cash', 'ICT', 'UNESCO', 'IEEE', 'ISO', 'GSM', 'CDMA',
    'GPRS', 'EDGE', 'SIM', 'SMS', 'URL', 'IP', 'MAC', 'LAN', 'WAN', 'MAN', 'WIFI',
    'WI-FI', 'BLUETOOTH', 'HOTSPOT', 'HTTP', 'HTTPS', 'FTP', 'TCP', 'UDP', 'VOIP',
    'May 2012', 'May 2013', 'June 2012', 'June 2013', 'May', 'June',
    'Therapy Notes', 'Epic Care', 'Care 360', 'Therapy', 'Notes', 'Epic', 'Care',
    'Automated Teller Machine', 'Autonomous Teller Machine', 'Automated Teller Machinability',
    'Automated', 'Teller', 'Machine', 'Autonomous', 'Machinability',
    'Stock Exchange', 'Credit Agencies', 'Stock', 'Exchange', 'Banks', 'Credit', 'Agencies',
    'High Definition Multilanguage Interface', 'High Definition Multimedia Interface',
    'Highly Defined Multinational Integrity', 'Highly Defined Multimedia International',
    'High', 'Definition', 'Multimedia', 'Multilanguage', 'Multinational', 'Interface', 'Integrity', 'International',
    'Radio Detection And Range', 'Radio Detection And Ranging', 'Radio Decoding And Ranging',
    'Radio Detection Air Ranging', 'Radio', 'Detection', 'Ranging', 'Decoding', 'Range', 'Air',
    'Electrical Voting Management', 'Electronic Voting Machine', 'Electronic Voting Manual',
    'Electrical Voting Machine', 'Electrical', 'Electronic', 'Voting', 'Management', 'Manual',
    'Electric Government Procedure', 'Electronic Governmental Procedure', 'Electronic Government Procurement',
    'Electronic Grameen Phone', 'Electric', 'Government', 'Governmental', 'Procurement', 'Procedure', 'Grameen', 'Phone',
    'Twitter', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Intel', 'IBM', 'AI',
    'iii', 'ii', 'i'
];

function smartConvert(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();
    if (!text) return '';

    const bnChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
    if (bnChars > text.length * 0.45) {
        text = text.replace(/\[([^\]]+)\]/g, (match, inner) => {
            if (/[\u0980-\u09FF]/.test(inner)) return match;
            return '[' + convertBijoyToUnicode(inner) + ']';
        });
        return text;
    }

    const puaMap = new Map();
    let puaIndex = 0;
    const sortedWords = [...ENGLISH_WORDS].sort((a, b) => b.length - a.length);

    sortedWords.forEach(word => {
        const regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
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
            optTexts[currentOpt] += run.text;
            if (run.isGreen) correctOpt = currentOpt;
        }
    }

    const cleanOptions = optTexts.map(o => smartConvert(o.trim().replace(/^[\s\t\.\)\-]+/, '').trim()));
    return { options: cleanOptions, correctIndex: correctOpt };
}

function parseBoard(text) {
    if (/সকল/i.test(text)) return 'সকল বোর্ড';
    if (/(?:^|[\s\[])দি(?:\.|\s|বো)|দিনাজপুর/i.test(text)) return 'দিনাজপুর বোর্ড';
    if (/(?:^|[\s\[])ঢা(?:\.|\s|বো)|ঢাকা/i.test(text)) return 'ঢাকা বোর্ড';
    if (/(?:^|[\s\[])চ(?:\.|\s|বো)|চট্টগ্রাম|চট্ট/i.test(text)) return 'চট্টগ্রাম বোর্ড';
    if (/(?:^|[\s\[])কু(?:\.|\s|বো)|কুমিল্লা/i.test(text)) return 'কুমিল্লা বোর্ড';
    if (/(?:^|[\s\[])রা(?:\.|\s|বো)|রাজশাহী/i.test(text)) return 'রাজশাহী বোর্ড';
    if (/(?:^|[\s\[])য(?:\.|\s|বো)|যশোর/i.test(text)) return 'যশোর বোর্ড';
    if (/(?:^|[\s\[])সি(?:\.|\s|বো)|সিলেট/i.test(text)) return 'সিলেট বোর্ড';
    if (/(?:^|[\s\[])ম(?:\.|\s|বো)|ময়মনসিংহ/i.test(text)) return 'ময়মনসিংহ বোর্ড';
    if (/(?:^|[\s\[])মা(?:\.|\s|বো)|মাদ্রাসা/i.test(text)) return 'মাদ্রাসা বোর্ড';
    if (/(?:^|[\s\[])ব(?:\.|\s|বো)|বরিশাল/i.test(text)) return 'বরিশাল বোর্ড';
    return '';
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

async function uploadToDatabase() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    console.log('Connected to MongoDB.');

    const Mcq = mongoose.connection.collection('mcqs');

    // 1. Delete previous Chapter 1 dummy items
    const delRes = await Mcq.deleteMany({ chapter: { $regex: 'Chapter 1' } });
    console.log(`Deleted ${delRes.deletedCount} old Chapter 1 MCQ items.`);

    // 2. Prepare documents
    const documents = [];
    blocks.forEach((b, idx) => {
        const qLines = b.qPs.map(p => smartConvert(p.fullText)).filter(Boolean);
        const fullQText = qLines.join('\n');

        let tag = '';
        const m = fullQText.match(/\[([^\]]+)\]/);
        if (m) tag = m[1];

        const meta = parseMetadata(tag);
        const optRes = extractOptionsAndAnswer(b.optPs);

        const doc = {
            serialNo: idx + 1,
            categoryTypes: meta.categoryTypes,
            categoryType: meta.categoryType,
            chapter: 'Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)',
            collegeName: meta.collegeName,
            boardName: meta.boardName,
            examYear: meta.examYear,
            testPaperName: '',
            modelTestNo: '',
            question: fullQText,
            options: optRes.options,
            correctAnswer: optRes.options[optRes.correctIndex] || optRes.options[0],
            explanation: '',
            createdAt: new Date()
        };
        documents.push(doc);
    });

    // 3. Insert documents
    const insertRes = await Mcq.insertMany(documents);
    console.log(`Successfully inserted ${insertRes.insertedCount} Chapter 1 MCQs into MongoDB!`);

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
