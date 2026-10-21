/**
 * ICT EASY LEARNING - API & DATA SERVICE
 * Handles communication with Supabase / REST Backend API.
 * Defaults to Mock Data until real credentials are provided.
 */

const CONFIG = {
    // লাইভ ডেটাবেজ চালু রাখতে false রাখুন
    USE_MOCK_API: false,
    
    // Supabase আসল API URL (সরাসরি প্রজেক্ট REST এন্ডপয়েন্ট)
    SUPABASE_URL: 'https://adlgyyofqjclvcmugyuk.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbGd5eW9mcWpjbHZjbXVneXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MTYwMTMsImV4cCI6MjEwODA5MjAxM30.xWbpvsxouiJlHQ9mWmZuPr2HFRYCJK9mAEY0xTHdxo0',
    
    // অথবা কোনো কাস্টম REST API URL থাকলে:
    CUSTOM_API_URL: '',
    
    TIMEOUT: 8000
};

// Supabase URL সঠিক ফর্মেটে রূপান্তরকারী হেল্পার (ড্যাশবোর্ড URL দিলে স্বয়ংক্রিয় ঠিক করে নেবে)
function getCleanSupabaseUrl() {
    let raw = (CONFIG.SUPABASE_URL || '').trim();
    const dashboardMatch = raw.match(/project\/([a-z0-9_-]+)/i);
    if (dashboardMatch && dashboardMatch[1]) {
        return `https://${dashboardMatch[1]}.supabase.co`;
    }
    return raw.replace(/\/+$/, '');
}

