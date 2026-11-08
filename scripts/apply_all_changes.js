const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// -------------------------------------------------------------
// 1. UPDATE pages/model-test.html
// -------------------------------------------------------------
console.log('--- Updating pages/model-test.html ---');
const modelTestHtmlPath = path.join(rootDir, 'pages', 'model-test.html');
let modelTestHtml = fs.readFileSync(modelTestHtmlPath, 'utf8');

// Remove featuredLiveSection
modelTestHtml = modelTestHtml.replace(
    /\r?\n\s*<!--\s*চলমান লাইভ এক্সাম হাইলাইট সেকশন\s*-->\r?\n\s*<section id="featuredLiveSection" class="featured-live-section" style="display:none;"><\/section>/g,
    ''
);
// Also in case it didn't match the comment
modelTestHtml = modelTestHtml.replace(
    /<section id="featuredLiveSection" class="featured-live-section" style="display:none;"><\/section>\r?\n?/g,
    ''
);

// Replace score-badge-circle with dual score display (left: marks ratio, right: percentage)
const newScoreHtml = `<div class="result-score-summary-row">
                <div class="result-score-box result-score-marks-box">
                    <span class="result-score-box-label"><i class="fa-solid fa-award"></i> প্রাপ্ত নম্বর</span>
                    <strong class="result-score-box-val" id="modal-score-marks">০ / ২৫</strong>
                </div>
                <div class="result-score-box result-score-perc-box">
                    <span class="result-score-box-label"><i class="fa-solid fa-percent"></i> শতকরা হার</span>
                    <strong class="result-score-box-val" id="modal-score-percentage">০%</strong>
                </div>
            </div>`;

modelTestHtml = modelTestHtml.replace(
    /<div class="score-badge-circle">[\s\S]*?<\/div>/,
    newScoreHtml
);

// Add id="modal-retake-btn" to retake button in modal
modelTestHtml = modelTestHtml.replace(
    /<button class="btn btn-outline" onclick="retakeExam\(\)">/,
    '<button class="btn btn-outline" id="modal-retake-btn" onclick="retakeExam()">'
);

fs.writeFileSync(modelTestHtmlPath, modelTestHtml, 'utf8');
console.log('Successfully updated pages/model-test.html');


// -------------------------------------------------------------
// 2. UPDATE assets/css/model-test.css
// -------------------------------------------------------------
console.log('--- Updating assets/css/model-test.css ---');
const modelTestCssPath = path.join(rootDir, 'assets', 'css', 'model-test.css');
let modelTestCss = fs.readFileSync(modelTestCssPath, 'utf8');

// Ensure .model-test-card.is-live-active has light red background
const liveActiveTarget = /\.model-test-card\.is-live-active\s*\{[\s\S]*?\}/;
const liveActiveReplacement = `.model-test-card.is-live-active {
    background: #FFF1F2 !important;
    border: 2px solid #FDA4AF !important;
    box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.18), 0 8px 10px -6px rgba(244, 63, 94, 0.12) !important;
    position: relative;
}`;

if (liveActiveTarget.test(modelTestCss)) {
    modelTestCss = modelTestCss.replace(liveActiveTarget, liveActiveReplacement);
} else {
    modelTestCss += '\n' + liveActiveReplacement + '\n';
}

// Add styles for result-score-summary-row and submitted live button
const additionalCss = `
/* রেজাল্ট স্কোরকার্ড: বামে প্রাপ্ত নম্বর এবং ডানে শতকরা হার */
.result-score-summary-row {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin: 0 auto 20px auto;
    max-width: 400px;
}

.result-score-box {
    flex: 1;
    padding: 16px 12px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.result-score-marks-box {
    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
    border: 2px solid #86EFAC;
}

.result-score-marks-box .result-score-box-label {
    color: #15803D;
}

.result-score-marks-box .result-score-box-val {
    color: #166534;
}

.result-score-perc-box {
    background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
    border: 2px solid #A5B4FC;
}

.result-score-perc-box .result-score-box-label {
    color: #4338CA;
}

.result-score-perc-box .result-score-box-val {
    color: #3730A3;
}

.result-score-box-label {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.result-score-box-val {
    font-size: 1.85rem;
    font-weight: 800;
    line-height: 1.1;
}

.mt-start-btn.submitted-live-btn {
    background: #64748B !important;
    cursor: not-allowed !important;
    opacity: 0.9;
}
`;

