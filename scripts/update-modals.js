const fs = require('fs');

// ==========================================
// 1. UPDATE pages/chapter-prep.html
// ==========================================
let chHtml = fs.readFileSync('pages/chapter-prep.html', 'utf8');

const oldChModalRegex = /<div id="chapterModeModal"[\s\S]*?<\/div>\s*<\/div>/;
const newChModal = `<div id="chapterModeModal" class="modal-overlay" onclick="if(event.target === this) closeChapterModal()">
        <div class="bottom-sheet">
            <div class="sheet-handle"></div>
            <h3 class="sheet-title" id="modal-chapter-name">প্রশ্ন ধরন নির্বাচন করুন</h3>
            
            <div class="sheet-options">
                <div class="type-option-card" onclick="selectChapterMode('cq')">
                    <div class="type-icon cq">
                        <i class="fa-solid fa-pen-nib"></i>
                    </div>
                    <div class="type-info">
                        <h3>সৃজনশীল (CQ)</h3>
                        <p>উদ্দীপক সহ ক, খ, গ, ঘ অংশের প্রশ্ন ও আদর্শ ব্যাখ্যা</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>

                <div class="type-option-card" onclick="selectChapterMode('mcq')">
                    <div class="type-icon mcq">
                        <i class="fa-solid fa-square-check"></i>
                    </div>
                    <div class="type-info">
                        <h3>MCQ</h3>
                        <p>অধ্যায়ের বহুনির্বাচনি প্রশ্নাবলি সমাধান ও সঠিক উত্তর অনুশীলন</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>

                <div class="type-option-card" onclick="selectChapterMode('model')">
                    <div class="type-icon model">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <div class="type-info">
                        <h3>Model Test</h3>
                        <p>২৫টি প্রশ্নের নির্দিষ্ট সময়ের লাইভ স্পিড টেস্ট ও ফলাফল</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>
            </div>

            <div style="margin-top: 18px; text-align: center;">
                <button class="btn btn-outline btn-sm" onclick="closeChapterModal()">বাতিল করুন</button>
            </div>
        </div>
    </div>`;

chHtml = chHtml.replace(oldChModalRegex, newChModal);
fs.writeFileSync('pages/chapter-prep.html', chHtml, 'utf8');
console.log('Updated pages/chapter-prep.html');

// ==========================================
// 2. UPDATE assets/js/chapter-prep.js
// ==========================================
let chJs = fs.readFileSync('assets/js/chapter-prep.js', 'utf8');

const oldOpenChapterModal = `function openChapterModal(chapterTitle, chapterId = null) {
    activeChapter = chapterTitle;
    activeChapterId = chapterId || getChapterIdFromTitle(chapterTitle);

    if (window.innerWidth <= 768) {
        // MOBILE VIEW: Directly open Neumorphic 3-tab view!
        openChapterInteractiveView(chapterTitle, chapterId);
    } else {
        // DESKTOP VIEW: Open previous modal
        const modalTitle = document.getElementById('modal-chapter-name');
        if (modalTitle) modalTitle.innerText = activeChapter;
        const modal = document.getElementById('chapterModeModal');
        if (modal) modal.classList.add('open');
    }
}`;

const newOpenChapterModal = `function openChapterModal(chapterTitle, chapterId = null) {
    activeChapter = chapterTitle;
    activeChapterId = chapterId || getChapterIdFromTitle(chapterTitle);

    // ডেস্কটপ ও মোবাইল উভয় স্ক্রিনেই পপআপ মডাল শো করবে (CQ, MCQ, Model Test)
    const modalTitle = document.getElementById('modal-chapter-name');
    if (modalTitle) modalTitle.innerText = activeChapter;
    const modal = document.getElementById('chapterModeModal');
    if (modal) modal.classList.add('open');
}`;

chJs = chJs.replace(oldOpenChapterModal, newOpenChapterModal);

const oldSelectChapterModeRegex = /async function selectChapterMode\(mode\) \{[\s\S]*?window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);\s*\}/;
const newSelectChapterMode = `function selectChapterMode(mode) {
    closeChapterModal();
    // выбранный режим (cq, mcq, model) откроет соответствующий вид
    openChapterInteractiveView(activeChapter, activeChapterId, mode);
}`;

chJs = chJs.replace(oldSelectChapterModeRegex, newSelectChapterMode);

