const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
console.log('--- STARTING READING ROOM FULL PAGE VIEW, MEDALS, AND ADMIN DROPDOWN FIXES ---');

// =========================================================================
// 1. UPDATE pages/reading-room.html
// =========================================================================
const rrPath = path.join(root, 'pages', 'reading-room.html');
let rrHtml = fs.readFileSync(rrPath, 'utf8');

// Medals and Detail View CSS
const extraReadingRoomCss = `
        /* Medal and Rank styling */
        .rr-medal-box {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            font-size: 1.05rem;
            font-weight: 800;
            min-width: 38px;
            flex-shrink: 0;
        }
        .rr-medal-box.gold { color: #D97706; }
        .rr-medal-box.silver { color: #64748B; }
        .rr-medal-box.bronze { color: #B45309; }

        .rr-rank-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: #F1F5F9;
            color: #64748B;
            font-size: 0.92rem;
            font-weight: 800;
            min-width: 26px;
            flex-shrink: 0;
        }

        body.dark-mode .rr-rank-num {
            background: #334155;
            color: #CBD5E1;
        }

        /* User Detail View (Full Page View with Header & Footer) */
        #reading-room-user-detail-view {
            padding: 16px 20px 40px 20px;
            box-sizing: border-box;
            width: 100%;
        }

        @media (max-width: 640px) {
            #reading-room-user-detail-view {
                padding: 12px 14px 40px 14px;
            }
        }

        .rr-detail-back-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .rr-detail-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 9999px;
            background: #F1F5F9;
            color: #1E293B;
            font-size: 0.88rem;
            font-weight: 700;
            border: 1px solid #E2E8F0;
            cursor: pointer;
            transition: all 0.2s;
        }

        .rr-detail-back-btn:hover {
            background: #E2E8F0;
            color: #0F172A;
        }

        body.dark-mode .rr-detail-back-btn {
            background: #334155;
            border-color: #475569;
            color: #F8FAFC;
        }

        .rr-detail-user-card {
            background: linear-gradient(135deg, #15803D 0%, #16A34A 100%);
            border-radius: 20px;
            padding: 24px 20px;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            gap: 18px;
            margin-bottom: 20px;
            box-shadow: 0 8px 24px rgba(22, 163, 74, 0.22);
            flex-wrap: wrap;
        }

        .rr-detail-avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 3.5px solid #FFFFFF;
            object-fit: cover;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            flex-shrink: 0;
        }

        .rr-detail-info {
            flex: 1;
            min-width: 200px;
        }

        .rr-detail-info h2 {
            font-size: 1.45rem;
            font-weight: 800;
            margin: 0 0 6px 0;
            color: #FFFFFF;
        }

        .rr-detail-badges {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .rr-detail-pill {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(255, 255, 255, 0.22);
            border: 1px solid rgba(255, 255, 255, 0.35);
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.82rem;
            font-weight: 600;
            color: #FFFFFF;
            backdrop-filter: blur(4px);
        }

        /* 4 Stat Cards Grid: আজ, এই সপ্তাহ, এই মাস, সর্বমোট পড়া */
        .rr-detail-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }

        @media (max-width: 768px) {
            .rr-detail-stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
        }

        .rr-stat-box {
            background: #FFFFFF;
            border: 1.5px solid #E2E8F0;
            border-radius: 16px;
            padding: 14px 12px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        body.dark-mode .rr-stat-box {
            background: #1E293B;
            border-color: #334155;
        }

        .rr-stat-box-title {
            font-size: 0.82rem;
            font-weight: 700;
            color: #64748B;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        body.dark-mode .rr-stat-box-title {
            color: #94A3B8;
        }

        .rr-stat-box-val {
            font-size: 1.15rem;
            font-weight: 800;
            color: #1E293B;
            line-height: 1.2;
        }

        body.dark-mode .rr-stat-box-val {
            color: #F8FAFC;
        }

        .rr-stat-box-sub {
            font-size: 0.74rem;
            font-weight: 600;
            color: #059669;
        }

        /* Participated Model Tests Section (Full Page Scroll, NO inner scroll) */
        .rr-exam-section-card {
            background: #FFFFFF;
            border: 1.5px solid #E2E8F0;
            border-radius: 18px;
            padding: 18px 20px;
            margin-bottom: 24px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.03);
        }

        body.dark-mode .rr-exam-section-card {
            background: #1E293B;
            border-color: #334155;
        }

        .rr-section-heading {
            font-size: 1.05rem;
            font-weight: 800;
            color: #1E293B;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
            border-bottom: 1.5px solid #F1F5F9;
            padding-bottom: 12px;
        }

        body.dark-mode .rr-section-heading {
            color: #F8FAFC;
            border-color: #334155;
        }

        .rr-exam-full-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .rr-exam-full-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            transition: all 0.2s;
            gap: 12px;
        }

        .rr-exam-full-item:hover {
            border-color: #93C5FD;
            background: #EFF6FF;
        }

        body.dark-mode .rr-exam-full-item {
            background: #0F172A;
            border-color: #334155;
        }

        body.dark-mode .rr-exam-full-item:hover {
            background: #172554;
            border-color: #2563EB;
        }

        .rr-efi-left {
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
        }

        .rr-efi-title {
            font-size: 0.95rem;
            font-weight: 800;
            color: #1E293B;
            margin: 0;
        }

        body.dark-mode .rr-efi-title {
            color: #F8FAFC;
        }

        .rr-efi-sub {
            font-size: 0.80rem;
            color: #64748B;
        }

        body.dark-mode .rr-efi-sub {
            color: #94A3B8;
        }

        .rr-efi-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }

        .rr-efi-score {
            font-size: 0.95rem;
            font-weight: 800;
            color: #059669;
            background: #ECFDF5;
            padding: 4px 10px;
            border-radius: 8px;
            border: 1px solid #A7F3D0;
        }

        body.dark-mode .rr-efi-score {
            background: #064E3B;
            border-color: #059669;
            color: #34D399;
        }

        .rr-efi-pct {
            font-size: 0.80rem;
            font-weight: 700;
            color: #4F46E5;
            background: #EEF2FF;
            padding: 4px 8px;
            border-radius: 8px;
        }

        body.dark-mode .rr-efi-pct {
            background: #312E81;
            color: #A5B4FC;
        }
`;

