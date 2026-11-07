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

document.addEventListener('DOMContentLoaded', () => {
    initFilterTabs();
    syncDynamicModelTests();
});

function initFilterTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            filterTests(filter);
        });
    });
}

function filterTests(filter) {
    const cards = document.querySelectorAll('.test-card');
    cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * পরীক্ষা শুরু করা
 */
async function startExam(testTitle, durationMins = 25) {
    currentExamTitle = testTitle;
    currentExamDuration = durationMins;
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
                <p style="font-weight: 500;">ডাটাবেজ থেকে প্রশ্নপত্র তৈরি করা হচ্ছে...</p>
            </div>
        `;
    }

    // রিসেট স্টেট
    userAnswers = {};
    remainingSeconds = durationMins * 60;

    // ডাটাবেজ থেকে প্রশ্ন লোড (নির্দিষ্ট মডেল টেস্ট অনুযায়ী)
    try {
        let dbQuestions = null;
        if (typeof ApiService !== 'undefined' && ApiService.getModelTestMCQ) {
            dbQuestions = await ApiService.getModelTestMCQ(testTitle);
        }
        if (!dbQuestions || dbQuestions.length === 0) {
            dbQuestions = await ApiService.getAllMCQ(25);
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
            activeExamQuestions = [...FALLBACK_EXAM_QUESTIONS];
        }
    } catch (e) {
        console.warn("Failed to load live questions for exam, using fallback:", e);
        activeExamQuestions = [...FALLBACK_EXAM_QUESTIONS];
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
    const resultModal = document.getElementById('examResultModal');
    if (resultModal) {
        resultModal.classList.remove('open');
    }
    startExam(currentExamTitle, currentExamDuration);
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
                mode: 'study',
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
                handleModernOptionClick(opt, qIndex, optionIndex, correctIndex, 'study');
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

    const skippedCount = activeExamQuestions.length - (correctCount + wrongCount);
    const scorePercentage = Math.round((correctCount / activeExamQuestions.length) * 100);

    // রেজাল্ট মডাল আপডেট
    document.getElementById('modal-score-percentage').innerText = `${toBanglaNum(scorePercentage)}%`;
    document.getElementById('modal-correct-count').innerText = `${toBanglaNum(correctCount)}টি`;
    document.getElementById('modal-wrong-count').innerText = `${toBanglaNum(wrongCount)}টি`;
    document.getElementById('modal-skipped-count').innerText = `${toBanglaNum(skippedCount)}টি`;

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
