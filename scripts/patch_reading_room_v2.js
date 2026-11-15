const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const rrPath = path.join(root, 'pages', 'reading-room.html');
let html = fs.readFileSync(rrPath, 'utf8');

// 1. Fix footer developer image
const correctFooter = `
    <!-- প্ল্যাটফর্ম ফুটার -->
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-developer-card">
                <div class="developer-avatar-wrapper">
                    <img src="../assets/images/developer.jpg" alt="Jahidul Islam Lablo" class="developer-avatar-img">
                </div>
                <div class="developer-info-text">
                    <span class="developer-role">Developer &amp; Owner</span>
                    <h4 class="developer-name">JAHIDUL ISLAM LABLO</h4>
                    <span class="developer-degree">BSc in CSE ( Uttara University)</span>
                    <div class="footer-copyright-text">
                        <span class="brand-copy-name">ICT EASY LEARNING</span> &copy; 2026. সর্বস্বত্ব সংরক্ষিত।
                    </div>
                </div>
            </div>
        </div>
    </footer>`;

html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, correctFooter.trim());

// 2. Reduce Banner Height and improve filter tab CSS
const styleEnhancements = `
        /* Reduced Hero Banner Height */
        .rr-hero-banner {
            margin: 0 16px 14px 16px !important;
            background: linear-gradient(135deg, #15803D 0%, #16A34A 100%) !important;
            border-radius: 18px !important;
            padding: 16px 18px 14px 18px !important;
            color: #FFFFFF !important;
            position: relative !important;
            box-shadow: 0 6px 18px rgba(22, 163, 74, 0.22) !important;
        }

        .rr-hero-top {
            margin-bottom: 6px !important;
        }

        .rr-timer-big {
            font-size: 2.3rem !important;
            margin: 4px 0 2px 0 !important;
            line-height: 1.1 !important;
        }

        .rr-timer-unit {
            font-size: 1.05rem !important;
        }

        .rr-hero-desc {
            font-size: 0.88rem !important;
            margin-bottom: 12px !important;
        }

        .rr-timer-action-row {
            margin-bottom: 10px !important;
        }

        .rr-btn-timer {
            padding: 8px 20px !important;
            font-size: 0.95rem !important;
            border-radius: 9999px !important;
        }

        /* 4 Filter Tabs: Never Wrap (White-space: nowrap) */
        .rr-filters-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 6px !important;
            padding: 10px 16px !important;
            border-bottom: 1px solid #F1F5F9 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
        }

        .rr-filter-tab {
            flex: 1 !important;
            text-align: center !important;
            white-space: nowrap !important;
            font-size: 0.82rem !important;
            font-weight: 700 !important;
            padding: 7px 4px !important;
            border-radius: 9999px !important;
            background: #F1F5F9 !important;
            color: #64748B !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        @media (max-width: 400px) {
            .rr-filter-tab {
                font-size: 0.76rem !important;
                padding: 6px 2px !important;
            }
        }

        .rr-filter-tab.active {
            background: #15803D !important;
            color: #FFFFFF !important;
        }

        /* User Participated Exams List in Modal */
        .rr-user-exam-history-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            padding: 12px 14px;
            margin-bottom: 14px;
            text-align: left;
        }

        body.dark-mode .rr-user-exam-history-card {
            background: #0F172A !important;
            border-color: #334155 !important;
        }

        .rr-exam-history-title {
            font-size: 0.86rem;
            font-weight: 800;
            color: #1E293B;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        body.dark-mode .rr-exam-history-title {
            color: #F8FAFC !important;
        }

        .rr-exam-history-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-height: 160px;
            overflow-y: auto;
        }

        .rr-exam-history-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            font-size: 0.82rem;
        }

        body.dark-mode .rr-exam-history-item {
            background: #1E293B !important;
            border-color: #334155 !important;
        }

        .rr-eh-left {
            display: flex;
            flex-direction: column;
            gap: 1px;
        }

        .rr-eh-left strong {
            color: #1E293B;
            font-size: 0.82rem;
        }

        body.dark-mode .rr-eh-left strong {
            color: #F8FAFC !important;
        }

        .rr-eh-left span {
            color: #64748B;
            font-size: 0.74rem;
        }

        .rr-eh-score {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .eh-score-badge {
            font-weight: 800;
            color: #059669;
            background: #ECFDF5;
            padding: 2px 7px;
            border-radius: 6px;
            font-size: 0.80rem;
        }

        .eh-pct-badge {
            font-weight: 700;
            color: #4F46E5;
            background: #EEF2FF;
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 0.74rem;
        }
`;

