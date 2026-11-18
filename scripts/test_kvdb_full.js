const https = require('https');

const BUCKET = 'ED8jMJWkJPhZwmZgUxgZdc';

async function testKvdb() {
    // 1. Test OPTIONS (CORS preflight)
    const optRes = await new Promise(r => {
        const req = https.request({
            hostname: 'kvdb.io',
            path: `/${BUCKET}/testkey`,
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Access-Control-Request-Method': 'POST'
            }
        }, res => {
            r({ status: res.statusCode, headers: res.headers });
        });
        req.end();
    });
    console.log('1. CORS OPTIONS preflight:', optRes);

    // 2. Test POST write
    const writeRes = await new Promise(r => {
        const data = JSON.stringify({
            name: 'মুসকান',
            phone: '01712345678',
            password: 'pass123',
            college: 'ঢাকা কলেজ',
            hscYear: 'HSC 2026',
            points: 25
        });
        const req = https.request({
            hostname: 'kvdb.io',
            path: `/${BUCKET}/acc01712345678`,
            method: 'POST',
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => r({ status: res.statusCode, body: b, cors: res.headers['access-control-allow-origin'] }));
        });
        req.write(data);
        req.end();
    });
    console.log('2. POST write:', writeRes);

    // 3. Test GET read
    const getRes = await new Promise(r => {
        const req = https.request({
            hostname: 'kvdb.io',
            path: `/${BUCKET}/acc01712345678`,
            method: 'GET',
            headers: {
                'Origin': 'https://islamlablo-design.github.io'
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => r({ status: res.statusCode, body: b, cors: res.headers['access-control-allow-origin'] }));
        });
        req.end();
    });
    console.log('3. GET read:', getRes);

    // 4. Test list keys (for admin.html to see all users!)
    const listRes = await new Promise(r => {
        const req = https.request({
            hostname: 'kvdb.io',
            path: `/${BUCKET}/?prefix=acc&values=true`,
            method: 'GET',
            headers: {
                'Origin': 'https://islamlablo-design.github.io'
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => r({ status: res.statusCode, body: b, cors: res.headers['access-control-allow-origin'] }));
        });
        req.end();
    });
    console.log('4. List keys with values:', listRes);
}

testKvdb();
