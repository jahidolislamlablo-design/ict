const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const pdfPath = 'C:\\Users\\taibu\\.gemini\\antigravity\\brain\\6ddaa04c-6e2a-44cb-b1eb-20fc048590b5\\.user_uploaded\\media_1794759463391_75c1a50a.pdf';

async function run() {
    const p = new PDFParse({ url: pdfPath });
    await p.load();
    const t = await p.getText();
    
    const page1Raw = t.pages[0].text;
    console.log('--- Page 1 Raw (first 600 chars) ---');
    console.log(page1Raw.slice(0, 600));

    // Convert
    const page1Converted = convertBijoyToUnicode(page1Raw);
    console.log('--- Page 1 Converted (first 600 chars) ---');
    console.log(page1Converted.slice(0, 600));

    fs.writeFileSync('scripts/page1_converted.txt', page1Converted, 'utf8');
}

run().catch(console.error);
