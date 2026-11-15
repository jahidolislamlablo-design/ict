const fs = require('fs');

const de14 = fs.readFileSync('temp_de14.html', 'utf8');
const cur = fs.readFileSync('admin.html', 'utf8');

function extractForm(html, formId) {
    const s = html.indexOf(`id="${formId}"`);
    const e = html.indexOf('</form>', s);
    return html.substring(s, e);
}

console.log('=== MCQ FORM in de14 (Old) ===');
console.log(extractForm(de14, 'mcqForm').substring(0, 1800));

console.log('\n=== MCQ FORM in current admin ===');
console.log(extractForm(cur, 'mcqForm').substring(0, 1800));
