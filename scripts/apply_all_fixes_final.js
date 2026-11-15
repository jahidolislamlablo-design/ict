const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// =========================================================================
// 1. UPDATE index.html:
//    - Ensure .special-tools-grid is 2 columns on mobile like .main-features-grid
//    - Clean up duplicate orphan tags
// =========================================================================
const indexPath = path.join(root, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace the special-tools-grid section cleanly
const cleanToolsSection = `
            <!-- স্পেশাল ফিচারস গ্রিড: ফেভারিট প্রশ্ন, মডেল টেস্ট, রিডিং রুম ও কোড কম্পাইলার -->
            <div class="features-section-title" style="margin-top: 24px;">
                <div class="title-left">
                    <span class="icon-indicator" style="background: #EEF2FF; color: #4F46E5;"><i class="fa-solid fa-shapes"></i></span>
                    <h2>স্পেশাল টুলস ও লার্নিং কর্নার</h2>
                </div>
                <span class="badge badge-primary">৪টি ফিচার</span>
            </div>

            <div class="main-features-grid special-tools-grid">
                <!-- ১. ফেভারিট প্রশ্ন (Favorite Question) -->
                <a href="pages/favorite-question.html" class="feature-box fav-feature">
                    <div class="feature-icon-wrapper" style="background: #FDF2F8; color: #DB2777;">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h3>Favorite Question</h3>
                    <p>অধ্যায়, কলেজ, বোর্ড ও মডেল টেস্টের প্রিয় প্রশ্নগুলো একসাথে</p>
                    <span class="feature-badge" style="color: #DB2777; background: #FDF2F8;"><i class="fa-solid fa-bookmark"></i> বুকমার্ককৃত</span>
                </a>

                <!-- ২. মডেল টেস্ট (Model Test) -->
                <a href="pages/model-test.html" class="feature-box model-feature">
                    <div class="feature-icon-wrapper" style="background: #FFF1F2; color: #E11D48;">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <h3>Model Test</h3>
                    <p>পূর্ণাঙ্গ ও অধ্যায়ভিত্তিক রিয়েল-টাইম টাইমারযুক্ত লাইভ এক্সাম</p>
                    <span class="feature-badge" style="color: #E11D48; background: #FFF1F2;"><i class="fa-solid fa-play"></i> মডেল টেস্ট দিন</span>
                </a>

                <!-- ৩. রিডিং রুম (Reading Room) -->
                <a href="pages/reading-room.html" class="feature-box reading-feature">
                    <div class="feature-icon-wrapper" style="background: #F0FDF4; color: #16A34A;">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <h3>Reading Room</h3>
                    <p>অনলাইন স্টাডি গ্রুপ, লাইভ পড়াশোনার টাইমার ও লিডারবোর্ড</p>
                    <span class="feature-badge" style="color: #16A34A; background: #F0FDF4;"><i class="fa-solid fa-book-open-reader"></i> রিডিং রুমে যান</span>
                </a>

                <!-- ৪. কোড কম্পাইলার (Code Compiler) -->
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

// Replace from features-section-title of special tools to end of section
indexHtml = indexHtml.replace(
    /(?:<div class="features-section-title" style="margin-top: 24px;">|<div class="special-tools-grid")[\s\S]*?<\/main>/,
    cleanToolsSection + '\n    </main>'
);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✓ Fixed index.html special-tools-grid to 2-columns on mobile and removed orphan tags.');

// =========================================================================
// 2. UPDATE assets/js/api.js:
//    - Fix MCQ click-to-tick so label text stays static and card dimensions NEVER jump
//    - Remove hardcoded color: #000000 !important from CQ cards for perfect Dark Mode readability
//    - Add card progress circles helper
// =========================================================================
const apiJsPath = path.join(root, 'assets', 'js', 'api.js');
let apiJs = fs.readFileSync(apiJsPath, 'utf8');

// Fix toggleQuestionRead: keep label static so width doesn't shift
apiJs = apiJs.replace(
    /label\.textContent = isRead \? 'পড়া সম্পন্ন' : 'পড়া হয়েছে';/g,
    `// Keep label static to prevent any width shifting\n            label.textContent = 'পড়া হয়েছে';`
);

