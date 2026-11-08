const fs = require('fs');
const path = require('path');

// Run build_ch6_mcqs logic and inspect sample questions
let code = fs.readFileSync(path.join(__dirname, 'build_ch6_mcqs.js'), 'utf8');

// Append inspection logic
code += `
answeredBlocks.forEach((b, idx) => {
    const { options, correctIdx } = parseOptionsFromBlock(b.optEls);
    let qLines = [];
    b.qEls.forEach(el => {
        let t = el.fullText ? el.fullText.trim() : '';
        if (t) qLines.push(t);
    });
    const qText = qLines.join('\\n');
    const hasImg = options.some(o => o.includes('<img'));
    const hasTbl = qText.includes('|');
    if (hasImg || hasTbl || idx < 3 || idx >= 184) {
        console.log(\`=== MCQ \${idx + 1} ===\`);
        console.log('Q:\\n' + qText);
        console.log('Options:', options);
        console.log('Ans:', options[correctIdx]);
    }
});
`;

fs.writeFileSync(path.join(__dirname, 'temp_inspect_ch6_samples.js'), code);
