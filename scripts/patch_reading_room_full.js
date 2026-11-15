const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const rrPath = path.join(root, 'pages', 'reading-room.html');
let content = fs.readFileSync(rrPath, 'utf8');

// Header HTML
const siteHeaderHtml = `
    <!-- হেডার ও নেভিগেশন বার -->
    <header class="site-header">
        <div class="header-container">
            <div class="header-brand-group">
                <button class="nav-back-btn desktop-back-btn" onclick="window.location.href='../index.html'" title="হোমে ফিরে যান">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span id="back-btn-text">হোমে ফিরে যান</span>
                </button>
                <a href="../index.html" class="brand-link">
                    <img src="../assets/images/icon.png" alt="ICT Easy Learning" class="brand-logo-img">
                    <div class="brand-icon">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div class="brand-text">
                        <span class="brand-title">ICT EASY LEARNING</span>
                        <span class="brand-subtitle">এইচএসসি আইসিটি প্রস্তুতি</span>
                    </div>
                </a>
            </div>

            <div class="header-nav-wrapper">
                <button class="nav-back-btn mobile-nav-back-btn" onclick="window.location.href='../index.html'" title="হোমে ফিরে যান">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <ul class="desktop-nav">
                    <li><a href="../index.html"><i class="fa-solid fa-house"></i> প্র্যাকটিস</a></li>
                    <li><a href="board-question.html"><i class="fa-solid fa-building-columns"></i> বোর্ড প্রশ্ন</a></li>
                    <li><a href="test-paper.html"><i class="fa-solid fa-book-open"></i> টেস্ট পেপার</a></li>
                    <li><a href="chapter-prep.html"><i class="fa-solid fa-layer-group"></i> অধ্যায়ভিত্তিক</a></li>
                    <li><a href="model-test.html"><i class="fa-solid fa-stopwatch"></i> মডেল টেস্ট</a></li>
                    <li><a href="reading-room.html" class="active"><i class="fa-solid fa-users"></i> রিডিং রুম</a></li>
                    <li><a href="pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>
                </ul>
            </div>

            <div class="header-actions">
                <a href="profile.html" class="header-user-btn" title="প্রোফাইল">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="ইউজার প্রোফাইল" id="siteHeaderAvatar">
                    <span class="header-user-name" id="siteHeaderUserName">প্রোফাইল</span>
                </a>
            </div>
        </div>
    </header>
`;

// Footer & Bottom Nav HTML
const siteFooterHtml = `
    <!-- ফুটার -->
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-bottom">
                <div class="developer-info">
                    <span class="developer-role">Developer &amp; Owner</span>
                    <h4 class="developer-name">JAHIDUL ISLAM LABLO</h4>
                    <span class="developer-degree">BSc in CSE ( Uttara University)</span>
                    <div class="footer-copyright-text">
                        <span class="brand-copy-name">ICT EASY LEARNING</span> &copy; 2026. সর্বস্বত্ব সংরক্ষিত।
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- মোবাইল বটম নেভিগেশন বার (সবসময় ৫টি বাটন ফিক্সড) -->
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
        <a href="students-ranking.html" class="nav-item">
            <i class="fa-solid fa-trophy"></i>
            <span class="nav-label-multiline">স্টুডেন্ট<br>র‌্যাংকিং</span>
        </a>
        <a href="profile.html" class="nav-item">
            <i class="fa-solid fa-user"></i>
            <span>প্রোফাইল</span>
        </a>
    </nav>

    <!-- Global App Scripts -->
    <script src="../assets/js/api.js?v=7.0"></script>
    <script src="../assets/js/main.js?v=7.0"></script>
`;

// Replace CSS in head to fix computer small width and mobile overflow
const cssOverrides = `
        /* Responsive Reading Room Wrapper */
        body {
            overflow-x: hidden;
            background-color: #F8FAFC;
        }

        .reading-room-app {
            max-width: 860px !important;
            margin: 20px auto 40px auto !important;
            min-height: auto !important;
            background: #FFFFFF !important;
            border-radius: 20px !important;
            box-shadow: 0 4px 25px rgba(0,0,0,0.06) !important;
            position: relative !important;
            padding-bottom: 30px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            width: 100% !important;
        }

        @media (max-width: 768px) {
            .reading-room-app {
                max-width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                padding-bottom: 80px !important;
            }
        }

        .rr-avatars-scroll {
            display: flex;
            align-items: center;
            gap: 14px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding: 10px 0 16px 0;
            scrollbar-width: none;
            max-width: 100%;
            box-sizing: border-box;
        }

        .rr-avatars-scroll::-webkit-scrollbar {
            display: none;
        }

        .rr-filters-row {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            padding: 12px 20px;
            border-bottom: 1px solid #F1F5F9;
            scrollbar-width: none;
            max-width: 100%;
            box-sizing: border-box;
        }

        .rr-filters-row::-webkit-scrollbar {
            display: none;
        }

        .rr-hero-banner {
            box-sizing: border-box;
            max-width: 100%;
        }

        .rr-ranking-list {
            box-sizing: border-box;
            max-width: 100%;
        }

        body.dark-mode .reading-room-app {
            background: #1E293B !important;
            box-shadow: 0 4px 25px rgba(0,0,0,0.4) !important;
        }

        body.dark-mode .rr-header {
            background: #1E293B !important;
            border-bottom: 1px solid #334155;
        }

        body.dark-mode .rr-title {
            color: #F8FAFC !important;
        }

        body.dark-mode .rr-ranking-item {
            border-color: #334155 !important;
        }

        body.dark-mode .rr-name-row {
            color: #F8FAFC !important;
        }

        body.dark-mode .rr-modal-card {
            background: #1E293B !important;
            color: #F8FAFC !important;
        }
`;

// Insert cssOverrides before </style>
content = content.replace('</style>', cssOverrides + '\n    </style>');

// Insert siteHeaderHtml right after <body>
content = content.replace('<body>', '<body>\n' + siteHeaderHtml);

// Insert siteFooterHtml right before </body>
content = content.replace('</body>', siteFooterHtml + '\n</body>');

fs.writeFileSync(rrPath, content, 'utf8');
console.log('✓ Successfully patched pages/reading-room.html with header, footer, bottom-nav, responsive desktop & mobile container!');
