const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. UPDATE pages/profile.html WITH THEME SWAP BUTTON
// =========================================================================
const profileHtmlPath = path.join(__dirname, '..', 'pages', 'profile.html');
let profileHtml = fs.readFileSync(profileHtmlPath, 'utf8');

const themeSwapHtml = `
                    <!-- ডার্ক ও লাইট মোড সোয়াপ বাটন (Dark/Light Mode Switcher) -->
                    <div class="theme-swap-card" style="margin-top: 18px;">
                        <div class="theme-swap-left">
                            <div class="theme-swap-icon" id="themeStatusIcon">
                                <i class="fa-solid fa-moon"></i>
                            </div>
                            <div class="theme-swap-text">
                                <div class="theme-swap-title">স্ক্রিন মোড (থিম)</div>
                                <div class="theme-swap-status" id="themeStatusText">লাইট মোড সক্রিয়</div>
                            </div>
                        </div>
                        <label class="theme-switch-slider" title="ডার্ক ও লাইট মোড পরিবর্তন করুন">
                            <input type="checkbox" id="themeToggleCheckbox" onchange="toggleScreenTheme(this.checked)">
                            <span class="theme-slider-thumb">
                                <i class="fa-solid fa-sun icon-sun"></i>
                                <i class="fa-solid fa-moon icon-moon"></i>
                            </span>
                        </label>
                    </div>`;

if (!profileHtml.includes('theme-swap-card')) {
    profileHtml = profileHtml.replace(
        /(<button class="btn btn-sm" onclick="confirmLogout\(\)"[^>]*>[\s\S]*?<\/button>\s*<\/div>)/,
        `$1\n${themeSwapHtml}`
    );
    fs.writeFileSync(profileHtmlPath, profileHtml, 'utf8');
    console.log('✓ Added theme swap card to pages/profile.html');
} else {
    console.log('• theme swap card already in pages/profile.html');
}

// =========================================================================
// 2. UPDATE assets/js/profile.js WITH THEME CONTROLLER
// =========================================================================
const profileJsPath = path.join(__dirname, '..', 'assets', 'js', 'profile.js');
let profileJs = fs.readFileSync(profileJsPath, 'utf8');

const themeJsFunctions = `
// ==========================================
// ডার্ক / লাইট মোড নিয়ন্ত্রণ (Theme Switcher)
// ==========================================
function initThemeMode() {
    const savedTheme = localStorage.getItem('ict_theme') || 'light';
    const isDark = savedTheme === 'dark';
    applyThemeMode(isDark);
    
    const checkbox = document.getElementById('themeToggleCheckbox');
    if (checkbox) checkbox.checked = isDark;
}

function toggleScreenTheme(isDark) {
    applyThemeMode(isDark);
    localStorage.setItem('ict_theme', isDark ? 'dark' : 'light');
}
window.toggleScreenTheme = toggleScreenTheme;

function applyThemeMode(isDark) {
    const icon = document.getElementById('themeStatusIcon');
    const statusText = document.getElementById('themeStatusText');
    const checkbox = document.getElementById('themeToggleCheckbox');

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        if (icon) icon.innerHTML = '<i class="fa-solid fa-moon"></i>';
        if (statusText) statusText.textContent = 'ডার্ক মোড সক্রিয়';
        if (checkbox) checkbox.checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        if (icon) icon.innerHTML = '<i class="fa-solid fa-sun" style="color: #F59E0B;"></i>';
        if (statusText) statusText.textContent = 'লাইট মোড সক্রিয়';
        if (checkbox) checkbox.checked = false;
    }
}
window.applyThemeMode = applyThemeMode;
`;

if (!profileJs.includes('toggleScreenTheme')) {
    profileJs += '\n' + themeJsFunctions;
    // Add initThemeMode call in DOMContentLoaded if not already
    profileJs = profileJs.replace(
        /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/,
        `document.addEventListener('DOMContentLoaded', () => {\n    initThemeMode();`
    );
    fs.writeFileSync(profileJsPath, profileJs, 'utf8');
    console.log('✓ Added toggleScreenTheme to assets/js/profile.js');
} else {
    console.log('• toggleScreenTheme already in assets/js/profile.js');
}

