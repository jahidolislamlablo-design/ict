const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');
const idx = index.indexOf('<footer class="site-footer"');
if (idx !== -1) {
    const end = index.indexOf('</footer>', idx) + 9;
    console.log(index.substring(idx, end));
} else {
    console.log('Footer not found in index.html');
}