// Insert style enhancements before </style>
html = html.replace('</style>', styleEnhancements + '\n    </style>');

// 3. Replace the 4 filter tabs with: আজ, এই সপ্তাহ, এই মাস, সর্বমোট
const newFiltersHtml = `
        <div class="rr-filters-row">
            <button type="button" class="rr-filter-tab active" onclick="switchTimeFilter(this, 'today')">আজ</button>
            <button type="button" class="rr-filter-tab" onclick="switchTimeFilter(this, 'week')">এই সপ্তাহ</button>
            <button type="button" class="rr-filter-tab" onclick="switchTimeFilter(this, 'month')">এই মাস</button>
            <button type="button" class="rr-filter-tab" onclick="switchTimeFilter(this, 'all')">সর্বমোট</button>
        </div>`;

html = html.replace(/<div class="rr-filters-row">[\s\S]*?<\/div>/, newFiltersHtml.trim());

// 4. Update the Leaderboard list to show College Names instead of Location
const newLeaderboardHtml = `
        <!-- Leaderboard List with College Names -->
        <div class="rr-ranking-list" id="rankingListContainer">
            <!-- Rank 1: Niloy -->
            <div class="rr-rank-card" onclick="openUserProfileModal('Niloy', 'HSC 2027', 'নটর ডেম কলেজ, ঢাকা', '২ ঘণ্টা ৩০ মিনিট', '৫ সেশন', '৪ ঘণ্টা ৩০ মিনিট', '৯ সেশন', 'niloy')">
                <div class="rr-rank-left">
                    <span class="rr-medal">🥇</span>
                    <div class="rr-user-avatar-wrap">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Niloy" class="rr-user-avatar">
                        <span class="live-indicator"></span>
                    </div>
                    <div class="rr-user-info">
                        <div class="rr-name-row">
                            <span class="rr-name-dot"></span> Niloy
                        </div>
                        <div class="rr-tags-row">
                            <span class="rr-tag-pill">HSC 2027</span>
                            <span class="rr-tag-pill">🏫 নটর ডেম কলেজ, ঢাকা</span>
                        </div>
                    </div>
                </div>
                <div class="rr-rank-time">
                    <span class="rr-time-val">২:৩০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 2: Psycho ♾️ -->
            <div class="rr-rank-card" onclick="openUserProfileModal('Psycho ♾️', 'HSC 2026', 'ঢাকা কলেজ, ঢাকা', '২ ঘণ্টা ৩০ মিনিট', '৫ সেশন', '৪ ঘণ্টা ১৫ মিনিট', '৮ সেশন', 'psycho')">
                <div class="rr-rank-left">
                    <span class="rr-medal">🥇</span>
                    <div class="rr-user-avatar-wrap">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80" alt="Psycho" class="rr-user-avatar">
                        <span class="live-indicator"></span>
                    </div>
                    <div class="rr-user-info">
                        <div class="rr-name-row">
                            <span class="rr-name-dot"></span> Psycho ♾️
                        </div>
                        <div class="rr-tags-row">
                            <span class="rr-tag-pill">HSC 2026</span>
                            <span class="rr-tag-pill">🏫 ঢাকা কলেজ, ঢাকা</span>
                        </div>
                    </div>
                </div>
                <div class="rr-rank-time">
                    <span class="rr-time-val">২:৩০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 3: Spider-man 🕸️ -->
            <div class="rr-rank-card" onclick="openUserProfileModal('Spider-man 🕸️', 'HSC 2026', 'রাজউক উত্তরা মডেল কলেজ', '২ ঘণ্টা ৩০ মিনিট', '৪ সেশন', '৩ ঘণ্টা ৫০ মিনিট', '৭ সেশন', 'spiderman')">
                <div class="rr-rank-left">
                    <span class="rr-medal">🥇</span>
                    <div class="rr-user-avatar-wrap">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" alt="Spider-man" class="rr-user-avatar">
                        <span class="live-indicator"></span>
                    </div>
                    <div class="rr-user-info">
                        <div class="rr-name-row">
                            <span class="rr-name-dot"></span> Spider-man 🕸️
                        </div>
                        <div class="rr-tags-row">
                            <span class="rr-tag-pill">HSC 2026</span>
                            <span class="rr-tag-pill">🏫 রাজউক উত্তরা মডেল কলেজ</span>
                        </div>
                    </div>
                </div>
                <div class="rr-rank-time">
                    <span class="rr-time-val">২:৩০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 4: Mow -->
            <div class="rr-rank-card" onclick="openUserProfileModal('Mow', 'HSC 2027', 'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ', '১:৫০ ঘণ্টা', '৩ সেশন', '২:৪০ ঘণ্টা', '৫ সেশন', 'mow')">
                <div class="rr-rank-left">
                    <span class="rr-medal" style="font-size: 1.1rem; color: #64748B; font-weight: 800;">৪</span>
                    <div class="rr-user-avatar-wrap">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="Mow" class="rr-user-avatar">
                        <span class="live-indicator"></span>
                    </div>
                    <div class="rr-user-info">
                        <div class="rr-name-row">
                            <span class="rr-name-dot"></span> Mow
                        </div>
                        <div class="rr-tags-row">
                            <span class="rr-tag-pill">HSC 2027</span>
                            <span class="rr-tag-pill">🏫 ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ</span>
                        </div>
                    </div>
                </div>
                <div class="rr-rank-time">
                    <span class="rr-time-val">১:৫০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 5: Safayet -->
            <div class="rr-rank-card" onclick="openUserProfileModal('Safayet', 'HSC 2026', 'চট্টগ্রাম কলেজ, চট্টগ্রাম', '১:৪০ ঘণ্টা', '২ সেশন', '৩:১০ ঘণ্টা', '৫ সেশন', 'safayet')">
                <div class="rr-rank-left">
                    <span class="rr-medal" style="font-size: 1.1rem; color: #64748B; font-weight: 800;">৫</span>
                    <div class="rr-user-avatar-wrap">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" alt="Safayet" class="rr-user-avatar">
                        <span class="live-indicator"></span>
                    </div>
                    <div class="rr-user-info">
                        <div class="rr-name-row">
                            <span class="rr-name-dot"></span> Safayet
                        </div>
                        <div class="rr-tags-row">
                            <span class="rr-tag-pill">HSC 2026</span>
                            <span class="rr-tag-pill">🏫 চট্টগ্রাম কলেজ, চট্টগ্রাম</span>
                        </div>
                    </div>
                </div>
                <div class="rr-rank-time">
                    <span class="rr-time-val">১:৪০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>
        </div>`;

