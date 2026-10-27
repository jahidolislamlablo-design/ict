const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();

// ==========================================
// à§§. CORS à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ (GitHub Pages à¦à¦¬à¦‚ Localhost)
// ==========================================
// à¦«à§à¦°à¦¨à§à¦Ÿà¦à¦¨à§à¦¡ Origin: https://jahidolislamlablo-design.github.io
const allowedOrigins = [
  'https://jahidolislamlablo-design.github.io',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Postman, cURL à¦¬à¦¾ à¦¬à§à¦°à¦¾à¦‰à¦œà¦¾à¦° à¦²à§‹à¦•à¦¾à¦² à¦«à¦¾à¦‡à¦² (file://) à¦¥à§‡à¦•à§‡ à¦†à¦¸à¦¾ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§à¦Ÿà§‡ origin à¦¥à¦¾à¦•à§‡ à¦¨à¦¾ à¦¬à¦¾ null à¦¹à§Ÿ
    if (!origin || origin === 'null') return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.startsWith('https://jahidolislamlablo-design.github.io');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // à¦¡à§‡à¦­à§‡à¦²à¦ªà¦®à§‡à¦¨à§à¦Ÿ à¦¸à¦¹à¦œ à¦°à¦¾à¦–à¦¤à§‡ à¦¸à¦¬ à¦…à¦°à¦¿à¦œà¦¿à¦¨ à¦¸à¦®à¦°à§à¦¥à¦¿à¦¤
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Chrome Private Network Access (PNA) à¦¹à§‡à¦¡à¦¾à¦°
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});

// JSON Body Parser à¦®à¦¿à¦¡à¦²à¦“à§Ÿà§à¦¯à¦¾à¦°
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¿à¦• à¦«à¦¾à¦‡à¦² à¦ªà¦°à¦¿à¦¬à§‡à¦¶à¦¨ (public à¦¡à¦¿à¦°à§‡à¦•à§à¦Ÿà¦°à¦¿ à¦à¦¬à¦‚ à¦°à§à¦Ÿ à¦«à§‹à¦²à§à¦¡à¦¾à¦°)
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/database', express.static(path.join(__dirname, 'database')));

// ==========================================
// à§¨. MongoDB à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œ à¦•à¦¾à¦¨à§‡à¦•à¦¶à¦¨ (Mongoose)
// ==========================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ict_easy_learning';

let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('----------------------------------------------------');
  console.log('âœ… ICT Easy Learning Database Connected Successfully!');
  console.log(`ðŸ“¡ Database URI: ${MONGO_URI}`);
  console.log('----------------------------------------------------');
});

