const fs = require('fs');
const admin = fs.readFileSync('admin.html', 'utf8');
const lines = admin.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('multiselect-wrapper') || l.includes('toggleMultiSelectDropdown') || l.includes('multiselect-trigger')) {
        console.log(`${idx + 1}: ${l.trim().slice(0, 100)}`);
    }
});
