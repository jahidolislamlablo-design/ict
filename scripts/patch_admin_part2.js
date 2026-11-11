const fs = require('fs');

let content = fs.readFileSync('admin.html', 'utf8');

// 1. Add MultiSelect CSS styles
const cssTarget = `.multiselect-item:hover {
      background: #f1f5f9;
    }`;

const cssReplacement = `.multiselect-item:hover {
      background: #f1f5f9;
    }

    .multiselect-search-input {
      width: 100%;
      padding: 0.45rem 0.65rem;
      font-size: 0.82rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      margin-bottom: 0.4rem;
      outline: none;
      background: #f8fafc;
      box-sizing: border-box;
    }
    .multiselect-search-input:focus {
      border-color: var(--primary);
      background: #fff;
    }
    .multiselect-menu-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 6px 6px;
      font-size: 0.75rem;
      color: #64748b;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 5px;
    }
    .multiselect-menu-actions a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }
    .multiselect-menu-actions a.clear-link {
      color: #ef4444;
    }`;

if (content.includes(cssTarget)) {
  content = content.replace(cssTarget, cssReplacement);
  console.log('1. Added MultiSelect CSS');
}

// 2. Replace MCQ metadata HTML block with multi-select enabled fields
const mcqMetaStart = `<div class="grid-2" style="margin-top: 1rem;">
            <div class="form-group">
              <label for="mcqChapter">অধ্যায় নির্বাচন (chapter)<span class="required">*</span></label>`;
const mcqMetaEnd = `            <div class="form-group" id="mcqLiveExamGroup">
              <label for="mcqLiveExamNo">🔴 লাইভ এক্সাম নির্বাচন</label>
              <select id="mcqLiveExamNo" onchange="onLiveExamSelect(this.value)">
                <option value="">-- কোনো লাইভ এক্সাম নয় (সাধারণ MCQ) --</option>
              </select>
            </div>
          </div>`;

const idxMcqStart = content.indexOf(mcqMetaStart);
const idxMcqEnd = content.indexOf(mcqMetaEnd);

