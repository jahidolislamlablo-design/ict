const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8');
const cur = fs.readFileSync('admin.html', 'utf8');

function getFields(html) {
    const s = html.indexOf('<div class="grid-2" style="margin-top: 1rem;">');
    const e = html.indexOf('<!-- প্রশ্ন টেক্সট', s);
    return html.substring(s, e);
}

console.log('=== Old Fields in de14 ===\n', getFields(de14));
console.log('=== Current Fields in admin ===\n', getFields(cur));
