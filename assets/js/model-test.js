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

    // ডাটাবেজ থেকে প্রশ্ন লোড
    try {
        const dbQuestions = await ApiService.getAllMCQ(25);
        if (dbQuestions && dbQuestions.length > 0) {
            activeExamQuestions = dbQuestions.map((q, idx) => {
                let opts = q.options;
                if (typeof opts === 'string') {
                    try { opts = JSON.parse(opts); } catch(e) { opts = []; }
                }
                return {
                    id: q.id || (idx + 1),
                    question: q.question_text || q.question || '',
                    options: Array.isArray(opts) ? opts : [],
                    correct: parseInt(q.correct_index !== undefined ? q.correct_index : q.correct, 10) || 0,
                    explanation: q.explanation || ''
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
    container.innerHTML = '';
    const markers = ['ক', 'খ', 'গ', 'ঘ'];

    activeExamQuestions.forEach((q, qIdx) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `question-card-${qIdx}`;
        card.style.scrollMarginTop = '150px';

        let optionsHtml = '';
        q.options.forEach((opt, oIdx) => {
            const isSelected = userAnswers[qIdx] === oIdx;
            optionsHtml += `
                <div class="option-item ${isSelected ? 'selected-option' : ''}" 
                     id="opt-${qIdx}-${oIdx}"
                     data-q-idx="${qIdx}"
                     data-opt-idx="${oIdx}"
                     style="${isSelected ? 'background-color: var(--primary-light) !important; border-color: var(--primary) !important; color: var(--primary) !important; font-weight: 600;' : ''}" 
                     onclick="selectExamOption(${qIdx}, ${oIdx})">
                    <div class="option-left">
                        <span class="option-marker" style="${isSelected ? 'background: var(--primary); border-color: var(--primary); color: #fff;' : ''}">${markers[oIdx]}</span>
                        <span>${opt}</span>
                    </div>
                    <span class="option-status-icon">
                        ${isSelected ? '<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>' : ''}
                    </span>
                </div>
            `;
        });

        const explanationHtml = q.explanation ? `
            <div class="explanation-box" id="explanation-${qIdx}" style="display: none; margin-top: 14px; padding: 12px 16px; background: #F8FAFC; border-left: 4px solid var(--info); border-radius: 6px; font-size: 0.9rem;">
                <strong><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</strong> ${q.explanation}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="question-title" style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; background: var(--primary-light); color: var(--primary); min-width: 30px; height: 30px; border-radius: 50%; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;">${qIdx + 1}</span>
                <span style="padding-top: 2px;">${q.question}</span>
            </div>
            <div class="options-grid two-cols">${optionsHtml}</div>
            ${explanationHtml}
        `;
        container.appendChild(card);
    });
}

/**
 * অপশন সিলেক্ট করার লজিক (Single Choice Locking per Question)
 */
function selectExamOption(qIndex, optionIndex) {
    if (isExamSubmitted) return; // পরীক্ষা সাবমিট হওয়ার পর অপশন পরিবর্তন বন্ধ

    userAnswers[qIndex] = optionIndex;

    const card = document.getElementById(`question-card-${qIndex}`);
    if (card) {
        const options = card.querySelectorAll('.option-item');
        options.forEach((opt, oIdx) => {
            const marker = opt.querySelector('.option-marker');
            const icon = opt.querySelector('.option-status-icon');

            if (oIdx === optionIndex) {
                opt.style.backgroundColor = 'var(--primary-light)';
                opt.style.borderColor = 'var(--primary)';
                opt.style.color = 'var(--primary)';
                opt.style.fontWeight = '600';
                if (marker) {
                    marker.style.background = 'var(--primary)';
                    marker.style.borderColor = 'var(--primary)';
                    marker.style.color = '#fff';
                }
                if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>';
            } else {
                opt.style.backgroundColor = '';
                opt.style.borderColor = '';
                opt.style.color = '';
                opt.style.fontWeight = '';
                if (marker) {
                    marker.style.background = '';
                    marker.style.borderColor = '';
                    marker.style.color = '';
                }
                if (icon) icon.innerHTML = '';
            }
        });
    }

    // প্যালেট বাটনে সবুজ স্ট্যাটাস যুক্ত করা
    const palBtn = document.getElementById(`palette-btn-${qIndex}`);
    if (palBtn) palBtn.classList.add('answered');

    updateExamProgress();
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
    const card = document.getElementById(`question-card-${index}`);
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
        counter.innerHTML = `<i class="fa-solid fa-circle-check"></i> উত্তর সম্পন্ন: ${answeredCount} / ${total}`;
    }

    const bottomStatus = document.getElementById('bottomSubmitStatus');
    if (bottomStatus) {
        if (remaining > 0) {
            bottomStatus.innerText = `আপনি ${answeredCount}টি প্রশ্নের উত্তর দিয়েছেন (এখনও ${remaining}টি বাকি)`;
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
        const card = document.getElementById(`question-card-${idx}`);
        if (!card) return;

        const options = card.querySelectorAll('.option-item');
        // সকল অপশন লক করে দেওয়া
        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
            opt.style.cursor = 'default';
        });

        const userSelected = userAnswers[idx];
        const correctOptIndex = q.correct;

        if (userSelected !== undefined) {
            if (userSelected === correctOptIndex) {
                correctCount++;
                // নির্বাচিত সঠিক অপশন সবুজ
                const optEl = options[userSelected];
                if (optEl) {
                    optEl.classList.add('correct');
                    const icon = optEl.querySelector('.option-status-icon');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
                }
            } else {
                wrongCount++;
                // নির্বাচিত ভুল অপশন লাল
                const wrongOptEl = options[userSelected];
                if (wrongOptEl) {
                    wrongOptEl.classList.add('wrong');
                    const icon = wrongOptEl.querySelector('.option-status-icon');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--danger); font-size: 1.15rem;"></i>';
                }
                // সঠিক উত্তরটি সবুজ
                const correctOptEl = options[correctOptIndex];
                if (correctOptEl) {
                    correctOptEl.classList.add('correct');
                    const cIcon = correctOptEl.querySelector('.option-status-icon');
                    if (cIcon) cIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
                }
            }
        } else {
            // যদি উত্তর না দেওয়া হয়ে থাকে, সঠিকটি সবুজ করে দেওয়া
            const correctOptEl = options[correctOptIndex];
            if (correctOptEl) {
                correctOptEl.classList.add('correct');
                const cIcon = correctOptEl.querySelector('.option-status-icon');
                if (cIcon) cIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
            }
        }

        // ব্যাখ্যা ওপেন করা
        const expBox = card.querySelector('.explanation-box');
        if (expBox) expBox.style.display = 'block';
    });

    const skippedCount = activeExamQuestions.length - (correctCount + wrongCount);
    const scorePercentage = Math.round((correctCount / activeExamQuestions.length) * 100);

    // রেজাল্ট মডাল আপডেট
    document.getElementById('modal-score-percentage').innerText = `${scorePercentage}%`;
    document.getElementById('modal-correct-count').innerText = `${correctCount}টি`;
    document.getElementById('modal-wrong-count').innerText = `${wrongCount}টি`;
    document.getElementById('modal-skipped-count').innerText = `${skippedCount}টি`;

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
    const resultModal = document.getElementById('examResultModal');
    if (resultModal) {
        resultModal.classList.remove('open');
    }
    document.getElementById('live-exam-view').style.display = 'none';
    document.getElementById('model-test-list-view').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
