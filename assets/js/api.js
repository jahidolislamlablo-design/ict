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

    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (window.location.port === '5000') {
            return ''; // একই সার্ভার থেকে রিলেটিভ পাথ
        }
        return CONFIG.LOCAL_API_URL;
    }

    return CONFIG.LOCAL_API_URL;
}

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
            id: "pdf-01",
            title: "এইচএসসি আইসিটি সুপার সাজেশন ও জ্ঞান-অনুধাবন প্রশ্নব্যাংক (২০২৬/২০২৫)",
            category: "suggestion",
            chapter: "সকল অধ্যায়",
            size: "3.8 MB",
            pages: 42,
            downloads: 12450,
            download_url: "#"
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
const ApiService = {

    async getChapters() {
        return Promise.resolve(MOCK_DATA.chapters);
    },

    async getBoards() {
        return Promise.resolve(MOCK_DATA.boards);
    },

    async getColleges() {
        return Promise.resolve(MOCK_DATA.colleges);
    },

    async getModelTests() {
        return Promise.resolve(MOCK_DATA.modelTests);
    },

    async getPdfSuggestions() {
        return Promise.resolve(MOCK_DATA.pdfSuggestions);
    },

    // ১. বোর্ড প্রশ্ন লোড (MCQ) - শুধুমাত্র নির্বাচিত বোর্ড ও সালের প্রশ্ন
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
            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map(mapBackendMcqToFrontend);
            }
            return [];
        } catch (e) {
            console.warn("⚠️ Could not fetch from MongoDB, falling back to mock:", e.message);
            showMixedContentNoticeIfNeeded();
            return MOCK_DATA.questions.filter(q => {
                const matchBoard = !boardCode || q.board_id === boardCode;
                const matchYear = !year || q.year === year;
                return matchBoard && matchYear;
            });
        }
    },

    // ২. বোর্ড সৃজনশীল প্রশ্ন লোড (CQ) - শুধুমাত্র নির্বাচিত বোর্ড ও সালের প্রশ্ন
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
            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map(mapBackendCqToFrontend);
            }
            return [];
        } catch (e) {
            console.warn("⚠️ Could not fetch CQs from backend:", e.message);
            showMixedContentNoticeIfNeeded();
            return [];
        }
    },

    // ৩. অধ্যায়ভিত্তিক MCQ লোড - শুধুমাত্র নির্দিষ্ট অধ্যায়ের অনুশীলন প্রশ্ন
    async getChapterMCQ(chapterId) {
        try {
            let chapterNum = chapterId;
            if (chapterId === 4) chapterNum = 3;
            if (chapterId === 5) chapterNum = 4;
            if (chapterId === 6) chapterNum = 5;
            if (chapterId === 7) chapterNum = 6;

            const endpoint = `/api/mcqs?categoryType=Chapter Practice&chapter=${encodeURIComponent(chapterNum)}`;
            const res = await fetchFromBackend(endpoint);

            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map(mapBackendMcqToFrontend);
            }
            return [];
        } catch (e) {
            console.warn("⚠️ Chapter MCQ fallback:", e.message);
            showMixedContentNoticeIfNeeded();
            return MOCK_DATA.questions.filter(q => q.chapter_id == chapterId);
        }
    },

    // অধ্যায়ভিত্তিক CQ লোড
    async getChapterCQ(chapterId) {
        try {
            let chapterNum = chapterId;
            if (chapterId === 4) chapterNum = 3;
            if (chapterId === 5) chapterNum = 4;
            if (chapterId === 6) chapterNum = 5;
            if (chapterId === 7) chapterNum = 6;

            const endpoint = `/api/cqs?categoryType=Chapter Practice&chapter=${encodeURIComponent(chapterNum)}`;
            const res = await fetchFromBackend(endpoint);

            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map(mapBackendCqToFrontend);
            }
            return [];
        } catch (e) {
            console.warn("⚠️ Chapter CQ fallback:", e.message);
            return [];
        }
    },

    // ৪. টেস্ট পেপার / কলেজ ভিত্তিক MCQ লোড
    async getCollegeMCQ(collegeId) {
        try {
            let endpoint = `/api/mcqs?categoryType=College Test Paper`;
            if (collegeId) endpoint += `&collegeName=${encodeURIComponent(collegeId)}`;

            const res = await fetchFromBackend(endpoint);
            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map(mapBackendMcqToFrontend);
            }
            return [];
        } catch (e) {
            showMixedContentNoticeIfNeeded();
            return [];
        }
    },

    // ৫. সকল MCQ লোড (মডেল টেস্ট বা প্র্যাকটিসের জন্য)
    async getAllMCQ() {
        try {
            const res = await fetchFromBackend('/api/mcqs');
            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map(mapBackendMcqToFrontend);
            }
            return MOCK_DATA.questions;
        } catch (e) {
            showMixedContentNoticeIfNeeded();
            return MOCK_DATA.questions;
        }
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
            const results = JSON.parse(localStorage.getItem('ICT_RESULTS') || '[]');
            results.push({ ...resultData, savedAt: new Date().toISOString() });
            localStorage.setItem('ICT_RESULTS', JSON.stringify(results));
            return { success: true, offline: true };
        }
    }
};

