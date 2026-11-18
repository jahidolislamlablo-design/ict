const https = require('https');

async function testUrl(name, url, method = 'GET', data = null) {
    return new Promise((resolve) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: method,
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                const cors = res.headers['access-control-allow-origin'];
                resolve({ name, status: res.statusCode, cors: cors, body: body.slice(0, 100) });
            });
        });
        req.on('error', e => resolve({ name, error: e.message }));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    console.log(await testUrl('restful-api.dev POST', 'https://api.restful-api.dev/objects', 'POST', { name: 'test_user', data: { phone: '01700000000', pass: '123' } }));
}
run();
