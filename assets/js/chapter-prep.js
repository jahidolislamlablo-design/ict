/**
 * CHAPTER PREPARATION SCRIPT
 * Responsive Architecture:
 * - Desktop (> 768px): Preserved previous desktop interface with modal and standard cards.
 * - Mobile (<= 768px): Tactile Neumorphic Soft UI with 3 tabs [ MCQ, CQ, Model Test ].
 */

let activeChapter = '';
let activeChapterId = 1;
let currentActiveTab = 'mcq';
let currentChapterMcqs = [];
let desktopCurrentView = 'list'; // 'list', 'mcq', 'cq'

document.addEventListener('DOMContentLoaded', () => {
    syncDynamicChapters();
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

// Card Click Trigger
function openChapterModal(chapterTitle, chapterId = null) {
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
}

function closeChapterModal() {
    const modal = document.getElementById('chapterModeModal');
    if (modal) modal.classList.remove('open');
}

// ----------------------------------------------------
// DESKTOP MODE SELECTION
// ----------------------------------------------------
async function selectChapterMode(mode) {
    closeChapterModal();
    const chapterListView = document.getElementById('chapterListView');
    const mcqView = document.getElementById('mcqView');
    const cqView = document.getElementById('cqView');
    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    const backBtnText = document.getElementById('back-btn-text');

    if (chapterListView) chapterListView.style.display = 'none';

    if (mode === 'mcq') {
        desktopCurrentView = 'mcq';
        if (mcqView) mcqView.style.display = 'block';
        if (cqView) cqView.style.display = 'none';
        
        const titleEl = document.getElementById('active-mcq-title');
        if (titleEl) titleEl.innerText = activeChapter + ' - MCQ অনুশীলন';
        if (currentBreadcrumb) currentBreadcrumb.innerText = activeChapter + ' > MCQ';

        await loadDesktopChapterMCQs();
    } else {
        desktopCurrentView = 'cq';
        if (mcqView) mcqView.style.display = 'none';
        if (cqView) cqView.style.display = 'block';
        
        const titleEl = document.getElementById('active-cq-title');
        if (titleEl) titleEl.innerText = activeChapter + ' - সৃজনশীল (CQ)';
        if (currentBreadcrumb) currentBreadcrumb.innerText = activeChapter + ' > CQ';

        await loadDesktopChapterCQs();
    }

    if (backBtnText) backBtnText.innerText = 'অধ্যায়ে ফিরে যান';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadDesktopChapterMCQs() {
    const container = document.getElementById('chapter-mcq-list');
    const countDisplay = document.getElementById('chapter-mcq-count');
    const toggle = document.getElementById('desktopChapterShowAnsToggle');
    if (toggle) toggle.checked = false;

    if (!container) return;

    container.innerHTML = '<div style="text-align:center; padding:45px 20px;"><i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color:var(--primary);"></i><p style="margin-top:10px;">ডাটাবেজ থেকে প্রশ্ন লোড হচ্ছে...</p></div>';

    try {
        const questions = await ApiService.getChapterMCQ(activeChapterId);
        currentChapterMcqs = questions || [];

        if (!questions || questions.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; background:#fff; border-radius:12px; border:1px dashed #cbd5e1;">কোনো প্রশ্ন পাওয়া যায়নি</div>';
            if (countDisplay) countDisplay.innerHTML = '<i class="fa-solid fa-list-check"></i> মোট প্রশ্ন: ০টি';
            return;
        }

        if (countDisplay) {
            countDisplay.innerHTML = '<i class="fa-solid fa-list-check"></i> মোট প্রশ্ন: ' + toBanglaNum(questions.length) + 'টি';
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += renderMCQCardHTML(q, idx);
        });
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = '<div style="text-align:center; color:red; padding:30px;">প্রশ্ন লোড করতে সমস্যা হয়েছে</div>';
    }
}

async function loadDesktopChapterCQs() {
    const container = document.getElementById('chapter-cq-list');
    if (!container) return;

    container.innerHTML = '<div style="text-align:center; padding:45px 20px;"><i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color:var(--primary);"></i><p style="margin-top:10px;">সৃজনশীল প্রশ্ন লোড হচ্ছে...</p></div>';

    try {
        const questions = await ApiService.getChapterCQ(activeChapterId);
        if (!questions || questions.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; background:#fff; border-radius:12px; border:1px dashed #cbd5e1;">কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি</div>';
            return;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += renderCQCardHTML(q, idx);
        });
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = '<div style="text-align:center; color:red; padding:30px;">সৃজনশীল প্রশ্ন লোড করতে সমস্যা হয়েছে</div>';
    }
}

function toggleDesktopChapterAnswers(checkbox) {
    toggleModernShowAnswers(checkbox, '#chapter-mcq-list');
}

// ----------------------------------------------------
// MOBILE NEUMORPHIC 3-TAB VIEW
// ----------------------------------------------------
function openChapterInteractiveView(chapterTitle, chapterId = null) {
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
            titleEl.innerText = 'সৃজনশীল প্রশ্ন';
        } else {
            titleEl.innerText = activeChapter;
        }
    }
    if (backBtnText) backBtnText.innerText = 'অধ্যায়ে ফিরে যান';

    switchChapterInteractiveTab('cq'); // Open CQ or MCQ by default
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function switchChapterInteractiveTab(tab) {
    currentActiveTab = tab;

    // Segmented tab buttons active state
    const tabBtns = document.querySelectorAll('#interactiveQuizView .seg-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('tab-btn-chapter-' + tab);
    if (activeBtn) activeBtn.classList.add('active');

    // Section title
    const sectionSubtitle = document.getElementById('chapter-section-subtitle');
    if (sectionSubtitle) {
        if (tab === 'cq') sectionSubtitle.innerText = 'সৃজনশীল প্রশ্ন';
        else if (tab === 'mcq') sectionSubtitle.innerText = 'MCQ অনুশীলন';
        else if (tab === 'model') sectionSubtitle.innerText = 'মডেল টেস্ট (২৫টি প্রশ্ন)';
    }

    const panelMcq = document.getElementById('panel-chapter-mcq');
    const panelCq = document.getElementById('panel-chapter-cq');
    const panelModel = document.getElementById('panel-chapter-model');
    const showAnsWrapper = document.getElementById('chapter-show-answer-wrapper');

    if (panelMcq) panelMcq.style.display = (tab === 'mcq') ? 'block' : 'none';
    if (panelCq) panelCq.style.display = (tab === 'cq') ? 'block' : 'none';
    if (panelModel) panelModel.style.display = (tab === 'model') ? 'block' : 'none';

    if (showAnsWrapper) {
        showAnsWrapper.style.display = (tab === 'mcq') ? 'flex' : 'none';
    }

    const titleEl = document.getElementById('chapter-interactive-title');
    if (window.innerWidth <= 768) {
        if (titleEl) {
            if (tab === 'cq') titleEl.innerText = 'সৃজনশীল প্রশ্ন';
            else if (tab === 'model') titleEl.innerText = 'মডেল টেস্ট';
            else titleEl.innerText = 'MCQ অনুশীলন';
        }
    } else {
        if (titleEl) {
            const typeLabel = (tab === 'cq') ? 'সৃজনশীল (CQ)' : ((tab === 'model') ? 'মডেল টেস্ট' : 'MCQ');
            titleEl.innerText = `${activeChapter} - ${typeLabel}`;
        }
    }

    if (tab === 'mcq') {
        await loadMobileChapterMCQs();
    } else if (tab === 'cq') {
        await loadMobileChapterCQs();
    } else if (tab === 'model') {
        await loadMobileChapterModelTest();
    }
}

async function loadMobileChapterMCQs() {
    const container = document.getElementById('chapter-interactive-mcq-list');
    const toggle = document.getElementById('chapterShowAnsToggle');
    if (toggle) toggle.checked = false;

    if (!container) return;

    container.innerHTML = '<div style="text-align: center; padding: 45px 20px;"><i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: #4338CA;"></i><p style="margin-top: 10px; color: #4A5568;">MCQ প্রশ্ন লোড হচ্ছে...</p></div>';

    try {
        const questions = await ApiService.getChapterMCQ(activeChapterId);
        currentChapterMcqs = questions || [];

        if (!questions || questions.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; background: #EEF2F7; border-radius: 20px; box-shadow: inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF; color: #718096;"><i class="fa-regular fa-folder-open fa-3x" style="margin-bottom: 10px;"></i><p>কোনো প্রশ্ন পাওয়া যায়নি</p></div>';
            return;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += renderModernMCQCardHTML(q, idx, { mode: 'study' });
        });
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = '<div style="text-align: center; padding: 30px; color: #E53E3E;">প্রশ্ন লোড করতে সমস্যা হয়েছে</div>';
    }
}

