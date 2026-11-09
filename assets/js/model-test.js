
// লাইভ পরীক্ষা ইউজারের সাবমিশন ট্র্যাকিং (লাইভ চলাকালীন একবারই দিতে পারবে)
const SUBMITTED_LIVE_EXAMS_KEY = 'ict_submitted_live_exams';

function getSubmittedLiveExams() {
    try {
        return JSON.parse(localStorage.getItem(SUBMITTED_LIVE_EXAMS_KEY) || '{}');
    } catch(e) {
        return {};
    }
}

function hasUserSubmittedLiveExam(examKey) {
    if (!examKey) return false;
    const submitted = getSubmittedLiveExams();
    return !!submitted[String(examKey).trim()];
}

function recordLiveExamSubmission(examKey, score, total, details = {}) {
    if (!examKey) return;
    const submitted = getSubmittedLiveExams();
    const wrongCount = details.wrongCount !== undefined ? details.wrongCount : (total - score);
    const skippedCount = details.skippedCount !== undefined ? details.skippedCount : 0;
    const scorePercentage = details.scorePercentage !== undefined ? details.scorePercentage : (total > 0 ? Math.round((score / total) * 100) : 0);
    submitted[String(examKey).trim()] = {
        submittedAt: new Date().toISOString(),
        score,
        total,
        correctCount: score,
        wrongCount,
        skippedCount,
        scorePercentage,
        examTitle: details.examTitle || currentExamTitle || ('Model Test ' + examKey)
    };
    try {
        localStorage.setItem(SUBMITTED_LIVE_EXAMS_KEY, JSON.stringify(submitted));
    } catch(e) {}
}

let currentExamKey = '';
let currentExamIsLive = false;

/**
 * MODEL TEST SYSTEM SCRIPT
 * Complete interactive exam engine with vertical scrollable questions, live timer, scoring, and question navigator.
 * Dynamically loads questions from Supabase backend via ApiService.
 */

// ফলব্যাক প্রশ্নাবলি (যদি ডাটাবেজ অফলাইন থাকে)
const FALLBACK_EXAM_QUESTIONS = [
    {
        id: 1,
        question: "নিচের কোনটি অপটিক্যাল ফাইবার কেবলের সবচেয়ে ভেতরের স্তর?",
        options: ["কোর (Core)", "ক্ল্যাডিং (Cladding)", "জ্যাকেট (Jacket)", "বাফার (Buffer)"],
        correct: 0,
        explanation: "অপটিক্যাল ফাইবারের সবচেয়ে ভেতরের ডাই-ইলেকট্রিক স্তরটিকে কোর (Core) বলা হয়, যার মধ্য দিয়ে আলোকরশ্মি পূর্ণ অভ্যন্তরীণ প্রতিফলনের মাধ্যমে চলাচল করে।"
    },
    {
        id: 2,
        question: "(25)₁₀ এর সমতুল্য বাইনারি মান নিচের কোনটি?",
        options: ["(11001)₂", "(10011)₂", "(11010)₂", "(11100)₂"],
        correct: 0,
        explanation: "25 কে ২ দ্বারা ক্রমাগত ভাগ করলে ভাগশেষ নিচ থেকে উপরে সাজালে (11001)₂ পাওয়া যায় (16 + 8 + 1 = 25)।"
    },
    {
        id: 3,
        question: "HTML-এ একটি নতুন অনুচ্ছেদ (Paragraph) লেখার জন্য কোন ট্যাগটি ব্যবহার করা হয়?",
        options: ["<para>", "<p>", "<br>", "<pg>"],
        correct: 1,
        explanation: "HTML ডকুমেন্টে প্যারাগ্রাফ বা অনুচ্ছেদ চিহ্নিত করার জন্য <p>...</p> ট্যাগ ব্যবহৃত হয়।"
    },
    {
        id: 4,
        question: "সি (C) ভাষায় নিচের কোনটি একটি সঠিক ভেরিয়েবল নেম?",
        options: ["1total", "total_marks", "float", "my marks"],
        correct: 1,
        explanation: "সি ভাষায় ভেরিয়েবলের নাম সংখ্যা দিয়ে শুরু হতে পারে না, কী-ওয়ার্ড ব্যবহার করা যায় না এবং স্পেস থাকা অবৈধ। তাই 'total_marks' সঠিক।"
    },
    {
        id: 5,
        question: "রিলেশনাল ডাটাবেজ মডেলে দুই বা ততোধিক টেবিলের মধ্যে সম্পর্ক স্থাপনের জন্য কোন কী (Key) ব্যবহৃত হয়?",
        options: ["প্রাইমারি কী (Primary Key)", "ফরেন কী (Foreign Key)", "ক্যান্ডিডেট কী (Candidate Key)", "সুপার কী (Super Key)"],
        correct: 1,
        explanation: "একটি টেবিলের প্রাইমারি কী যখন অন্য কোনো টেবিলে ব্যবহৃত হয় তখন তাকে ফরেন কী (Foreign Key) বলে, যা টেবিলসমূহের মধ্যে রিলেশন স্থাপন করে।"
    },
    {
        id: 6,
        question: "নিচের কোন লজিক গেটের সকল ইনপুট ১ (High) হলে আউটপুট ০ (Low) হয়?",
        options: ["AND গেট", "OR গেট", "NAND গেট", "XOR গেট"],
        correct: 2,
        explanation: "NAND গেট হলো AND গেটের বিপরীত। AND গেটে সবগুলো ইনপুট ১ হলে আউটপুট ১ হয়, ফলে NAND গেটে আউটপুট ০ হয়।"
    },
    {
        id: 7,
        question: "ক্লাউড কম্পিউটিংয়ের কোন সেবা মডেলটি সফটওয়্যার ব্যবহারের প্ল্যাটফর্ম প্রদান করে?",
        options: ["IaaS", "PaaS", "SaaS", "DaaS"],
        correct: 1,
        explanation: "PaaS (Platform as a Service) গ্রাহককে সফটওয়্যার ডেভেলপ ও রান করার জন্য অপারেটিং সিস্টেম ও প্ল্যাটফর্ম সরবরাহ করে।"
    },
    {
        id: 8,
        question: "HTML ডকুমেন্টে ছবি (Image) যুক্ত করার জন্য সঠিক ট্যাগ কোনটি?",
        options: ["<picture>", "<img>", "<image>", "<src>"],
        correct: 1,
        explanation: "ওয়েবপেজে ছবি যুক্ত করার জন্য এম্পটি ট্যাগ <img> ব্যবহার করা হয় এবং ছবির লিঙ্ক 'src' অ্যাট্রিবিউটে দেওয়া হয়।"
    }
];

