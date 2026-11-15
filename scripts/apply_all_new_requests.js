const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
console.log('--- STARTING EXECUTION OF ALL NEW USER REQUESTS ---');

// =========================================================================
// 1. UPDATE index.html: 8 CARDS TOGETHER, "৮টি ক্যাটাগরি", NO MIDDLE DIVIDER
// =========================================================================
const indexPath = path.join(root, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// The unified 8-cards grid HTML
const unified8CardsHtml = `
            <!-- মূল ৮টি ফিচারের গ্রিড -->
            <div class="features-section-title">
                <div class="title-left">
                    <span class="icon-indicator" style="background: #EEF2FF; color: #4F46E5;"><i class="fa-solid fa-shapes"></i></span>
                    <h2>প্রস্তুতি ও প্র্যাকটিস কর্নার</h2>
                </div>
                <span class="badge badge-primary">৮টি ক্যাটাগরি</span>
            </div>

            <div class="main-features-grid all-eight-features">
                <!-- ১. বোর্ড প্রশ্ন -->
                <a href="pages/board-question.html" class="feature-box board">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-school"></i>
                    </div>
                    <h3>Board Question</h3>
                    <p>সকল বোর্ডের সালভিত্তিক MCQ ও CQ প্রশ্ন ও সঠিক সমাধান</p>
                    <span class="feature-badge">২০১৯ - ২০২৬ সাল</span>
                </a>

                <!-- ২. অধ্যায়ভিত্তিক প্রস্তুতি -->
                <a href="pages/chapter-prep.html" class="feature-box chapter">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-cubes-stacked"></i>
                    </div>
                    <h3>Chapter Wise</h3>
                    <p>১ম থেকে ৬ষ্ঠ অধ্যায়ের টপিকভিত্তিক নিখুঁত প্রস্তুতি ও প্র্যাকটিস</p>
                    <span class="feature-badge">৬টি পূর্ণাঙ্গ অধ্যায়</span>
                </a>

                <!-- ৩. টেস্ট পেপার -->
                <a href="pages/test-paper.html" class="feature-box testpaper">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-book-open-reader"></i>
                    </div>
                    <h3>Test Paper</h3>
                    <p>নটর ডেম, ভিকারুননিসা সহ শীর্ষ কলেজের টেস্ট পরীক্ষার প্রশ্ন</p>
                    <span class="feature-badge">শীর্ষ ৫০+ কলেজ</span>
                </a>

                <!-- ৪. পিডিএফ সাজেশন -->
                <a href="pages/pdf-suggestion.html" class="feature-box pdf">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <h3>PDF Suggestions</h3>
                    <p>অধ্যায়ভিত্তিক স্পেশাল হ্যান্ডনোট, ফর্মুলা শিট ও সুপার সাজেশন</p>
                    <span class="feature-badge">ফ্রি ডাউনলোড</span>
                </a>

                <!-- ৫. ফেভারিট প্রশ্ন (Favorite Question) -->
                <a href="pages/favorite-question.html" class="feature-box fav-feature">
                    <div class="feature-icon-wrapper" style="background: #FDF2F8; color: #DB2777;">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h3>Favorite Question</h3>
                    <p>অধ্যায়, কলেজ, বোর্ড ও মডেল টেস্টের প্রিয় প্রশ্নগুলো একসাথে</p>
                    <span class="feature-badge" style="color: #DB2777; background: #FDF2F8;"><i class="fa-solid fa-bookmark"></i> বুকমার্ককৃত</span>
                </a>

                <!-- ৬. মডেল টেস্ট (Model Test) -->
                <a href="pages/model-test.html" class="feature-box model-feature">
                    <div class="feature-icon-wrapper" style="background: #FFF1F2; color: #E11D48;">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <h3>Model Test</h3>
                    <p>পূর্ণাঙ্গ ও অধ্যায়ভিত্তিক রিয়েল-টাইম টাইমারযুক্ত লাইভ এক্সাম</p>
                    <span class="feature-badge" style="color: #E11D48; background: #FFF1F2;"><i class="fa-solid fa-play"></i> মডেল টেস্ট দিন</span>
                </a>

                <!-- ৭. রিডিং রুম (Reading Room) -->
                <a href="pages/reading-room.html" class="feature-box reading-feature">
                    <div class="feature-icon-wrapper" style="background: #F0FDF4; color: #16A34A;">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <h3>Reading Room</h3>
                    <p>অনলাইন স্টাডি গ্রুপ, লাইভ পড়াশোনার টাইমার ও লিডারবোর্ড</p>
                    <span class="feature-badge" style="color: #16A34A; background: #F0FDF4;"><i class="fa-solid fa-book-open-reader"></i> রিডিং রুমে যান</span>
                </a>

                <!-- ৮. কোড কম্পাইলার (Code Compiler) -->
                <a href="pages/compiler.html" class="feature-box compiler-feature">
                    <div class="feature-icon-wrapper" style="background: #ECFDF5; color: #059669;">
                        <i class="fa-solid fa-code"></i>
                    </div>
                    <h3>Code Compiler</h3>
                    <p>HTML, CSS, JS, Python ও C প্রোগ্রামিং লাইভ কোড ও রান করুন</p>
                    <span class="feature-badge" style="color: #059669; background: #ECFDF5;"><i class="fa-solid fa-play"></i> লাইভ কোডিং</span>
                </a>
            </div>
        </div>
    </section>`;

// Replace from features-section-title down to the end of main section
indexHtml = indexHtml.replace(
    /<div class="features-section-title">[\s\S]*?<\/div>\s*<\/section>/,
    unified8CardsHtml
);

// Update desktop-nav in index.html
const indexDesktopNav = `
                <ul class="desktop-nav">
                    <li><a href="index.html" class="active"><i class="fa-solid fa-house"></i> প্র্যাকটিস</a></li>
                    <li><a href="pages/board-question.html"><i class="fa-solid fa-building-columns"></i> বোর্ড প্রশ্ন</a></li>
                    <li><a href="pages/test-paper.html"><i class="fa-solid fa-book-open"></i> টেস্ট পেপার</a></li>
                    <li><a href="pages/chapter-prep.html"><i class="fa-solid fa-layer-group"></i> অধ্যায়ভিত্তিক</a></li>
                    <li><a href="pages/model-test.html"><i class="fa-solid fa-stopwatch"></i> মডেল টেস্ট</a></li>
                    <li><a href="pages/pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>
                    <li><a href="pages/reading-room.html"><i class="fa-solid fa-users"></i> রিডিং রুম</a></li>
                    <li><a href="pages/favorite-question.html"><i class="fa-solid fa-star"></i> ফেভারিট প্রশ্ন</a></li>
                </ul>`;

indexHtml = indexHtml.replace(/<ul class="desktop-nav">[\s\S]*?<\/ul>/, indexDesktopNav.trim());

// Ensure CSS for .all-eight-features has 4 columns on desktop and 2 columns on mobile
const eightCardsCss = `
        /* 8 Features Grid Styling */
        .main-features-grid.all-eight-features {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        @media (max-width: 1024px) {
            .main-features-grid.all-eight-features {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }
        }

        @media (max-width: 640px) {
            .main-features-grid.all-eight-features {
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
        }
`;

if (!indexHtml.includes('.main-features-grid.all-eight-features')) {
    indexHtml = indexHtml.replace('</style>', eightCardsCss + '\n    </style>');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✓ Successfully updated index.html with all 8 cards together & 8 categories badge & 8-item desktop nav!');

// =========================================================================
// 2. UPDATE TOP BAR NAVIGATION ACROSS ALL INNER PAGES
// =========================================================================
const innerPages = [
    'pages/board-question.html',
    'pages/test-paper.html',
    'pages/chapter-prep.html',
    'pages/model-test.html',
    'pages/pdf-suggestion.html',
    'pages/reading-room.html',
    'pages/favorite-question.html',
    'pages/compiler.html',
    'pages/profile.html',
    'pages/students-ranking.html'
];

innerPages.forEach(p => {
    const fullPath = path.join(root, p);
    if (!fs.existsSync(fullPath)) return;
    let html = fs.readFileSync(fullPath, 'utf8');

    const baseName = path.basename(p);
    const getActive = (name) => baseName === name ? ' class="active"' : '';

    const pageNav = `
                <ul class="desktop-nav">
                    <li><a href="../index.html"><i class="fa-solid fa-house"></i> প্র্যাকটিস</a></li>
                    <li><a href="board-question.html"${getActive('board-question.html')}><i class="fa-solid fa-building-columns"></i> বোর্ড প্রশ্ন</a></li>
                    <li><a href="test-paper.html"${getActive('test-paper.html')}><i class="fa-solid fa-book-open"></i> টেস্ট পেপার</a></li>
                    <li><a href="chapter-prep.html"${getActive('chapter-prep.html')}><i class="fa-solid fa-layer-group"></i> অধ্যায়ভিত্তিক</a></li>
                    <li><a href="model-test.html"${getActive('model-test.html')}><i class="fa-solid fa-stopwatch"></i> মডেল টেস্ট</a></li>
                    <li><a href="pdf-suggestion.html"${getActive('pdf-suggestion.html')}><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>
                    <li><a href="reading-room.html"${getActive('reading-room.html')}><i class="fa-solid fa-users"></i> রিডিং রুম</a></li>
                    <li><a href="favorite-question.html"${getActive('favorite-question.html')}><i class="fa-solid fa-star"></i> ফেভারিট প্রশ্ন</a></li>
                </ul>`;

    html = html.replace(/<ul class="desktop-nav">[\s\S]*?<\/ul>/, pageNav.trim());
    fs.writeFileSync(fullPath, html, 'utf8');
    console.log(`✓ Updated desktop-nav in: ${p}`);
});

console.log('--- ALL STEP 1 & 2 CODE EDITS COMPLETE ---');