// Supabase REST API কল করার জেনেরিক হেল্পার ফাংশন
async function fetchFromSupabase(tableEndpoint, options = {}) {
    const baseUrl = getCleanSupabaseUrl();
    if (!baseUrl || baseUrl.includes('your-project-id')) {
        throw new Error("Supabase URL not configured");
    }

    const url = `${baseUrl}/rest/v1/${tableEndpoint}`;
    const headers = {
        'apikey': CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// ==========================================
// MOCK DATA REPOSITORY (এইচএসসি আইসিটি তথ্যভাণ্ডার)
// ==========================================
const MOCK_DATA = {
    // অধ্যায়ভিত্তিক তথ্য
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

    // বোর্ড প্রশ্ন তালিকা (বোর্ড ও সাল অনুযায়ী)
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

    // শীর্ষ কলেজ তালিকা
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

    // মডেল টেস্ট তালিকা
    modelTests: [
        {
            id: "mt-01",
            title: "পূর্ণাঙ্গ চূড়ান্ত মডেল টেস্ট - ০১",
            type: "full",
            badge: "Full Syllabus",
            questions_count: 25,
            duration: 25, // মিনিট
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
        },
        {
            id: "mt-03",
            title: "HTML ও ওয়েব ডিজাইন স্পিড টেস্ট",
            type: "chapter",
            badge: "Chapter 4",
            questions_count: 20,
            duration: 15,
            marks: 20,
            negative_marking: 0,
            participants: 2310
        },
        {
            id: "mt-04",
            title: "সি প্রোগ্রামিং ও অ্যালগরিদম কুইজ",
            type: "chapter",
            badge: "Chapter 5",
            questions_count: 20,
            duration: 20,
            marks: 20,
            negative_marking: 0,
            participants: 1850
        },
        {
            id: "mt-05",
            title: "সংখ্যা পদ্ধতি ও লজিক গেট মেগা টেস্ট",
            type: "chapter",
            badge: "Chapter 3",
            questions_count: 25,
            duration: 25,
            marks: 25,
            negative_marking: 0.25,
            participants: 2150
        }
    ],

    // অফলাইন বা ফলব্যাক এইচএসসি আইসিটি প্রশ্নভাণ্ডার
    questions: [
        {
            id: 1,
            question_text: "নিচের কোনটি অপটিক্যাল ফাইবার কেবলের সবচেয়ে ভেতরের স্তর?",
            options: ["কোর (Core)", "ক্ল্যাডিং (Cladding)", "জ্যাকেট (Jacket)", "বাফার (Buffer)"],
            correct_index: 0,
            explanation: "অপটিক্যাল ফাইবারের সবচেয়ে ভেতরের ডাই-ইলেকট্রিক স্তরটিকে কোর (Core) বলা হয়, যার মধ্য দিয়ে আলোকরশ্মি পূর্ণ অভ্যন্তরীণ প্রতিফলনের মাধ্যমে চলাচল করে।",
            chapter_id: 2,
            board_id: "dhaka",
            year: "2024"
        },
        {
            id: 2,
            question_text: "(25)₁₀ এর সমতুল্য বাইনারি মান নিচের কোনটি?",
            options: ["(11001)₂", "(10011)₂", "(11010)₂", "(11100)₂"],
            correct_index: 0,
            explanation: "25 কে ২ দ্বারা ক্রমাগত ভাগ করলে ভাগশেষ নিচ থেকে উপরে সাজালে (11001)₂ পাওয়া যায় (16 + 8 + 1 = 25)।",
            chapter_id: 3,
            board_id: "dhaka",
            year: "2024"
        },
        {
            id: 3,
            question_text: "HTML-এ একটি নতুন অনুচ্ছেদ (Paragraph) লেখার জন্য কোন ট্যাগটি ব্যবহার করা হয়?",
            options: ["<para>", "<p>", "<br>", "<pg>"],
            correct_index: 1,
            explanation: "HTML ডকুমেন্টে প্যারাগ্রাফ বা অনুচ্ছেদ চিহ্নিত করার জন্য <p>...</p> ট্যাগ ব্যবহৃত হয়।",
            chapter_id: 5,
            board_id: "rajshahi",
            year: "2024"
        },
        {
            id: 4,
            question_text: "সি ভাষায় লুপ নিয়ন্ত্রণের জন্য নিচের কোন কি-ওয়ার্ডটি ব্যবহার করা হয়?",
            options: ["goto", "break", "include", "define"],
            correct_index: 1,
            explanation: "সি ভাষায় লুপের স্বাভাবিক পুনরাবৃত্তি মাঝপথে থামাতে বা লুপ থেকে তাৎক্ষণিক বের হতে break স্টেটমেন্ট ব্যবহার করা হয়।",
            chapter_id: 6,
            board_id: "chattogram",
            year: "2024"
        },
        {
            id: 5,
            question_text: "ব্যক্তির শারীরিক বৈশিষ্ট্য বা আচরণের ওপর ভিত্তি করে শনাক্তকরণের প্রযুক্তিকে কী বলে?",
            options: ["বায়োইনফরমেটিক্স", "বায়োমেট্রিক্স", "ন্যানোটেকনোলজি", "রোবোটিক্স"],
            correct_index: 1,
            explanation: "বায়োমেট্রিক্স হলো এমন একটি প্রযুক্তি যার মাধ্যমে মানুষের শারীরিক অঙ্গসংস্থান বা আচরণগত বৈশিষ্ট্যের ওপর ভিত্তি করে তাকে নির্ভুলভাবে শনাক্ত করা যায়।",
            chapter_id: 1,
            board_id: "dhaka",
            year: "2023"
        },
        {
            id: 6,
            question_text: "দুটি ভিন্ন প্রোটোকলযুক্ত নেটওয়ার্ককে সংযুক্ত করতে কোন নেটওয়ার্ক ডিভাইসটি ব্যবহৃত হয়?",
            options: ["হাব (Hub)", "সুইচ (Switch)", "ব্রিজ (Bridge)", "গেটওয়ে (Gateway)"],
            correct_index: 3,
            explanation: "ভিন্ন প্রোটোকল বিশিষ্ট দুই বা ততোধিক নেটওয়ার্ককে যুক্ত করার জন্য গেটওয়ে (Gateway) ব্যবহৃত হয়, যা প্রোটোকল রূপান্তরের কাজ করে।",
            chapter_id: 2,
            board_id: "jashore",
            year: "2023"
        },
        {
            id: 7,
            question_text: "NAND গেটের আউটপুট কখন ০ (Low) হয়?",
            options: ["সকল ইনপুট ১ হলে", "সকল ইনপুট ০ হলে", "যেকোনো একটি ইনপুট ০ হলে", "যেকোনো একটি ইনপুট ১ হলে"],
            correct_index: 0,
            explanation: "NAND গেট হলো AND গেটের বিপরীত। AND গেটে সবগুলো ইনপুট ১ হলে আউটপুট ১ হয়, তাই NAND গেটে আউটপুট ০ হয়।",
            chapter_id: 4,
            board_id: "comilla",
            year: "2024"
        },
        {
            id: 8,
            question_text: "HTML-এ হাইপারলিংক তৈরি করতে কোন অ্যাট্রিবিউটটি বাধ্যতামূলক?",
            options: ["src", "href", "link", "target"],
            correct_index: 1,
            explanation: "<a> ট্যাগের সাথে গন্তব্য লিংক বা ইউআরএল নির্ধারণের জন্য href (Hypertext Reference) অ্যাট্রিবিউট ব্যবহার করতে হয়।",
            chapter_id: 5,
            board_id: "dhaka",
            year: "2024"
        }
    ],

    // পিডিএফ রিসোর্স ও সাজেশন
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
        },
        {
            id: "pdf-02",
            title: "সি প্রোগ্রামিং (C Programming) কমপ্লিট হ্যান্ডনোট ও ৫০টি গুরুত্বপূর্ণ কোড",
            category: "handnote",
            chapter: "৫ম অধ্যায়",
            size: "4.5 MB",
            pages: 36,
            downloads: 9820,
            download_url: "#"
        },
        {
            id: "pdf-03",
            title: "HTML ও ওয়েব ডিজাইন সমস্ত ট্যাগ চিটশিট ও আউটপুট প্র্যাকটিস বুকলেট",
            category: "cheatsheet",
            chapter: "৪র্থ অধ্যায়",
            size: "2.1 MB",
            pages: 18,
            downloads: 11200,
            download_url: "#"
        },
        {
            id: "pdf-04",
            title: "সংখ্যা পদ্ধতি রূপান্তর ও ২ এর পরিপূরক ম্যাজিক ট্রিকস ও সমাধান শিট",
            category: "handnote",
            chapter: "৩য় অধ্যায়",
            size: "2.9 MB",
            pages: 24,
            downloads: 8750,
            download_url: "#"
        },
        {
            id: "pdf-05",
            title: "টপ ১০ কলেজের টেস্ট পরীক্ষার সৃজনশীল প্রশ্ন ও আদর্শ উত্তরব্যাংক",
            category: "test_paper",
            chapter: "সকল অধ্যায়",
            size: "6.2 MB",
            pages: 58,
            downloads: 14300,
            download_url: "#"
        }
    ],

    // ইউজার প্রোফাইল ডাটা
    userProfile: {
        name: "মোঃ তানভীর আহমেদ",
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
        },
        chapter_progress: [
            { name: "১ম অধ্যায়: তথ্য ও যোগাযোগ প্রযুক্তি", progress: 85 },
            { name: "২য় অধ্যায়: নেটওয়ার্কিং", progress: 70 },
            { name: "৩য় অধ্যায়: সংখ্যা পদ্ধতি ও গেট", progress: 80 },
            { name: "৪র্থ অধ্যায়: HTML ও ওয়েব", progress: 95 },
            { name: "৫ম অধ্যায়: সি প্রোগ্রামিং", progress: 55 },
            { name: "৬ষ্ঠ অধ্যায়: ডাটাবেজ", progress: 40 }
        ],
        recent_activity: [
            { test: "পূর্ণাঙ্গ মডেল টেস্ট - ০১", score: "২৩/২৫", date: "গতকাল", status: "পাস" },
            { test: "HTML স্পিড কুইজ", score: "১৯/২০", date: "৩ দিন আগে", status: "চমৎকার" },
            { test: "সংখ্যা পদ্ধতি টেস্ট", score: "২২/২৫", date: "৫ দিন আগে", status: "পাস" }
        ]
    }
};