// Fix CQ cards hardcoded black colors
apiJs = apiJs.replace(/color:\s*#000000\s*!important;/g, '');
apiJs = apiJs.replace(/<strong style="color: #1E293B;">উত্তর:<\/strong>/g, `<strong class="cq-ans-label">উত্তর:</strong>`);
apiJs = apiJs.replace(/<p style="margin: 0; line-height: 1.7; font-size: 1rem; color: #1E293B;">/g, `<p class="cq-stem-text" style="margin: 0; line-height: 1.7; font-size: 1rem;">`);

fs.writeFileSync(apiJsPath, apiJs, 'utf8');
console.log('✓ Updated assets/js/api.js: Fixed card stability & removed hardcoded black text in CQ.');

// =========================================================================
// 3. UPDATE assets/css/style.css:
//    - Ensure MCQ card has fixed 1.5px border (transparent -> #93C5FD) with zero size reflow
//    - Add thorough Dark Mode styling for MCQ, CQ, options, stems, math, code
//    - Add styles for right-side circular progress indicator on chapter/board/college cards
// =========================================================================
const styleCssPath = path.join(root, 'assets', 'css', 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const additionalStyles = `
/* ==========================================================================
   FIXED-DIMENSION MCQ CARD READ STATE (No jumping or width/height change)
   ========================================================================== */
.modern-quiz-card {
    border: 1.5px solid transparent !important;
    border-radius: 16px !important;
    box-sizing: border-box !important;
    transition: background-color 0.2s ease, border-color 0.2s ease !important;
}

.modern-quiz-card.is-read-question {
    background: #EFF6FF !important; /* Gentle light blue */
    border: 1.5px solid #93C5FD !important;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.12) !important;
}

body.dark-mode .modern-quiz-card.is-read-question {
    background: #172554 !important; /* Dark blue in dark mode */
    border-color: #2563EB !important;
}

.mcq-read-toggle-box {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    padding: 4px 10px !important;
    border-radius: 999px !important;
    background: #F1F5F9 !important;
    border: 1px solid #CBD5E1 !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
    height: 28px !important;
    box-sizing: border-box !important;
    user-select: none !important;
    white-space: nowrap !important;
}

.mcq-read-label {
    font-size: 0.75rem !important;
    font-weight: 700 !important;
    color: #475569 !important;
    white-space: nowrap !important;
}

/* ==========================================================================
   RIGHT-SIDE CIRCULAR PROGRESS WIDGET FOR CHAPTER / BOARD / COLLEGE CARDS
   (Matches media_1794721456765_d1f64530.png)
   ========================================================================== */
.chapter-prep-card, .board-card, .college-card {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 16px 20px !important;
    border-radius: 18px !important;
    background: #FFFFFF !important;
    border: 1.5px solid #E2E8F0 !important;
    box-shadow: 0 4px 14px rgba(0,0,0,0.03) !important;
    margin-bottom: 14px !important;
    transition: all 0.2s ease !important;
    gap: 16px !important;
    text-decoration: none !important;
    cursor: pointer !important;
}

.chapter-prep-card:hover, .board-card:hover, .college-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.07) !important;
}

body.dark-mode .chapter-prep-card,
body.dark-mode .board-card,
body.dark-mode .college-card {
    background: #1E293B !important;
    border-color: #334155 !important;
}

.card-left-info {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
}

.card-icon-box {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #EEF2FF;
    color: #4F46E5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
}

.card-text-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.card-main-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #1E293B;
    margin: 0;
    line-height: 1.3;
}

body.dark-mode .card-main-title {
    color: #F8FAFC !important;
}

.card-sub-title {
    font-size: 0.88rem;
    color: #64748B;
    line-height: 1.3;
}

body.dark-mode .card-sub-title {
    color: #94A3B8 !important;
}

.card-counts-badge {
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
    margin-top: 3px;
}

body.dark-mode .card-counts-badge {
    color: #CBD5E1 !important;
}

/* Right-side Circular Progress Ring */
.card-right-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: 4px;
    text-align: center;
    min-width: 80px;
}

.card-ring-box {
    position: relative;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-ring-svg {
    width: 52px;
    height: 52px;
    transform: rotate(-90deg);
}

.card-ring-bg {
    fill: none;
    stroke: #E2E8F0;
    stroke-width: 4;
}

body.dark-mode .card-ring-bg {
    stroke: #334155;
}

.card-ring-fill {
    fill: none;
    stroke: #2563EB;
    stroke-width: 4;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.6s ease;
}

.card-ring-ratio {
    position: absolute;
    font-size: 0.72rem;
    font-weight: 800;
    color: #1E293B;
    letter-spacing: -0.2px;
    text-align: center;
}

body.dark-mode .card-ring-ratio {
    color: #F8FAFC !important;
}

.card-ring-pct {
    font-size: 0.68rem;
    font-weight: 700;
    color: #1E293B;
    white-space: nowrap;
}

body.dark-mode .card-ring-pct {
    color: #94A3B8 !important;
}

/* ==========================================================================
   COMPREHENSIVE DARK MODE OVERRIDES FOR MCQ & CQ
   ========================================================================== */
body.dark-mode .interactive-view-container {
    background-color: #0F172A !important;
    color: #F8FAFC !important;
}

body.dark-mode .interactive-sub-header {
    background: #1E293B !important;
    border-color: #334155 !important;
    color: #F8FAFC !important;
}

body.dark-mode .sub-header-title {
    color: #F8FAFC !important;
}

body.dark-mode .round-back-btn {
    background: #334155 !important;
    color: #F8FAFC !important;
}

body.dark-mode .modern-q-title {
    color: #F8FAFC !important;
}

body.dark-mode .modern-option-pill {
    background: #1E293B !important;
    border: 1px solid #334155 !important;
    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(255,255,255,0.04) !important;
    color: #F8FAFC !important;
}

body.dark-mode .modern-option-pill:hover:not(.locked) {
    background: #334155 !important;
    color: #FFFFFF !important;
}

body.dark-mode .option-radio-circle {
    background: #0F172A !important;
    border-color: #64748B !important;
    box-shadow: none !important;
}

body.dark-mode .option-text {
    color: #F8FAFC !important;
}

body.dark-mode .question-stem {
    background: #1E293B !important;
    color: #F1F5F9 !important;
    border-left: 4px solid #6366F1 !important;
}

body.dark-mode .modern-exp-btn {
    background: #334155 !important;
    color: #F8FAFC !important;
    border-color: #475569 !important;
}

body.dark-mode .modern-exp-box {
    background: #1E293B !important;
    border: 1px solid #334155 !important;
    color: #F1F5F9 !important;
}

/* CQ in Dark Mode */
body.dark-mode .modern-cq-card {
    background: #1E293B !important;
    border-color: #334155 !important;
}

body.dark-mode .modern-cq-stem-box {
    background: #1E293B !important;
    border-color: #334155 !important;
    color: #F8FAFC !important;
}

body.dark-mode .modern-cq-stem-box p,
body.dark-mode .cq-stem-text {
    color: #E2E8F0 !important;
}

body.dark-mode .modern-cq-sub-pill {
    background: #0F172A !important;
    border-color: #334155 !important;
}

body.dark-mode .modern-cq-sub-header {
    background: #1E293B !important;
    color: #F8FAFC !important;
}

body.dark-mode .modern-cq-sub-body {
    background: #0F172A !important;
    color: #E2E8F0 !important;
}

body.dark-mode .cq-ans-label {
    color: #60A5FA !important;
}

body.dark-mode .modern-cq-arrow-circle {
    background: #334155 !important;
    color: #F8FAFC !important;
}
`;

if (!styleCss.includes('RIGHT-SIDE CIRCULAR PROGRESS WIDGET')) {
    styleCss += '\n' + additionalStyles;
    fs.writeFileSync(styleCssPath, styleCss, 'utf8');
    console.log('✓ Added comprehensive Dark Mode & Right-side Circular Progress styles to style.css.');
} else {
    console.log('• Styles already present in style.css');
}

console.log('Done with steps 1, 2, 3.');
