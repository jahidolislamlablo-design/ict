const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'js', 'chapter-prep.js');
let s = fs.readFileSync(filePath, 'utf8');

const regex = /function openChapterModal\s*\([\s\S]*?\}\s*else\s*\{[\s\S]*?\}\s*\}/;

const replacement = `function openChapterModal(chapterTitle, chapterId = null) {
    activeChapter = chapterTitle;
    activeChapterId = chapterId || getChapterIdFromTitle(chapterTitle);

    // মোবাইল ও কম্পিউটার উভয় স্ক্রিনেই পপআপ মডাল শো করবে (CQ, MCQ, Model Test)
    const modalTitle = document.getElementById('modal-chapter-name');
    if (modalTitle) modalTitle.innerText = activeChapter;
    const modal = document.getElementById('chapterModeModal');
    if (modal) modal.classList.add('open');
}`;

if (regex.test(s)) {
    s = s.replace(regex, replacement);
    fs.writeFileSync(filePath, s, 'utf8');
    console.log('Successfully updated chapter-prep.js: openChapterModal now opens popup on all screens!');
} else {
    console.log('Regex did not match in chapter-prep.js');
}