// ==========================================
// ৫. UNIVERSAL RENDERING FUNCTIONS (MCQ & CQ)
// ==========================================

function renderMCQCardHTML(q, index, options = {}) {
    const banglaDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    const qNum = (index + 1).toString().replace(/\d/g, d => banglaDigits[d] || d);
    const markers = ['ক', 'খ', 'গ', 'ঘ'];
    
    let opts = q.options;
    if (typeof opts === 'string') {
        try { opts = JSON.parse(opts); } catch(e) { opts = []; }
    }
    if (!Array.isArray(opts)) opts = [];

    const correctIndex = parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0;
    const clickHandler = options.clickHandler || 'handleMCQOptionClick';
    const qText = q.question_text || q.question || '';
    const explanation = q.explanation || '';
    
    const contextHtml = q.context_stem ? `<div class="question-stem" style="background:#F1F5F9; padding:10px 14px; border-radius:8px; margin-bottom:12px; font-size:0.92rem; border-left:3px solid var(--primary);">${q.context_stem}</div>` : '';
    const explanationHtml = explanation ? `<div class="explanation-box"><div class="explanation-title" style="font-weight:600; margin-bottom:4px; color:var(--text-primary);"><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</div><p style="margin:0; line-height:1.5;">${explanation}</p></div>` : '';

    let optionsHtml = '';
    opts.forEach((optText, oIdx) => {
        const marker = markers[oIdx] || (oIdx + 1);
        const isCorrect = (oIdx === correctIndex);
        optionsHtml += `
            <div class="option-item" data-index="${oIdx}" data-correct="${isCorrect}" onclick="${clickHandler}(this, ${index}, ${oIdx}, ${correctIndex})">
                <div class="option-left">
                    <span class="option-marker">${marker}</span>
                    <span>${optText}</span>
                </div>
                <span class="option-status-icon"></span>
            </div>
        `;
    });

    return `
        <div class="question-card" id="question-card-${index}" data-q-index="${index}" data-correct-index="${correctIndex}">
            ${contextHtml}
            <div class="question-title">${qNum}. ${qText}</div>
            <div class="options-grid two-cols">
                ${optionsHtml}
            </div>
            ${explanationHtml}
        </div>
    `;
}

