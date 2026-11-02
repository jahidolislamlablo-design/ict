const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the broken regex line:
// return html.replace(/src=(["'])(\\/?uploads\/[^"']+)\1/gi, (match, quote, p) => {
const oldStr = `function resolveHtmlMediaUrls(html) {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/src=(["'])(\\\\/?uploads\\/[^"']+)\\1/gi, (match, quote, p) => {
        return \`src=\${quote}\${resolveMediaUrl(p)}\${quote}\`;
    });
}`;

const newStr = `function resolveHtmlMediaUrls(html) {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/src=(["'])(\\/?uploads\\/[^"']+)\\1/gi, (match, quote, p) => {
        return \`src=\${quote}\${resolveMediaUrl(p)}\${quote}\`;
    });
}`;

// Also add matchBoardName helper for robust board matching
const boardHelper = `
function matchBoardName(storedName, boardCode) {
    if (!storedName || !boardCode || boardCode === 'all') return true;
    const s = storedName.toLowerCase();
    const c = boardCode.toLowerCase();
    if (s.includes(c) || c.includes(s)) return true;

    const boardMap = {
        'dhaka': ['dhaka', 'ঢাকা'],
        'rajshahi': ['rajshahi', 'রাজশাহী'],
        'chattogram': ['chattogram', 'chittagong', 'ctg', 'চট্টগ্রাম'],
        'jashore': ['jashore', 'jessore', 'যশোর'],
        'comilla': ['comilla', 'cumilla', 'কুমিল্লা'],
        'barishal': ['barishal', 'বরিশাল'],
        'sylhet': ['sylhet', 'সিলেট'],
        'dinajpur': ['dinajpur', 'দিনাজপুর'],
        'mymensingh': ['mymensingh', 'ময়মনসিংহ'],
        'madrasah': ['madrasah', 'madrasa', 'মাদ্রাসা']
    };

    for (const [key, aliases] of Object.entries(boardMap)) {
        const matchesQuery = aliases.some(a => c.includes(a));
        if (matchesQuery) {
            return aliases.some(a => s.includes(a));
        }
    }
    return false;
}
`;

const lines = content.split(/\r?\n/);
let replaced = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('resolveHtmlMediaUrls(html)') && lines[i+2] && lines[i+2].includes('return html.replace')) {
        lines[i+2] = "    return html.replace(/src=([\"'])(\\/?uploads\\/[^\"']+)\\1/gi, (match, quote, p) => {";
        replaced = true;
        break;
    }
}

if (replaced) {
    content = lines.join('\r\n');
    console.log('Fixed regex in resolveHtmlMediaUrls.');
} else {
    console.warn('Could not locate resolveHtmlMediaUrls line.');
}

// Add matchBoardName if not already present
if (!content.includes('function matchBoardName')) {
    content = content.replace(
        'function matchCollegeName(',
        boardHelper + '\nfunction matchCollegeName('
    );
    console.log('Added matchBoardName helper.');
}

// Update getBoardMCQ and getBoardCQ in ApiService to use matchBoardName in static fallback
content = content.replace(
    "const b = (item.boardName || '').toLowerCase();\n                    if (!b.includes(boardCode.toLowerCase())) return false;",
    "if (!matchBoardName(item.boardName, boardCode)) return false;"
);
content = content.replace(
    "const b = (item.boardName || '').toLowerCase();\r\n                    if (!b.includes(boardCode.toLowerCase())) return false;",
    "if (!matchBoardName(item.boardName, boardCode)) return false;"
);

content = content.replace(
    "const b = (item.boardName || '').toLowerCase();\n                    if (!b.includes(boardCode.toLowerCase())) return false;",
    "if (!matchBoardName(item.boardName, boardCode)) return false;"
);
content = content.replace(
    "const b = (item.boardName || '').toLowerCase();\r\n                    if (!b.includes(boardCode.toLowerCase())) return false;",
    "if (!matchBoardName(item.boardName, boardCode)) return false;"
);

// Also export matchBoardName to window
if (!content.includes('window.matchBoardName = matchBoardName;')) {
    content = content.replace(
        'window.resolveHtmlMediaUrls = resolveHtmlMediaUrls;',
        'window.resolveHtmlMediaUrls = resolveHtmlMediaUrls;\nwindow.matchBoardName = matchBoardName;'
    );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved assets/js/api.js successfully.');

// Sync to OneDrive
const oneDrivePath = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\assets\\js\\api.js';
if (fs.existsSync(path.dirname(oneDrivePath))) {
    fs.writeFileSync(oneDrivePath, content, 'utf8');
    console.log('Synced assets/js/api.js to OneDrive.');
}