// ==========================================
// API SERVICE METHODS
// ==========================================
const ApiService = {
    // অধ্যায় তালিকা লোড
    async getChapters() {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.chapters);
        }
        try {
            return await fetchFromSupabase('chapters?select=*&order=id.asc');
        } catch (e) {
            console.warn("Falling back to mock chapters:", e);
            return MOCK_DATA.chapters;
        }
    },

    // বোর্ড তালিকা লোড
    async getBoards() {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.boards);
        }
        try {
            return await fetchFromSupabase('boards?select=*&order=id.asc');
        } catch (e) {
            console.warn("Falling back to mock boards:", e);
            return MOCK_DATA.boards;
        }
    },

    // কলেজ তালিকা লোড
    async getColleges() {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.colleges);
        }
        try {
            return await fetchFromSupabase('colleges?select=*&order=total_tests.desc');
        } catch (e) {
            console.warn("Falling back to mock colleges:", e);
            return MOCK_DATA.colleges;
        }
    },

    // মডেল টেস্ট তালিকা লোড
    async getModelTests() {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.modelTests);
        }
        try {
            return await fetchFromSupabase('model_tests?select=*&order=created_at.asc');
        } catch (e) {
            console.warn("Falling back to mock model tests:", e);
            return MOCK_DATA.modelTests;
        }
    },

    // পিডিএফ সাজেশন লোড
    async getPdfSuggestions() {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.pdfSuggestions);
        }
        try {
            return await fetchFromSupabase('pdf_suggestions?select=*&order=created_at.desc');
        } catch (e) {
            console.warn("Falling back to mock pdf suggestions:", e);
            return MOCK_DATA.pdfSuggestions;
        }
    },

    // বোর্ড প্রশ্ন লোড (MCQ) - স্মার্ট ফিল্টার ও অটো-ফলব্যাক
    async getBoardMCQ(boardId, year) {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.questions || []);
        }
        try {
            let endpoint = 'mcq_questions?select=*';
            if (boardId) endpoint += `&board_id=eq.${boardId}`;
            if (year) endpoint += `&year=eq.${year}`;
            endpoint += '&order=id.asc';
            
            let data = await fetchFromSupabase(endpoint);
            if (data && data.length > 0) return data;
            
            // যদি সিলেক্টেড সালের প্রশ্ন এখনও যুক্ত না হয়ে থাকে, তবে ঐ বোর্ডের অন্যান্য সালের প্রশ্ন আনবে
            if (boardId) {
                data = await fetchFromSupabase(`mcq_questions?select=*&board_id=eq.${boardId}&order=id.asc`);
                if (data && data.length > 0) return data;
            }
            
            // যদি ঐ বোর্ডের প্রশ্নও না থাকে, তবে ডাটাবেজের সকল উপলব্ধ প্রশ্ন থেকে আনবে
            data = await fetchFromSupabase('mcq_questions?select=*&order=id.asc&limit=25');
            if (data && data.length > 0) return data;

            return MOCK_DATA.questions || [];
        } catch (e) {
            console.warn("Falling back to mock board MCQ:", e);
            return MOCK_DATA.questions || [];
        }
    },

    // বোর্ড সৃজনশীল প্রশ্ন লোড (CQ)
    async getBoardCQ(boardId, year) {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve([]);
        }
        try {
            let endpoint = 'cq_questions?select=*';
            if (boardId) endpoint += `&board_id=eq.${boardId}`;
            if (year) endpoint += `&year=eq.${year}`;
            endpoint += '&order=id.asc';
            
            let data = await fetchFromSupabase(endpoint);
            if (data && data.length > 0) return data;
            
            if (boardId) {
                data = await fetchFromSupabase(`cq_questions?select=*&board_id=eq.${boardId}&order=id.asc`);
                if (data && data.length > 0) return data;
            }
            return await fetchFromSupabase('cq_questions?select=*&order=id.asc&limit=10');
        } catch (e) {
            console.warn("Falling back to mock board CQ:", e);
            return [];
        }
    },

    // অধ্যায়ভিত্তিক MCQ লোড
    async getChapterMCQ(chapterId) {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.questions || []);
        }
        try {
            let endpoint = 'mcq_questions?select=*';
            if (chapterId) endpoint += `&chapter_id=eq.${chapterId}`;
            endpoint += '&order=id.asc';
            
            let data = await fetchFromSupabase(endpoint);
            if (data && data.length > 0) return data;
            
            // নির্দিষ্ট অধ্যায়ে না থাকলে ডাটাবেজের যেকোনো প্রশ্ন লোড
            data = await fetchFromSupabase('mcq_questions?select=*&order=id.asc&limit=25');
            if (data && data.length > 0) return data;

            return MOCK_DATA.questions || [];
        } catch (e) {
            console.warn("Falling back to mock chapter MCQ:", e);
            return MOCK_DATA.questions || [];
        }
    },

    // টেস্ট পেপার / কলেজ ভিত্তিক MCQ লোড
    async getCollegeMCQ(collegeId) {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.questions || []);
        }
        try {
            let endpoint = 'mcq_questions?select=*';
            if (collegeId) endpoint += `&college_id=eq.${collegeId}`;
            endpoint += '&order=id.asc';
            
            let data = await fetchFromSupabase(endpoint);
            if (data && data.length > 0) return data;
            
            data = await fetchFromSupabase('mcq_questions?select=*&order=id.asc&limit=25');
            if (data && data.length > 0) return data;

            return MOCK_DATA.questions || [];
        } catch (e) {
            console.warn("Falling back to mock college MCQ:", e);
            return MOCK_DATA.questions || [];
        }
    },

    // সকল MCQ লোড (মডেল টেস্ট বা কুইজের জন্য)
    async getAllMCQ(limit = 25) {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.questions || []);
        }
        try {
            let data = await fetchFromSupabase(`mcq_questions?select=*&order=id.asc&limit=${limit}`);
            if (data && data.length > 0) return data;
            return MOCK_DATA.questions || [];
        } catch (e) {
            console.warn("Falling back to mock all MCQ:", e);
            return MOCK_DATA.questions || [];
        }
    },

    // ইউজার প্রোফাইল ডাটা লোড
    async getUserProfile() {
        if (CONFIG.USE_MOCK_API) {
            return Promise.resolve(MOCK_DATA.userProfile);
        }
        try {
            const data = await fetchFromSupabase('user_profiles?select=*&limit=1');
            return data.length > 0 ? data[0] : MOCK_DATA.userProfile;
        } catch (e) {
            console.warn("Falling back to mock user profile:", e);
            return MOCK_DATA.userProfile;
        }
    },

    // মডেল টেস্টের ফলাফল সেভ করা
    async saveExamResult(resultData) {
        if (CONFIG.USE_MOCK_API) {
            console.log("Mock Save Exam Result:", resultData);
            return Promise.resolve({ success: true, mock: true });
        }
        try {
            return await fetchFromSupabase('exam_results', {
                method: 'POST',
                body: JSON.stringify(resultData)
            });
        } catch (e) {
            console.error("Failed to save exam result:", e);
            return { error: e.message };
        }
    }
};

