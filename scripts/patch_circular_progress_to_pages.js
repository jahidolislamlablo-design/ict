const fs = require('fs');
const path = require('path');

// 1. PATCH chapter-prep.js
const chPath = path.join(__dirname, '..', 'assets', 'js', 'chapter-prep.js');
let chCode = fs.readFileSync(chPath, 'utf8');

// Patch desktop MCQ render
chCode = chCode.replace(
    /container\.innerHTML = html;/,
    `let readCount = 0;\n        questions.forEach((q, idx) => { const qId = q.id ? String(q.id) : generateMCQUniqueId(q, idx); if (typeof isQuestionRead === 'function' && isQuestionRead(qId)) readCount++; });\n        const circHtml = (typeof buildCircularProgressHTML === 'function') ? buildCircularProgressHTML(questions.length, readCount, activeChapter || 'অধ্যায় প্রস্তুতি') : '';\n        container.innerHTML = circHtml + html;`
);

// Patch mobile MCQ render
chCode = chCode.replace(
    /container\.innerHTML = html;/,
    `let readCount = 0;\n        questions.forEach((q, idx) => { const qId = q.id ? String(q.id) : generateMCQUniqueId(q, idx); if (typeof isQuestionRead === 'function' && isQuestionRead(qId)) readCount++; });\n        const circHtml = (typeof buildCircularProgressHTML === 'function') ? buildCircularProgressHTML(questions.length, readCount, activeChapter || 'অধ্যায় প্রস্তুতি') : '';\n        container.innerHTML = circHtml + html;`
);

fs.writeFileSync(chPath, chCode, 'utf8');
console.log('✓ Patched chapter-prep.js with circular progress chart');

// 2. PATCH board-question.js
const bqPath = path.join(__dirname, '..', 'assets', 'js', 'board-question.js');
let bqCode = fs.readFileSync(bqPath, 'utf8');

bqCode = bqCode.replace(
    /listContainer\.innerHTML = html;/,
    `let readCount = 0;\n        questions.forEach((q, idx) => { const qId = q.id ? String(q.id) : generateMCQUniqueId(q, idx); if (typeof isQuestionRead === 'function' && isQuestionRead(qId)) readCount++; });\n        const circHtml = (typeof buildCircularProgressHTML === 'function') ? buildCircularProgressHTML(questions.length, readCount, (selectedBoard || 'বোর্ড প্রশ্ন') + ' (' + (selectedYear || '') + ')') : '';\n        listContainer.innerHTML = circHtml + html;`
);

fs.writeFileSync(bqPath, bqCode, 'utf8');
console.log('✓ Patched board-question.js with circular progress chart');

// 3. PATCH test-paper.js
const tpPath = path.join(__dirname, '..', 'assets', 'js', 'test-paper.js');
let tpCode = fs.readFileSync(tpPath, 'utf8');

tpCode = tpCode.replace(
    /container\.innerHTML = html;/,
    `let readCount = 0;\n        questions.forEach((q, idx) => { const qId = q.id ? String(q.id) : generateMCQUniqueId(q, idx); if (typeof isQuestionRead === 'function' && isQuestionRead(qId)) readCount++; });\n        const circHtml = (typeof buildCircularProgressHTML === 'function') ? buildCircularProgressHTML(questions.length, readCount, selectedCollege || 'শীর্ষস্থানীয় কলেজ / টেস্ট পেপার') : '';\n        container.innerHTML = circHtml + html;`
);

fs.writeFileSync(tpPath, tpCode, 'utf8');
console.log('✓ Patched test-paper.js with circular progress chart');

// 4. PATCH model-test.js
const mtPath = path.join(__dirname, '..', 'assets', 'js', 'model-test.js');
let mtCode = fs.readFileSync(mtPath, 'utf8');

mtCode = mtCode.replace(
    /container\.innerHTML = html;\s*\n\s*attachExamRadioListeners\(\);/,
    `let readCount = 0;\n    activeExamQuestions.forEach((q, idx) => { const qId = q.id ? String(q.id) : generateMCQUniqueId(q, idx); if (typeof isQuestionRead === 'function' && isQuestionRead(qId)) readCount++; });\n    const circHtml = (typeof buildCircularProgressHTML === 'function') ? buildCircularProgressHTML(activeExamQuestions.length, readCount, currentExamTitle || 'মডেল টেস্ট') : '';\n    container.innerHTML = circHtml + html;\n    attachExamRadioListeners();`
);

fs.writeFileSync(mtPath, mtCode, 'utf8');
console.log('✓ Patched model-test.js with circular progress chart');
