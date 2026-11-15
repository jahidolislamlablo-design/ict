const fs = require('fs');

const css = fs.readFileSync('assets/css/style.css', 'utf8');
const lines = css.split('\n');
console.log('Total lines:', lines.length);

for (let i = 1788; i < 1880; i++) {
    if (lines[i]) console.log((i+1) + ': ' + lines[i]);
}