// Update openChapterInteractiveView to take initialTab
const oldOpenInteractiveViewRegex = /function openChapterInteractiveView\(chapterTitle, chapterId = null\) \{[\s\S]*?switchChapterInteractiveTab\('cq'\);/;
const newOpenInteractiveView = `function openChapterInteractiveView(chapterTitle, chapterId = null, initialTab = 'cq') {
    activeChapter = chapterTitle;
    activeChapterId = chapterId || getChapterIdFromTitle(chapterTitle);
    
    const chapterListView = document.getElementById('chapterListView');
    const quizView = document.getElementById('interactiveQuizView');
    const titleEl = document.getElementById('chapter-interactive-title');
    const backBtnText = document.getElementById('back-btn-text');

    if (chapterListView) chapterListView.style.display = 'none';
    if (quizView) quizView.style.display = 'block';

    if (titleEl) {
        if (window.innerWidth <= 768) {
            titleEl.innerText = (initialTab === 'cq') ? 'সৃজনশীল প্রশ্ন' : ((initialTab === 'model') ? 'মডেল টেস্ট' : 'MCQ অনুশীলন');
        } else {
            titleEl.innerText = activeChapter;
        }
    }
    if (backBtnText) backBtnText.innerText = 'অধ্যায়ে ফিরে যান';

    switchChapterInteractiveTab(initialTab);`;

chJs = chJs.replace(oldOpenInteractiveViewRegex, newOpenInteractiveView);

fs.writeFileSync('assets/js/chapter-prep.js', chJs, 'utf8');
console.log('Updated assets/js/chapter-prep.js');

// ==========================================
// 3. UPDATE pages/board-question.html
// ==========================================
let bHtml = fs.readFileSync('pages/board-question.html', 'utf8');

const oldBModalRegex = /<div id="typeModal"[\s\S]*?<\/div>\s*<\/div>/;
const newBModal = `<div id="typeModal" class="modal-overlay" onclick="if(event.target === this) closeTypeModal()">
        <div class="bottom-sheet">
            <div class="sheet-handle"></div>
            <h3 class="sheet-title" id="modal-board-name">প্রশ্ন ধরন নির্বাচন করুন</h3>
            
            <div class="sheet-options">
                <div class="type-option-card" onclick="selectQuestionType('cq')">
                    <div class="type-icon cq">
                        <i class="fa-solid fa-pen-nib"></i>
                    </div>
                    <div class="type-info">
                        <h3>সৃজনশীল (CQ)</h3>
                        <p>উদ্দীপক সহ ক, খ, গ, ঘ অংশের পূর্ণাঙ্গ আদর্শ উত্তর</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>

                <div class="type-option-card" onclick="selectQuestionType('mcq')">
                    <div class="type-icon mcq">
                        <i class="fa-solid fa-square-check"></i>
                    </div>
                    <div class="type-info">
                        <h3>MCQ</h3>
                        <p>বহুনির্বাচনি প্রশ্নাবলি সমাধান ও সঠিক উত্তর অনুশীলন</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>

                <div class="type-option-card" onclick="selectQuestionType('model')">
                    <div class="type-icon model">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <div class="type-info">
                        <h3>Model Test</h3>
                        <p>বোর্ডের ২৫টি প্রশ্নের লাইভ টাইমার মডেল টেস্ট</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>
            </div>

            <div style="margin-top: 18px; text-align: center;">
                <button class="btn btn-outline btn-sm" onclick="closeTypeModal()">বাতিল করুন</button>
            </div>
        </div>
    </div>`;

bHtml = bHtml.replace(oldBModalRegex, newBModal);
fs.writeFileSync('pages/board-question.html', bHtml, 'utf8');
console.log('Updated pages/board-question.html');

// ==========================================
// 4. UPDATE assets/js/board-question.js
// ==========================================
let bJs = fs.readFileSync('assets/js/board-question.js', 'utf8');

const oldBOpenRegex = /function openTypeModal\(board, code = ''\) \{[\s\S]*?modal\.classList\.add\('open'\);\s*\}\s*\}/;
const newBOpen = `function openTypeModal(board, code = '') {
    selectedBoard = board;
    selectedBoardCode = code || getBoardCode(board);

    // ডেস্কটপ ও মোবাইল উভয় স্ক্রিনেই পপআপ মডাল শো করবে (CQ, MCQ, Model Test)
    const modalBoardName = document.getElementById('modal-board-name');
    if (modalBoardName) {
        modalBoardName.innerText = \`\${selectedBoard} (\${selectedYear})\`;
    }
    const modal = document.getElementById('typeModal');
    if (modal) modal.classList.add('open');
}`;

bJs = bJs.replace(oldBOpenRegex, newBOpen);

const oldBSelectRegex = /function selectQuestionType\(type\) \{[\s\S]*?openBoardInteractiveView\(selectedBoard, selectedBoardCode, tab\);\s*\}/;
const newBSelect = `function selectQuestionType(type) {
    closeTypeModal();
    const lower = (type || '').toLowerCase();
    const tab = (lower === 'cq') ? 'cq' : ((lower === 'model') ? 'model' : 'mcq');
    openBoardInteractiveView(selectedBoard, selectedBoardCode, tab);
}`;

bJs = bJs.replace(oldBSelectRegex, newBSelect);
fs.writeFileSync('assets/js/board-question.js', bJs, 'utf8');
console.log('Updated assets/js/board-question.js');

