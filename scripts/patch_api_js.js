const fs = require('fs');
const path = require('path');

const apiJsPath = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(apiJsPath, 'utf8');

// 1. Add resolveHtmlMediaUrls if not present
if (!content.includes('function resolveHtmlMediaUrls')) {
    const targetResolveMedia = `function resolveMediaUrl(rawUrl) {
    if (!rawUrl) return '';
    if (/^https?:\\/\\//i.test(rawUrl)) return rawUrl;
    if (window.location.port === '5000') {
        return rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl;
    }
    const clean = rawUrl.replace(/^\\/+/, '');
    const inPages = window.location.pathname.includes('/pages/');
    return inPages ? \`../\${clean}\` : clean;
}`;

    const replacementResolveMedia = `${targetResolveMedia}

function resolveHtmlMediaUrls(html) {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/src=(["'])(\\\\/?uploads\\/[^"']+)\\1/gi, (match, quote, p) => {
        return \`src=\${quote}\${resolveMediaUrl(p)}\${quote}\`;
    });
}`;

    // Normalize newlines for matching
    if (content.replace(/\r\n/g, '\n').includes(targetResolveMedia.replace(/\r\n/g, '\n'))) {
        const isCRLF = content.includes('\r\n');
        const nl = isCRLF ? '\r\n' : '\n';
        content = content.replace(/\r\n/g, '\n');
        content = content.replace(targetResolveMedia.replace(/\r\n/g, '\n'), replacementResolveMedia.replace(/\r\n/g, '\n'));
        if (isCRLF) {
            content = content.replace(/\n/g, '\r\n');
        }
        console.log('Added resolveHtmlMediaUrls function.');
    } else {
        console.warn('Could not match targetResolveMedia exactly.');
    }
}

// 2. Update renderModernCQCardHTML
const oldCleanQRegex = /const cleanQ = \(text, prefix\) => \{\s*if \(!text\) return '';\s*return text\.replace\(new RegExp\('\^\\\\s\*\\\\\(' \+ prefix \+ '\\\\\)\\\\s\*'\), ''\)\.trim\(\);\s*\};/;
const newCleanQ = `const cleanQ = (text, prefix) => {
        if (!text) return '';
        const stripped = text.replace(new RegExp('^\\\\s*\\\\(' + prefix + '\\\\)\\\\s*'), '').trim();
        return resolveHtmlMediaUrls(stripped);
    };`;

if (oldCleanQRegex.test(content)) {
    content = content.replace(oldCleanQRegex, newCleanQ);
    console.log('Updated cleanQ to use resolveHtmlMediaUrls.');
} else {
    console.log('cleanQ already updated or regex did not match.');
}

// Also update stem to resolveHtmlMediaUrls(cq.stem)
content = content.replace(
    '<p style="margin: 0; line-height: 1.7; font-size: 1rem; color: #1E293B;">${cq.stem}</p>',
    '<p style="margin: 0; line-height: 1.7; font-size: 1rem; color: #1E293B;">${resolveHtmlMediaUrls(cq.stem)}</p>'
);

// 3. Export to window
if (!content.includes('window.resolveHtmlMediaUrls = resolveHtmlMediaUrls;')) {
    content = content.replace(
        'window.restartCurrentModelTest = restartCurrentModelTest;',
        'window.restartCurrentModelTest = restartCurrentModelTest;\nwindow.resolveMediaUrl = resolveMediaUrl;\nwindow.resolveHtmlMediaUrls = resolveHtmlMediaUrls;'
    );
    console.log('Exported resolveMediaUrl and resolveHtmlMediaUrls to window.');
}

fs.writeFileSync(apiJsPath, content, 'utf8');
console.log('Saved assets/js/api.js successfully.');

// Sync to OneDrive
const oneDriveApiJs = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\assets\\js\\api.js';
if (fs.existsSync(path.dirname(oneDriveApiJs))) {
    fs.writeFileSync(oneDriveApiJs, content, 'utf8');
    console.log('Synced assets/js/api.js to OneDrive.');
}
