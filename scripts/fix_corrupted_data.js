const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const CQS_PATH = path.join(__dirname, '..', 'database', 'cqs.json');
const MCQS_PATH = path.join(__dirname, '..', 'database', 'mcqs.json');

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
    ['হল্তো', 'হলো'],
    ['শক্তিi', 'শক্তির'],
    ['শিল্পেi', 'শিল্পের'],
    ['শিক্ষাথীদেi', 'শিক্ষার্থীদের'],
    ['শরীiরে', 'শরীরে'],
    ['ক্রায়োসাজাির্র', 'ক্রায়োসার্জারিতে']
];

const ADVANCED_FIXES = [
    // Logic gate names in Bijoy
    [/\bঘঅঘউ\b/g, 'NAND'],
    [/ঘঅঘউ/g, 'NAND'],
    [/\bঘঙজ\b/g, 'NOR'],
    [/ঘঙজ/g, 'NOR'],
    [/\bঅঘউ\b/g, 'AND'],
    [/অঘউ/g, 'AND'],
    [/ঙজ(?=\s*গেইট|\s*গেট|\s*বর্তনী)/g, 'OR'],
    [/\bঙজ\b/g, 'OR'],
    [/\bঘঙঞ\b/g, 'NOT'],
    [/ঘঙঞ/g, 'NOT'],
    [/\bীঙজ\b/g, 'XOR'],
    [/ীঙজ/g, 'XOR'],
    [/\bীঘঙজ\b/g, 'XNOR'],
    [/ীঘঙজ/g, 'XNOR'],
    
    // Computer terms in Bijoy
    [/ইওঙঝ/g, 'BIOS'],
    [/অঝঈওও/g, 'ASCII'],
    [/অঝঈষষ/g, 'ASCII'],
    [/ঊBCDওঈ/g, 'EBCDIC'],
    [/টহরপড়ফব/g, 'Unicode'],
    [/যায়ুু/g, 'যায়—'],
    [/অBC₁₆/g, 'ABC₁₆'],
    [/ইঈউ/g, 'BCD'],
    [/ঊইঈউওঈ/g, 'EBCDIC'],
    [/ওঈঞ/g, 'ICT'],
    [/ওহঢ়ঁঃ/g, 'ইনপুট (Input)'],
    [/ঙঁঃঢ়ঁঃ/g, 'আউটপুট (Output)'],
    [/ঙঋঋ/g, 'OFF'],
    [/ঙঘ(?=\s*হিসেবে|\s*বা)/g, 'ON'],
    
    // ASCII full form Bijoy gibberish
    [/অসবৎরপধহ ঝঃধহফধৎফ ঈড়ফব ভড়ৎ ওহভড়ৎসধঃরড়হ ওহঃবৎপযধহমব/g, 'American Standard Code for Information Interchange'],
    
    // Corrupted base notations like (৫উ৭)১৬ or (২৬৭)থ১০
    [/\(৫উ৭\)১৬/g, '(5D7)₁₆'],
    [/\(৫উ৭\)/g, '(5D7)'],
    [/\(ঊ\)থ১৬/g, '(E)₁₆'],
    [/\(৭\)থ৮/g, '(7)₈'],
    [/\(১৮০০\)থ১০/g, '(1800)₁₀'],
    [/\(১৩৫৬\)থ৮/g, '(1356)₈'],
    [/\(২৬৭\)থ১০/g, '(267)₁₀'],
    [/\(১১০০১০\)থ২/g, '(110010)₂'],
    [/\(৬২\)থ৮/g, '(62)₈'],
    [/\(১১০১১০\)থ২/g, '(110110)₂'],
    [/\(৭৫০\)৮/g, '(750)₈'],
    [/\(৯৯৯\)১০/g, '(999)₁₀'],
    
    // Boolean expressions & variables
    [/æঢ”/g, '“X”'],
    [/æণ”/g, '“Y”'],
    [/æত”/g, '“Z”'],
    [/ঢ=¯অই\+ইঈ/g, 'X = ĀB + BC'],
    [/ণ=¯অই ঈ\+অইঈ\+অই\+ই¯ঈ/g, 'Y = ĀBC + ABC + AB + BC̄'],
    [/ঋ=¯অ ই\+¯ই ঈ/g, 'F = ĀB + B̄C'],
    [/২হ(?=\s*সংখ্যক)/g, '2ⁿ'],
    [/চছজ(?=\s*\n|\s*০)/g, 'P  Q  R\n'],
    [/অইঈঢ(?=\s*\n|\s*০)/g, 'A  B  C  D\n'],
    
    // Character artifacts
    [/বøক/g, 'ব্লক'],
    [/স¤পর্কে/g, 'সম্পর্কে'],
    [/ক¤িপউটার/g, 'কম্পিউটার'],
    [/ক¤িপউটারে/g, 'কম্পিউটারে'],
    [/¯েœহা/g, 'স্নেহা'],
    [/বিশ্লে¬ষণ/g, 'বিশ্লেষণ'],
    [/Ñ/g, '—'],
    [/রii\./g, 'iii.'],
    
    // Bijoy Hexadecimal letter conversions in Chapter 3
    [/ইঈ₁₆/g, 'BC₁₆'],
    [/ঋঋঋ₁₆/g, 'FFF₁₆'],
    [/৪উ₁₆/g, '4D₁₆'],
    [/১২অ৭ঈ₁₆/g, '12A7C₁₆'],
    [/৩উ₁₆/g, '3D₁₆'],
    [/অই₁₆/g, 'AB₁₆'],
    [/৯\.অ₁₆/g, '9.A₁₆'],
    [/ঋ₁₆/g, 'F₁₆'],
    [/অইঈ₁₆/g, 'ABC₁₆'],
    [/১ঋ₁₆/g, '1F₁₆'],
    [/ঢ₈/g, 'X₈'],
    [/৭₈থ/g, '7₈'],
    [/\(ু ৪২\)₁₀/g, '(- ৪২)₁₀'],
    [/হলোু/g, 'হলো—'],
    
    // Bijoy phrase conversions (Chapter 3)
    [/2-Gi cwic~iK/g, '[২-এর পরিপূরক]'],
    [/5 Gi 2 Gi cwicyiK KZ\?/g, '5 এর 2 এর পরিপূরক কত?'],
    [/11₁₀ Gi 2'S Compliment KZ\?/g, '11₁₀ এর 2\'s Compliment কত?'],
    [/17 Gi 2 Gi cwic~iK MVb Ki\|/g, '17 এর 2 এর পরিপূরক গঠন কর।'],
    [/64₁₀ Gi AKUvj gvb KZ\?/g, '64₁₀ এর অক্টাল মান কত?'],
    [/\(78\)₁₀ Gi BCD gvb KZ\?/g, '(78)₁₀ এর BCD মান কত?'],
    [/cwic~iK MVb/g, 'পরিপূরক গঠন'],
    [/cwic~iK/g, 'পরিপূরক'],
    [/cwicyiK/g, 'পরিপূরক'],
    
    // Fix logical operator in Ch 5 MCQ 4
    [/^\s*্‌\s*$/g, '&&']
];

