const fs = require('fs');

let js = fs.readFileSync('assets/js/model-test.js', 'utf8');

// 1. Remove font-weight: 600 from option styles
js = js.replace(/font-weight: 600;/g, '');
js = js.replace(/opt\.style\.fontWeight = '600';/g, '');

// 2. In renderAllQuestions:
const oldRenderQuestion = `        const explanationHtml = q.explanation ? \`
            <div class="explanation-box" id="explanation-\${qIdx}" style="display: none; margin-top: 14px; padding: 12px 16px; background: #F8FAFC; border-left: 4px solid var(--info); border-radius: 6px; font-size: 0.9rem;">
                <strong><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</strong> \${q.explanation}
            </div>
        \` : '';`;

const newRenderQuestion = `        const qId = 'mt_' + (q.id || (qIdx + 1));
        const isFav = (typeof isQuestionFavorite === 'function') ? isQuestionFavorite(qId) : false;
        const favObj = {
            id: qId,
            category: 'model_test',
            source_title: currentExamTitle || 'মডেল টেস্ট',
            question_text: q.question,
            options: q.options,
            correct_index: q.correct,
            explanation: q.explanation || ''
        };
        const favDataEncoded = encodeURIComponent(JSON.stringify(favObj));

        const explanationHtml = \`
            <div class="modern-card-actions" style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                \${q.explanation ? \`
                    <button type="button" class="btn btn-outline btn-sm" onclick="toggleModelTestExp(\${qIdx})" id="exp-btn-\${qIdx}" style="border-radius: 9999px; font-size: 0.82rem; padding: 6px 14px;">
                        <i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন
                    </button>
                \` : '<span></span>'}
                <button type="button" class="modern-fav-btn \${isFav ? 'active' : ''}" data-q-id="\${qId}" onclick="toggleFavoriteQuestion(this, '\${favDataEncoded}')" title="\${isFav ? 'ফেভারিট থেকে সরান' : 'ফেভারিটে যোগ করুন'}">
                    <i class="\${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                    <span>\${isFav ? 'সংরক্ষিত' : 'ফেভারিট'}</span>
                </button>
            </div>
            \${q.explanation ? \`
                <div class="explanation-box" id="explanation-\${qIdx}" style="display: none; margin-top: 10px; padding: 12px 16px; background: #F8FAFC; border-left: 4px solid var(--info); border-radius: 6px; font-size: 0.9rem;">
                    <strong><i class="fa-solid fa-lightbulb" style="color: #F59E0B; margin-right: 6px;"></i> ব্যাখ্যা:</strong> \${q.explanation}
                </div>
            \` : ''}
        \`;`;

js = js.replace(oldRenderQuestion, newRenderQuestion);

// 3. Remove auto display explanation on submit:
js = js.replace(
    `        // ব্যাখ্যা ওপেন করা\r\n        const expBox = card.querySelector('.explanation-box');\r\n        if (expBox) expBox.style.display = 'block';`,
    `        // ব্যাখ্যা শুধুমাত্র 'ব্যাখ্যা দেখুন' বাটনে ক্লিক করলে শো করবে`
);
js = js.replace(
    `        // ব্যাখ্যা ওপেন করা\n        const expBox = card.querySelector('.explanation-box');\n        if (expBox) expBox.style.display = 'block';`,
    `        // ব্যাখ্যা শুধুমাত্র 'ব্যাখ্যা দেখুন' বাটনে ক্লিক করলে শো করবে`
);

// 4. Add toggleModelTestExp
if (!js.includes('function toggleModelTestExp')) {
    js += `\r\n
function toggleModelTestExp(qIdx) {
    const box = document.getElementById('explanation-' + qIdx);
    const btn = document.getElementById('exp-btn-' + qIdx);
    if (!box) return;
    if (box.style.display === 'block') {
        box.style.display = 'none';
        if (btn) btn.innerHTML = '<i class="fa-regular fa-lightbulb"></i> ব্যাখ্যা দেখুন';
    } else {
        box.style.display = 'block';
        if (btn) btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> ব্যাখ্যা লুকান';
    }
}
window.toggleModelTestExp = toggleModelTestExp;
`;
}

fs.writeFileSync('assets/js/model-test.js', js, 'utf8');
console.log('Successfully updated assets/js/model-test.js');
