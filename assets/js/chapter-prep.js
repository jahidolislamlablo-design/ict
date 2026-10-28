/**
 * CHAPTER PREPARATION INTERACTION SCRIPT
 * Dynamically fetches questions from backend via ApiService.
 * Seamless 3-Tab Segmented Interface: [ MCQ ], [ CQ ], [ Model Test ]
 */

let activeChapter = '';
let activeChapterId = 1;
let currentActiveTab = 'mcq';
let currentChapterMcqs = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialization
});

function getChapterIdFromTitle(title) {
    if (!title) return 1;
    if (title.includes('১ম অংশ') || title.includes('সংখ্যা পদ্ধতি')) return '3.1';
    if (title.includes('২য় অংশ') || title.includes('ডিজিটাল ডিভাইস') || title.includes('লজিক গেট')) return '3.2';
    if (title.includes('১ম') || title.includes('1st')) return 1;
    if (title.includes('২য়') || title.includes('2nd')) return 2;
    if (title.includes('৩য়') || title.includes('3rd')) return '3.1';
    if (title.includes('৪র্থ') || title.includes('4th')) return 4;
    if (title.includes('৫ম') || title.includes('5th')) return 5;
    if (title.includes('৬ষ্ঠ') || title.includes('6th')) return 6;
    return 1;
}

// Directly opens interactive view without any popup modal
function openChapterModal(chapterTitle, chapterId = null) {
    openChapterInteractiveView(chapterTitle, chapterId);
}

function closeChapterModal() {
    goBackChapterPrep();
}

function openChapterInteractiveView(chapterTitle, chapterId = null) {
    activeChapter = chapterTitle;
    activeChapterId = chapterId || getChapterIdFromTitle(chapterTitle);
    
    const chapterListView = document.getElementById('chapterListView');
    const quizView = document.getElementById('interactiveQuizView');
    const titleEl = document.getElementById('chapter-interactive-title');
    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    const backBtnText = document.getElementById('back-btn-text');

    if (chapterListView) chapterListView.style.display = 'none';
    if (quizView) quizView.style.display = 'block';

    if (titleEl) titleEl.innerText = activeChapter;
    if (currentBreadcrumb) currentBreadcrumb.innerText = activeChapter;
    if (backBtnText) backBtnText.innerText = 'অধ্যায়ে ফিরে যান';

    // Default to MCQ tab
    switchChapterInteractiveTab('mcq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function switchChapterInteractiveTab(tab) {
    currentActiveTab = tab;

    // Update active tab button
    const tabBtns = document.querySelectorAll('#interactiveQuizView .seg-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('tab-btn-chapter-' + tab);
    if (activeBtn) activeBtn.classList.add('active');

    // Panel visibility
    const panelMcq = document.getElementById('panel-chapter-mcq');
    const panelCq = document.getElementById('panel-chapter-cq');
    const panelModel = document.getElementById('panel-chapter-model');
    const showAnsWrapper = document.getElementById('chapter-show-answer-wrapper');

    if (panelMcq) panelMcq.style.display = (tab === 'mcq') ? 'block' : 'none';
    if (panelCq) panelCq.style.display = (tab === 'cq') ? 'block' : 'none';
    if (panelModel) panelModel.style.display = (tab === 'model') ? 'block' : 'none';

    // Show answer toggle is visible only in MCQ study tab
    if (showAnsWrapper) {
        showAnsWrapper.style.display = (tab === 'mcq') ? 'flex' : 'none';
    }

    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    if (tab === 'mcq') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = activeChapter + ' > MCQ';
        await loadChapterMCQQuestions();
    } else if (tab === 'cq') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = activeChapter + ' > সৃজনশীল (CQ)';
        await loadChapterCQQuestions();
    } else if (tab === 'model') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = activeChapter + ' > Model Test';
        await loadChapterModelTest();
    }
}

async function loadChapterMCQQuestions() {
    const container = document.getElementById('chapter-interactive-mcq-list');
    const toggle = document.getElementById('chapterShowAnsToggle');
    if (toggle) toggle.checked = false;

    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে MCQ প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const questions = await ApiService.getChapterMCQ(activeChapterId);
        currentChapterMcqs = questions || [];

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই অধ্যায়ের প্রশ্ন শীঘ্রই ডাটাবেজে যুক্ত করা হবে।</p>
                </div>
            `;
            return;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += (typeof renderModernMCQCardHTML === 'function') 
                ? renderModernMCQCardHTML(q, idx, { mode: 'study' }) 
                : renderMCQCardHTML(q, idx);
        });
        container.innerHTML = html;

    } catch (err) {
        console.error("Failed to load chapter MCQ:", err);
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
            </div>
        `;
    }
}

async function loadChapterCQQuestions() {
    const container = document.getElementById('chapter-interactive-cq-list');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে সৃজনশীল (CQ) প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        let questions = [];
        if (typeof ApiService !== 'undefined' && ApiService.getChapterCQ) {
            questions = await ApiService.getChapterCQ(activeChapterId);
        }

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই অধ্যায়ের সৃজনশীল প্রশ্ন শীঘ্রই ডাটাবেজে যুক্ত করা হবে।</p>
                </div>
            `;
            return;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += (typeof renderModernCQCardHTML === 'function') 
                ? renderModernCQCardHTML(q, idx) 
                : renderCQCardHTML(q, idx);
        });
        container.innerHTML = html;

    } catch (err) {
        console.error("Failed to load chapter CQ:", err);
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">সৃজনশীল প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
            </div>
        `;
    }
}

async function loadChapterModelTest() {
    if (!currentChapterMcqs || currentChapterMcqs.length === 0) {
        try {
            currentChapterMcqs = await ApiService.getChapterMCQ(activeChapterId) || [];
        } catch (e) {
            currentChapterMcqs = [];
        }
    }

    if (typeof startInteractiveModelTest === 'function') {
        startInteractiveModelTest(currentChapterMcqs, 'chapter-interactive-model-container', () => {
            loadChapterModelTest();
        });
    }
}

function goBackChapterPrep() {
    const chapterListView = document.getElementById('chapterListView');
    const quizView = document.getElementById('interactiveQuizView');

    if (quizView && quizView.style.display !== 'none') {
        // Stop any running exam timer
        if (window.currentExamState && window.currentExamState.timerId) {
            clearInterval(window.currentExamState.timerId);
        }

        if (chapterListView) chapterListView.style.display = 'block';
        if (quizView) quizView.style.display = 'none';

        const currentBreadcrumb = document.getElementById('breadcrumb-current');
        const backBtnText = document.getElementById('back-btn-text');
        if (currentBreadcrumb) currentBreadcrumb.innerText = 'অধ্যায় নির্বাচন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.location.href = '../index.html';
    }
}

window.openChapterModal = openChapterModal;
window.openChapterInteractiveView = openChapterInteractiveView;
window.switchChapterInteractiveTab = switchChapterInteractiveTab;
window.goBackChapterPrep = goBackChapterPrep;
