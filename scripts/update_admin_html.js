const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf8');

const targetStr = `        // ৩. লোকাল স্টোরেজ অ্যাকাউন্ট সিঙ্ক (অফলাইন / GitHub Pages ফলব্যাক)`;

const addition = `        // ২.৫. ক্লাউড সিঙ্ক অ্যাকাউন্ট ফেচ (ntfy.sh - মোবাইল ও অন্যান্য ডিভাইসে নিবন্ধিত অ্যাকাউন্ট)
        try {
          const cloudRes = await fetch('https://ntfy.sh/ict_easy_learning_accounts_v1/json?poll=1&since=all', { mode: 'cors' });
          if (cloudRes.ok) {
            const raw = await cloudRes.text();
            const lines = raw.trim().split('\\n');
            lines.forEach(l => {
              try {
                const ev = JSON.parse(l);
                if (ev.message) {
                  const acc = typeof ev.message === 'string' ? JSON.parse(ev.message) : ev.message;
                  if (acc && acc.emailOrNumber) {
                    const cleanKey = String(acc.emailOrNumber).trim().toLowerCase();
                    if (!list.some(u => String(u.emailOrNumber || '').trim().toLowerCase() === cleanKey)) {
                      list.unshift({
                        _id: 'cloud_' + cleanKey,
                        name: acc.name || 'শিক্ষার্থী',
                        emailOrNumber: acc.emailOrNumber,
                        college: acc.college || 'এইচএসসি পরীক্ষার্থী',
                        hscYear: acc.hscYear || 'HSC 2026',
                        avatar: acc.avatar || '',
                        points: acc.points !== undefined ? Number(acc.points) : 25,
                        testsCompleted: acc.testsCompleted !== undefined ? Number(acc.testsCompleted) : 0,
                        createdAt: acc.timestamp ? new Date(acc.timestamp).toISOString() : new Date().toISOString()
                      });
                    }
                  }
                }
              } catch(e){}
            });
          }
        } catch(e) {}

        // ৩. লোকাল স্টোরেজ অ্যাকাউন্ট সিঙ্ক (অফলাইন / GitHub Pages ফলব্যাক)`;

if (!adminHtml.includes('ict_easy_learning_accounts_v1')) {
    adminHtml = adminHtml.replace(targetStr, addition);
    fs.writeFileSync('admin.html', adminHtml, 'utf8');
    console.log('Updated admin.html with cloud accounts fetch');
} else {
    console.log('admin.html already contains cloud fetch');
}
