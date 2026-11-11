const fs = require('fs');

let content = fs.readFileSync('admin.html', 'utf8');

console.log('Original admin.html length:', content.length);

// 1. Tab Bar: Add Trash Can Tab button
const tabTarget = `<button type="button" class="tab-btn" onclick="switchTab('usersTab')">
        <span>👥 Users (ব্যবহারকারী)</span>
        <span class="badge" id="usersCountBadge">0</span>
      </button>`;

const tabReplacement = `<button type="button" class="tab-btn" onclick="switchTab('usersTab')">
        <span>👥 Users (ব্যবহারকারী)</span>
        <span class="badge" id="usersCountBadge">0</span>
      </button>
      <button type="button" class="tab-btn" onclick="switchTab('trashTab')">
        <span>🗑️ ট্র্যাশ ক্যান</span>
        <span class="badge" id="trashCountBadge" style="background: #fee2e2; color: #b91c1c;">0</span>
      </button>`;

if (content.includes(tabTarget)) {
  content = content.replace(tabTarget, tabReplacement);
  console.log('1. Added Trash Tab button in tab bar');
} else {
  console.warn('1. WARNING: tabTarget not found');
}

// 2. Add Trash Section right after usersTab
const usersSectionEnd = `</section>

  <!-- ============================================== -->
  <!-- ৪. প্রশ্ন এডিট ও আপডেট মোডাল (Edit Modal) -->`;

const trashSectionHtml = `</section>

    <!-- ============================================== -->
    <!-- ৭. ট্র্যাশ ক্যান (Trash Can / Recycle Bin) -->
    <!-- ============================================== -->
    <section id="trashTab" class="tab-content">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px;">
              <span>🗑️ ট্র্যাশ ক্যান (মুছে ফেলা ফাইল ও রিস্টোর)</span>
              <span class="badge" id="trashHeaderBadge" style="background: #fee2e2; color: #b91c1c; font-size: 0.8rem;">০ টি আইটেম</span>
            </h2>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">
              ভুলবশত মুছে ফেলা PDF, MCQ, CQ বা মডেল টেস্ট যেকোনো সময় এখান থেকে পূর্বাবস্থায় (Restore) ফিরিয়ে আনা যাবে।
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn btn-secondary" onclick="loadTrashItems()" title="তাজা করুন">
              🔄 রিফ্রেশ
            </button>
            <button type="button" class="btn btn-danger" onclick="emptyAllTrash()" style="background: #ef4444; color: white;">
              ⚠️ সব ট্র্যাশ খালি করুন
            </button>
          </div>
        </div>

        <!-- সার্চ ও ফিল্টার -->
        <div style="display: flex; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap;">
          <input type="text" id="trashSearchInput" placeholder="🔍 শিরোনাম বা প্রশ্ন দিয়ে খুঁজুন..." oninput="filterTrashTable()" style="flex: 1; min-width: 200px; padding: 0.6rem 0.85rem; border: 1.5px solid var(--border); border-radius: 8px;">
          <select id="trashTypeFilter" onchange="filterTrashTable()" style="padding: 0.6rem 0.85rem; border: 1.5px solid var(--border); border-radius: 8px; background: white; cursor: pointer;">
            <option value="all">📁 সকল ধরন</option>
            <option value="pdf">📄 PDF ফাইল</option>
            <option value="mcq">📝 MCQ প্রশ্ন</option>
            <option value="cq">📑 CQ সৃজনশীল</option>
            <option value="model-test">⏱️ মডেল টেস্ট</option>
          </select>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th style="width: 120px;">ধরন</th>
                <th>মুছে ফেলা আইটেমের শিরোনাম / বিবরণ</th>
                <th style="width: 170px;">মুছে ফেলার সময়</th>
                <th style="text-align: center; width: 190px;">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody id="trashTableBody">
              <tr>
                <td colspan="5" style="text-align: center; padding: 2.5rem; color: #64748b;">
                  ⏳ ট্র্যাশ ক্যান লোড হচ্ছে...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  <!-- ============================================== -->
  <!-- ৪. প্রশ্ন এডিট ও আপডেট মোডাল (Edit Modal) -->`;

if (content.includes(usersSectionEnd)) {
  content = content.replace(usersSectionEnd, trashSectionHtml);
  console.log('2. Added Trash Section in admin.html');
} else {
  console.warn('2. WARNING: usersSectionEnd not found');
}

// 3. Update switchTab to include trashTab
const oldSwitchTab = `      const tabBtnMap = {
        'mcqTab': 0,
        'cqTab': 1,
        'previewTab': 2,
        'pdfTab': 3,
        'liveExamTab': 4,
        'usersTab': 5
      };`;

const newSwitchTab = `      const tabBtnMap = {
        'mcqTab': 0,
        'cqTab': 1,
        'previewTab': 2,
        'pdfTab': 3,
        'liveExamTab': 4,
        'usersTab': 5,
        'trashTab': 6
      };`;

if (content.includes(oldSwitchTab)) {
  content = content.replace(oldSwitchTab, newSwitchTab);
  console.log('3. Updated tabBtnMap in switchTab');
}

const oldSwitchLoad = `      } else if (tabId === 'usersTab') {
        try { loadUserItems(); } catch(e) { console.error('loadUserItems error:', e); }
      }`;

const newSwitchLoad = `      } else if (tabId === 'usersTab') {
        try { loadUserItems(); } catch(e) { console.error('loadUserItems error:', e); }
      } else if (tabId === 'trashTab') {
        try { loadTrashItems(); } catch(e) { console.error('loadTrashItems error:', e); }
      }`;

if (content.includes(oldSwitchLoad)) {
  content = content.replace(oldSwitchLoad, newSwitchLoad);
  console.log('4. Added loadTrashItems call in switchTab');
}

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Part 1 changes written successfully!');
