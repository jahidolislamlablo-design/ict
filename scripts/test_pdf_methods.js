const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:\\Users\\taibu\\.gemini\\antigravity\\brain\\6ddaa04c-6e2a-44cb-b1eb-20fc048590b5\\.user_uploaded\\media_1794759463391_75c1a50a.pdf';

async function run() {
    const parser = new PDFParse({ url: pdfPath });
    await parser.load();
    const text = await parser.getText();
    console.log('PDF text length:', text.length);
    console.log('Sample text:\n', text.slice(0, 500));
    fs.writeFileSync('scripts/pdf_extracted_raw.txt', text, 'utf8');
}

run().catch(console.error);