// ==========================================
// 5. UPDATE pages/test-paper.html
// ==========================================
let tHtml = fs.readFileSync('pages/test-paper.html', 'utf8');

const oldTModalRegex = /<div id="testTypeModal"[\s\S]*?<\/div>\s*<\/div>/;
const newTModal = `<div id="testTypeModal" class="modal-overlay" onclick="if(event.target === this) closeCollegeModal()">
        <div class="bottom-sheet">
            <div class="sheet-handle"></div>
            <h3 class="sheet-title" id="modal-college-title">প্রশ্ন ধরন নির্বাচন করুন</h3>
            
            <div class="sheet-options">
                <div class="type-option-card" onclick="selectTestQuestionType('cq')">
                    <div class="type-icon cq">
                        <i class="fa-solid fa-pen-nib"></i>
                    </div>
                    <div class="type-info">
                        <h3>সৃজনশীল (CQ)</h3>
                        <p>উদ্দীপক সহ ক, খ, গ, ঘ অংশের আদর্শ সমাধান</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>

                <div class="type-option-card" onclick="selectTestQuestionType('mcq')">
                    <div class="type-icon mcq">
                        <i class="fa-solid fa-square-check"></i>
                    </div>
                    <div class="type-info">
                        <h3>MCQ</h3>
                        <p>শীর্ষ কলেজের নির্বাচনী বহুনির্বাচনি প্রশ্নাবলি সমাধান</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>

                <div class="type-option-card" onclick="selectTestQuestionType('model')">
                    <div class="type-icon model">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <div class="type-info">
                        <h3>Model Test</h3>
                        <p>কলেজের ২৫টি প্রশ্নের লাইভ স্পিড টেস্ট ও স্বয়ংক্রিয় স্কোর</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
                </div>
            </div>

            <div style="margin-top: 18px; text-align: center;">
                <button class="btn btn-outline btn-sm" onclick="closeCollegeModal()">বাতিল করুন</button>
            </div>
        </div>
    </div>`;

tHtml = tHtml.replace(oldTModalRegex, newTModal);
fs.writeFileSync('pages/test-paper.html', tHtml, 'utf8');
console.log('Updated pages/test-paper.html');

// ==========================================
// 6. UPDATE assets/js/test-paper.js
// ==========================================
let tJs = fs.readFileSync('assets/js/test-paper.js', 'utf8');

const oldTOpenRegex = /function openCollegeModal\(collegeName, collegeId = ''\) \{[\s\S]*?modal\.classList\.add\('open'\);\s*\}\s*\}/;
const newTOpen = `function openCollegeModal(collegeName, collegeId = '') {
    selectedCollege = collegeName;
    selectedCollegeId = collegeId || collegeName;

    // ডেস্কটপ ও মোবাইল উভয় স্ক্রিনেই পপআপ মডাল শো করবে (CQ, MCQ, Model Test)
    const titleEl = document.getElementById('modal-college-title');
    if (titleEl) titleEl.innerText = \`\${selectedCollege} (\${selectedTestYear})\`;
    const modal = document.getElementById('testTypeModal');
    if (modal) modal.classList.add('open');
}`;

tJs = tJs.replace(oldTOpenRegex, newTOpen);

const oldTSelectRegex = /function selectTestQuestionType\(type\) \{[\s\S]*?openCollegeInteractiveView\(selectedCollege, selectedCollegeId, tab\);\s*\}/;
const newTSelect = `function selectTestQuestionType(type) {
    closeCollegeModal();
    const lower = (type || '').toLowerCase();
    const tab = (lower === 'cq') ? 'cq' : ((lower === 'model') ? 'model' : 'mcq');
    openCollegeInteractiveView(selectedCollege, selectedCollegeId, tab);
}`;

tJs = tJs.replace(oldTSelectRegex, newTSelect);
fs.writeFileSync('assets/js/test-paper.js', tJs, 'utf8');
console.log('Updated assets/js/test-paper.js');

// ==========================================
// 7. Make segmented tabs visible on desktop in style.css
// ==========================================
let css = fs.readFileSync('assets/css/style.css', 'utf8');
css = css.replace(
    /\/\* ডেস্কটপ স্ক্রিনে ৩-ট্যাব সেগমেন্টেড বাটন লুকানো থাকবে \*\/\s*\.interactive-segmented-wrapper\s*\{\s*display:\s*none\s*!important;\s*\}/,
    `/* ডেস্কটপ স্ক্রিনে ৩-ট্যাব সেগমেন্টেড বাটন দৃশ্যমান থাকবে */
    .interactive-segmented-wrapper {
        display: grid !important;
        grid-template-columns: 1fr 1fr 1fr !important;
        max-width: 520px !important;
        margin: 16px auto 24px auto !important;
    }`
);
fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Updated style.css desktop segmented wrapper');