if (idxMcqStart !== -1 && idxMcqEnd !== -1) {
  const newMcqMetaHtml = `<div class="grid-2" style="margin-top: 1rem;">
            <div class="form-group">
              <label>অধ্যায় নির্বাচন (একাধিক নির্বাচন করা যাবে)<span class="required">*</span></label>
              <div class="multiselect-wrapper" id="mcqChapterWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('mcqChapterWrapper')">
                  <span id="mcqChapterTriggerText">Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="mcqChapterMenu">
                  <input type="text" placeholder="🔍 অধ্যায় খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>অধ্যায় নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('mcqChapters', 'mcqChapterWrapper', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('mcqChapters', 'mcqChapterWrapper', 'অধ্যায় নির্বাচন করুন')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)" checked onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 2: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং" onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 2: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)" onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট" onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML" onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 5: প্রোগ্রামিং ভাষা (C Programming)" onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 5: প্রোগ্রামিং ভাষা (C Programming)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqChapters" value="Chapter 6: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)" onchange="syncMultiSelectText('mcqChapterWrapper', 'mcqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 6: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)</span></label>
                </div>
              </div>
              <select id="mcqChapter" style="display:none;"><option value="Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)" selected>Chapter 1</option></select>
            </div>

            <div class="form-group" id="mcqBoardGroup">
              <label>বোর্ডের নাম (একাধিক নির্বাচন করা যাবে)</label>
              <div class="multiselect-wrapper" id="mcqBoardWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('mcqBoardWrapper')">
                  <span id="mcqBoardTriggerText">-- কোনো বোর্ড নয় --</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="mcqBoardMenu">
                  <input type="text" placeholder="🔍 বোর্ড খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>বোর্ড নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('mcqBoards', 'mcqBoardWrapper', '-- কোনো বোর্ড নয় --', 'বোর্ড')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('mcqBoards', 'mcqBoardWrapper', '-- কোনো বোর্ড নয় --')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Dhaka Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Dhaka Board (ঢাকা বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Rajshahi Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Rajshahi Board (রাজশাহী বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Cumilla Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Cumilla Board (কুমিল্লা বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Jashore Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Jashore Board (যশোর বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Chattogram Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Chattogram Board (চট্টগ্রাম বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Barishal Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Barishal Board (বরিশাল বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Sylhet Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Sylhet Board (সিলেট বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Dinajpur Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Dinajpur Board (দিনাজপুর বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Mymensingh Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Mymensingh Board (ময়মনসিংহ বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="Madrasah Board" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Madrasah Board (মাদ্রাসা বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqBoards" value="All Boards" onchange="syncMultiSelectText('mcqBoardWrapper', 'mcqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ All Boards (সকল বোর্ড)</span></label>
                </div>
              </div>
              <select id="mcqBoardName" style="display:none;"><option value="">-- কোনো বোর্ড নয় --</option></select>
            </div>
          </div>

          <div class="grid-4" style="margin-top: 0.5rem;">
            <div class="form-group" id="mcqCollegeGroup">
              <label>কলেজের নাম (একাধিক নির্বাচন করা যাবে)</label>
              <div class="multiselect-wrapper" id="mcqCollegeWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('mcqCollegeWrapper')">
                  <span id="mcqCollegeTriggerText">-- শীর্ষ কলেজ নির্বাচন করুন --</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="mcqCollegeMenu">
                  <input type="text" placeholder="🔍 কলেজ খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>কলেজ নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('mcqColleges', 'mcqCollegeWrapper', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('mcqColleges', 'mcqCollegeWrapper', '-- শীর্ষ কলেজ নির্বাচন করুন --')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Notre Dame College, Dhaka" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 নটর ডেম কলেজ, ঢাকা</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Dhaka College, Dhaka" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ঢাকা কলেজ, ঢাকা</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Viqarunnisa Noon School & College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="RAJUK Uttara Model College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 রাজউক উত্তরা মডেল কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Dhaka Residential Model College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ঢাকা রেসিডেনসিয়াল মডেল কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Dhaka City College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ঢাকা সিটি কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Adamjee Cantonment College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 আদমজী ক্যান্টনমেন্ট কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Ideal School & College, Motijheel" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 আইডিয়াল স্কুল অ্যান্ড কলেজ, মতিঝিল</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Chittagong College, Chittagong" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 চট্টগ্রাম কলেজ, চট্টগ্রাম</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Govt. Hazi Muhammad Mohsin College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সরকারি হাজী মুহাম্মদ মহসিন কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Rajshahi College, Rajshahi" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 রাজশাহী কলেজ, রাজশাহী</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Cantonment Public School & College, Rangpur" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ক্যান্টনমেন্ট পাবলিক স্কুল, রংপুর</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Govt. Mujib College, Sakhipur, Tangail" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সরকারি মুজিব কলেজ, টাঙ্গাইল</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Comilla Victoria Govt. College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 কুমিল্লা ভিক্টোরিয়া সরকারি কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Sylhet MC College" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সিলেট এম সি কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Govt. BM College, Barishal" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সরকারি ব্রজমোহন কলেজ, বরিশাল</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Ananda Mohan College, Mymensingh" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 আনন্দ মোহন কলেজ, ময়মনসিংহ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqColleges" value="Other" onchange="syncMultiSelectText('mcqCollegeWrapper', 'mcqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 অন্যান্য কলেজ</span></label>
                </div>
              </div>
              <select id="mcqCollegeName" style="display:none;"><option value="">-- শীর্ষ কলেজ --</option></select>
            </div>

            <div class="form-group">
              <label>পরীক্ষার সাল (একাধিক নির্বাচন করা যাবে)</label>
              <div class="multiselect-wrapper" id="mcqYearWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('mcqYearWrapper')">
                  <span id="mcqYearTriggerText">2025 (২০২৫)</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="mcqYearMenu">
                  <div class="multiselect-menu-actions">
                    <span>সাল নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('mcqYears', 'mcqYearWrapper', '-- পরীক্ষার সাল --', 'সাল')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('mcqYears', 'mcqYearWrapper', '-- পরীক্ষার সাল --')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2026" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2026 (২০২৬)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2025" checked onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2025 (২০২৫)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2024" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2024 (২০২৪)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2023" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2023 (২০২৩)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2022" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2022 (২০২২)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2021" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2021 (২০২১)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2020" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2020 (২০২০)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2019" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2019 (২০১৯)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2018" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2018 (২০১৮)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2017" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2017 (২০১৭)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="mcqYears" value="2016" onchange="syncMultiSelectText('mcqYearWrapper', 'mcqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2016 (২০১৬)</span></label>
                </div>
              </div>
              <select id="mcqExamYear" style="display:none;"><option value="2025" selected>2025</option></select>
            </div>

            <div class="form-group">
              <label for="mcqTestPaperName">টেস্ট পেপার প্রকাশনী</label>
              <select id="mcqTestPaperName">
                <option value="">-- টেস্ট পেপার প্রকাশনী নির্বাচন করুন --</option>
                <option value="টেস্ট পেপার ২০২৬">টেস্ট পেপার ২০২৬ (Test Paper 2026)</option>
              </select>
            </div>

            <div class="form-group" id="mcqLiveExamGroup">
              <label>মডেল টেস্ট / লাইভ এক্সাম (একাধিক নির্বাচন)</label>
              <div class="multiselect-wrapper" id="mcqModelTestWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('mcqModelTestWrapper')">
                  <span id="mcqModelTestTriggerText">-- কোনো মডেল টেস্ট নয় --</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="mcqModelTestMenu">
                  <input type="text" placeholder="🔍 মডেল টেস্ট খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>মডেল টেস্ট নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('mcqModelTests', 'mcqModelTestWrapper', '-- কোনো মডেল টেস্ট নয় --', 'মডেল টেস্ট')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('mcqModelTests', 'mcqModelTestWrapper', '-- কোনো মডেল টেস্ট নয় --')">মুছুন</a>
                    </div>
                  </div>
                  <!-- Dynamically populated from active model tests -->
                </div>
              </div>
              <select id="mcqLiveExamNo" style="display:none;"><option value="">-- কোনো লাইভ এক্সাম নয় --</option></select>
            </div>
          </div>`;

  content = content.substring(0, idxMcqStart) + newMcqMetaHtml + content.substring(idxMcqEnd + mcqMetaEnd.length);
  console.log('2. Replaced MCQ metadata with multi-select fields');
} else {
  console.warn('2. WARNING: MCQ metadata start/end not found');
}

