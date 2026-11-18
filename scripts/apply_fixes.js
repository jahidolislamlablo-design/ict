const fs = require('fs');

let bq = fs.readFileSync('assets/js/board-question.js', 'utf8');
bq = bq.replace(/\r\n/g, '\n');
const target = "if (backBtnText) backBtnText.innerText = 'সাল পরিবর্তনে যান';";
const replacement = "if (backBtnText) backBtnText.innerText = 'সাল পরিবর্তনে যান';\n        if (typeof updateAllCardProgressRings === 'function') updateAllCardProgressRings();";
if (!bq.includes(replacement)) {
    bq = bq.replace(target, replacement);
    fs.writeFileSync('assets/js/board-question.js', bq, 'utf8');
    console.log('board-question.js updated successfully!');
} else {
    console.log('board-question.js already contains call');
}
