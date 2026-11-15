const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
console.log('--- PATCHING ADMIN.HTML AND SERVER.JS FOR MODEL TEST CHAPTER SELECT & MCQ AUTO-SYNC ---');

// =========================================================================
// 1. PATCH admin.html
// =========================================================================
const adminPath = path.join(root, 'admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

// Replace the category and chapter fields in liveExamEditModal
const oldCategoryAndChapter = `          <div class="grid-2" style="margin-bottom: 0.75rem;">
            <div class="form-group">
              <label for="leTitle">📝 টাইটেল</label>
              <input type="text" id="leTitle" placeholder="e.g. Model Test 01">
            </div>
            <div class="form-group">
              <label for="leCategory">ক্যাটাগরি</label>
              <select id="leCategory">
                <option value="chapter">অধ্যায়ভিত্তিক (Chapter)</option>
                <option value="full">পূর্ণাঙ্গ সিলেবাস (Full)</option>
                <option value="live">লাইভ স্পেশাল (Live)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label for="leChapters">📖 অধ্যায় / সিলেবাস (Chapters)<span class="required">*</span></label>
            <input type="text" id="leChapters" placeholder="e.g. প্রথম অধ্যায় বা ১ম ও ২য় অধ্যায়" required style="font-weight: 600;">
          </div>`;

const newCategoryAndChapter = `          <div class="grid-2" style="margin-bottom: 0.75rem;">
            <div class="form-group">
              <label for="leTitle">📝 টাইটেল</label>
              <input type="text" id="leTitle" placeholder="e.g. Model Test 01">
            </div>
            <div class="form-group">
              <label for="leCategory">🎯 ক্যাটাগরি (ক্লিক করলে অধ্যায় স্বয়ংক্রিয় সিলেক্ট হবে)</label>
              <select id="leCategory" onchange="handleLiveExamCategoryChange()" style="font-weight: 700; border: 1.5px solid #4F46E5; background: #EEF2FF; color: #3730A3;">
                <option value="chapter">অধ্যায়ভিত্তিক (Chapter)</option>
                <option value="full">পূর্ণাঙ্গ সিলেবাস (Full)</option>
                <option value="live">লাইভ স্পেশাল (Live)</option>
              </select>
            </div>
          </div>

          <!-- অধ্যায় মাল্টিপল সিলেকশন প্যানেল -->
          <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 12px 14px; margin-bottom: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="font-size: 0.88rem; font-weight: 800; color: #1E293B; margin: 0; display: flex; align-items: center; gap: 6px;">
                <span>📚 অধ্যায় নির্বাচন করুন (মাল্টিপল সিলেক্ট):</span>
              </label>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="selectAllLiveExamChapters()" style="padding: 2px 8px; font-size: 0.75rem;">সকল অধ্যায়</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="clearLiveExamChapters()" style="padding: 2px 8px; font-size: 0.75rem;">মুছুন</button>
              </div>
            </div>

            <!-- Checkbox List -->
            <div id="leChapterCheckboxes" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 6px; margin-bottom: 10px;">
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="1" onchange="syncSelectedLiveExamChapters()"> ১ম অধ্যায় (তথ্য ও যোগাযোগ প্রযুক্তি)</label>
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="2" onchange="syncSelectedLiveExamChapters()"> ২য় অধ্যায় (কমিউনিকেশন ও নেটওয়ার্ক)</label>
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="3.1" onchange="syncSelectedLiveExamChapters()"> ৩য় অধ্যায় (১ম অংশ: সংখ্যা পদ্ধতি)</label>
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="3.2" onchange="syncSelectedLiveExamChapters()"> ৩য় অধ্যায় (২য় অংশ: ডিজিটাল ডিভাইস)</label>
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="4" onchange="syncSelectedLiveExamChapters()"> ৪র্থ অধ্যায় (ওয়েব ডিজাইন ও HTML)</label>
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="5" onchange="syncSelectedLiveExamChapters()"> ৫ম অধ্যায় (প্রোগ্রামিং ভাষা - C)</label>
              <label class="le-ch-chip"><input type="checkbox" name="leChapterChoice" value="6" onchange="syncSelectedLiveExamChapters()"> ৬ষ্ঠ অধ্যায় (ডাটাবেজ - DBMS)</label>
            </div>

            <!-- অধ্যায় / সিলেবাসের নাম টেক্সট (অটোমেটিক ফিল্ড) -->
            <div class="form-group" style="margin-bottom: 8px;">
              <label for="leChapters" style="font-size: 0.82rem; color: #64748B;">সিলেবাসের নাম (স্বয়ংক্রিয়ভাবে তৈরি হবে, প্রয়োজনে পরিবর্তন করতে পারেন):<span class="required">*</span></label>
              <input type="text" id="leChapters" placeholder="e.g. ১ম ও ২য় অধ্যায়" required style="font-weight: 700; background: #FFFFFF;">
            </div>

            <!-- ২৫টি MCQ অটোমেটিক সিংক অপশন -->
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #CBD5E1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.86rem; font-weight: 700; color: #059669;">
                <input type="checkbox" id="leAutoSyncMCQ" checked style="width: 18px; height: 18px; cursor: pointer;">
                <span>⚡ নির্বাচিত অধ্যায়গুলো থেকে অটোমেটিক ২৫টি MCQ এই মডেল টেস্টে যুক্ত ও সিংক করুন</span>
              </label>
              <button type="button" class="btn btn-secondary btn-sm" onclick="previewAndSyncLiveExamMCQs()" style="font-size: 0.78rem; padding: 4px 12px; background: #ECFDF5; border: 1.5px solid #10B981; color: #047857; font-weight: 700; border-radius: 6px;">
                🔄 এখনই ২৫টি MCQ সিংক করুন
              </button>
            </div>
            <div id="leSyncStatusNotice" style="font-size: 0.82rem; color: #059669; font-weight: 700; margin-top: 6px; display: none;"></div>
          </div>`;

adminHtml = adminHtml.replace(oldCategoryAndChapter, newCategoryAndChapter);

// Add styling for .le-ch-chip
const leChipCss = `
    .le-ch-chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 10px;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #1E293B;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
    }
    .le-ch-chip:hover {
      background: #F1F5F9;
      border-color: #94A3B8;
    }
    .le-ch-chip input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
`;

if (!adminHtml.includes('.le-ch-chip')) {
  adminHtml = adminHtml.replace('</style>', leChipCss + '\n  </style>');
}

// Add JavaScript functions for Chapter multi-select and auto-sync
const leJsFunctions = `
    // Live Exam / Model Test Chapter Multi-select logic
    const CHAPTER_NAME_MAP = {
      '1': '১ম অধ্যায়',
      '2': '২য় অধ্যায়',
      '3.1': '৩য় অধ্যায় (১ম অংশ)',
      '3.2': '৩য় অধ্যায় (২য় অংশ)',
      '4': '৪র্থ অধ্যায়',
      '5': '৫ম অধ্যায়',
      '6': '৬ষ্ঠ অধ্যায়'
    };

    function handleLiveExamCategoryChange() {
      const cat = document.getElementById('leCategory')?.value;
      if (cat === 'full') {
        selectAllLiveExamChapters();
        document.getElementById('leChapters').value = 'পূর্ণাঙ্গ সিলেবাস (১ম-৬ষ্ঠ অধ্যায়)';
      } else if (cat === 'live') {
        // লাইভ স্পেশাল: ডিফল্ট ১ম ও ২য় বা সকল
        const checked = Array.from(document.querySelectorAll('input[name="leChapterChoice"]:checked'));
        if (checked.length === 0) {
          selectLiveExamChapterKeys(['1', '2']);
        }
        syncSelectedLiveExamChapters();
      } else {
        // অধ্যায়ভিত্তিক
        const checked = Array.from(document.querySelectorAll('input[name="leChapterChoice"]:checked'));
        if (checked.length === 0) {
          selectLiveExamChapterKeys(['1']);
        }
        syncSelectedLiveExamChapters();
      }
    }

    function selectAllLiveExamChapters() {
      document.querySelectorAll('input[name="leChapterChoice"]').forEach(cb => cb.checked = true);
      document.getElementById('leChapters').value = 'পূর্ণাঙ্গ সিলেবাস (১ম-৬ষ্ঠ অধ্যায়)';
    }

    function clearLiveExamChapters() {
      document.querySelectorAll('input[name="leChapterChoice"]').forEach(cb => cb.checked = false);
      document.getElementById('leChapters').value = '';
    }

    function selectLiveExamChapterKeys(keys = []) {
      document.querySelectorAll('input[name="leChapterChoice"]').forEach(cb => {
        cb.checked = keys.includes(cb.value);
      });
      syncSelectedLiveExamChapters();
    }

    function syncSelectedLiveExamChapters() {
      const checked = Array.from(document.querySelectorAll('input[name="leChapterChoice"]:checked')).map(cb => cb.value);
      const input = document.getElementById('leChapters');
      if (!input) return;

      if (checked.length === 0) {
        input.value = '';
      } else if (checked.length === 7) {
        input.value = 'পূর্ণাঙ্গ সিলেবাস (১ম-৬ষ্ঠ অধ্যায়)';
      } else {
        const labels = checked.map(k => CHAPTER_NAME_MAP[k] || (k + ' অধ্যায়'));
        if (labels.length === 1) {
          input.value = labels[0];
        } else if (labels.length === 2) {
          input.value = labels[0] + ' ও ' + labels[1];
        } else {
          const last = labels.pop();
          input.value = labels.join(', ') + ' ও ' + last;
        }
      }
    }

    // Trigger immediate MCQ sync preview
    async function previewAndSyncLiveExamMCQs() {
      const examNo = document.getElementById('leExamNo')?.value.trim();
      if (!examNo) {
        showToast('সতর্কতা', 'দয়া করে আগে এক্সাম নং (Exam No) লিখুন', 'error');
        return;
      }
      const checked = Array.from(document.querySelectorAll('input[name="leChapterChoice"]:checked')).map(cb => cb.value);
      if (checked.length === 0) {
        showToast('সতর্কতা', 'কমপক্ষে একটি অধ্যায় নির্বাচন করুন', 'error');
        return;
      }

      const notice = document.getElementById('leSyncStatusNotice');
      if (notice) {
        notice.style.display = 'block';
        notice.innerHTML = '⏳ নির্বাচিত অধ্যায়গুলো থেকে ২৫টি MCQ খোঁজা ও সিংক করা হচ্ছে...';
      }

      try {
        const res = await fetch(\`\${API_BASE}/api/model-tests/sync-mcqs\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examNo: examNo,
            chapters: checked,
            totalQuestions: parseInt(document.getElementById('leQuestions')?.value, 10) || 25
          })
        });
        const data = await res.json();
        if (data.success) {
          if (notice) {
            notice.innerHTML = \`✅ সফল! \${data.count}টি MCQ স্বয়ংক্রিয়ভাবে Model Test \${data.examNo} তে সিংক হয়েছে!\`;
          }
          showToast('সফলতা', \`\${data.count}টি MCQ মডেল টেস্ট \${data.examNo} তে সিংক হয়েছে!\`, 'success');
        } else {
          if (notice) notice.innerHTML = '❌ ' + (data.message || 'সিংক করতে ব্যর্থ হয়েছে');
          showToast('ত্রুটি', data.message || 'সিংক ব্যর্থ', 'error');
        }
      } catch(err) {
        if (notice) notice.innerHTML = '❌ এরর: ' + err.message;
        showToast('ত্রুটি', err.message, 'error');
      }
    }
`;

// Insert leJsFunctions before handleLiveExamFormSubmit
adminHtml = adminHtml.replace('async function handleLiveExamFormSubmit', leJsFunctions + '\n    async function handleLiveExamFormSubmit');

// In openNewLiveExamModal: hook category and chapter setup
adminHtml = adminHtml.replace(
  "document.getElementById('leCategory').value = 'full';",
  "document.getElementById('leCategory').value = 'full';\n      selectAllLiveExamChapters();"
);

// In editLiveExamItem: parse chapters and select checkboxes
const editChaptersHook = `
      // Parse existing chapters string to check matching boxes
      const chStr = (item.chapters || '').toLowerCase();
      const keysToSelect = [];
      if (chStr.includes('পূর্ণাঙ্গ') || chStr.includes('সকল') || chStr.includes('full')) {
        keysToSelect.push('1', '2', '3.1', '3.2', '4', '5', '6');
      } else {
        if (chStr.includes('১ম') || chStr.includes('1st') || chStr.includes('প্রথম')) keysToSelect.push('1');
        if (chStr.includes('২য়') || chStr.includes('2nd') || chStr.includes('দ্বিতীয়')) keysToSelect.push('2');
        if (chStr.includes('১ম অংশ') || chStr.includes('সংখ্যা')) keysToSelect.push('3.1');
        if (chStr.includes('২য় অংশ') || chStr.includes('ডিজিটাল') || chStr.includes('গেট')) keysToSelect.push('3.2');
        if (chStr.includes('৪র্থ') || chStr.includes('4th') || chStr.includes('html') || chStr.includes('ওয়েব')) keysToSelect.push('4');
        if (chStr.includes('৫ম') || chStr.includes('5th') || chStr.includes('প্রোগ্রামিং') || chStr.includes(' c')) keysToSelect.push('5');
        if (chStr.includes('৬ষ্ঠ') || chStr.includes('6th') || chStr.includes('ডাটাবেজ') || chStr.includes('dbms')) keysToSelect.push('6');
      }
      selectLiveExamChapterKeys(keysToSelect);
`;

adminHtml = adminHtml.replace(
  "document.getElementById('leCategory').value = item.category || 'full';",
  "document.getElementById('leCategory').value = item.category || 'full';\n" + editChaptersHook
);

// In handleLiveExamFormSubmit: pass autoSyncMCQ and selectedChapters
adminHtml = adminHtml.replace(
  "isLive: document.getElementById('leIsLiveDirect').checked",
  "isLive: document.getElementById('leIsLiveDirect').checked,\n          autoSyncMCQ: document.getElementById('leAutoSyncMCQ')?.checked !== false,\n          selectedChapters: Array.from(document.querySelectorAll('input[name=\"leChapterChoice\"]:checked')).map(cb => cb.value)"
);

fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log('✓ Successfully patched admin.html with Chapter Multi-select UI and Auto-sync 25 MCQs controls!');

// =========================================================================
// 2. PATCH server.js
// =========================================================================
const serverPath = path.join(root, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

const syncHelperCode = `
// =========================================================================
// HELPER: SYNC 25 MCQS TO A MODEL TEST FROM SELECTED CHAPTERS
// =========================================================================
async function syncModelTestMCQs(examNo, selectedChapters = [], targetCount = 25) {
  try {
    const rawNum = parseInt(examNo, 10);
    if (isNaN(rawNum)) return { success: false, message: 'Invalid exam number' };
    const paddedNum = rawNum < 10 ? '0' + rawNum : '' + rawNum;
    const modelTestTag = 'Model Test ' + paddedNum;
    const liveExamTag = 'Live Exam ' + paddedNum;

    const jsonPath = path.join(__dirname, 'database', 'mcqs.json');
    if (!fs.existsSync(jsonPath)) return { success: false, message: 'mcqs.json not found' };
    let mcqs = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const matchChapter = (m, keys) => {
      if (!keys || keys.length === 0 || keys.includes('all')) return true;
      if (!m.chapter) return false;
      const c = m.chapter;
      return keys.some(k => {
        if (k === '1') return c.includes('Chapter 1') || c.includes('১ম') || c.includes('তথ্য ও যোগাযোগ');
        if (k === '2') return c.includes('Chapter 2') || c.includes('২য়') || c.includes('কমিউনিকেশন');
        if (k === '3.1') return c.includes('Chapter 3 (১ম') || c.includes('সংখ্যা পদ্ধতি');
        if (k === '3.2') return c.includes('Chapter 3 (২য়') || c.includes('ডিজিটাল ডিভাইস');
        if (k === '4') return c.includes('Chapter 4') || c.includes('৪র্থ') || c.includes('HTML') || c.includes('ওয়েব');
        if (k === '5') return c.includes('Chapter 5') || c.includes('৫ম') || c.includes('প্রোগ্রামিং');
        if (k === '6') return c.includes('Chapter 6') || c.includes('৬ষ্ঠ') || c.includes('ডেটাবেজ');
        return c.includes(k);
      });
    };

    let candidates = mcqs.filter(m => matchChapter(m, selectedChapters));
    if (candidates.length === 0) candidates = mcqs;

    // Preserve already assigned questions for this test
    const alreadyAssigned = candidates.filter(m => 
      (m.modelTestNo && String(m.modelTestNo).includes(paddedNum)) ||
      (m.liveExamNo && String(m.liveExamNo).includes(paddedNum)) ||
      (Array.isArray(m.modelTestNos) && m.modelTestNos.some(t => String(t).includes(paddedNum)))
    );

    const needed = Math.max(0, targetCount - alreadyAssigned.length);
    const unassigned = candidates.filter(m => !alreadyAssigned.includes(m));
    const shuffled = unassigned.sort(() => 0.5 - Math.random());
    const pickedNew = shuffled.slice(0, needed);

    const finalSelected = [...alreadyAssigned, ...pickedNew].slice(0, targetCount);
    const selectedIds = new Set(finalSelected.map(m => String(m._id)));

    let updatedCount = 0;
    mcqs = mcqs.map(m => {
      if (selectedIds.has(String(m._id))) {
        updatedCount++;
        m.modelTestNo = modelTestTag;
        m.liveExamNo = liveExamTag;
        if (!Array.isArray(m.modelTestNos)) m.modelTestNos = [];
        if (!m.modelTestNos.includes(modelTestTag)) m.modelTestNos.push(modelTestTag);
        if (!m.modelTestNos.includes(liveExamTag)) m.modelTestNos.push(liveExamTag);
      }
      return m;
    });

    const destDirs = [
      path.join(__dirname, 'database'),
      'C:/Users/taibu/OneDrive/Desktop/Antygravity project/ict-easy-learning/database'
    ];
    destDirs.forEach(dir => {
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'mcqs.json'), JSON.stringify(mcqs, null, 2), 'utf8');
      } catch(e){}
    });

    if (isConnected && typeof Mcq !== 'undefined') {
      try {
        for (const m of finalSelected) {
          await Mcq.findByIdAndUpdate(m._id, {
            modelTestNo: modelTestTag,
            liveExamNo: liveExamTag,
            $addToSet: { modelTestNos: { $each: [modelTestTag, liveExamTag] } }
          });
        }
      } catch(e){}
    }

    return { success: true, count: finalSelected.length, examNo: paddedNum, modelTestTag, liveExamTag };
  } catch(err) {
    console.error('syncModelTestMCQs error:', err);
    return { success: false, error: err.message };
  }
}
`;

const routeCode = `
// ৫. মডেল টেস্টের জন্য অটোমেটিক ২৫টি MCQ সিংক করার এন্ডপয়েন্ট
app.post('/api/model-tests/sync-mcqs', async (req, res) => {
  try {
    const { examNo, chapters, totalQuestions } = req.body;
    const result = await syncModelTestMCQs(examNo, chapters, totalQuestions || 25);
    res.json(result);
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
`;

if (!serverCode.includes('syncModelTestMCQs')) {
  // Insert before app.post('/api/model-tests'
  serverCode = serverCode.replace(
    "app.post('/api/model-tests', async (req, res) => {",
    syncHelperCode + '\n' + routeCode + "\napp.post('/api/model-tests', async (req, res) => {"
  );

  // Hook inside app.post('/api/model-tests') after testDoc created
  serverCode = serverCode.replace(
    "autoPushToGitHub(`Add/Update Live Exam: ${testDoc.title || testDoc.examNo}`);",
    `if (req.body.autoSyncMCQ !== false && Array.isArray(req.body.selectedChapters) && req.body.selectedChapters.length > 0) {
      await syncModelTestMCQs(testDoc.examNo, req.body.selectedChapters, testDoc.totalQuestions || 25);
    }
    autoPushToGitHub(\`Add/Update Live Exam: \${testDoc.title || testDoc.examNo}\`);`
  );

  // Hook inside app.put('/api/model-tests/:id')
  serverCode = serverCode.replace(
    "autoPushToGitHub(`Update Live Exam: ${updatedTest.title || updatedTest.examNo}`);",
    `if (req.body.autoSyncMCQ !== false && Array.isArray(req.body.selectedChapters) && req.body.selectedChapters.length > 0) {
      await syncModelTestMCQs(updatedTest.examNo, req.body.selectedChapters, updatedTest.totalQuestions || 25);
    }
    autoPushToGitHub(\`Update Live Exam: \${updatedTest.title || updatedTest.examNo}\`);`
  );

  fs.writeFileSync(serverPath, serverCode, 'utf8');
  console.log('✓ Successfully patched server.js with syncModelTestMCQs helper and /api/model-tests/sync-mcqs endpoint!');
} else {
  console.log('• server.js already has syncModelTestMCQs');
}

console.log('--- ALL ADMIN & SERVER PATCHES COMPLETE ---');