mongoose.connection.on('disconnected', () => {
  if (isConnected) {
    console.warn('âš ï¸ MongoDB Connection Lost / Disconnected!');
    isConnected = false;
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('ðŸ”„ MongoDB Reconnected Successfully!');
});

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .catch((err) => {
    console.error('----------------------------------------------------');
    console.error('âŒ MongoDB Connection Error:', err.message);
    console.error('ðŸ’¡ à¦¨à¦¿à¦°à§à¦¦à§‡à¦¶à¦¿à¦•à¦¾: à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à§à¦¨ à¦†à¦ªà¦¨à¦¾à¦° à¦•à¦®à§à¦ªà¦¿à¦‰à¦Ÿà¦¾à¦°à§‡ MongoDB Server à¦šà¦¾à¦²à§ à¦°à§Ÿà§‡à¦›à§‡à¥¤');
    console.error('   à¦¸à¦¾à¦°à§à¦­à¦¾à¦° à¦šà¦¾à¦²à§ à¦•à¦°à¦¤à§‡ à¦•à¦®à¦¾à¦¨à§à¦¡ à¦ªà§à¦°à¦®à§à¦ªà¦Ÿà§‡ "net start MongoDB" à¦²à¦¿à¦–à§à¦¨');
    console.error('   à¦…à¦¥à¦¬à¦¾ .env à¦«à¦¾à¦‡à¦²à§‡ MongoDB Atlas à¦•à§à¦²à¦¾à¦‰à¦¡ à¦‡à¦‰à¦†à¦°à¦†à¦‡ à¦¦à¦¿à¦¨à¥¤');
    console.error('----------------------------------------------------');
  });

// ==========================================
// à§©. Mongoose à¦®à¦¡à§‡à¦²à¦¸à¦®à§‚à¦¹ (MCQ, CQ, Note)
// ==========================================

// à§§. MCQ Schema & Model
const McqSchema = new mongoose.Schema({
  // à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ (Metadata Options)
  categoryTypes: {
    type: [String],
    default: ['Chapter Practice']
  },
  categoryType: {
    type: String,
    default: 'Chapter Practice',
    trim: true
  },
  chapter: {
    type: String,
    required: [true, 'à¦šà§à¦¯à¦¾à¦ªà§à¦Ÿà¦¾à¦°à§‡à¦° à¦¨à¦¾à¦® à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  collegeName: {
    type: String,
    default: '',
    trim: true
  },
  boardName: {
    type: String,
    default: '',
    trim: true
  },
  examYear: {
    type: String,
    default: '',
    trim: true
  },
  testPaperName: {
    type: String,
    default: '',
    trim: true
  },
  modelTestNo: {
    type: String,
    default: '',
    trim: true
  },

  // MCQ à¦®à§‚à¦² à¦«à¦¿à¦²à§à¦¡à¦¸à¦®à§‚à¦¹
  question: {
    type: String,
    required: [true, 'à¦ªà§à¦°à¦¶à§à¦¨ à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'à¦…à¦ªà¦¶à¦¨ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦†à¦¬à¦¶à§à¦¯à¦•'],
    validate: [val => val && val.length >= 2, 'à¦•à¦®à¦ªà¦•à§à¦·à§‡ à¦¦à§à¦Ÿà¦¿ à¦…à¦ªà¦¶à¦¨ à¦¦à¦¿à¦¤à§‡ à¦¹à¦¬à§‡']
  },
  correctAnswer: {
    type: String,
    required: [true, 'à¦¸à¦ à¦¿à¦• à¦‰à¦¤à§à¦¤à¦° à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  explanation: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Mcq = mongoose.model('Mcq', McqSchema);

// à§¨. CQ Schema & Model (à¦¸à§ƒà¦œà¦¨à¦¶à§€à¦² à¦ªà§à¦°à¦¶à§à¦¨)
const CqSchema = new mongoose.Schema({
  // à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ (Metadata Options)
  categoryTypes: {
    type: [String],
    default: ['Board Question']
  },
  categoryType: {
    type: String,
    default: 'Board Question',
    trim: true
  },
  chapter: {
    type: String,
    required: [true, 'à¦šà§à¦¯à¦¾à¦ªà§à¦Ÿà¦¾à¦°à§‡à¦° à¦¨à¦¾à¦® à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  collegeName: {
    type: String,
    default: '',
    trim: true
  },
  boardName: {
    type: String,
    default: '',
    trim: true
  },
  examYear: {
    type: String,
    default: '',
    trim: true
  },
  testPaperName: {
    type: String,
    default: '',
    trim: true
  },
  modelTestNo: {
    type: String,
    default: '',
    trim: true
  },

  // CQ à¦®à§‚à¦² à¦«à¦¿à¦²à§à¦¡à¦¸à¦®à§‚à¦¹
  stem: {
    type: String,
    required: [true, 'à¦‰à¦¦à§à¦¦à§€à¦ªà¦• (stem) à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  q_ka: {
    type: String,
    required: [true, 'à¦œà§à¦žà¦¾à¦¨à¦®à§‚à¦²à¦• à¦ªà§à¦°à¦¶à§à¦¨ (à¦•) à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  a_ka: {
    type: String,
    default: '',
    trim: true
  },
  q_kha: {
    type: String,
    required: [true, 'à¦…à¦¨à§à¦§à¦¾à¦¬à¦¨à¦®à§‚à¦²à¦• à¦ªà§à¦°à¦¶à§à¦¨ (à¦–) à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  a_kha: {
    type: String,
    default: '',
    trim: true
  },
  q_ga: {
    type: String,
    required: [true, 'à¦ªà§à¦°à§Ÿà§‹à¦—à¦®à§‚à¦²à¦• à¦ªà§à¦°à¦¶à§à¦¨ (à¦—) à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  a_ga: {
    type: String,
    default: '',
    trim: true
  },
  q_gha: {
    type: String,
    required: [true, 'à¦‰à¦šà§à¦šà¦¤à¦° à¦¦à¦•à§à¦·à¦¤à¦¾à¦®à§‚à¦²à¦• à¦ªà§à¦°à¦¶à§à¦¨ (à¦˜) à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  a_gha: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cq = mongoose.model('Cq', CqSchema);

// à§©. Notes Model (à¦²à§‡à¦•à¦šà¦¾à¦° à¦¨à§‹à¦Ÿ à¦“ à¦…à¦¨à§à¦¯à¦¾à¦¨à§à¦¯)
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'à¦¨à§‹à¦Ÿà§‡à¦° à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  type: {
    type: String,
    default: 'Lecture Note',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦†à¦¬à¦¶à§à¦¯à¦•'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'à¦¨à§‹à¦Ÿà§‡à¦° à¦•à¦¨à§à¦Ÿà§‡à¦¨à§à¦Ÿ à¦†à¦¬à¦¶à§à¦¯à¦•']
  },
  pdfUrl: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', NoteSchema);

// ==========================================
// PDF Upload Configuration (Multer)
// ==========================================
const pdfUploadDir = path.join(__dirname, 'uploads', 'pdfs');
if (!fs.existsSync(pdfUploadDir)) {
  fs.mkdirSync(pdfUploadDir, { recursive: true });
}

const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pdfUploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.pdf';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.\-_]/g, '_') || 'document';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${base}${ext}`);
  }
});

const pdfFileFilter = (req, file, cb) => {
  const isPdfExt = file && file.originalname && file.originalname.toLowerCase().endsWith('.pdf');
  const isPdfMime = file && file.mimetype && (file.mimetype === 'application/pdf' || file.mimetype.includes('pdf'));
  if (isPdfExt || isPdfMime) {
    cb(null, true);
  } else {
    cb(new Error('শুধুমাত্র PDF ফাইল (.pdf) আপলোড করা অনুমোদিত!'), false);
  }
};

// ------------------------------------------
// চ্যাপ্টার এবং কলেজ ম্যাচিং হেল্পার ফাংশন
// ------------------------------------------
function buildChapterRegex(ch) {
  if (!ch) return null;
  const str = ch.trim();
  if (str === '3.1' || str.includes('১ম অংশ') || str.includes('সংখ্যা পদ্ধতি')) {
    return new RegExp('(3.*1|১ম অংশ|সংখ্যা পদ্ধতি|Number System)', 'i');
  }
  if (str === '3.2' || str.includes('২য় অংশ') || str.includes('ডিজিটাল ডিভাইস') || str.includes('লজিক গেট')) {
    return new RegExp('(3.*2|২য় অংশ|ডিজিটাল ডিভাইস|লজিক গেট|Logic Gate)', 'i');
  }
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    const banglaDigits = {'1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬'};
    const bDigit = banglaDigits[str] || str;
    if (num === 3) {
      return new RegExp('(chapter\\s*3|অধ্যায়\\s*৩|৩য়\\s*অধ্যায়|সংখ্যা পদ্ধতি|ডিজিটাল ডিভাইস)', 'i');
    }
    return new RegExp('(chapter\\s*' + str + '|অধ্যায়\\s*' + str + '|' + bDigit + 'ম\\s*অধ্যায়|অধ্যায়\\s*' + bDigit + ')', 'i');
  }
  return new RegExp(str, 'i');
}

function buildCollegeRegex(col) {
  if (!col) return null;
  const str = col.trim().toLowerCase();
  if (str === 'ndc' || str.includes('নটর ডেম') || str.includes('notre dame')) {
    return new RegExp('(notre\\s*dame|নটর\\s*ডেম|ndc)', 'i');
  }
  if (str === 'vnsc' || str.includes('ভিকারুননিসা') || str.includes('viqarunnisa')) {
    return new RegExp('(viqarunnisa|ভিকারুননিসা|vnsc)', 'i');
  }
  if (str === 'rajuk' || str.includes('রাজউক')) {
    return new RegExp('(rajuk|রাজউক)', 'i');
  }
  if (str === 'drmc' || str.includes('রেসিডেনসিয়াল') || str.includes('residential')) {
    return new RegExp('(residential|রেসিডেনসিয়াল|drmc)', 'i');
  }
  if (str === 'dc' || str === 'dhaka college' || str.includes('ঢাকা কলেজ')) {
    return new RegExp('(dhaka\\s*college|ঢাকা\\s*কলেজ|\\bdc\\b)', 'i');
  }
  if (str.includes('সিটি') || str.includes('city college')) {
    return new RegExp('(city\\s*college|সিটি\\s*কলেজ)', 'i');
  }
  if (str === 'ctg_college' || str.includes('চট্টগ্রাম কলেজ') || str.includes('chittagong college')) {
    return new RegExp('(chittagong|চট্টগ্রাম)', 'i');
  }
  if (str === 'raj_college' || str.includes('রাজশাহী কলেজ') || str.includes('rajshahi college')) {
    return new RegExp('(rajshahi|রাজশাহী)', 'i');
  }
  if (str.includes('ক্যান্টনমেন্ট') || str.includes('cantonment')) {
    return new RegExp('(cantonment|ক্যান্টনমেন্ট)', 'i');
  }
  if (str.includes('মুজিব') || str.includes('mujib')) {
    return new RegExp('(mujib|মুজিব)', 'i');
  }
  return new RegExp(col.trim(), 'i');
}

const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// ------------------------------------------
// ৪. PDF Suggestion & Handnote Model
// ------------------------------------------
const PdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'পিডিএফ-এর শিরোনাম আবশ্যক'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'ক্যাটাগরি আবশ্যক'],
    trim: true,
    default: 'suggestion' // suggestion, handnote, cheatsheet, board, testpaper
  },
  chapter: {
    type: String,
    default: 'সকল অধ্যায়',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  pdfUrl: {
    type: String,
    required: [true, 'পিডিএফ ফাইল বা লিংক আবশ্যক'],
    trim: true
  },
  originalFileName: {
    type: String,
    default: ''
  },
  fileSize: {
    type: String,
    default: '১.০ MB'
  },
  pagesCount: {
    type: String,
    default: '১০ পৃষ্ঠা'
  },
  downloadsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pdf = mongoose.model('Pdf', PdfSchema);

// অটো গিট পুশ হেল্পার (GitHub Pages এ অটোমেটিক সিঙ্ক করার জন্য)
function autoPushToGitHub(commitMsg = 'Update ICT learning data & PDFs') {
  const repoDir = __dirname;
  if (!fs.existsSync(path.join(repoDir, '.git'))) return;

  exec('git add . && git status --porcelain', { cwd: repoDir }, (stErr, stdout) => {
    if (stErr) return;
    const hasChanges = stdout && stdout.trim().length > 0;
    if (!hasChanges) return;

    const escapedMsg = commitMsg.replace(/"/g, '\"');
    const cmd = `git commit -m "${escapedMsg}" && git push origin main`;
    exec(cmd, { cwd: repoDir }, (error, stdout, stderr) => {
      if (error) {
        console.warn('Auto GitHub push notice:', stderr || error.message);
      } else {
        console.log('✅ GitHub Pages-এ সফলভাবে ডেটা পুশ ও সিঙ্ক হয়েছে!');
      }
    });
  });
}

// ফাইল সিঙ্ক হেল্পার: আপলোড করা PDF ফাইল ফ্রন্টএন্ড ও গিটহাব পেজেস ডিরেক্টরিতে কপি করা
function syncPdfFileToFrontend(filename) {
  const sourcePath = path.join(__dirname, 'uploads', 'pdfs', filename);
  if (!fs.existsSync(sourcePath)) return;

  const targetDirs = [
    'C:/Users/taibu/OneDrive/Desktop/Antygravity project/ict-easy-learning/uploads/pdfs'
  ];

  targetDirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(sourcePath, path.join(dir, filename));
    } catch (e) {}
  });
}

function removePdfFileFromFrontend(filename) {
  const targetFiles = [
    path.join(__dirname, 'uploads', 'pdfs', filename),
    path.join('C:/Users/taibu/OneDrive/Desktop/Antygravity project/ict-easy-learning/uploads/pdfs', filename)
  ];
  targetFiles.forEach(f => {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch (e) {}
  });
}

// হেল্পার: ডাটাবেজের সমস্ত তথ্য JSON এ সিঙ্ক রাখা (GitHub Pages ও অফলাইন ব্যবহারের জন্য)
async function syncDatabaseJson(type = 'all') {
  try {
    const destDirs = [
      path.join(__dirname, 'database'),
      'C:/Users/taibu/OneDrive/Desktop/Antygravity project/ict-easy-learning/database'
    ];

    if (type === 'all' || type === 'mcqs') {
      const allMcqs = await Mcq.find({}).sort({ createdAt: -1 });
      const jsonStr = JSON.stringify(allMcqs, null, 2);
      destDirs.forEach(dir => {
        try {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'mcqs.json'), jsonStr, 'utf8');
        } catch (e) {}
      });
    }

    if (type === 'all' || type === 'cqs') {
      const allCqs = await Cq.find({}).sort({ createdAt: -1 });
      const jsonStr = JSON.stringify(allCqs, null, 2);
      destDirs.forEach(dir => {
        try {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'cqs.json'), jsonStr, 'utf8');
        } catch (e) {}
      });
    }

    if (type === 'all' || type === 'pdfs') {
      const allPdfs = await Pdf.find({}).sort({ createdAt: -1 });
      const jsonStr = JSON.stringify(allPdfs, null, 2);
      destDirs.forEach(dir => {
        try {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'pdfs.json'), jsonStr, 'utf8');
        } catch (e) {}
      });
    }
    console.log(`✅ [Database Sync] ${type} JSON সিঙ্ক সম্পন্ন হয়েছে!`);
  } catch (err) {
    console.warn('syncDatabaseJson warning:', err.message);
  }
}

async function syncPdfsJson() {
  return syncDatabaseJson('pdfs');
}


// ------------------------------------------
// ক. হেলথ ও MCQ রাউটস
// ------------------------------------------

// হেলথ চেক API
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'online', port: PORT, timestamp: new Date() });
});

