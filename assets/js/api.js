/**
 * ICT EASY LEARNING - API & DATA SERVICE
 * Node.js Express & MongoDB Backend Integration
 * Supports both Localhost (http://localhost:5000) and Remote Cloud API (Render/Railway/ngrok)
 * Strict Filtering: Only returns data matching selected chapter, board, year, and categories.
 */

// ==========================================
// ১. ব্যাকএন্ড কনফিগারেশন ও API বেস URL নির্ধারণ
// ==========================================
const CONFIG = {
    // কাস্টম লাইভ ব্যাকএন্ড URL (যদি Render / Railway / ngrok এ ডেপ্লয় করা থাকে)
    LIVE_API_URL: localStorage.getItem('ICT_LIVE_API_URL') || '',

    // ডিফল্ট লোকালহোস্ট পোর্ট
    LOCAL_API_URL: 'http://localhost:5000',

    TIMEOUT: 6000
};

// বর্তমান পরিবেশ অনুযায়ী সঠিক API বেস URL নির্ণয়কারী হেল্পার
function getApiBaseUrl() {
    if (CONFIG.LIVE_API_URL && CONFIG.LIVE_API_URL.trim() !== '') {
        return CONFIG.LIVE_API_URL.trim().replace(/\/+$/, '');
    }

    // ১. ব্যাকএন্ড পোর্ট (৫০০০) থেকে যেকোনো ডিভাইসে (পিসি বা মোবাইল) ব্রাউজ করলে রিলেটিভ রুট '' ব্যবহার হবে
    if (window.location.port === '5000' || (window.location.origin && window.location.origin.includes(':5000'))) {
        return '';
    }

    const hostname = window.location.hostname;

    // ২. লোকালহোস্ট বা ১২৭.০.০.১ (যদি অন্য পোর্ট e.g. লাইভ সার্ভার ৫৫০০ থেকে ব্রাউজ করা হয়)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return CONFIG.LOCAL_API_URL;
    }

    // ৩. মোবাইল ফোন দিয়ে ওয়াইফাই বা লোকাল নেটওয়ার্কে পিসির আইপিতে ঢুকলে (e.g. 192.168.x.x, 10.x.x.x, 172.x.x.x)
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname)) {
        return `${window.location.protocol}//${hostname}:5000`;
    }

    // ৪. যদি কোনো লাইভ ডোমেইনে থাকে (GitHub Pages ব্যতীত)
    if (window.location.protocol.startsWith('http') && window.location.host && !window.location.host.includes('github.io')) {
        return `${window.location.protocol}//${window.location.host}`;
    }

    return CONFIG.LOCAL_API_URL;
}

// গ্লোবাল ভ্যারিয়েবল এক্সপোর্ট যাতে অন্যান্য স্ক্রিপ্ট (যেমন pdf-suggestion.js) সরাসরি পায়
window.BACKEND_URL = getApiBaseUrl();

