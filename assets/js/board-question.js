/**
 * BOARD QUESTION LOGIC
 * Manages steps: Years -> Boards -> Interactive 3-Tab View [ MCQ, CQ, Model Test ]
 * Direct access without popup modal!
 */

let currentStep = 'years';
let selectedYear = '2024';
let selectedBoard = 'ঢাকা বোর্ড';
let selectedBoardCode = 'dhaka';
let currentBoardTab = 'mcq';
let currentBoardMcqs = [];

document.addEventListener('DOMContentLoaded', () => {
    updateStepView();
    syncDynamicBoardsAndYears();
});

function getBoardCode(name) {
    if (!name) return 'dhaka';
    const lower = name.toLowerCase();
    if (lower.includes('ঢাকা') || lower.includes('dhaka')) return 'dhaka';
    if (lower.includes('রাজশাহী') || lower.includes('rajshahi')) return 'rajshahi';
    if (lower.includes('চট্টগ্রাম') || lower.includes('chattogram') || lower.includes('ctg')) return 'chattogram';
    if (lower.includes('যশোর') || lower.includes('jashore') || lower.includes('jessore')) return 'jashore';
    if (lower.includes('কুমিল্লা') || lower.includes('comilla') || lower.includes('cumilla')) return 'comilla';
    if (lower.includes('সিলেট') || lower.includes('sylhet')) return 'sylhet';
    if (lower.includes('বরিশাল') || lower.includes('barishal')) return 'barishal';
    if (lower.includes('দিনাজপুর') || lower.includes('dinajpur')) return 'dinajpur';
    if (lower.includes('ময়মনসিংহ') || lower.includes('mymensingh')) return 'mymensingh';
    if (lower.includes('মাদ্রাসা') || lower.includes('madrasah')) return 'madrasah';
    return 'dhaka';
}