// ১. সকল MCQ ফেচ করা (ফিল্টারিং সুবিধাসহ)
app.get('/api/mcqs', async (req, res) => {
  try {
    const { 
      chapter, 
      categoryType, 
      boardName, 
      collegeName, 
      examYear, 
      testPaperName, 
      modelTestNo 
    } = req.query;

    let filter = {};

    if (chapter && chapter.trim()) {
      filter.chapter = { $regex: buildChapterRegex(chapter) };
    }

    if (categoryType && categoryType.trim()) {
      const cat = categoryType.trim();
      filter.$or = [
        { categoryTypes: { $in: [cat] } },
        { categoryType: cat }
      ];
    }

    if (boardName && boardName.trim() && boardName.toLowerCase() !== 'all') {
      filter.boardName = { $regex: new RegExp(boardName.trim(), 'i') };
    }
    if (collegeName && collegeName.trim()) filter.collegeName = { $regex: buildCollegeRegex(collegeName) };
    if (examYear && examYear.trim()) filter.examYear = examYear.trim();
    if (testPaperName && testPaperName.trim()) filter.testPaperName = { $regex: new RegExp(testPaperName.trim(), 'i') };
    if (modelTestNo && modelTestNo.trim()) filter.modelTestNo = { $regex: new RegExp(modelTestNo.trim(), 'i') };

    const mcqs = await Mcq.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mcqs.length,
      filtersApplied: filter,
      data: mcqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MCQ ফেচ করার সময় সমস্যা হয়েছে',
      error: error.message
    });
  }
});

// ২. ডাটাবেজে থাকা MCQ চ্যাপ্টারের তালিকা
app.get('/api/mcqs/chapters', async (req, res) => {
  try {
    const chapters = await Mcq.distinct('chapter');
    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MCQ চ্যাপ্টারের তালিকা আনা সম্ভব হয়নি',
      error: error.message
    });
  }
});