// জেনেরিক ফেচ হেল্পার যা ব্যাকএন্ডের সাথে যোগাযোগ করে
async function fetchFromBackend(endpoint, options = {}) {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// ==========================================
// ২. ডাটা স্ট্রাকচার রূপান্তরকারী হেল্পার (Mappers)
// ==========================================

// MongoDB MCQ ডকুমেন্টকে ফ্রন্টএন্ড কার্ডের উপযোগী ফরম্যাটে রূপান্তর
function mapBackendMcqToFrontend(item) {
    if (!item) return null;
    const options = Array.isArray(item.options) ? item.options : [];

    let correctIndex = -1;
    if (item.correctAnswer !== undefined && item.correctAnswer !== null) {
        const ansStr = String(item.correctAnswer).trim();
        correctIndex = options.findIndex(opt => opt && opt.trim() === ansStr);

        if (correctIndex === -1) {
            const letterMap = {
                'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3,
                '1': 0, '2': 1, '3': 2, '4': 3,
                'a': 0, 'b': 1, 'c': 2, 'd': 3
            };
            const lowerAns = ansStr.toLowerCase();
            if (letterMap[lowerAns] !== undefined) {
                correctIndex = letterMap[lowerAns];
            } else {
                correctIndex = 0;
            }
        }
    } else {
        correctIndex = 0;
    }

    return {
        id: item._id,
        _id: item._id,
        question_text: item.question,
        question: item.question,
        options: options,
        correct_index: correctIndex,
        correct: correctIndex,
        explanation: item.explanation || '',
        image: item.image || '',
        serialNo: item.serialNo || 0,
        chapter: item.chapter || '',
        chapter_id: item.chapter ? (item.chapter.match(/\d+/) ? parseInt(item.chapter.match(/\d+/)[0]) : 1) : 1,
        board_id: item.boardName || '',
        board_name: item.boardName || '',
        year: item.examYear || '',
        college: item.collegeName || '',
        college_id: item.collegeName || '',
        category_types: item.categoryTypes || [item.categoryType || 'Chapter Practice'],
        category_type: item.categoryType || 'Chapter Practice'
    };
}

// MongoDB CQ ডকুমেন্টকে ফ্রন্টএন্ড সৃজনশীল কার্ডের উপযোগী ফরম্যাটে রূপান্তর
function mapBackendCqToFrontend(item) {
    if (!item) return null;
    return {
        id: item._id,
        _id: item._id,
        stem: item.stem || '',
        q_ka: item.q_ka || '',
        a_ka: item.a_ka || '',
        q_kha: item.q_kha || '',
        a_kha: item.a_kha || '',
        q_ga: item.q_ga || '',
        a_ga: item.a_ga || '',
        q_gha: item.q_gha || '',
        a_gha: item.a_gha || '',
        image: item.image || '',
        serialNo: item.serialNo || 0,
        chapter: item.chapter || '',
        board_name: item.boardName || '',
        year: item.examYear || '',
        college: item.collegeName || '',
        category_types: item.categoryTypes || [item.categoryType || 'Board Question'],
        category_type: item.categoryType || 'Board Question'
    };
}

// ==========================================
// ৩. MOCK DATA REPOSITORY (ফলব্যাক তথ্যভাণ্ডার)
// ==========================================
const MOCK_DATA = {
    chapters: [
        {
            id: 1,
            chapter_number: "১ম অধ্যায়",
            title: "তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত",
            short_desc: "ভার্চুয়াল রিয়েলিটি, কৃত্রিম বুদ্ধিমত্তা, বায়োমেট্রিক্স, ন্যানোটেকনোলজি",
            icon: "fa-earth-americas",
            color: "#4F46E5",
            total_mcq: 140,
            total_cq: 28,
            progress: 85
        },
        {
            id: 2,
            chapter_number: "২য় অধ্যায়",
            title: "কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং",
            short_desc: "ডাটা কমিউনিকেশন, নেটওয়ার্ক টপোলজি, ক্লাউড কম্পিউটিং, ওয়াইফাই/ওয়াইম্যাক্স",
            icon: "fa-network-wired",
            color: "#06B6D4",
            total_mcq: 165,
            total_cq: 32,
            progress: 70
        },
        {
            id: 3,
            chapter_number: "৩য় অধ্যায় (১ম অংশ)",
            title: "সংখ্যা পদ্ধতি (Number Systems)",
            short_desc: "বাইনারি, অক্টাল, ডেসিমেল, হেক্সাডেসিমেল রূপান্তর, ২ এর পরিপূরক",
            icon: "fa-calculator",
            color: "#8B5CF6",
            total_mcq: 180,
            total_cq: 35,
            progress: 90
        },
        {
            id: 4,
            chapter_number: "৩য় অধ্যায় (২য় অংশ)",
            title: "ডিজিটাল ডিভাইস ও লজিক গেট",
            short_desc: "মৌলিক ও যৌগিক লজিক গেট, বুলিয়ান অ্যালজেবরা, এনকোডার, ডিকোডার, অ্যাডার",
            icon: "fa-microchip",
            color: "#F59E0B",
            total_mcq: 155,
            total_cq: 30,
            progress: 60
        },
        {
            id: 5,
            chapter_number: "৪র্থ অধ্যায়",
            title: "ওয়েব ডিজাইন পরিচিতি এবং HTML",
            short_desc: "ওয়েবসাইটের কাঠামো, HTML ট্যাগ, টেবিল, ইমেজ, হাইপারলিংক, ফর্ম",
            icon: "fa-code",
            color: "#10B981",
            total_mcq: 175,
            total_cq: 26,
            progress: 95
        },
        {
            id: 6,
            chapter_number: "৫ম অধ্যায়",
            title: "প্রোগ্রামিং ভাষা (C Programming)",
            short_desc: "অ্যালগরিদম, ফ্লোচার্ট, সি প্রোগ্রামিং সিনট্যাক্স, লুপ, অ্যারে, ফাংশন",
            icon: "fa-laptop-code",
            color: "#EF4444",
            total_mcq: 210,
            total_cq: 40,
            progress: 50
        },
        {
            id: 7,
            chapter_number: "৬ষ্ঠ অধ্যায়",
            title: "ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
            short_desc: "রিলেশনাল ডাটাবেজ, প্রাইমারি কী, এসকিউএল (SQL), কুয়েরি ও রিপোর্ট",
            icon: "fa-database",
            color: "#EC4899",
            total_mcq: 120,
            total_cq: 22,
            progress: 40
        }
    ],

    boards: [
        { id: "dhaka", name: "ঢাকা বোর্ড (DHAKA BOARD)", code: "DB", icon: "fa-building-columns" },
        { id: "rajshahi", name: "রাজশাহী বোর্ড (RAJSHAHI BOARD)", code: "RB", icon: "fa-building-columns" },
        { id: "chattogram", name: "চট্টগ্রাম বোর্ড (CHATTOGRAM BOARD)", code: "CB", icon: "fa-building-columns" },
        { id: "jashore", name: "যশোর বোর্ড (JASHORE BOARD)", code: "JB", icon: "fa-building-columns" },
        { id: "comilla", name: "কুমিল্লা বোর্ড (COMILLA BOARD)", code: "CUB", icon: "fa-building-columns" },
        { id: "sylhet", name: "সিলেট বোর্ড (SYLHET BOARD)", code: "SB", icon: "fa-building-columns" },
        { id: "barishal", name: "বরিশাল বোর্ড (BARISHAL BOARD)", code: "BB", icon: "fa-building-columns" },
        { id: "dinajpur", name: "দিনাজপুর বোর্ড (DINAJPUR BOARD)", code: "DNB", icon: "fa-building-columns" },
        { id: "mymensingh", name: "ময়মনসিংহ বোর্ড (MYMENSINGH BOARD)", code: "MB", icon: "fa-building-columns" },
        { id: "madrasah", name: "মাদ্রাসা বোর্ড (MADRASAH BOARD)", code: "MDB", icon: "fa-mosque" }
    ],

    years: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"],

    colleges: [
        { id: "ndc", name: "নটর ডেম কলেজ, ঢাকা", district: "ঢাকা", total_tests: 12 },
        { id: "vnsc", name: "ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ", district: "ঢাকা", total_tests: 10 },
        { id: "rajuk", name: "রাজউক উত্তরা মডেল কলেজ", district: "ঢাকা", total_tests: 10 },
        { id: "drmc", name: "ঢাকা রেসিডেনসিয়াল মডেল কলেজ", district: "ঢাকা", total_tests: 8 },
        { id: "dc", name: "ঢাকা সিটি কলেজ", district: "ঢাকা", total_tests: 8 },
        { id: "ctg_college", name: "চট্টগ্রাম কলেজ, চট্টগ্রাম", district: "চট্টগ্রাম", total_tests: 7 },
        { id: "raj_college", name: "রাজশাহী কলেজ, রাজশাহী", district: "রাজশাহী", total_tests: 7 },
        { id: "cpc", name: "ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজ", district: "রংপুর", total_tests: 6 }
    ],

    modelTests: [
        {
            id: "mt-01",
            title: "পূর্ণাঙ্গ চূড়ান্ত মডেল টেস্ট - ০১",
            type: "full",
            badge: "Full Syllabus",
            questions_count: 25,
            duration: 25,
            marks: 25,
            negative_marking: 0.25,
            participants: 1420
        },
        {
            id: "mt-02",
            title: "পূর্ণাঙ্গ চূড়ান্ত মডেল টেস্ট - ০২",
            type: "full",
            badge: "Full Syllabus",
            questions_count: 25,
            duration: 25,
            marks: 25,
            negative_marking: 0.25,
            participants: 980
        }
    ],

    questions: [
        {
            id: 1,
            question_text: "বাইনারি সংখ্যা পদ্ধতি (1101)₂ এর দশমিকে মান কত?",
            options: ["11", "12", "13", "15"],
            correct_index: 2,
            explanation: "1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13",
            chapter_id: 3,
            board_id: "dhaka",
            year: "2024"
        },
        {
            id: 2,
            question_text: "কোন লজিক গেইটটি ইনভার্টার (Inverter) হিসেবে কাজ করে?",
            options: ["AND Gate", "OR Gate", "NOT Gate", "NAND Gate"],
            correct_index: 2,
            explanation: "NOT গেইটে একটি ইনপুট থাকে এবং এটি ইনপুটকে উল্টে দেয়।",
            chapter_id: 3,
            board_id: "dhaka",
            year: "2024"
        },
        {
            id: 3,
            question_text: "HTML-এ হাইপারলিংক তৈরি করার জন্য কোন ট্যাগ ব্যবহার করা হয়?",
            options: ["<link>", "<a>", "<href>", "<hyperlink>"],
            correct_index: 1,
            explanation: "<a> (Anchor) ট্যাগের সাহায্যে ওয়েবপেজে লিঙ্ক যুক্ত করা হয়।",
            chapter_id: 4,
            board_id: "dhaka",
            year: "2024"
        },
        {
            id: 4,
            question_text: "C ভাষায় হেডার ফাইল যুক্ত করার সঠিক সিনট্যাক্স কোনটি?",
            options: ["#include <stdio.h>", "#import <stdio.h>", "using namespace std;", "import stdio.h;"],
            correct_index: 0,
            explanation: "C ল্যাঙ্গুয়েজে প্রিপ্রসেসর ডিরেক্টিভ #include দিয়ে হেডার ফাইল যুক্ত করা হয়।",
            chapter_id: 5,
            board_id: "dhaka",
            year: "2024"
        }
    ],

    pdfSuggestions: [
        {
            _id: "6adfa36938626371f01e28b3",
            id: "6adfa36938626371f01e28b3",
            title: "apps  + fb content  jahid sir ict full 4th chepter mcq",
            category: "suggestion",
            chapter: "৪র্থ অধ্যায়",
            description: "৪র্থ অধ্যায়ের গুরুত্বপূর্ণ MCQ ও ব্যাখ্যাসহ সমাধান শিট",
            pdfUrl: "/uploads/pdfs/1793041257178-874160668-apps____fb_content__jahid_sir_ict_full_4th_chepter_mcq.pdf",
            originalFileName: "apps  + fb content  jahid sir ict full 4th chepter mcq.pdf",
            fileSize: "0.6 MB",
            pagesCount: "১৫ পৃষ্ঠা",
            downloadsCount: 14
        },
        {
            _id: "6adfa25d38626371f01e28b2",
            id: "6adfa25d38626371f01e28b2",
            title: "Citi Coachig - স্পেশাল আইসিটি মডেল প্রশ্ন",
            category: "suggestion",
            chapter: "সকল অধ্যায়",
            description: "সিটি কোচিং এর বিশেষ মডেল প্রশ্ন ও ফাইনাল রিভিশন শিট",
            pdfUrl: "/uploads/pdfs/1793040989662-300337963-Citi_Coachig.pdf",
            originalFileName: "Citi Coachig.pdf",
            fileSize: "0.1 MB",
            pagesCount: "১৫ পৃষ্ঠা",
            downloadsCount: 8
        },
        {
            _id: "6adfa21b38626371f01e28b1",
            id: "6adfa21b38626371f01e28b1",
            title: "3rd chapter 2nd part exam - ডিজিটাল ডিভাইস ও লজিক গেট",
            category: "suggestion",
            chapter: "৩য় অধ্যায়",
            description: "৩য় অধ্যায় ২য় অংশ (ডিজিটাল ডিভাইস ও লজিক গেট) পরীক্ষার প্রশ্ন ও উত্তরমালা",
            pdfUrl: "/uploads/pdfs/1793040923787-720132605-3rd_chapter_2nd_part_exam.pdf",
            originalFileName: "3rd chapter 2nd part exam.pdf",
            fileSize: "0.3 MB",
            pagesCount: "১৫ পৃষ্ঠা",
            downloadsCount: 26
        },
        {
            _id: "6adf92a538626371f01e28b0",
            id: "6adf92a538626371f01e28b0",
            title: "HSC ICT 2026 Exam MCQ Suggestion 1st  Chapter",
            category: "suggestion",
            chapter: "১ম অধ্যায়",
            description: "এইচএসসি ২০২৬ এর ১ম অধ্যায় (বিশ্ব ও বাংলাদেশ প্রেক্ষিত) শতভাগ কমন MCQ সুপার সাজেশন",
            pdfUrl: "/uploads/pdfs/1793036965027-516918355-HSC_ICT_2026_Exam_MCQ_Suggestion_1st__Chapter_.pdf",
            originalFileName: "HSC ICT 2026 Exam MCQ Suggestion 1st  Chapter .pdf",
            fileSize: "0.8 MB",
            pagesCount: "১৫ পৃষ্ঠা",
            downloadsCount: 45
        }
    ],

    userProfile: {
        name: "শিক্ষার্থী",
        role: "HSC পরীক্ষার্থী",
        college: "নটর ডেম কলেজ, ঢাকা",
        hsc_batch: "HSC 2026",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        stats: {
            completed_tests: 18,
            average_score: 86.5,
            total_solved: 485,
            study_streak_days: 14,
            rank: 42
        }
    }
};

// ==========================================
// ৪. API SERVICE METHODS (সঠিক ফিল্টারিং সহ)
// ==========================================

// ==========================================
// স্ট্যাটিক JSON ডাটা ফেচ হেল্পার (GitHub Pages ও অফলাইন মোড)
// ==========================================
let _staticCache = {};
async function fetchStaticJson(filename) {
    if (_staticCache[filename]) return _staticCache[filename];
    try {
        const isPages = window.location.pathname.includes('/pages/');
        const staticUrl = isPages ? `../database/${filename}` : `database/${filename}`;
        const res = await fetch(staticUrl);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                _staticCache[filename] = data;
                return data;
            }
        }
    } catch (e) {
        console.warn(`Could not load ${filename}:`, e.message);
    }
    return [];
}