// ==========================================
// UNIVERSAL MCQ CARD RENDERING & CLICK HANDLER
// ==========================================

// সার্বজনীন MCQ কার্ড রেন্ডারিং ফাংশন
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

// সার্বজনীন অপশন ক্লিক হ্যান্ডলার (একবার ক্লিক করলে লক হবে এবং সঠিক/ভুল সাথে সাথে দেখাবে)
function handleMCQOptionClick(element, qIndex, selectedIndex, correctIndex) {
    const parentCard = element.closest('.question-card');
    if (!parentCard) return;
    
    // ইতোমধ্যে উত্তর দেওয়া থাকলে পুনরায় কোনো ক্লিক নেওয়া হবে না (লক)
    if (parentCard.classList.contains('answered')) return;
    
    parentCard.classList.add('answered');
    const options = parentCard.querySelectorAll('.option-item');
    
    // কার্ডের সকল অপশন লক করে দেওয়া যাতে মাল্টিপল ক্লিক না করা যায়
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
        
        // সঠিক উত্তরটি স্বয়ংক্রিয়ভাবে সবুজ রঙে হাইলাইট করা
        const correctOpt = parentCard.querySelector('[data-correct="true"]') || options[correctIndex];
        if (correctOpt) {
            correctOpt.classList.add('correct');
            const cIcon = correctOpt.querySelector('.option-status-icon');
            if (cIcon) cIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
        }
    }
    
    // ব্যাখ্যাটি অবিলম্বে ওপেন করা
    const expBox = parentCard.querySelector('.explanation-box');
    if (expBox) {
        expBox.style.display = 'block';
    }
}

// ব্যাকওয়ার্ড কম্প্যাটিবিলিটির জন্য গ্লোবাল ক্লিক ফাংশন
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

// গ্লোবালি এক্সপোর্ট
window.ApiService = ApiService;
window.MOCK_DATA = MOCK_DATA;
window.renderMCQCardHTML = renderMCQCardHTML;
window.handleMCQOptionClick = handleMCQOptionClick;
window.checkMCQAnswer = checkMCQAnswer;
window.checkChapterMCQ = checkMCQAnswer;