// ৩. নির্দিষ্ট MCQ আইডি দিয়ে ফেচ করা
app.get('/api/mcqs/:id', async (req, res) => {
  try {
    const mcq = await Mcq.findById(req.params.id);
    if (!mcq) {
      return res.status(404).json({ success: false, message: 'MCQ প্রশ্নটি পাওয়া যায়নি' });
    }
    res.status(200).json({ success: true, data: mcq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ৪. নতুন MCQ সংরক্ষণ করা (POST /api/mcqs)
app.post('/api/mcqs', async (req, res) => {
  try {
    const {
      categoryTypes,
      categoryType,
      chapter,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      question,
      options,
      correctAnswer,
      explanation
    } = req.body;

    let finalCategoryTypes = categoryTypes;
    if (!finalCategoryTypes || !Array.isArray(finalCategoryTypes) || finalCategoryTypes.length === 0) {
      finalCategoryTypes = categoryType ? [categoryType] : ['Chapter Practice'];
    }

    if (!chapter || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে chapter, question, options এবং correctAnswer ফিল্ডগুলো পূরণ করুন'
      });
    }

    const newMcq = new Mcq({
      categoryTypes: finalCategoryTypes,
      categoryType: finalCategoryTypes[0] || 'Chapter Practice',
      chapter: chapter.trim(),
      collegeName: collegeName ? collegeName.trim() : '',
      boardName: boardName ? boardName.trim() : '',
      examYear: examYear ? String(examYear).trim() : '',
      testPaperName: testPaperName ? testPaperName.trim() : '',
      modelTestNo: modelTestNo ? modelTestNo.trim() : '',
      question: question.trim(),
      options: Array.isArray(options) ? options.map(o => String(o).trim()) : [],
      correctAnswer: String(correctAnswer).trim(),
      explanation: explanation ? String(explanation).trim() : ''
    });

    const savedMcq = await newMcq.save();
    await syncDatabaseJson('mcqs');
    autoPushToGitHub('Add new MCQ: ' + (savedMcq.question ? savedMcq.question.slice(0, 30) : 'item'));
    res.status(201).json({
      success: true,
      message: '✅ MCQ সফলভাবে সংরক্ষিত হয়েছে!',
      data: savedMcq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'MCQ সংরক্ষণ করতে সমস্যা হয়েছে',
      error: error.message
    });
  }
});

// ৫. MCQ আপডেট করা (PUT /api/mcqs/:id)
app.put('/api/mcqs/:id', async (req, res) => {
  try {
    const {
      categoryTypes,
      categoryType,
      chapter,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      question,
      options,
      correctAnswer,
      explanation
    } = req.body;

    let updateData = {};

    if (categoryTypes && Array.isArray(categoryTypes) && categoryTypes.length > 0) {
      updateData.categoryTypes = categoryTypes;
      updateData.categoryType = categoryTypes[0];
    } else if (categoryType) {
      updateData.categoryTypes = [categoryType];
      updateData.categoryType = categoryType;
    }

    if (chapter) updateData.chapter = chapter.trim();
    if (collegeName !== undefined) updateData.collegeName = collegeName.trim();
    if (boardName !== undefined) updateData.boardName = boardName.trim();
    if (examYear !== undefined) updateData.examYear = String(examYear).trim();
    if (testPaperName !== undefined) updateData.testPaperName = testPaperName.trim();
    if (modelTestNo !== undefined) updateData.modelTestNo = modelTestNo.trim();
    if (question) updateData.question = question.trim();
    if (options && Array.isArray(options)) updateData.options = options.map(o => String(o).trim());
    if (correctAnswer) updateData.correctAnswer = String(correctAnswer).trim();
    if (explanation !== undefined) updateData.explanation = String(explanation).trim();

    const updatedMcq = await Mcq.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedMcq) {
      return res.status(404).json({ success: false, message: 'MCQ প্রশ্নটি পাওয়া যায়নি' });
    }

    res.status(200).json({
      success: true,
      message: '✅ MCQ সফলভাবে আপডেট করা হয়েছে!',
      data: updatedMcq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'MCQ আপডেট করা সম্ভব হয়নি',
      error: error.message
    });
  }
});

// ৬. MCQ ডিলিট করা (DELETE /api/mcqs/:id)
app.delete('/api/mcqs/:id', async (req, res) => {
  try {
    const deletedMcq = await Mcq.findByIdAndDelete(req.params.id);
    if (!deletedMcq) {
      return res.status(404).json({ success: false, message: 'MCQ প্রশ্নটি পাওয়া যায়নি' });
    }
    res.status(200).json({ success: true, message: 'MCQ প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------
// খ. CQ রাউটস
// ------------------------------------------

// ১. সকল CQ ফেচ করা
app.get('/api/cqs', async (req, res) => {
  try {
    const { 
      chapter, 
      categoryType, 
      boardName, 
      collegeName, 
      examYear, 
      testPaperName, 
      modelTestNo 
    } = req.query;

    let filter = {};

    if (chapter && chapter.trim()) {
      filter.chapter = { $regex: buildChapterRegex(chapter) };
    }

    if (categoryType && categoryType.trim()) {
      const cat = categoryType.trim();
      filter.$or = [
        { categoryTypes: { $in: [cat] } },
        { categoryType: cat }
      ];
    }

    if (boardName && boardName.trim() && boardName.toLowerCase() !== 'all') {
      filter.boardName = { $regex: new RegExp(boardName.trim(), 'i') };
    }
    if (collegeName && collegeName.trim()) filter.collegeName = { $regex: buildCollegeRegex(collegeName) };
    if (examYear && examYear.trim()) filter.examYear = examYear.trim();
    if (testPaperName && testPaperName.trim()) filter.testPaperName = { $regex: new RegExp(testPaperName.trim(), 'i') };
    if (modelTestNo && modelTestNo.trim()) filter.modelTestNo = { $regex: new RegExp(modelTestNo.trim(), 'i') };

    const cqs = await Cq.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cqs.length,
      filtersApplied: filter,
      data: cqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'CQ ফেচ করার সময় সমস্যা হয়েছে',
      error: error.message
    });
  }
});

// ২. ডাটাবেজে থাকা CQ চ্যাপ্টারের তালিকা
app.get('/api/cqs/chapters', async (req, res) => {
  try {
    const chapters = await Cq.distinct('chapter');
    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'CQ à¦šà§à¦¯à¦¾à¦ªà§à¦Ÿà¦¾à¦°à§‡à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦†à¦¨à¦¾ à¦¸à¦®à§à¦­à¦¬ à¦¹à§Ÿà¦¨à¦¿',
      error: error.message
    });
  }
});

// à§©. à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ CQ à¦†à¦‡à¦¡à¦¿ à¦¦à¦¿à§Ÿà§‡ à¦«à§‡à¦š à¦•à¦°à¦¾
app.get('/api/cqs/:id', async (req, res) => {
  try {
    const cq = await Cq.findById(req.params.id);
    if (!cq) {
      return res.status(404).json({ success: false, message: 'CQ à¦ªà§à¦°à¦¶à§à¦¨à¦Ÿà¦¿ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿' });
    }
    res.status(200).json({ success: true, data: cq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// à§ª. à¦¨à¦¤à§à¦¨ CQ à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦•à¦°à¦¾ (POST /api/cqs)
app.post('/api/cqs', async (req, res) => {
  try {
    const {
      categoryTypes,
      categoryType,
      chapter,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      stem,
      q_ka,
      a_ka,
      q_kha,
      a_kha,
      q_ga,
      a_ga,
      q_gha,
      a_gha
    } = req.body;

    let finalCategoryTypes = categoryTypes;
    if (!finalCategoryTypes || !Array.isArray(finalCategoryTypes) || finalCategoryTypes.length === 0) {
      finalCategoryTypes = categoryType ? [categoryType] : ['Board Question'];
    }

    // à¦†à¦¬à¦¶à§à¦¯à¦• à¦«à¦¿à¦²à§à¦¡ à¦¯à¦¾à¦šà¦¾à¦‡à¦•à¦°à¦£
    if (!chapter || !stem || !q_ka || !q_kha || !q_ga || !q_gha) {
      return res.status(400).json({
        success: false,
        message: 'à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ chapter, stem (à¦‰à¦¦à§à¦¦à§€à¦ªà¦•) à¦à¦¬à¦‚ à¦ªà§à¦°à¦¶à§à¦¨ à¦•, à¦–, à¦—, à¦˜ à¦«à¦¿à¦²à§à¦¡à¦—à§à¦²à§‹ à¦ªà§‚à¦°à¦£ à¦•à¦°à§à¦¨'
      });
    }

    const newCq = new Cq({
      categoryTypes: finalCategoryTypes,
      categoryType: finalCategoryTypes[0] || 'Board Question',
      chapter: chapter.trim(),
      collegeName: collegeName ? collegeName.trim() : '',
      boardName: boardName ? boardName.trim() : '',
      examYear: examYear ? String(examYear).trim() : '',
      testPaperName: testPaperName ? testPaperName.trim() : '',
      modelTestNo: modelTestNo ? modelTestNo.trim() : '',
      stem: stem.trim(),
      q_ka: q_ka.trim(),
      a_ka: a_ka ? a_ka.trim() : '',
      q_kha: q_kha.trim(),
      a_kha: a_kha ? a_kha.trim() : '',
      q_ga: q_ga.trim(),
      a_ga: a_ga ? a_ga.trim() : '',
      q_gha: q_gha.trim(),
      a_gha: a_gha ? a_gha.trim() : ''
    });

    const savedCq = await newCq.save();
    await syncDatabaseJson('cqs');
    autoPushToGitHub('Add new CQ');
    res.status(201).json({
      success: true,
      message: 'âœ… à¦¸à§ƒà¦œà¦¨à¦¶à§€à¦² à¦ªà§à¦°à¦¶à§à¦¨ (CQ) à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦¸à¦‚à¦°à¦•à§à¦·à¦¿à¦¤ à¦¹à§Ÿà§‡à¦›à§‡!',
      data: savedCq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'CQ à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦•à¦°à¦¤à§‡ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¹à§Ÿà§‡à¦›à§‡',
      error: error.message
    });
  }
});


// à§«. CQ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ (PUT /api/cqs/:id)
app.put('/api/cqs/:id', async (req, res) => {
  try {
    const {
      categoryTypes,
      categoryType,
      chapter,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      stem,
      q_ka,
      a_ka,
      q_kha,
      a_kha,
      q_ga,
      a_ga,
      q_gha,
      a_gha
    } = req.body;

    let updateData = {};

    if (categoryTypes && Array.isArray(categoryTypes) && categoryTypes.length > 0) {
      updateData.categoryTypes = categoryTypes;
      updateData.categoryType = categoryTypes[0];
    } else if (categoryType) {
      updateData.categoryTypes = [categoryType];
      updateData.categoryType = categoryType;
    }

    if (chapter) updateData.chapter = chapter.trim();
    if (collegeName !== undefined) updateData.collegeName = collegeName.trim();
    if (boardName !== undefined) updateData.boardName = boardName.trim();
    if (examYear !== undefined) updateData.examYear = String(examYear).trim();
    if (testPaperName !== undefined) updateData.testPaperName = testPaperName.trim();
    if (modelTestNo !== undefined) updateData.modelTestNo = modelTestNo.trim();
    if (stem) updateData.stem = stem.trim();
    if (q_ka) updateData.q_ka = q_ka.trim();
    if (a_ka !== undefined) updateData.a_ka = a_ka.trim();
    if (q_kha) updateData.q_kha = q_kha.trim();
    if (a_kha !== undefined) updateData.a_kha = a_kha.trim();
    if (q_ga) updateData.q_ga = q_ga.trim();
    if (a_ga !== undefined) updateData.a_ga = a_ga.trim();
    if (q_gha) updateData.q_gha = q_gha.trim();
    if (a_gha !== undefined) updateData.a_gha = a_gha.trim();

    const updatedCq = await Cq.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedCq) {
      return res.status(404).json({ success: false, message: 'CQ à¦ªà§à¦°à¦¶à§à¦¨à¦Ÿà¦¿ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿' });
    }

    res.status(200).json({
      success: true,
      message: 'âœ… CQ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡!',
      data: updatedCq
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'CQ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¸à¦®à§à¦­à¦¬ à¦¹à§Ÿà¦¨à¦¿',
      error: error.message
    });
  }
});

// à§¬. CQ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦•à¦°à¦¾ (DELETE /api/cqs/:id)
app.delete('/api/cqs/:id', async (req, res) => {
  try {
    const deletedCq = await Cq.findByIdAndDelete(req.params.id);
    if (!deletedCq) {
      return res.status(404).json({ success: false, message: 'CQ à¦ªà§à¦°à¦¶à§à¦¨à¦Ÿà¦¿ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿' });
    }
    res.status(200).json({ success: true, message: 'CQ à¦ªà§à¦°à¦¶à§à¦¨à¦Ÿà¦¿ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------
// à¦—. Notes à¦°à¦¾à¦‰à¦Ÿà¦¸
// ------------------------------------------

// à§§. à¦¸à¦•à¦² à¦¨à§‹à¦Ÿà¦¸ à¦«à§‡à¦š à¦•à¦°à¦¾
app.get('/api/notes', async (req, res) => {
  try {
    const { category, type } = req.query;
    let filter = {};

    if (category) filter.category = { $regex: new RegExp(category.trim(), 'i') };
    if (type) filter.type = { $regex: new RegExp(type.trim(), 'i') };

    const notes = await Note.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'à¦¨à§‹à¦Ÿà¦¸ à¦«à§‡à¦š à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦¤à§à¦°à§à¦Ÿà¦¿ à¦¹à§Ÿà§‡à¦›à§‡',
      error: error.message
    });
  }
});

// à§¨. à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦¨à§‹à¦Ÿ à¦«à§‡à¦š à¦•à¦°à¦¾
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'à¦¨à§‹à¦Ÿà¦Ÿà¦¿ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// à§©. à¦¨à¦¤à§à¦¨ à¦¨à§‹à¦Ÿ à¦¸à§‡à¦­ à¦•à¦°à¦¾ (POST)
app.post('/api/notes', async (req, res) => {
  try {
    const { title, type, category, content, pdfUrl } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ title, category à¦à¦¬à¦‚ content à¦ªà§à¦°à¦¦à¦¾à¦¨ à¦•à¦°à§à¦¨'
      });
    }

    const newNote = new Note({
      title: title.trim(),
      type: type ? type.trim() : 'Lecture Note',
      category: category.trim(),
      content: content.trim(),
      pdfUrl: pdfUrl ? pdfUrl.trim() : ''
    });

    const savedNote = await newNote.save();
    res.status(201).json({
      success: true,
      message: 'à¦¨à§‹à¦Ÿ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡!',
      data: savedNote
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'à¦¨à§‹à¦Ÿ à¦¸à§‡à¦­ à¦•à¦°à¦¤à§‡ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¹à§Ÿà§‡à¦›à§‡',
      error: error.message
    });
  }
});

// à§ª. à¦¨à§‹à¦Ÿ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦•à¦°à¦¾
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ success: false, message: 'à¦¨à§‹à¦Ÿà¦Ÿà¦¿ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿' });
    }
    res.status(200).json({ success: true, message: 'à¦¨à§‹à¦Ÿà¦Ÿà¦¿ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------
// à¦˜. à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œ à¦¸à¦¿à¦¡à¦¿à¦‚ à¦à¦¨à§à¦¡à¦ªà§Ÿà§‡à¦¨à§à¦Ÿ (POST /api/seed)
// ------------------------------------------
app.post('/api/seed', async (req, res) => {
  try {
    const sampleMcqs = [
      {
        categoryType: 'Board Question',
        chapter: 'Chapter 3: Number System & Logic Gate',
        boardName: 'Dhaka Board',
        examYear: '2024',
        collegeName: '',
        testPaperName: 'Royal Test Paper',
        modelTestNo: '',
        question: 'à¦¬à¦¾à¦‡à¦¨à¦¾à¦°à¦¿ à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦ªà¦¦à§à¦§à¦¤à¦¿ (1101)â‚‚ à¦à¦° à¦¦à¦¶à¦®à¦¿à¦•à§‡ à¦®à¦¾à¦¨ à¦•à¦¤?',
        options: ['11', '12', '13', '15'],
        correctAnswer: '13',
        explanation: '1Ã—2Â³ + 1Ã—2Â² + 0Ã—2Â¹ + 1Ã—2â° = 8 + 4 + 0 + 1 = 13'
      },
      {
        categoryType: 'College Test Paper',
        chapter: 'Chapter 3: Number System & Logic Gate',
        boardName: '',
        examYear: '2025',
        collegeName: 'Notre Dame College',
        testPaperName: 'Lecture Test Paper',
        modelTestNo: 'Model Test 01',
        question: 'à¦•à§‹à¦¨ à¦²à¦œà¦¿à¦• à¦—à§‡à¦‡à¦Ÿà¦Ÿà¦¿ à¦‡à¦¨à¦­à¦¾à¦°à§à¦Ÿà¦¾à¦° (Inverter) à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡?',
        options: ['AND Gate', 'OR Gate', 'NOT Gate', 'NAND Gate'],
        correctAnswer: 'NOT Gate',
        explanation: 'NOT à¦—à§‡à¦‡à¦Ÿà§‡ à¦à¦•à¦Ÿà¦¿ à¦‡à¦¨à¦ªà§à¦Ÿ à¦¥à¦¾à¦•à§‡ à¦à¦¬à¦‚ à¦à¦Ÿà¦¿ à¦‡à¦¨à¦ªà§à¦Ÿà¦•à§‡ à¦‰à¦²à§à¦Ÿà§‡ à¦¦à§‡à§Ÿà¥¤'
      },
      {
        categoryType: 'Chapter Practice',
        chapter: 'Chapter 4: Web Design & HTML',
        boardName: 'All Boards',
        examYear: '2024',
        collegeName: '',
        testPaperName: '',
        modelTestNo: '',
        question: 'HTML-à¦ à¦¹à¦¾à¦‡à¦ªà¦¾à¦°à¦²à¦¿à¦‚à¦• à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§à¦¯ à¦•à§‹à¦¨ à¦Ÿà§à¦¯à¦¾à¦— à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿ?',
        options: ['<link>', '<a>', '<href>', '<hyperlink>'],
        correctAnswer: '<a>',
        explanation: '<a> (Anchor) à¦Ÿà§à¦¯à¦¾à¦—à§‡à¦° à¦¸à¦¾à¦¹à¦¾à¦¯à§à¦¯à§‡ à¦“à§Ÿà§‡à¦¬à¦ªà§‡à¦œà§‡ à¦²à¦¿à¦™à§à¦• à¦¯à§à¦•à§à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà¥¤'
      },
      {
        categoryType: 'Model Test',
        chapter: 'Chapter 5: Programming Language',
        boardName: '',
        examYear: '2026',
        collegeName: 'Dhaka College',
        testPaperName: 'Panjeree Test Paper',
        modelTestNo: 'Model Test 02',
        question: 'C à¦­à¦¾à¦·à¦¾à§Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦«à¦¾à¦‡à¦² à¦¯à§à¦•à§à¦¤ à¦•à¦°à¦¾à¦° à¦¸à¦ à¦¿à¦• à¦¸à¦¿à¦¨à¦Ÿà§à¦¯à¦¾à¦•à§à¦¸ à¦•à§‹à¦¨à¦Ÿà¦¿?',
        options: ['#include <stdio.h>', '#import <stdio.h>', 'using namespace std;', 'import stdio.h;'],
        correctAnswer: '#include <stdio.h>',
        explanation: 'C à¦²à§à¦¯à¦¾à¦™à§à¦—à§à§Ÿà§‡à¦œà§‡ à¦ªà§à¦°à¦¿à¦ªà§à¦°à¦¸à§‡à¦¸à¦° à¦¡à¦¿à¦°à§‡à¦•à§à¦Ÿà¦¿à¦­ #include à¦¦à¦¿à§Ÿà§‡ à¦¹à§‡à¦¡à¦¾à¦° à¦«à¦¾à¦‡à¦² à¦¯à§à¦•à§à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà¥¤'
      }
    ];

    const sampleCqs = [
      {
        categoryType: 'Board Question',
        chapter: 'Chapter 3: Number System & Logic Gate',
        boardName: 'Dhaka Board',
        examYear: '2024',
        collegeName: '',
        testPaperName: 'Royal Test Paper',
        modelTestNo: '',
        stem: 'à¦†à¦‡à¦¸à¦¿à¦Ÿà¦¿ à¦•à§à¦²à¦¾à¦¸à§‡ à¦¶à¦¿à¦•à§à¦·à¦• à¦…à§Ÿà¦¨ à¦“ à¦¸à§à¦®à¦¨à¦¾ à¦¦à§à¦œà¦¨ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦•à§‡ à¦¦à§à¦Ÿà¦¿ à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦²à¦¿à¦–à¦¤à§‡ à¦¬à¦²à¦²à§‡à¦¨à¥¤ à¦…à§Ÿà¦¨ à¦²à¦¿à¦–à¦² (37)â‚ˆ à¦à¦¬à¦‚ à¦¸à§à¦®à¦¨à¦¾ à¦²à¦¿à¦–à¦² (2B)â‚â‚†à¥¤ à¦à¦°à¦ªà¦° à¦¶à¦¿à¦•à§à¦·à¦• à¦¬à¦²à¦²à§‡à¦¨, "à¦¤à§‹à¦®à¦°à¦¾ à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦¦à§à¦Ÿà¦¿à¦•à§‡ à§¨-à¦à¦° à¦ªà¦°à¦¿à¦ªà§‚à¦°à¦• à¦ªà¦¦à§à¦§à¦¤à¦¿à¦¤à§‡ à¦¯à§‹à¦— à¦•à¦°à§‡ à¦¦à§‡à¦–à¦¾à¦“à¥¤"',
        q_ka: 'à¦¬à¦¾à¦‡à¦¨à¦¾à¦°à¦¿ à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦ªà¦¦à§à¦§à¦¤à¦¿ à¦•à¦¾à¦•à§‡ à¦¬à¦²à§‡?',
        a_ka: 'à¦¯à§‡ à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦ªà¦¦à§à¦§à¦¤à¦¿à¦¤à§‡ à¦¹à¦¿à¦¸à¦¾à¦¬-à¦¨à¦¿à¦•à¦¾à¦¶à§‡à¦° à¦œà¦¨à§à¦¯ à¦•à§‡à¦¬à¦² à¦¦à§à¦Ÿà¦¿ à¦…à¦‚à¦• à¦¬à¦¾ à¦ªà§à¦°à¦¤à§€à¦• (à§¦ à¦à¦¬à¦‚ à§§) à¦¬à§à¦¯à¦¬à¦¹à§ƒà¦¤ à¦¹à§Ÿ, à¦¤à¦¾à¦•à§‡ à¦¬à¦¾à¦‡à¦¨à¦¾à¦°à¦¿ à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦ªà¦¦à§à¦§à¦¤à¦¿ à¦¬à¦²à§‡à¥¤',
        q_kha: 'à§§ + à§§ = à§§ à¦à¦¬à¦‚ à§§ + à§§ = à§§à§¦ à¦¬à§à¦¯à¦¾à¦–à§à¦¯à¦¾ à¦•à¦°à§‹à¥¤',
        a_kha: 'à¦ªà§à¦°à¦¥à¦®à¦Ÿà¦¿ à¦¬à§à¦²à¦¿à§Ÿà¦¾à¦¨ à¦…à§à¦¯à¦¾à¦²à¦œà§‡à¦¬à¦°à¦¾à¦° à¦¯à§Œà¦•à§à¦¤à¦¿à¦• à¦¯à§‹à¦— (Logical OR operation), à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¦à§à¦Ÿà¦¿ à¦šà¦²à¦•à§‡à¦° à¦®à¦¾à¦¨ à¦¸à¦¤à§à¦¯ (à§§) à¦¹à¦²à§‡ à¦¤à¦¾à¦¦à§‡à¦° à¦«à¦²à¦¾à¦«à¦²à¦“ à¦¸à¦¤à§à¦¯ (à§§) à¦¹à§Ÿà¥¤ à¦¦à§à¦¬à¦¿à¦¤à§€à§Ÿà¦Ÿà¦¿ à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦¬à¦¾à¦‡à¦¨à¦¾à¦°à¦¿ à¦¯à§‹à¦—, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à§§ à¦“ à§§ à¦¯à§‹à¦— à¦•à¦°à¦²à§‡ à¦¯à§‹à¦—à¦«à¦² à§¦ à¦à¦¬à¦‚ à¦•à§à¦¯à¦¾à¦°à¦¿ à§§ à¦¥à¦¾à¦•à§‡, à¦…à¦°à§à¦¥à¦¾à§Ž (à§§à§¦)â‚‚ à¦¹à§Ÿà¥¤',
        q_ga: 'à¦…à§Ÿà¦¨ à¦“ à¦¸à§à¦®à¦¨à¦¾à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾à¦° à¦®à¦§à§à¦¯à§‡ à¦¦à¦¶à¦®à¦¿à¦• à¦®à¦¾à¦¨à§‡à¦° à¦ªà¦¾à¦°à§à¦¥à¦•à§à¦¯ à¦¨à¦¿à¦°à§à¦£à§Ÿ à¦•à¦°à§‹à¥¤',
        a_ga: 'à¦…à§Ÿà¦¨à§‡à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾ (37)â‚ˆ = 3Ã—8Â¹ + 7Ã—8â° = 24 + 7 = 31à¥¤ à¦¸à§à¦®à¦¨à¦¾à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾ (2B)â‚â‚† = 2Ã—16Â¹ + 11Ã—16â° = 32 + 11 = 43à¥¤ à¦¸à§à¦¤à¦°à¦¾à¦‚ à¦¦à¦¶à¦®à¦¿à¦•à§‡à¦° à¦ªà¦¾à¦°à§à¦¥à¦•à§à¦¯ = 43 - 31 = 12à¥¤',
        q_gha: 'à§¨-à¦à¦° à¦ªà¦°à¦¿à¦ªà§‚à¦°à¦• à¦ªà¦¦à§à¦§à¦¤à¦¿ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡ à¦¸à§à¦®à¦¨à¦¾à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦¹à¦¤à§‡ à¦…à§Ÿà¦¨à§‡à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦¬à¦¿à§Ÿà§‹à¦— à¦¸à¦®à§à¦­à¦¬ à¦•à¦¿ à¦¨à¦¾â€”à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£ à¦•à¦°à§‹à¥¤',
        a_gha: 'à¦¹à§à¦¯à¦¾à¦, à§¨-à¦à¦° à¦ªà¦°à¦¿à¦ªà§‚à¦°à¦• à¦ªà¦¦à§à¦§à¦¤à¦¿à¦¤à§‡ à¦¯à§‹à¦—à§‡à¦° à¦®à¦¾à¦§à§à¦¯à¦®à§‡à¦‡ à¦¬à¦¿à§Ÿà§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¥¤ à¦…à§Ÿà¦¨à§‡à¦° à¦®à¦¾à¦¨ à§©à§§ à¦à¦° à§®-à¦¬à¦¿à¦Ÿ à§¨-à¦à¦° à¦ªà¦°à¦¿à¦ªà§‚à¦°à¦• à¦®à¦¾à¦¨ à¦¨à¦¿à§Ÿà§‡ à¦¸à§à¦®à¦¨à¦¾à¦° à¦®à¦¾à¦¨ à§ªà§© à¦à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§‹à¦— à¦•à¦°à¦²à§‡ à¦«à¦²à¦¾à¦«à¦² (+à§§à§¨) à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¥¤'
      },
      {
        categoryType: 'College Test Paper',
        chapter: 'Chapter 5: Programming Language',
        boardName: '',
        examYear: '2025',
        collegeName: 'Notre Dame College',
        testPaperName: 'Made Easy',
        modelTestNo: 'Model Test 01',
        stem: 'à¦à¦•à¦Ÿà¦¿ à¦Ÿà§‡à¦¸à§à¦Ÿ à¦ªà§à¦°à§‹à¦—à§à¦°à¦¾à¦®à§‡ à§§ à¦¥à§‡à¦•à§‡ à§§à§¦à§¦ à¦ªà¦°à§à¦¯à¦¨à§à¦¤ à¦¬à¦¿à¦œà§‹à§œ à¦¸à¦‚à¦–à§à¦¯à¦¾à¦—à§à¦²à§‹à¦° à¦¯à§‹à¦—à¦«à¦² à¦¨à¦¿à¦°à§à¦£à§Ÿà§‡à¦° à¦œà¦¨à§à¦¯ à¦à¦•à¦Ÿà¦¿ à¦…à§à¦¯à¦¾à¦²à¦—à¦°à¦¿à¦¦à¦® à¦“ à¦¸à¦¿ à¦ªà§à¦°à§‹à¦—à§à¦°à¦¾à¦® à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦²à§‹à¥¤',
        q_ka: 'à¦•à§€-à¦“à§Ÿà¦¾à¦°à§à¦¡ (Keyword) à¦•à§€?',
        a_ka: 'à¦ªà§à¦°à§‹à¦—à§à¦°à¦¾à¦®à¦¿à¦‚ à¦­à¦¾à¦·à¦¾à§Ÿ à¦ªà§‚à¦°à§à¦¬à§‡ à¦¥à§‡à¦•à§‡ à¦¸à¦‚à¦°à¦•à§à¦·à¦¿à¦¤ à¦“ à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦…à¦°à§à¦¥à¦ªà§‚à¦°à§à¦£ à¦¶à¦¬à§à¦¦à¦¸à¦®à§‚à¦¹à¦•à§‡ à¦•à§€-à¦“à§Ÿà¦¾à¦°à§à¦¡ à¦¬à¦²à¦¾ à¦¹à§Ÿ (à¦¯à§‡à¦®à¦¨: int, float, if, for)à¥¤',
        q_kha: 'à¦•à¦®à§à¦ªà¦¾à¦‡à¦²à¦¾à¦° à¦“ à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦ªà§à¦°à§‡à¦Ÿà¦¾à¦°à§‡à¦° à¦®à¦§à§à¦¯à§‡ à¦¦à§à¦Ÿà¦¿ à¦ªà¦¾à¦°à§à¦¥à¦•à§à¦¯ à¦²à§‡à¦–à§‹à¥¤',
        a_kha: 'à§§. à¦•à¦®à§à¦ªà¦¾à¦‡à¦²à¦¾à¦° à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ à¦¸à§‹à¦°à§à¦¸ à¦•à§‹à¦¡à¦•à§‡ à¦à¦•à¦¸à¦¾à¦¥à§‡ à¦…à¦¨à§à¦¬à¦¾à¦¦ à¦•à¦°à§‡, à¦ªà¦•à§à¦·à¦¾à¦¨à§à¦¤à¦°à§‡ à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦ªà§à¦°à§‡à¦Ÿà¦¾à¦° à¦²à¦¾à¦‡à¦¨ à¦¬à¦¾à¦‡ à¦²à¦¾à¦‡à¦¨ à¦…à¦¨à§à¦¬à¦¾à¦¦ à¦•à¦°à§‡à¥¤ à§¨. à¦•à¦®à§à¦ªà¦¾à¦‡à¦²à¦¾à¦°à§‡ à¦ªà§à¦°à§‹à¦—à§à¦°à¦¾à¦® à¦¸à¦®à§à¦ªà¦¾à¦¦à¦¨à§‡ à¦¸à¦®à§Ÿ à¦•à¦® à¦²à¦¾à¦—à§‡, à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦ªà§à¦°à§‡à¦Ÿà¦¾à¦°à§‡ à¦¤à§à¦²à¦¨à¦¾à¦®à§‚à¦²à¦• à¦¬à§‡à¦¶à¦¿ à¦¸à¦®à§Ÿ à¦²à¦¾à¦—à§‡à¥¤',
        q_ga: 'à¦‰à¦¦à§à¦¦à§€à¦ªà¦•à§‡à¦° à¦¸à¦®à¦¸à§à¦¯à¦¾à¦Ÿà¦¿à¦° à¦œà¦¨à§à¦¯ à¦à¦•à¦Ÿà¦¿ à¦«à§à¦²à§‹à¦šà¦¾à¦°à§à¦Ÿ à¦…à¦™à§à¦•à¦¨ à¦•à¦°à§‹à¥¤',
        a_ga: 'à¦¸à§à¦Ÿà¦¾à¦°à§à¦Ÿ -> à¦¸à¦¾à¦® = à§¦, à¦†à¦‡ = à§§ -> à¦•à¦¨à§à¦¡à¦¿à¦¶à¦¨ à¦†à¦‡ <= à§§à§¦à§¦ -> à¦¸à¦¾à¦® = à¦¸à¦¾à¦® + à¦†à¦‡ -> à¦†à¦‡ = à¦†à¦‡ + à§¨ -> à¦ªà§à¦°à¦¿à¦¨à§à¦Ÿ à¦¸à¦¾à¦® -> à¦¸à§à¦Ÿà¦ªà¥¤',
        q_gha: 'à¦‰à¦¦à§à¦¦à§€à¦ªà¦•à§‡à¦° à¦¸à¦®à¦¸à§à¦¯à¦¾à¦Ÿà¦¿ for à¦²à§à¦ª à¦“ while à¦²à§à¦ª à¦‰à¦­à§Ÿà§‡à¦° à¦®à¦¾à¦§à§à¦¯à¦®à§‡à¦‡ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦¸à¦®à§à¦­à¦¬â€”à¦¸à¦¿ à¦•à§‹à¦¡ à¦²à¦¿à¦–à§‡ à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£ à¦•à¦°à§‹à¥¤',
        a_gha: 'for(int i=1; i<=100; i+=2) sum+=i; à¦à¦¬à¦‚ i=1; while(i<=100){ sum+=i; i+=2; } à¦‰à¦­à§Ÿ à¦•à¦¾à¦ à¦¾à¦®à§‹à¦¤à§‡à¦‡ à¦¶à¦°à§à¦¤ à¦“ à¦¬à§ƒà¦¦à§à¦§à¦¿à¦° à¦¬à¦¿à¦¨à§à¦¯à¦¾à¦¸ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦¸à¦®à¦®à¦¾à¦¨à§‡à¦° à¦†à¦‰à¦Ÿà¦ªà§à¦Ÿ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¥¤'
      }
    ];

    const sampleNotes = [
      {
        title: 'HSC ICT à§¨à§¦à§¨à§ª à¦¢à¦¾à¦•à¦¾ à¦¬à§‹à¦°à§à¦¡ - à§©à§Ÿ à¦…à¦§à§à¦¯à¦¾à§Ÿ à¦¸à§ƒà¦œà¦¨à¦¶à§€à¦² à¦¸à¦®à¦¾à¦§à¦¾à¦¨',
        type: 'Board Question',
        category: 'à¦¬à§‹à¦°à§à¦¡ à¦•à§‹à¦¶à§à¦šà§‡à¦¨',
        content: 'à¦¢à¦¾à¦•à¦¾ à¦¬à§‹à¦°à§à¦¡ à§¨à§¦à§¨à§ª à¦à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦ªà¦¦à§à¦§à¦¤à¦¿ à¦“ à¦¡à¦¿à¦œà¦¿à¦Ÿà¦¾à¦² à¦¡à¦¿à¦­à¦¾à¦‡à¦¸ à¦…à¦‚à¦¶à§‡à¦° à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ à¦ªà§à¦°à¦¶à§à¦¨ à¦¸à¦®à¦¾à¦§à¦¾à¦¨à¥¤',
        pdfUrl: 'https://example.com/hsc-ict-dhaka-2024.pdf'
      }
    ];

    await Mcq.deleteMany({});
    await Cq.deleteMany({});
    await Note.deleteMany({});

    await Mcq.insertMany(sampleMcqs);
    await Cq.insertMany(sampleCqs);
    await Note.insertMany(sampleNotes);

    res.status(201).json({
      success: true,
      message: 'âœ… à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œà§‡ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦ªà§à¦°à¦¾à¦¥à¦®à¦¿à¦• à¦¸à§à¦¯à¦¾à¦®à§à¦ªà¦² à¦¡à¦¾à¦Ÿà¦¾ (MCQs, CQs à¦à¦¬à¦‚ Notes) à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'à¦¡à¦¾à¦Ÿà¦¾ à¦¸à¦¿à¦¡ à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦à¦°à¦° à¦¹à§Ÿà§‡à¦›à§‡',
      error: error.message
    });
  }
});

// ==========================================
// à§«. à§ªMD à¦“ à¦à¦°à¦° à¦¹à§à¦¯à¦¾à¦¨à§à¦¡à¦²à¦¿à¦‚ à¦®à¦¿à¦¡à¦²à¦“à§Ÿà§à¦¯à¦¾à¦°
// ==========================================
// ঙ. PDF Management API Routes
// ==========================================

// ১. সকল PDF ফেচ করা (ফিল্টার ও সার্চ সহ)
app.get('/api/pdfs', async (req, res) => {
  try {
    const { category, chapter, search } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category.trim();
    }

    if (chapter && chapter !== 'all') {
      filter.chapter = { $regex: new RegExp(chapter.trim(), 'i') };
    }

    if (search) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: new RegExp(q, 'i') } },
        { description: { $regex: new RegExp(q, 'i') } },
        { chapter: { $regex: new RegExp(q, 'i') } }
      ];
    }

    const pdfs = await Pdf.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pdfs.length,
      data: pdfs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পিডিএফ তালিকা লোড করতে সমস্যা হয়েছে',
      error: error.message
    });
  }
});