function resolveMediaUrl(rawUrl) {
    if (!rawUrl) return '';
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    if (window.location.port === '5000') {
        return rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl;
    }
    const clean = rawUrl.replace(/^\/+/, '');
    const inPages = window.location.pathname.includes('/pages/');
    return inPages ? `../${clean}` : clean;
}

function matchCollegeName(storedName, targetName) {
    if (!storedName || !targetName) return true;
    const a = storedName.toLowerCase();
    const b = targetName.toLowerCase();
    if (a.includes(b) || b.includes(a)) return true;

    const groups = [
        ['notre dame', 'নটর ডেম', 'ndc'],
        ['viqarunnisa', 'ভিকারুননিসা', 'vnsc'],
        ['rajuk', 'রাজউক'],
        ['residential', 'রেসিডেনসিয়াল', 'drmc'],
        ['dhaka college', 'ঢাকা কলেজ'],
        ['city college', 'সিটি কলেজ', 'dcc'],
        ['chattogram', 'chittagong', 'চট্টগ্রাম', 'ctg'],
        ['rajshahi', 'রাজশাহী'],
        ['cantonment', 'ক্যান্টনমেন্ট', 'cpsc'],
        ['ideal', 'আইডিয়াল'],
        ['mohsin', 'মহসিন'],
        ['victoria', 'ভিক্টোরিয়া'],
        ['mc college', 'এম সি কলেজ', 'এমসি কলেজ'],
        ['bm college', 'বিএম কলেজ', 'বি এম কলেজ'],
        ['ananda mohan', 'আনন্দ মোহন']
    ];

    for (const grp of groups) {
        const matchA = grp.some(term => a.includes(term));
        const matchB = grp.some(term => b.includes(term));
        if (matchA && matchB) return true;
    }
    return false;
}