// =========================================================================
// 3. UPDATE assets/css/style.css WITH DARK THEME & SWAP BUTTON STYLES
// =========================================================================
const styleCssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const darkThemeCss = `
/* ==========================================================================
   DARK THEME & THEME SWAP SWITCHER
   ========================================================================== */
body.dark-mode, [data-theme="dark"] {
    --bg-page: #0F172A !important;
    --bg-card: #1E293B !important;
    --bg-card-subtle: #334155 !important;
    --border-color: #334155 !important;
    --border-subtle: #1E293B !important;
    --text-primary: #F8FAFC !important;
    --text-secondary: #CBD5E1 !important;
    --text-muted: #94A3B8 !important;
    background-color: #0F172A !important;
    color: #F8FAFC !important;
}

body.dark-mode .site-header,
body.dark-mode .site-footer,
body.dark-mode .card,
body.dark-mode .profile-card,
body.dark-mode .metric-card,
body.dark-mode .history-section,
body.dark-mode .modal-window,
body.dark-mode .bottom-sheet,
body.dark-mode .modern-quiz-card:not(.is-read-question),
body.dark-mode .modern-cq-card,
body.dark-mode .feature-box,
body.dark-mode .chapter-prep-card {
    background-color: #1E293B !important;
    border-color: #334155 !important;
    color: #F8FAFC !important;
}

body.dark-mode .page-header-banner,
body.dark-mode .header-nav-wrapper {
    background: #1E293B !important;
    border-color: #334155 !important;
}

body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode h4, body.dark-mode strong {
    color: #F8FAFC !important;
}

body.dark-mode p, body.dark-mode span:not(.badge):not(.nav-badge) {
    color: #CBD5E1;
}

body.dark-mode .modern-option-pill {
    background: #1E293B !important;
    border-color: #334155 !important;
    color: #F8FAFC !important;
}

body.dark-mode .theme-swap-card {
    background: #0F172A !important;
    border-color: #334155 !important;
}

body.dark-mode .theme-swap-icon {
    background: #312E81 !important;
    color: #A5B4FC !important;
}

/* Theme Swap Toggle Card & Slider */
.theme-swap-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #F1F5F9;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
}

.theme-swap-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.theme-swap-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #E2E8F0;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.theme-swap-title {
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--text-primary);
    text-align: left;
}

.theme-swap-status {
    font-size: 0.78rem;
    color: var(--text-muted);
    text-align: left;
}

.theme-switch-slider {
    position: relative;
    display: inline-block;
    width: 56px;
    height: 30px;
    cursor: pointer;
    margin: 0;
}

.theme-switch-slider input {
    opacity: 0;
    width: 0;
    height: 0;
}

.theme-slider-thumb {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #CBD5E1;
    border-radius: 34px;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 7px;
}

.theme-slider-thumb .icon-sun {
    font-size: 0.75rem;
    color: #F59E0B;
}

.theme-slider-thumb .icon-moon {
    font-size: 0.75rem;
    color: #64748B;
}

.theme-slider-thumb::before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    z-index: 2;
}

.theme-switch-slider input:checked + .theme-slider-thumb {
    background-color: #4F46E5;
}

.theme-switch-slider input:checked + .theme-slider-thumb::before {
    transform: translateX(26px);
    background-color: #F8FAFC;
}
`;

if (!styleCss.includes('theme-swap-card')) {
    styleCss += '\n' + darkThemeCss;
    fs.writeFileSync(styleCssPath, styleCss, 'utf8');
    console.log('✓ Added dark theme and swap button styles to assets/css/style.css');
} else {
    console.log('• theme styles already in assets/css/style.css');
}

// Auto-apply dark mode globally in api.js if saved
const apiJsPath = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let apiJs = fs.readFileSync(apiJsPath, 'utf8');
if (!apiJs.includes('ict_theme_global_init')) {
    const globalThemeInit = `
// ict_theme_global_init
(function() {
    try {
        if (localStorage.getItem('ict_theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (document.body) document.body.classList.add('dark-mode');
            else document.addEventListener('DOMContentLoaded', () => document.body.classList.add('dark-mode'));
        }
    } catch(e) {}
})();
`;
    apiJs = globalThemeInit + '\n' + apiJs;
    fs.writeFileSync(apiJsPath, apiJs, 'utf8');
    console.log('✓ Added global theme initializer to assets/js/api.js');
}

// =========================================================================
// 4. REORDER HOME PAGE CARDS IN index.html
//    Order: Favorite Question -> Model Test -> Reading Room -> Code Compiler
// =========================================================================
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const targetGridRegex = /<div class="special-tools-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;

