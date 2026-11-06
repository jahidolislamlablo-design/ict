const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'pages');

const htmlFiles = [
    path.join(rootDir, 'index.html'),
    ...fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).map(f => path.join(pagesDir, f))
];

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/(<ul class="desktop-nav">)([\s\S]*?)(<\/ul>)/, (match, open, items, close) => {
        const cleanItems = items.split('\n').filter(line => line.trim().length > 0).join('\n                    ');
        return `${open}\n                    ${cleanItems}\n                ${close}`;
    });
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Normalized desktop-nav in all HTML files!');
