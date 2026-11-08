const fs = require('fs');
const path = require('path');

const srcBase = path.join(__dirname, '..');
const dstBase = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning';

const filesToSync = [
    'admin.html',
    'server.js',
    'pages/model-test.html',
    'pages/compiler.html',
    'assets/css/model-test.css',
    'assets/js/model-test.js',
    'assets/js/api.js',
    'database/model_tests.json',
    'database/mcqs.json'
];

filesToSync.forEach(f => {
    const src = path.join(srcBase, f);
    const dst = path.join(dstBase, f);
    if (fs.existsSync(src)) {
        const dstDir = path.dirname(dst);
        if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
        fs.copyFileSync(src, dst);
        console.log(`Synced: ${f} -> OneDrive`);
    } else {
        console.warn(`File not found: ${src}`);
    }
});

console.log('✅ All files synced to OneDrive mirror successfully!');