function hasCategory(item, catName) {
    if (!item) return false;
    if (Array.isArray(item.categoryTypes) && item.categoryTypes.includes(catName)) return true;
    if (item.categoryType === catName) return true;
    return false;
}

function matchesChapter(itemChapter, chapterId) {
    if (!itemChapter || chapterId === undefined || chapterId === null || chapterId === 'all') return true;
    const ic = String(itemChapter).toLowerCase();
    const ch = String(chapterId).toLowerCase().trim();

    if (ic.includes(ch)) return true;

    if (ch === '3.1' || ch.includes('১ম অংশ') || ch.includes('সংখ্যা পদ্ধতি')) {
        return ic.includes('3.1') || ic.includes('১ম অংশ') || ic.includes('সংখ্যা পদ্ধতি') || 
               (ic.includes('3') && !ic.includes('ডিজিটাল ডিভাইস') && !ic.includes('২য় অংশ') && !ic.includes('লজিক গেট'));
    }
    if (ch === '3.2' || ch.includes('২য় অংশ') || ch.includes('ডিজিটাল ডিভাইস') || ch.includes('লজিক গেট')) {
        return ic.includes('3.2') || ic.includes('২য় অংশ') || ic.includes('ডিজিটাল ডিভাইস') || ic.includes('লজিক গেট');
    }

    const banglaToEng = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
    const toEngNum = (s) => String(s).replace(/[০-৯]/g, d => banglaToEng[d]);

    const icNum = (toEngNum(ic).match(/\b([1-6])\b/) || [])[1];
    const chNum = (toEngNum(ch).match(/\b([1-6])\b/) || [])[1];

    if (icNum && chNum && icNum === chNum) return true;

    return false;
}

