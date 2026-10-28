/**
 * TEST PAPER SCRIPT
 * Manages steps: Years -> Colleges -> Interactive 3-Tab View [ MCQ, CQ, Model Test ]
 * Direct access without popup modal!
 */

let testStep = 'years';
let selectedTestYear = '2026';
let selectedCollege = '';
let selectedCollegeId = '';
let currentCollegeTab = 'mcq';
let currentCollegeMcqs = [];

document.addEventListener('DOMContentLoaded', () => {
    updateTestPaperStep();
    syncDynamicCollegesAndYears();
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
    if (yearDisplay) yearDisplay.innerText = (typeof toBanglaNum === 'function') ? toBanglaNum(year) : year;
    updateTestPaperStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Directly opens questions view without popup modal
function openCollegeModal(collegeName, collegeId = '') {
    selectedCollege = collegeName;
    selectedCollegeId = collegeId || collegeName;

    if (window.innerWidth <= 768) {
        // MOBILE VIEW: Directly open Neumorphic 3-tab view!
        openCollegeInteractiveView(collegeName, selectedCollegeId);
    } else {
        // DESKTOP VIEW: Open previous modal
        const titleEl = document.getElementById('modal-college-title');
        if (titleEl) titleEl.innerText = `${selectedCollege} (${selectedTestYear})`;
        const modal = document.getElementById('testTypeModal');
        if (modal) modal.classList.add('open');
    }
}

function selectTestQuestionType(type) {
    closeCollegeModal();
    const tab = (type === 'CQ' || type === 'cq') ? 'cq' : 'mcq';
    openCollegeInteractiveView(selectedCollege, selectedCollegeId, tab);
}

function closeCollegeModal() {
    const modal = document.getElementById('testTypeModal');
    if (modal) modal.classList.remove('open');
}

function openCollegeInteractiveView(collegeName, collegeId = '', initialTab = 'mcq') {
    selectedCollege = collegeName;
    selectedCollegeId = collegeId || collegeName;
    testStep = 'questions';

    const titleEl = document.getElementById('college-interactive-title');
    if (titleEl) {
        titleEl.innerText = selectedCollege;
    }

    updateTestPaperStep();
    switchCollegeInteractiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function switchCollegeInteractiveTab(tab) {
    currentCollegeTab = tab;

    const tabBtns = document.querySelectorAll('#step-questions .seg-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('tab-btn-college-' + tab);
    if (activeBtn) activeBtn.classList.add('active');

    const panelMcq = document.getElementById('panel-college-mcq');
    const panelCq = document.getElementById('panel-college-cq');
    const panelModel = document.getElementById('panel-college-model');
    const showAnsWrapper = document.getElementById('college-show-answer-wrapper');

    if (panelMcq) panelMcq.style.display = (tab === 'mcq') ? 'block' : 'none';
    if (panelCq) panelCq.style.display = (tab === 'cq') ? 'block' : 'none';
    if (panelModel) panelModel.style.display = (tab === 'model') ? 'block' : 'none';

    if (showAnsWrapper) {
        showAnsWrapper.style.display = (tab === 'mcq') ? 'flex' : 'none';
    }

    const sectionSubtitle = document.getElementById('college-section-subtitle');
    if (sectionSubtitle) {
        if (tab === 'cq') sectionSubtitle.innerText = 'সৃজনশীল প্রশ্ন';
        else if (tab === 'mcq') sectionSubtitle.innerText = 'MCQ অনুশীলন';
        else if (tab === 'model') sectionSubtitle.innerText = 'মডেল টেস্ট (২৫টি প্রশ্ন)';
    }

    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    if (tab === 'mcq') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${selectedCollege} > MCQ`;
        await loadCollegeMCQQuestions();
    } else if (tab === 'cq') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${selectedCollege} > সৃজনশীল (CQ)`;
        await loadCollegeCQQuestions();
    } else if (tab === 'model') {
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${selectedCollege} > Model Test`;
        await loadCollegeModelTest();
    }
}

async function loadCollegeMCQQuestions() {
    const container = document.getElementById('college-interactive-mcq-list');
    const toggle = document.getElementById('testPaperShowAns');
    if (toggle) toggle.checked = false;

    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে কলেজ MCQ লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const questions = await ApiService.getCollegeMCQ(selectedCollegeId);
        currentCollegeMcqs = questions || [];

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই কলেজের টেস্ট পেপারের প্রশ্ন শীঘ্রই সিস্টেমে যুক্ত করা হবে।</p>
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
        console.error("Failed to load college MCQ:", err);
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
            </div>
        `;
    }
}

async function loadCollegeCQQuestions() {
    const container = document.getElementById('college-interactive-cq-list');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে কলেজ সৃজনশীল (CQ) প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        let questions = [];
        if (typeof ApiService !== 'undefined' && ApiService.getCollegeCQ) {
            questions = await ApiService.getCollegeCQ(selectedCollegeId);
        }

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই কলেজের সৃজনশীল প্রশ্ন শীঘ্রই সিস্টেমে যুক্ত করা হবে।</p>
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
        console.error("Failed to load college CQ:", err);
    }
}

async function loadCollegeModelTest() {
    if (!currentCollegeMcqs || currentCollegeMcqs.length === 0) {
        try {
            currentCollegeMcqs = await ApiService.getCollegeMCQ(selectedCollegeId) || [];
        } catch (e) {
            currentCollegeMcqs = [];
        }
    }

    if (typeof startInteractiveModelTest === 'function') {
        startInteractiveModelTest(currentCollegeMcqs, 'college-interactive-model-container', () => {
            loadCollegeModelTest();
        });
    }
}

function goBackTestPaper() {
    if (testStep === 'questions') {
        if (window.currentExamState && window.currentExamState.timerId) {
            clearInterval(window.currentExamState.timerId);
        }
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
        if (breadcrumbStep) breadcrumbStep.innerText = 'সাল নির্বাচন করুন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';
    } else if (testStep === 'colleges') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepColleges) stepColleges.style.display = 'block';
        if (stepQuestions) stepQuestions.style.display = 'none';
        if (breadcrumbStep) breadcrumbStep.innerText = `${(typeof toBanglaNum === 'function') ? toBanglaNum(selectedTestYear) : selectedTestYear} > শীর্ষ কলেজ নির্বাচন`;
        if (backBtnText) backBtnText.innerText = 'সাল পরিবর্তনে যান';
    } else if (testStep === 'questions') {
        if (stepYears) stepYears.style.display = 'none';
        if (stepColleges) stepColleges.style.display = 'none';
        if (stepQuestions) stepQuestions.style.display = 'block';
        if (breadcrumbStep) breadcrumbStep.innerText = `${(typeof toBanglaNum === 'function') ? toBanglaNum(selectedTestYear) : selectedTestYear} > ${selectedCollege}`;
        if (backBtnText) backBtnText.innerText = 'কলেজ পরিবর্তনে যান';
    }
}

