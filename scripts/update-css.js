const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Update line 1500 of style.css:
css = css.replace(
`.interactive-view-container {
    max-width: 760px;
    margin: 0 auto;
    padding-bottom: 40px;
}`,
`.interactive-view-container {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 auto;
    padding-bottom: 40px;
}`
);

// Also ensure .modern-quiz-card and .modern-cq-card are 100% full width
if (!css.includes('.modern-quiz-card {')) {
    console.log('Adding modern card base width');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated assets/css/style.css for full-width layout!');