function renderCQCardHTML(cq, index) {
    const banglaDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    const qNum = (index + 1).toString().replace(/\d/g, d => banglaDigits[d] || d);

    return `
        <div class="question-card" style="margin-bottom: 24px;">
            <div class="cq-stem">
                <span class="cq-tag"><i class="fa-solid fa-feather-pointed"></i> সৃজনশীল প্রশ্ন ${qNum} [উদ্দীপক]</span>
                <p style="margin-top: 10px; line-height: 1.6; font-size: 1rem; color: #1e293b;">${cq.stem}</p>
            </div>

            <div class="cq-sub-questions" style="margin-top: 18px;">
                <div class="cq-accordion">
                    <div class="cq-accordion-header" onclick="toggleAccordion(this)">
                        <span>(ক) ${cq.q_ka} <span style="color:var(--primary); font-size:0.85rem;">[মান: ১]</span></span>
                        <i class="fa-solid fa-chevron-down cq-accordion-arrow"></i>
                    </div>
                    <div class="cq-accordion-body">
                        <strong>উত্তর:</strong> ${cq.a_ka || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="cq-accordion">
                    <div class="cq-accordion-header" onclick="toggleAccordion(this)">
                        <span>(খ) ${cq.q_kha} <span style="color:var(--primary); font-size:0.85rem;">[মান: ২]</span></span>
                        <i class="fa-solid fa-chevron-down cq-accordion-arrow"></i>
                    </div>
                    <div class="cq-accordion-body">
                        <strong>উত্তর:</strong> ${cq.a_kha || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="cq-accordion">
                    <div class="cq-accordion-header" onclick="toggleAccordion(this)">
                        <span>(গ) ${cq.q_ga} <span style="color:var(--primary); font-size:0.85rem;">[মান: ৩]</span></span>
                        <i class="fa-solid fa-chevron-down cq-accordion-arrow"></i>
                    </div>
                    <div class="cq-accordion-body">
                        <strong>উত্তর:</strong> ${cq.a_ga || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>

                <div class="cq-accordion">
                    <div class="cq-accordion-header" onclick="toggleAccordion(this)">
                        <span>(ঘ) ${cq.q_gha} <span style="color:var(--primary); font-size:0.85rem;">[মান: ৪]</span></span>
                        <i class="fa-solid fa-chevron-down cq-accordion-arrow"></i>
                    </div>
                    <div class="cq-accordion-body">
                        <strong>উত্তর:</strong> ${cq.a_gha || 'উত্তর সংযুক্ত করা হয়নি।'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handleMCQOptionClick(element, qIndex, selectedIndex, correctIndex) {
    const parentCard = element.closest('.question-card');
    if (!parentCard) return;

    if (parentCard.classList.contains('answered')) return;
    parentCard.classList.add('answered');

    const options = parentCard.querySelectorAll('.option-item');
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.cursor = 'default';
    });

    const isCorrect = (selectedIndex === correctIndex);

    if (isCorrect) {
        element.classList.add('correct');
        const icon = element.querySelector('.option-status-icon');
        if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
    } else {
        element.classList.add('wrong');
        const icon = element.querySelector('.option-status-icon');
        if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--danger); font-size: 1.15rem;"></i>';

        const correctOpt = parentCard.querySelector('[data-correct="true"]') || options[correctIndex];
        if (correctOpt) {
            correctOpt.classList.add('correct');
            const cIcon = correctOpt.querySelector('.option-status-icon');
            if (cIcon) cIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
        }
    }

    const expBox = parentCard.querySelector('.explanation-box');
    if (expBox) expBox.style.display = 'block';
}

function checkMCQAnswer(element, isCorrect) {
    const parentCard = element.closest('.question-card');
    if (!parentCard || parentCard.classList.contains('answered')) return;
    parentCard.classList.add('answered');

    const options = parentCard.querySelectorAll('.option-item');
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.cursor = 'default';
    });

    if (isCorrect) {
        element.classList.add('correct');
        const icon = element.querySelector('.option-status-icon');
        if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
    } else {
        element.classList.add('wrong');
        const icon = element.querySelector('.option-status-icon');
        if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--danger); font-size: 1.15rem;"></i>';

        const correctOpt = parentCard.querySelector('[data-correct="true"]');
        if (correctOpt) {
            correctOpt.classList.add('correct');
            const cIcon = correctOpt.querySelector('.option-status-icon');
            if (cIcon) cIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
        }
    }

    const expBox = parentCard.querySelector('.explanation-box');
    if (expBox) expBox.style.display = 'block';
}

function showMixedContentNoticeIfNeeded() {
    if (window.location.protocol === 'https:' && !localStorage.getItem('ICT_LIVE_API_URL')) {
        if (document.getElementById('mixed-content-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'mixed-content-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1E293B;
            color: #F8FAFC;
            padding: 14px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 99999;
            font-size: 0.88rem;
            max-width: 90%;
            width: 520px;
            border-left: 4px solid #F59E0B;
            line-height: 1.5;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        `;
        banner.innerHTML = `
            <div style="font-size: 1.3rem; line-height: 1;">💡</div>
            <div style="flex: 1;">
                <strong>লোকাল ডাটাবেজের প্রশ্ন দেখতে চান?</strong><br>
                সাইটটি GitHub Pages (HTTPS)-এ রয়েছে। লোকাল MongoDB ডাটা দেখতে ব্রাউজারে <a href="http://localhost:5000" target="_blank" style="color: #60A5FA; font-weight: 600;">http://localhost:5000</a> ওপেন করুন অথবা ব্যাকএন্ডটি Render-এ ডেপ্লয় করুন।
            </div>
            <button onclick="this.parentElement.remove()" style="background:transparent; border:none; color:#94A3B8; font-size:1.2rem; cursor:pointer;">&times;</button>
        `;
        document.body.appendChild(banner);
    }
}

window.CONFIG = CONFIG;
window.ApiService = ApiService;
window.MOCK_DATA = MOCK_DATA;
window.renderMCQCardHTML = renderMCQCardHTML;
window.renderCQCardHTML = renderCQCardHTML;
window.handleMCQOptionClick = handleMCQOptionClick;
window.checkMCQAnswer = checkMCQAnswer;
window.checkChapterMCQ = checkMCQAnswer;
