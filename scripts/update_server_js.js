const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

const syncFunction = `
// ==========================================
// ক্লাউড সিঙ্ক: GitHub Pages / মোবাইল থেকে নিবন্ধিত অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে MongoDB-তে সিঙ্ক
// ==========================================
async function syncCloudAccountsToMongo() {
  try {
    const https = require('https');
    const url = 'https://ntfy.sh/ict_easy_learning_accounts_v1/json?poll=1&since=all';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const lines = data.trim().split('\\n');
          for (const line of lines) {
            try {
              const ev = JSON.parse(line);
              if (ev.message) {
                const acc = typeof ev.message === 'string' ? JSON.parse(ev.message) : ev.message;
                if (acc && acc.emailOrNumber && typeof Student !== 'undefined' && mongoose.connection.readyState === 1) {
                  const num = String(acc.emailOrNumber).trim();
                  const exists = await Student.findOne({ emailOrNumber: num });
                  if (!exists) {
                    await Student.create({
                      name: acc.name || 'শিক্ষার্থী',
                      emailOrNumber: num,
                      password: acc.password || '123456',
                      college: acc.college || 'এইচএসসি পরীক্ষার্থী',
                      hscYear: acc.hscYear || 'HSC 2026',
                      avatar: acc.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                      points: acc.points || 25,
                      testsCompleted: acc.testsCompleted || 0,
                      isCurrentUser: false
                    });
                    console.log(\`[Cloud Sync] নতুন অ্যাকাউন্ট MongoDB-তে যুক্ত হয়েছে: \${acc.name} (\${num})\`);
                  }
                }
              }
            } catch(e) {}
          }
        } catch(e) {}
      });
    }).on('error', () => {});
  } catch(e) {}
}

// প্রতি ৩০ সেকেন্ড পরপর ক্লাউড অ্যাকাউন্ট সিঙ্ক
setInterval(syncCloudAccountsToMongo, 30000);
setTimeout(syncCloudAccountsToMongo, 3000);
`;

if (!serverCode.includes('syncCloudAccountsToMongo')) {
    serverCode = serverCode.replace('const PORT = process.env.PORT || 5000;', syncFunction + '\nconst PORT = process.env.PORT || 5000;');
    fs.writeFileSync('server.js', serverCode, 'utf8');
    console.log('Added syncCloudAccountsToMongo to server.js');
} else {
    console.log('server.js already contains syncCloudAccountsToMongo');
}
