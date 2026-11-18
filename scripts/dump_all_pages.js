const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:\\Users\\taibu\\.gemini\\antigravity\\brain\\6ddaa04c-6e2a-44cb-b1eb-20fc048590b5\\.user_uploaded\\media_1794759463391_75c1a50a.pdf';

async function run() {
    const p = new PDFParse({ url: pdfPath });
    await p.load();
    const t = await p.getText();
    
    fs.mkdirSync('scripts/pdf_pages', { recursive: true });
    t.pages.forEach((page, i) => {
        fs.writeFileSync(`scripts/pdf_pages/page_${i + 1}.txt`, page.text, 'utf8');
    });
    console.log(`Saved all ${t.pages.length} pages to scripts/pdf_pages/`);
}

run().catch(console.error);
