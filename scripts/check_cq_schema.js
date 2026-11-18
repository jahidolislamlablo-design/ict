const fs = require('fs');
const server = fs.readFileSync('server.js', 'utf8');

const s = server.indexOf('cqSchema');
if (s !== -1) {
    console.log(server.substring(s - 50, s + 600));
} else {
    console.log('cqSchema not found, searching for CQ...');
    const m = server.match(/mongoose\.model\(['"]CQ['"].*?\)/);
    console.log(m ? m[0] : 'not found');
}
