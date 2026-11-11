const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'server.js');
let s = fs.readFileSync(serverPath, 'utf8');

const startTag = '// নতুন কাস্টম অপশন যুক্ত করার API';
const endTag = '// হেলথ চেক API';

const startIdx = s.indexOf(startTag);
const endIdx = s.indexOf(endTag);

if (startIdx !== -1 && endIdx !== -1) {
  const cleanStr = `// নতুন কাস্টম অপশন যুক্ত করার API
app.post('/api/custom-options', (req, res) => {
  try {
    const { type, val } = req.body;
    if (!type || !val || !val.trim()) {
      return res.status(400).json({ success: false, message: 'Type এবং val প্রদান আবশ্যক' });
    }
    const cleanVal = val.trim();
    const data = readCustomOptionsFile();
    const map = {
      chapter: 'chapters',
      board: 'boards',
      year: 'years',
      college: 'colleges',
      modelTest: 'modelTests'
    };
    const key = map[type] || (type + 's');
    if (!Array.isArray(data[key])) data[key] = [];
    if (!data[key].includes(cleanVal)) {
      data[key].push(cleanVal);
      writeCustomOptionsFile(data);
    }
    res.status(200).json({ success: true, option: { type, val: cleanVal } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// কাস্টম অপশন ডিলিট করার API
app.delete('/api/custom-options', (req, res) => {
  try {
    const { type, val } = req.body || {};
    if (!type || !val) {
      return res.status(400).json({ success: false, message: 'type এবং val আবশ্যক' });
    }
    const cleanVal = val.trim();
    const data = readCustomOptionsFile();
    const map = {
      chapter: 'chapters',
      board: 'boards',
      year: 'years',
      college: 'colleges',
      modelTest: 'modelTests'
    };
    const key = map[type] || (type + 's');
    if (Array.isArray(data[key])) {
      data[key] = data[key].filter(item => item.trim().toLowerCase() !== cleanVal.toLowerCase());
      writeCustomOptionsFile(data);
    }
    res.json({ success: true, message: \`"\${cleanVal}" অপশনটি সফলভাবে মুছে ফেলা হয়েছে\` });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

`;
  s = s.slice(0, startIdx) + cleanStr + s.slice(endIdx);
  fs.writeFileSync(serverPath, s, 'utf8');
  console.log('Fixed custom-options endpoints cleanly!');
} else {
  console.log('Tags not found:', startIdx, endIdx);
}
