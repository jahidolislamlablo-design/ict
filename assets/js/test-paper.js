/**
 * TEST PAPER SCRIPT
 * Manages steps: Years -> Colleges -> MCQ/CQ -> Interactive Questions
 * Dynamically fetches questions from Supabase backend via ApiService.
 */

let testStep = 'years';
let selectedTestYear = '2026';
let selectedCollege = '';
let selectedCollegeId = '';
let selectedQuestionType = 'MCQ';

document.addEventListener('DOMContentLoaded', () => {
    updateTestPaperStep();
});

function getCollegeIdFromName(name) {
    if (!name) return 'ndc';
    const lower = name.toLowerCase();
    if (lower.includes('নটর ডেম') || lower.includes('ndc')) return 'ndc';
    if (lower.includes('ভিকারুননিসা') || lower.includes('vnsc')) return 'vnsc';
    if (lower.includes('রাজউক') || lower.includes('rajuk')) return 'rajuk';
    if (lower.includes('রেসিডেনসিয়াল') || lower.includes('drmc')) return 'drmc';
    if (lower.includes('সিটি') || lower.includes('dc')) return 'dc';
    if (lower.includes('চট্টগ্রাম কলেজ')) return 'ctg_college';
    if (lower.includes('রাজশাহী কলেজ')) return 'raj_college';
    return 'ndc';
}

function selectTestYear(year) {
    selectedTestYear = year;
    testStep = 'colleges';
    const yearDisplay = document.getElementById('current-year-display');
    if (yearDisplay) yearDisplay.innerText = year;
    updateTestPaperStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCollegeModal(collegeName, collegeId = '') {
    selectedCollege = collegeName;
    selectedCollegeId = collegeId || getCollegeIdFromName(collegeName);
    
    const titleEl = document.getElementById('modal-college-title');
    if (titleEl) titleEl.innerText = `${selectedCollege} (${selectedTestYear})`;
    
    const modal = document.getElementById('testTypeModal');
    if (modal) modal.classList.add('open');
}

function closeCollegeModal() {
    const modal = document.getElementById('testTypeModal');
    if (modal) modal.classList.remove('open');
}

async function selectTestQuestionType(type) {
    selectedQuestionType = type;
    closeCollegeModal();
    testStep = 'questions';

    const titleEl = document.getElementById('test-q-view-title');
    if (titleEl) {
        titleEl.innerText = `${selectedCollege} - টেস্ট পরীক্ষা ${selectedTestYear} (${type})`;
    }

    if (type === 'MCQ') {
        document.getElementById('test-mcq-view').style.display = 'block';
        document.getElementById('test-cq-view').style.display = 'none';
        await loadCollegeMCQQuestions();
    } else {
        document.getElementById('test-mcq-view').style.display = 'none';
        document.getElementById('test-cq-view').style.display = 'block';
    }

    updateTestPaperStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadCollegeMCQQuestions() {
    const container = document.getElementById('test-mcq-questions-list');
    const countDisplay = document.getElementById('test-mcq-count');
    const toggle = document.getElementById('testPaperShowAns');
    if (toggle) toggle.checked = false;

    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const questions = await ApiService.getCollegeMCQ(selectedCollegeId);

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই কলেজের টেস্ট পেপারের প্রশ্ন শীঘ্রই সিস্টেমে যুক্ত করা হবে।</p>
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
        container.innerHTML = html;

    } catch (err) {
        console.error("Failed to load college MCQ:", err);
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।</p>
            </div>
        `;
    }
}

function goBackTestPaper() {
    if (testStep === 'questions') {
        testStep = 'colleges';
    } else if (testStep === 'colleges') {
        testStep = 'years';
    } else {
        window.location.href = '../index.html';
        return;
    }
    updateTestPaperStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTestPaperStep() {
    const stepYears = document.getElementById('step-years');
    const stepColleges = document.getElementById('step-colleges');
    const stepQuestions = document.getElementById('step-questions');
    const breadcrumbStep = document.getElementById('breadcrumb-current');
    const backBtnText = document.getElementById('back-btn-text');

    if (testStep === 'years') {
        if (stepYears) stepYears.style.display = 'block';
        if (stepColleges) stepColleges.style.display = 'none';
        if (stepQuestions) stepQuestions.style.display = 'none';
        if (breadcrumbStep) breadcrumbStep.innerText = 'সাল নির্বাচন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';
    } else if (testStep === 'colleges') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepColleges) stepColleges.style.display = 'block';
        if (stepQuestions) stepQuestions.style.display = 'none';
        if (breadcrumbStep) breadcrumbStep.innerText = `${selectedTestYear} > শীর্ষ কলেজ নির্বাচন`;
        if (backBtnText) backBtnText.innerText = 'সাল পরিবর্তনে যান';
    } else if (testStep === 'questions') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepColleges) stepColleges.style.display = 'none';
        if (stepQuestions) stepQuestions.style.display = 'block';
        if (breadcrumbStep) breadcrumbStep.innerText = `${selectedTestYear} > ${selectedCollege} > ${selectedQuestionType}`;
        if (backBtnText) backBtnText.innerText = 'কলেজ পরিবর্তনে যান';
    }
}

// Toggle Answers Switch
function toggleCollegeAnswers(checkbox) {
    const cards = document.querySelectorAll('#test-mcq-questions-list .question-card, #test-mcq-view .question-card');
    cards.forEach(card => {
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

function toggleAccordion(header) {
    const accordion = header.closest('.cq-accordion');
    if (accordion) {
        accordion.classList.toggle('open');
    }
}