// 3. Replace CQ metadata HTML block with multi-select enabled fields
const cqMetaStart = `<div class="grid-2" style="margin-top: 1rem;">
            <div class="form-group">
              <label for="cqChapter">অধ্যায় নির্বাচন (chapter)<span class="required">*</span></label>`;
const cqMetaEnd = `            <div class="form-group">
              <label for="cqTestPaperName">টেস্ট পেপার প্রকাশনী</label>
              <select id="cqTestPaperName">
                <option value="">-- টেস্ট পেপার প্রকাশনী নির্বাচন করুন --</option>
                <option value="টেস্ট পেপার ২০২৬">টেস্ট পেপার ২০২৬ (Test Paper 2026)</option>
              </select>
            </div>

            
          </div>`;

const idxCqStart = content.indexOf(cqMetaStart);
const idxCqEnd = content.indexOf(cqMetaEnd);

if (idxCqStart !== -1 && idxCqEnd !== -1) {
  const newCqMetaHtml = `<div class="grid-2" style="margin-top: 1rem;">
            <div class="form-group">
              <label>অধ্যায় নির্বাচন (একাধিক নির্বাচন করা যাবে)<span class="required">*</span></label>
              <div class="multiselect-wrapper" id="cqChapterWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('cqChapterWrapper')">
                  <span id="cqChapterTriggerText">Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="cqChapterMenu">
                  <input type="text" placeholder="🔍 অধ্যায় খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>অধ্যায় নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('cqChapters', 'cqChapterWrapper', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('cqChapters', 'cqChapterWrapper', 'অধ্যায় নির্বাচন করুন')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)" checked onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 2: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং" onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 2: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)" onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট" onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML" onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 5: প্রোগ্রামিং ভাষা (C Programming)" onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 5: প্রোগ্রামিং ভাষা (C Programming)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqChapters" value="Chapter 6: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)" onchange="syncMultiSelectText('cqChapterWrapper', 'cqChapters', 'অধ্যায় নির্বাচন করুন', 'অধ্যায়')"><span>Chapter 6: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)</span></label>
                </div>
              </div>
              <select id="cqChapter" style="display:none;"><option value="Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)" selected>Chapter 1</option></select>
            </div>

            <div class="form-group" id="cqBoardGroup">
              <label>বোর্ডের নাম (একাধিক নির্বাচন করা যাবে)</label>
              <div class="multiselect-wrapper" id="cqBoardWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('cqBoardWrapper')">
                  <span id="cqBoardTriggerText">Dhaka Board (ঢাকা বোর্ড)</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="cqBoardMenu">
                  <input type="text" placeholder="🔍 বোর্ড খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>বোর্ড নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('cqBoards', 'cqBoardWrapper', '-- কোনো বোর্ড নয় --', 'বোর্ড')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('cqBoards', 'cqBoardWrapper', '-- কোনো বোর্ড নয় --')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Dhaka Board" checked onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Dhaka Board (ঢাকা বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Rajshahi Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Rajshahi Board (রাজশাহী বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Cumilla Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Cumilla Board (কুমিল্লা বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Jashore Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Jashore Board (যশোর বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Chattogram Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Chattogram Board (চট্টগ্রাম বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Barishal Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Barishal Board (বরিশাল বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Sylhet Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Sylhet Board (সিলেট বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Dinajpur Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Dinajpur Board (দিনাজপুর বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Mymensingh Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Mymensingh Board (ময়মনসিংহ বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="Madrasah Board" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ Madrasah Board (মাদ্রাসা বোর্ড)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqBoards" value="All Boards" onchange="syncMultiSelectText('cqBoardWrapper', 'cqBoards', '-- কোনো বোর্ড নয় --', 'বোর্ড')"><span>🏛️ All Boards (সকল বোর্ড)</span></label>
                </div>
              </div>
              <select id="cqBoardName" style="display:none;"><option value="Dhaka Board" selected>Dhaka Board</option></select>
            </div>
          </div>

          <div class="grid-4" style="margin-top: 0.5rem;">
            <div class="form-group" id="cqCollegeGroup">
              <label>কলেজের নাম (একাধিক নির্বাচন করা যাবে)</label>
              <div class="multiselect-wrapper" id="cqCollegeWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('cqCollegeWrapper')">
                  <span id="cqCollegeTriggerText">-- শীর্ষ কলেজ নির্বাচন করুন --</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="cqCollegeMenu">
                  <input type="text" placeholder="🔍 কলেজ খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>কলেজ নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('cqColleges', 'cqCollegeWrapper', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('cqColleges', 'cqCollegeWrapper', '-- শীর্ষ কলেজ নির্বাচন করুন --')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Notre Dame College, Dhaka" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 নটর ডেম কলেজ, ঢাকা</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Dhaka College, Dhaka" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ঢাকা কলেজ, ঢাকা</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Viqarunnisa Noon School & College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="RAJUK Uttara Model College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 রাজউক উত্তরা মডেল কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Dhaka Residential Model College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ঢাকা রেসিডেনসিয়াল মডেল কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Dhaka City College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ঢাকা সিটি কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Adamjee Cantonment College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 আদমজী ক্যান্টনমেন্ট কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Ideal School & College, Motijheel" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 আইডিয়াল স্কুল অ্যান্ড কলেজ, মতিঝিল</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Chittagong College, Chittagong" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 চট্টগ্রাম কলেজ, চট্টগ্রাম</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Govt. Hazi Muhammad Mohsin College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সরকারি হাজী মুহাম্মদ মহসিন কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Rajshahi College, Rajshahi" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 রাজশাহী কলেজ, রাজশাহী</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Cantonment Public School & College, Rangpur" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 ক্যান্টনমেন্ট পাবলিক স্কুল, রংপুর</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Govt. Mujib College, Sakhipur, Tangail" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সরকারি মুজিব কলেজ, টাঙ্গাইল</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Comilla Victoria Govt. College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 কুমিল্লা ভিক্টোরিয়া সরকারি কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Sylhet MC College" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সিলেট এম সি কলেজ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Govt. BM College, Barishal" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 সরকারি ব্রজমোহন কলেজ, বরিশাল</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Ananda Mohan College, Mymensingh" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 আনন্দ মোহন কলেজ, ময়মনসিংহ</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqColleges" value="Other" onchange="syncMultiSelectText('cqCollegeWrapper', 'cqColleges', '-- শীর্ষ কলেজ নির্বাচন করুন --', 'কলেজ')"><span>🏫 অন্যান্য কলেজ</span></label>
                </div>
              </div>
              <select id="cqCollegeName" style="display:none;"><option value="">-- শীর্ষ কলেজ --</option></select>
            </div>

            <div class="form-group">
              <label>পরীক্ষার সাল (একাধিক নির্বাচন করা যাবে)</label>
              <div class="multiselect-wrapper" id="cqYearWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('cqYearWrapper')">
                  <span id="cqYearTriggerText">2025 (২০২৫)</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="cqYearMenu">
                  <div class="multiselect-menu-actions">
                    <span>সাল নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('cqYears', 'cqYearWrapper', '-- পরীক্ষার সাল --', 'সাল')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('cqYears', 'cqYearWrapper', '-- পরীক্ষার সাল --')">মুছুন</a>
                    </div>
                  </div>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2026" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2026 (২০২৬)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2025" checked onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2025 (২০২৫)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2024" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2024 (২০২৪)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2023" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2023 (২০২৩)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2022" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2022 (২০২২)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2021" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2021 (২০২১)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2020" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2020 (২০২০)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2019" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2019 (২০১৯)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2018" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2018 (২০১৮)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2017" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2017 (২০১৭)</span></label>
                  <label class="multiselect-item"><input type="checkbox" name="cqYears" value="2016" onchange="syncMultiSelectText('cqYearWrapper', 'cqYears', '-- পরীক্ষার সাল --', 'সাল')"><span>📅 2016 (২০১৬)</span></label>
                </div>
              </div>
              <select id="cqExamYear" style="display:none;"><option value="2025" selected>2025</option></select>
            </div>

            <div class="form-group">
              <label for="cqTestPaperName">টেস্ট পেপার প্রকাশনী</label>
              <select id="cqTestPaperName">
                <option value="">-- টেস্ট পেপার প্রকাশনী নির্বাচন করুন --</option>
                <option value="টেস্ট পেপার ২০২৬">টেস্ট পেপার ২০২৬ (Test Paper 2026)</option>
              </select>
            </div>

            <div class="form-group" id="cqModelTestGroup">
              <label>মডেল টেস্ট / লাইভ এক্সাম (একাধিক নির্বাচন)</label>
              <div class="multiselect-wrapper" id="cqModelTestWrapper">
                <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('cqModelTestWrapper')">
                  <span id="cqModelTestTriggerText">-- কোনো মডেল টেস্ট নয় --</span>
                  <span class="chevron-icon">▼</span>
                </div>
                <div class="multiselect-menu" id="cqModelTestMenu">
                  <input type="text" placeholder="🔍 মডেল টেস্ট খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                  <div class="multiselect-menu-actions">
                    <span>মডেল টেস্ট নির্বাচন</span>
                    <div>
                      <a href="javascript:void(0)" onclick="selectAllMultiSelectGroup('cqModelTests', 'cqModelTestWrapper', '-- কোনো মডেল টেস্ট নয় --', 'মডেল টেস্ট')">সব</a> | 
                      <a href="javascript:void(0)" class="clear-link" onclick="clearMultiSelectGroup('cqModelTests', 'cqModelTestWrapper', '-- কোনো মডেল টেস্ট নয় --')">মুছুন</a>
                    </div>
                  </div>
                  <!-- Dynamically populated from active model tests -->
                </div>
              </div>
              <select id="cqModelTestNo" style="display:none;"><option value="">-- কোনো মডেল টেস্ট নয় --</option></select>
            </div>
          </div>`;

  content = content.substring(0, idxCqStart) + newCqMetaHtml + content.substring(idxCqEnd + cqMetaEnd.length);
  console.log('3. Replaced CQ metadata with multi-select fields');
} else {
  console.warn('3. WARNING: CQ metadata start/end not found');
}

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Part 2 HTML fields written successfully!');
