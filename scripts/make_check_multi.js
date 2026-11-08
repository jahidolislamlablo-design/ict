const fs = require('fs');

// Inspect which blocks in test_parse_ch6 have multiple green highlights or what happened!
const code = fs.readFileSync('scripts/test_parse_ch6.js', 'utf8');
const modCode = code.replace(
    "console.log('Total answered blocks:', answeredBlocks.length);",
    `
    let multiCount = 0;
    blocks.forEach((b, idx) => {
        const greenCount = b.optEls.reduce((sum, e) => {
            const gr = (e.runs || []).filter(r => r.isAnsKey).length;
            const tableGr = e.type === 'opt_table' && e.raw.includes('w:val="green"') ? 1 : 0;
            return sum + gr + tableGr;
        }, 0);
        if (greenCount > 1) {
            multiCount++;
            console.log(\`Block \${idx+1} has \${greenCount} green highlights!\`);
            b.qEls.forEach(q => console.log('   Q:', q.fullText ? q.fullText.slice(0, 60) : ''));
            b.optEls.forEach(o => console.log('   Opt:', o.fullText ? o.fullText.slice(0, 60) : (o.type || '')));
        }
    });
    console.log('Blocks with multiple green highlights:', multiCount);
    `
);

fs.writeFileSync('scripts/temp_check_multi.js', modCode);