const ApiService = {
    async getChapters() {
        return Promise.resolve(MOCK_DATA.chapters);
    },

    async getBoards() {
        return Promise.resolve(MOCK_DATA.boards);
    },

    async getYears() {
        return Promise.resolve(MOCK_DATA.years);
    },

    async getModelTests() {
        return Promise.resolve(MOCK_DATA.modelTests);
    },

    async getPdfSuggestions() {
        return Promise.resolve(MOCK_DATA.pdfSuggestions);
    },

    // ১. বোর্ড প্রশ্ন লোড (MCQ)
    async getBoardMCQ(boardCode, year) {
        try {
            let endpoint = '/api/mcqs?categoryType=Board Question';
            if (boardCode && boardCode !== 'all') {
                endpoint += `&boardName=${encodeURIComponent(boardCode)}`;
            }
            if (year) {
                endpoint += `&examYear=${encodeURIComponent(year)}`;
            }

            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'Board Question')) return false;
                if (boardCode && boardCode !== 'all') {
                    const b = (item.boardName || '').toLowerCase();
                    if (!b.includes(boardCode.toLowerCase())) return false;
                }
                if (year) {
                    if (String(item.examYear) !== String(year)) return false;
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }

        return MOCK_DATA.questions.filter(q => {
            const matchBoard = !boardCode || q.board_id === boardCode;
            const matchYear = !year || q.year === year;
            return matchBoard && matchYear;
        });
    },

    // ২. বোর্ড সৃজনশীল প্রশ্ন লোড (CQ)
    async getBoardCQ(boardCode, year) {
        try {
            let endpoint = '/api/cqs?categoryType=Board Question';
            if (boardCode && boardCode !== 'all') {
                endpoint += `&boardName=${encodeURIComponent(boardCode)}`;
            }
            if (year) {
                endpoint += `&examYear=${encodeURIComponent(year)}`;
            }

            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendCqToFrontend);
            }
        } catch (e) {}

        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            const filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'Board Question')) return false;
                if (boardCode && boardCode !== 'all') {
                    const b = (item.boardName || '').toLowerCase();
                    if (!b.includes(boardCode.toLowerCase())) return false;
                }
                if (year) {
                    if (String(item.examYear) !== String(year)) return false;
                }
                return true;
            });
            return filtered.map(mapBackendCqToFrontend);
        }
        return [];
    },

    // ৩. মডেল টেস্ট MCQ
    async getModelTestMCQ(testIdentifier) {
        let testKey = testIdentifier;
        const match = testIdentifier.match(/(?:Model Test\s*|মডেল টেস্ট\s*[-–]?\s*)(\d+)/i);
        if (match) {
            const n = parseInt(match[1], 10);
            const numStr = n < 10 ? '0' + n : '' + n;
            testKey = 'Model Test ' + numStr;
        }

        try {
            const query = `/api/mcqs?categoryType=Model Test&modelTestNo=${encodeURIComponent(testKey)}`;
            const res = await fetchFromBackend(query);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'Model Test')) return false;
                if (testKey && item.modelTestNo) {
                    return item.modelTestNo.toLowerCase().includes(testKey.toLowerCase());
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }
        return [];
    },

    // ৪. সকল PDF লোড
    async getAllPDFs(category = 'all', chapter = '') {
        try {
            let url = '/api/pdfs?';
            if (category && category !== 'all') url += `category=${encodeURIComponent(category)}&`;
            if (chapter && chapter !== 'all') url += `chapter=${encodeURIComponent(chapter)}&`;
            
            const res = await fetchFromBackend(url);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data;
            }
        } catch (e) {}

        const allPdfs = await fetchStaticJson('pdfs.json');
        if (allPdfs.length > 0) {
            let filtered = allPdfs;
            if (category && category !== 'all') {
                filtered = filtered.filter(p => p.category === category);
            }
            if (chapter && chapter !== 'all') {
                filtered = filtered.filter(p => p.chapter && p.chapter.includes(chapter));
            }
            return filtered;
        }

        let list = (MOCK_DATA && Array.isArray(MOCK_DATA.pdfSuggestions)) ? [...MOCK_DATA.pdfSuggestions] : [];
        if (category && category !== 'all') list = list.filter(p => p.category === category);
        if (chapter && chapter !== 'all') list = list.filter(p => p.chapter && p.chapter.includes(chapter));
        return list;
    },

    async recordPdfDownload(pdfId) {
        try {
            await fetchFromBackend(`/api/pdfs/${pdfId}/download`, { method: 'POST' });
        } catch (e) {}
    },

    // ৫. অধ্যায়ভিত্তিক MCQ
    async getChapterMCQ(chapterId) {
        try {
            const endpoint = `/api/mcqs?categoryType=Chapter Practice&chapter=${encodeURIComponent(chapterId)}`;
            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'Chapter Practice')) return false;
                return matchesChapter(item.chapter, chapterId);
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }

        return MOCK_DATA.questions.filter(q => q.chapter_id == chapterId);
    },

    // ৬. অধ্যায়ভিত্তিক CQ
    async getChapterCQ(chapterId) {
        try {
            const endpoint = `/api/cqs?categoryType=Chapter Practice&chapter=${encodeURIComponent(chapterId)}`;
            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendCqToFrontend);
            }
        } catch (e) {}

        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            const filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'Chapter Practice')) return false;
                return matchesChapter(item.chapter, chapterId);
            });
            return filtered.map(mapBackendCqToFrontend);
        }
        return [];
    },

    // ৭. টেস্ট পেপার / কলেজ ভিত্তিক CQ
    async getCollegeCQ(collegeId) {
        try {
            let endpoint = `/api/cqs?categoryType=College Test Paper`;
            if (collegeId) endpoint += `&collegeName=${encodeURIComponent(collegeId)}`;

            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendCqToFrontend);
            }
        } catch (e) {}

        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            const filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            return filtered.map(mapBackendCqToFrontend);
        }
        return [];
    },

    // ৮. টেস্ট পেপার / কলেজ ভিত্তিক MCQ
    async getCollegeMCQ(collegeId) {
        try {
            let endpoint = `/api/mcqs?categoryType=College Test Paper`;
            if (collegeId) endpoint += `&collegeName=${encodeURIComponent(collegeId)}`;

            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }
        return [];
    },

    // ৯. সকল MCQ লোড
    async getAllMCQ() {
        try {
            const res = await fetchFromBackend('/api/mcqs');
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            return allMcqs.map(mapBackendMcqToFrontend);
        }
        return MOCK_DATA.questions;
    },

    async getUserProfile() {
        return Promise.resolve(MOCK_DATA.userProfile);
    },

    async saveExamResult(resultData) {
        try {
            const res = await fetchFromBackend('/api/results', {
                method: 'POST',
                body: JSON.stringify(resultData)
            });
            return res;
        } catch (e) {
            return { success: false };
        }
    }
};


// ==========================================
// ৫. UNIVERSAL RENDERING FUNCTIONS (MODERN MCQ, CQ & MODEL TEST)
// Matching User Reference Screenshots
// ==========================================

function toBanglaNum(num) {
    if (num === null || num === undefined) return '';
    const banglaDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    return num.toString().replace(/\d/g, d => banglaDigits[d] || d);
}

