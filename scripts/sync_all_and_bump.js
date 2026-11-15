const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');
const dstDir = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning';

// 1. Bump versions in all HTML files
const htmlFiles = [
    'index.html',
    'admin.html',
    'login.html',
    'pages/board-question.html',
    'pages/chapter-prep.html',
    'pages/compiler.html',
    'pages/favorite-question.html',
    'pages/login.html',
    'pages/model-test.html',
    'pages/pdf-suggestion.html',
    'pages/profile.html',
    'pages/reading-room.html',
    'pages/students-ranking.html',
    'pages/test-paper.html'
];

htmlFiles.forEach(rel => {
    const filePath = path.join(srcDir, rel);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Bump style.css
    content = content.replace(/style\.css(\?v=[0-9.]+)?/g, 'style.css?v=7.5');
    // Bump api.js
    content = content.replace(/api\.js(\?v=[0-9.]+)?/g, 'api.js?v=7.5');
    // Bump login.js
    content = content.replace(/login\.js(\?v=[0-9.]+)?/g, 'login.js?v=7.5');
    // Bump profile.js
    content = content.replace(/profile\.js(\?v=[0-9.]+)?/g, 'profile.js?v=7.5');
    // Bump chapter-prep.js
    content = content.replace(/chapter-prep\.js(\?v=[0-9.]+)?/g, 'chapter-prep.js?v=7.5');
    // Bump board-question.js
    content = content.replace(/board-question\.js(\?v=[0-9.]+)?/g, 'board-question.js?v=7.5');
    // Bump test-paper.js
    content = content.replace(/test-paper\.js(\?v=[0-9.]+)?/g, 'test-paper.js?v=7.5');
    // Bump model-test.js
    content = content.replace(/model-test\.js(\?v=[0-9.]+)?/g, 'model-test.js?v=7.5');
    // Bump main.js
    content = content.replace(/main\.js(\?v=[0-9.]+)?/g, 'main.js?v=7.5');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Bumped cache version to v=7.5 in: ${rel}`);
});

// 2. Sync all project files to OneDrive mirror
function copyFolderRecursiveSync(src, dst) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        const basename = path.basename(src);
        if (basename === '.git' || basename === 'node_modules' || basename.startsWith('temp_')) {
            return;
        }
        if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
        fs.readdirSync(src).forEach(child => {
            copyFolderRecursiveSync(path.join(src, child), path.join(dst, child));
        });
    } else {
        const dir = path.dirname(dst);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.copyFileSync(src, dst);
    }
}

console.log('Syncing all files to OneDrive...');
const itemsToSync = [
    'index.html',
    'admin.html',
    'login.html',
    'server.js',
    'pages',
    'assets',
    'database'
];

itemsToSync.forEach(item => {
    const s = path.join(srcDir, item);
    const d = path.join(dstDir, item);
    copyFolderRecursiveSync(s, d);
    console.log(`Synced ${item} -> OneDrive`);
});

console.log('✓ All files bumped and synced to OneDrive mirror!');
