const https = require('https');

async function testJsonBlob() {
    // 1. Create a blob
    const initialData = JSON.stringify({
        version: 1,
        users: {
            "01712345678": {
                name: "মুসকান",
                phone: "01712345678",
                password: "password123",
                college: "ঢাকা কলেজ",
                hscYear: "HSC 2026",
                points: 25,
                testsCompleted: 0
            }
        }
    });

    const createRes = await new Promise(resolve => {
        const req = https.request({
            hostname: 'jsonblob.com',
            path: '/api/jsonBlob',
            method: 'POST',
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(initialData)
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({
                status: res.statusCode,
                location: res.headers['location'],
                cors: res.headers['access-control-allow-origin'],
                headers: res.headers
            }));
        });
        req.write(initialData);
        req.end();
    });

    console.log('Create result:', createRes);
    const blobLocation = createRes.location;
    if (!blobLocation) return;

    // 2. Read the blob back
    const blobUrl = new URL(blobLocation);
    const readRes = await new Promise(resolve => {
        https.get({
            hostname: blobUrl.hostname,
            path: blobUrl.pathname,
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Accept': 'application/json'
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({
                status: res.statusCode,
                cors: res.headers['access-control-allow-origin'],
                data: JSON.parse(b)
            }));
        });
    });

    console.log('Read result:', readRes);

    // 3. Update the blob (PUT)
    const updatedData = readRes.data;
    updatedData.users["01899887766"] = {
        name: "তাহমিদ",
        phone: "01899887766",
        password: "pass456",
        college: "নটর ডেম কলেজ",
        hscYear: "HSC 2027",
        points: 50
    };
    const putPayload = JSON.stringify(updatedData);

    const updateRes = await new Promise(resolve => {
        const req = https.request({
            hostname: blobUrl.hostname,
            path: blobUrl.pathname,
            method: 'PUT',
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(putPayload)
            }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({
                status: res.statusCode,
                cors: res.headers['access-control-allow-origin']
            }));
        });
        req.write(putPayload);
        req.end();
    });

    console.log('Update result:', updateRes);

    // 4. Verify CORS OPTIONS Preflight on PUT
    const optionsRes = await new Promise(resolve => {
        const req = https.request({
            hostname: blobUrl.hostname,
            path: blobUrl.pathname,
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://islamlablo-design.github.io',
                'Access-Control-Request-Method': 'PUT',
                'Access-Control-Request-Headers': 'Content-Type,Accept'
            }
        }, res => {
            resolve({
                status: res.statusCode,
                cors: res.headers['access-control-allow-origin'],
                allowMethods: res.headers['access-control-allow-methods']
            });
        });
        req.end();
    });
    console.log('OPTIONS Preflight result:', optionsRes);
}

testJsonBlob();
