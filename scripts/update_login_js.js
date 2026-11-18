const fs = require('fs');

let loginJs = fs.readFileSync('assets/js/login.js', 'utf8');

const oldCloudCode = `async function saveAccountToCloud(accountObj) {
    try {
        const num = normalizeBanglaDigits(accountObj.emailOrNumber || accountObj.email || '');
        const cleanKey = 'acc' + num.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!cleanKey || cleanKey === 'acc') return false;

        const compactStr = [
            normalizeBanglaDigits(accountObj.password || ''),
            accountObj.name || '',
            accountObj.college || 'এইচএসসি পরীক্ষার্থী',
            accountObj.hscYear || 'HSC 2026',
            accountObj.points !== undefined ? accountObj.points : 25,
            accountObj.avatar || '',
            accountObj.testsCompleted || 0
        ].join('~~');

        const enc = b64UrlEncode(compactStr);
        if (!enc) return false;

        const url = \`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/\${CLOUD_KV_APPKEY}/\${cleanKey}/\${enc}\`;
        await fetch(url, { method: 'POST', mode: 'cors' });
        return true;
    } catch(err) {
        console.warn('saveAccountToCloud error:', err);
        return false;
    }
}
window.saveAccountToCloud = saveAccountToCloud;

async function fetchAccountFromCloud(emailOrNumber) {
    try {
        const num = normalizeBanglaDigits(emailOrNumber || '');
        const cleanKey = 'acc' + num.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!cleanKey || cleanKey === 'acc') return null;

        const url = \`https://keyvalue.immanuel.co/api/KeyVal/GetValue/\${CLOUD_KV_APPKEY}/\${cleanKey}\`;
        const res = await fetch(url, { cache: 'no-cache', mode: 'cors' });
        if (!res.ok) return null;

        const raw = await res.text();
        const clean = raw.trim().replace(/^"|"$/g, '');
        if (!clean || clean === 'null' || clean.includes('<html')) return null;

        const dec = b64UrlDecode(clean);
        if (!dec) return null;

        if (dec.includes('~~')) {
            const [password, name, college, hscYear, points, avatar, testsCompleted] = dec.split('~~');
            return {
                name: name || '',
                emailOrNumber: num,
                college: college || 'এইচএসসি পরীক্ষার্থী',
                hscYear: hscYear || 'HSC 2026',
                password: password || '',
                avatar: avatar || '',
                points: points !== undefined ? Number(points) : 25,
                testsCompleted: testsCompleted !== undefined ? Number(testsCompleted) : 0
            };
        } else {
            return JSON.parse(dec);
        }
    } catch(err) {
        console.warn('fetchAccountFromCloud error:', err);
        return null;
    }
}
window.fetchAccountFromCloud = fetchAccountFromCloud;`;

