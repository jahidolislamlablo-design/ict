/**
 * CHAPTER PREPARATION INTERACTION SCRIPT
 * Dynamically fetches questions from Supabase backend via ApiService.
 */

let activeChapter = '';
let activeChapterId = 1;
let currentView = 'list'; // 'list', 'mcq', 'cq'

document.addEventListener('DOMContentLoaded', () => {
    // প্রাথমিক সেটআপ
});

function getChapterIdFromTitle(title) {
    if (!title) return 1;
    if (title.includes('১ম') || title.includes('1st')) return 1;
    if (title.includes('২য়') || title.includes('2nd')) return 2;
    if (title.includes('৩য়') || title.includes('3rd')) return 3;
    if (title.includes('৪র্থ') || title.includes('4th')) return 4;
    if (title.includes('৫ম') || title.includes('5th')) return 5;
    if (title.includes('৬ষ্ঠ') || title.includes('6th')) return 6;
    if (title.includes('৭ম') || title.includes('7th')) return 7;
    return 1;
}

function openChapterModal(chapterTitle, chapterId = null) {
    activeChapter = chapterTitle;
    activeChapterId = chapterId || getChapterIdFromTitle(chapterTitle);
    
    const modalTitle = document.getElementById('modal-chapter-name');
    if (modalTitle) modalTitle.innerText = activeChapter;
    
    const modal = document.getElementById('chapterModeModal');
    if (modal) modal.classList.add('open');
}

function closeChapterModal() {
    const modal = document.getElementById('chapterModeModal');
    if (modal) modal.classList.remove('open');
}

async function selectChapterMode(mode) {
    closeChapterModal();
    const chapterListView = document.getElementById('chapterListView');
    const mcqView = document.getElementById('mcqView');
    const cqView = document.getElementById('cqView');
    const currentBreadcrumb = document.getElementById('breadcrumb-current');
    const backBtnText = document.getElementById('back-btn-text');

    if (chapterListView) chapterListView.style.display = 'none';

    if (mode === 'mcq') {
        currentView = 'mcq';
        if (mcqView) mcqView.style.display = 'block';
        if (cqView) cqView.style.display = 'none';
        
        const titleEl = document.getElementById('active-mcq-title');
        if (titleEl) titleEl.innerText = `${activeChapter} - MCQ অনুশীলন`;
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${activeChapter} > MCQ`;

        await loadChapterMCQQuestions();
    } else {
        currentView = 'cq';
        if (mcqView) mcqView.style.display = 'none';
        if (cqView) cqView.style.display = 'block';
        
        const titleEl = document.getElementById('active-cq-title');
        if (titleEl) titleEl.innerText = `${activeChapter} - সৃজনশীল (CQ)`;
        if (currentBreadcrumb) currentBreadcrumb.innerText = `${activeChapter} > CQ`;
    }

    if (backBtnText) backBtnText.innerText = 'অধ্যায়ে ফিরে যান';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadChapterMCQQuestions() {
    const container = document.getElementById('chapter-mcq-list');
    const countDisplay = document.getElementById('chapter-mcq-count');
    const toggle = document.getElementById('chapterShowAnsToggle');
    if (toggle) toggle.checked = false;

    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-secondary);">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
            <p style="font-weight: 500;">ডাটাবেজ থেকে প্রশ্ন লোড করা হচ্ছে...</p>
        </div>
    `;

    try {
        const questions = await ApiService.getChapterMCQ(activeChapterId);

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                    <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 6px;">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">এই অধ্যায়ের প্রশ্ন শীঘ্রই ডাটাবেজে যুক্ত করা হবে।</p>
                </div>
            `;
            if (countDisplay) countDisplay.innerHTML = `<i class="fa-solid fa-list-check"></i> মোট প্রশ্ন: ০টি`;
            return;
        }

        if (countDisplay) {
            const bNum = (typeof toBanglaNum === 'function') ? toBanglaNum(questions.length) : questions.length;
            countDisplay.innerHTML = `<i class="fa-solid fa-list-check"></i> মোট প্রশ্ন: ${bNum}টি`;
        }

        let html = '';
        questions.forEach((q, idx) => {
            html += renderMCQCardHTML(q, idx);
        });
        container.innerHTML = html;

    } catch (err) {
        console.error("Failed to load chapter MCQ:", err);
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #FEF2F2; border-radius: 12px; color: var(--danger);">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p style="font-weight: 600;">প্রশ্ন লোড করতে সমস্যা হয়েছে।</p>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।</p>
            </div>
        `;
    }
}

function goBackChapterPrep() {
    if (currentView === 'mcq' || currentView === 'cq') {
        const chapterListView = document.getElementById('chapterListView');
        const mcqView = document.getElementById('mcqView');
        const cqView = document.getElementById('cqView');
        const currentBreadcrumb = document.getElementById('breadcrumb-current');
        const backBtnText = document.getElementById('back-btn-text');

        if (chapterListView) chapterListView.style.display = 'block';
        if (mcqView) mcqView.style.display = 'none';
        if (cqView) cqView.style.display = 'none';
        if (currentBreadcrumb) currentBreadcrumb.innerText = 'অধ্যায় নির্বাচন';
        if (backBtnText) backBtnText.innerText = 'হোমে ফিরে যান';
        
        currentView = 'list';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.location.href = '../index.html';
    }
}

// Toggle Answers Switch
function toggleChapterAnswers(checkbox) {
    const cards = document.querySelectorAll('#chapter-mcq-list .question-card, #mcqView .question-card');
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