if (!modelTestCss.includes('.result-score-summary-row')) {
    modelTestCss += '\n' + additionalCss + '\n';
}

fs.writeFileSync(modelTestCssPath, modelTestCss, 'utf8');
console.log('Successfully updated assets/css/model-test.css');


// -------------------------------------------------------------
// 3. UPDATE assets/js/model-test.js
// -------------------------------------------------------------
console.log('--- Updating assets/js/model-test.js ---');
const modelTestJsPath = path.join(rootDir, 'assets', 'js', 'model-test.js');
let modelTestJs = fs.readFileSync(modelTestJsPath, 'utf8');

// Replace isExamLiveNow
const isExamLiveNowNew = `function isExamLiveNow(item) {
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
}`;

modelTestJs = modelTestJs.replace(/function isExamLiveNow\(item\)\s*\{[\s\S]*?^\}/m, isExamLiveNowNew);

// Add Live Exam Submission helpers if not present
const liveSubmissionHelpers = `
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

function recordLiveExamSubmission(examKey, score, total) {
    if (!examKey) return;
    const submitted = getSubmittedLiveExams();
    submitted[String(examKey).trim()] = {
        submittedAt: new Date().toISOString(),
        score,
        total
    };
    try {
        localStorage.setItem(SUBMITTED_LIVE_EXAMS_KEY, JSON.stringify(submitted));
    } catch(e) {}
}

let currentExamKey = '';
let currentExamIsLive = false;
`;

if (!modelTestJs.includes('SUBMITTED_LIVE_EXAMS_KEY')) {
    modelTestJs = liveSubmissionHelpers + '\n' + modelTestJs;
}

// Update generateSingleCardHtml
const generateSingleCardHtmlNew = `function generateSingleCardHtml(item, prefix = 'card-mt-') {
    const isLive = isExamLiveNow(item);
    const examKey = item.examNo || (item.serialNo < 10 ? '0' + item.serialNo : '' + item.serialNo);
    const dateStr = item.date || '01-11-26';
    const chaptersStr = item.chapters || 'প্রথম অধ্যায়';
    const participantsCount = item.participants || 547;
    const totalQ = item.totalQuestions || 25;
    const duration = item.duration || 25;
    const totalM = item.totalMarks || 25;
    const titleSafe = (item.title || ('Model Test ' + examKey)).replace(/'/g, "\\\\'");
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

    return \`
        <div class="test-card model-test-card \${isLive ? 'is-live-active' : ''}" 
             data-category="\${item.category || 'full'}" 
             data-is-live="\${isLive ? 'true' : 'false'}"
             id="\${prefix ? prefix + examKey : 'card-mt-' + examKey}">
            <div>
                <!-- Top Row -->
                <div class="mt-top-row">
                    <div class="mt-date-pill">Date: \${escapeHtml(dateStr)}</div>
                    <div class="mt-top-right">
                        <div class="mt-badges-row">
                            <div class="mt-participants-pill">
                                <i class="fa-solid fa-users"></i> \${toBanglaNum(participantsCount)} জন
                            </div>
                            <div class="mt-live-badge" id="live-badge-\${prefix}\${examKey}" style="\${isLive ? '' : 'display:none;'}">
                                <span class="mt-live-dot"></span> LIVE
                            </div>
                        </div>
                        <!-- Live Remaining Time below LIVE badge -->
                        <div class="mt-live-countdown" id="live-countdown-\${prefix}\${examKey}" style="\${isLive ? '' : 'display:none;'}">
                            \${isLive ? getRemainingLiveTimeText(item) : ''}
                        </div>
                    </div>
                </div>

                <!-- Heading & Chapters -->
                <h3 class="mt-exam-no">Exam No: \${escapeHtml(examKey)}</h3>
                <div class="mt-chapters">Chapters: <span>\${escapeHtml(chaptersStr)}</span></div>

                <!-- Meta info row -->
                <div class="mt-meta-row">
                    <span class="mt-meta-item"><i class="fa-solid fa-circle-question"></i> \${toBanglaNum(totalQ)}টি প্রশ্ন</span>
                    <span class="mt-meta-item"><i class="fa-solid fa-clock"></i> \${toBanglaNum(duration)} মিনিট</span>
                    <span class="mt-meta-item"><i class="fa-solid fa-award"></i> \${toBanglaNum(totalM)} নম্বর</span>
                </div>
            </div>

            <!-- Action Button -->
            <button class="\${btnClass}" onclick="startExam('\${titleSafe}', \${duration}, '\${examKey}')">
                <i class="fa-solid \${hasSubmittedLive ? 'fa-circle-check' : 'fa-play'}"></i> <span>\${escapeHtml(btnText)}</span>
            </button>
        </div>
    \`;
}`;

