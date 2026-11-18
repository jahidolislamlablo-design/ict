const fs = require('fs');
const server = fs.readFileSync('server.js', 'utf8');

const s = server.indexOf('const CqSchema');
console.log(server.substring(s + 800, s + 2200));
