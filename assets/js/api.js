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
function isGitHubPagesWithoutBackend() {
    return window.location.host.includes('github.io') && (!CONFIG.LIVE_API_URL || CONFIG.LIVE_API_URL.trim() === '');
}

async function fetchFromBackend(endpoint, options = {}) {
    if (isGitHubPagesWithoutBackend()) {
        throw new Error('Running on GitHub Pages without live backend; using static JSON fallback.');
    }
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
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
        "_id": "6af02ffd1d0bfdc47abca85b",
        "serialNo": 1,
        "examNo": "01",
        "title": "live",
        "date": "08-11-26",
        "chapters": "প্রথম অধ্যায়",
        "category": "chapter",
        "totalQuestions": 30,
        "duration": 30,
        "totalMarks": 30,
        "participants": 547,
        "startTime": "2026-11-08T11:00:00.000Z",
        "endTime": "2026-11-08T16:05:00.000Z",
        "isLive": true,
        "buttonText": "Start Live Exam",
        "createdAt": "2026-11-08T07:44:20.023Z",
        "__v": 0,
        "updatedAt": "2026-11-08T11:20:37.733Z"
    },
    {
        "_id": "6af02ffd1d0bfdc47abca85c",
        "serialNo": 2,
        "examNo": "02",
        "title": "Model Test 02",
        "date": "03-11-26",
        "chapters": "দ্বিতীয় অধ্যায়",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 594,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.030Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca85d",
        "serialNo": 3,
        "examNo": "03",
        "title": "Model Test 03",
        "date": "04-11-26",
        "chapters": "৩য় অধ্যায় (১ম অংশ)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 641,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.030Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca85e",
        "serialNo": 4,
        "examNo": "04",
        "title": "Model Test 04",
        "date": "05-11-26",
        "chapters": "৩য় অধ্যায় (২য় অংশ)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 688,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.031Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca85f",
        "serialNo": 5,
        "examNo": "05",
        "title": "Model Test 05",
        "date": "06-11-26",
        "chapters": "৪র্থ অধ্যায়",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 735,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.031Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca860",
        "serialNo": 6,
        "examNo": "06",
        "title": "Model Test 06",
        "date": "07-11-26",
        "chapters": "৫ম অধ্যায়",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 782,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.032Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca861",
        "serialNo": 7,
        "examNo": "07",
        "title": "Model Test 07",
        "date": "08-11-26",
        "chapters": "৬ষ্ঠ অধ্যায়",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 829,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.032Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca862",
        "serialNo": 8,
        "examNo": "08",
        "title": "Model Test 08",
        "date": "09-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 526,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.032Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca863",
        "serialNo": 9,
        "examNo": "09",
        "title": "Model Test 09",
        "date": "10-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 573,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.033Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca864",
        "serialNo": 10,
        "examNo": "10",
        "title": "Model Test 10",
        "date": "11-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 620,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.033Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca865",
        "serialNo": 11,
        "examNo": "11",
        "title": "Model Test 11",
        "date": "12-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 667,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.034Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca866",
        "serialNo": 12,
        "examNo": "12",
        "title": "Model Test 12",
        "date": "13-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 714,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.034Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca867",
        "serialNo": 13,
        "examNo": "13",
        "title": "Model Test 13",
        "date": "14-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 761,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.035Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca868",
        "serialNo": 14,
        "examNo": "14",
        "title": "Model Test 14",
        "date": "15-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 808,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.035Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca869",
        "serialNo": 15,
        "examNo": "15",
        "title": "Model Test 15",
        "date": "16-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 505,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.036Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca86a",
        "serialNo": 16,
        "examNo": "16",
        "title": "Model Test 16",
        "date": "17-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 552,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.036Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca86b",
        "serialNo": 17,
        "examNo": "17",
        "title": "Model Test 17",
        "date": "18-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 599,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.037Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca86c",
        "serialNo": 18,
        "examNo": "18",
        "title": "Model Test 18",
        "date": "19-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 646,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.037Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca86d",
        "serialNo": 19,
        "examNo": "19",
        "title": "Model Test 19",
        "date": "20-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 693,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.038Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca86e",
        "serialNo": 20,
        "examNo": "20",
        "title": "Model Test 20",
        "date": "21-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 740,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.038Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca86f",
        "serialNo": 21,
        "examNo": "21",
        "title": "Model Test 21",
        "date": "22-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 787,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.038Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca870",
        "serialNo": 22,
        "examNo": "22",
        "title": "Model Test 22",
        "date": "23-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 834,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.038Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca871",
        "serialNo": 23,
        "examNo": "23",
        "title": "Model Test 23",
        "date": "24-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 531,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.039Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca872",
        "serialNo": 24,
        "examNo": "24",
        "title": "Model Test 24",
        "date": "25-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 578,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.039Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca873",
        "serialNo": 25,
        "examNo": "25",
        "title": "Model Test 25",
        "date": "26-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 625,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.040Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca874",
        "serialNo": 26,
        "examNo": "26",
        "title": "Model Test 26",
        "date": "27-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 672,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.040Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca875",
        "serialNo": 27,
        "examNo": "27",
        "title": "Model Test 27",
        "date": "28-11-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 719,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.040Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca876",
        "serialNo": 28,
        "examNo": "28",
        "title": "Model Test 28",
        "date": "01-12-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 766,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.041Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca877",
        "serialNo": 29,
        "examNo": "29",
        "title": "Model Test 29",
        "date": "02-12-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 813,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.041Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca878",
        "serialNo": 30,
        "examNo": "30",
        "title": "Model Test 30",
        "date": "03-12-26",
        "chapters": "পূর্ণাঙ্গ সিলেবাস",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 510,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.041Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca879",
        "serialNo": 31,
        "examNo": "31",
        "title": "Model Test 31",
        "date": "04-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (2ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 557,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.041Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca87a",
        "serialNo": 32,
        "examNo": "32",
        "title": "Model Test 32",
        "date": "05-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (3ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 604,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.042Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca87b",
        "serialNo": 33,
        "examNo": "33",
        "title": "Model Test 33",
        "date": "06-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (4ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 651,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.042Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca87c",
        "serialNo": 34,
        "examNo": "34",
        "title": "Model Test 34",
        "date": "07-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (5ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 698,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.042Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca87d",
        "serialNo": 35,
        "examNo": "35",
        "title": "Model Test 35",
        "date": "08-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (6ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 745,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.042Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca87e",
        "serialNo": 36,
        "examNo": "36",
        "title": "Model Test 36",
        "date": "09-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (1ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 792,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.043Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca87f",
        "serialNo": 37,
        "examNo": "37",
        "title": "Model Test 37",
        "date": "10-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (2ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 839,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.043Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca880",
        "serialNo": 38,
        "examNo": "38",
        "title": "Model Test 38",
        "date": "11-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (3ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 536,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.043Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca881",
        "serialNo": 39,
        "examNo": "39",
        "title": "Model Test 39",
        "date": "12-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (4ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 583,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.044Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca882",
        "serialNo": 40,
        "examNo": "40",
        "title": "Model Test 40",
        "date": "13-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (5ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 630,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.044Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca883",
        "serialNo": 41,
        "examNo": "41",
        "title": "Model Test 41",
        "date": "14-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (6ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 677,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.044Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca884",
        "serialNo": 42,
        "examNo": "42",
        "title": "Model Test 42",
        "date": "15-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (1ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 724,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.044Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca885",
        "serialNo": 43,
        "examNo": "43",
        "title": "Model Test 43",
        "date": "16-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (2ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 771,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.045Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca886",
        "serialNo": 44,
        "examNo": "44",
        "title": "Model Test 44",
        "date": "17-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (3ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 818,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.045Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca887",
        "serialNo": 45,
        "examNo": "45",
        "title": "Model Test 45",
        "date": "18-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (4ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 515,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.045Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca888",
        "serialNo": 46,
        "examNo": "46",
        "title": "Model Test 46",
        "date": "19-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (5ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 562,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.046Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca889",
        "serialNo": 47,
        "examNo": "47",
        "title": "Model Test 47",
        "date": "20-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (6ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 609,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.046Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca88a",
        "serialNo": 48,
        "examNo": "48",
        "title": "Model Test 48",
        "date": "21-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (1ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 656,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.046Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca88b",
        "serialNo": 49,
        "examNo": "49",
        "title": "Model Test 49",
        "date": "22-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (2ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 703,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.046Z",
        "__v": 0
    },
    {
        "_id": "6af02ffd1d0bfdc47abca88c",
        "serialNo": 50,
        "examNo": "50",
        "title": "Model Test 50",
        "date": "23-12-26",
        "chapters": "অধ্যায়ভিত্তিক স্পেশাল (3ম অধ্যায়)",
        "category": "chapter",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 750,
        "startTime": "",
        "endTime": "",
        "isLive": false,
        "buttonText": "Start Previous Live Exam",
        "createdAt": "2026-11-08T07:44:20.047Z",
        "__v": 0
    },
    {
        "_id": "6af058ee5846b392ccf3267c",
        "serialNo": 51,
        "examNo": "51",
        "title": "Model Test 51",
        "date": "08-11-26",
        "chapters": "প্রথম অধ্যায়",
        "category": "full",
        "totalQuestions": 25,
        "duration": 25,
        "totalMarks": 25,
        "participants": 547,
        "startTime": "2026-11-08T11:11:00.000Z",
        "endTime": "2026-11-09T11:11:00.000Z",
        "isLive": true,
        "buttonText": "Start Live Exam",
        "createdAt": "2026-11-08T11:11:42.812Z",
        "__v": 0,
        "updatedAt": "2026-11-08T11:20:37.733Z"
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
        const cacheBuster = Date.now();
        const staticUrl = (isPages ? `../database/${filename}` : `database/${filename}`) + `?t=${cacheBuster}`;
        const res = await fetch(staticUrl, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });
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