modelTestJs = modelTestJs.replace(/function generateSingleCardHtml\(item, prefix = 'card-mt-'\)\s*\{[\s\S]*?^\}/m, generateSingleCardHtmlNew);

// Update renderModelTestCards to remove featuredLiveSection
const renderModelTestCardsNew = `function renderModelTestCards(list) {
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
}`;

modelTestJs = modelTestJs.replace(/function renderModelTestCards\(list\)\s*\{[\s\S]*?^\}/m, renderModelTestCardsNew);

// Update startLiveCountdowns
const startLiveCountdownsNew = `function startLiveCountdowns() {
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
}`;

modelTestJs = modelTestJs.replace(/function startLiveCountdowns\(\)\s*\{[\s\S]*?^\}/m, startLiveCountdownsNew);

// Update startExam
const startExamNew = `async function startExam(testTitle, durationMins = 25, examNo = '') {
    let examKey = examNo || '';
    if (!examKey && testTitle) {
        const match = String(testTitle).match(/(\\d+)/);
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
            alert('❌ আপনি ইতিমধ্যে এই লাইভ পরীক্ষায় অংশগ্রহণ করেছেন!\\n\\nলাইভ চলাকালীন সময়ে একজন শিক্ষার্থী একবারই পরীক্ষা দিতে পারবেন। লাইভ সময় শেষ হয়ে পূর্ববর্তী লাইভ পরীক্ষা (Previous Live Exam) হলে যতবার ইচ্ছে পুনরায় দিতে পারবেন।');
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
        container.innerHTML = \`
            <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
                <p style="font-weight: 500;">ডাটাবেজ থেকে প্রশ্নপত্র লোড করা হচ্ছে...</p>
            </div>
        \`;
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
            container.innerHTML = \`
                <div style="text-align: center; padding: 60px 20px; background: #FFF; border-radius: 16px; border: 1px solid #E2E8F0; margin: 20px 0;">
                    <i class="fa-solid fa-clipboard-question" style="font-size: 3rem; color: #94A3B8; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: #1E293B; margin-bottom: 8px;">এই লাইভ পরীক্ষার জন্য এখনও কোনো প্রশ্ন আপলোড করা হয়নি।</h3>
                    <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 24px;">অ্যাডমিন প্যানেল থেকে প্রশ্ন আপলোড করার পর এখানে প্রদর্শিত হবে।</p>
                    <button class="btn btn-primary" onclick="exitExam()" style="display: inline-flex; align-items: center; gap: 8px; margin: 0 auto;">
                        <i class="fa-solid fa-arrow-left"></i> <span>মডেল টেস্ট তালিকায় ফিরে যান</span>
                    </button>
                </div>
            \`;
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
}`;

