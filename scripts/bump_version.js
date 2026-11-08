const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'pages/chapter-prep.html',
    'pages/model-test.html',
    'pages/pdf-suggestion.html',
    'pages/students-ranking.html',
    'pages/profile.html',
    'pages/board-question.html',
    'pages/test-paper.html',
    'pages/compiler.html',
    'pages/favorite-question.html'
];

const oneDriveBase = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning';

files.forEach(f => {
    const localPath = path.join(__dirname, '..', f);
    if (fs.existsSync(localPath)) {
        let content = fs.readFileSync(localPath, 'utf8');
        content = content.replace(/api\.js\?v=4\.[0-9]/g, 'api.js?v=5.0');
        fs.writeFileSync(localPath, content, 'utf8');
    }

    const oneDrivePath = path.join(oneDriveBase, f);
    if (fs.existsSync(oneDrivePath)) {
        let content = fs.readFileSync(oneDrivePath, 'utf8');
        content = content.replace(/api\.js\?v=4\.[0-9]/g, 'api.js?v=5.0');
        fs.writeFileSync(oneDrivePath, content, 'utf8');
    }
});

console.log('Bumped cache version to v=5.0 in all HTML files.');
