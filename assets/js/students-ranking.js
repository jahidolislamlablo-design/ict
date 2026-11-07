/**
 * STUDENTS RANKING CONTROLLER (students-ranking.js)
 * ICT Easy Learning
 */

let allStudentsData = [];
let currentLoggedInUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadRankingsData();

    // সার্চ ইভেন্ট লিসেনার
    const searchInput = document.getElementById('rankingSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterRankings(e.target.value);
        });
    }
});

async function loadRankingsData() {
    const listContainer = document.getElementById('rankingListContainer');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; margin-bottom: 12px; color: var(--primary);"></i>
                <p>শিক্ষার্থীদের র‍্যাংকিং তালিকা লোড হচ্ছে...</p>
            </div>
        `;
    }

    try {
        let res = null;
        if (window.ApiService && typeof ApiService.getRankings === 'function') {
            res = await ApiService.getRankings();
        }

        if (res && res.success && Array.isArray(res.data)) {
            allStudentsData = res.data;
            currentLoggedInUser = res.currentUser || null;
        } else {
            // Fallback to static fetch
            const staticRes = await fetch('../database/students.json');
            if (staticRes.ok) {
                const list = await staticRes.json();
                list.sort((a, b) => (b.points || 0) - (a.points || 0));
                allStudentsData = list.map((s, idx) => ({ ...s, position: idx + 1 }));
                currentLoggedInUser = allStudentsData.find(s => s.isCurrentUser) || allStudentsData[0];
            }
        }

        // টপে "আপনার প্রোফাইল" কার্ড ফিক্সড রেন্ডার
        renderCurrentUserProfileCard(currentLoggedInUser);

        // শীর্ষ ৩ জনের পোডিয়াম ও সম্পূর্ণ র‍্যাংকিং
        renderPodium(allStudentsData.slice(0, 3));
        renderRankingList(allStudentsData);

    } catch (err) {
        console.error('Failed to load rankings:', err);
        if (listContainer) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.8rem; margin-bottom: 12px;"></i>
                    <p>র‍্যাংকিং তালিকা লোড করতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।</p>
                </div>
            `;
        }
    }
}

// ১. টপে "আপনার প্রোফাইল" ফিক্সড কার্ড রেন্ডার
function renderCurrentUserProfileCard(user) {
    const card = document.getElementById('currentUserProfileCard');
    if (!card) return;

    if (!user) {
        card.style.display = 'none';
        return;
    }

    const toBn = (n) => (window.toBanglaNum ? window.toBanglaNum(n) : n);

    card.style.display = 'flex';
    card.innerHTML = `
        <div class="user-top-info-group">
            <div class="user-top-avatar-box">
                <img src="${resolveAvatar(user.avatar)}" alt="${escapeHtml(user.name)}" class="user-top-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'">
                <div class="user-top-online-dot" title="সক্রিয় শিক্ষার্থী"></div>
            </div>
            <div class="user-top-meta">
                <div class="user-top-badge">
                    <i class="fa-solid fa-id-badge"></i> আপনার প্রোফাইল
                </div>
                <h3 class="user-top-name">${escapeHtml(user.name)}</h3>
                <p class="user-top-college"><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(user.college || 'সরকারি মুজিব কলেজ, সখিপুর, টাঙ্গাইল')}</p>
            </div>
        </div>

        <div class="user-top-stats-group">
            <div class="top-stat-pill position-pill">
                <i class="fa-solid fa-ranking-star"></i>
                <div class="top-stat-text">
                    <span class="stat-label">বর্তমান স্থান</span>
                    <strong class="stat-value">${toBn(user.position || 4)}ম</strong>
                </div>
            </div>
            <div class="top-stat-pill points-pill-top">
                <i class="fa-solid fa-trophy"></i>
                <div class="top-stat-text">
                    <span class="stat-label">অর্জিত পয়েন্ট</span>
                    <strong class="stat-value">${toBn(user.points || 0)}</strong>
                </div>
            </div>
            <a href="model-test.html" class="top-action-btn" title="পয়েন্ট বাড়াতে টেস্ট দিন">
                <i class="fa-solid fa-play"></i> মডেল টেস্ট দিন
            </a>
        </div>
    `;
}