function cleanAnyText(text) {
    if (!text || typeof text !== 'string') return text;
    let t = text;

    BIJOY_DICTIONARY.forEach(([bad, good]) => {
        t = t.split(bad).join(good);
    });

    wordReplacements.forEach(([bad, good]) => {
        t = t.split(bad).join(good);
    });

    ADVANCED_FIXES.forEach(([pattern, good]) => {
        t = t.replace(pattern, good);
    });

    // Fix remaining loose 'i' as 'র' before vowels
    t = t.replace(/([অ-হ])i([েোা]|\b)/g, '$1র$2');

    return t;
}

function cleanCQ(cq) {
    let changed = false;
    ['stem', 'q_ka', 'a_ka', 'q_kha', 'a_kha', 'q_ga', 'a_ga', 'q_gha', 'a_gha'].forEach(field => {
        if (cq[field]) {
            const oldVal = cq[field];
            const newVal = cleanAnyText(oldVal);
            if (oldVal !== newVal) {
                cq[field] = newVal;
                changed = true;
            }
        }
    });
    return changed;
}

function cleanMCQ(mcq) {
    let changed = false;
    if (mcq.question) {
        const oldVal = mcq.question;
        const newVal = cleanAnyText(oldVal);
        if (oldVal !== newVal) {
            mcq.question = newVal;
            changed = true;
        }
    }
    if (Array.isArray(mcq.options)) {
        const oldOpts = JSON.stringify(mcq.options);
        const newOpts = mcq.options.map(opt => {
            if (opt === '্‌') return '&&';
            return cleanAnyText(opt);
        });
        if (JSON.stringify(newOpts) !== oldOpts) {
            mcq.options = newOpts;
            changed = true;
        }
    }
    if (mcq.correctAnswer) {
        const oldVal = mcq.correctAnswer;
        const newVal = cleanAnyText(oldVal);
        if (oldVal !== newVal) {
            mcq.correctAnswer = newVal;
            changed = true;
        }
    }
    if (mcq.explanation) {
        const oldVal = mcq.explanation;
        const newVal = cleanAnyText(oldVal);
        if (oldVal !== newVal) {
            mcq.explanation = newVal;
            changed = true;
        }
    }
    return changed;
}

