const fs = require('fs');

const curAdmin = fs.readFileSync('admin.html', 'utf8');
const oldAdmin = fs.readFileSync('temp_de14.html', 'utf8');

// 1. Extract clean MCQ metadata fields from oldAdmin
const oldMcqStart = oldAdmin.indexOf('<div class="grid-2" style="margin-top: 1rem;">');
const oldMcqEnd = oldAdmin.indexOf('id="mcqSerialNo"');
const cleanMcqFields = oldAdmin.substring(oldMcqStart, oldMcqEnd);

// 2. Extract clean CQ metadata fields from oldAdmin
const oldCqFormIdx = oldAdmin.indexOf('id="cqForm"');
const oldCqStart = oldAdmin.indexOf('<div class="grid-2" style="margin-top: 1rem;">', oldCqFormIdx);
const oldCqEnd = oldAdmin.indexOf('id="cqSerialNo"', oldCqStart);
const cleanCqFields = oldAdmin.substring(oldCqStart, oldCqEnd);

// In current admin.html:
// Replace MCQ metadata fields
const curMcqStart = curAdmin.indexOf('<div class="grid-2" style="margin-top: 1rem;">');
const curMcqEnd = curAdmin.indexOf('id="mcqSerialNo"');
if (curMcqStart === -1 || curMcqEnd === -1) {
    throw new Error('Could not find MCQ fields range in current admin.html');
}

let updated = curAdmin.substring(0, curMcqStart) + cleanMcqFields + curAdmin.substring(curMcqEnd);

// Replace CQ metadata fields
const curCqFormIdx = updated.indexOf('id="cqForm"');
const curCqStart = updated.indexOf('<div class="grid-2" style="margin-top: 1rem;">', curCqFormIdx);
const curCqEnd = updated.indexOf('id="cqSerialNo"', curCqStart);
if (curCqStart === -1 || curCqEnd === -1) {
    throw new Error('Could not find CQ fields range in current admin.html');
}

updated = updated.substring(0, curCqStart) + cleanCqFields + updated.substring(curCqEnd);

// 3. Clean up liveExamEditModal: Remove duplicate leChapterCheckboxes grid
const dupStart = updated.indexOf('<!-- Checkbox List -->');
if (dupStart !== -1) {
    const dupEnd = updated.indexOf('<div class="grid-3" style="margin-bottom: 0.75rem;">', dupStart);
    if (dupEnd !== -1) {
        console.log('Found duplicate checkbox list in liveExamEditModal! Removing it...');
        updated = updated.substring(0, dupStart) + updated.substring(dupEnd);
    }
}

// 4. Update handleMcqSubmit in updated to read standard selects
const curMcqSubmitStart = updated.indexOf('async function handleMcqSubmit(e) {');
const curMcqSubmitNext = updated.indexOf('const question = document.getElementById(\'mcqQuestion\').value.trim();', curMcqSubmitStart);

const cleanMcqSubmitLogic = `async function handleMcqSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('mcqSubmitBtn');
      const originalText = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '⏳ সংরক্ষণ করা হচ্ছে...';

        // একাধিক ক্যাটাগরি চেকবক্স থেকে সংগ্রহ
        const catBoxes = document.querySelectorAll('input[name="mcqCategory"]:checked');
        const categoryTypes = Array.from(catBoxes).map(cb => cb.value);

        if (categoryTypes.length === 0) {
          showToast('সতর্কতা', 'অনুগ্রহ করে কমপক্ষে একটি প্রশ্ন টাইপ নির্বাচন করুন', 'error');
          return;
        }

        const chapter = document.getElementById('mcqChapter').value;
        const boardName = document.getElementById('mcqBoardName').value;
        const collegeName = document.getElementById('mcqCollegeName').value;
        const examYear = document.getElementById('mcqExamYear').value;
        const testPaperName = document.getElementById('mcqTestPaperName').value;
        const modelTestNo = document.getElementById('mcqModelTestNo')?.value || '';
        const liveExamNo = document.getElementById('mcqLiveExamSelect')?.value || '';
        if (liveExamNo && !categoryTypes.includes('Live Exam')) { categoryTypes.push('Live Exam'); }
        if (modelTestNo && !categoryTypes.includes('Model Test')) { categoryTypes.push('Model Test'); }

        `;

