const fs = require('fs');
const relsXml = fs.readFileSync('temp_ch6_docx/word/_rels/document.xml.rels', 'utf8');

const relRegex = /Id="([^"]+)"[^>]*Target="([^"]+)"/g;
let m;
while ((m = relRegex.exec(relsXml)) !== null) {
    console.log(m[1], '->', m[2]);
}
