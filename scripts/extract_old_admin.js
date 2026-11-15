const cp = require('child_process');
const fs = require('fs');

const oldAdmin = cp.execSync('git show 26808e3:admin.html', { maxBuffer: 20 * 1024 * 1024 }).toString('utf8');
fs.writeFileSync('temp_old_admin.html', oldAdmin, 'utf8');

const lines = oldAdmin.split('\n');
console.log('Old admin line count:', lines.length);

const mcqIdx = lines.findIndex(l => l.includes('id="mcqForm"') || l.includes('MCQ এন্ট্রি ফর্ম'));
console.log('MCQ Form start line:', mcqIdx + 1);
console.log(lines.slice(mcqIdx, mcqIdx + 150).join('\n'));
