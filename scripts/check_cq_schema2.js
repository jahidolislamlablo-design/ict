const fs = require('fs');
const server = fs.readFileSync('server.js', 'utf8');

const s = server.indexOf('const CqSchema');
if (s !== -1) {
    console.log(server.substring(s, s + 1500));
} else {
    console.log('const CqSchema not found');
}
