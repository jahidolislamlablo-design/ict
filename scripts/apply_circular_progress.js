const fs = require('fs');
const path = require('path');

// 1. UPDATE assets/css/style.css
const styleCssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const circularCss = `
/* ==========================================================================
   CIRCULAR DONUT PROGRESS WIDGET & MCQ READ CHECKBOX
   ========================================================================== */
.circular-progress-widget {
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 22px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

@media (max-width: 600px) {
    .circular-progress-widget {
        flex-direction: column;
        text-align: center;
        gap: 16px;
        padding: 16px;
    }
}

body.dark-mode .circular-progress-widget {
    background: #1E293B !important;
    border-color: #334155 !important;
}

.circ-chart-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
}

.circ-chart-wrap svg {
    transform: rotate(-90deg);
    width: 120px;
    height: 120px;
}

.circ-center-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 90px;
}

.circ-center-count {
    font-size: 1.05rem;
    font-weight: 800;
    color: #1E293B;
    line-height: 1.2;
}

body.dark-mode .circ-center-count {
    color: #F8FAFC !important;
}

.circ-center-pct {
    font-size: 0.72rem;
    font-weight: 700;
    color: #2563EB;
    margin-top: 2px;
}

.circ-stats-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.circ-stats-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 2px;
}

body.dark-mode .circ-stats-title {
    color: #F8FAFC !important;
}

.circ-stats-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #475569;
}

body.dark-mode .circ-stats-item {
    color: #CBD5E1 !important;
}

.circ-stats-item strong {
    font-weight: 800;
}

/* MCQ Question Card Checkbox & Read State */
.modern-quiz-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
}

.modern-quiz-card.is-read-question {
    background: #EFF6FF !important; /* Gentle light blue */
    border: 1.5px solid #93C5FD !important;
    box-shadow: 0 4px 18px rgba(59, 130, 246, 0.14) !important;
}

body.dark-mode .modern-quiz-card.is-read-question {
    background: #172554 !important; /* Dark blue in dark mode */
    border-color: #2563EB !important;
}

.mcq-read-toggle-box {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #F1F5F9;
    border: 1px solid #CBD5E1;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
    user-select: none;
}

.mcq-read-toggle-box:hover {
    background: #E2E8F0;
}

.modern-quiz-card.is-read-question .mcq-read-toggle-box {
    background: #DBEAFE;
    border-color: #93C5FD;
}

body.dark-mode .mcq-read-toggle-box {
    background: #334155;
    border-color: #475569;
}

.mcq-read-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #475569;
}

.modern-quiz-card.is-read-question .mcq-read-label {
    color: #1D4ED8;
}

body.dark-mode .mcq-read-label {
    color: #94A3B8;
}

body.dark-mode .modern-quiz-card.is-read-question .mcq-read-label {
    color: #93C5FD;
}

.mcq-read-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 2px solid #94A3B8;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    color: transparent;
    transition: all 0.2s;
}

.mcq-read-checkbox.checked {
    background: #2563EB;
    border-color: #2563EB;
    color: #FFFFFF;
}
`;

if (!styleCss.includes('circular-progress-widget')) {
    styleCss += '\n' + circularCss;
    fs.writeFileSync(styleCssPath, styleCss, 'utf8');
    console.log('✓ Added circular progress widget & read checkbox styles to assets/css/style.css');
}

// 2. UPDATE assets/js/api.js WITH PROGRESS & READ TRACKING
const apiJsPath = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let apiJs = fs.readFileSync(apiJsPath, 'utf8');

