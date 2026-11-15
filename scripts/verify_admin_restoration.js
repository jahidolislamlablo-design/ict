const fs = require('fs');

const admin = fs.readFileSync('admin.html', 'utf8');

// 1. Check MCQ Form selects
const hasMcqChapterSelect = admin.includes('<select id="mcqChapter" required>');
const hasMcqBoardSelect = admin.includes('<select id="mcqBoardName">');
const hasMcqCollegeSelect = admin.includes('<select id="mcqCollegeName">');
const hasMcqExamYearSelect = admin.includes('<select id="mcqExamYear">');
console.log('1. MCQ standard selects:');
console.log('   mcqChapter:', hasMcqChapterSelect);
console.log('   mcqBoardName:', hasMcqBoardSelect);
console.log('   mcqCollegeName:', hasMcqCollegeSelect);
console.log('   mcqExamYear:', hasMcqExamYearSelect);

// 2. Check CQ Form selects
const hasCqChapterSelect = admin.includes('<select id="cqChapter" required>');
const hasCqBoardSelect = admin.includes('<select id="cqBoardName">');
const hasCqCollegeSelect = admin.includes('<select id="cqCollegeName">');
const hasCqExamYearSelect = admin.includes('<select id="cqExamYear">');
console.log('2. CQ standard selects:');
console.log('   cqChapter:', hasCqChapterSelect);
console.log('   cqBoardName:', hasCqBoardSelect);
console.log('   cqCollegeName:', hasCqCollegeSelect);
console.log('   cqExamYear:', hasCqExamYearSelect);

// 3. Check Live Exam chapter dropdown box
const hasLeChapterDropdown = admin.includes('id="leChapterDropdownWrapper"');
const hasLeChapterMenu = admin.includes('id="leChapterMenu"');
const hasDupLeCheckboxes = admin.includes('id="leChapterCheckboxes"');
console.log('3. Live Exam chapter dropdown:');
console.log('   leChapterDropdownWrapper present:', hasLeChapterDropdown);
console.log('   leChapterMenu present:', hasLeChapterMenu);
console.log('   Duplicate leChapterCheckboxes removed:', !hasDupLeCheckboxes);

// 4. Check multiselect wrappers in whole file
const wrappers = [...admin.matchAll(/class="multiselect-wrapper"\s+id="([^"]+)"/g)].map(m => m[1]);
console.log('4. Remaining multiselect wrappers (should only be category pickers and live exam chapter picker):', wrappers);

// 5. Test JavaScript syntax
const scripts = [...admin.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
console.log('5. Inline script blocks count:', scripts.length);
scripts.forEach((code, i) => {
    try {
        new Function(code);
        console.log(`   Script ${i + 1} syntax check: VALID`);
    } catch(err) {
        console.error(`   Script ${i + 1} syntax ERROR:`, err.message);
    }
});