async function loadMobileChapterCQs() {
    const container = document.getElementById('chapter-interactive-cq-list');
    if (!container) return;

    container.innerHTML = '<div style="text-align: center; padding: 45px 20px;"><i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: #4338CA;"></i><p style="margin-top: 10px; color: #4A5568;">সৃজনশীল প্রশ্ন লোড হচ্ছে...</p></div>';

    try {
        const questions = await ApiService.getChapterCQ(activeChapterId);

        if (!questions || questions.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; background: #EEF2F7; border-radius: 20px; box-shadow: inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF; color: #718096;"><i class="fa-regular fa-folder-open fa-3x" style="margin-bottom: 10px;"></i><p>কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি</p></div>';
            return;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += renderModernCQCardHTML(q, idx);
        });
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = '<div style="text-align: center; padding: 30px; color: #E53E3E;">সৃজনশীল প্রশ্ন লোড করতে সমস্যা হয়েছে</div>';
    }
}

async function loadMobileChapterModelTest() {
    if (!currentChapterMcqs || currentChapterMcqs.length === 0) {
        try {
            currentChapterMcqs = await ApiService.getChapterMCQ(activeChapterId) || [];
        } catch (e) {
            currentChapterMcqs = [];
        }
    }

    startInteractiveModelTest(currentChapterMcqs, 'chapter-interactive-model-container', () => {
        loadMobileChapterModelTest();
    });
}