const progressFunctions = `
// =========================================================================
// READ QUESTION TRACKING & CIRCULAR PROGRESS WIDGET
// =========================================================================
function getReadQuestionsSet() {
    try {
        const raw = localStorage.getItem('ict_read_mcqs_v2');
        if (raw) return new Set(JSON.parse(raw));
    } catch(e) {}
    return new Set();
}

function isQuestionRead(qId) {
    if (!qId) return false;
    const set = getReadQuestionsSet();
    return set.has(String(qId));
}
window.isQuestionRead = isQuestionRead;

function toggleQuestionRead(qId, cardId) {
    if (!qId) return;
    const strId = String(qId);
    const set = getReadQuestionsSet();
    const isCurrentlyRead = set.has(strId);

    if (isCurrentlyRead) {
        set.delete(strId);
    } else {
        set.add(strId);
    }

    try {
        localStorage.setItem('ict_read_mcqs_v2', JSON.stringify(Array.from(set)));
    } catch(e) {}

    // Update DOM card appearance
    const card = document.getElementById(cardId) || document.querySelector(\`[data-q-id="\${strId}"]\`);
    if (card) {
        const isRead = !isCurrentlyRead;
        if (isRead) {
            card.classList.add('is-read-question');
        } else {
            card.classList.remove('is-read-question');
        }

        const checkbox = card.querySelector('.mcq-read-checkbox');
        if (checkbox) {
            if (isRead) checkbox.classList.add('checked');
            else checkbox.classList.remove('checked');
        }

        const label = card.querySelector('.mcq-read-label');
        if (label) {
            label.textContent = isRead ? 'পড়া সম্পন্ন' : 'পড়া হয়েছে';
        }
    }

    // Refresh circular chart
    updateActiveCircularChart();
}
window.toggleQuestionRead = toggleQuestionRead;

function buildCircularProgressHTML(totalCount, readCount, title = 'পড়ার অগ্রগতি') {
    const total = Math.max(1, totalCount || 0);
    const read = Math.min(total, Math.max(0, readCount || 0));
    const remaining = Math.max(0, total - read);
    const pct = Math.round((read / total) * 100);

    const radius = 45;
    const circumference = 2 * Math.PI * radius; // ~282.74
    const offset = circumference - (pct / 100) * circumference;

    return \`
        <div class="circular-progress-widget" id="activeCircularProgressWidget" data-total="\${total}">
            <div class="circ-chart-wrap">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="\${radius}" stroke="#E2E8F0" stroke-width="8" fill="none"></circle>
                    <circle id="circProgressStroke" cx="50" cy="50" r="\${radius}" stroke="#2563EB" stroke-width="8" stroke-linecap="round" fill="none"
                        stroke-dasharray="\${circumference}" stroke-dashoffset="\${offset}" style="transition: stroke-dashoffset 0.5s ease;"></circle>
                </svg>
                <div class="circ-center-info">
                    <div class="circ-center-count" id="circCountDisplay">\${toBanglaNum(read)}/\${toBanglaNum(total)}</div>
                    <div class="circ-center-pct" id="circPctDisplay">\${toBanglaNum(pct)}% সম্পন্ন</div>
                </div>
            </div>
            <div class="circ-stats-side">
                <div class="circ-stats-title"><i class="fa-solid fa-chart-pie" style="color: #2563EB; margin-right: 6px;"></i> \${title}</div>
                <div class="circ-stats-item">
                    <span><i class="fa-solid fa-circle-check" style="color: #10B981; margin-right: 6px;"></i> পড়া হয়েছে:</span>
                    <strong id="circReadStat" style="color: #10B981;">\${toBanglaNum(read)} টি (\${toBanglaNum(pct)}%)</strong>
                </div>
                <div class="circ-stats-item">
                    <span><i class="fa-regular fa-circle" style="color: #94A3B8; margin-right: 6px;"></i> বাকি আছে:</span>
                    <strong id="circRemStat" style="color: #64748B;">\${toBanglaNum(remaining)} টি (\${toBanglaNum(100 - pct)}%)</strong>
                </div>
            </div>
        </div>
    \`;
}
window.buildCircularProgressHTML = buildCircularProgressHTML;

function updateActiveCircularChart() {
    const widget = document.getElementById('activeCircularProgressWidget');
    if (!widget) return;

    // Count how many questions on page are currently read
    const allCards = document.querySelectorAll('.modern-quiz-card');
    if (!allCards || allCards.length === 0) return;

    let total = allCards.length;
    let read = 0;
    allCards.forEach(card => {
        const qId = card.getAttribute('data-q-id');
        if (qId && isQuestionRead(qId)) read++;
        else if (card.classList.contains('is-read-question')) read++;
    });

    const remaining = total - read;
    const pct = Math.round((read / total) * 100);

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    const stroke = document.getElementById('circProgressStroke');
    if (stroke) stroke.style.strokeDashoffset = offset;

    const countDisp = document.getElementById('circCountDisplay');
    if (countDisp) countDisp.textContent = \`\${toBanglaNum(read)}/\${toBanglaNum(total)}\`;

    const pctDisp = document.getElementById('circPctDisplay');
    if (pctDisp) pctDisp.textContent = \`\${toBanglaNum(pct)}% সম্পন্ন\`;

    const readStat = document.getElementById('circReadStat');
    if (readStat) readStat.textContent = \`\${toBanglaNum(read)} টি (\${toBanglaNum(pct)}%)\`;

    const remStat = document.getElementById('circRemStat');
    if (remStat) remStat.textContent = \`\${toBanglaNum(remaining)} টি (\${toBanglaNum(100 - pct)}%)\`;
}
window.updateActiveCircularChart = updateActiveCircularChart;
`;

