const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { convertBijoyToUnicode } = require('bijoy2unicode');

const pdfPath = 'C:\\Users\\taibu\\.gemini\\antigravity\\brain\\6ddaa04c-6e2a-44cb-b1eb-20fc048590b5\\.user_uploaded\\media_1794759463391_75c1a50a.pdf';

async function scan() {
    const p = new PDFParse({ url: pdfPath });
    await p.load();
    const t = await p.getText();

    const fullRaw = t.pages.map(p => p.text).join('\n--- PAGE_BREAK ---\n');
    fs.writeFileSync('scripts/full_pdf_raw.txt', fullRaw, 'utf8');

    // Find all question headers: digits followed by |
    const qMatches = [...fullRaw.matchAll(/(\n|^)\s*(\d{1,2})\s*\|\s*([^\n]*)/g)];
    console.log(`Found ${qMatches.length} question markers:`);
    qMatches.forEach(m => {
        console.log(`Q ${m[2]}: ${m[3].slice(0, 60)}`);
    });
}

scan().catch(console.error);
