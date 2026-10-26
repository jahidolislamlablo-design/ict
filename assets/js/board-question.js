/**
 * BOARD QUESTION LOGIC
 * Manages steps: Years -> Boards -> MCQ/CQ -> Interactive Questions
 * Fetches dynamic data from Supabase backend via ApiService.
 */

let currentStep = 'years';
let selectedYear = '2024';
let selectedBoard = 'ঢাকা বোর্ড';
let selectedBoardCode = 'dhaka';
let selectedType = 'MCQ';

document.addEventListener('DOMContentLoaded', () => {
    updateStepView();
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
    if (yearBadge) yearBadge.innerText = year;
    updateStepView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openTypeModal(board, code = '') {
    selectedBoard = board;
    selectedBoardCode = code || getBoardCode(board);
    const modalBoardName = document.getElementById('modal-board-name');
    if (modalBoardName) {
        modalBoardName.innerText = `${selectedBoard} (${selectedYear})`;
    }
    const modal = document.getElementById('typeModal');
    if (modal) modal.classList.add('open');
}

function closeTypeModal() {
    const modal = document.getElementById('typeModal');
    if (modal) modal.classList.remove('open');
}

async function selectQuestionType(type) {
    selectedType = type;
    closeTypeModal();
    currentStep = 'questions';
    
    const titleEl = document.getElementById('q-view-title');
    if (titleEl) {
        titleEl.innerText = `${selectedBoard} - ${selectedYear} (${selectedType})`;
    }
    
    if (type === 'MCQ') {
        document.getElementById('mcq-view-container').style.display = 'block';
        document.getElementById('cq-view-container').style.display = 'none';
        await loadBoardMCQQuestions();
    } else {
        document.getElementById('mcq-view-container').style.display = 'none';
        document.getElementById('cq-view-container').style.display = 'block';
        await loadBoardCQQuestions();
    }
    
    updateStepView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadBoardMCQQuestions() {
    const listContainer = document.getElementById('board-mcq-questions-list');
    const countDisplay = document.getElementById('board-mcq-count');
    const toggle = document.getElementById('boardShowAnsToggle');
    if (toggle) toggle.checked = false;

    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const questions = await ApiService.getBoardMCQ(selectedBoardCode, selectedYear);
        
        if (!questions || questions.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই বোর্ড ও সালের প্রশ্ন শীঘ্রই সিস্টেমে যুক্ত করা হবে।</p>
                </div>
            `;
            if (countDisplay) countDisplay.innerHTML = `<i class="fa-solid fa-circle-question"></i> মোট প্রশ্ন: ০টি`;
            return;
        }

        if (countDisplay) {
            const bNum = (typeof toBanglaNum === 'function') ? toBanglaNum(questions.length) : questions.length;
            countDisplay.innerHTML = `<i class="fa-solid fa-circle-question"></i> মোট প্রশ্ন: ${bNum}টি`;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += renderMCQCardHTML(q, idx);
        });
        listContainer.innerHTML = html;

    } catch (err) {
        console.error("Failed to load board MCQ:", err);
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">ইন্টারনেট সংযোগ চেক করুন অথবা একটু পর পুনরায় চেষ্টা করুন।</p>
            </div>
        `;
    }
}

function goBackStep() {
    if (currentStep === 'questions') {
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
        if (breadcrumbStep) breadcrumbStep.innerText = `${selectedYear} > বোর্ড নির্বাচন`;
        if (backBtnText) backBtnText.innerText = 'সাল পরিবর্তনে যান';
    } else if (currentStep === 'questions') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepBoards) stepBoards.style.display = 'none';
        if (stepQuestions) stepQuestions.style.display = 'block';
        if (breadcrumbStep) breadcrumbStep.innerText = `${selectedYear} > ${selectedBoard} > ${selectedType}`;
        if (backBtnText) backBtnText.innerText = 'বোর্ড পরিবর্তনে যান';
    }
}

// Show Answers Toggle
function toggleAnswersSwitch(checkbox) {
    const questions = document.querySelectorAll('#board-mcq-questions-list .question-card, #mcq-view-container .question-card');
    questions.forEach(card => {
        const correctOpt = card.querySelector('[data-correct="true"]');
        if (checkbox.checked) {
            card.classList.add('show-answers-active');
            if (correctOpt) {
                correctOpt.classList.add('correct');
                const icon = correctOpt.querySelector('.option-status-icon');
                if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.15rem;"></i>';
            }
        } else {
            card.classList.remove('show-answers-active');
            if (!card.classList.contains('answered')) {
                if (correctOpt) {
                    correctOpt.classList.remove('correct');
                    const icon = correctOpt.querySelector('.option-status-icon');
                    if (icon) icon.innerHTML = '';
                }
            }
        }
    });
}

// CQ Accordion Toggle
function toggleAccordion(header) {
    const accordion = header.closest('.cq-accordion');
    if (accordion) {
        accordion.classList.toggle('open');
    }
}

// বোর্ড সৃজনশীল (CQ) প্রশ্ন লোডার
async function loadBoardCQQuestions() {
    const cqContainer = document.getElementById('cq-view-container');
    if (!cqContainer) return;
    
    cqContainer.innerHTML = '<div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);"><i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i><p style="font-weight: 500;">ডাটাবেজ থেকে সৃজনশীল (CQ) প্রশ্ন লোড করা হচ্ছে...</p></div>';

    try {
        const cqs = await ApiService.getBoardCQ(selectedBoardCode, selectedYear);
        if (!cqs || cqs.length === 0) {
            cqContainer.innerHTML = '<div style="text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1.5px dashed var(--border-color); margin-top: 15px;"><i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i><h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি</h3><p style="color: var(--text-secondary); font-size: 0.95rem;">এই বোর্ড ও সালের সৃজনশীল প্রশ্ন ডাটাবেজে যুক্ত করা হলে এখানে দেখতে পাবেন।</p></div>';
            return;
        }

        let html = '';
        cqs.forEach((cq, idx) => {
            html += (typeof renderCQCardHTML === 'function') 
                ? renderCQCardHTML(cq, idx) 
                : '<div class="question-card"><p>' + cq.stem + '</p></div>';
        });
        cqContainer.innerHTML = html;
    } catch (err) {
        console.error("Failed to load CQ:", err);
    }
}