function renderModernMCQCardHTML(q, index, options = {}) {
    const qNum = toBanglaNum(index + 1);
    const markers = ['ক', 'খ', 'গ', 'ঘ'];
    
    let opts = q.options;
    if (typeof opts === 'string') {
        try { opts = JSON.parse(opts); } catch(e) { opts = []; }
    }
    if (!Array.isArray(opts)) opts = [];

    const correctIndex = parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0;
    const mode = options.mode || 'study'; // 'study' or 'exam'
    const qText = q.question_text || q.question || '';
    const explanation = q.explanation || '';
    
    const imageHtml = q.image ? `
        <div class="question-image-box" style="margin: 12px 0 16px 0; text-align: center;">
            <img src="${resolveMediaUrl(q.image)}" alt="প্রশ্ন চিত্র" style="max-width: 100%; max-height: 320px; border-radius: 12px; border: 1px solid #E2E8F0; object-fit: contain;">
        </div>
    ` : '';
    const contextHtml = q.context_stem ? `<div class="question-stem" style="background:#F1F5F9; padding:12px 16px; border-radius:12px; margin-bottom:14px; font-size:0.95rem; border-left:4px solid var(--primary); line-height: 1.6;">${q.context_stem}</div>` : '';

    let optionsHtml = '';
    opts.forEach((optText, oIdx) => {
        const marker = markers[oIdx] || (oIdx + 1);
        optionsHtml += `
            <div class="modern-option-pill" data-opt-idx="${oIdx}" onclick="handleModernOptionClick(this, ${index}, ${oIdx}, ${correctIndex}, '${mode}')">
                <div class="modern-option-pill-left">
                    <span class="option-radio-circle"></span>
                    <span class="option-text"><strong>${marker}.</strong> ${optText}</span>
                </div>
                <span class="modern-status-icon"></span>
            </div>
        `;
    });

    const expBtnAndBox = (mode === 'exam') ? `
        <div class="modern-exp-box" style="display: none;">
            <div style="font-weight: 700; color: #4338CA; margin-bottom: 6px;"><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</div>
            <p style="margin: 0; line-height: 1.6;">${explanation || 'কোনো ব্যাখ্যা দেওয়া নেই।'}</p>
        </div>
    ` : `
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 8px;">
            <button type="button" class="modern-exp-btn" onclick="toggleModernExp(this)">
                <i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন
            </button>
            <div class="modern-exp-box">
                <div style="font-weight: 700; color: #4338CA; margin-bottom: 6px;"><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</div>
                <p style="margin: 0; line-height: 1.6;">${explanation || 'কোনো ব্যাখ্যা দেওয়া নেই।'}</p>
            </div>
        </div>
    `;

    return `
        <div class="modern-quiz-card" id="modern-mcq-card-${index}" data-q-index="${index}" data-correct-index="${correctIndex}">
            ${contextHtml}
            <div class="modern-quiz-header">
                <h3 class="modern-q-title">${qNum}. ${qText}</h3>
            </div>
            ${imageHtml}
            <div class="modern-options-list">
                ${optionsHtml}
            </div>
            ${expBtnAndBox}
        </div>
    `;
}