function resolveHtmlMediaUrls(html) {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/src=(["'])(\/?uploads\/[^"']+)\1/gi, (match, quote, p) => {
        return `src=${quote}${resolveMediaUrl(p)}${quote}`;
    });
}


function matchBoardName(storedName, boardCode) {
    if (!storedName || !boardCode || boardCode === 'all') return true;
    const s = storedName.toLowerCase();
    const c = boardCode.toLowerCase();
    if (s.includes(c) || c.includes(s)) return true;

    const boardMap = {
        'dhaka': ['dhaka', 'ঢাকা'],
        'rajshahi': ['rajshahi', 'রাজশাহী'],
        'chattogram': ['chattogram', 'chittagong', 'ctg', 'চট্টগ্রাম'],
        'jashore': ['jashore', 'jessore', 'যশোর'],
        'comilla': ['comilla', 'cumilla', 'কুমিল্লা'],
        'barishal': ['barishal', 'বরিশাল'],
        'sylhet': ['sylhet', 'সিলেট'],
        'dinajpur': ['dinajpur', 'দিনাজপুর'],
        'mymensingh': ['mymensingh', 'ময়মনসিংহ'],
        'madrasah': ['madrasah', 'madrasa', 'মাদ্রাসা']
    };

    for (const [key, aliases] of Object.entries(boardMap)) {
        const matchesQuery = aliases.some(a => c.includes(a));
        if (matchesQuery) {
            return aliases.some(a => s.includes(a));
        }
    }
    return false;
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
        ['dhaka college', 'ঢাকা কলেজ', 'dc'],
        ['city college', 'সিটি কলেজ', 'dcc', 'dc', 'ঢাকা সিটি কলেজ'],
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
        const matchB = grp.some(term => b.includes(term) || term.includes(b));
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

    if (ic.includes(ch) || ch.includes(ic)) return true;

    if (ch === '3.1' || ch.includes('১ম অংশ') || ch.includes('সংখ্যা পদ্ধতি')) {
        return ic.includes('3.1') || ic.includes('১ম অংশ') || ic.includes('সংখ্যা পদ্ধতি') || 
               (ic.includes('3') && !ic.includes('ডিজিটাল ডিভাইস') && !ic.includes('২য় অংশ') && !ic.includes('লজিক গেট'));
    }
    if (ch === '3.2' || ch.includes('২য় অংশ') || ch.includes('ডিজিটাল ডিভাইস') || ch.includes('লজিক গেট')) {
        return ic.includes('3.2') || ic.includes('২য় অংশ') || ic.includes('ডিজিটাল ডিভাইস') || ic.includes('লজিক গেট');
    }

    const banglaToEng = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
    const toEngNum = (s) => String(s).replace(/[০-৯]/g, d => banglaToEng[d]);

    const icNum = (toEngNum(ic).match(/\b([0-9]+)\b/) || [])[1];
    const chNum = (toEngNum(ch).match(/\b([0-9]+)\b/) || [])[1];

    if (icNum && chNum && icNum === chNum) return true;

    const words = ch.replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    for (const w of words) {
        if (ic.includes(w)) return true;
    }

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
        try {
            const res = await fetchFromBackend('/api/model-tests');
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data;
            }
        } catch (e) {}

        const staticList = await fetchStaticJson('model_tests.json');
        if (Array.isArray(staticList) && staticList.length > 0) {
            return staticList;
        }
        return MOCK_DATA.modelTests || [];
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
                    if (!matchBoardName(item.boardName, boardCode)) return false;
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
                    if (!matchBoardName(item.boardName, boardCode)) return false;
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
        async getModelTestMCQ(testIdentifier = '', examNo = '') {
        let numStr = '';
        if (examNo) {
            const n = parseInt(examNo, 10);
            if (!isNaN(n)) numStr = n < 10 ? '0' + n : '' + n;
        }
        if (!numStr && testIdentifier) {
            const match = String(testIdentifier).match(/(\d+)/);
            if (match) {
                const n = parseInt(match[1], 10);
                numStr = n < 10 ? '0' + n : '' + n;
            }
        }

        // ১. ব্যাকেন্ড থেকে শুধুমাত্র এই পরীক্ষার জন্য আপলোডকৃত প্রশ্ন ফেচ করা
        try {
            const params = [];
            if (numStr) {
                params.push(`examIdentifier=${encodeURIComponent(numStr)}`);
            } else if (testIdentifier) {
                params.push(`modelTestNo=${encodeURIComponent(testIdentifier)}`);
            }

            const query = `/api/mcqs?` + params.join('&');
            const res = await fetchFromBackend(query);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {
            console.warn('Backend getModelTestMCQ error:', e);
        }

        // ২. স্ট্যাটিক mcqs.json ব্যাকআপ থেকে নির্দিষ্ট পরীক্ষার প্রশ্ন খোঁজা
        try {
            const allMcqs = await fetchStaticJson('mcqs.json');
            if (Array.isArray(allMcqs) && allMcqs.length > 0) {
                const matched = allMcqs.filter(item => {
                    const itemLiveNo = String(item.liveExamNo || '').trim();
                    const itemModelNo = String(item.modelTestNo || '').trim();
                    if (numStr) {
                        return (itemLiveNo && itemLiveNo.includes(numStr)) ||
                               (itemModelNo && itemModelNo.includes(numStr));
                    }
                    if (testIdentifier) {
                        return itemLiveNo.toLowerCase() === testIdentifier.toLowerCase() ||
                               itemModelNo.toLowerCase() === testIdentifier.toLowerCase();
                    }
                    return false;
                });

                if (matched.length > 0) {
                    return matched.sort((a, b) => (a.serialNo || 0) - (b.serialNo || 0)).map(mapBackendMcqToFrontend);
                }
            }
        } catch (e) {
            console.warn('Static getModelTestMCQ error:', e);
        }

        // লাইভ এক্সামে অটো বা অন্য চ্যাপ্টারের প্রশ্ন আসবে না। কোনো প্রশ্ন না থাকলে ফাঁকা অ্যারে রিটার্ন হবে।
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
        let result = [];
        try {
            const endpoint = `/api/mcqs?categoryType=Chapter Practice&chapter=${encodeURIComponent(chapterId)}`;
            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                result = res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        if (result.length === 0) {
            const allMcqs = await fetchStaticJson('mcqs.json');
            if (allMcqs.length > 0) {
                const filtered = allMcqs.filter(item => {
                    if (!hasCategory(item, 'Chapter Practice')) return false;
                    return matchesChapter(item.chapter, chapterId);
                });
                if (filtered.length > 0) result = filtered.map(mapBackendMcqToFrontend);
            }
        }

        if (result.length === 0) {
            result = MOCK_DATA.questions.filter(q => q.chapter_id == chapterId);
        }

        return result.sort((a, b) => {
            const sa = (a.serialNo !== undefined && a.serialNo !== null && Number(a.serialNo) > 0) ? Number(a.serialNo) : 999999;
            const sb = (b.serialNo !== undefined && b.serialNo !== null && Number(b.serialNo) > 0) ? Number(b.serialNo) : 999999;
            if (sa !== sb) return sa - sb;
            return (new Date(a.createdAt || 0)) - (new Date(b.createdAt || 0));
        });
    },

    // ৬. অধ্যায়ভিত্তিক CQ
    async getChapterCQ(chapterId) {
        let result = [];
        try {
            const endpoint = `/api/cqs?categoryType=Chapter Practice&chapter=${encodeURIComponent(chapterId)}`;
            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                result = res.data.map(mapBackendCqToFrontend);
            }
        } catch (e) {}

        if (result.length === 0) {
            const allCqs = await fetchStaticJson('cqs.json');
            if (allCqs.length > 0) {
                const filtered = allCqs.filter(item => {
                    if (!hasCategory(item, 'Chapter Practice')) return false;
                    return matchesChapter(item.chapter, chapterId);
                });
                result = filtered.map(mapBackendCqToFrontend);
            }
        }

        return result.sort((a, b) => {
            const sa = (a.serialNo !== undefined && a.serialNo !== null && Number(a.serialNo) > 0) ? Number(a.serialNo) : 999999;
            const sb = (b.serialNo !== undefined && b.serialNo !== null && Number(b.serialNo) > 0) ? Number(b.serialNo) : 999999;
            if (sa !== sb) return sa - sb;
            return (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0));
        });
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
    },

    async getCustomOptions() {
        try {
            const res = await fetchFromBackend('/api/custom-options');
            if (res && res.success && res.data) {
                return res.data;
            }
        } catch (e) {}

        try {
            const staticData = await fetchStaticJson('custom_options.json');
            if (staticData && typeof staticData === 'object') {
                return staticData;
            }
        } catch (e) {}

        try {
            const saved = JSON.parse(localStorage.getItem('custom_meta_options') || '[]');
            const out = { chapters: [], boards: [], years: [], colleges: [], modelTests: [] };
            saved.forEach(item => {
                const key = item.type === 'chapter' ? 'chapters' :
                            item.type === 'board' ? 'boards' :
                            item.type === 'year' ? 'years' :
                            item.type === 'college' ? 'colleges' :
                            item.type === 'modelTest' ? 'modelTests' : (item.type + 's');
                if (out[key] && !out[key].includes(item.val)) out[key].push(item.val);
            });
            return out;
        } catch(e) {}

        return { chapters: [], boards: [], years: [], colleges: [], modelTests: [] };
    },

    // ১২. শিক্ষার্থীদের র‍্যাংকিং তালিকা (Students Ranking)
    async getRankings() {
        try {
            const res = await fetchFromBackend('/api/rankings');
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res;
            }
        } catch (e) {}

        let students = await fetchStaticJson('students.json');
        if (!students || students.length === 0) {
            try {
                students = JSON.parse(localStorage.getItem('ict_cached_students') || '[]');
            } catch (e) {}
        }

        const localProfile = JSON.parse(localStorage.getItem('ict_student_profile') || 'null');
        if (localProfile && Array.isArray(students)) {
            const myIdx = students.findIndex(s => s.isCurrentUser || s.name === localProfile.name);
            if (myIdx >= 0) {
                students[myIdx] = { ...students[myIdx], ...localProfile };
            }
        }

        students.sort((a, b) => (b.points || 0) - (a.points || 0));
        const ranked = students.map((s, idx) => ({ ...s, position: idx + 1 }));
        const currentUser = ranked.find(s => s.isCurrentUser) || ranked[0] || null;

        return {
            success: true,
            data: ranked,
            currentUser
        };
    },

    // ১৩. মডেল টেস্টে ২০ এর উপরে পেলে ১ পয়েন্ট যোগ করা (Add +1 Point if score > 20)
    async addModelTestPoint(data) {
        const { score } = data || {};
        if (Number(score) <= 20) {
            return { success: true, pointsAwarded: false, message: 'স্কোর ২০ এর বেশি হলে পয়েন্ট যোগ হয়।' };
        }

        try {
            const res = await fetchFromBackend('/api/students/point', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res && res.success) {
                const profile = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');
                profile.points = res.newPoints;
                profile.testsCompleted = (profile.testsCompleted || 0) + 1;
                localStorage.setItem('ict_student_profile', JSON.stringify(profile));
                return res;
            }
        } catch (e) {}

        const profile = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');
        profile.points = (profile.points || 24) + 1;
        profile.testsCompleted = (profile.testsCompleted || 18) + 1;
        localStorage.setItem('ict_student_profile', JSON.stringify(profile));

        return {
            success: true,
            pointsAwarded: true,
            newPoints: profile.points,
            message: 'অভিনন্দন! আপনার প্রোফাইলে ১ পয়েন্ট যোগ হয়েছে।'
        };
    },

    // ১৪. বর্তমান ইউজারের প্রোফাইল তথ্য আনা
    async getStudentProfile(emailOrNumber = '') {
        try {
            const query = emailOrNumber ? `?emailOrNumber=${encodeURIComponent(emailOrNumber)}` : '';
            const res = await fetchFromBackend(`/api/profile${query}`);
            if (res && res.success && res.data) {
                localStorage.setItem('ict_student_profile', JSON.stringify(res.data));
                return res.data;
            }
        } catch (e) {}

        const cached = localStorage.getItem('ict_student_profile');
        if (cached) {
            try { return JSON.parse(cached); } catch (e) {}
        }

        const students = await fetchStaticJson('students.json');
        const curr = (Array.isArray(students) && students.find(s => s.isCurrentUser)) || {
            name: 'জাহিদুল ইসলাম লাভলু',
            college: 'সরকারি মুজিব কলেজ, সখিপুর, টাঙ্গাইল',
            avatar: '../assets/images/developer.jpg',
            points: 25,
            testsCompleted: 26,
            isCurrentUser: true
        };
        localStorage.setItem('ict_student_profile', JSON.stringify(curr));
        return curr;
    },

    // ১৫. শিক্ষার্থী প্রোফাইল আপডেট (ছবি, নাম, কলেজ, এইচএসসি ব্যাচ, পাসওয়ার্ড)
    async updateProfile(profileData) {
        try {
            const res = await fetchFromBackend('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            if (res && res.success && res.data) {
                const current = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');
                const merged = { ...current, ...res.data };
                localStorage.setItem('ict_student_profile', JSON.stringify(merged));
            }
            return res;
        } catch (e) {
            console.warn('Backend updateProfile error:', e);
            return { success: false, message: e.message };
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

function escapeModernMCQOption(str) {
    if (!str) return '';
    if (typeof str === 'string' && str.includes('<img')) {
        return resolveHtmlMediaUrls(str);
    }
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatModernMCQContent(text) {
    if (!text) return '';

    // 1. Extract markdown code blocks
    const codeBlocks = [];
    let processed = text.replace(/```(?:html|css|javascript|js)?\r?\n([\s\S]*?)\r?\n```/g, (match, code) => {
        const id = `__MCQ_CODE_${codeBlocks.length}__`;
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        codeBlocks.push(`<pre style="background: #1E293B; color: #38BDF8; padding: 12px 16px; border-radius: 10px; font-family: Consolas, monospace; font-size: 0.95rem; overflow-x: auto; margin: 10px 0; border: 1px solid #334155; line-height: 1.5;"><code>${escapedCode}</code></pre>`);
        return id;
    });

    // 2. Extract markdown tables
    const tableBlocks = [];
    if (processed.includes('|') && processed.includes('\n|')) {
        const lines = processed.split('\n');
        let inTable = false;
        let tableRows = [];
        let outputLines = [];

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                if (/^\|[\s\-:]+\|/.test(trimmed)) {
                    continue;
                }
                const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
                tableRows.push(cells);
                inTable = true;
            } else {
                if (inTable && tableRows.length > 0) {
                    const id = `__MCQ_TABLE_${tableBlocks.length}__`;
                    tableBlocks.push(renderHtmlTable(tableRows));
                    outputLines.push(id);
                    tableRows = [];
                    inTable = false;
                }
                outputLines.push(line);
            }
        }
        if (inTable && tableRows.length > 0) {
            const id = `__MCQ_TABLE_${tableBlocks.length}__`;
            tableBlocks.push(renderHtmlTable(tableRows));
            outputLines.push(id);
        }
        processed = outputLines.join('\n');
    }

    function renderHtmlTable(rows) {
        let h = '<div style="overflow-x:auto; margin:12px 0;"><table style="border-collapse:collapse; width:100%; max-width:480px; margin:0 auto; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:8px; font-size:0.95rem; text-align:center;">';
        rows.forEach((r, rIdx) => {
            h += `<tr style="${rIdx === 0 ? 'background:#E2E8F0; font-weight:700;' : ''}">`;
            r.forEach(c => {
                const escapedCell = c
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                h += `<td style="border:1px solid #CBD5E1; padding:8px 12px;">${escapedCell || '&nbsp;'}</td>`;
            });
            h += '</tr>';
        });
        h += '</table></div>';
        return h;
    }

    // 3. Escape normal text
    processed = processed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/\r?\n/g, '<br>');

    // 4. Restore code blocks and tables
    codeBlocks.forEach((block, i) => {
        processed = processed.replace(`__MCQ_CODE_${i}__`, block);
    });
    tableBlocks.forEach((block, i) => {
        processed = processed.replace(`__MCQ_TABLE_${i}__`, block);
    });

    return processed;
}