// ২. নির্দিষ্ট একটি PDF ফেচ করা
app.get('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'পিডিএফ পাওয়া যায়নি' });
    }
    res.status(200).json({ success: true, data: pdf });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ৩. নতুন PDF আপলোড করা (ফাইল আপলোড সহ)
app.post('/api/pdfs', (req, res) => {
  uploadPdf.single('pdfFile')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'ফাইল আপলোড করতে ব্যর্থ হয়েছে'
      });
    }

    try {
      const { title, category, chapter, description, pagesCount, directPdfUrl } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'পিডিএফ-এর শিরোনাম (title) আবশ্যক'
        });
      }

      let pdfUrl = '';
      let originalFileName = '';
      let fileSize = '১.০ MB';

      if (req.file) {
        pdfUrl = '/uploads/pdfs/' + req.file.filename;
        originalFileName = req.file.originalname;
        const sizeMb = (req.file.size / (1024 * 1024)).toFixed(1);
        fileSize = sizeMb > 0 ? `${sizeMb} MB` : `${Math.round(req.file.size / 1024)} KB`;
        syncPdfFileToFrontend(req.file.filename);
      } else if (directPdfUrl) {
        pdfUrl = directPdfUrl.trim();
        originalFileName = title + '.pdf';
      } else {
        return res.status(400).json({
          success: false,
          message: 'একটি PDF ফাইল আপলোড করুন অথবা সরাসরি পিডিএফ লিংক প্রদান করুন'
        });
      }

      const newPdf = new Pdf({
        title: title.trim(),
        category: category ? category.trim() : 'suggestion',
        chapter: chapter ? chapter.trim() : 'সকল অধ্যায়',
        description: description ? description.trim() : '',
        pdfUrl,
        originalFileName,
        fileSize: req.body.fileSize || fileSize,
        pagesCount: pagesCount ? pagesCount.trim() : '১০ পৃষ্ঠা',
        downloadsCount: 0
      });

      const savedPdf = await newPdf.save();
      await syncPdfsJson();
      autoPushToGitHub(`Add PDF suggestion: ${title.trim()}`);

      res.status(201).json({
        success: true,
        message: 'পিডিএফ সফলভাবে আপলোড ও সংরক্ষণ করা হয়েছে!',
        data: savedPdf
      });
    } catch (dbError) {
      res.status(500).json({
        success: false,
        message: 'পিডিএফ ডাটাবেজে সংরক্ষণ করতে সমস্যা হয়েছে',
        error: dbError.message
      });
    }
  });
});

