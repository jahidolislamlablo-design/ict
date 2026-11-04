const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const LOCAL_MCQS_JSON = path.join(__dirname, '..', 'database', 'mcqs.json');
const ONEDRIVE_MCQS_JSON = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\mcqs.json';

// MongoDB Schema
const mcqSchema = new mongoose.Schema({
    serialNo: Number,
    categoryTypes: [String],
    categoryType: String,
    chapter: String,
    boardName: String,
    examYear: String,
    collegeName: String,
    testPaperName: String,
    modelTestNo: String,
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
}, { collection: 'mcqs' });

const MCQ = mongoose.models.MCQ || mongoose.model('MCQ', mcqSchema);

// Bijoy English dictionary
const BIJOY_DICTIONARY = [
    ['এবহবৎধষ গড়ভরবফ ঙৎমধহরংস', 'General Modified Organisms'],
    ['এবহবঃরপধষষু গড়ফরভরবফ ঙৎমধহরুধঃরড়হ', 'Genetically Modified Organization'],
    ['এবহবঃরপধষষু গড়ফবৎহ ঙৎমধহরংস', 'Genetically Modern Organisms'],
    ['এবহবঃরপধষষু গড়ফরভরবফ ঙৎমধহরংস', 'Genetically Modified Organisms'],
    ['ঠরৎঃঁধষ ৎবধষরঃু', 'Virtual Reality'],
    ['ঠরৎঃঁধষ জবধষরঃু', 'Virtual Reality'],
    ['ঘধহড়:বপযহড়ষড়মু', 'Nanotechnology'],
    ['ঘধহড়ঃবপযহড়ষড়মু', 'Nanotechnology'],
    ['এবহবঃরপ বহমরহববৎরহম', 'Genetic engineering'],
    ['এবহবঃরপ ঊহমরহববৎরহম', 'Genetic Engineering'],
    ['অৎঃরভরপরধষ রহঃবষষরমবহপব', 'Artificial intelligence'],
    ['ঔধপশ রিষষরধসংড়হ', 'Jack Williamson'],
    ['ঊ.পড়য', 'E.cohen'],
    ['চধঁষ ইবৎম', 'Paul Berg'],
    ['ঝঃধহষবু পড়যবহ', 'Stanley Cohen'],
    ['ঋরহমবৎ ঢ়ৎরহঃ', 'Finger print'],
    ['ঐধহফ এবড়সবঃৎু', 'Hand Geometry'],
    ['জবঃরহধ ঝপধহ', 'Retina Scan'],
    ['উঘঅ অহধষুংরং', 'DNA Analysis'],
    ['উঘঅ-এর', 'DNA-এর'],
    ['উঘঅগঠন', 'DNA গঠন'],
    ['উঘঅ', 'DNA'],
    ['ঐধহফ', 'Hand'],
    ['এবড়সবঃৎু', 'Geometry'],
    ['ঋধপব জবপড়মহরুব', 'Face Recognize'],
    ['ওৎরং জবঃরহধ', 'Iris Retina'],
    ['জউঘঅ', 'rDNA'],
    ['এগঙ', 'GMO'],
    ['ঊ.ঈড়ষর', 'E.Coli'],
    ['চংবঁফড়সড়হধং', 'Pseudomonas'],
    ['গধমহবঃরপ ওহশ ঈযবয়ঁব জবপড়মহরঃরড়হ', 'Magnetic Ink Cheque Recognition'],
    ['গধমহবঃরপ ওহভড়ৎসধঃরড়হ ঈযধৎধপঃবৎ জবপড়মহরঃরড়হ', 'Magnetic Information Character Recognition'],
    ['গধমহবঃরপ ওহশ ঈযধৎধপঃবৎ জবধষরুধঃরড়হ', 'Magnetic Ink Character Realization'],
    ['গধমহবঃরপ ওহশ ঈযধৎধপঃবৎ জবপড়মহরঃরড়হ', 'Magnetic Ink Character Recognition'],
    ['অঁঃড়সধঃরপ Teller Machine', 'Automatic Teller Machine'],
    ['অঁঃড়সধঃরপ', 'Automatic'],
    ['ঊ ু ৎবঃধরষষরহম', 'E-retailing'],
    ['ৎবঃধরষষরহম', 'retailing'],
    ['ঔঅঠঅ', 'JAVA'],
    ['ঈখওঝচ', 'CLISP'],
    ['অখমড়ষ', 'ALGOL'],
    ['ঋড়ৎঃৎধধহ', 'FORTRAN'],
    ['AI ঞবংঃ', 'AI Test'],
    ['ইরড়সবঃৎরপং ঞবংঃ', 'Biometrics Test'],
    ['ঞঁৎরহম ঞবংঃ', 'Turing Test'],
    ['ঞবংঃ-', 'Test-'],
    ['ঞবংঃ', 'Test'],
    ['জড়নড়ঃধ', 'Robota'],
    ['ঈটউঅ', 'CUDA'],
    ['গধঃষধন', 'Matlab'],
    ['এচঝ', 'GPS'],
    ['অপঃঁধঃড়ৎ', 'Actuator'],
    ['ইরড়রহভড়ৎসধঃরপং', 'Bioinformatics'],
    ['ইরড়সবঃৎরপ', 'Biometric'],
    ['ইরড়সবঃবৎরপং', 'Biometrics'],
    ['ইরড়সবঃবৎরী', 'Biometrics'],
    ['এষড়নধষ ঠরষষধমব', 'Global Village'],
    ['এষড়নধষ ারষষধমব', 'Global Village'],
    ['এষড়নধষ', 'Global'],
    ['ঠরষষধমব', 'Village'],
    ['ারষষধমব', 'Village'],
    ['ঊফঁপধঃরড়হ', 'Education'],
    ['ডবনবী', 'Webex'],
    ['ণধযড়ড়', 'Yahoo'],
    ['নধপশনড়হব', 'backbone'],
    ['এওঝ ু', 'GIS'],
    ['এওঝ', 'GIS'],
    ['ঈুনবৎ গড়হফধু', 'Cyber Monday'],
    ['ঐউগও', 'HDMI'],
    ['ঊ-মড়াবৎবহপব', 'E-governance'],
    ['মড়াবৎবহপব', 'governance'],
    ['্‌ধসঢ়;', ''],
    ['্ধসঢ়;', '']
];