// ==========================================
// FAVORITE QUESTIONS SYSTEM (localStorage)
// ==========================================
const FAVORITES_STORAGE_KEY = 'ict_favorite_questions';

function getFavoriteQuestions(category = null) {
    try {
        const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) return [];
        if (category) {
            return list.filter(item => item.category === category);
        }
        return list;
    } catch (e) {
        return [];
    }
}

function isQuestionFavorite(questionId) {
    if (!questionId) return false;
    const list = getFavoriteQuestions();
    return list.some(item => String(item.id) === String(questionId));
}

function generateMCQUniqueId(q, index) {
    if (q.id) return String(q.id);
    if (q._id) return String(q._id);
    const text = q.question_text || q.question || '';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0;
    }
    return `q_${Math.abs(hash)}_${index}`;
}

function detectCurrentMCQCategory() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('chapter')) return 'chapter';
    if (path.includes('board')) return 'board';
    if (path.includes('test-paper') || path.includes('test_paper') || path.includes('college')) return 'college';
    if (path.includes('model-test') || path.includes('model_test')) return 'model_test';
    return 'chapter';
}

function toggleFavoriteQuestion(btn, qDataStr) {
    let qData = null;
    try {
        if (!qDataStr && btn) {
            qDataStr = btn.getAttribute('data-fav-payload') || (btn.dataset ? btn.dataset.favPayload : null);
        }
        if (typeof qDataStr === 'string') {
            qData = JSON.parse(decodeURIComponent(qDataStr));
        } else {
            qData = qDataStr;
        }
    } catch(e) {
        console.error("Error parsing fav data", e);
        return;
    }

    if (!qData) return;
    if (!qData.id) qData.id = generateMCQUniqueId(qData, 0);

    let list = getFavoriteQuestions();
    const existingIndex = list.findIndex(item => String(item.id) === String(qData.id));

    if (existingIndex >= 0) {
        list.splice(existingIndex, 1);
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fa-regular fa-bookmark"></i> <span>ফেভারিট</span>';
            btn.title = 'ফেভারিটে যোগ করুন';
        }
        showToastNotification('প্রশ্নটি ফেভারিট থেকে সরানো হয়েছে');
    } else {
        list.push({
            id: qData.id,
            category: qData.category || detectCurrentMCQCategory(),
            source_title: qData.source_title || '',
            question_text: qData.question_text || qData.question || '',
            options: qData.options || [],
            correct_index: qData.correct_index !== undefined ? qData.correct_index : 0,
            explanation: qData.explanation || '',
            context_stem: qData.context_stem || '',
            image: qData.image || '',
            added_at: Date.now()
        });
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-bookmark" style="color: #4F46E5;"></i> <span>সংরক্ষিত</span>';
            btn.title = 'ফেভারিট থেকে সরান';
        }
        showToastNotification('প্রশ্নটি ফেভারিটে যোগ করা হয়েছে!');
    }

    document.querySelectorAll(`.modern-fav-btn[data-q-id="${qData.id}"]`).forEach(otherBtn => {
        if (otherBtn !== btn) {
            const isFavNow = isQuestionFavorite(qData.id);
            if (isFavNow) {
                otherBtn.classList.add('active');
                otherBtn.innerHTML = '<i class="fa-solid fa-bookmark" style="color: #4F46E5;"></i> <span>সংরক্ষিত</span>';
            } else {
                otherBtn.classList.remove('active');
                otherBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> <span>ফেভারিট</span>';
            }
        }
    });

    if (typeof refreshFavoriteQuestionsList === 'function') {
        refreshFavoriteQuestionsList();
    }
}