window.openCollegeModal = openCollegeModal;
window.openCollegeInteractiveView = openCollegeInteractiveView;
window.switchCollegeInteractiveTab = switchCollegeInteractiveTab;
window.goBackTestPaper = goBackTestPaper;

async function syncDynamicCollegesAndYears() {
    try {
        const meta = await ApiService.getCustomOptions();
        if (!meta) return;

        // 1. Sync Years
        const yearsGrid = document.querySelector('#step-years .years-grid');
        if (yearsGrid && Array.isArray(meta.years)) {
            const existingCards = Array.from(yearsGrid.querySelectorAll('.year-card'));
            const existingYears = existingCards.map(c => {
                const numEl = c.querySelector('.year-number');
                return numEl ? numEl.innerText.trim() : '';
            });

            meta.years.forEach(yr => {
                const bYear = (typeof toBanglaNum === 'function') ? toBanglaNum(yr) : yr;
                if (!existingYears.some(ey => ey === yr || ey === bYear)) {
                    const card = document.createElement('div');
                    card.className = 'year-card dynamic-year-card';
                    card.setAttribute('onclick', `selectTestYear('${yr}')`);
                    card.innerHTML = `
                        <div class="year-icon"><i class="fa-solid fa-calendar-days"></i></div>
                        <div class="year-number">${bYear}</div>
                        <div class="year-sub">শীর্ষ কলেজ প্রশ্ন</div>
                    `;
                    yearsGrid.appendChild(card);
                    existingYears.push(bYear);
                }
            });
        }

        // 2. Sync Colleges
        const collegesGrid = document.querySelector('#step-colleges .colleges-grid');
        if (collegesGrid && Array.isArray(meta.colleges)) {
            const existingCollegeCards = Array.from(collegesGrid.querySelectorAll('.college-card'));
            const existingNames = existingCollegeCards.map(c => {
                const tEl = c.querySelector('.college-title');
                return tEl ? tEl.innerText.trim().toLowerCase() : '';
            });

            meta.colleges.forEach(col => {
                const cleanCol = col.trim();
                const cleanLower = cleanCol.toLowerCase();
                if (!existingNames.some(en => en.includes(cleanLower) || cleanLower.includes(en))) {
                    const card = document.createElement('div');
                    card.className = 'college-card dynamic-college-card';
                    const cId = getCollegeIdFromName(cleanCol);
                    const safeCol = cleanCol.replace(/'/g, "\\'");
                    card.setAttribute('onclick', `openCollegeModal('${safeCol}', '${cId}')`);
                    card.innerHTML = `
                        <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                        <div>
                            <div class="college-title">${cleanCol}</div>
                            <div class="college-location"><i class="fa-solid fa-location-dot"></i> শীর্ষ কলেজ টেস্ট পেপার</div>
                        </div>
                    `;
                    collegesGrid.appendChild(card);
                    existingNames.push(cleanLower);
                }
            });
        }
    } catch(err) {
        console.warn('syncDynamicCollegesAndYears warning:', err);
    }
}