async function run() {
    console.log('Reading cqs.json and mcqs.json...');
    const cqs = JSON.parse(fs.readFileSync(CQS_PATH, 'utf8'));
    const mcqs = JSON.parse(fs.readFileSync(MCQS_PATH, 'utf8'));

    let cqsCleaned = 0;
    cqs.forEach(cq => {
        if (cleanCQ(cq)) cqsCleaned++;
    });

    let mcqsCleaned = 0;
    mcqs.forEach(mcq => {
        if (cleanMCQ(mcq)) mcqsCleaned++;
    });

    console.log(`Cleaned ${cqsCleaned} / ${cqs.length} CQs.`);
    console.log(`Cleaned ${mcqsCleaned} / ${mcqs.length} MCQs.`);

    // Write back to files
    fs.writeFileSync(CQS_PATH, JSON.stringify(cqs, null, 2), 'utf8');
    fs.writeFileSync(MCQS_PATH, JSON.stringify(mcqs, null, 2), 'utf8');
    console.log('Saved to cqs.json and mcqs.json.');

    // Sync to MongoDB if connected
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning', { serverSelectionTimeoutMS: 3000 });
        console.log('Connected to MongoDB. Syncing collections...');

        // Update CQs
        const CqModel = mongoose.models.CQ || mongoose.model('CQ', new mongoose.Schema({}, { strict: false, collection: 'cqs' }));
        for (const cq of cqs) {
            if (cq._id) {
                const id = cq._id;
                const updateData = { ...cq };
                delete updateData._id;
                await CqModel.updateOne({ _id: id }, { $set: updateData });
            }
        }
        console.log('MongoDB CQs updated.');

        // Update MCQs
        const McqModel = mongoose.models.MCQ || mongoose.model('MCQ', new mongoose.Schema({}, { strict: false, collection: 'mcqs' }));
        for (const mcq of mcqs) {
            if (mcq._id) {
                const id = mcq._id;
                const updateData = { ...mcq };
                delete updateData._id;
                await McqModel.updateOne({ _id: id }, { $set: updateData });
            }
        }
        console.log('MongoDB MCQs updated.');
        await mongoose.disconnect();
    } catch (dbErr) {
        console.warn('MongoDB sync skipped or failed:', dbErr.message);
    }

    console.log('Data cleaning completed successfully!');
}

run().catch(console.error);