html = html.replace(/<div class="rr-ranking-list" id="rankingListContainer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, newLeaderboardHtml);

// 5. Update User Profile Modal:
// Remove chicken badge, and add Exam History List above joined date!
const newModalContent = `
    <!-- USER PROFILE POPUP MODAL -->
    <div id="userProfileModal" class="rr-modal-overlay" onclick="if(event.target === this) closeUserProfileModal()">
        <div class="rr-modal-card">
            <!-- Scenic Pasture Banner (Clean Green Header without Chicken text) -->
            <div class="rr-farm-banner">
                <div class="rr-farm-hills"></div>
            </div>

            <div class="rr-modal-body">
                <!-- Avatar overlapping banner -->
                <div class="rr-modal-avatar-wrapper">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Avatar" class="rr-modal-avatar" id="modalUserAvatar">
                </div>

                <div class="rr-modal-header-row">
                    <h2 class="rr-modal-username" id="modalUserName">Niloy</h2>
                    <button type="button" class="rr-follow-btn" id="modalFollowBtn" onclick="toggleFollowUser(this)">
                        <i class="fa-solid fa-user-plus"></i> <span id="followBtnText">ফলো</span>
                    </button>
                </div>

                <div class="rr-modal-badges">
                    <span class="rr-tag-pill" id="modalUserBatch">📖 HSC 2027</span>
                    <span class="rr-tag-pill" id="modalUserCollege">🏫 নটর ডেম কলেজ, ঢাকা</span>
                </div>

                <!-- Stats Rows -->
                <div class="rr-stat-rows-container">
                    <div class="rr-stat-row">
                        <div class="rr-stat-row-label">
                            <span style="font-size: 1.1rem;">☀️</span> আজ
                        </div>
                        <div class="rr-stat-row-val">
                            <span id="modalStatTodayTime">২ ঘণ্টা ৩০ মিনিট</span> · <span id="modalStatTodaySessions">৫ সেশন</span>
                        </div>
                    </div>

                    <div class="rr-stat-row">
                        <div class="rr-stat-row-label">
                            <span style="font-size: 1.1rem;">📅</span> এই সপ্তাহ
                        </div>
                        <div class="rr-stat-row-val">
                            <span id="modalStatWeekTime">২ ঘণ্টা ৩০ মিনিট</span> · <span id="modalStatWeekSessions">৫ সেশন</span>
                        </div>
                    </div>

                    <div class="rr-stat-row">
                        <div class="rr-stat-row-label">
                            <span style="font-size: 1.1rem;">🏆</span> সর্বমোট পড়া
                        </div>
                        <div class="rr-stat-row-val">
                            <span id="modalStatTotalTime">২৪ ঘণ্টা ৩০ মিনিট</span> · <span id="modalStatTotalSessions">৪৯ সেশন</span>
                        </div>
                    </div>
                </div>

                <!-- ইউজার কতগুলো মডেল টেস্টে অংশগ্রহণ করেছে এবং কত পেয়েছে তার তালিকা -->
                <div class="rr-user-exam-history-card">
                    <div class="rr-exam-history-title">
                        <i class="fa-solid fa-stopwatch" style="color: #4F46E5;"></i>
                        <span>অংশগ্রহণকৃত মডেল টেস্ট ও পরীক্ষার ফলাফল</span>
                    </div>
                    <div class="rr-exam-history-list" id="modalUserExamList">
                        <!-- Dynamically populated -->
                    </div>
                </div>

                <div class="rr-joined-date">
                    যোগ দিয়েছে ৫ নভেম্বর ২০২৬
                </div>

                <button type="button" class="rr-btn-confirm" onclick="closeUserProfileModal()">
                    ঠিক আছে
                </button>
            </div>
        </div>
    </div>`;

html = html.replace(/<div id="userProfileModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newModalContent.trim());

// 6. Update JavaScript for Modal Exam History & Logged in Student sync
const modalExamScript = `
        // Sample student mock exam records
        const MOCK_EXAM_RECORDS = {
            niloy: [
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২৫ / ২৫', pct: '১০০%' },
                { title: 'Live Exam 02', sub: '১ম ও ২য় অধ্যায় লাইভ', score: '২৪ / ২৫', pct: '৯৬%' },
                { title: 'Model Test 04', sub: 'HTML ও ওয়েব ডিজাইন', score: '২৩ / ২৫', pct: '৯২%' }
            ],
            psycho: [
                { title: 'Live Exam 01', sub: '১ম অধ্যায় লাইভ স্পেশাল', score: '২৪ / ২৫', pct: '৯৬%' },
                { title: 'Model Test 03', sub: 'সংখ্যা পদ্ধতি ও ডিজিটাল লজিক', score: '২৩ / ২৫', pct: '৯২%' },
                { title: 'Model Test 02', sub: 'কমিউনিকেশন ও নেটওয়ার্কিং', score: '২২ / ২৫', pct: '৮৮%' }
            ],
            spiderman: [
                { title: 'Model Test 02', sub: 'কমিউনিকেশন ও নেটওয়ার্কিং', score: '২২ / ২৫', pct: '৮৮%' },
                { title: 'Live Exam 03', sub: 'সংখ্যা পদ্ধতি স্পেশাল লাইভ', score: '২১ / ২৫', pct: '৮৪%' }
            ],
            mow: [
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২১ / ২৫', pct: '৮৪%' },
                { title: 'Model Test 05', sub: 'সি প্রোগ্রামিং মডেল টেস্ট', score: '২০ / ২৫', pct: '৮০%' }
            ],
            safayet: [
                { title: 'Model Test 03', sub: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', score: '২০ / ২৫', pct: '৮০%' },
                { title: 'Live Exam 02', sub: '১ম ও ২য় অধ্যায় লাইভ', score: '১৯ / ২৫', pct: '৭৬%' }
            ]
        };

        // Modal Controls with Exam History
        function openUserProfileModal(name, batch, college, todayTime, todaySessions, yestTime, yestSessions, userKey = '') {
            document.getElementById('modalUserName').innerText = name;
            document.getElementById('modalUserBatch').innerText = '📖 ' + (batch || 'HSC 2026');
            document.getElementById('modalUserCollege').innerText = '🏫 ' + (college || 'শীর্ষ কলেজ');
            document.getElementById('modalStatTodayTime').innerText = todayTime || '২ ঘণ্টা ৩০ মিনিট';
            document.getElementById('modalStatTodaySessions').innerText = todaySessions || '৫ সেশন';
            if (document.getElementById('modalStatWeekTime')) {
                document.getElementById('modalStatWeekTime').innerText = yestTime || '৬ ঘণ্টা ৩০ মিনিট';
            }

            // Populate exam history
            const listEl = document.getElementById('modalUserExamList');
            if (listEl) {
                listEl.innerHTML = '';
                
                // If it's the current logged in student
                let exams = [];
                if (userKey === 'me') {
                    try {
                        const submitted = JSON.parse(localStorage.getItem('ict_submitted_live_exams') || '{}');
                        const keys = Object.keys(submitted);
                        if (keys.length > 0) {
                            exams = keys.map(k => {
                                const it = submitted[k];
                                const score = it.correctCount || it.score || 0;
                                const total = it.total || 25;
                                const pct = it.scorePercentage || Math.round((score / total) * 100);
                                return {
                                    title: it.examTitle || ('Model Test ' + k),
                                    sub: 'সম্পন্ন মডেল টেস্ট',
                                    score: toBnDigits(score) + ' / ' + toBnDigits(total),
                                    pct: toBnDigits(pct) + '%'
                                };
                            });
                        }
                    } catch(e){}
                }

                if (exams.length === 0 && MOCK_EXAM_RECORDS[userKey]) {
                    exams = MOCK_EXAM_RECORDS[userKey];
                }

                if (exams.length === 0) {
                    // Default high score samples
                    exams = [
                        { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২৩ / ২৫', pct: '৯২%' },
                        { title: 'Live Exam 02', sub: '১ম ও ২য় অধ্যায়', score: '২০ / ২৫', pct: '৮০%' }
                    ];
                }

                exams.forEach(ex => {
                    const row = document.createElement('div');
                    row.className = 'rr-exam-history-item';
                    row.innerHTML = \`
                        <div class="rr-eh-left">
                            <strong>\${ex.title}</strong>
                            <span>\${ex.sub}</span>
                        </div>
                        <div class="rr-eh-score">
                            <span class="eh-score-badge">\${ex.score}</span>
                            <span class="eh-pct-badge">\${ex.pct}</span>
                        </div>
                    \`;
                    listEl.appendChild(row);
                });
            }
            
            document.getElementById('userProfileModal').style.display = 'flex';
        }

        // Sync logged-in student info to top bar and active profile
        function syncLoggedInStudentReadingRoom() {
            try {
                let profile = null;
                const raw = localStorage.getItem('ict_student_profile');
                if (raw) profile = JSON.parse(raw);
                if (profile && profile.name) {
                    const avatar = profile.avatar || profile.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';
                    const myAvatarEl = document.getElementById('myHeaderAvatar');
                    if (myAvatarEl) myAvatarEl.src = avatar;

                    const siteAv = document.getElementById('siteHeaderAvatar');
                    if (siteAv) siteAv.src = avatar;

                    const siteName = document.getElementById('siteHeaderUserName');
                    if (siteName) siteName.textContent = profile.name;

                    // Update user position text with college
                    const colName = profile.college || profile.institute || 'ঢাকা কলেজ';
                    const batch = profile.hscBatch || 'HSC 2026';
                    
                    const posEl = document.querySelector('.rr-position-text');
                    if (posEl) {
                        posEl.innerHTML = \`<span style="color:#059669; font-weight:700;">\${profile.name} (\${batch})</span> · \${colName}\`;
                    }
                }
            } catch(e){}
        }
        document.addEventListener('DOMContentLoaded', syncLoggedInStudentReadingRoom);
        setTimeout(syncLoggedInStudentReadingRoom, 100);
`;

html = html.replace(/function openUserProfileModal\s*\([\s\S]*?function closeUserProfileModal/, modalExamScript + '\n        function closeUserProfileModal');

fs.writeFileSync(rrPath, html, 'utf8');
console.log('✓ Successfully patched pages/reading-room.html with:');
console.log('  - Developer image in footer');
console.log('  - Reduced hero banner height');
console.log('  - 4 filter tabs: আজ, এই সপ্তাহ, এই মাস, সর্বমোট (nowrap)');
console.log('  - College names under all students');
console.log('  - Removed 5 chickens badge');
console.log('  - Participated Model Tests and scores list in profile modal');