updated = updated.substring(0, curMcqSubmitStart) + cleanMcqSubmitLogic + updated.substring(curMcqSubmitNext);

// 5. Update handleCqSubmit in updated to read standard selects
const curCqSubmitStart = updated.indexOf('async function handleCqSubmit(e) {');
const curCqSubmitNext = updated.indexOf('const stem = document.getElementById(\'cqStem\').value.trim();', curCqSubmitStart);

const cleanCqSubmitLogic = `async function handleCqSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('cqSubmitBtn');
      const originalText = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '⏳ সংরক্ষণ করা হচ্ছে...';

        const catBoxes = document.querySelectorAll('input[name="cqCategory"]:checked');
        const categoryTypes = Array.from(catBoxes).map(cb => cb.value);

        if (categoryTypes.length === 0) {
          showToast('সতর্কতা', 'অনুগ্রহ করে কমপক্ষে একটি প্রশ্ন টাইপ নির্বাচন করুন', 'error');
          return;
        }

        const chapter = document.getElementById('cqChapter').value;
        const boardName = document.getElementById('cqBoardName').value;
        const collegeName = document.getElementById('cqCollegeName').value;
        const examYear = document.getElementById('cqExamYear').value;
        const testPaperName = document.getElementById('cqTestPaperName').value;
        const modelTestNo = document.getElementById('cqModelTestNo')?.value || '';
        if (modelTestNo && !categoryTypes.includes('Model Test')) { categoryTypes.push('Model Test'); }

        `;

updated = updated.substring(0, curCqSubmitStart) + cleanCqSubmitLogic + updated.substring(curCqSubmitNext);

// 6. Update resetMcqForm & resetCqForm
const r1 = updated.indexOf('function resetMcqForm(keepMetadata = false) {');
const r1_end = updated.indexOf('// CQ ফর্ম সাবমিট হ্যান্ডলার', r1);
if (r1 !== -1 && r1_end !== -1) {
    const cleanResetMcq = `function resetMcqForm(keepMetadata = false) {
      document.getElementById('mcqQuestion').value = '';
      document.getElementById('mcqOpt1').value = '';
      document.getElementById('mcqOpt2').value = '';
      document.getElementById('mcqOpt3').value = '';
      document.getElementById('mcqOpt4').value = '';
      document.getElementById('mcqCorrectAnswer').value = '';
      document.getElementById('mcqExplanation').value = '';
      updateCorrectAnswerOptions();

      if (!keepMetadata) {
        document.getElementById('mcqCollegeName').value = '';
        if (document.getElementById('mcqModelTestNo')) document.getElementById('mcqModelTestNo').value = '';
        if (document.getElementById('mcqLiveExamSelect')) document.getElementById('mcqLiveExamSelect').value = '';
        document.getElementById('mcqTestPaperName').value = '';
      }
    }\n\n    `;
    updated = updated.substring(0, r1) + cleanResetMcq + updated.substring(r1_end);
}

const r2 = updated.indexOf('function resetCqForm(keepMetadata = false) {');
const r2_end = updated.indexOf('// Multi-Select Dropdown Helpers', r2);
if (r2 !== -1 && r2_end !== -1) {
    const cleanResetCq = `function resetCqForm(keepMetadata = false) {
      document.getElementById('cqStem').value = '';
      document.getElementById('cq_q_ka').value = '';
      document.getElementById('cq_a_ka').value = '';
      document.getElementById('cq_q_kha').value = '';
      document.getElementById('cq_a_kha').value = '';
      document.getElementById('cq_q_ga').value = '';
      document.getElementById('cq_a_ga').value = '';
      document.getElementById('cq_q_gha').value = '';
      document.getElementById('cq_a_gha').value = '';

      if (!keepMetadata) {
        document.getElementById('cqCollegeName').value = '';
        if (document.getElementById('cqModelTestNo')) document.getElementById('cqModelTestNo').value = '';
        document.getElementById('cqTestPaperName').value = '';
      }
    }\n\n    `;
    updated = updated.substring(0, r2) + cleanResetCq + updated.substring(r2_end);
}

fs.writeFileSync('admin.html', updated, 'utf8');
console.log('Successfully restored clean admin dropdowns in admin.html! Total length:', updated.length);