// ৪. পিডিএফ ডিলিট করা (ফাইল ও ডাটাবেজ রেকর্ড)
app.delete('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'পিডিএফ পাওয়া যায়নি' });
    }

    // লোকাল ফাইল হলে ডিস্ক থেকে মুছে ফেলা
    if (pdf.pdfUrl && pdf.pdfUrl.startsWith('/uploads/pdfs/')) {
      const filename = path.basename(pdf.pdfUrl);
      removePdfFileFromFrontend(filename);
    }

    await Pdf.findByIdAndDelete(req.params.id);
    await syncPdfsJson();
    autoPushToGitHub(`Delete PDF: ${pdf.title || 'item'}`);

    res.status(200).json({
      success: true,
      message: 'পিডিএফ সফলভাবে ডিলিট করা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ৫. ডাউনলোড কাউন্টার বৃদ্ধি
app.post('/api/pdfs/:id/download', async (req, res) => {
  try {
    const pdf = await Pdf.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { returnDocument: 'after' }
    );
    res.status(200).json({ success: true, downloadsCount: pdf ? pdf.downloadsCount : 0 });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});


// ৬. ম্যানুয়াল GitHub সিঙ্ক API
app.post('/api/sync-github', async (req, res) => {
  const repoDir = __dirname;
  if (!fs.existsSync(path.join(repoDir, '.git'))) {
    return res.status(400).json({ success: false, message: 'Git repository পাওয়া যায়নি' });
  }

  await syncDatabaseJson('all');

  exec('git add . && git status --porcelain', { cwd: repoDir }, (stErr, stdout) => {
    if (stErr) {
      return res.status(500).json({ success: false, message: 'Git status ত্রুটি: ' + stErr.message });
    }
    const hasChanges = stdout && stdout.trim().length > 0;
    const finalCmd = hasChanges
      ? `git commit -m "Manual sync from Admin Dashboard [${new Date().toLocaleString()}]" && git push origin main`
      : `git push origin main`;

    exec(finalCmd, { cwd: repoDir }, (pushErr, pushOut, pushStderr) => {
      if (pushErr) {
        return res.status(500).json({ success: false, message: 'Git push ত্রুটি: ' + (pushStderr || pushErr.message) });
      }
      res.status(200).json({
        success: true,
        message: 'GitHub Pages-এ সফলভাবে ডেটা সিঙ্ক করা হয়েছে! ১ মিনিটের মধ্যে লাইভ আপডেট দেখতে পাবেন।'
      });
    });
  });
});

// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `âŒ à¦•à¦¾à¦™à§à¦•à§à¦·à¦¿à¦¤ à¦°à¦¾à¦‰à¦Ÿ ${req.originalUrl} à¦–à§à¦à¦œà§‡ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿!`
  });
});