const wordReplacements = [
    ['প্রশ্নেi', 'প্রশ্নের'],
    ['প্রশ্নোত্তi', 'প্রশ্নোত্তর'],
    ['উত্তi', 'উত্তর'],
    ['iয়েছে-', 'রয়েছে-'],
    ['iয়েছে', 'রয়েছে'],
    ['iেখে', 'রেখে'],
    ['iে', 'রে'],
    ['iুগীর', 'রোগীর'],
    ['iুই', 'রুই'],
    ['iপ্তানিকারক', 'রপ্তানিকারক'],
    ['iক্ষা', 'রক্ষা'],
    ['iক্ত', 'রক্ত'],
    ['কiেছেন', 'করেছেন'],
    ['কiেছে', 'করেছে'],
    ['কiে', 'করে'],
    ['করiে', 'করলে'],
    ['ব্যক্তিi', 'ব্যক্তির'],
    ['ব্যাক্তিi', 'ব্যক্তির'],
    ['স্বাক্ষi', 'স্বাক্ষর'],
    ['প্রযুক্তিi', 'প্রযুক্তির'],
    ['ক্যান্সাiiে', 'ক্যান্সারের'],
    ['ক্যান্সাiে', 'ক্যান্সারে'],
    ['ক্যান্সাi', 'ক্যান্সার'],
    ['আবিষ্কাiiে', 'আবিष्कारে'],
    ['আবিষ্কাiে', 'আবিष्कारে'],
    ['আবিষ্কাi', 'আবিष्कार'],
    ['কম্পিউটাiে', 'কম্পিউটারে'],
    ['কম্পিউটাi', 'কম্পিউটার'],
    ['কণ্ঠস্বi', 'কণ্ঠস্বর'],
    ['কন্ঠস্বi', 'কণ্ঠস্বর'],
    ['কর্মকতাের্দi', 'কর্মকর্তাদের'],
    ['কর্মকান্ডেi', 'কর্মকান্ডের'],
    ['কর্মচারীদেi', 'কর্মচারীদের'],
    ['কাজকর্মেi', 'কাজকর্মের'],
    ['কাদেiকে', 'কাদেরকে'],
    ['কাদেi', 'কাদের'],
    ['কার্ডেi', 'কার্ডের'],
    ['গবেষণাগাiে', 'গবেষণাগারে'],
    ['গুiুত্বপূর্ণ', 'গুরুত্বপূর্ণ'],
    ['গুiু', 'গুরু'],
    ['গৃহকমীর্i', 'গৃহকর্মীর'],
    ['ঘiে', 'ঘরে'],
    ['ঘুiে', 'ঘুরে'],
    ['ছাত্রদেi', 'ছাত্রদের'],
    ['জীববৈচির্ত্যেi', 'জীববৈচিত্র্যের'],
    ['জীববৈচিত্র্যi', 'জীববৈচিত্র্যের'],
    ['জীব বৈচির্ত্যেi', 'জীববৈচিত্র্যের'],
    ['টিস্যুi', 'টিস্যুর'],
    ['টেলিকনফাiেন্স', 'টেলিকনফারেন্স'],
    ['কনফাiেন্স', 'কনফারেন্স'],
    ['ভিডিওকনফাiেন্স', 'ভিডিওকনফারেন্স'],
    ['টেলিপ্রজেন্সেi', 'টেলিপ্রেজেন্সের'],
    ['টেলিপ্রেজেন্সেi', 'টেলিপ্রেজেন্সের'],
    ['ডিগ্রিi', 'ডিগ্রির'],
    ['তত্ত্বেi', 'তত্ত্বের'],
    ['তথ্যেi', 'তথ্যের'],
    ['তাদেi', 'তাদের'],
    ['দরবাiে', 'দরবারে'],
    ['দ্রব্যেi', 'দ্রব্যের'],
    ['নগiে', 'নগরে'],
    ['নম্বi', 'নম্বর'],
    ['নিজেদেi', 'নিজেদের'],
    ['নিম্নেi', 'নিম্নের'],
    ['নির্ভiযোগ্য', 'নির্ভরযোগ্য'],
    ['নির্ভi', 'নির্ভর'],
    ['পণ্যেi', 'পণ্যের'],
    ['পাiে-', 'পারে-'],
    ['পাiে', 'পারে'],
    ['পাi্তে', 'পারতে'],
    ['পূiণে', 'পূরণে'],
    ['পূর্ণiূপ', 'পূর্ণরূপ'],
    ['প্রজন্মেi', 'প্রজন্মের'],
    ['প্রাপ্তদেi', 'প্রাপ্তদের'],
    ['ফিiে', 'ফিরে'],
    ['বাজাiে', 'বাজারে'],
    ['বায়োইনফরমেটিক্সেi', 'বায়োইনফরমেটিক্সের'],
    ['বায়োইনফরমেট্রিক্সেi', 'বায়োইনফরমেট্রিক্সের'],
    ['বায়োমেট্রিক্সেi', 'বায়োমেট্রিক্সের'],
    ['বিক্রিi', 'বিক্রির'],
    ['বিচাiে', 'বিচারে'],
    ['বিলুপপ্তিi', 'বিলুপ্তির'],
    ['বিশ্বেi', 'বিশ্বের'],
    ['বৃদ্ধিi', 'বৃদ্ধির'],
    ['বৈচিত্রেi', 'বৈচিত্র্যের'],
    ['বৈচির্ত্যেi', 'বৈচিত্র্যের'],
    ['বৈশিষ্ট্যেi', 'বৈশিষ্ট্যের'],
    ['বৈশিস্ট্যেi', 'বৈশিষ্ট্যের'],
    ['ব্যবহাiiে', 'ব্যবহারের'],
    ['ব্যবহাiে-', 'ব্যবহারের-'],
    ['ব্যবহাiে', 'ব্যবহারের'],
    ['ভর্তিi', 'ভর্তির'],
    ['মস্তিষ্কেi', 'মস্তিষ্কের'],
    ['মাটিi', 'মাটির'],
    ['মানুষেi', 'মানুষের'],
    ['যন্ত্রেi', 'যন্ত্রের'],
    ['যোগাযোগেi', 'যোগাযোগের'],
    ['রোগীদেi', 'রোগীদের'],
    ['শাiীরিক', 'শারীরিক'],
    ['শিক্ষার্থীদেi', 'শিক্ষার্থীদের'],
    ['সবাi', 'সবার'],
    ['সফটওয়্যাi', 'সফটওয়্যার'],
    ['হাi্ডওয়্যাi', 'হার্ডওয়্যার'],
    ['সেবাi', 'সেবার'],
    ['স্বাস্থ্যেi', 'স্বাস্থ্যের'],
    ['স্মার্টকাi্ড', 'স্মার্টকার্ড'],
    ['কাi্ড', 'কার্ড'],
    ['নেমকাi্ড', 'নেমকার্ড'],
    ['হস্তান্তi', 'হস্তান্তর'],
    ['হাত-পাiে', 'হাত-পায়ের'],
    ['অন্যদেi', 'অন্যদের'],
    ['অন্যেi', 'অন্যের'],
    ['আকাiে', 'আকারে'],
    ['ইন্টেলিজেন্সেi', 'ইন্টেলিজেন্সের'],
    ['এক্স-iে', 'এক্স-রে'],
    ['এদেi', 'এদের'],
    ['ক্তi', 'রক্ত'],
    ['উলিস্নখিত', 'উল্লিখিত'],
    ['নিদির্ষ্ট', 'নির্দিষ্ট'],
    ['পাশ্বর্', 'পার্শ্ব'],
    ['কমীর্', 'কর্মী'],
    ['ফল্তে', 'ফলে'],
    ['হয়্ত', 'হয়'],
    ['হচ্চ্তে', 'হচ্ছে'],
    ['হল্তো', 'হলো']
];