modelTestJs = modelTestJs.replace(/async function startExam\(testTitle, durationMins = 25\)\s*\{[\s\S]*?window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);\s*\}/m, startExamNew);

// Update renderAllQuestions to pass mode: 'exam' (NOT 'study')
modelTestJs = modelTestJs.replace(
    /mode:\s*['"]study['"]/g,
    "mode: 'exam'"
);

// Update selectExamOption to pass mode: 'exam'
modelTestJs = modelTestJs.replace(
    /handleModernOptionClick\(opt,\s*qIndex,\s*optionIndex,\s*correctIndex,\s*['"]study['"]\)/g,
    "handleModernOptionClick(opt, qIndex, optionIndex, correctIndex, 'exam')"
);

// Update retakeExam to prevent retaking during live exam
const retakeExamNew = `function retakeExam() {
    if (currentExamIsLive && hasUserSubmittedLiveExam(currentExamKey)) {
        alert('❌ লাইভ পরীক্ষা চলাকালীন সময়ে একজন শিক্ষার্থী একবারই পরীক্ষা দিতে পারবেন। লাইভ শেষ হলে যতবার ইচ্ছে পুনরায় দিতে পারবেন।');
        return;
    }
    const resultModal = document.getElementById('examResultModal');
    if (resultModal) {
        resultModal.classList.remove('open');
    }
    startExam(currentExamTitle, currentExamDuration, currentExamKey);
}`;

modelTestJs = modelTestJs.replace(/function retakeExam\(\)\s*\{[\s\S]*?^\}/m, retakeExamNew);

// Update submitExam to set marks on left and percentage on right, record submission if live, and hide retake button
const submitExamNew = `function submitExam() {
    clearInterval(timerInterval);
    isExamSubmitted = true;

    let correctCount = 0;
    let wrongCount = 0;

    activeExamQuestions.forEach((q, idx) => {
        const card = document.getElementById(\`modern-mcq-card-\${idx}\`) || document.getElementById(\`model-mcq-card-\${idx}\`) || document.getElementById(\`question-card-\${idx}\`);
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
        const correctOpt = card.querySelector(\`[data-opt-idx="\${correctOptIndex}"]\`);
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
                const wrongOpt = card.querySelector(\`[data-opt-idx="\${userSelected}"]\`);
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
        marksEl.innerText = \`\${toBanglaNum(correctCount)} / \${toBanglaNum(totalQuestions)}\`;
    }
    const percEl = document.getElementById('modal-score-percentage');
    if (percEl) {
        percEl.innerText = \`\${toBanglaNum(scorePercentage)}%\`;
    }

    document.getElementById('modal-correct-count').innerText = \`\${toBanglaNum(correctCount)}টি\`;
    document.getElementById('modal-wrong-count').innerText = \`\${toBanglaNum(wrongCount)}টি\`;
    document.getElementById('modal-skipped-count').innerText = \`\${toBanglaNum(skippedCount)}টি\`;

    // যদি চলমান লাইভ পরীক্ষা হয়, ইউজারের সাবমিশন রেকর্ড করা
    if (currentExamIsLive && currentExamKey) {
        recordLiveExamSubmission(currentExamKey, correctCount, totalQuestions);
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
                        pointAwardEl.innerHTML = \`<i class="fa-solid fa-trophy" style="color: #F59E0B; font-size: 1.35rem;"></i> <span>অভিনন্দন! ২০-এর উপরে (\${toBanglaNum(correctCount)}) স্কোর করায় আপনার প্রোফাইলে <strong>+১ পয়েন্ট</strong> যোগ হয়েছে! মোট পয়েন্ট: <strong>\${toBanglaNum(res.newPoints)}</strong></span>\`;
                        if (window.showToast) {
                            window.showToast('🎉 অভিনন্দন! মডেল টেস্টে ২০ এর উপরে স্কোর করায় ১ পয়েন্ট অর্জিত হয়েছে!', 'success');
                        }
                    }
                })
                .catch(() => {});
        }
    }

    document.getElementById('examResultModal').classList.add('open');
}`;

modelTestJs = modelTestJs.replace(/function submitExam\(\)\s*\{[\s\S]*?document\.getElementById\('examResultModal'\)\.classList\.add\('open'\);\s*\}/m, submitExamNew);

fs.writeFileSync(modelTestJsPath, modelTestJs, 'utf8');
console.log('Successfully updated assets/js/model-test.js');


// -------------------------------------------------------------
// 4. UPDATE assets/js/api.js
// -------------------------------------------------------------
console.log('--- Updating assets/js/api.js ---');
const apiJsPath = path.join(rootDir, 'assets', 'js', 'api.js');
let apiJs = fs.readFileSync(apiJsPath, 'utf8');

// In renderModernMCQCardHTML, make sure expBtnAndBox has explanation elements present even for model test (hidden by default)
const expBtnTarget = /const expBtnAndBox = isModelTest \? `[\s\S]*?` : `/;
const expBtnReplacement = `const expBtnAndBox = \`
        <div class="modern-card-actions" style="display: flex; align-items: center; justify-content: \${isModelTest ? 'flex-end' : 'space-between'}; width: 100%; margin-top: 12px; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="modern-exp-btn" onclick="toggleModernExp(this)" style="\${isModelTest ? 'display: none;' : ''}">
                <i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন
            </button>
            \${favButtonHtml}
        </div>
        <div class="modern-exp-box" style="display: none; width: 100%; margin-top: 12px;">
            <div style="font-weight: 700; color: #4338CA; margin-bottom: 6px;"><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</div>
            <p style="margin: 0; line-height: 1.6;">\${formatModernMCQContent(explanation) || 'কোনো ব্যাখ্যা দেওয়া নেই।'}</p>
        </div>
    \`;
    const dummyOldExp = \``;

if (expBtnTarget.test(apiJs)) {
    apiJs = apiJs.replace(expBtnTarget, expBtnReplacement);
}

// Update getModelTestMCQ
const getModelTestMCQNew = `    async getModelTestMCQ(testIdentifier = '', examNo = '') {
        let numStr = '';
        if (examNo) {
            const n = parseInt(examNo, 10);
            if (!isNaN(n)) numStr = n < 10 ? '0' + n : '' + n;
        }
        if (!numStr && testIdentifier) {
            const match = String(testIdentifier).match(/(\\d+)/);
            if (match) {
                const n = parseInt(match[1], 10);
                numStr = n < 10 ? '0' + n : '' + n;
            }
        }

        // ১. ব্যাকেন্ড থেকে শুধুমাত্র এই পরীক্ষার জন্য আপলোডকৃত প্রশ্ন ফেচ করা
        try {
            const params = [];
            if (numStr) {
                params.push(\`examIdentifier=\${encodeURIComponent(numStr)}\`);
            } else if (testIdentifier) {
                params.push(\`modelTestNo=\${encodeURIComponent(testIdentifier)}\`);
            }

            const query = \`/api/mcqs?\` + params.join('&');
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
    },`;

apiJs = apiJs.replace(/async getModelTestMCQ\(testIdentifier = ''\)\s*\{[\s\S]*?return MOCK_DATA\.questions;\s*\},/m, getModelTestMCQNew);

fs.writeFileSync(apiJsPath, apiJs, 'utf8');
console.log('Successfully updated assets/js/api.js');


// -------------------------------------------------------------
// 5. UPDATE server.js
// -------------------------------------------------------------
console.log('--- Updating server.js ---');
const serverJsPath = path.join(rootDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8');

// In app.get('/api/mcqs'), handle examIdentifier and avoid filtering out Live Exam questions with categoryType
const serverMcqQueryTarget = /const \{\s*chapter,\s*categoryType,\s*boardName,\s*collegeName,\s*examYear,\s*testPaperName,\s*modelTestNo,\s*liveExamNo\s*\} = req\.query;[\s\S]*?const mcqs = await Mcq\.find\(filter\)\.sort\(\{ serialNo: 1, createdAt: -1 \}\);/;

const serverMcqQueryReplacement = `const { 
      chapter, 
      categoryType, 
      boardName, 
      collegeName, 
      examYear, 
      testPaperName, 
      modelTestNo,
      liveExamNo,
      examIdentifier
    } = req.query;

    let filter = {};

    if (examIdentifier && examIdentifier.trim()) {
      const idStr = examIdentifier.trim();
      const numMatch = idStr.match(/\\d+/);
      const num = numMatch ? numMatch[0] : idStr;
      const paddedNum = num.length === 1 ? '0' + num : num;
      
      filter.$or = [
        { liveExamNo: { $regex: new RegExp(paddedNum, 'i') } },
        { modelTestNo: { $regex: new RegExp(paddedNum, 'i') } },
        { liveExamNo: { $regex: new RegExp(idStr, 'i') } },
        { modelTestNo: { $regex: new RegExp(idStr, 'i') } }
      ];
    } else {
      if (modelTestNo && modelTestNo.trim()) {
        const numMatch = modelTestNo.match(/\\d+/);
        const numStr = numMatch ? (numMatch[0].length === 1 ? '0' + numMatch[0] : numMatch[0]) : modelTestNo.trim();
        filter.$or = [
          { modelTestNo: { $regex: new RegExp(numStr, 'i') } },
          { liveExamNo: { $regex: new RegExp(numStr, 'i') } }
        ];
      } else if (liveExamNo && liveExamNo.trim()) {
        const numMatch = liveExamNo.match(/\\d+/);
        const numStr = numMatch ? (numMatch[0].length === 1 ? '0' + numMatch[0] : numMatch[0]) : liveExamNo.trim();
        filter.$or = [
          { liveExamNo: { $regex: new RegExp(numStr, 'i') } },
          { modelTestNo: { $regex: new RegExp(numStr, 'i') } }
        ];
      }
    }

    if (chapter && chapter.trim()) {
      filter.chapter = { $regex: buildChapterRegex(chapter) };
    }

    // Only filter by categoryType if no specific exam was queried
    if (!filter.$or && categoryType && categoryType.trim()) {
      const cat = categoryType.trim();
      filter.$or = [
        { categoryTypes: { $in: [cat] } },
        { categoryType: cat }
      ];
    }

    if (boardName && boardName.trim() && boardName.toLowerCase() !== 'all') {
      const bRegex = buildBoardRegex(boardName);
      if (bRegex) filter.boardName = { $regex: bRegex };
    }
    if (collegeName && collegeName.trim()) filter.collegeName = { $regex: buildCollegeRegex(collegeName) };
    if (examYear && examYear.trim()) filter.examYear = examYear.trim();
    if (testPaperName && testPaperName.trim()) filter.testPaperName = { $regex: new RegExp(testPaperName.trim(), 'i') };

    const mcqs = await Mcq.find(filter).sort({ serialNo: 1, createdAt: 1 });`;

if (serverMcqQueryTarget.test(serverJs)) {
    serverJs = serverJs.replace(serverMcqQueryTarget, serverMcqQueryReplacement);
    fs.writeFileSync(serverJsPath, serverJs, 'utf8');
    console.log('Successfully updated server.js');
} else {
    console.warn('serverMcqQueryTarget regex did not match in server.js');
}


// -------------------------------------------------------------
// 6. UPDATE assets/js/main.js (Disable Pull-to-refresh on non-home pages)
// -------------------------------------------------------------
console.log('--- Updating assets/js/main.js ---');
const mainJsPath = path.join(rootDir, 'assets', 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

const pullToRefreshCode = `
/**
 * হোম পেজ ছাড়া অন্য কোনো পেইজে থাকলে ওপর থেকে টেনে রিলোড (Pull-to-refresh) বন্ধ করা
 */
function initPreventPullToRefresh() {
    const currentPath = (window.location.pathname || '').toLowerCase();
    const isHome = currentPath === '' || 
                   currentPath === '/' || 
                   currentPath.endsWith('/') || 
                   currentPath.endsWith('/index.html') || 
                   currentPath.endsWith('\\\\index.html') || 
                   (!currentPath.includes('/pages/') && !currentPath.includes('\\\\pages\\\\') && currentPath.includes('index.html'));

    if (!isHome) {
        document.documentElement.classList.add('no-pull-refresh');
        document.body.classList.add('no-pull-refresh');
        document.documentElement.style.overscrollBehaviorY = 'contain';
        document.body.style.overscrollBehaviorY = 'contain';

        let touchStartY = 0;
        let isTouching = false;

        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                touchStartY = e.touches[0].clientY;
                isTouching = true;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isTouching || !e.touches || e.touches.length !== 1) return;
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - touchStartY;

            // যদি পেজের একদম উপরে থাকা অবস্থায় ওপর থেকে নিচে টানা হয় (Pull down)
            const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop <= 0 && deltaY > 0) {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', () => {
            isTouching = false;
        }, { passive: true });
    }
}
`;

if (!mainJs.includes('initPreventPullToRefresh')) {
    mainJs = mainJs.replace(
        "document.addEventListener('DOMContentLoaded', () => {",
        "document.addEventListener('DOMContentLoaded', () => {\n    initPreventPullToRefresh();"
    );
    mainJs += '\n' + pullToRefreshCode;
    fs.writeFileSync(mainJsPath, mainJs, 'utf8');
    console.log('Successfully updated assets/js/main.js');
}


// -------------------------------------------------------------
// 7. UPDATE assets/css/style.css
// -------------------------------------------------------------
console.log('--- Updating assets/css/style.css ---');
const styleCssPath = path.join(rootDir, 'assets', 'css', 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const pullRefreshCss = `
/* Disable pull-to-refresh on non-home pages */
html.no-pull-refresh,
body.no-pull-refresh {
    overscroll-behavior-y: contain !important;
    overscroll-behavior: contain !important;
}
`;

if (!styleCss.includes('html.no-pull-refresh')) {
    styleCss += '\n' + pullRefreshCss;
    fs.writeFileSync(styleCssPath, styleCss, 'utf8');
    console.log('Successfully updated assets/css/style.css');
}


// -------------------------------------------------------------
// 8. UPDATE admin.html
// -------------------------------------------------------------
console.log('--- Updating admin.html ---');
const adminHtmlPath = path.join(rootDir, 'admin.html');
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');

// Ensure overscroll-behavior-y: contain is present in head style
if (!adminHtml.includes('overscroll-behavior-y: contain')) {
    adminHtml = adminHtml.replace(
        '</head>',
        '  <style>html, body { overscroll-behavior-y: contain !important; }</style>\n</head>'
    );
}

// Add options 51-60 to mcqLiveExamNo if not already present
if (!adminHtml.includes('Live Exam 51')) {
    let extraLiveExamOptions = '';
    for (let i = 51; i <= 60; i++) {
        extraLiveExamOptions += `                  <option value="Live Exam ${i}">Live Exam ${i} (লাইভ এক্সাম ${i})</option>\n`;
    }
    adminHtml = adminHtml.replace(
        '<option value="Live Exam 50">Live Exam 50 (লাইভ এক্সাম 50 - অধ্যায়ভিত্তিক স্পেশাল (3ম অধ্যায়))</option>',
        '<option value="Live Exam 50">Live Exam 50 (লাইভ এক্সাম 50 - অধ্যায়ভিত্তিক স্পেশাল (3ম অধ্যায়))</option>\n' + extraLiveExamOptions.trimEnd()
    );
}

// Expand editLiveExamNo loop to 60
adminHtml = adminHtml.replace(
    '${Array.from({length: 50}, (_, i) => {',
    '${Array.from({length: 60}, (_, i) => {'
);

fs.writeFileSync(adminHtmlPath, adminHtml, 'utf8');
console.log('Successfully updated admin.html');

console.log('--- ALL UPDATES APPLIED SUCCESSFULLY ---');
