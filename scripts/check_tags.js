const fs = require('fs');
const xml = fs.readFileSync('temp_ch6_docx/word/document.xml', 'utf8');

const matches = xml.match(/\[[^\]]{2,50}\]/g) || [];
console.log('Total bracket tags found in xml:', matches.length);
matches.forEach((m, idx) => {
    if (idx < 20) console.log(m);
});