function cleanChapter1Text(text) {
    if (!text) return '';

    // 1. Remove <: tags
    text = text.replace(/<:[^>]*>\s*(?=(?:ii|iii|iv)\b)/gi, '\n');
    text = text.replace(/<:[^>]*>\s*(?=নিচের কোনটি সঠিক)/gi, '\n');
    text = text.replace(/<:[^>]*>/g, '');

    // 2. Bijoy English dictionary
    BIJOY_DICTIONARY.forEach(([bad, good]) => {
        text = text.split(bad).join(good);
    });

    // 3. Fix ai -> ধ
    text = text.replace(/ai[নণ]ের/g, 'ধরনের');
    text = text.replace(/ai[নণ]ে/g, 'ধরনের');
    text = text.replace(/ai[নণ]/g, 'ধরন');
    text = text.replace(/অপরাaiে/g, 'অপরাধে');

    // 4. Fix 'I' used as 'ও'
    text = text.replace(/(^|[\s\t,])([ivx0-9১২৩৪৫৬৭৮৯০]+)\s+I\s+([ivx0-9১২৩৪৫৬৭৮৯০]+)([\s\t,.\?!]|$)/g, '$1$2 ও $3$4');
    text = text.replace(/(^|[\s\t,])i\s*,\s*ii\s+I\s+iii([\s\t,.\?!]|$)/gi, '$1i, ii ও iii$2');
    text = text.replace(/I\s*I\s*I\b/g, 'I');
    text = text.replace(/\bকiIে\b/g, 'করে');
    text = text.replace(/([অ-হ])\s+I\s+([অ-হ])/g, '$1 ও $2');

    // 5. Bengali words with 'i' as 'র'
    wordReplacements.forEach(([bad, good]) => {
        text = text.split(bad).join(good);
    });

    text = text.replace(/([অ-হ])i([েোা]|\b)/g, '$1র$2');

    return text.trim();
}

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    console.log('Connected to MongoDB.');

    const allMcqs = await MCQ.find().sort({ _id: 1 });
    console.log(`Fetched ${allMcqs.length} MCQs from MongoDB.`);

    let ch1Updated = 0;
    let ch2Updated = 0;
    let ch4Updated = 0;

    for (let doc of allMcqs) {
        let changed = false;

        // Chapter 1
        if (doc.chapter && doc.chapter.includes('1')) {
            const oldQ = doc.question;
            const newQ = cleanChapter1Text(oldQ);
            if (oldQ !== newQ) {
                doc.question = newQ;
                changed = true;
            }

            const oldOpts = doc.options || [];
            const newOpts = oldOpts.map(cleanChapter1Text);
            if (JSON.stringify(oldOpts) !== JSON.stringify(newOpts)) {
                doc.options = newOpts;
                changed = true;
            }

            if (doc.correctAnswer) {
                const oldAns = doc.correctAnswer;
                const newAns = cleanChapter1Text(oldAns);
                if (oldAns !== newAns) {
                    doc.correctAnswer = newAns;
                    changed = true;
                }
            }

            if (doc.explanation) {
                const oldExp = doc.explanation;
                const newExp = cleanChapter1Text(oldExp);
                if (oldExp !== newExp) {
                    doc.explanation = newExp;
                    changed = true;
                }
            }

            if (changed) ch1Updated++;
        }

        // Chapter 2
        else if (doc.chapter && doc.chapter.includes('2')) {
            // Check sheet header in Q1
            if (doc.question && doc.question.includes('JAHID SIRICT-SHEET')) {
                doc.question = doc.question.replace(/JAHID SIRICT-SHEET\r?\nকমিউনিকেশন সিস্টেম\r?\nপ্রশ্নপত্রে কোনো প্রকার দাগ\/চিহ্ন দেওয়া যাবে না।\r?\n/, '').trim();
                changed = true;
            }

            // Check 'হ' -> 'n' in options
            if (Array.isArray(doc.options)) {
                const newOpts = doc.options.map(opt => (opt === 'হ') ? 'n' : opt);
                if (JSON.stringify(doc.options) !== JSON.stringify(newOpts)) {
                    doc.options = newOpts;
                    changed = true;
                }
            }
            if (doc.correctAnswer === 'হ') {
                doc.correctAnswer = 'n';
                changed = true;
            }

            if (changed) ch2Updated++;
        }

        // Chapter 4
        else if (doc.chapter && doc.chapter.includes('4')) {
            if (doc.question && doc.question.includes('</html>কোডটিতে')) {
                doc.question = doc.question.replace('</html>কোডটিতে', '</html> কোডটিতে');
                changed = true;
            }
            if (changed) ch4Updated++;
        }

        if (changed) {
            await doc.save();
        }
    }

    console.log(`Updated in MongoDB: Ch1: ${ch1Updated}, Ch2: ${ch2Updated}, Ch4: ${ch4Updated}`);

    // Fetch refreshed list
    const refreshed = await MCQ.find().sort({ _id: 1 }).lean();
    console.log(`Writing ${refreshed.length} MCQs to local mcqs.json...`);
    fs.writeFileSync(LOCAL_MCQS_JSON, JSON.stringify(refreshed, null, 2), 'utf8');

    console.log(`Syncing to OneDrive mcqs.json...`);
    fs.writeFileSync(ONEDRIVE_MCQS_JSON, JSON.stringify(refreshed, null, 2), 'utf8');

    console.log('Database sync complete!');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
