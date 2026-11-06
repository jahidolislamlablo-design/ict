const fs = require('fs');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Header nav
const oldNav = `                    <li><a href="pages/model-test.html"><i class="fa-solid fa-stopwatch"></i> মডেল টেস্ট</a></li>
                    <li><a href="pages/pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>
                </ul>`;
const newNav = `                    <li><a href="pages/model-test.html"><i class="fa-solid fa-stopwatch"></i> মডেল টেস্ট</a></li>
                    <li><a href="pages/pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>
                    <li><a href="pages/favorite-question.html"><i class="fa-solid fa-bookmark"></i> ফেভারিট</a></li>
                    <li><a href="pages/compiler.html"><i class="fa-solid fa-code"></i> কম্পাইলার</a></li>
                </ul>`;
indexHtml = indexHtml.replace(oldNav, newNav);

// Two new cards under main 4 cards
const oldCardsEnd = `                <!-- ৪. পিডিএফ সাজেশন -->
                <a href="pages/pdf-suggestion.html" class="feature-box pdf">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <h3>PDF Suggestions</h3>
                    <p>অধ্যায়ভিত্তিক স্পেশাল হ্যান্ডনোট, ফর্মুলা শিট ও সুপার সাজেশন</p>
                    <span class="feature-badge">ফ্রি ডাউনলোড</span>
                </a>
            </div>`;

const newCardsEnd = `                <!-- ৪. পিডিএফ সাজেশন -->
                <a href="pages/pdf-suggestion.html" class="feature-box pdf">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <h3>PDF Suggestions</h3>
                    <p>অধ্যায়ভিত্তিক স্পেশাল হ্যান্ডনোট, ফর্মুলা শিট ও সুপার সাজেশন</p>
                    <span class="feature-badge">ফ্রি ডাউনলোড</span>
                </a>
            </div>

            <!-- স্পেশাল কার্ড: ফেভারিট প্রশ্ন ও কোড কম্পাইলার -->
            <div class="features-section-title" style="margin-top: 10px;">
                <span>Special Tools</span>
                <span class="badge badge-primary">নতুন ফিচার</span>
            </div>

            <div class="sub-features-grid">
                <!-- ফেভারিট প্রশ্ন (Favorite Question) -->
                <a href="pages/favorite-question.html" class="feature-box favorite">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-bookmark"></i>
                    </div>
                    <h3>Favorite Question</h3>
                    <p>অধ্যায়, বোর্ড, কলেজ ও মডেল টেস্টের সংরক্ষিত প্রশ্নাবলি</p>
                    <span class="feature-badge">৪টি ক্যাটাগরি</span>
                </a>

                <!-- কোড কম্পাইলার (Online Code Compiler) -->
                <a href="pages/compiler.html" class="feature-box compiler">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-laptop-code"></i>
                    </div>
                    <h3>Code Compiler</h3>
                    <p>HTML, CSS, JS, Python ও C কোড রান ও প্রোগ্রাম সংরক্ষণ</p>
                    <span class="feature-badge">HTML • CSS • JS • Python • C</span>
                </a>
            </div>`;

indexHtml = indexHtml.replace(oldCardsEnd, newCardsEnd);

// Footer links
indexHtml = indexHtml.replace(
    `<a href="pages/profile.html">প্রোফাইল</a>`,
    `<a href="pages/favorite-question.html">ফেভারিট প্রশ্ন</a>\r\n                <a href="pages/compiler.html">কোড কম্পাইলার</a>\r\n                <a href="pages/profile.html">প্রোফাইল</a>`
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html');

// 2. Update assets/css/style.css
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const subGridStyles = `
/* Sub Features Grid (Favorite Question & Compiler Cards) */
.sub-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 32px;
}
.feature-box.favorite .feature-icon-wrapper { background: #EEF2FF; color: #4F46E5; }
.feature-box.compiler .feature-icon-wrapper { background: #ECFDF5; color: #059669; }

@media (max-width: 640px) {
    .sub-features-grid {
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
}
`;

if (!css.includes('.sub-features-grid')) {
    css += '\n' + subGridStyles;
    fs.writeFileSync('assets/css/style.css', css, 'utf8');
    console.log('Updated style.css with sub-features-grid');
}