function renderModernCQCardHTML(cq, index) {
    const cleanQ = (text, prefix) => {
        if (!text) return '';
        return text.replace(new RegExp('^\\s*\\(' + prefix + '\\)\\s*'), '').trim();
    };
    const qNum = toBanglaNum(index + 1);

    return `
        <div class="modern-cq-card" style="margin-bottom: 24px;">
            <div class="modern-cq-stem-box">
                <div style="font-weight: 700; color: #4F46E5; margin-bottom: 8px;">
                    <i class="fa-solid fa-feather-pointed"></i> উদ্দীপক-${qNum}:
                </div>
                <p style="margin: 0; line-height: 1.7; font-size: 1rem; color: #1E293B;">${cq.stem}</p>
                ${cq.image ? `
                    <div style="margin: 14px 0 10px 0; text-align: center;">
                        <img src="${resolveMediaUrl(cq.image)}" alt="উদ্দীপক চিত্র" style="max-width: 100%; max-height: 380px; border-radius: 12px; border: 1px solid #E2E8F0; object-fit: contain;">
                    </div>
                ` : ''}
            </div>

            <div class="modern-cq-sub-questions">
                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(ক)</strong> ${cleanQ(cq.q_ka, "ক")} <span style="color:#6366F1; font-size:0.85rem; font-weight:600;">[মান: ১]</span></span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_ka, "ক") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(খ)</strong> ${cleanQ(cq.q_kha, "খ")} <span style="color:#6366F1; font-size:0.85rem; font-weight:600;">[মান: ২]</span></span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_kha, "খ") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(গ)</strong> ${cleanQ(cq.q_ga, "গ")} <span style="color:#6366F1; font-size:0.85rem; font-weight:600;">[মান: ৩]</span></span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_ga, "গ") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(ঘ)</strong> ${cleanQ(cq.q_gha, "ঘ")} <span style="color:#6366F1; font-size:0.85rem; font-weight:600;">[মান: ৪]</span></span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_gha, "ঘ") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderMCQCardHTML(q, index, options = {}) {
    return renderModernMCQCardHTML(q, index, options);
}

function renderCQCardHTML(cq, index) {
    return renderModernCQCardHTML(cq, index);
}

function handleModernOptionClick(element, qIndex, selectedIndex, correctIndex, mode = 'study') {
    const parentCard = element.closest('.modern-quiz-card');
    if (!parentCard) return;

    if (mode === 'exam') {
        if (parentCard.classList.contains('locked')) return;
        const options = parentCard.querySelectorAll('.modern-option-pill');
        options.forEach(opt => opt.classList.remove('exam-selected'));
        element.classList.add('exam-selected');
        
        if (window.currentExamState) {
            window.currentExamState.answers[qIndex] = selectedIndex;
            window.currentExamState.updateStats();
        }
        return;
    }

    if (parentCard.classList.contains('answered')) return;
    parentCard.classList.add('answered');

    const options = parentCard.querySelectorAll('.modern-option-pill');
    options.forEach(opt => opt.classList.add('locked'));

    const isCorrect = (selectedIndex === correctIndex);

    if (isCorrect) {
        element.classList.add('correct-selected');
        const icon = element.querySelector('.modern-status-icon');
        if (icon) {
            icon.className = 'modern-status-icon check';
            icon.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
    } else {
        element.classList.add('wrong-selected');
        const icon = element.querySelector('.modern-status-icon');
        if (icon) {
            icon.className = 'modern-status-icon cross';
            icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }

        const correctOpt = parentCard.querySelector(`[data-opt-idx="${correctIndex}"]`);
        if (correctOpt) {
            correctOpt.classList.add('correct-selected');
            const cIcon = correctOpt.querySelector('.modern-status-icon');
            if (cIcon) {
                cIcon.className = 'modern-status-icon check';
                cIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
            }
        }

        const expBox = parentCard.querySelector('.modern-exp-box');
        if (expBox) expBox.style.display = 'block';
        const expBtn = parentCard.querySelector('.modern-exp-btn');
        if (expBtn) expBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> ব্যাখ্যা লুকান';
    }
}

function handleMCQOptionClick(element, qIndex, selectedIndex, correctIndex) {
    handleModernOptionClick(element, qIndex, selectedIndex, correctIndex, 'study');
}

function checkMCQAnswer(element, isCorrect) {
    const parentCard = element.closest('.question-card, .modern-quiz-card');
    if (!parentCard || parentCard.classList.contains('answered')) return;
    parentCard.classList.add('answered');

    if (isCorrect) {
        element.classList.add('correct-selected');
    } else {
        element.classList.add('wrong-selected');
    }
}

function toggleModernExp(btn) {
    const card = btn.closest('.modern-quiz-card');
    if (!card) return;
    const box = card.querySelector('.modern-exp-box');
    if (!box) return;
    if (box.style.display === 'block') {
        box.style.display = 'none';
        btn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন';
    } else {
        box.style.display = 'block';
        btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> ব্যাখ্যা লুকান';
    }
}

function toggleModernCqSubPill(header) {
    const pill = header.closest('.modern-cq-sub-pill');
    if (pill) {
        pill.classList.toggle('open');
    }
}

function toggleAccordion(header) {
    const accordion = header.closest('.cq-accordion, .modern-cq-sub-pill');
    if (accordion) {
        accordion.classList.toggle('open');
    }
}

function toggleModernShowAnswers(checkbox, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const cards = container.querySelectorAll('.modern-quiz-card');
    cards.forEach(card => {
        const correctIdx = card.getAttribute('data-correct-index');
        const correctOpt = card.querySelector(`[data-opt-idx="${correctIdx}"]`);
        const expBox = card.querySelector('.modern-exp-box');
        const expBtn = card.querySelector('.modern-exp-btn');

        if (checkbox.checked) {
            card.classList.add('show-answers-active');
            if (correctOpt) {
                correctOpt.classList.add('correct-selected');
                const icon = correctOpt.querySelector('.modern-status-icon');
                if (icon) {
                    icon.className = 'modern-status-icon check';
                    icon.innerHTML = '<i class="fa-solid fa-check"></i>';
                }
            }
            if (expBox) expBox.style.display = 'block';
            if (expBtn) expBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> ব্যাখ্যা লুকান';
        } else {
            card.classList.remove('show-answers-active');
            if (!card.classList.contains('answered')) {
                if (correctOpt) {
                    correctOpt.classList.remove('correct-selected');
                    const icon = correctOpt.querySelector('.modern-status-icon');
                    if (icon) {
                        icon.className = 'modern-status-icon';
                        icon.innerHTML = '';
                    }
                }
                if (expBox) expBox.style.display = 'none';
                if (expBtn) expBtn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন';
            }
        }
    });
}

// ------------------------------------------
// ৬. MODEL TEST RUNNER (25 RANDOM MCQS)
// ------------------------------------------
function startInteractiveModelTest(allQuestions, containerId, onRetakeCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (window.currentExamState && window.currentExamState.timerId) {
        clearInterval(window.currentExamState.timerId);
    }

    if (!allQuestions || allQuestions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 6px;">মডেল টেস্টের জন্য পর্যাপ্ত প্রশ্ন পাওয়া যায়নি</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">অনুগ্রহ করে অন্য অধ্যায়, বোর্ড বা কলেজ নির্বাচন করুন।</p>
            </div>
        `;
        return;
    }

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const examQuestions = shuffled.slice(0, 25);
    const totalCount = examQuestions.length;
    let timeRemaining = Math.min(25 * 60, totalCount * 60);

    const examState = {
        questions: examQuestions,
        answers: {},
        timerId: null,
        submitted: false,
        onRetake: onRetakeCallback,
        updateStats: () => {
            const answeredCount = Object.keys(examState.answers).length;
            const el = document.getElementById('exam-answered-count');
            if (el) el.innerHTML = `<i class="fa-regular fa-circle-check"></i> উত্তর দিয়েছেন: ${toBanglaNum(answeredCount)}টি`;
        }
    };
    window.currentExamState = examState;

    let cardsHtml = '';
    examQuestions.forEach((q, idx) => {
        cardsHtml += renderModernMCQCardHTML(q, idx, { mode: 'exam' });
    });

    container.innerHTML = `
        <div class="modern-model-toolbar">
            <div class="modern-model-stats">
                <span><i class="fa-solid fa-list-check"></i> মোট প্রশ্ন: ${toBanglaNum(totalCount)}টি</span>
                <span id="exam-answered-count"><i class="fa-regular fa-circle-check"></i> উত্তর দিয়েছেন: ০টি</span>
            </div>
            <div class="modern-model-timer">
                <i class="fa-solid fa-stopwatch fa-spin-pulse"></i>
                <span id="exam-timer-display">২৫:০০</span>
            </div>
        </div>
        <div id="exam-result-area"></div>
        <div id="exam-questions-list">
            ${cardsHtml}
        </div>
        <div id="exam-submit-area" style="margin: 30px 0 20px 0; text-align: center;">
            <button class="btn btn-primary" id="btn-submit-exam" onclick="submitCurrentModelTest()" style="width: 100%; max-width: 360px; padding: 14px 24px; border-radius: 9999px; font-size: 1.05rem; font-weight: 700; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35);">
                <i class="fa-solid fa-paper-plane" style="margin-right: 6px;"></i> পরীক্ষা সমাপ্ত করুন (Submit Exam)
            </button>
        </div>
    `;

    const timerDisplay = document.getElementById('exam-timer-display');
    const updateTimer = () => {
        if (timeRemaining <= 0) {
            clearInterval(examState.timerId);
            submitCurrentModelTest(true);
            return;
        }
        timeRemaining--;
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        const pad = (n) => n < 10 ? '0' + n : '' + n;
        const timeStr = `${pad(mins)}:${pad(secs)}`;
        if (timerDisplay) timerDisplay.innerText = toBanglaNum(timeStr);
    };

    updateTimer();
    examState.timerId = setInterval(updateTimer, 1000);
}

