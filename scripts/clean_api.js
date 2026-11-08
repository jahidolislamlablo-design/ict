const fs = require('fs');
let code = fs.readFileSync('assets/js/api.js', 'utf8');

const badBlockStart = code.indexOf('`; align-items: center;');
if (badBlockStart !== -1) {
    const afterBad = code.indexOf('const cardId =', badBlockStart);
    if (afterBad !== -1) {
        code = code.slice(0, badBlockStart) + '`;\n\n    ' + code.slice(afterBad);
        fs.writeFileSync('assets/js/api.js', code, 'utf8');
        console.log('Cleaned bad block successfully');
    }
} else {
    console.log('Bad block not found');
}
