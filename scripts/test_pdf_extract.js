const fs = require('fs');
const pdf = require('pdf-parse');
const { bijoyToUnicode } = require('bijoy2unicode');

const pdfPath = 'C:\\Users\\taibu\\.gemini\\antigravity\\brain\\6ddaa04c-6e2a-44cb-b1eb-20fc048590b5\\.user_uploaded\\media_1794759463391_75c1a50a.pdf';

async function run() {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    console.log('Total pages:', data.numpages);
    console.log('Raw text length:', data.text.length);

    // Test conversion on first 500 chars
    const converted = bijoyToUnicode(data.text.slice(0, 1000));
    console.log('Converted sample:\n', converted);

    fs.writeFileSync('scripts/extracted_pdf_raw.txt', data.text, 'utf8');
    const allConverted = bijoyToUnicode(data.text);
    fs.writeFileSync('scripts/extracted_pdf_unicode.txt', allConverted, 'utf8');
    console.log('Saved extracted_pdf_raw.txt and extracted_pdf_unicode.txt');
}

run().catch(console.error);
