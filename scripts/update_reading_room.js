const fs = require('fs');

let rr = fs.readFileSync('pages/reading-room.html', 'utf8');

// 1. Update showUserDetailView to include real model test results
const oldExamCode = `            // মডেল টেস্ট তালিকা পপুলেট
            const exams = (userKey && MOCK_EXAM_RECORDS[userKey.toLowerCase()]) || DEFAULT_EXAMS;
            const listEl = document.getElementById('detailExamFullList');
            document.getElementById('detailExamTotalBadge').innerText = toBnDigits(exams.length) + 'টি সম্পন্ন';`;

const newExamCode = `            // মডেল টেস্ট তালিকা পপুলেট
            let exams = (userKey && MOCK_EXAM_RECORDS[userKey.toLowerCase()]) ? [...MOCK_EXAM_RECORDS[userKey.toLowerCase()]] : [...DEFAULT_EXAMS];

            // যদি কারেন্ট ইউজারের প্রোফাইল হয় ('me'), তবে ইউজারের প্রকৃত সম্পন্নকৃত মডেল টেস্ট লোড করি
            if (!userKey || userKey === 'me' || userKey.startsWith('me')) {
                let userRealExams = [];
                try {
                    const subLive = JSON.parse(localStorage.getItem('ict_submitted_live_exams') || '{}');
                    Object.values(subLive).forEach(e => {
                        if (e && (e.score !== undefined || e.examTitle)) {
                            const total = e.total || 25;
                            const score = e.score || 0;
                            const pct = e.scorePercentage || Math.round((score / total) * 100);
                            userRealExams.push({
                                title: e.examTitle || 'মডেল টেস্ট',
                                sub: \`\${toBnDigits(score)} / \${toBnDigits(total)} (\${toBnDigits(pct)}%) • \${e.submittedAt ? new Date(e.submittedAt).toLocaleDateString('bn-BD') : 'আজ'}\`,
                                rank: \`মেধাক্রম ১\`,
                                score: \`\${toBnDigits(score)}/\${toBnDigits(total)}\`
                            });
                        }
                    });
                } catch(e) {}

                try {
                    const hist = JSON.parse(localStorage.getItem('ict_model_test_history') || '[]');
                    if (Array.isArray(hist)) {
                        hist.forEach(h => {
                            userRealExams.push({
                                title: h.examTitle || h.title || 'মডেল টেস্ট',
                                sub: \`\${toBnDigits(h.score || 0)} / \${toBnDigits(h.total || 25)}\`,
                                rank: h.rank || 'মেধাক্রম ১',
                                score: \`\${toBnDigits(h.score || 0)}/\${toBnDigits(h.total || 25)}\`
                            });
                        });
                    }
                } catch(e) {}

                if (userRealExams.length > 0) {
                    exams = [...userRealExams, ...exams];
                }
            }

            const listEl = document.getElementById('detailExamFullList');
            document.getElementById('detailExamTotalBadge').innerText = toBnDigits(exams.length) + 'টি সম্পন্ন';`;

if (rr.includes(oldExamCode)) {
    rr = rr.replace(oldExamCode, newExamCode);
    console.log('Updated showUserDetailView with real model test results');
} else {
    console.log('oldExamCode not found in reading-room.html');
}

// 2. Update syncLoggedInStudent to also render all registered accounts
const oldSyncEnd = `            // ৪. 'তোমার অবস্থান' টেক্সট আপডেট
            const posEl = document.querySelector('.rr-position-text');
            if (posEl) {
                posEl.innerText = 'তোমার অবস্থান ১/১৯২';
            }
        }`;