if (!apiJs.includes('toggleQuestionRead')) {
    apiJs += '\n' + progressFunctions;
    console.log('✓ Added progress functions to assets/js/api.js');
}

// Also update renderModernMCQCardHTML in api.js to include the read checkbox and initial is-read class!
// Let's replace the card header inside renderModernMCQCardHTML
const oldHeaderRegex = /<div class="modern-quiz-header">\s*<h3 class="modern-q-title">\$\{qNum\}\. \$\{formatModernMCQContent\(qText\)\}<\/h3>\s*<\/div>/;

const newHeader = `<div class="modern-quiz-header" onclick="toggleQuestionRead('\${qId}', '\${cardId}')" style="cursor: pointer;" title="ক্লিক করে পড়া সম্পন্ন চিহ্নিত করুন">
                <h3 class="modern-q-title">\${qNum}. \${formatModernMCQContent(qText)}</h3>
                <div class="mcq-read-toggle-box" onclick="event.stopPropagation(); toggleQuestionRead('\${qId}', '\${cardId}')" title="পড়া সম্পন্ন হিসেবে চিহ্নিত করুন">
                    <span class="mcq-read-label">\${isRead ? 'পড়া সম্পন্ন' : 'পড়া হয়েছে'}</span>
                    <div class="mcq-read-checkbox \${isRead ? 'checked' : ''}">
                        <i class="fa-solid fa-check"></i>
                    </div>
                </div>
            </div>`;

if (oldHeaderRegex.test(apiJs)) {
    // Add isRead variable definition before returning
    apiJs = apiJs.replace(
        /const cardId = \(mode === 'exam'\) \? `model-mcq-card-\$\{index\}` : `modern-mcq-card-\$\{index\}`;/,
        `const cardId = (mode === 'exam') ? \`model-mcq-card-\${index}\` : \`modern-mcq-card-\${index}\`;\n    const isRead = isQuestionRead(qId);`
    );

    apiJs = apiJs.replace(
        /<div class="modern-quiz-card" id="\$\{cardId\}" data-q-index="\$\{index\}" data-correct-index="\$\{correctIndex\}" data-q-id="\$\{qId\}">/,
        `<div class="modern-quiz-card \${isRead ? 'is-read-question' : ''}" id="\${cardId}" data-q-index="\${index}" data-correct-index="\${correctIndex}" data-q-id="\${qId}">`
    );

    apiJs = apiJs.replace(oldHeaderRegex, newHeader);
    console.log('✓ Updated renderModernMCQCardHTML with read checkbox and header click');
}

fs.writeFileSync(apiJsPath, apiJs, 'utf8');
console.log('Progress and read-tracking setup finished.');
