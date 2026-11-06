const fs = require('fs');

const pages = [
    'pages/board-question.html',
    'pages/chapter-prep.html',
    'pages/test-paper.html',
    'pages/model-test.html',
    'pages/pdf-suggestion.html',
    'pages/profile.html'
];

pages.forEach(p => {
    if (!fs.existsSync(p)) return;
    let html = fs.readFileSync(p, 'utf8');

    // Update desktop-nav
    const oldNav = `<li><a href="pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>\r\n                </ul>`;
    const oldNavLF = `<li><a href="pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>\n                </ul>`;

    const newNav = `<li><a href="pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>\r\n                    <li><a href="favorite-question.html"><i class="fa-solid fa-bookmark"></i> ফেভারিট</a></li>\r\n                    <li><a href="compiler.html"><i class="fa-solid fa-code"></i> কম্পাইলার</a></li>\r\n                </ul>`;

    if (!html.includes('favorite-question.html')) {
        if (html.includes(oldNav)) {
            html = html.replace(oldNav, newNav);
        } else if (html.includes(oldNavLF)) {
            html = html.replace(oldNavLF, newNav);
        }
    }

    // Update footer links
    const oldFooter = `<a href="profile.html">প্রোফাইল</a>`;
    const newFooter = `<a href="favorite-question.html">ফেভারিট প্রশ্ন</a>\r\n                <a href="compiler.html">কোড কম্পাইলার</a>\r\n                <a href="profile.html">প্রোফাইল</a>`;
    if (!html.includes('<a href="favorite-question.html">ফেভারিট প্রশ্ন</a>') && html.includes(oldFooter)) {
        html = html.replace(oldFooter, newFooter);
    }

    fs.writeFileSync(p, html, 'utf8');
    console.log('Updated nav for', p);
});
