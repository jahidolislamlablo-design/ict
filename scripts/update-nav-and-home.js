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

    // 1. Remove Favorite & Compiler from desktop-nav
    content = content.replace(/<li><a href="(?:\.\.\/)?(?:pages\/)?favorite-question\.html"[^>]*>[\s\S]*?<\/a><\/li>/gi, '');
    content = content.replace(/<li><a href="(?:\.\.\/)?(?:pages\/)?compiler\.html"[^>]*>[\s\S]*?<\/a><\/li>/gi, '');

    // 2. Cache-busting: update ?v=2.x to ?v=3.0, and add ?v=3.0 to style.css, api.js, and page-specific scripts if missing
    content = content.replace(/style\.css(?:\?v=[\d\.]+)?/g, 'style.css?v=3.0');
    content = content.replace(/model-test\.css(?:\?v=[\d\.]+)?/g, 'model-test.css?v=3.0');
    content = content.replace(/chapter-prep\.css(?:\?v=[\d\.]+)?/g, 'chapter-prep.css?v=3.0');
    content = content.replace(/board-question\.css(?:\?v=[\d\.]+)?/g, 'board-question.css?v=3.0');
    content = content.replace(/test-paper\.css(?:\?v=[\d\.]+)?/g, 'test-paper.css?v=3.0');
    content = content.replace(/pdf-suggestion\.css(?:\?v=[\d\.]+)?/g, 'pdf-suggestion.css?v=3.0');
    content = content.replace(/profile\.css(?:\?v=[\d\.]+)?/g, 'profile.css?v=3.0');

    content = content.replace(/api\.js(?:\?v=[\d\.]+)?/g, 'api.js?v=3.0');
    content = content.replace(/main\.js(?:\?v=[\d\.]+)?/g, 'main.js?v=3.0');
    content = content.replace(/chapter-prep\.js(?:\?v=[\d\.]+)?/g, 'chapter-prep.js?v=3.0');
    content = content.replace(/board-question\.js(?:\?v=[\d\.]+)?/g, 'board-question.js?v=3.0');
    content = content.replace(/test-paper\.js(?:\?v=[\d\.]+)?/g, 'test-paper.js?v=3.0');
    content = content.replace(/model-test\.js(?:\?v=[\d\.]+)?/g, 'model-test.js?v=3.0');
    content = content.replace(/pdf-suggestion\.js(?:\?v=[\d\.]+)?/g, 'pdf-suggestion.js?v=3.0');
    content = content.replace(/profile\.js(?:\?v=[\d\.]+)?/g, 'profile.js?v=3.0');

    // 3. For compiler.html and favorite-question.html, normalize bottom nav to standard 4 buttons
    if (file.endsWith('compiler.html') || file.endsWith('favorite-question.html')) {
        const standardBottomNav = `    <!-- মোবাইল বটম নেভিগেশন বার -->
    <nav class="bottom-nav">
        <a href="../index.html" class="nav-item">
            <i class="fa-solid fa-house"></i>
            <span>প্র্যাকটিস</span>
        </a>
        <a href="model-test.html" class="nav-item">
            <i class="fa-solid fa-stopwatch"></i>
            <span>মডেল টেস্ট</span>
        </a>
        <a href="pdf-suggestion.html" class="nav-item">
            <i class="fa-solid fa-file-pdf"></i>
            <span>সাজেশন</span>
        </a>
        <a href="profile.html" class="nav-item">
            <i class="fa-solid fa-user"></i>
            <span>প্রোফাইল</span>
        </a>
    </nav>`;
        content = content.replace(/<nav class="bottom-nav">[\s\S]*?<\/nav>/, standardBottomNav);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned nav & cache buster in:', path.basename(file));
});

