const https = require('https');

async function testNtfy() {
    const topic = 'ict_easy_learning_sync_v1';
    
    // 1. Post an account
    const postData = JSON.stringify({
        action: 'register',
        phone: '01712345678',
        name: 'মুসকান',
        password: 'password123',
        college: 'ঢাকা কলেজ',
        hscYear: 'HSC 2026',
        points: 25,
        avatar: '',
        ts: Date.now()
    });

    const postRes = await new Promise(r => {
        const req = https.request({
            hostname: 'ntfy.sh',
            path: `/${topic}`,
            method: 'POST',
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => r({ status: res.statusCode, cors: res.headers['access-control-allow-origin'], body: b }));
        });
        req.write(postData);
        req.end();
    });
    console.log('ntfy POST write:', postRes);

    // 2. Poll past messages
    const pollRes = await new Promise(r => {
        https.get({
            hostname: 'ntfy.sh',
            path: `/${topic}/json?poll=1`,
            headers: {
                'Origin': 'https://islamlablo-design.github.io'
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => r({ status: res.statusCode, cors: res.headers['access-control-allow-origin'], body: b }));
        });
    });
    console.log('ntfy Poll read:', pollRes.status, 'cors:', pollRes.cors);
    const lines = pollRes.body.trim().split('\n');
    lines.forEach(l => {
        try {
            const parsed = JSON.parse(l);
            if (parsed.message) {
                console.log('Message parsed:', JSON.parse(parsed.message));
            }
        } catch(e) {}
    });
}

testNtfy();
