const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const target = '<h3>PDF Suggestions</h3>';
const afterTarget = content.indexOf(target);
if (afterTarget !== -1) {
    const closingDiv = content.indexOf('</div>', afterTarget);
    if (closingDiv !== -1) {
        const insertPos = closingDiv + 6;
        const toInsert = `

            <!-- বিশেষ ফিচার কার্ড: ফেভারিট প্রশ্ন ও কোড কম্পাইলার (Test Paper ও PDF Suggestions এর নিচে) -->
            <div class="special-tools-grid">
                <!-- ফেভারিট প্রশ্ন -->
                <a href="pages/favorite-question.html" class="feature-box fav-feature">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h3>Favorite Question</h3>
                    <p>অধ্যায়, বোর্ড, কলেজ ও মডেল টেস্টের প্রিয় সংরক্ষিত প্রশ্নাবলি</p>
                    <span class="feature-badge"><i class="fa-solid fa-bookmark"></i> ৪টি ক্যাটাগরি</span>
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
        content = content.slice(0, insertPos) + toInsert + content.slice(insertPos);
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log('Successfully inserted special-tools-grid into index.html!');
    }
} else {
    console.log('Target not found in index.html');
}