// 4. In index.html, ensure the two feature cards (Favorite Questions & Code Compiler) are directly below Test Paper and PDF Suggestions
let indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Check if special-tools-grid already exists
if (!indexContent.includes('class="special-tools-grid"')) {
    const targetInsertion = `                <!-- ৪. পিডিএফ সাজেশন -->
                <a href="pages/pdf-suggestion.html" class="feature-box pdf">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <h3>PDF Suggestions</h3>
                    <p>অধ্যায়ভিত্তিক স্পেশাল হ্যান্ডনোট, ফর্মুলা শিট ও সুপার সাজেশন</p>
                    <span class="feature-badge">ফ্রি ডাউনলোড</span>
                </a>
            </div>`;

    const replacementWithCards = `                <!-- ৪. পিডিএফ সাজেশন -->
                <a href="pages/pdf-suggestion.html" class="feature-box pdf">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <h3>PDF Suggestions</h3>
                    <p>অধ্যায়ভিত্তিক স্পেশাল হ্যান্ডনোট, ফর্মুলা শিট ও সুপার সাজেশন</p>
                    <span class="feature-badge">ফ্রি ডাউনলোড</span>
                </a>
            </div>

            <!-- বিশেষ ফিচার কার্ড: ফেভারিট প্রশ্ন ও কোড কম্পাইলার (Test Paper ও PDF Suggestions এর নিচে) -->
            <div class="special-tools-grid">
                <!-- ফেভারিট প্রশ্ন -->
                <a href="pages/favorite-question.html" class="feature-box fav-feature">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h3>Favorite Question</h3>
                    <p>সংরক্ষিত অধ্যায়, বোর্ড, কলেজ ও মডেল টেস্টের প্রশ্নসমূহ</p>
                    <span class="feature-badge"><i class="fa-solid fa-bookmark"></i> প্রিয় প্রশ্নব্যাংক</span>
                </a>

                <!-- কোড কম্পাইলার -->
                <a href="pages/compiler.html" class="feature-box compiler-feature">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-code"></i>
                    </div>
                    <h3>Code Compiler</h3>
                    <p>HTML, CSS, JS, Python ও C প্রোগ্রাম সরাসরি রান ও সেভ করুন</p>
                    <span class="feature-badge"><i class="fa-solid fa-play"></i> অনলাইন আইডিই</span>
                </a>
            </div>`;

    if (indexContent.includes(targetInsertion)) {
        indexContent = indexContent.replace(targetInsertion, replacementWithCards);
        console.log('Successfully inserted Favorite & Compiler cards directly below Test Paper & PDF Suggestions in index.html!');
    } else {
        console.warn('Target insertion not matched exactly in index.html');
    }
}

// Add CSS for special-tools-grid in index.html if not present
if (!indexContent.includes('.special-tools-grid')) {
    const cssToAdd = `
        /* Special Tools Grid (Favorite Questions & Code Compiler) */
        .special-tools-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 28px;
        }

        .feature-box.fav-feature {
            border-color: #FBCFE8;
        }
        .feature-box.fav-feature:hover {
            border-color: #DB2777;
        }
        .feature-box.fav-feature .feature-icon-wrapper {
            background: #FDF2F8;
            color: #DB2777;
        }
        .feature-box.fav-feature .feature-badge {
            color: #DB2777;
            background: #FDF2F8;
        }

        .feature-box.compiler-feature {
            border-color: #A7F3D0;
        }
        .feature-box.compiler-feature:hover {
            border-color: #059669;
        }
        .feature-box.compiler-feature .feature-icon-wrapper {
            background: #ECFDF5;
            color: #059669;
        }
        .feature-box.compiler-feature .feature-badge {
            color: #059669;
            background: #ECFDF5;
        }

        @media (max-width: 640px) {
            .special-tools-grid {
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
        }
    </style>`;

    indexContent = indexContent.replace('</style>', cssToAdd);
}

fs.writeFileSync(path.join(rootDir, 'index.html'), indexContent, 'utf8');
console.log('Updated index.html successfully!');