const newSyncEnd = `            // ৪. 'তোমার অবস্থান' টেক্সট আপডেট
            const posEl = document.querySelector('.rr-position-text');
            if (posEl) {
                posEl.innerText = 'তোমার অবস্থান ১/১৯২';
            }

            // ৫. অন্যান্য নিবন্ধিত অ্যাকাউন্ট রিডিং রুমে যুক্ত করা
            let accounts = [];
            try {
                accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
            } catch(e) {}

            accounts.forEach(acc => {
                const accName = acc.name || 'শিক্ষার্থী';
                const accCollege = acc.college || 'এইচএসসি পরীক্ষার্থী';
                const accBatch = acc.hscYear || 'HSC 2026';
                const accAvatar = acc.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                const cleanId = (acc.emailOrNumber || accName).replace(/[^a-zA-Z0-9]/g, '');
                const accId = 'activeBubble_' + cleanId;

                // একটিভ বাবল
                if (activeRow && !document.getElementById(accId) && acc.emailOrNumber !== (user && user.emailOrNumber)) {
                    const bubble = document.createElement('div');
                    bubble.className = 'rr-user-bubble';
                    bubble.id = accId;
                    bubble.onclick = () => showUserDetailView(accName, accBatch, accCollege, '১ ঘণ্টা ২০ মিনিট', '২ সেশন', '২ ঘণ্টা', '৪ সেশন', '৮ ঘণ্টা', '১৬ সেশন', '৪৫ ঘণ্টা', '৯০ সেশন', 'user_' + cleanId, accAvatar);
                    bubble.innerHTML = \`
                        <div class="rr-bubble-ring">
                            <img src="\${accAvatar}" alt="\${accName}" class="rr-bubble-img">
                        </div>
                        <span class="rr-bubble-name">\${accName}</span>
                    \`;
                    activeRow.appendChild(bubble);
                }

                // র‍্যাংক কার্ড
                const cardId = 'rankCard_' + cleanId;
                if (rankingContainer && !document.getElementById(cardId) && acc.emailOrNumber !== (user && user.emailOrNumber)) {
                    const card = document.createElement('div');
                    card.className = 'rr-rank-card';
                    card.id = cardId;
                    card.onclick = () => showUserDetailView(accName, accBatch, accCollege, '১ ঘণ্টা ২০ মিনিট', '২ সেশন', '২ ঘণ্টা', '৪ সেশন', '৮ ঘণ্টা', '১৬ সেশন', '৪৫ ঘণ্টা', '৯০ সেশন', 'user_' + cleanId, accAvatar);
                    card.innerHTML = \`
                        <div class="rr-rank-left">
                            <div class="rr-rank-medal-wrap">
                                <span class="rr-rank-number" style="font-weight: 700; color: #64748B;">•</span>
                            </div>
                            <div class="rr-user-avatar-wrap ring-blue">
                                <img src="\${accAvatar}" alt="\${accName}" class="rr-user-avatar">
                                <span class="live-indicator"></span>
                            </div>
                            <div class="rr-user-info">
                                <div class="rr-name-row">
                                    <span class="rr-name-dot"></span> \${accName}
                                </div>
                                <div class="rr-tags-row">
                                    <span class="rr-tag-pill">\${accBatch}</span>
                                    <span class="rr-tag-pill college-pill">🏛️ \${accCollege}</span>
                                </div>
                            </div>
                        </div>
                        <div class="rr-rank-time">
                            <span class="rr-time-val">১:২০</span>
                            <span class="rr-time-unit">ঘণ্টা</span>
                        </div>
                    \`;
                    rankingContainer.appendChild(card);
                }
            });

            // ক্লাউড সিঙ্ক থেকে ইউজার ফেচ (async ব্যাকগ্রাউন্ড)
            if (typeof fetch === 'function') {
                fetch('https://ntfy.sh/ict_easy_learning_accounts_v1/json?poll=1&since=all', { mode: 'cors' })
                    .then(r => r.ok ? r.text() : '')
                    .then(txt => {
                        if (!txt) return;
                        const lines = txt.trim().split('\\n');
                        let updated = false;
                        lines.forEach(l => {
                            try {
                                const ev = JSON.parse(l);
                                if (ev.message) {
                                    const cAcc = typeof ev.message === 'string' ? JSON.parse(ev.message) : ev.message;
                                    if (cAcc && cAcc.name && !accounts.some(a => a.name === cAcc.name || a.emailOrNumber === cAcc.emailOrNumber)) {
                                        accounts.push(cAcc);
                                        updated = true;
                                    }
                                }
                            } catch(e) {}
                        });
                        if (updated) {
                            try { localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts)); } catch(e){}
                        }
                    })
                    .catch(() => {});
            }
        }`;

if (rr.includes(oldSyncEnd)) {
    rr = rr.replace(oldSyncEnd, newSyncEnd);
    console.log('Updated syncLoggedInStudent with registered and cloud accounts');
} else {
    console.log('oldSyncEnd not found in reading-room.html');
}

fs.writeFileSync('pages/reading-room.html', rr, 'utf8');
console.log('reading-room.html updated successfully');