const newCloudCode = `function normalizeAccountIdentifier(str) {
    if (!str) return '';
    let s = normalizeBanglaDigits(String(str)).toLowerCase().trim();
    const digitsOnly = s.replace(/\\D/g, '');
    if (digitsOnly.length >= 10) {
        if (digitsOnly.startsWith('8801')) return digitsOnly.substring(2);
        return digitsOnly;
    }
    return s;
}
window.normalizeAccountIdentifier = normalizeAccountIdentifier;

async function saveAccountToCloud(accountObj) {
    try {
        if (!accountObj) return false;
        const iden = accountObj.emailOrNumber || accountObj.email || '';
        if (!iden) return false;

        const payload = {
            action: 'save_account',
            emailOrNumber: String(iden).trim(),
            password: String(accountObj.password || '').trim(),
            name: String(accountObj.name || '').trim(),
            college: accountObj.college || 'এইচএসসি পরীক্ষার্থী',
            hscYear: accountObj.hscYear || 'HSC 2026',
            points: accountObj.points !== undefined ? accountObj.points : 25,
            avatar: accountObj.avatar || '',
            testsCompleted: accountObj.testsCompleted || 0,
            timestamp: Date.now()
        };

        const res = await fetch('https://ntfy.sh/ict_easy_learning_accounts_v1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            mode: 'cors'
        });
        return res.ok;
    } catch(err) {
        console.warn('saveAccountToCloud error:', err);
        return false;
    }
}
window.saveAccountToCloud = saveAccountToCloud;

async function fetchAccountFromCloud(emailOrNumber) {
    try {
        const cleanTarget = normalizeAccountIdentifier(emailOrNumber);
        if (!cleanTarget) return null;

        const res = await fetch('https://ntfy.sh/ict_easy_learning_accounts_v1/json?poll=1&since=all', {
            cache: 'no-cache',
            mode: 'cors'
        });
        if (!res.ok) return null;

        const text = await res.text();
        const lines = text.trim().split('\\n');
        let matched = null;

        let localAccounts = [];
        try {
            localAccounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
        } catch(e) {}

        for (let i = lines.length - 1; i >= 0; i--) {
            try {
                const item = JSON.parse(lines[i]);
                if (item.message) {
                    const acc = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
                    if (acc && acc.emailOrNumber) {
                        const accKey = normalizeAccountIdentifier(acc.emailOrNumber);
                        const existingIdx = localAccounts.findIndex(l => normalizeAccountIdentifier(l.emailOrNumber) === accKey);
                        if (existingIdx === -1) {
                            localAccounts.push(acc);
                        } else if (acc.password) {
                            localAccounts[existingIdx] = { ...localAccounts[existingIdx], ...acc };
                        }

                        if (!matched && accKey === cleanTarget) {
                            matched = acc;
                        }
                    }
                }
            } catch(e) {}
        }

        try {
            localStorage.setItem('ict_registered_accounts', JSON.stringify(localAccounts));
        } catch(e) {}

        return matched;
    } catch(err) {
        console.warn('fetchAccountFromCloud error:', err);
        return null;
    }
}
window.fetchAccountFromCloud = fetchAccountFromCloud;`;

if (loginJs.includes('https://keyvalue.immanuel.co')) {
    loginJs = loginJs.replace(oldCloudCode, newCloudCode);
    console.log('Replaced cloud KV with ntfy.sh in login.js');
} else {
    console.log('keyvalue.immanuel.co not found or already replaced in login.js');
}

// Also update login matching in login.js
const oldMatchLogic = `        const cleanInput = normalizeBanglaDigits(emailOrNumber).toLowerCase();
        const cleanPass = normalizeBanglaDigits(password);

        let matchedAccount = allAccounts.find(a => {
            const userNum = normalizeBanglaDigits(a.emailOrNumber || a.email || '').toLowerCase();
            return userNum === cleanInput || ((a.emailOrNumber || a.email || '').toLowerCase() === emailOrNumber.toLowerCase());
        });`;

const newMatchLogic = `        const cleanInput = (typeof normalizeAccountIdentifier === 'function') ? normalizeAccountIdentifier(emailOrNumber) : normalizeBanglaDigits(emailOrNumber).toLowerCase().trim();
        const cleanPass = normalizeBanglaDigits(password).trim();

        let matchedAccount = allAccounts.find(a => {
            const userNum = (typeof normalizeAccountIdentifier === 'function') ? normalizeAccountIdentifier(a.emailOrNumber || a.email || '') : normalizeBanglaDigits(a.emailOrNumber || a.email || '').toLowerCase().trim();
            return userNum === cleanInput || ((a.emailOrNumber || a.email || '').toLowerCase() === emailOrNumber.toLowerCase().trim());
        });`;

if (loginJs.includes(oldMatchLogic)) {
    loginJs = loginJs.replace(oldMatchLogic, newMatchLogic);
    console.log('Updated match logic in login.js');
}

// Also update password equality check in login.js
const oldPassCheck = `        const matchedPass = normalizeBanglaDigits(matchedAccount.password || '');
        if (matchedPass !== cleanPass && matchedAccount.password !== password) {`;

const newPassCheck = `        const matchedPass = normalizeBanglaDigits(matchedAccount.password || '').trim();
        const passMatches = (matchedPass === cleanPass) || (matchedPass.toLowerCase() === cleanPass.toLowerCase()) || (matchedAccount.password === password);
        if (!passMatches) {`;

if (loginJs.includes(oldPassCheck)) {
    loginJs = loginJs.replace(oldPassCheck, newPassCheck);
    console.log('Updated pass check in login.js');
}

fs.writeFileSync('assets/js/login.js', loginJs, 'utf8');
console.log('login.js written successfully');