function showToastNotification(message) {
    let toast = document.getElementById('ict-toast-notify');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ict-toast-notify';
        toast.style.cssText = `
            position: fixed;
            bottom: 75px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #1E293B;
            color: #FFFFFF;
            padding: 10px 20px;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 99999;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10B981;"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2400);
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
    
    const category = options.category || (mode === 'exam' ? 'model_test' : detectCurrentMCQCategory());
    const qId = q.id ? String(q.id) : generateMCQUniqueId(q, index);
    const isFav = isQuestionFavorite(qId);

    let sourceTitle = options.source_title || '';
    if (!sourceTitle) {
        if (typeof activeChapter !== 'undefined' && activeChapter) sourceTitle = activeChapter;
        else if (typeof selectedBoard !== 'undefined' && selectedBoard) sourceTitle = `${selectedBoard} (${typeof selectedYear !== 'undefined' ? selectedYear : ''})`;
        else if (typeof selectedCollege !== 'undefined' && selectedCollege) sourceTitle = selectedCollege;
        else if (mode === 'exam') sourceTitle = 'মডেল টেস্ট';
        else sourceTitle = 'আইসিটি প্রশ্নব্যাংক';
    }

    const favDataObj = {
        id: qId,
        category: category,
        source_title: sourceTitle,
        question_text: qText,
        options: opts,
        correct_index: correctIndex,
        explanation: explanation,
        context_stem: q.context_stem || '',
        image: q.image || ''
    };
    const favDataEncoded = encodeURIComponent(JSON.stringify(favDataObj)).replace(/'/g, "%27");
    
    const imageHtml = q.image ? `
        <div class="question-image-box" style="margin: 12px 0 16px 0; text-align: center;">
            <img src="${resolveMediaUrl(q.image)}" alt="প্রশ্ন চিত্র" style="max-width: 100%; max-height: 320px; border-radius: 12px; border: 1px solid #E2E8F0; object-fit: contain;">
        </div>
    ` : '';
    const contextHtml = q.context_stem ? `<div class="question-stem" style="background:#F1F5F9; padding:12px 16px; border-radius:12px; margin-bottom:14px; font-size:0.95rem; border-left:4px solid var(--primary); line-height: 1.6;">${formatModernMCQContent(q.context_stem)}</div>` : '';

    let optionsHtml = '';
    opts.forEach((optText, oIdx) => {
        const marker = markers[oIdx] || (oIdx + 1);
        optionsHtml += `
            <div class="modern-option-pill" data-opt-idx="${oIdx}" onclick="handleModernOptionClick(this, ${index}, ${oIdx}, ${correctIndex}, '${mode}')">
                <div class="modern-option-pill-left">
                    <span class="option-radio-circle"></span>
                    <span class="option-text"><strong>${marker}.</strong> ${escapeModernMCQOption(optText)}</span>
                </div>
                <span class="modern-status-icon"></span>
            </div>
        `;
    });

    const favButtonHtml = `
        <button type="button" class="modern-fav-btn ${isFav ? 'active' : ''}" data-q-id="${qId}" data-fav-payload="${favDataEncoded}" onclick="toggleFavoriteQuestion(this)" title="${isFav ? 'ফেভারিট থেকে সরান' : 'ফেভারিটে যোগ করুন'}">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            <span>${isFav ? 'সংরক্ষিত' : 'ফেভারিট'}</span>
        </button>
    `;

    const isModelTest = (category === 'model_test') || (options.hideExplanation === true) || (mode === 'exam');

    const expBtnAndBox = `
        <div class="modern-card-actions" style="display: flex; align-items: center; justify-content: ${isModelTest ? 'flex-end' : 'space-between'}; width: 100%; margin-top: 12px; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="modern-exp-btn" onclick="toggleModernExp(this)" style="${isModelTest ? 'display: none;' : ''}">
                <i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন
            </button>
            ${favButtonHtml}
        </div>
        <div class="modern-exp-box" style="display: none; width: 100%; margin-top: 12px;">
            <div style="font-weight: 700; color: #4338CA; margin-bottom: 6px;"><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</div>
            <p style="margin: 0; line-height: 1.6;">${formatModernMCQContent(explanation) || 'কোনো ব্যাখ্যা দেওয়া নেই।'}</p>
        </div>
    `;

    const cardId = (mode === 'exam') ? `model-mcq-card-${index}` : `modern-mcq-card-${index}`;

    return `
        <div class="modern-quiz-card" id="${cardId}" data-q-index="${index}" data-correct-index="${correctIndex}" data-q-id="${qId}">
            ${contextHtml}
            <div class="modern-quiz-header">
                <h3 class="modern-q-title">${qNum}. ${formatModernMCQContent(qText)}</h3>
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
        const stripped = text.replace(new RegExp('^\\s*\\(' + prefix + '\\)\\s*'), '').trim();
        return resolveHtmlMediaUrls(stripped);
    };
    const qNum = toBanglaNum(index + 1);

    return `
        <div class="modern-cq-card" style="margin-bottom: 24px;">
            <div class="modern-cq-stem-box">
                <div style="font-weight: 700; color: #4F46E5; margin-bottom: 8px;">
                    <i class="fa-solid fa-feather-pointed"></i> উদ্দীপক-${qNum}:
                </div>
                <p style="margin: 0; line-height: 1.7; font-size: 1rem; color: #1E293B;">${resolveHtmlMediaUrls(cq.stem)}</p>
                ${cq.image ? `
                    <div style="margin: 14px 0 10px 0; text-align: center;">
                        <img src="${resolveMediaUrl(cq.image)}" alt="উদ্দীপক চিত্র" style="max-width: 100%; max-height: 380px; border-radius: 12px; border: 1px solid #E2E8F0; object-fit: contain;">
                    </div>
                ` : ''}
            </div>

            <div class="modern-cq-sub-questions">
                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(ক)</strong> ${cleanQ(cq.q_ka, "ক")}</span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_ka, "ক") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(খ)</strong> ${cleanQ(cq.q_kha, "খ")}</span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_kha, "খ") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(গ)</strong> ${cleanQ(cq.q_ga, "গ")}</span>
                        <div class="modern-cq-arrow-circle"><i class="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div class="modern-cq-sub-body" style="color: #000000 !important; font-weight: 500;">
                        <strong style="color: #1E293B;">উত্তর:</strong> ${cleanQ(cq.a_ga, "গ") || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="modern-cq-sub-pill">
                    <div class="modern-cq-sub-header" onclick="toggleModernCqSubPill(this)">
                        <span><strong>(ঘ)</strong> ${cleanQ(cq.q_gha, "ঘ")}</span>
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
        // মডেল টেস্টে একটি প্রশ্নে একবারই ক্লিক করা যাবে (একবার উত্তর দিলে লক হয়ে যাবে)
        if (parentCard.classList.contains('locked') || parentCard.classList.contains('answered')) return;
        parentCard.classList.add('locked');
        parentCard.classList.add('answered');

        const options = parentCard.querySelectorAll('.modern-option-pill');
        options.forEach(opt => {
            opt.classList.remove('exam-selected');
            opt.classList.add('locked');
            opt.style.pointerEvents = 'none';
        });
        element.classList.add('exam-selected');
        
        if (typeof userAnswers !== 'undefined') {
            userAnswers[qIndex] = selectedIndex;
        }
        if (typeof updateExamProgress === 'function') {
            updateExamProgress();
        }
        const palBtn = document.getElementById(`palette-btn-${qIndex}`);
        if (palBtn) palBtn.classList.add('answered');

        if (window.currentExamState) {
            window.currentExamState.answers[qIndex] = selectedIndex;
            window.currentExamState.updateStats();
        }
        return;
    }

    if (parentCard.classList.contains('answered')) return;
    parentCard.classList.add('answered');

    if (typeof userAnswers !== 'undefined') {
        userAnswers[qIndex] = selectedIndex;
    }
    if (typeof updateExamProgress === 'function') {
        updateExamProgress();
    }
    const palBtn = document.getElementById(`palette-btn-${qIndex}`);
    if (palBtn) palBtn.classList.add('answered');

    const options = parentCard.querySelectorAll('.modern-option-pill');
    options.forEach(opt => {
        opt.classList.add('locked');
        opt.style.pointerEvents = 'none';
    });

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
        // ক্লিক করার সাথে সাথে ব্যাখ্যা শো হবে না।
        // শুধুমাত্র "ব্যাখ্যা দেখুন" বাটনে ক্লিক করলে ব্যাখ্যা শো করবে।
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
function adjustInteractiveToolbarPosition() {
    const header = document.querySelector('.site-header');
    const toolbars = document.querySelectorAll('.interactive-model-top-toolbar');
    if (header) {
        const hHeight = Math.round(header.getBoundingClientRect().height);
        if (hHeight > 0) {
            document.documentElement.style.setProperty('--header-actual-height', hHeight + 'px');
            if (toolbars.length > 0) {
                toolbars.forEach(tb => {
                    tb.style.top = hHeight + 'px';
                });
            }
        }
    }
}
window.addEventListener('resize', adjustInteractiveToolbarPosition);
window.addEventListener('scroll', adjustInteractiveToolbarPosition, { passive: true });
document.addEventListener('DOMContentLoaded', adjustInteractiveToolbarPosition);
setTimeout(adjustInteractiveToolbarPosition, 50);
window.adjustInteractiveToolbarPosition = adjustInteractiveToolbarPosition;

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

    // 1. Locate or create top toolbar container above the segmented tabs
    const toolbarId = containerId.replace('-container', '-toolbar');
    let topToolbar = document.getElementById(toolbarId);
    if (!topToolbar) {
        const viewContainer = container.closest('.interactive-view-container') || container.closest('section');
        if (viewContainer) {
            topToolbar = viewContainer.querySelector('.interactive-model-top-toolbar');
            if (!topToolbar) {
                const segWrapper = viewContainer.querySelector('.interactive-segmented-wrapper');
                if (segWrapper && segWrapper.parentNode) {
                    topToolbar = document.createElement('div');
                    topToolbar.id = toolbarId;
                    topToolbar.className = 'interactive-model-top-toolbar';
                    segWrapper.parentNode.insertBefore(topToolbar, segWrapper);
                }
            }
        }
    }

    const toolbarHtml = `
        <div class="modern-model-toolbar">
            <div class="modern-model-stats">
                <span><i class="fa-solid fa-list-check"></i> মোট প্রশ্ন: ${toBanglaNum(totalCount)}টি</span>
                <span id="exam-answered-count"><i class="fa-regular fa-circle-check"></i> উত্তর দিয়েছেন: ০টি</span>
            </div>
            <div class="modern-model-actions">
                <button type="button" class="btn-model-top-submit" id="btn-model-top-submit" onclick="submitCurrentModelTest()" title="মডেল টেস্ট জমা দিন">
                    <i class="fa-solid fa-paper-plane"></i> <span>সাবমিট</span>
                </button>
                <div class="modern-model-timer" id="top-model-timer">
                    <i class="fa-solid fa-stopwatch fa-spin-pulse"></i>
                    <span id="exam-timer-display">২৫:০০</span>
                </div>
            </div>
        </div>
    `;

    if (topToolbar) {
        topToolbar.innerHTML = toolbarHtml;
        topToolbar.style.display = 'block';
    }

    container.innerHTML = `
        ${!topToolbar ? toolbarHtml : ''}
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

    if (typeof adjustInteractiveToolbarPosition === 'function') {
        setTimeout(adjustInteractiveToolbarPosition, 50);
    }

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


