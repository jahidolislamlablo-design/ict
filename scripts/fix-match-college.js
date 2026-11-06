const fs = require('fs');
const path = require('path');

const apiFile = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(apiFile, 'utf8');

const newFn = `function matchCollegeName(storedName, targetName) {
    if (!storedName || !targetName) return true;
    const a = storedName.toLowerCase();
    const b = targetName.toLowerCase();
    if (a.includes(b) || b.includes(a)) return true;

    const groups = [
        ['notre dame', 'নটর ডেম', 'ndc'],
        ['viqarunnisa', 'ভিকারুননিসা', 'vnsc'],
        ['rajuk', 'রাজউক'],
        ['residential', 'রেসিডেনসিয়াল', 'drmc'],
        ['dhaka college', 'ঢাকা কলেজ', 'dc'],
        ['city college', 'সিটি কলেজ', 'dcc', 'dc', 'ঢাকা সিটি কলেজ'],
        ['chattogram', 'chittagong', 'চট্টগ্রাম', 'ctg'],
        ['rajshahi', 'রাজশাহী'],
        ['cantonment', 'ক্যান্টনমেন্ট', 'cpsc'],
        ['ideal', 'আইডিয়াল'],
        ['mohsin', 'মহসিন'],
        ['victoria', 'ভিক্টোরিয়া'],
        ['mc college', 'এম সি কলেজ', 'এমসি কলেজ'],
        ['bm college', 'বিএম কলেজ', 'বি এম কলেজ'],
        ['ananda mohan', 'আনন্দ মোহন']
    ];

    for (const grp of groups) {
        const matchA = grp.some(term => a.includes(term));
        const matchB = grp.some(term => b.includes(term) || term.includes(b));
        if (matchA && matchB) return true;
    }
    return false;
}`;

content = content.replace(/function matchCollegeName\s*\([\s\S]*?\n\}/, newFn);
fs.writeFileSync(apiFile, content, 'utf8');
console.log('Successfully replaced matchCollegeName with CRLF-safe regex!');
