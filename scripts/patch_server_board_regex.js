const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, '..', 'server.js');
let content = fs.readFileSync(serverJsPath, 'utf8');

const boardFunction = `
function buildBoardRegex(boardStr) {
  if (!boardStr) return null;
  const str = boardStr.trim().toLowerCase();
  if (str === 'all' || str.includes('সকল') || str.includes('all')) return null;

  if (str.includes('dhaka') || str.includes('ঢা')) {
    return new RegExp('(dhaka|ঢাকা)', 'i');
  }
  if (str.includes('rajshahi') || str.includes('রা')) {
    return new RegExp('(rajshahi|রাজশাহী)', 'i');
  }
  if (str.includes('chattogram') || str.includes('chittagong') || str.includes('ctg') || str.includes('চ')) {
    return new RegExp('(chattogram|chittagong|ctg|চট্টগ্রাম|চট্ট)', 'i');
  }
  if (str.includes('comilla') || str.includes('cumilla') || str.includes('কু')) {
    return new RegExp('(comilla|cumilla|কুমিল্লা)', 'i');
  }
  if (str.includes('jashore') || str.includes('jessore') || str.includes('য')) {
    return new RegExp('(jashore|jessore|যশোর)', 'i');
  }
  if (str.includes('barishal') || str.includes('বরিশাল') || (str.includes('ব') && !str.includes('বো'))) {
    return new RegExp('(barishal|বরিশাল)', 'i');
  }
  if (str.includes('sylhet') || str.includes('সি')) {
    return new RegExp('(sylhet|সিলেট)', 'i');
  }
  if (str.includes('dinajpur') || str.includes('দি')) {
    return new RegExp('(dinajpur|দিনাজপুর)', 'i');
  }
  if (str.includes('mymensingh') || str.includes('ময়মনসিংহ') || str.includes('ম.') || str.includes('ম ')) {
    return new RegExp('(mymensingh|ময়মনসিংহ)', 'i');
  }
  if (str.includes('madrasah') || str.includes('madrasa') || str.includes('মা')) {
    return new RegExp('(madrasah|madrasa|মাদ্রাসা)', 'i');
  }
  if (str.includes('technical') || str.includes('কারিগরি')) {
    return new RegExp('(technical|কারিগরি)', 'i');
  }
  const escaped = str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
  return new RegExp(escaped, 'i');
}
`;

if (!content.includes('function buildBoardRegex')) {
    content = content.replace(
        'function buildCollegeRegex(col) {',
        boardFunction + '\nfunction buildCollegeRegex(col) {'
    );
    console.log('Added buildBoardRegex function to server.js');
}

// Update filter.boardName in mcqs and cqs
content = content.replace(
    /if \(boardName && boardName\.trim\(\) && boardName\.toLowerCase\(\) !== 'all'\) \{\s*filter\.boardName = \{ \$regex: new RegExp\(boardName\.trim\(\), 'i'\) \};\s*\}/g,
    `if (boardName && boardName.trim() && boardName.toLowerCase() !== 'all') {
      const bRegex = buildBoardRegex(boardName);
      if (bRegex) filter.boardName = { $regex: bRegex };
    }`
);

fs.writeFileSync(serverJsPath, content, 'utf8');
console.log('Saved server.js successfully.');

// Sync to OneDrive
const oneDriveServer = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\server.js';
if (fs.existsSync(path.dirname(oneDriveServer))) {
    fs.writeFileSync(oneDriveServer, content, 'utf8');
    console.log('Synced server.js to OneDrive.');
}