app.use((err, req, res, next) => {
  console.error('à¦¸à¦¾à¦°à§à¦­à¦¾à¦° à¦à¦°à¦°:', err.stack);
  res.status(500).json({
    success: false,
    message: 'à¦¸à¦¾à¦°à§à¦­à¦¾à¦°à§‡ à¦…à¦­à§à¦¯à¦¨à§à¦¤à¦°à§€à¦£ à¦•à§‹à¦¨à§‹ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¹à§Ÿà§‡à¦›à§‡',
    error: err.message
  });
});

// ==========================================
// à§¬. à¦¸à¦¾à¦°à§à¦­à¦¾à¦° à¦²à¦¿à¦¸à§‡à¦¨à¦¿à¦‚
// ==========================================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ðŸš€ à¦¸à¦¾à¦°à§à¦­à¦¾à¦° à¦šà¦¾à¦²à§ à¦¹à§Ÿà§‡à¦›à§‡: http://localhost:${PORT}`);
    console.log(`ðŸ“ à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦¡à§à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§à¦¡: http://localhost:${PORT}/admin.html`);
    console.log(`ðŸŒ à¦«à§à¦°à¦¨à§à¦Ÿà¦à¦¨à§à¦¡ Origin à¦¸à¦¾à¦ªà§‹à¦°à§à¦Ÿà§‡à¦¡: https://jahidolislamlablo-design.github.io`);
  });
}


module.exports = { app, Mcq, Cq, Note, Pdf };