// ----------------------------------------------------
// BACK BUTTON NAVIGATION (Desktop & Mobile)
// ----------------------------------------------------
function goBackChapterPrep() {
    const chapterListView = document.getElementById('chapterListView');
    const quizView = document.getElementById('interactiveQuizView');
    const mcqView = document.getElementById('mcqView');
    const cqView = document.getElementById('cqView');
    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    const backBtnText = document.getElementById('back-btn-text');

    if (quizView && quizView.style.display !== 'none') {
        if (window.currentExamState && window.currentExamState.timerId) {
            clearInterval(window.currentExamState.timerId);
        }
        quizView.style.display = 'none';
        if (chapterListView) chapterListView.style.display = 'block';
        if (currentBreadcrumb) currentBreadcrumb.innerText = 'অধ্যায় নির্বাচন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (desktopCurrentView === 'mcq' || desktopCurrentView === 'cq') {
        if (mcqView) mcqView.style.display = 'none';
        if (cqView) cqView.style.display = 'none';
        if (chapterListView) chapterListView.style.display = 'block';
        if (currentBreadcrumb) currentBreadcrumb.innerText = 'অধ্যায় নির্বাচন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';
        desktopCurrentView = 'list';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    window.location.href = '../index.html';
}

window.openChapterModal = openChapterModal;
window.closeChapterModal = closeChapterModal;
window.selectChapterMode = selectChapterMode;
window.openChapterInteractiveView = openChapterInteractiveView;
window.switchChapterInteractiveTab = switchChapterInteractiveTab;
window.goBackChapterPrep = goBackChapterPrep;
window.toggleDesktopChapterAnswers = toggleDesktopChapterAnswers;

async function syncDynamicChapters() {
    try {
        const meta = await ApiService.getCustomOptions();
        if (!meta || !Array.isArray(meta.chapters)) return;

        const chaptersGrid = document.querySelector('.chapters-grid');
        if (!chaptersGrid) return;

        const existingCards = Array.from(chaptersGrid.querySelectorAll('.chapter-prep-card'));
        const existingTexts = existingCards.map(c => c.innerText.toLowerCase());

        meta.chapters.forEach(ch => {
            const cleanCh = ch.trim();
            if (!cleanCh || cleanCh === 'সকল অধ্যায়' || cleanCh === 'all') return;
            const cleanLower = cleanCh.toLowerCase();

            // Match if chapter already exists in default 6 chapters
            const isPresent = existingTexts.some(et => 
                et.includes(cleanLower) || 
                (cleanLower.includes('chapter 1') && et.includes('১ম অধ্যায়')) ||
                (cleanLower.includes('অধ্যায় ১') && et.includes('১ম অধ্যায়')) ||
                (cleanLower.includes('chapter 2') && et.includes('২য় অধ্যায়')) ||
                (cleanLower.includes('chapter 3') && et.includes('৩য় অধ্যায়')) ||
                (cleanLower.includes('chapter 4') && et.includes('৪র্থ অধ্যায়')) ||
                (cleanLower.includes('chapter 5') && et.includes('৫ম অধ্যায়')) ||
                (cleanLower.includes('chapter 6') && et.includes('৬ষ্ঠ অধ্যায়'))
            );

            if (!isPresent) {
                const card = document.createElement('div');
                card.className = 'chapter-prep-card dynamic-chapter-card';
                const safeCh = cleanCh.replace(/'/g, "\\'");
                card.setAttribute('onclick', `openChapterModal('${safeCh}')`);
                card.innerHTML = `
                    <div class="chapter-card-top">
                        <div class="chapter-badge-icon" style="background: #F0FDF4; color: #16A34A;">
                            <i class="fa-solid fa-book-bookmark"></i>
                        </div>
                        <div class="chapter-heading">
                            <span>অধ্যায়</span>
                            <h3>${cleanCh}</h3>
                        </div>
                    </div>
                    <p class="chapter-desc">নতুন অধ্যায়ের প্রশ্ন ও পূর্ণাঙ্গ প্রস্তুতি।</p>
                    <div class="chapter-footer-stats">
                        <span><i class="fa-regular fa-circle-question"></i> অধ্যায়ভিত্তিক অনুশীলন</span>
                        <div class="chapter-progress-wrapper">
                            <div class="mini-progress-bar"><div class="mini-progress-fill" style="width: 0%;"></div></div>
                            <span class="progress-percent">০%</span>
                        </div>
                    </div>
                `;
                chaptersGrid.appendChild(card);
                existingTexts.push(cleanLower);
            }
        });
    } catch(err) {
        console.warn('syncDynamicChapters warning:', err);
    }
}