function submitCurrentModelTest(isAuto = false) {
    const state = window.currentExamState;
    if (!state || state.submitted) return;
    state.submitted = true;

    if (state.timerId) {
        clearInterval(state.timerId);
    }

    if (isAuto) {
        alert("সময় শেষ! আপনার মডেল টেস্ট স্বয়ংক্রিয়ভাবে জমা নেওয়া হয়েছে।");
    }

    const submitArea = document.getElementById('exam-submit-area');
    if (submitArea) submitArea.style.display = 'none';

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    state.questions.forEach((q, idx) => {
        const correctIndex = parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0;
        const userChoice = state.answers[idx];

        const card = document.getElementById(`modern-mcq-card-${idx}`);
        if (card) {
            card.classList.add('locked');
            const options = card.querySelectorAll('.modern-option-pill');
            options.forEach(opt => {
                opt.classList.add('locked');
                opt.classList.remove('exam-selected');
            });

            const correctOpt = card.querySelector(`[data-opt-idx="${correctIndex}"]`);
            if (correctOpt) {
                correctOpt.classList.add('correct-selected');
                const icon = correctOpt.querySelector('.modern-status-icon');
                if (icon) {
                    icon.className = 'modern-status-icon check';
                    icon.innerHTML = '<i class="fa-solid fa-check"></i>';
                }
            }

            if (userChoice === undefined) {
                skippedCount++;
            } else if (userChoice === correctIndex) {
                correctCount++;
            } else {
                wrongCount++;
                const wrongOpt = card.querySelector(`[data-opt-idx="${userChoice}"]`);
                if (wrongOpt) {
                    wrongOpt.classList.add('wrong-selected');
                    const icon = wrongOpt.querySelector('.modern-status-icon');
                    if (icon) {
                        icon.className = 'modern-status-icon cross';
                        icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                    }
                }
            }

            const expBox = card.querySelector('.modern-exp-box');
            if (expBox) expBox.style.display = 'block';
        }
    });

    const total = state.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const resultArea = document.getElementById('exam-result-area');
    if (resultArea) {
        resultArea.innerHTML = `
            <div class="modern-model-result-card">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: #16A34A; font-size: 1.8rem; margin-bottom: 12px;">
                    <i class="fa-solid fa-trophy"></i>
                </div>
                <h3 style="font-size: 1.35rem; font-weight: 800; color: #1E293B; margin-bottom: 4px;">মডেল টেস্ট সম্পন্ন হয়েছে!</h3>
                <p style="color: #64748B; font-size: 0.92rem; margin-bottom: 18px;">নিচে আপনার ফলাফল ও প্রতিটি প্রশ্নের সঠিক উত্তরের ব্যাখ্যা দেখুন</p>
                
                <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
                    <div style="background: #EEF2FF; border: 1.5px solid #C7D2FE; border-radius: 14px; padding: 12px 18px; min-width: 105px;">
                        <div style="font-size: 0.80rem; color: #4338CA; font-weight: 600;">প্রাপ্ত নম্বর</div>
                        <div style="font-size: 1.35rem; font-weight: 800; color: #4338CA;">${toBanglaNum(correctCount)} / ${toBanglaNum(total)}</div>
                    </div>
                    <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 12px 18px; min-width: 105px;">
                        <div style="font-size: 0.80rem; color: #16A34A; font-weight: 600;">সঠিক</div>
                        <div style="font-size: 1.35rem; font-weight: 800; color: #16A34A;">${toBanglaNum(correctCount)}টি</div>
                    </div>
                    <div style="background: #FEF2F2; border: 1.5px solid #FCA5A5; border-radius: 14px; padding: 12px 18px; min-width: 105px;">
                        <div style="font-size: 0.80rem; color: #DC2626; font-weight: 600;">ভুল</div>
                        <div style="font-size: 1.35rem; font-weight: 800; color: #DC2626;">${toBanglaNum(wrongCount)}টি</div>
                    </div>
                    <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 14px; padding: 12px 18px; min-width: 105px;">
                        <div style="font-size: 0.80rem; color: #D97706; font-weight: 600;">ছেড়ে দিয়েছেন</div>
                        <div style="font-size: 1.35rem; font-weight: 800; color: #D97706;">${toBanglaNum(skippedCount)}টি</div>
                    </div>
                </div>

                <div style="font-size: 1.15rem; font-weight: 700; color: #1E293B; margin-bottom: 18px;">
                    সঠিকতার হার: <span style="color: ${percentage >= 70 ? '#16A34A' : (percentage >= 40 ? '#D97706' : '#DC2626')};">${toBanglaNum(percentage)}%</span>
                </div>

                <button class="btn btn-outline" onclick="restartCurrentModelTest()" style="border-radius: 9999px; padding: 10px 24px; font-weight: 700; border-color: #6366F1; color: #4F46E5;">
                    <i class="fa-solid fa-rotate-right" style="margin-right: 6px;"></i> পুনরায় মডেল টেস্ট দিন (Retake)
                </button>
            </div>
        `;
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function restartCurrentModelTest() {
    if (window.currentExamState && typeof window.currentExamState.onRetake === 'function') {
        window.currentExamState.onRetake();
    }
}

function showMixedContentNoticeIfNeeded() {}

window.CONFIG = CONFIG;
window.ApiService = ApiService;
window.MOCK_DATA = MOCK_DATA;
window.toBanglaNum = toBanglaNum;
window.renderMCQCardHTML = renderMCQCardHTML;
window.renderCQCardHTML = renderCQCardHTML;
window.renderModernMCQCardHTML = renderModernMCQCardHTML;
window.renderModernCQCardHTML = renderModernCQCardHTML;
window.handleMCQOptionClick = handleMCQOptionClick;
window.handleModernOptionClick = handleModernOptionClick;
window.checkMCQAnswer = checkMCQAnswer;
window.checkChapterMCQ = checkMCQAnswer;
window.toggleModernExp = toggleModernExp;
window.toggleModernCqSubPill = toggleModernCqSubPill;
window.toggleAccordion = toggleAccordion;
window.toggleModernShowAnswers = toggleModernShowAnswers;
window.startInteractiveModelTest = startInteractiveModelTest;
window.submitCurrentModelTest = submitCurrentModelTest;
window.restartCurrentModelTest = restartCurrentModelTest;
