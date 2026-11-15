const fs = require('fs');
const de14 = fs.readFileSync('temp_de14.html', 'utf8');

function findSlice(html, startPattern, endPattern) {
    const s = html.indexOf(startPattern);
    const e = html.indexOf(endPattern, s);
    return html.substring(s, e);
}

console.log('=== de14 metadata-card in mcqForm ===');
const mcqMeta = findSlice(de14, '<!-- মেটাডেটা বক্স -->', '<!-- প্রশ্ন টেক্সট');
console.log(mcqMeta);

console.log('=== de14 metadata-card in cqForm ===');
const cqMeta = findSlice(de14, 'id="cqForm"', '<!-- উদ্দীপক');
console.log(cqMeta);