// ২. পোডিয়াম রেন্ডার (Top 3 Students)
function renderPodium(top3) {
    const podiumContainer = document.getElementById('podiumContainer');
    if (!podiumContainer) return;

    if (!top3 || top3.length < 3) {
        podiumContainer.style.display = 'none';
        return;
    }

    const first = top3[0];
    const second = top3[1];
    const third = top3[2];

    const toBn = (n) => (window.toBanglaNum ? window.toBanglaNum(n) : n);

    podiumContainer.innerHTML = `
        <!-- ২য় স্থান -->
        <div class="podium-card rank-2">
            <div class="podium-avatar-wrapper">
                <img src="${resolveAvatar(second.avatar)}" alt="${escapeHtml(second.name)}" class="podium-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'">
                <div class="podium-medal-badge silver">২</div>
            </div>
            <h4 class="podium-name">${escapeHtml(second.name)} ${second.isCurrentUser ? '<span class="you-tag">আপনি</span>' : ''}</h4>
            <p class="podium-college">${escapeHtml(second.college || 'কলেজ তথ্য নেই')}</p>
            <div class="podium-points-tag">
                <i class="fa-solid fa-trophy"></i>
                <span>${toBn(second.points || 0)} পয়েন্ট</span>
            </div>
        </div>

        <!-- ১ম স্থান (চ্যাম্পিয়ন) -->
        <div class="podium-card rank-1">
            <i class="fa-solid fa-crown podium-crown"></i>
            <div class="podium-avatar-wrapper">
                <img src="${resolveAvatar(first.avatar)}" alt="${escapeHtml(first.name)}" class="podium-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'">
                <div class="podium-medal-badge gold">১</div>
            </div>
            <h4 class="podium-name">${escapeHtml(first.name)} ${first.isCurrentUser ? '<span class="you-tag">আপনি</span>' : ''}</h4>
            <p class="podium-college">${escapeHtml(first.college || 'কলেজ তথ্য নেই')}</p>
            <div class="podium-points-tag" style="background: rgba(245, 158, 11, 0.2); border-color: #F59E0B; color: #92400E;">
                <i class="fa-solid fa-trophy" style="color: #F59E0B;"></i>
                <span>${toBn(first.points || 0)} পয়েন্ট</span>
            </div>
        </div>

        <!-- ৩য় স্থান -->
        <div class="podium-card rank-3">
            <div class="podium-avatar-wrapper">
                <img src="${resolveAvatar(third.avatar)}" alt="${escapeHtml(third.name)}" class="podium-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'">
                <div class="podium-medal-badge bronze">৩</div>
            </div>
            <h4 class="podium-name">${escapeHtml(third.name)} ${third.isCurrentUser ? '<span class="you-tag">আপনি</span>' : ''}</h4>
            <p class="podium-college">${escapeHtml(third.college || 'কলেজ তথ্য নেই')}</p>
            <div class="podium-points-tag">
                <i class="fa-solid fa-trophy"></i>
                <span>${toBn(third.points || 0)} পয়েন্ট</span>
            </div>
        </div>
    `;
}

// ৩. সম্পূর্ণ র‍্যাংকিং তালিকা রেন্ডার
function renderRankingList(students) {
    const listContainer = document.getElementById('rankingListContainer');
    const countDisplay = document.getElementById('rankingTotalCount');
    if (!listContainer) return;

    const toBn = (n) => (window.toBanglaNum ? window.toBanglaNum(n) : n);

    if (countDisplay) {
        countDisplay.innerText = `${toBn(students.length)} জন শিক্ষার্থী`;
    }

    if (!students || students.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-user-slash" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।</p>
            </div>
        `;
        return;
    }

    let html = '';
    students.forEach((s) => {
        const pos = s.position;
        let badgeClass = 'general';
        let medalIcon = '';
        if (pos === 1) {
            badgeClass = 'top-1';
            medalIcon = '<i class="fa-solid fa-medal" style="color: #F59E0B; margin-left: 4px;"></i>';
        } else if (pos === 2) {
            badgeClass = 'top-2';
            medalIcon = '<i class="fa-solid fa-medal" style="color: #94A3B8; margin-left: 4px;"></i>';
        } else if (pos === 3) {
            badgeClass = 'top-3';
            medalIcon = '<i class="fa-solid fa-medal" style="color: #D97706; margin-left: 4px;"></i>';
        }

        const isCurrent = s.isCurrentUser || (currentLoggedInUser && String(currentLoggedInUser._id) === String(s._id));

        html += `
            <div class="ranking-row ${isCurrent ? 'current-user-row' : ''}">
                <div class="rank-pos-col">
                    <span class="rank-badge ${badgeClass}">${toBn(pos)}</span>
                    ${medalIcon}
                </div>
                <div>
                    <img src="${resolveAvatar(s.avatar)}" alt="${escapeHtml(s.name)}" class="rank-avatar-img" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'">
                </div>
                <div class="rank-user-info">
                    <div class="rank-user-name">
                        <span>${escapeHtml(s.name)}</span>
                        ${isCurrent ? '<span class="you-tag">আপনি</span>' : ''}
                    </div>
                    <span class="rank-user-college">${escapeHtml(s.college || 'কলেজ তথ্য অপ্রাপ্য')}</span>
                </div>
                <div class="rank-points-col">
                    <div class="points-pill">
                        <i class="fa-solid fa-trophy" style="color: #F59E0B;"></i>
                        <span>${toBn(s.points || 0)}</span>
                    </div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
}

// ৪. সার্চ ফিল্টারিং
function filterRankings(query) {
    if (!query || !query.trim()) {
        renderRankingList(allStudentsData);
        return;
    }
    const q = query.trim().toLowerCase();
    const filtered = allStudentsData.filter(s => {
        const name = (s.name || '').toLowerCase();
        const college = (s.college || '').toLowerCase();
        return name.includes(q) || college.includes(q);
    });
    renderRankingList(filtered);
}

// হেল্পার ফাংশন
function resolveAvatar(url) {
    if (!url) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/assets/')) return '..' + url;
    if (url.startsWith('assets/')) return '../' + url;
    return url;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