function openSubmitConfirmModal(answeredCount, unanswered, onConfirmCallback) {
    let modal = document.getElementById('examSubmitConfirmModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'examSubmitConfirmModal';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '10000';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-window" style="max-width: 530px; width: 92%; border-radius: 26px; padding: 32px 26px; text-align: center; box-shadow: 0 25px 60px rgba(15, 23, 42, 0.28); background: #FFFFFF; border: 1.5px solid #E2E8F0;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); color: #D97706; font-size: 2.2rem; margin-bottom: 16px; border: 3px solid #FCD34D;">
                <i class="fa-solid fa-circle-question"></i>
            </div>
            
            <h3 style="font-size: 1.65rem; font-weight: 800; color: #0F172A; margin: 0 0 16px 0;">পরীক্ষা সাবমিট নিশ্চিতকরণ</h3>

            <div class="confirm-stat-row" style="display: flex; gap: 14px; margin-bottom: 20px;">
                <div class="confirm-stat-box" style="flex: 1; background: #F0FDF4; border: 2.5px solid #86EFAC; border-radius: 18px; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <span style="font-size: 1.05rem; font-weight: 700; color: #15803D; margin-bottom: 4px; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-circle-check"></i> উত্তর দিয়েছেন
                    </span>
                    <strong style="font-size: 2.35rem; font-weight: 900; color: #166534; line-height: 1;">${toBanglaNum(answeredCount)}টি</strong>
                </div>
                <div class="confirm-stat-box" style="flex: 1; background: #FFFBEB; border: 2.5px solid #FDE68A; border-radius: 18px; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <span style="font-size: 1.05rem; font-weight: 700; color: #B45309; margin-bottom: 4px; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-clock"></i> উত্তর বাকি
                    </span>
                    <strong style="font-size: 2.35rem; font-weight: 900; color: #B45309; line-height: 1;">${toBanglaNum(unanswered)}টি</strong>
                </div>
            </div>

            <div class="confirm-prompt-card" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 18px 20px; margin-bottom: 26px;">
                <p class="confirm-prompt-text" style="font-size: 1.25rem; font-weight: 700; color: #1E293B; line-height: 1.6; margin: 0;">
                    আপনি মোট <span style="color: #16A34A; font-weight: 900;">${toBanglaNum(answeredCount)}টি</span> প্রশ্নের উত্তর দিয়েছেন।<br>
                    ${unanswered > 0 ? `এখনও <span style="color: #DC2626; font-weight: 900;">${toBanglaNum(unanswered)}টি</span> প্রশ্নের উত্তর দেওয়া বাকি আছে।<br>` : ''}
                    <span class="confirm-prompt-question" style="display: block; margin-top: 10px; font-size: 1.30rem; font-weight: 800; color: #4338CA;">
                        আপনি কি নিশ্চিতভাবে পরীক্ষা সাবমিট করতে চান?
                    </span>
                </p>
            </div>

            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button type="button" id="btn-confirm-submit-yes" class="confirm-btn-yes">
                    <i class="fa-solid fa-paper-plane"></i> হ্যাঁ, সাবমিট করুন
                </button>
                <button type="button" id="btn-confirm-submit-no" class="confirm-btn-no">
                    <i class="fa-solid fa-arrow-left"></i> না, আরও সময় নেব
                </button>
            </div>
        </div>
    `;

    modal.classList.add('open');

    const yesBtn = modal.querySelector('#btn-confirm-submit-yes');
    const noBtn = modal.querySelector('#btn-confirm-submit-no');

    yesBtn.onclick = () => {
        modal.classList.remove('open');
        if (typeof onConfirmCallback === 'function') {
            onConfirmCallback();
        }
    };

    noBtn.onclick = () => {
        modal.classList.remove('open');
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    };
}
window.openSubmitConfirmModal = openSubmitConfirmModal;

function submitCurrentModelTest(isAuto = false) {
    const state = window.currentExamState;
    if (!state || state.submitted) return;

    if (!isAuto) {
        const answeredCount = Object.keys(state.answers).length;
        const total = state.questions.length;
        const unanswered = total - answeredCount;
        openSubmitConfirmModal(answeredCount, unanswered, () => {
            submitCurrentModelTest(true);
        });
        return;
    }

    state.submitted = true;

    if (state.timerId) {
        clearInterval(state.timerId);
    }

    const submitArea = document.getElementById('exam-submit-area');
    if (submitArea) submitArea.style.display = 'none';

    const topSubmitBtn = document.getElementById('btn-model-top-submit');
    if (topSubmitBtn) {
        topSubmitBtn.disabled = true;
        topSubmitBtn.style.opacity = '0.7';
        topSubmitBtn.style.cursor = 'default';
        topSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>সম্পন্ন</span>';
    }

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    state.questions.forEach((q, idx) => {
        const correctIndex = parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0;
        const userChoice = state.answers[idx];

        const card = document.getElementById(`model-mcq-card-${idx}`) || document.getElementById(`modern-mcq-card-${idx}`);
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
            <div class="modern-model-result-card" style="padding: 28px 22px; border-radius: 22px; border: 2px solid #86EFAC; background: #FFFFFF; box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: center; margin-bottom: 26px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 50%; background: #DCFCE7; color: #16A34A; font-size: 2rem; margin-bottom: 12px;">
                    <i class="fa-solid fa-trophy"></i>
                </div>
                <h3 style="font-size: 1.55rem; font-weight: 800; color: #0F172A; margin-bottom: 6px;">মডেল টেস্ট সম্পন্ন হয়েছে!</h3>
                <p style="color: #64748B; font-size: 1.02rem; margin-bottom: 22px;">নিচে আপনার অর্জিত স্কোর ও প্রতিটি প্রশ্নের সঠিক উত্তরের ব্যাখ্যা দেখুন</p>
                
                <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 22px;">
                    <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border: 2px solid #C7D2FE; border-radius: 16px; padding: 14px 22px; min-width: 120px;">
                        <div style="font-size: 0.95rem; color: #4338CA; font-weight: 700; margin-bottom: 3px;">প্রাপ্ত নম্বর</div>
                        <div style="font-size: 1.65rem; font-weight: 900; color: #3730A3;">${toBanglaNum(correctCount)} / ${toBanglaNum(total)}</div>
                    </div>
                    <div style="background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 16px; padding: 14px 22px; min-width: 110px;">
                        <div style="font-size: 0.95rem; color: #16A34A; font-weight: 700; margin-bottom: 3px;">সঠিক</div>
                        <div style="font-size: 1.65rem; font-weight: 900; color: #15803D;">${toBanglaNum(correctCount)}টি</div>
                    </div>
                    <div style="background: #FEF2F2; border: 2px solid #FCA5A5; border-radius: 16px; padding: 14px 22px; min-width: 110px;">
                        <div style="font-size: 0.95rem; color: #DC2626; font-weight: 700; margin-bottom: 3px;">ভুল</div>
                        <div style="font-size: 1.65rem; font-weight: 900; color: #B91C1C;">${toBanglaNum(wrongCount)}টি</div>
                    </div>
                    <div style="background: #FFFBEB; border: 2px solid #FDE68A; border-radius: 16px; padding: 14px 22px; min-width: 110px;">
                        <div style="font-size: 0.95rem; color: #D97706; font-weight: 700; margin-bottom: 3px;">ছেড়ে দিয়েছেন</div>
                        <div style="font-size: 1.65rem; font-weight: 900; color: #B45309;">${toBanglaNum(skippedCount)}টি</div>
                    </div>
                </div>

                <div style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin-bottom: 22px;">
                    সঠিকতার হার: <span style="font-size: 1.4rem; color: ${percentage >= 70 ? '#16A34A' : (percentage >= 40 ? '#D97706' : '#DC2626')};">${toBanglaNum(percentage)}%</span>
                </div>

                <button class="btn btn-outline" onclick="restartCurrentModelTest()" style="border-radius: 9999px; padding: 12px 28px; font-size: 1.05rem; font-weight: 700; border-color: #6366F1; color: #4F46E5; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.15);">
                    <i class="fa-solid fa-rotate-right" style="margin-right: 8px;"></i> পুনরায় মডেল টেস্ট দিন (Retake)
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
window.resolveMediaUrl = resolveMediaUrl;
window.resolveHtmlMediaUrls = resolveHtmlMediaUrls;
window.matchBoardName = matchBoardName;

window.getFavoriteQuestions = getFavoriteQuestions;
window.isQuestionFavorite = isQuestionFavorite;
window.toggleFavoriteQuestion = toggleFavoriteQuestion;

// Aliases for favorite management
function saveQuestionToFavorites(qData, category) {
    if (!qData) return;
    const cat = category || (qData.category || detectCurrentMCQCategory());
    let list = getFavoriteQuestions();
    const existingIndex = list.findIndex(item => String(item.id) === String(qData.id));
    const entry = {
        id: qData.id,
        category: cat,
        source_title: qData.source_title || '',
        question_text: qData.question_text || qData.question || '',
        options: qData.options || [],
        correct_index: qData.correct_index !== undefined ? qData.correct_index : (qData.correct || 0),
        explanation: qData.explanation || '',
        context_stem: qData.context_stem || '',
        image: qData.image || '',
        added_at: Date.now()
    };
    if (existingIndex >= 0) {
        list[existingIndex] = entry;
    } else {
        list.push(entry);
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
}

function removeQuestionFromFavorites(qId) {
    let list = getFavoriteQuestions();
    list = list.filter(item => String(item.id) !== String(qId));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
}

function getFavoriteQuestionsByCategory(cat) {
    return getFavoriteQuestions(cat);
}

window.saveQuestionToFavorites = saveQuestionToFavorites;
window.removeQuestionFromFavorites = removeQuestionFromFavorites;
window.getFavoriteQuestionsByCategory = getFavoriteQuestionsByCategory;