function selectYear(year) {
    selectedYear = year;
    currentStep = 'boards';
    const yearBadge = document.getElementById('current-year-badge');
    if (yearBadge) yearBadge.innerText = (typeof toBanglaNum === 'function') ? toBanglaNum(year) : year;
    updateStepView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Directly opens questions view without popup modal
function openTypeModal(board, code = '') {
    selectedBoard = board;
    selectedBoardCode = code || getBoardCode(board);

    if (window.innerWidth <= 768) {
        // MOBILE VIEW: Directly open Neumorphic 3-tab view!
        openBoardInteractiveView(board, selectedBoardCode);
    } else {
        // DESKTOP VIEW: Open previous modal
        const modalBoardName = document.getElementById('modal-board-name');
        if (modalBoardName) {
            modalBoardName.innerText = `${selectedBoard} (${selectedYear})`;
        }
        const modal = document.getElementById('typeModal');
        if (modal) modal.classList.add('open');
    }
}

function selectQuestionType(type) {
    closeTypeModal();
    const tab = (type === 'CQ' || type === 'cq') ? 'cq' : 'mcq';
    openBoardInteractiveView(selectedBoard, selectedBoardCode, tab);
}

function closeTypeModal() {
    const modal = document.getElementById('typeModal');
    if (modal) modal.classList.remove('open');
}

function openBoardInteractiveView(board, code = '', initialTab = 'mcq') {
    selectedBoard = board;
    selectedBoardCode = code || getBoardCode(board);
    currentStep = 'questions';

    const titleEl = document.getElementById('board-interactive-title');
    if (titleEl) {
        if (window.innerWidth <= 768) {
            titleEl.innerText = (initialTab === 'cq') ? 'সৃজনশীল প্রশ্ন' : ((initialTab === 'model') ? 'মডেল টেস্ট' : 'MCQ অনুশীলন');
        } else {
            const yr = (typeof toBanglaNum === 'function') ? toBanglaNum(selectedYear) : selectedYear;
            titleEl.innerText = `${selectedBoard} (${yr})`;
        }
    }

    updateStepView();
    switchBoardInteractiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function switchBoardInteractiveTab(tab) {
    currentBoardTab = tab;

    const tabBtns = document.querySelectorAll('#step-questions .seg-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('tab-btn-board-' + tab);
    if (activeBtn) activeBtn.classList.add('active');

    const panelMcq = document.getElementById('panel-board-mcq');
    const panelCq = document.getElementById('panel-board-cq');
    const panelModel = document.getElementById('panel-board-model');
    const showAnsWrapper = document.getElementById('board-show-answer-wrapper');

    if (panelMcq) panelMcq.style.display = (tab === 'mcq') ? 'block' : 'none';
    if (panelCq) panelCq.style.display = (tab === 'cq') ? 'block' : 'none';
    if (panelModel) panelModel.style.display = (tab === 'model') ? 'block' : 'none';

    if (showAnsWrapper) {
        showAnsWrapper.style.display = (tab === 'mcq') ? 'flex' : 'none';
    }

    const titleEl = document.getElementById('board-interactive-title');
    if (window.innerWidth <= 768) {
        if (titleEl) {
            if (tab === 'cq') titleEl.innerText = 'সৃজনশীল প্রশ্ন';
            else if (tab === 'model') titleEl.innerText = 'মডেল টেস্ট';
            else titleEl.innerText = 'MCQ অনুশীলন';
        }
    } else {
        if (titleEl) {
            const yr = (typeof toBanglaNum === 'function') ? toBanglaNum(selectedYear) : selectedYear;
            const typeLabel = (tab === 'cq') ? 'সৃজনশীল (CQ)' : ((tab === 'model') ? 'মডেল টেস্ট' : 'MCQ');
            titleEl.innerText = `${selectedBoard} (${yr}) - ${typeLabel}`;
        }
    }

    const sectionSubtitle = document.getElementById('board-section-subtitle');
    if (sectionSubtitle) {
        if (tab === 'cq') sectionSubtitle.innerText = 'সৃজনশীল প্রশ্ন';
        else if (tab === 'mcq') sectionSubtitle.innerText = 'MCQ অনুশীলন';
        else if (tab === 'model') sectionSubtitle.innerText = 'মডেল টেস্ট (২৫টি প্রশ্ন)';
    }

    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    if (tab === 'mcq') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${selectedYear} > ${selectedBoard} > MCQ`;
        await loadBoardMCQQuestions();
    } else if (tab === 'cq') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${selectedYear} > ${selectedBoard} > সৃজনশীল (CQ)`;
        await loadBoardCQQuestions();
    } else if (tab === 'model') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${selectedYear} > ${selectedBoard} > Model Test`;
        await loadBoardModelTest();
    }
}

async function loadBoardMCQQuestions() {
    const listContainer = document.getElementById('board-interactive-mcq-list');
    const toggle = document.getElementById('boardShowAnsToggle');
    if (toggle) toggle.checked = false;

    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে বোর্ড MCQ লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const questions = await ApiService.getBoardMCQ(selectedBoardCode, selectedYear);
        currentBoardMcqs = questions || [];
        
        if (!questions || questions.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই বোর্ড ও সালের প্রশ্ন শীঘ্রই সিস্টেমে যুক্ত করা হবে।</p>
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
        listContainer.innerHTML = html;

    } catch (err) {
        console.error("Failed to load board MCQ:", err);
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
            </div>
        `;
    }
}

async function loadBoardCQQuestions() {
    const cqContainer = document.getElementById('board-interactive-cq-list');
    if (!cqContainer) return;
    
    cqContainer.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে বোর্ড সৃজনশীল (CQ) প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const cqs = await ApiService.getBoardCQ(selectedBoardCode, selectedYear);
        if (!cqs || cqs.length === 0) {
            cqContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই বোর্ড ও সালের সৃজনশীল প্রশ্ন শীঘ্রই সিস্টেমে যুক্ত করা হবে।</p>
                </div>
            `;
            return;
        }

        let html = '';
        cqs.forEach((cq, idx) => {
            html += (typeof renderModernCQCardHTML === 'function') 
                ? renderModernCQCardHTML(cq, idx) 
                : renderCQCardHTML(cq, idx);
        });
        cqContainer.innerHTML = html;
    } catch (err) {
        console.error("Failed to load CQ:", err);
    }
}

async function loadBoardModelTest() {
    if (!currentBoardMcqs || currentBoardMcqs.length === 0) {
        try {
            currentBoardMcqs = await ApiService.getBoardMCQ(selectedBoardCode, selectedYear) || [];
        } catch (e) {
            currentBoardMcqs = [];
        }
    }

    if (typeof startInteractiveModelTest === 'function') {
        startInteractiveModelTest(currentBoardMcqs, 'board-interactive-model-container', () => {
            loadBoardModelTest();
        });
    }
}

function goBackStep() {
    if (currentStep === 'questions') {
        if (window.currentExamState && window.currentExamState.timerId) {
            clearInterval(window.currentExamState.timerId);
        }
        currentStep = 'boards';
    } else if (currentStep === 'boards') {
        currentStep = 'years';
    } else {
        window.location.href = '../index.html';
        return;
    }
    updateStepView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepView() {
    const stepYears = document.getElementById('step-years');
    const stepBoards = document.getElementById('step-boards');
    const stepQuestions = document.getElementById('step-questions');
    const breadcrumbStep = document.getElementById('breadcrumb-current');
    const backBtnText = document.getElementById('back-btn-text');

    if (currentStep === 'years') {
        if (stepYears) stepYears.style.display = 'block';
        if (stepBoards) stepBoards.style.display = 'none';
        if (stepQuestions) stepQuestions.style.display = 'none';
        if (breadcrumbStep) breadcrumbStep.innerText = 'সাল নির্বাচন করুন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';
    } else if (currentStep === 'boards') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepBoards) stepBoards.style.display = 'block';
        if (stepQuestions) stepQuestions.style.display = 'none';
        if (breadcrumbStep) breadcrumbStep.innerText = `${(typeof toBanglaNum === 'function') ? toBanglaNum(selectedYear) : selectedYear} > বোর্ড নির্বাচন`;
        if (backBtnText) backBtnText.innerText = 'সাল পরিবর্তনে যান';
    } else if (currentStep === 'questions') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepBoards) stepBoards.style.display = 'none';
        if (stepQuestions) stepQuestions.style.display = 'block';
        if (breadcrumbStep) breadcrumbStep.innerText = `${(typeof toBanglaNum === 'function') ? toBanglaNum(selectedYear) : selectedYear} > ${selectedBoard}`;
        if (backBtnText) backBtnText.innerText = 'বোর্ড পরিবর্তনে যান';
    }
}

window.openTypeModal = openTypeModal;
window.openBoardInteractiveView = openBoardInteractiveView;
window.switchBoardInteractiveTab = switchBoardInteractiveTab;
window.goBackStep = goBackStep;

async function syncDynamicBoardsAndYears() {
    try {
        const meta = await ApiService.getCustomOptions();
        if (!meta) return;

        // 1. Sync Years
        const yearsGrid = document.querySelector('#step-years .years-grid');
        if (yearsGrid && Array.isArray(meta.years)) {
            const existingYearCards = Array.from(yearsGrid.querySelectorAll('.year-card'));
            const existingYears = existingYearCards.map(c => {
                const numEl = c.querySelector('.year-number');
                return numEl ? numEl.innerText.trim() : '';
            });

            meta.years.forEach(yr => {
                const bYear = (typeof toBanglaNum === 'function') ? toBanglaNum(yr) : yr;
                if (!existingYears.some(ey => ey === yr || ey === bYear)) {
                    const card = document.createElement('div');
                    card.className = 'year-card dynamic-year-card';
                    card.setAttribute('onclick', `selectYear('${yr}')`);
                    card.innerHTML = `
                        <div class="year-icon"><i class="fa-solid fa-calendar-days"></i></div>
                        <div class="year-number">${bYear}</div>
                        <div class="year-sub">বোর্ড প্রশ্ন</div>
                    `;
                    yearsGrid.appendChild(card);
                    existingYears.push(bYear);
                }
            });
        }

        // 2. Sync Boards
        const boardsGrid = document.querySelector('#step-boards .boards-grid');
        if (boardsGrid && Array.isArray(meta.boards)) {
            const existingBoardCards = Array.from(boardsGrid.querySelectorAll('.board-card'));
            const existingNames = existingBoardCards.map(c => {
                const nameEl = c.querySelector('.board-name');
                return nameEl ? nameEl.innerText.trim().toLowerCase() : '';
            });

            meta.boards.forEach(bd => {
                const cleanBd = bd.trim();
                const cleanLower = cleanBd.toLowerCase();
                if (!existingNames.some(en => en.includes(cleanLower) || cleanLower.includes(en))) {
                    const card = document.createElement('div');
                    card.className = 'board-card dynamic-board-card';
                    const code = getBoardCode(cleanBd);
                    const safeBd = cleanBd.replace(/'/g, "\\'");
                    card.setAttribute('onclick', `openTypeModal('${safeBd}', '${code}')`);
                    card.innerHTML = `
                        <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                        <div>
                            <div class="board-name">${cleanBd}</div>
                            <div class="board-code">BOARD QUESTION</div>
                        </div>
                    `;
                    boardsGrid.appendChild(card);
                    existingNames.push(cleanLower);
                }
            });
        }
    } catch(err) {
        console.warn('syncDynamicBoardsAndYears warning:', err);
    }
}