let activeExamQuestions = [...FALLBACK_EXAM_QUESTIONS];
let userAnswers = {}; // { questionIndex: selectedOptionIndex }
let timerInterval = null;
let remainingSeconds = 25 * 60; // 25 মিনিট
let currentExamTitle = 'পূর্ণাঙ্গ চূড়ান্ত মডেল টেস্ট - ০১';
let currentExamDuration = 25;
let isExamSubmitted = false;

let allModelTestsData = [];
let liveCountdownInterval = null;
let currentFilterCategory = 'all';

function toBanglaNum(num) {
    if (typeof window.toBanglaNum === 'function') return window.toBanglaNum(num);
    const bDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, d => bDigits[d] || d);
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    initFilterTabs();
    loadAllModelTests();
});

function initFilterTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            currentFilterCategory = filter;
            filterTests(filter);
        });
    });
}

function filterTests(filter) {
    currentFilterCategory = filter || 'all';
    const cards = document.querySelectorAll('.model-tests-grid .test-card');
    cards.forEach(card => {
        if (currentFilterCategory === 'all') {
            card.style.display = 'flex';
        } else if (currentFilterCategory === 'live') {
            const isLive = card.getAttribute('data-is-live') === 'true' || card.classList.contains('is-live-active');
            card.style.display = isLive ? 'flex' : 'none';
        } else if (card.getAttribute('data-category') === currentFilterCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function isExamLiveNow(item) {
    if (!item) return false;
    const flagLive = (item.isLive === true || item.isLive === 'true');
    if (!flagLive) return false;

    const now = new Date();
    if (item.endTime) {
        const end = new Date(item.endTime);
        if (now > end) return false; // লাইভ সময় শেষ
    }
    if (item.startTime) {
        const start = new Date(item.startTime);
        if (now < start) return false; // এখনও শুরু হয়নি
    }
    return true;
}

function getRemainingLiveTimeText(item) {
    if (!item) return '';
    if (!item.endTime) return '🔴 লাইভ চলছে';
    const now = new Date();
    const end = new Date(item.endTime);
    const diffMs = end - now;
    if (diffMs <= 0) {
        if (item.isLive === true || item.isLive === 'true') {
            return '🔴 লাইভ চলছে';
        }
        return 'সময় সমাপ্ত';
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = n => (n < 10 ? '0' + n : '' + n);
    if (hours > 0) {
        return 'সময় বাকি: ' + toBanglaNum(pad(hours)) + ':' + toBanglaNum(pad(minutes)) + ':' + toBanglaNum(pad(seconds));
    }
    return 'সময় বাকি: ' + toBanglaNum(pad(minutes)) + ' মি. ' + toBanglaNum(pad(seconds)) + ' সে.';
}

function generateSingleCardHtml(item, prefix = 'card-mt-') {
    const isLive = isExamLiveNow(item);
    const examKey = item.examNo || (item.serialNo < 10 ? '0' + item.serialNo : '' + item.serialNo);
    const dateStr = item.date || '01-11-26';
    const chaptersStr = item.chapters || 'প্রথম অধ্যায়';
    const participantsCount = item.participants || 547;
    const totalQ = item.totalQuestions || 25;
    const duration = item.duration || 25;
    const totalM = item.totalMarks || 25;
    const titleSafe = (item.title || ('Model Test ' + examKey)).replace(/'/g, "\\'");
    const hasSubmittedLive = isLive && hasUserSubmittedLiveExam(examKey);

    let btnText = item.buttonText || (isLive ? 'Start Live Exam' : 'Start Previous Live Exam');
    if (isLive) {
        if (hasSubmittedLive) {
            btnText = 'পরীক্ষা সম্পন্ন হয়েছে';
        } else {
            btnText = 'Start Live Exam';
        }
    } else {
        btnText = 'Start Previous Live Exam';
    }

    const btnClass = hasSubmittedLive ? 'mt-start-btn submitted-live-btn' : 'mt-start-btn';

    let actionBtnHtml = '';
    if (hasSubmittedLive) {
        actionBtnHtml = `
            <div class="mt-btn-split-group">
                <button type="button" class="mt-start-btn mt-split-left submitted-live-btn" onclick="startExam('${titleSafe}', ${duration}, '${examKey}')" title="পরীক্ষা সম্পন্ন হয়েছে">
                    <i class="fa-solid fa-circle-check"></i> <span>পরীক্ষা সম্পন্ন হয়েছে</span>
                </button>
                <button type="button" class="mt-start-btn mt-split-right mt-marksheet-btn" onclick="openLiveExamMarksheet('${examKey}', '${titleSafe}')" title="মার্ক শীট ও বিস্তারিত রেজাল্ট দেখুন">
                    <i class="fa-solid fa-square-poll-vertical"></i> <span>মার্ক শীট</span>
                </button>
            </div>
        `;
    } else {
        actionBtnHtml = `
            <button class="${btnClass}" onclick="startExam('${titleSafe}', ${duration}, '${examKey}')">
                <i class="fa-solid ${hasSubmittedLive ? 'fa-circle-check' : 'fa-play'}"></i> <span>${escapeHtml(btnText)}</span>
            </button>
        `;
    }

    return `
        <div class="test-card model-test-card ${isLive ? 'is-live-active' : ''}" 
             data-category="${item.category || 'full'}" 
             data-is-live="${isLive ? 'true' : 'false'}"
             id="${prefix ? prefix + examKey : 'card-mt-' + examKey}">
            <div>
                <!-- Top Row -->
                <div class="mt-top-row">
                    <div class="mt-date-pill">Date: ${escapeHtml(dateStr)}</div>
                    <div class="mt-top-right">
                        <div class="mt-badges-row">
                            <div class="mt-participants-pill">
                                <i class="fa-solid fa-users"></i> ${toBanglaNum(participantsCount)} জন
                            </div>
                            <div class="mt-live-badge" id="live-badge-${prefix}${examKey}" style="${isLive ? '' : 'display:none;'}">
                                <span class="mt-live-dot"></span> LIVE
                            </div>
                        </div>
                        <!-- Live Remaining Time below LIVE badge -->
                        <div class="mt-live-countdown" id="live-countdown-${prefix}${examKey}" style="${isLive ? '' : 'display:none;'}">
                            ${isLive ? getRemainingLiveTimeText(item) : ''}
                        </div>
                    </div>
                </div>

                <!-- Heading & Chapters -->
                <h3 class="mt-exam-no">Exam No: ${escapeHtml(examKey)}</h3>
                <div class="mt-chapters">Chapters: <span>${escapeHtml(chaptersStr)}</span></div>

                <!-- Meta info row -->
                <div class="mt-meta-row">
                    <span class="mt-meta-item"><i class="fa-solid fa-circle-question"></i> ${toBanglaNum(totalQ)}টি প্রশ্ন</span>
                    <span class="mt-meta-item"><i class="fa-solid fa-clock"></i> ${toBanglaNum(duration)} মিনিট</span>
                    <span class="mt-meta-item"><i class="fa-solid fa-award"></i> ${toBanglaNum(totalM)} নম্বর</span>
                </div>
            </div>

            <!-- Action Button -->
            ${actionBtnHtml}
        </div>
    `;
}

function renderModelTestCards(list) {
    // মডেল টেস্ট গ্রিডে লাইভ এক্সামগুলো আগে রেখে সাজানো
    const sortedList = [...list].sort((a, b) => {
        const liveA = isExamLiveNow(a) ? 1 : 0;
        const liveB = isExamLiveNow(b) ? 1 : 0;
        if (liveA !== liveB) return liveB - liveA; // লাইভগুলো প্রথমে
        return (a.serialNo || 0) - (b.serialNo || 0);
    });

    const grid = document.getElementById('modelTestsGrid') || document.querySelector('.model-tests-grid');
    if (grid) {
        grid.innerHTML = sortedList.map(item => generateSingleCardHtml(item, '')).join('');
    }

    filterTests(currentFilterCategory);
}

function startLiveCountdowns() {
    if (liveCountdownInterval) clearInterval(liveCountdownInterval);
    liveCountdownInterval = setInterval(() => {
        allModelTestsData.forEach(item => {
            const isLive = isExamLiveNow(item);
            const examKey = item.examNo || (item.serialNo < 10 ? '0' + item.serialNo : '' + item.serialNo);
            
            // গ্রিড কার্ড টাইমার
            const card = document.getElementById('card-mt-' + examKey);
            const badge = document.getElementById('live-badge-' + examKey);
            const timer = document.getElementById('live-countdown-' + examKey);
            if (badge) badge.style.display = isLive ? 'inline-flex' : 'none';
            if (timer) {
                if (isLive) {
                    timer.style.display = 'block';
                    timer.innerText = getRemainingLiveTimeText(item);
                } else {
                    timer.style.display = 'none';
                }
            }

            if (card) {
                if (isLive) {
                    if (!card.classList.contains('is-live-active')) {
                        card.classList.add('is-live-active');
                        card.setAttribute('data-is-live', 'true');
                    }
                } else {
                    if (card.classList.contains('is-live-active')) {
                        card.classList.remove('is-live-active');
                        card.setAttribute('data-is-live', 'false');
                        const btn = card.querySelector('.mt-start-btn');
                        if (btn && !btn.classList.contains('submitted-live-btn')) {
                            btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Start Previous Live Exam</span>';
                        }
                    }
                }
            }
        });
    }, 1000);
}

async function loadAllModelTests() {
    try {
        let list = [];
        if (typeof ApiService !== 'undefined' && ApiService.getModelTests) {
            list = await ApiService.getModelTests();
        }
        if (!list || list.length === 0) {
            const resp = await fetch('../database/model_tests.json');
            if (resp.ok) list = await resp.json();
        }

        if (list && list.length > 0) {
            allModelTestsData = list.sort((a, b) => (a.serialNo || 0) - (b.serialNo || 0));
            renderModelTestCards(allModelTestsData);
            startLiveCountdowns();
        } else {
            startLiveCountdowns();
        }
    } catch (err) {
        console.warn('loadAllModelTests warning:', err);
    }
}

/**
 * পরীক্ষা শুরু করা
 */
async function startExam(testTitle, durationMins = 25, examNo = '') {
    let examKey = examNo || '';
    if (!examKey && testTitle) {
        const match = String(testTitle).match(/(\d+)/);
        if (match) {
            const n = parseInt(match[1], 10);
            examKey = n < 10 ? '0' + n : '' + n;
        }
    }

    const examItem = allModelTestsData.find(e => {
        const k = e.examNo || (e.serialNo < 10 ? '0' + e.serialNo : '' + e.serialNo);
        return k === examKey || (e.title && e.title.trim() === String(testTitle).trim());
    });

    const isLive = examItem ? isExamLiveNow(examItem) : false;

    // লাইভ চলাকালীন সময় একজন ইউজার ২ বার দিতে পারবে না
    if (isLive && hasUserSubmittedLiveExam(examKey)) {
        if (typeof window.showToast === 'function') {
            window.showToast('❌ আপনি ইতিমধ্যে এই লাইভ পরীক্ষায় অংশগ্রহণ করেছেন! লাইভ চলাকালীন সময়ে একবারের বেশি পরীক্ষা দেওয়া যাবে না।', 'error');
        } else {
            alert('❌ আপনি ইতিমধ্যে এই লাইভ পরীক্ষায় অংশগ্রহণ করেছেন!\n\nলাইভ চলাকালীন সময়ে একজন শিক্ষার্থী একবারই পরীক্ষা দিতে পারবেন। লাইভ সময় শেষ হয়ে পূর্ববর্তী লাইভ পরীক্ষা (Previous Live Exam) হলে যতবার ইচ্ছে পুনরায় দিতে পারবেন।');
        }
        return;
    }

    currentExamTitle = testTitle;
    currentExamDuration = durationMins;
    currentExamKey = examKey;
    currentExamIsLive = isLive;
    isExamSubmitted = false;

    // ফলাফল পপআপ মডাল খোলা থাকলে বন্ধ করা
    const resultModal = document.getElementById('examResultModal');
    if (resultModal) {
        resultModal.classList.remove('open');
    }

    document.getElementById('model-test-list-view').style.display = 'none';
    document.getElementById('live-exam-view').style.display = 'block';
    document.getElementById('exam-active-title').innerText = testTitle;

    const container = document.getElementById('questionsListContainer');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
                <p style="font-weight: 500;">ডাটাবেজ থেকে প্রশ্নপত্র লোড করা হচ্ছে...</p>
            </div>
        `;
    }

    // রিসেট স্টেট
    userAnswers = {};
    remainingSeconds = durationMins * 60;

    // ডাটাবেজ থেকে প্রশ্ন লোড (লাইভ এক্সামের প্রশ্ন অটো আসবে না, শুধুমাত্র আপলোডকৃত প্রশ্ন আসবে)
    try {
        let dbQuestions = null;
        if (typeof ApiService !== 'undefined' && ApiService.getModelTestMCQ) {
            dbQuestions = await ApiService.getModelTestMCQ(testTitle, examKey);
        }
        if (dbQuestions && dbQuestions.length > 0) {
            activeExamQuestions = dbQuestions.map((q, idx) => {
                let opts = q.options;
                if (typeof opts === 'string') {
                    try { opts = JSON.parse(opts); } catch(e) { opts = []; }
                }
                return {
                    id: q.id || (idx + 1),
                    question_text: q.question_text || q.question || '',
                    question: q.question_text || q.question || '',
                    options: Array.isArray(opts) ? opts : [],
                    correct: parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0,
                    correct_index: parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0,
                    explanation: q.explanation || '',
                    image: q.image || '',
                    context_stem: q.context_stem || ''
                };
            });
        } else {
            // কোনো অটো বা ডামি প্রশ্ন আসবে না!
            activeExamQuestions = [];
        }
    } catch (e) {
        console.warn("Failed to load questions for exam:", e);
        activeExamQuestions = [];
    }

    // যদি এখনও কোনো প্রশ্ন আপলোড করা না হয়ে থাকে
    if (activeExamQuestions.length === 0) {
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: #FFF; border-radius: 16px; border: 1px solid #E2E8F0; margin: 20px 0;">
                    <i class="fa-solid fa-clipboard-question" style="font-size: 3rem; color: #94A3B8; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: #1E293B; margin-bottom: 8px;">এই লাইভ পরীক্ষার জন্য এখনও কোনো প্রশ্ন আপলোড করা হয়নি।</h3>
                    <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">অ্যাডমিন প্যানেল থেকে প্রশ্ন আপলোড করার পর এখানে প্রদর্শিত হবে।</p>
                    <button class="btn btn-primary" onclick="exitExam()" style="display: inline-flex; align-items: center; gap: 8px; margin: 0 auto;">
                        <i class="fa-solid fa-arrow-left"></i> <span>মডেল টেস্ট তালিকায় ফিরে যান</span>
                    </button>
                </div>
            `;
        }
        const palette = document.getElementById('questionPalette');
        if (palette) palette.innerHTML = '';
        const counter = document.getElementById('exam-q-counter');
        if (counter) counter.innerHTML = '';
        return;
    }

    // সকল প্রশ্ন ক্রমানুসারে স্ক্রলে রেন্ডার করা
    renderAllQuestions();
    renderQuestionPalette();
    updateExamProgress();
    startTimer();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * পরীক্ষা পুনরায় শুরু করা (Retake Exam)
 */
function retakeExam() {
    if (currentExamIsLive && hasUserSubmittedLiveExam(currentExamKey)) {
        alert('❌ লাইভ পরীক্ষা চলাকালীন সময়ে একজন শিক্ষার্থী একবারই পরীক্ষা দিতে পারবেন। লাইভ শেষ হলে যতবার ইচ্ছে পুনরায় দিতে পারবেন।');
        return;
    }
    const resultModal = document.getElementById('examResultModal');
    if (resultModal) {
        resultModal.classList.remove('open');
    }
    startExam(currentExamTitle, currentExamDuration, currentExamKey);
}

/**
 * ক্রমানুসারে স্ক্রল করার জন্য সকল প্রশ্ন লোড করা
 */
function renderAllQuestions() {
    const container = document.getElementById('questionsListContainer');
    if (!container) return;
    container.innerHTML = '';

    let html = '';
    activeExamQuestions.forEach((q, qIdx) => {
        if (typeof renderModernMCQCardHTML === 'function') {
            html += renderModernMCQCardHTML(q, qIdx, {
                mode: 'exam',
                category: 'model_test',
                source_title: currentExamTitle,
                hideExplanation: true
            });
        }
    });
    container.innerHTML = html;
}

/**
 * অপশন সিলেক্ট করার লজিক (Single Choice Locking per Question)
 */
function selectExamOption(qIndex, optionIndex) {
    if (isExamSubmitted) return;
    const card = document.getElementById(`modern-mcq-card-${qIndex}`) || document.getElementById(`model-mcq-card-${qIndex}`) || document.getElementById(`question-card-${qIndex}`);
    if (card) {
        const opt = card.querySelector(`[data-opt-idx="${optionIndex}"]`);
        if (opt) {
            const correctIndex = activeExamQuestions[qIndex] ? (activeExamQuestions[qIndex].correct !== undefined ? activeExamQuestions[qIndex].correct : activeExamQuestions[qIndex].correct_index) : 0;
            if (typeof handleModernOptionClick === 'function') {
                handleModernOptionClick(opt, qIndex, optionIndex, correctIndex, 'exam');
            }
        }
    }
}

/**
 * প্রশ্ন প্যালেট তৈরি করা
 */
function renderQuestionPalette() {
    const palette = document.getElementById('questionPalette');
    if (!palette) return;
    palette.innerHTML = '';

    activeExamQuestions.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.className = `palette-btn ${userAnswers[idx] !== undefined ? 'answered' : ''}`;
        btn.innerText = (idx + 1).toString();
        btn.id = `palette-btn-${idx}`;
        btn.title = `প্রশ্ন ${idx + 1}-এ যান`;
        btn.onclick = () => jumpToQuestion(idx);
        palette.appendChild(btn);
    });
}

/**
 * যেকোনো প্রশ্নে সরাসরি স্ক্রল করে যাওয়া
 */
function jumpToQuestion(index) {
    const card = document.getElementById(`modern-mcq-card-${index}`) || document.getElementById(`model-mcq-card-${index}`) || document.getElementById(`question-card-${index}`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight-focus');
        setTimeout(() => {
            card.classList.remove('highlight-focus');
        }, 1200);
    }
}

/**
 * উত্তর সম্পন্ন হওয়ার লাইভ কাউন্টার আপডেট
 */
function updateExamProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const total = activeExamQuestions.length;
    const remaining = total - answeredCount;

    const counter = document.getElementById('exam-q-counter');
    if (counter) {
        counter.innerHTML = `<i class="fa-solid fa-circle-check"></i> উত্তর সম্পন্ন: ${toBanglaNum(answeredCount)} / ${toBanglaNum(total)}`;
    }

    const bottomStatus = document.getElementById('bottomSubmitStatus');
    if (bottomStatus) {
        if (remaining > 0) {
            bottomStatus.innerText = `আপনি ${toBanglaNum(answeredCount)}টি প্রশ্নের উত্তর দিয়েছেন (এখনও ${toBanglaNum(remaining)}টি বাকি)`;
        } else {
            bottomStatus.innerText = `অভিনন্দন! আপনি সকল প্রশ্নের উত্তর প্রদান সম্পন্ন করেছেন।`;
        }
    }
}

/**
 * লাইভ কাউন্টডাউন টাইমার
 */
function startTimer() {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('examTimer');
    if (!timerDisplay) return;

    function updateTimerUI() {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        timerDisplay.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (remainingSeconds <= 300) {
            timerDisplay.classList.remove('normal');
        } else {
            timerDisplay.classList.add('normal');
        }

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            alert("পরীক্ষার নির্ধারিত সময় শেষ হয়েছে! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে।");
            submitExam();
        } else {
            remainingSeconds--;
        }
    }

    updateTimerUI();
    timerInterval = setInterval(updateTimerUI, 1000);
}

/**
 * সাবমিট কনফার্মেশন
 */
function confirmSubmitExam() {
    const answeredCount = Object.keys(userAnswers).length;
    const unanswered = activeExamQuestions.length - answeredCount;
    
    let msg = `আপনি মোট ${answeredCount}টি প্রশ্নের উত্তর দিয়েছেন।`;
    if (unanswered > 0) {
        msg += `\nএখনও ${unanswered}টি প্রশ্নের উত্তর দেওয়া বাকি রয়েছে।`;
    }
    msg += `\nআপনি কি নিশ্চিতভাবে পরীক্ষা সাবমিট করতে চান?`;

    if (confirm(msg)) {
        submitExam();
    }
}

/**
 * পরীক্ষা সাবমিট ও ফলাফল গণনা
 */
function submitExam() {
    clearInterval(timerInterval);
    isExamSubmitted = true;

    let correctCount = 0;
    let wrongCount = 0;

    activeExamQuestions.forEach((q, idx) => {
        const card = document.getElementById(`modern-mcq-card-${idx}`) || document.getElementById(`model-mcq-card-${idx}`) || document.getElementById(`question-card-${idx}`);
        if (!card) return;

        card.classList.add('locked', 'answered');
        const options = card.querySelectorAll('.modern-option-pill, .option-item');
        options.forEach(opt => {
            opt.classList.add('locked');
            opt.style.pointerEvents = 'none';
            opt.classList.remove('exam-selected');
        });

        const userSelected = userAnswers[idx];
        const correctOptIndex = (q.correct !== undefined) ? parseInt(q.correct, 10) : parseInt(q.correct_index, 10) || 0;

        // সঠিক উত্তরটি সবুজ
        const correctOpt = card.querySelector(`[data-opt-idx="${correctOptIndex}"]`);
        if (correctOpt) {
            correctOpt.classList.add('correct-selected');
            const icon = correctOpt.querySelector('.modern-status-icon');
            if (icon) {
                icon.className = 'modern-status-icon check';
                icon.innerHTML = '<i class="fa-solid fa-check"></i>';
            }
        }

        if (userSelected !== undefined) {
            if (userSelected === correctOptIndex) {
                correctCount++;
            } else {
                wrongCount++;
                const wrongOpt = card.querySelector(`[data-opt-idx="${userSelected}"]`);
                if (wrongOpt) {
                    wrongOpt.classList.add('wrong-selected');
                    const icon = wrongOpt.querySelector('.modern-status-icon');
                    if (icon) {
                        icon.className = 'modern-status-icon cross';
                        icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                    }
                }
            }
        }

        // প্রতিটি প্রশ্নে ব্যাখ্যা দেখুন বাটন উন্মুক্ত করা
        const expBtn = card.querySelector('.modern-exp-btn');
        if (expBtn) {
            expBtn.style.display = 'inline-flex';
        }
    });

    const totalQuestions = activeExamQuestions.length;
    const skippedCount = totalQuestions - (correctCount + wrongCount);
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // রেজাল্ট মডাল স্কোর আপডেট: বাম পাশে কত এর মধ্যে কত পেলো (যেমন ২০/২৫) এবং ডান পাশে শতকরা হার
    const marksEl = document.getElementById('modal-score-marks');
    if (marksEl) {
        marksEl.innerText = `${toBanglaNum(correctCount)} / ${toBanglaNum(totalQuestions)}`;
    }
    const percEl = document.getElementById('modal-score-percentage');
    if (percEl) {
        percEl.innerText = `${toBanglaNum(scorePercentage)}%`;
    }

    document.getElementById('modal-correct-count').innerText = `${toBanglaNum(correctCount)}টি`;
    document.getElementById('modal-wrong-count').innerText = `${toBanglaNum(wrongCount)}টি`;
    document.getElementById('modal-skipped-count').innerText = `${toBanglaNum(skippedCount)}টি`;

    // যদি চলমান লাইভ পরীক্ষা হয়, ইউজারের সাবমিশন রেকর্ড করা
    if (currentExamIsLive && currentExamKey) {
        recordLiveExamSubmission(currentExamKey, correctCount, totalQuestions, {
            wrongCount,
            skippedCount,
            scorePercentage,
            examTitle: currentExamTitle
        });
        if (allModelTestsData && allModelTestsData.length > 0) {
            renderModelTestCards(allModelTestsData);
        }
    }

    // লাইভ চলাকালীন পুনরায় পরীক্ষা দেওয়ার বাটন বন্ধ রাখা
    const retakeBtn = document.getElementById('modal-retake-btn');
    if (retakeBtn) {
        retakeBtn.style.display = currentExamIsLive ? 'none' : 'inline-flex';
    }

    // ২০ এর উপরে পেলে ১ পয়েন্ট যোগ হবে
    const pointAwardEl = document.getElementById('modal-point-award');
    if (pointAwardEl) pointAwardEl.style.display = 'none';

    if (correctCount > 20) {
        if (window.ApiService && typeof ApiService.addModelTestPoint === 'function') {
            ApiService.addModelTestPoint({ score: correctCount, examName: currentExamTitle || 'মডেল টেস্ট' })
                .then(res => {
                    if (res && res.pointsAwarded && pointAwardEl) {
                        pointAwardEl.style.display = 'flex';
                        pointAwardEl.innerHTML = `<i class="fa-solid fa-trophy" style="color: #F59E0B; font-size: 1.35rem;"></i> <span>অভিনন্দন! ২০-এর উপরে (${toBanglaNum(correctCount)}) স্কোর করায় আপনার প্রোফাইলে <strong>+১ পয়েন্ট</strong> যোগ হয়েছে! মোট পয়েন্ট: <strong>${toBanglaNum(res.newPoints)}</strong></span>`;
                        if (window.showToast) {
                            window.showToast('🎉 অভিনন্দন! মডেল টেস্টে ২০ এর উপরে স্কোর করায় ১ পয়েন্ট অর্জিত হয়েছে!', 'success');
                        }
                    }
                })
                .catch(() => {});
        }
    }

    document.getElementById('examResultModal').classList.add('open');
}

/**
 * উত্তরমালা ও সমাধান ভিউ
 */
function reviewExamAnswers() {
    const resultModal = document.getElementById('examResultModal');
    if (resultModal) {
        resultModal.classList.remove('open');
    }
    const titleEl = document.getElementById('exam-active-title');
    if (titleEl) {
        titleEl.innerText = `${currentExamTitle} - সমাধান ও উত্তরমালা`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * পরীক্ষা থেকে প্রস্থান
 */
function exitExam() {
    const examView = document.getElementById('live-exam-view');
    const isExamActive = examView && examView.style.display !== 'none';

    if (isExamActive) {
        if (!isExamSubmitted && Object.keys(userAnswers).length > 0) {
            if (!confirm('আপনি কি চলমান পরীক্ষাটি স্থগিত করে মডেল টেস্ট তালিকায় ফিরে যেতে চান?')) {
                return;
            }
        }
        clearInterval(timerInterval);
        const resultModal = document.getElementById('examResultModal');
        if (resultModal) {
            resultModal.classList.remove('open');
        }
        examView.style.display = 'none';
        document.getElementById('model-test-list-view').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // মডেল টেস্ট লিস্ট থেকে হোম পেজে ফিরে যাওয়া
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../index.html';
        }
    }
}

async function syncDynamicModelTests() {
    try {
        const meta = await ApiService.getCustomOptions();
        if (!meta || !Array.isArray(meta.modelTests)) return;

        const grid = document.querySelector('.model-tests-grid');
        if (!grid) return;

        const existingCards = Array.from(grid.querySelectorAll('.test-card'));
        const existingTitles = existingCards.map(c => {
            const t = c.querySelector('.test-card-title');
            return t ? t.innerText.trim().toLowerCase() : '';
        });

        meta.modelTests.forEach(mt => {
            const cleanMt = mt.trim();
            if (!cleanMt) return;
            const cleanLower = cleanMt.toLowerCase();
            if (!existingTitles.some(et => et.includes(cleanLower))) {
                const card = document.createElement('div');
                card.className = 'test-card dynamic-test-card';
                card.setAttribute('data-category', 'full');
                const safeMt = cleanMt.replace(/'/g, "\\'");
                card.innerHTML = `
                    <div>
                        <div class="test-card-header">
                            <span class="badge badge-primary">মডেল টেস্ট</span>
                            <span class="badge badge-success"><i class="fa-solid fa-pen-nib"></i> নতুন</span>
                        </div>
                        <h3 class="test-card-title">${cleanMt}</h3>
                        <p class="test-card-desc">পূর্ণাঙ্গ সিলেবাসের উপর ২৫টি বহুনির্বাচনি প্রশ্নের স্পিড টেস্ট।</p>
                        <div class="test-meta">
                            <span><i class="fa-regular fa-clock"></i> ২৫ মিনিট</span>
                            <span><i class="fa-solid fa-list-ol"></i> ২৫টি প্রশ্ন</span>
                            <span><i class="fa-solid fa-award"></i> ২৫ নম্বর</span>
                        </div>
                    </div>
                    <button class="start-btn" onclick="startExam('${safeMt}', 25)">
                        <span>পরীক্ষা শুরু করুন</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                `;
                grid.appendChild(card);
                existingTitles.push(cleanLower);
            }
        });
    } catch(err) {
        console.warn('syncDynamicModelTests warning:', err);
    }
}


function toggleModelTestExp(qIdx) {
    const box = document.getElementById('explanation-' + qIdx);
    const btn = document.getElementById('exp-btn-' + qIdx);
    if (!box) return;
    if (box.style.display === 'block') {
        box.style.display = 'none';
        if (btn) btn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন';
    } else {
        box.style.display = 'block';
        if (btn) btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> ব্যাখ্যা লুকান';
    }
}
window.toggleModelTestExp = toggleModelTestExp;


/**
 * লাইভ পরীক্ষার মার্কশীট প্রদর্শন পপআপ মডাল
 */
function openLiveExamMarksheet(examKey, testTitle) {
    const submitted = getSubmittedLiveExams();
    const entry = submitted[String(examKey).trim()] || {};
    
    let studentProfile = {};
    try {
        studentProfile = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');
    } catch(e) {}
    
    const studentName = studentProfile.name || 'শিক্ষার্থী';
    const studentCollege = studentProfile.college || '';
    const title = entry.examTitle || testTitle || ('Model Test ' + examKey);
    const score = entry.correctCount !== undefined ? entry.correctCount : (entry.score || 0);
    const total = entry.total || 25;
    const wrong = entry.wrongCount !== undefined ? entry.wrongCount : (total - score);
    const skipped = entry.skippedCount !== undefined ? entry.skippedCount : 0;
    const perc = entry.scorePercentage !== undefined ? entry.scorePercentage : (total > 0 ? Math.round((score / total) * 100) : 0);
    
    let dateStr = 'আজ';
    if (entry.submittedAt) {
        try {
            const d = new Date(entry.submittedAt);
            dateStr = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        } catch(e) {}
    }

    let gradeText = 'কৃতকার্য';
    if (perc >= 80) { gradeText = 'অসাধারণ! (A+)'; }
    else if (perc >= 70) { gradeText = 'খুব ভালো! (A)'; }
    else if (perc >= 60) { gradeText = 'ভালো (A-)'; }
    else if (perc >= 50) { gradeText = 'সন্তোষজনক (B)'; }
    else { gradeText = 'পুনরায় চেষ্টা করুন'; }

    let modal = document.getElementById('liveMarksheetModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'liveMarksheetModal';
        modal.className = 'modal-overlay';
        modal.onclick = (e) => { if (e.target === modal) closeLiveExamMarksheet(); };
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-window marksheet-modal-window" style="max-width: 520px; text-align: center; padding: 24px 22px; border-radius: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 16px;">
                <div style="text-align: left;">
                    <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: #6366F1; letter-spacing: 0.5px;"><i class="fa-solid fa-graduation-cap"></i> ICT Easy Learning Mark Sheet</span>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin: 2px 0 0 0;">${escapeHtml(title)}</h3>
                </div>
                <button type="button" onclick="closeLiveExamMarksheet()" style="background: #F1F5F9; border: none; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; color: #64748B; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s;">&times;</button>
            </div>

            <!-- স্টুডেন্ট প্রোফাইল কার্ড -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; text-align: left;">
                <div>
                    <strong style="color: #0F172A; font-size: 0.95rem;">👤 ${escapeHtml(studentName)}</strong>
                    ${studentCollege ? `<div style="font-size: 0.78rem; color: #64748B;">🏫 ${escapeHtml(studentCollege)}</div>` : ''}
                </div>
                <div style="text-align: right; font-size: 0.78rem; color: #64748B;">
                    <div><i class="fa-regular fa-calendar-check"></i> ${dateStr}</div>
                    <span style="display: inline-block; margin-top: 3px; font-weight: 700; color: #059669; background: #D1FAE5; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem;">${gradeText}</span>
                </div>
            </div>

            <!-- স্কোর সামারি বক্স -->
            <div class="result-score-summary-row" style="margin-bottom: 18px;">
                <div class="result-score-box result-score-marks-box" style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border: 1.5px solid #C7D2FE;">
                    <span class="result-score-box-label" style="color: #4338CA;"><i class="fa-solid fa-award"></i> প্রাপ্ত নম্বর</span>
                    <strong class="result-score-box-val" style="color: #3730A3;">${toBanglaNum(score)} / ${toBanglaNum(total)}</strong>
                </div>
                <div class="result-score-box result-score-perc-box" style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 1.5px solid #A7F3D0;">
                    <span class="result-score-box-label" style="color: #065F46;"><i class="fa-solid fa-percent"></i> শতকরা হার</span>
                    <strong class="result-score-box-val" style="color: #047857;">${toBanglaNum(perc)}%</strong>
                </div>
            </div>

            <!-- সঠিক / ভুল / অনুত্তরিত পরিসংখ্যান -->
            <div class="score-stats-grid" style="margin-bottom: 20px;">
                <div class="score-stat-box" style="border-top: 3px solid var(--success); background: #F0FDF4;">
                    <strong style="color: var(--success); font-size: 1.35rem;">${toBanglaNum(score)}টি</strong>
                    <span style="font-size: 0.8rem; color: #475569;">সঠিক উত্তর</span>
                </div>
                <div class="score-stat-box" style="border-top: 3px solid var(--danger); background: #FEF2F2;">
                    <strong style="color: var(--danger); font-size: 1.35rem;">${toBanglaNum(wrong)}টি</strong>
                    <span style="font-size: 0.8rem; color: #475569;">ভুল উত্তর</span>
                </div>
                <div class="score-stat-box" style="border-top: 3px solid var(--warning); background: #FFFBEB;">
                    <strong style="color: var(--warning-dark); font-size: 1.35rem;">${toBanglaNum(skipped)}টি</strong>
                    <span style="font-size: 0.8rem; color: #475569;">অনুত্তরিত</span>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary" onclick="closeLiveExamMarksheet(); startExam('${escapeHtml(title).replace(/'/g, "\\'")}', 25, '${escapeHtml(examKey)}');" style="flex: 1; min-width: 150px; padding: 11px 18px; border-radius: 9999px;">
                    <i class="fa-solid fa-list-check"></i> সমাধান ও প্রশ্নপত্র
                </button>
                <button type="button" class="btn btn-outline" onclick="closeLiveExamMarksheet()" style="flex: 1; min-width: 120px; padding: 11px 18px; border-radius: 9999px;">
                    <i class="fa-solid fa-xmark"></i> বন্ধ করুন
                </button>
            </div>
        </div>
    `;

    modal.classList.add('open');
}

function closeLiveExamMarksheet() {
    const modal = document.getElementById('liveMarksheetModal');
    if (modal) modal.classList.remove('open');
}
window.openLiveExamMarksheet = openLiveExamMarksheet;
window.closeLiveExamMarksheet = closeLiveExamMarksheet;