const newSpecialGrid = `<div class="special-tools-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                <!-- ১. ফেভারিট প্রশ্ন (Favorite Question) -->
                <a href="pages/favorite-question.html" class="feature-box fav-feature">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h3>Favorite Question</h3>
                    <p>অধ্যায়, কলেজ, বোর্ড ও মডেল টেস্টের প্রিয় প্রশ্নগুলো একসাথে</p>
                    <span class="feature-badge"><i class="fa-solid fa-bookmark"></i> বুকমার্ককৃত</span>
                </a>

                <!-- ২. মডেল টেস্ট (Model Test) -->
                <a href="pages/model-test.html" class="feature-box model-feature" style="border-color: #FECDD3;">
                    <div class="feature-icon-wrapper" style="background: #FFF1F2; color: #E11D48;">
                        <i class="fa-solid fa-stopwatch"></i>
                    </div>
                    <h3>Model Test</h3>
                    <p>পূর্ণাঙ্গ ও অধ্যায়ভিত্তিক রিয়েল-টাইম টাইমারযুক্ত লাইভ এক্সাম</p>
                    <span class="feature-badge" style="color: #E11D48; background: #FFF1F2;"><i class="fa-solid fa-play"></i> মডেল টেস্ট দিন</span>
                </a>

                <!-- ৩. রিডিং রুম (Reading Room) -->
                <a href="pages/reading-room.html" class="feature-box reading-feature" style="border-color: #BBF7D0;">
                    <div class="feature-icon-wrapper" style="background: #F0FDF4; color: #16A34A;">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <h3>Reading Room</h3>
                    <p>অনলাইন স্টাডি গ্রুপ, লাইভ পড়াশোনার টাইমার ও লিডারবোর্ড</p>
                    <span class="feature-badge" style="color: #16A34A; background: #F0FDF4;"><i class="fa-solid fa-book-open-reader"></i> রিডিং রুমে যান</span>
                </a>

                <!-- ৪. কোড কম্পাইলার (Code Compiler) -->
                <a href="pages/compiler.html" class="feature-box compiler-feature">
                    <div class="feature-icon-wrapper">
                        <i class="fa-solid fa-code"></i>
                    </div>
                    <h3>Code Compiler</h3>
                    <p>HTML, CSS, JS, Python ও C প্রোগ্রামিং লাইভ কোড ও রান করুন</p>
                    <span class="feature-badge"><i class="fa-solid fa-play"></i> লাইভ কোডিং</span>
                </a>
            </div>
        </div>
    </section>`;

if (targetGridRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(targetGridRegex, newSpecialGrid);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log('✓ Successfully reordered home page cards in index.html');
} else {
    console.log('• Could not find targetGrid in index.html with regex, trying alternate replace');
    const oldCardsSnippet = `<a href="pages/favorite-question.html" class="feature-box fav-feature">`;
    if (indexHtml.includes(oldCardsSnippet) && !indexHtml.includes('reading-room.html')) {
        indexHtml = indexHtml.replace(
            /<div class="special-tools-grid">[\s\S]*?<\/div>/,
            `<div class="special-tools-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                <!-- ১. ফেভারিট প্রশ্ন -->
                <a href="pages/favorite-question.html" class="feature-box fav-feature">
                    <div class="feature-icon-wrapper"><i class="fa-solid fa-star"></i></div>
                    <h3>Favorite Question</h3>
                    <p>অধ্যায়, কলেজ, বোর্ড ও মডেল টেস্টের প্রিয় প্রশ্নগুলো একসাথে</p>
                    <span class="feature-badge"><i class="fa-solid fa-bookmark"></i> বুকমার্ককৃত</span>
                </a>
                <!-- ২. মডেল টেস্ট -->
                <a href="pages/model-test.html" class="feature-box model-feature" style="border-color: #FECDD3;">
                    <div class="feature-icon-wrapper" style="background: #FFF1F2; color: #E11D48;"><i class="fa-solid fa-stopwatch"></i></div>
                    <h3>Model Test</h3>
                    <p>পূর্ণাঙ্গ ও অধ্যায়ভিত্তিক রিয়েল-টাইম টাইমারযুক্ত লাইভ এক্সাম</p>
                    <span class="feature-badge" style="color: #E11D48; background: #FFF1F2;"><i class="fa-solid fa-play"></i> মডেল টেস্ট দিন</span>
                </a>
                <!-- ৩. রিডিং রুম -->
                <a href="pages/reading-room.html" class="feature-box reading-feature" style="border-color: #BBF7D0;">
                    <div class="feature-icon-wrapper" style="background: #F0FDF4; color: #16A34A;"><i class="fa-solid fa-users"></i></div>
                    <h3>Reading Room</h3>
                    <p>অনলাইন স্টাডি গ্রুপ, লাইভ পড়াশোনার টাইমার ও লিডারবোর্ড</p>
                    <span class="feature-badge" style="color: #16A34A; background: #F0FDF4;"><i class="fa-solid fa-book-open-reader"></i> রিডিং রুমে যান</span>
                </a>
                <!-- ৪. কোড কম্পাইলার -->
                <a href="pages/compiler.html" class="feature-box compiler-feature">
                    <div class="feature-icon-wrapper"><i class="fa-solid fa-code"></i></div>
                    <h3>Code Compiler</h3>
                    <p>HTML, CSS, JS, Python ও C প্রোগ্রামিং লাইভ কোড ও রান করুন</p>
                    <span class="feature-badge"><i class="fa-solid fa-play"></i> লাইভ কোডিং</span>
                </a>
            </div>`
        );
        fs.writeFileSync(indexPath, indexHtml, 'utf8');
        console.log('✓ Reordered home page cards using alternate snippet');
    }
}

console.log('Step 1, 2, 3, 4 completed successfully.');