if (!rrHtml.includes('.rr-detail-user-card')) {
    rrHtml = rrHtml.replace('</style>', extraReadingRoomCss + '\n    </style>');
}

// 2. Update Leaderboard List in reading-room.html with:
// - Strictly descending study times
// - 🥇 ১, 🥈 ২, 🥉 ৩ on first 3 cards, and ৪, ৫ with NO medal on 4th & 5th!
const newStrictLeaderboardHtml = `
        <!-- Leaderboard List sorted strictly by Study Time (Highest to Lowest) -->
        <div class="rr-ranking-list" id="rankingListContainer">
            <!-- Rank 1: Niloy (৩ ঘণ্টা ৪০ মিনিট) -->
            <div class="rr-rank-card" onclick="showUserDetailView('Niloy', 'HSC 2027', 'নটর ডেম কলেজ, ঢাকা', '৩ ঘণ্টা ৪০ মিনিট', '৫ সেশন', '১৮ ঘণ্টা ২০ মিনিট', '৬৪ ঘণ্টা ৫০ মিনিট', '১৪২ ঘণ্টা ৩০ মিনিট', '১৮৯ সেশন', 'niloy')">
                <div class="rr-rank-left">
                    <div class="rr-medal-box gold" title="১ম স্থান">🥇 ১</div>
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
                    <span class="rr-time-val">৩:৪০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 2: Psycho ♾️ (৩ ঘণ্টা ১৫ মিনিট) -->
            <div class="rr-rank-card" onclick="showUserDetailView('Psycho ♾️', 'HSC 2026', 'ঢাকা কলেজ, ঢাকা', '৩ ঘণ্টা ১৫ মিনিট', '৫ সেশন', '১৬ ঘণ্টা ১০ মিনিট', '৫৮ ঘণ্টা ৩০ মিনিট', '১২৯ ঘণ্টা ১৫ মিনিট', '১৭৪ সেশন', 'psycho')">
                <div class="rr-rank-left">
                    <div class="rr-medal-box silver" title="২য় স্থান">🥈 ২</div>
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
                    <span class="rr-time-val">৩:১৫</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 3: Spider-man 🕸️ (২ ঘণ্টা ৫০ মিনিট) -->
            <div class="rr-rank-card" onclick="showUserDetailView('Spider-man 🕸️', 'HSC 2026', 'রাজউক উত্তরা মডেল কলেজ', '২ ঘণ্টা ৫০ মিনিট', '৪ সেশন', '১৪ ঘণ্টা ২০ মিনিট', '৫২ ঘণ্টা ১০ মিনিট', '১১৮ ঘণ্টা ৪০ মিনিট', '১৫৬ সেশন', 'spiderman')">
                <div class="rr-rank-left">
                    <div class="rr-medal-box bronze" title="৩য় স্থান">🥉 ৩</div>
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
                    <span class="rr-time-val">২:৫০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 4: Mow (২ ঘণ্টা ১০ মিনিট - NO medal, just number 4) -->
            <div class="rr-rank-card" onclick="showUserDetailView('Mow', 'HSC 2027', 'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ', '২ ঘণ্টা ১০ মিনিট', '৩ সেশন', '১২ ঘণ্টা ৪০ মিনিট', '৪৫ ঘণ্টা ২০ মিনিট', '৯৮ ঘণ্টা ৫০ মিনিট', '১৩২ সেশন', 'mow')">
                <div class="rr-rank-left">
                    <div class="rr-rank-num">৪</div>
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
                    <span class="rr-time-val">২:১০</span>
                    <span class="rr-time-unit">ঘণ্টা</span>
                </div>
            </div>

            <!-- Rank 5: Safayet (১ ঘণ্টা ৪০ মিনিট - NO medal, just number 5) -->
            <div class="rr-rank-card" onclick="showUserDetailView('Safayet', 'HSC 2026', 'চট্টগ্রাম কলেজ, চট্টগ্রাম', '১ ঘণ্টা ৪০ মিনিট', '২ সেশন', '১০ ঘণ্টা ৩০ মিনিট', '৩৮ ঘণ্টা ৫০ মিনিট', '৮৪ ঘণ্টা ১০ মিনিট', '১১৪ সেশন', 'safayet')">
                <div class="rr-rank-left">
                    <div class="rr-rank-num">৫</div>
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

rrHtml = rrHtml.replace(/<div class="rr-ranking-list" id="rankingListContainer">[\s\S]*?<\/div>\s*<\/div>/, newStrictLeaderboardHtml);

// 3. Wrap reading-room-app contents in #reading-room-main-view, and add #reading-room-user-detail-view
// Find opening of reading-room-app
if (!rrHtml.includes('id="reading-room-main-view"')) {
    rrHtml = rrHtml.replace(
        '<div class="reading-room-app">',
        '<div class="reading-room-app">\n    <div id="reading-room-main-view">'
    );

    // Create the full page detail view HTML
    const userDetailViewHtml = `
    </div><!-- End reading-room-main-view -->

    <!-- =========================================================================
         FULL PAGE STUDENT PROFILE VIEW (With Site Header, Footer & Natural Page Scroll)
         ========================================================================= -->
    <div id="reading-room-user-detail-view" style="display: none;">
        <!-- Top Back Navigation -->
        <div class="rr-detail-back-bar">
            <button type="button" class="rr-detail-back-btn" onclick="hideUserDetailView()">
                <i class="fa-solid fa-arrow-left"></i>
                <span>লিডারবোর্ডে ফিরে যান</span>
            </button>
            <span style="font-size: 0.82rem; font-weight: 700; color: #16A34A;">
                <i class="fa-solid fa-circle-check"></i> ভেরিফাইড প্রোফাইল
            </span>
        </div>

        <!-- Student Hero Card -->
        <div class="rr-detail-user-card">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Avatar" class="rr-detail-avatar" id="detailUserAvatar">
            <div class="rr-detail-info">
                <h2 id="detailUserName">Niloy</h2>
                <div class="rr-detail-badges">
                    <span class="rr-detail-pill" id="detailUserBatch"><i class="fa-solid fa-graduation-cap"></i> HSC 2027</span>
                    <span class="rr-detail-pill" id="detailUserCollege"><i class="fa-solid fa-building-columns"></i> নটর ডেম কলেজ, ঢাকা</span>
                </div>
            </div>
        </div>

        <!-- ৪টি স্ট্যাট কার্ড: আজ, এই সপ্তাহ, এই মাস, সর্বমোট পড়া -->
        <div class="rr-detail-stats-grid">
            <div class="rr-stat-box">
                <span class="rr-stat-box-title">☀️ আজ</span>
                <span class="rr-stat-box-val" id="detailStatToday">৩ ঘণ্টা ৪০ মিনিট</span>
                <span class="rr-stat-box-sub" id="detailStatTodaySessions">৫টি সেশন</span>
            </div>
            <div class="rr-stat-box">
                <span class="rr-stat-box-title">📅 এই সপ্তাহ</span>
                <span class="rr-stat-box-val" id="detailStatWeek">১৮ ঘণ্টা ২০ মিনিট</span>
                <span class="rr-stat-box-sub">সাপ্তাহিক রুটিন</span>
            </div>
            <div class="rr-stat-box">
                <span class="rr-stat-box-title">🗓️ এই মাস</span>
                <span class="rr-stat-box-val" id="detailStatMonth">৬৪ ঘণ্টা ৫০ মিনিট</span>
                <span class="rr-stat-box-sub">মাসিক অগ্রগতি</span>
            </div>
            <div class="rr-stat-box">
                <span class="rr-stat-box-title">🏆 সর্বমোট পড়া</span>
                <span class="rr-stat-box-val" id="detailStatTotal">১৪২ ঘণ্টা ৩০ মিনিট</span>
                <span class="rr-stat-box-sub" id="detailStatTotalSessions">১৮৯ সেশন</span>
            </div>
        </div>

        <!-- অংশগ্রহণকৃত সকল মডেল টেস্ট ও ফলাফল (সম্পূর্ণ পেজ স্ক্রল হবে) -->
        <div class="rr-exam-section-card">
            <div class="rr-section-heading">
                <div>
                    <i class="fa-solid fa-stopwatch" style="color: #4F46E5; margin-right: 6px;"></i>
                    <span>অংশগ্রহণকৃত মডেল টেস্ট ও পরীক্ষার ফলাফল</span>
                </div>
                <span class="badge badge-primary" id="detailExamTotalBadge" style="font-size: 0.78rem;">৬টি সম্পন্ন</span>
            </div>

            <!-- Full list of exams (Natural page scroll) -->
            <div class="rr-exam-full-list" id="detailExamFullList">
                <!-- Dynamically populated -->
            </div>
        </div>

        <!-- Joined Date -->
        <div style="text-align: center; color: #64748B; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px;">
            <i class="fa-regular fa-calendar-check" style="margin-right: 6px; color: #16A34A;"></i>
            ICT Easy Learning এ যোগ দিয়েছে: ৫ নভেম্বর ২০২৬
        </div>

        <!-- Bottom Return Button -->
        <div style="text-align: center;">
            <button type="button" class="btn btn-secondary" onclick="hideUserDetailView()" style="border-radius: 9999px; padding: 10px 24px; font-weight: 700;">
                <i class="fa-solid fa-arrow-left"></i> লিডারবোর্ডে ফিরে যান
            </button>
        </div>
    </div>
    `;

    // Replace the old userProfileModal with userDetailViewHtml
    rrHtml = rrHtml.replace(
        /<div id="userProfileModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
        userDetailViewHtml
    );
}

// 4. Update JS functions for Full Page Detail View
const detailViewJs = `
        // Mock detailed model test records for each student
        const DETAILED_STUDENT_EXAMS = {
            niloy: [
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২৫ / ২৫', pct: '১০০%' },
                { title: 'Live Exam 02', sub: '১ম ও ২য় অধ্যায় লাইভ স্পেশাল', score: '২৪ / ২৫', pct: '৯৬%' },
                { title: 'Model Test 04', sub: 'HTML ও ওয়েব ডিজাইন পরিচিতি', score: '২৪ / ২৫', pct: '৯৬%' },
                { title: 'Model Test 03', sub: 'সংখ্যা পদ্ধতি ও ডিজিটাল লজিক', score: '২৩ / ২৫', pct: '৯২%' },
                { title: 'Model Test 05', sub: 'সি প্রোগ্রামিং ল্যাঙ্গুয়েজ মডেল টেস্ট', score: '২২ / ২৫', pct: '৮৮%' },
                { title: 'Live Exam 01', sub: 'তথ্য ও যোগাযোগ প্রযুক্তি লাইভ', score: '২৫ / ২৫', pct: '১০০%' }
            ],
            psycho: [
                { title: 'Live Exam 01', sub: 'তথ্য ও যোগাযোগ প্রযুক্তি লাইভ', score: '২৪ / ২৫', pct: '৯৬%' },
                { title: 'Model Test 03', sub: 'সংখ্যা পদ্ধতি ও ডিজিটাল লজিক', score: '২৩ / ২৫', pct: '৯২%' },
                { title: 'Model Test 02', sub: 'কমিউনিকেশন ও নেটওয়ার্কিং', score: '২২ / ২৫', pct: '৮৮%' },
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২১ / ২৫', pct: '৮৪%' },
                { title: 'Model Test 06', sub: 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম', score: '২৩ / ২৫', pct: '৯২%' }
            ],
            spiderman: [
                { title: 'Model Test 02', sub: 'কমিউনিকেশন ও নেটওয়ার্কিং', score: '২২ / ২৫', pct: '৮৮%' },
                { title: 'Live Exam 03', sub: 'সংখ্যা পদ্ধতি স্পেশাল লাইভ', score: '২১ / ২৫', pct: '৮৪%' },
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২০ / ২৫', pct: '৮০%' },
                { title: 'Model Test 04', sub: 'HTML ও সিএসএস ওয়েব পাবলিশিং', score: '১৯ / ২৫', pct: '৭৬%' }
            ],
            mow: [
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২১ / ২৫', pct: '৮৪%' },
                { title: 'Model Test 05', sub: 'সি প্রোগ্রামিং মডেল টেস্ট', score: '২০ / ২৫', pct: '৮০%' },
                { title: 'Live Exam 02', sub: 'কমিউনিকেশন সিস্টেমস লাইভ', score: '১৯ / ২৫', pct: '৭৬%' }
            ],
            safayet: [
                { title: 'Model Test 03', sub: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', score: '২০ / ২৫', pct: '৮০%' },
                { title: 'Live Exam 02', sub: '১ম ও ২য় অধ্যায় লাইভ', score: '১৯ / ২৫', pct: '৭৬%' },
                { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '১৮ / ২৫', pct: '৭২%' }
            ]
        };

        // Full Page Detail View Controls (No modal, whole page scrolls naturally!)
        function showUserDetailView(name, batch, college, todayTime, todaySessions, weekTime, monthTime, totalTime, totalSessions, userKey = '') {
            document.getElementById('reading-room-main-view').style.display = 'none';
            const detailView = document.getElementById('reading-room-user-detail-view');
            detailView.style.display = 'block';

            // Populate User Info
            document.getElementById('detailUserName').innerText = name;
            document.getElementById('detailUserBatch').innerHTML = '<i class="fa-solid fa-graduation-cap"></i> ' + (batch || 'HSC 2026');
            document.getElementById('detailUserCollege').innerHTML = '<i class="fa-solid fa-building-columns"></i> ' + (college || 'শীর্ষ কলেজ');

            // Set Avatar
            const avatarMap = {
                niloy: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                psycho: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
                spiderman: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                mow: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                safayet: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
            };
            const avImg = document.getElementById('detailUserAvatar');
            if (avImg) avImg.src = avatarMap[userKey] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

            // Set 4 Stats: আজ, এই সপ্তাহ, এই মাস, সর্বমোট পড়া
            document.getElementById('detailStatToday').innerText = todayTime || '৩ ঘণ্টা ৪০ মিনিট';
            document.getElementById('detailStatTodaySessions').innerText = todaySessions || '৫টি সেশন';
            document.getElementById('detailStatWeek').innerText = weekTime || '১৮ ঘণ্টা ২০ মিনিট';
            document.getElementById('detailStatMonth').innerText = monthTime || '৬৪ ঘণ্টা ৫০ মিনিট';
            document.getElementById('detailStatTotal').innerText = totalTime || '১৪২ ঘণ্টা ৩০ মিনিট';
            document.getElementById('detailStatTotalSessions').innerText = totalSessions || '১৮৯ সেশন';

            // Populate all participated model tests (no inner scroll, full page scroll)
            const listEl = document.getElementById('detailExamFullList');
            const badgeEl = document.getElementById('detailExamTotalBadge');
            if (listEl) {
                listEl.innerHTML = '';
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

                if (exams.length === 0 && DETAILED_STUDENT_EXAMS[userKey]) {
                    exams = DETAILED_STUDENT_EXAMS[userKey];
                }

                if (exams.length === 0) {
                    exams = [
                        { title: 'Model Test 01', sub: 'পূর্ণাঙ্গ সিলেবাস (MCQ)', score: '২৩ / ২৫', pct: '৯২%' },
                        { title: 'Live Exam 02', sub: '১ম ও ২য় অধ্যায় লাইভ', score: '২০ / ২৫', pct: '৮০%' }
                    ];
                }

                if (badgeEl) badgeEl.innerText = toBnDigits(exams.length) + 'টি সম্পন্ন';

                exams.forEach(ex => {
                    const item = document.createElement('div');
                    item.className = 'rr-exam-full-item';
                    item.innerHTML = \`
                        <div class="rr-efi-left">
                            <h4 class="rr-efi-title">\${ex.title}</h4>
                            <span class="rr-efi-sub">\${ex.sub}</span>
                        </div>
                        <div class="rr-efi-right">
                            <span class="rr-efi-score"><i class="fa-solid fa-circle-check"></i> \${ex.score}</span>
                            <span class="rr-efi-pct">\${ex.pct}</span>
                        </div>
                    \`;
                    listEl.appendChild(item);
                });
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function hideUserDetailView() {
            document.getElementById('reading-room-user-detail-view').style.display = 'none';
            document.getElementById('reading-room-main-view').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
`;

rrHtml = rrHtml.replace(
    /const MOCK_EXAM_RECORDS =[\s\S]*?function closeUserProfileModal\(\) \{[\s\S]*?\}/,
    detailViewJs
);

fs.writeFileSync(rrPath, rrHtml, 'utf8');
console.log('✓ Successfully updated pages/reading-room.html with:');
console.log('  - Strictly descending study times');
console.log('  - Medals only on first 3: 🥇 ১, 🥈 ২, 🥉 ৩ and number only on 4th & 5th: ৪, ৫');
console.log('  - Full Page Student Detail View with Site Header & Footer');
console.log('  - 4 Stat Cards: আজ, এই সপ্তাহ, এই মাস, সর্বমোট পড়া');
console.log('  - Full participated Model Tests list (Whole page scrolls, no inner scroll)');

// =========================================================================
// 2. UPDATE admin.html: CHAPTER MULTI-SELECT AS DROPDOWN BOX
// =========================================================================
const adminPath = path.join(root, 'admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

const chapterDropdownHtml = `
          <!-- অধ্যায় ড্রপডাউন বক্স (মাল্টিপল সিলেক্ট) -->
          <div class="form-group" style="margin-bottom: 0.85rem;">
            <label style="font-size: 0.88rem; font-weight: 700; color: #1E293B; display: flex; align-items: center; justify-content: space-between;">
              <span>📚 অধ্যায় নির্বাচন (মাল্টিপল সিলেক্ট ড্রপডাউন):<span class="required">*</span></span>
              <span style="font-size: 0.78rem; font-weight: normal; color: #64748B;">ক্লিক করে ড্রপডাউন খুলুন</span>
            </label>
            <div class="multiselect-wrapper" id="leChapterDropdownWrapper">
              <div class="multiselect-trigger" onclick="toggleMultiSelectDropdown('leChapterDropdownWrapper')">
                <span id="leChapterTriggerText">পূর্ণাঙ্গ সিলেবাস (৭টি অধ্যায়)</span>
                <span class="chevron-icon">▼</span>
              </div>
              <div class="multiselect-menu" id="leChapterMenu">
                <input type="text" placeholder="🔍 অধ্যায় খুঁজুন..." class="multiselect-search-input" oninput="filterMultiSelectMenu(this)">
                <div class="multiselect-menu-actions">
                  <span>অধ্যায় নির্বাচন</span>
                  <div>
                    <a href="javascript:void(0)" onclick="selectAllLiveExamChapters()">সব</a> | 
                    <a href="javascript:void(0)" class="clear-link" onclick="clearLiveExamChapters()">মুছুন</a>
                  </div>
                </div>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="1" checked onchange="syncSelectedLiveExamChapters()"><span>১ম অধ্যায়: তথ্য ও যোগাযোগ প্রযুক্তি (বিশ্ব ও বাংলাদেশ)</span></label>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="2" checked onchange="syncSelectedLiveExamChapters()"><span>২য় অধ্যায়: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং</span></label>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="3.1" checked onchange="syncSelectedLiveExamChapters()"><span>৩য় অধ্যায় (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)</span></label>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="3.2" checked onchange="syncSelectedLiveExamChapters()"><span>৩য় অধ্যায় (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট</span></label>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="4" checked onchange="syncSelectedLiveExamChapters()"><span>৪র্থ অধ্যায়: ওয়েব ডিজাইন পরিচিতি এবং HTML</span></label>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="5" checked onchange="syncSelectedLiveExamChapters()"><span>৫ম অধ্যায়: প্রোগ্রামিং ভাষা (C Programming)</span></label>
                <label class="multiselect-item"><input type="checkbox" name="leChapterChoice" value="6" checked onchange="syncSelectedLiveExamChapters()"><span>৬ষ্ঠ অধ্যায়: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)</span></label>
              </div>
            </div>

            <!-- অধ্যায় / সিলেবাসের নাম টেক্সট (অটোমেটিক ফিল্ড হবে) -->
            <div style="margin-top: 6px;">
              <input type="text" id="leChapters" placeholder="e.g. ১ম ও ২য় অধ্যায়" required style="font-weight: 700; background: #F8FAFC;">
            </div>

            <!-- ২৫টি MCQ অটোমেটিক সিংক অপশন -->
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #CBD5E1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.86rem; font-weight: 700; color: #059669;">
                <input type="checkbox" id="leAutoSyncMCQ" checked style="width: 18px; height: 18px; cursor: pointer;">
                <span>⚡ ড্রপডাউনে নির্বাচিত অধ্যায়গুলো থেকে অটোমেটিক ২৫টি MCQ সিংক করুন</span>
              </label>
              <button type="button" class="btn btn-secondary btn-sm" onclick="previewAndSyncLiveExamMCQs()" style="font-size: 0.78rem; padding: 4px 12px; background: #ECFDF5; border: 1.5px solid #10B981; color: #047857; font-weight: 700; border-radius: 6px;">
                🔄 এখনই ২৫টি MCQ সিংক করুন
              </button>
            </div>
            <div id="leSyncStatusNotice" style="font-size: 0.82rem; color: #059669; font-weight: 700; margin-top: 6px; display: none;"></div>
          </div>`;

// Replace the previous chapter panel in admin.html with chapterDropdownHtml
adminHtml = adminHtml.replace(
    /<!-- অধ্যায় মাল্টিপল সিলেকশন প্যানেল -->[\s\S]*?<\/div>\s*<\/div>/,
    chapterDropdownHtml.trim()
);

// Update syncSelectedLiveExamChapters in admin.html so it also updates leChapterTriggerText
const updatedSyncSelectedLiveExamChapters = `
    function syncSelectedLiveExamChapters() {
      const checked = Array.from(document.querySelectorAll('input[name="leChapterChoice"]:checked')).map(cb => cb.value);
      const input = document.getElementById('leChapters');
      const trigger = document.getElementById('leChapterTriggerText');

      if (checked.length === 0) {
        if (input) input.value = '';
        if (trigger) trigger.textContent = '-- কোনো অধ্যায় নির্বাচন করা হয়নি --';
      } else if (checked.length === 7) {
        if (input) input.value = 'পূর্ণাঙ্গ সিলেবাস (১ম-৬ষ্ঠ অধ্যায়)';
        if (trigger) trigger.textContent = 'পূর্ণাঙ্গ সিলেবাস (৭টি অধ্যায়)';
      } else {
        const labels = checked.map(k => CHAPTER_NAME_MAP[k] || (k + ' অধ্যায়'));
        let textVal = '';
        if (labels.length === 1) {
          textVal = labels[0];
        } else if (labels.length === 2) {
          textVal = labels[0] + ' ও ' + labels[1];
        } else {
          const last = labels.pop();
          textVal = labels.join(', ') + ' ও ' + last;
        }
        if (input) input.value = textVal;
        if (trigger) trigger.textContent = checked.length + 'টি অধ্যায় নির্বাচিত (' + textVal + ')';
      }
    }
`;

adminHtml = adminHtml.replace(
    /function syncSelectedLiveExamChapters\(\)\s*\{[\s\S]*?\n    \}/,
    updatedSyncSelectedLiveExamChapters.trim()
);

fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log('✓ Successfully updated admin.html: Multiple Chapter Selection is now a clean Dropdown Box!');
