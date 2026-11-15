const mongoose = require('mongoose');

// Connect to MongoDB
const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ict_easy_learning';

const CqSchema = new mongoose.Schema({
  categoryTypes: { type: [String], default: ['Board Question', 'Chapter Practice'] },
  categoryType: { type: String, default: 'Board Question', trim: true },
  chapters: { type: [String], default: [] },
  chapter: { type: String, required: true, trim: true },
  boardNames: { type: [String], default: [] },
  boardName: { type: String, default: '', trim: true },
  examYears: { type: [String], default: [] },
  examYear: { type: String, default: '', trim: true },
  collegeNames: { type: [String], default: [] },
  collegeName: { type: String, default: '', trim: true },
  testPaperName: { type: String, default: '', trim: true },
  modelTestNos: { type: [String], default: [] },
  modelTestNo: { type: String, default: '', trim: true },
  liveExamNo: { type: String, default: '', trim: true },
  serialNo: { type: Number, default: 0 },
  image: { type: String, default: '', trim: true },
  stem: { type: String, required: true, trim: true },
  q_ka: { type: String, required: true, trim: true },
  a_ka: { type: String, default: '', trim: true },
  q_kha: { type: String, required: true, trim: true },
  a_kha: { type: String, default: '', trim: true },
  q_ga: { type: String, required: true, trim: true },
  a_ga: { type: String, default: '', trim: true },
  q_gha: { type: String, required: true, trim: true },
  a_gha: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now }
});

const CQ = mongoose.models.CQ || mongoose.model('CQ', CqSchema);

// Full list of 40 CQs
const CHAPTER_NAME = 'Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML';

const CQS_DATA = [
  // 1. ঢাকা বোর্ড-২০২৩
  {
    serialNo: 1,
    boardName: 'Dhaka Board',
    examYear: '2023',
    stem: `দৃশ্যকল্প-১:\n| A & H Company Ltd. |\n| :---: |\n| Order List | Unorder List |\n| i. Book<br>ii. Paper<br>iii. Note Book | • Marker<br>• Ink<br>• Pencil |\n\nদৃশ্যকল্প-২: একটি হায়ারারকিক্যাল বা ট্রি কাঠামো (Home -> Page-1, Page-2, Page-3 -> Page-2.1, Page-2.2)।\n\nদৃশ্যকল্প-৩: www.xyz.edu.bd ওয়েবসাইটটি ভিজিট করে রাজিব দেখে যে ওয়েবসাইটটির যে কোনো পেইজ থেকে অন্য পেইজে যাওয়া যায়।`,
    q_ka: `(ক) ওয়্যারফ্রেম কী?`,
    a_ka: `(ক) ওয়্যারফ্রেম বলতে একটি ওয়েবসাইটের ভিজ্যুয়াল গাইড বা কঙ্কাল কাঠামোকে বোঝায়, যা ওয়েবসাইটের লেআউট ও উপাদানসমূহের প্রাথমিক নকশা বা ব্লু-প্রিন্ট হিসেবে কাজ করে।`,
    q_kha: `(খ) HTML এ কোনটি ডকুমেন্টের অংশ নয়, তবে লেখা জরুরি?`,
    a_kha: `(খ) সাধারণত HTML ফাইলে <!DOCTYPE html> ডকুমেন্টের মূল অংশ নয়, তবে লেখা জরুরি। এটি একটি ডকুমেন্ট টাইপ ডিক্লারেশন (DTD)। এর মাধ্যমে ব্রাউজার বুঝতে পারে ডকুমেন্টটি HTML এর কোন সংস্করণ (যেমন- HTML5) অনুযায়ী লেখা হয়েছে এবং সে অনুযায়ী রেন্ডার প্রদর্শন করে।`,
    q_ga: `(গ) উদ্দীপকের দৃশ্যকল্প-১ এর মতো ওয়েবপেইজ তৈরির জন্য প্রয়োজনীয় HTML কোড লিখ।`,
    a_ga: `(গ) উদ্দীপকের দৃশ্যকল্প-১ এর মতো ওয়েবপেইজ তৈরির জন্য প্রয়োজনীয় HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML List</title>\n</head>\n<body>\n    <table border="2">\n        <tr>\n            <th colspan="2" align="center">A & H Company Ltd.</th>\n        </tr>\n        <tr>\n            <td align="center">Order List</td>\n            <td align="center">Unorder List</td>\n        </tr>\n        <tr>\n            <td>\n                <ol type="i">\n                    <li>Book</li>\n                    <li>Paper</li>\n                    <li>Note Book</li>\n                </ol>\n            </td>\n            <td>\n                <ul type="square">\n                    <li>Marker</li>\n                    <li>Ink</li>\n                    <li>Pencil</li>\n                </ul>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) দৃশ্যকল্প-২ এবং দৃশ্যকল্প-৩ এ প্রতিফলিত ওয়েবসাইটের কাঠামোর মধ্যে কোনটি অধিক সুবিধাজনক?`,
    a_gha: `(ঘ) দৃশ্যকল্প-২ এর কাঠামোটি হলো হায়ারারকিক্যাল (Hierarchical / Tree) এবং দৃশ্যকল্প-৩ এর কাঠামোটি হলো নেটওয়ার্ক বা ওয়েব লিংকড (Web-linked) কাঠামো।\nএই দুটি কাঠামোর মধ্যে হায়ারারকিক্যাল কাঠামোটি অধিক সুবিধাজনক। কারণ এতে মূল পেজ থেকে সাব-টপিকগুলোতে ধাপে ধাপে সুশৃঙ্খলভাবে যাওয়া যায় এবং ব্যবহারকারী সহজেই বুঝতে পারেন তিনি ওয়েবসাইটের কোথায় অবস্থান করছেন। এছাড়া বড় ওয়েবসাইটের ক্ষেত্রে এটি সহজে নেভিগেট করা যায়। পক্ষান্তরে নেটওয়ার্ক কাঠামোতে পেজ সংখ্যা বাড়ার সাথে সাথে এর স্ট্রাকচার অত্যন্ত জটিল রূপ ধারণ করে।`
  },

  // 2. রাজশাহী বোর্ড-২০২৩
  {
    serialNo: 2,
    boardName: 'Rajshahi Board',
    examYear: '2023',
    stem: `পাশের চিত্রটি লক্ষ কর এবং নিচের প্রশ্নগুলোর উত্তর দাও:\n1. Month\n   ○ January\n   ○ February\n2. Day\n   ■ Sunday\n   ■ Monday`,
    q_ka: `(ক) অ্যাট্রিবিউট কাকে বলে?`,
    a_ka: `(ক) অ্যাট্রিবিউট হলো এমন কিছু নির্দেশক শব্দ বা বৈশিষ্ট্য যা কোনো HTML ট্যাগের কার্যাবলি বা রূপরেখাকে সুনির্দিষ্টভাবে নির্ধারণ ও নিয়ন্ত্রণ করে।`,
    q_kha: `(খ) “HTML একটি কেস সেনসিটিভ ভাষা নয়”-ব্যাখ্যা কর।`,
    a_kha: `(খ) প্রোগ্রামিং ভাষায় বড় হাতের অক্ষর ও ছোট হাতের অক্ষরের ব্যবহারে অর্থের পার্থক্য ঘটলে তাকে কেস-সেনসিটিভ বলা হয়। কিন্তু HTML-এ ট্যাগ বা অ্যাট্রিবিউটের ক্ষেত্রে বড় বা ছোট হাতের অক্ষরের ব্যবহারে কোনো পার্থক্য ঘটে না (যেমন- <html> এবং <HTML> একই কাজ করে)। তাই HTML কেস-সেনসিটিভ ভাষা নয়।`,
    q_ga: `(গ) উদ্দীপকের পেজটি তৈরিতে কী কী বিশেষ ট্যাগ ও অ্যাট্রিবিউট ব্যবহার করা হয়েছে?`,
    a_ga: `(গ) উদ্দীপকের পেজটি তৈরিতে ব্যবহৃত বিশেষ ট্যাগ ও অ্যাট্রিবিউটসমূহ:\n১. <ol> ট্যাগ: ক্রমানুসারে অর্ডার্ড লিস্ট (১, ২ ইত্যাদি) তৈরির জন্য।\n২. <ul> ট্যাগ: আন-অর্ডার্ড লিস্ট তৈরির জন্য।\n৩. <li> ট্যাগ: লিস্টের উপাদান (List item) প্রদর্শনের জন্য।\n৪. type অ্যাট্রিবিউট: লিস্টের বুলেটের ধরন নির্ধারণের জন্য (যেমন: type="circle" এবং type="square")।\n৫. <table>, <tr>, <td> ট্যাগ: টেবিল কাঠামোর ক্ষেত্রে ব্যবহৃত হয়।`,
    q_gha: `(ঘ) ওয়েব পেজটি প্রদর্শনের জন্য প্রয়োজনীয় HTML Code লিখ।`,
    a_gha: `(ঘ) প্রয়োজনীয় HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Nested List</title>\n</head>\n<body>\n    <ol type="1">\n        <li>Month\n            <ul type="circle">\n                <li>January</li>\n                <li>February</li>\n            </ul>\n        </li>\n        <li>Day\n            <ul type="square">\n                <li>Sunday</li>\n                <li>Monday</li>\n            </ul>\n        </li>\n    </ol>\n</body>\n</html>\n\`\`\``
  },

  // 3. রাজশাহী বোর্ড-২০২৩
  {
    serialNo: 3,
    boardName: 'Rajshahi Board',
    examYear: '2023',
    stem: `চিত্র-১:\nSubject:\n3. English\n4. Bangla\n5. ICT\n\nচিত্র-২: Result Sheet Table\n| Result Sheet (কলাম স্প্যান ২) |\n| :---: |\n| Name | GPA (রো স্প্যান ২) |\n| Roll | |`,
    q_ka: `(ক) হাইপারলিংক কী?`,
    a_ka: `(ক) হাইপারলিংক হলো একটি ওয়েবপেজের কোনো অংশ বা পুরো পেজের সাথে অন্য কোনো ওয়েবপেজ, ফাইল বা ওয়েবসাইটের মধ্যকার সংযোগ ব্যবস্থা।`,
    q_kha: `(খ) ওয়েবসাইট পাবলিশিং ব্যাখ্যা কর।`,
    a_kha: `(খ) একটি ওয়েবসাইট তৈরি করার পর তা বিশ্বব্যাপী ইন্টারনেটে প্রদর্শনের উদ্দেশ্যে কোনো ওয়েব সার্ভারে আপলোড ও উন্মুক্ত করার প্রক্রিয়াকে ওয়েবসাইট পাবলিশিং বলা হয়। এর প্রধান ধাপগুলো হলো: ওয়েবপেজ ডিজাইন, ডোমেন নেম রেজিস্ট্রেশন, ওয়েব হোস্টিং এবং সার্ভারে ফাইল আপলোড।`,
    q_ga: `(গ) চিত্র-১ প্রদর্শনের জন্য HTML কোডিং লিখ।`,
    a_ga: `(গ) চিত্র-১ প্রদর্শনের জন্য HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Subject List</title>\n</head>\n<body>\n    <p align="left">Subject:</p>\n    <ol type="1" start="3">\n        <li>English</li>\n        <li>Bangla</li>\n        <li>ICT</li>\n    </ol>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) চিত্র-২ ওয়েব পেইজে প্রদর্শনের জন্য HTML কোডিং লিখ।`,
    a_gha: `(ঘ) চিত্র-২ প্রদর্শনের জন্য HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Result Sheet Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th colspan="2">Result Sheet</th>\n        </tr>\n        <tr>\n            <td align="center">Name</td>\n            <td rowspan="2" align="center">GPA</td>\n        </tr>\n        <tr>\n            <td align="center">Roll</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 4. কুমিল্লা বোর্ড-২০২৩
  {
    serialNo: 4,
    boardName: 'Cumilla Board',
    examYear: '2023',
    stem: `X কলেজের দ্বাদশ শ্রেণির ছাত্রী আয়েশা HTML ব্যবহার করে ডকুমেন্ট তৈরি করল এবং Google Chrome ব্যবহার করে নিম্নরূপ আউটপুট দেখতে পেল:\n2H₂ + O₂ = 2H₂O`,
    q_ka: `(ক) ব্রাউজার কী?`,
    a_ka: `(ক) ওয়েব ব্রাউজার হলো এমন একটি অ্যাপ্লিকেশন সফটওয়্যার যার মাধ্যমে ব্যবহারকারী ইন্টারনেটে থাকা বিভিন্ন ওয়েবপেজ বা ওয়েবসাইট প্রদর্শন ও ব্রাউজ করতে পারেন।`,
    q_kha: `(খ) <br> ট্যাগ ব্যাখ্যা কর।`,
    a_kha: `(খ) <br> হলো একটি এম্পটি (Empty) ট্যাগ, যার কোনো ক্লোজিং ট্যাগ নেই। এটি কোনো প্যারাগ্রাফ বা টেক্সটের মাঝে লাইন ব্রেক বা পরবর্তী লাইনে যাওয়ার জন্য ব্যবহৃত হয়।`,
    q_ga: `(গ) উদ্দীপকের আলোকে উপরিউক্ত ফলাফল পেতে HTML code লিখ।`,
    a_ga: `(গ) উদ্দীপকের ফলাফল পেতে HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Chemical Equation</title>\n</head>\n<body>\n    <p>2H<sub>2</sub> + O<sub>2</sub> = 2H<sub>2</sub>O</p>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) উক্ত ফলাফলটির পরিবর্তে যদি (H + O)² = H² + 2HO + O² পেতে চাও তবে তোমাকে কোথায় কী পরিবর্তন করতে হবে বিশ্লেষণ কর।`,
    a_gha: `(ঘ) উদ্দীপকের রাসায়নিক সমীকরণে সংখ্যাগুলোকে লাইনের নিচে প্রদর্শনের জন্য সাবস্ক্রিপ্ট ট্যাগ <sub> ব্যবহার করা হয়েছিল। কিন্তু গাণিতিক সমীকরণ (H + O)² = H² + 2HO + O² পাওয়ার জন্য সংখ্যাগুলোকে লাইনের উপরে পাওয়ার হিসেবে প্রদর্শন করতে হবে, যার জন্য সুপারস্ক্রিপ্ট ট্যাগ <sup> ব্যবহার করতে হবে।\n\nপরিবর্তিত HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Formula</title>\n</head>\n<body>\n    <p>(H + O)<sup>2</sup> = H<sup>2</sup> + 2HO + O<sup>2</sup></p>\n</body>\n</html>\n\`\`\`\nএখানে <sub> ট্যাগের পরিবর্তে <sup> ট্যাগ ব্যবহার করাই মূল পরিবর্তন।`
  },

  // 5. কুমিল্লা বোর্ড-২০২৩
  {
    serialNo: 5,
    boardName: 'Cumilla Board',
    examYear: '2023',
    stem: `নিচের চিত্রটি দেখ এবং প্রশ্নগুলোর উত্তর দাও:\n| Science | Commerce | Humanities |\n| :---: | :---: | :---: |\n| Physics | Accounting | History |\n| Chemistry | Management | Islamic History |`,
    q_ka: `(ক) ডায়নামিক ওয়েবসাইট কী?`,
    a_ka: `(ক) যে সকল ওয়েবসাইটের তথ্য বা কনটেন্ট পেজ রিলোড ছাড়াই ব্যবহারকারীর চাহিদা অনুযায়ী স্বয়ংক্রিয়ভাবে পরিবর্তিত ও আপডেট হতে পারে, তাকে ডায়নামিক ওয়েবসাইট বলে।`,
    q_kha: `(খ) ডোমেন নেম IP Address এর পরিপূরক -ব্যাখ্যা কর।`,
    a_kha: `(খ) ইন্টারনেটে যুক্ত প্রতিটি কম্পিউটারের একটি অনন্য গাণিতিক ঠিকানা থাকে যাকে IP Address বলে (যেমন: 192.168.1.1)। কিন্তু মানুষের পক্ষে সংখ্যা মনে রাখা কষ্টকর। তাই মনে রাখার সুবিধার্থে আইপি ঠিকানার বিপরীতে সহজ অক্ষরমূলক যে নাম দেওয়া হয় তাকে ডোমেইন নেম বলে (যেমন: www.google.com)। সুতরাং ডোমেইন নেম মূলত আইপি ঠিকানার পরিপূরক হিসেবে কাজ করে।`,
    q_ga: `(গ) উদ্দীপকের চিত্রটি আউটপুট হিসেবে পাওয়ার জন্য HTML কোডটি লিখ।`,
    a_ga: `(গ) চিত্রটি প্রদর্শনের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <td align="center">Science</td>\n            <td align="center">Commerce</td>\n            <td align="center">Humanities</td>\n        </tr>\n        <tr>\n            <td align="center">Physics</td>\n            <td align="center">Accounting</td>\n            <td align="center">History</td>\n        </tr>\n        <tr>\n            <td align="center">Chemistry</td>\n            <td align="center">Management</td>\n            <td align="center">Islamic History</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) যদি উদ্দীপকের টেবিলের কোড সারিকে (Row) স্তম্ভে (Column) এবং স্তম্ভকে সারিতে পরিণত করা হয় তাহলে কী কী পরিবর্তন হবে -বিশ্লেষণ কর।`,
    a_gha: `(ঘ) উদ্দীপকের টেবিলের সারিকে স্তম্ভে এবং স্তম্ভকে সারিতে রূপান্তর (Transpose) করলে টেবিলটি নিম্নরূপ হবে:\n| Science | Physics | Chemistry |\n| Commerce | Accounting | Management |\n| Humanities | History | Islamic History |\n\nপ্রয়োজনীয় কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Transposed Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <td align="center">Science</td>\n            <td align="center">Physics</td>\n            <td align="center">Chemistry</td>\n        </tr>\n        <tr>\n            <td align="center">Commerce</td>\n            <td align="center">Accounting</td>\n            <td align="center">Management</td>\n        </tr>\n        <tr>\n            <td align="center">Humanities</td>\n            <td align="center">History</td>\n            <td align="center">Islamic History</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 6. যশোর বোর্ড-২০২৩
  {
    serialNo: 6,
    boardName: 'Jashore Board',
    examYear: '2023',
    stem: `চিত্র-১:\nMango:\n  Seasonal Fruit\n  A. Green\n  B. Red\nJack Fruit:\n  National Fruit\n  ■ Green\n  ■ Yellow\n\nউদ্দীপক: একজন ফল ব্যবসায়ী তার প্রতিষ্ঠানের জন্য একটি ওয়েবসাইট তৈরি করে নেয়। যেখানে ফলের বিবরণের জন্য একটি ওয়েবপেজ আছে যার আউটপুট চিত্র- ১ এর ন্যায়। তার ওয়েবসাইটের ফলের দাম নিয়মিত আপডেট হয় না। ফলে ক্রেতারা ভুল তথ্য পায়।`,
    q_ka: `(ক) অ্যাট্রিবিউট কী?`,
    a_ka: `(ক) অ্যাট্রিবিউট হলো HTML ট্যাগের এমন একটি বৈশিষ্ট্য বা উপাদান যা ট্যাগের আচরণ ও রূপরেখা সুনির্দিষ্টভাবে নিয়ন্ত্রণ করে।`,
    q_kha: `(খ) ‘আইপি ঠিকানাই হচ্ছে ডোমেইন নেইম এর গাণিতিক রূপ’ -ব্যাখ্যা কর।`,
    a_kha: `(খ) ইন্টারনেটে প্রতিটি ডিভাইসের সাথে যোগাযোগের জন্য সংখ্যাভিত্তিক গাণিতিক ঠিকানা আইপি অ্যাড্রেস ব্যবহৃত হয়। সাধারণ মানুষের পক্ষে সংখ্যা মনে রাখা কঠিন হওয়ায় এর বিপরীতে অর্থপূর্ণ নাম বা ডোমেইন নেম ব্যবহার করা হয়। সুতরাং আইপি ঠিকানা ডোমেইন নেমের গাণিতিক রূপ।`,
    q_ga: `(গ) চিত্র- ১ এর ন্যায় ফলাফল পেতে HTML কোড লিখ।`,
    a_ga: `(গ) চিত্র-১ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Fruit List</title>\n</head>\n<body>\n    <ul type="none">\n        <li>Mango:\n            <ul type="none">\n                <li>Seasonal Fruit\n                    <ol type="A">\n                        <li>Green</li>\n                        <li>Red</li>\n                    </ol>\n                </li>\n            </ul>\n        </li>\n        <li>Jack Fruit:\n            <ul type="none">\n                <li>National Fruit\n                    <ul type="square">\n                        <li>Green</li>\n                        <li>Yellow</li>\n                    </ul>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) উদ্দীপকের সাপেক্ষে গ্রাহকদের সঠিক তথ্য পেতে ব্যবসায়ীর করণীয় কী? মতামত দাও।`,
    a_gha: `(ঘ) উদ্দীপকের ফল ব্যবসায়ীর ওয়েবসাইটটি বর্তমানে স্ট্যাটিক প্রকৃতির, ফলে ফলের দাম বা কনটেন্ট রিয়েল-টাইমে আপডেট হয় না। গ্রাহকদের সঠিক ও নির্ভরযোগ্য তথ্য দিতে ব্যবসায়ীর করণীয় হলো স্ট্যাটিক ওয়েবসাইটকে ডায়নামিক ওয়েবসাইটে রূপান্তর করা। এজন্য HTML ও CSS এর সাথে সার্ভার সাইড স্ক্রিপ্টিং ভাষা (যেমন: PHP, Node.js বা Python) এবং একটি রিলেশনাল বা ডকুমেন্ট ডেটাবেজ (যেমন: MySQL বা MongoDB) যুক্ত করতে হবে, যাতে অ্যাডমিন প্যানেলের মাধ্যমে প্রতিদিনের ফলের সঠিক দাম সহজেই আপডেট করা যায়।`
  },

  // 7. চট্টগ্রাম বোর্ড-২০২৩
  {
    serialNo: 7,
    boardName: 'Chattogram Board',
    examYear: '2023',
    stem: `হাবিব একটি ওয়েবসাইট তৈরি করল যার হোমপেজের সাথে ৩টি মূল ওয়েবপেজ সংযুক্ত। আবার প্রতিটি মূল পেজের সাথে ২টি করে ওয়েবপেজ সংযুক্ত। ওয়েবসাইটটির হোমপেজে কলেজের নাম ও ছবি সংযুক্ত।`,
    q_ka: `(ক) সার্চ ইঞ্জিন কী?`,
    a_ka: `(ক) সার্চ ইঞ্জিন হলো এমন একটি সফটওয়্যার প্রোগ্রাম যা ইন্টারনেটের বিভিন্ন ওয়েব সার্ভার থেকে ব্যবহারকারীর দেওয়া নির্দিষ্ট কী-ওয়ার্ড অনুসন্ধান করে সম্পর্কিত তথ্য প্রদর্শন করে।`,
    q_kha: `(খ) ওয়েব পেইজের সাথে ব্রাউজার সম্পর্কিত -ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবপেজে লিখিত HTML কোড সাধারণ টেক্সট আকারে সার্ভারে থাকে। ব্রাউজার হলো ক্লায়েন্ট সফটওয়্যার যা এই কোড অনুবাদ ও ইন্টারপ্রেট করে মানবপাঠ্য গ্রাফিক্যাল আকারে ব্যবহারকারীর সামনে তুলে ধরে। ব্রাউজার ছাড়া ওয়েবপেজ প্রদর্শন সম্ভব নয়।`,
    q_ga: `(গ) হাবিবের ওয়েবসাইটটির কাঠামো বর্ণনা কর।`,
    a_ga: `(গ) হাবিবের ওয়েবসাইটটির কাঠামো হলো হায়ারারকিক্যাল বা ট্রি কাঠামো (Hierarchical / Tree structure)। এ কাঠামোতে মূল হোমপেজ থেকে শাখা পেজে এবং সেখান থেকে প্রশাখা পেজে সুবিন্যস্তভাবে যাওয়া যায়। হাবিবের সাইটে হোমপেজের সাথে ৩টি মূল পেজ এবং প্রতিটির সাথে ২টি করে সাব-পেজ যুক্ত থাকায় এটি একটি আদর্শ ট্রি কাঠামো।`,
    q_gha: `(ঘ) উদ্দীপকের ওয়েবসাইটটির হোমপেজের জন্য HTML কোড লিখ। এবং ব্যবহৃত ট্যাগসমূহ ব্যাখ্যা কর।`,
    a_gha: `(ঘ) হোমপেজের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>College Home Page</title>\n</head>\n<body>\n    <h1>Home Page</h1>\n    <h3>College Name</h3>\n    <img src="homepage.jpg" alt="College Image">\n    <ul type="square">\n        <li><a href="aboutus.html">About Us</a></li>\n        <li><a href="contact.html">Contact</a></li>\n        <li><a href="department.html">All Department</a></li>\n    </ul>\n</body>\n</html>\n\`\`\`\nব্যবহৃত ট্যাগসমূহ: <html> (মূল ডকুমেন্ট), <head> ও <title> (মেটাডেটা ও শিরোনাম), <body> (মূল কনটেন্ট), <h1> ও <h3> (হেডিং), <img> (ছবি সংযোজন), <ul> ও <li> (আন-অর্ডার্ড তালিকা), <a> (হাইপারলিংক)।`
  },

  // 8. চট্টগ্রাম বোর্ড-২০২৩
  {
    serialNo: 8,
    boardName: 'Chattogram Board',
    examYear: '2023',
    stem: `চিত্র নং-১:\nProduce List\n1. Book\n2. Pen\n3. Bag\n\nচিত্র নং-২:\n| SL | ABC Company (কলাম স্প্যান ২) |\n| :---: | :---: |\n| A | Monitor | Rose.jpg (রো স্প্যান ২) |\n| B | Keyboard | |`,
    q_ka: `(ক) অ্যাট্রিবিউট কী?`,
    a_ka: `(ক) অ্যাট্রিবিউট হলো HTML ট্যাগের নির্দেশক বৈশিষ্ট্য যা এলিমেন্টের কার্যকারিতা বা চেহারা নিয়ন্ত্রণ করে।`,
    q_kha: `(খ) html ভাষা কেস-সেনসিটিভ নয় -ব্যাখ্যা কর।`,
    a_kha: `(খ) HTML-এ ট্যাগসমূহ ছোট হাতের বা বড় হাতের যেকোনো অক্ষরে লিখলে ব্রাউজার একই অর্থ গ্রহণ করে এবং ফলাফলে কোনো পরিবর্তন আসে না। তাই HTML কেস-সেনসিটিভ নয়।`,
    q_ga: `(গ) চিত্র নং- ১এর মত ওয়েবপেইজ তৈরির জন্য html কোডিং লিখ।`,
    a_ga: `(গ) চিত্র নং-১ এর কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Produce List</title>\n</head>\n<body>\n    <p><u>Produce List</u></p>\n    <ol type="1">\n        <li>Book</li>\n        <li>Pen</li>\n        <li>Bag</li>\n    </ol>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) উদ্দীপকের চিত্র নং- ২ এর মত ওয়েবপেইজ তৈরির জন্য html কোডিং লিখ।`,
    a_gha: `(ঘ) চিত্র নং-২ এর কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Company Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th align="center">SL</th>\n            <th align="center" colspan="2">ABC Company</th>\n        </tr>\n        <tr>\n            <td align="center">A</td>\n            <td align="center">Monitor</td>\n            <td align="center" rowspan="2"><img src="Rose.jpg" alt="Rose"></td>\n        </tr>\n        <tr>\n            <td align="center">B</td>\n            <td align="center">Keyboard</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 9. বরিশাল বোর্ড-২০২৩
  {
    serialNo: 9,
    boardName: 'Barishal Board',
    examYear: '2023',
    stem: `দৃশ্যকল্প-১:\n<html>\n<body>\n<ul>\n<li> Bangladesh </li>\n</ul>\n</body>\n</html>\n\nদৃশ্যকল্প-২:\n● Bangladesh\n  ○ Dhaka\n  ○ Rajshahi\n  ○ Sylhet\n  ○ Khulna\n\nদৃশ্যকল্প-৩:\n[ ABcollege.edu.bd ] (লিংক)\n[ image.jpg ] (ছবি)`,
    q_ka: `(ক) আইপি অ্যাড্রেস কী?`,
    a_ka: `(ক) ইন্টারনেটে বা নেটওয়ার্কে যুক্ত প্রতিটি কম্পিউটারের একটি সুনির্দিষ্ট ও অনন্য সংখ্যাভিত্তিক ঠিকানাকে আইপি অ্যাড্রেস (IP Address) বলে।`,
    q_kha: `(খ) img একটি এমপ্টি এলিমেন্ট কেন? ব্যাখ্যা কর`,
    a_kha: `(খ) যে সকল HTML ট্যাগের কেবল শুরুর ট্যাগ থাকে কিন্তু কোনো সমাপ্তি বা ক্লোজিং ট্যাগ থাকে না, তাদের এম্পটি ট্যাগ বলে। <img> ট্যাগের শুরু থাকলেও এর কোনো </img> ক্লোজিং ট্যাগ নেই, এটি কেবল সোর্স ও অন্যান্য অ্যাট্রিবিউট ধারণ করে। তাই এটি একটি এম্পটি এলিমেন্ট।`,
    q_ga: `(গ) দৃশ্যকল্প-১ ব্যবহার করে দৃশ্যকল্প-২ পাওয়ার জন্য HTML কোড লিখ।`,
    a_ga: `(গ) দৃশ্যকল্প-২ তৈরির HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>List</title>\n</head>\n<body>\n    <ul>\n        <li>Bangladesh\n            <ul type="circle">\n                <li>Dhaka</li>\n                <li>Rajshahi</li>\n                <li>Sylhet</li>\n                <li>Khulna</li>\n            </ul>\n        </li>\n    </ul>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) দৃশ্যকল্প-১ ও দৃশ্যকল্প-৩ ব্যবহার করে নতুন একটি ওয়েবপেজ তৈরি করার জন্য HTML কোড লিখ।`,
    a_gha: `(ঘ) নতুন পেজ তৈরির HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>ABC College</title>\n</head>\n<body>\n    <h3>Welcome to Our College Website</h3>\n    <a href="http://ABcollege.edu.bd">ABcollege</a><br>\n    <img src="image.jpg" alt="College Image">\n    <p>Our College located in:</p>\n    <ul>\n        <li>Bangladesh\n            <ul type="circle">\n                <li>Dhaka</li>\n                <li>Rajshahi</li>\n                <li>Sylhet</li>\n                <li>Khulna</li>\n            </ul>\n        </li>\n    </ul>\n</body>\n</html>\n\`\`\``
  },

  // 10. সিলেট বোর্ড-২০২৩
  {
    serialNo: 10,
    boardName: 'Sylhet Board',
    examYear: '2023',
    stem: `দৃশ্যকল্প-১:\nC. Coffee\nD. Tea\n   ● Black\n   ● Green\nE. Milk\n\nদৃশ্যকল্প-২: Result Table\n| Result (কলাম স্প্যান ৩) |\n| :---: |\n| [CT] (রো স্প্যান ২) | CQ | MCQ |\n| | 45 | 25 |\n| English | 95 (কলাম স্প্যান ২) |`,
    q_ka: `(ক) ডায়নামিক ওয়েবসাইট কী?`,
    a_ka: `(ক) যে সকল ওয়েবসাইটের ডেটা বা কনটেন্ট সার্ভার সাইড প্রযুক্তির মাধ্যমে ব্যবহারকারীর প্রয়োজন অনুযায়ী স্বয়ংক্রিয়ভাবে পরিবর্তিত হতে পারে, তাকে ডায়নামিক ওয়েবসাইট বলে।`,
    q_kha: `(খ) ওয়েবসাইট পাবলিশিং ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবসাইট ডিজাইন শেষ হওয়ার পর তা ইন্টারনেটের মাধ্যমে সবার জন্য উন্মুক্ত করতে ডোমেন কেনা, ওয়েব হোস্টিং স্পেস নির্ধারণ এবং সার্ভারে ফাইল আপলোড করার সামগ্রিক প্রক্রিয়াকে ওয়েবসাইট পাবলিশিং বলে।`,
    q_ga: `(গ) দৃশ্যকল্প-১ কে আউটপুট হিসেবে প্রদর্শনের জন্য HTML কোড লিখ।`,
    a_ga: `(গ) দৃশ্যকল্প-১ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Drink List</title>\n</head>\n<body>\n    <ol type="A" start="3">\n        <li>Coffee</li>\n        <li>Tea\n            <ul type="disc">\n                <li>Black</li>\n                <li>Green</li>\n            </ul>\n        </li>\n        <li>Milk</li>\n    </ol>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) দৃশ্যকল্প-২ এর জন্য HTML কোড লিখ এবং ব্যবহৃত ট্যাগসমূহের বর্ণনা দাও।`,
    a_gha: `(ঘ) দৃশ্যকল্প-২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Result Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th colspan="3" align="center">Result</th>\n        </tr>\n        <tr>\n            <td rowspan="2" align="center"><u>[CT]</u></td>\n            <td align="left">CQ</td>\n            <td align="left">MCQ</td>\n        </tr>\n        <tr>\n            <td align="center">45</td>\n            <td align="center">25</td>\n        </tr>\n        <tr>\n            <td align="center"><u>English</u></td>\n            <td colspan="2" align="center">95</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\`\nব্যবহৃত ট্যাগসমূহ: <table> (টেবিল তৈরি), <tr> (টেবিলের সারি), <th> (টেবিল হেডার), <td> (টেবিল ডেটা/সেল), <u> (আন্ডারলাইন)।`
  },

  // 11. দিনাজপুর বোর্ড-২০২৩
  {
    serialNo: 11,
    boardName: 'Dinajpur Board',
    examYear: '2023',
    stem: `দৃশ্যকল্প-১:\n2. ICT Book Writer Name:\n   ○ Mr. X\n   ○ Mr. Y\n3. Bangla Book Writer Name:\n   ■ Mr. A\n   ■ Mr. B\n\nদৃশ্যকল্প-২: Marks Sheet Table\n| Roll No. (রো স্প্যান ২) | Bangla (কলাম স্প্যান ২) | English (কলাম স্প্যান ২) |\n| :---: | :---: | :---: |\n| | 1st | 2nd | 1st | 2nd |\n| 001 | 85 | 67 | 58 | 70 |\n| 002 | 65 | 75 | 60 | 55 |\n| 003 | 72 | 61 | 48 | 63 |`,
    q_ka: `(ক) হোস্টিং কী?`,
    a_ka: `(ক) ইন্টারনেটের সাথে যুক্ত কোনো শক্তিশালী ওয়েব সার্ভারে ওয়েবসাইটের যাবতীয় ফাইল ও ডেটা সংরক্ষণ করে ২৪ ঘণ্টা সচল রাখাকে ওয়েব হোস্টিং বলে।`,
    q_kha: `(খ) ডোমেন নেইম এর গুরুত্ব ব্যাখ্যা কর।`,
    a_kha: `(খ) ইন্টারনেটে কম্পিউটারের আইপি অ্যাড্রেস সংখ্যাভিত্তিক হওয়ায় তা মনে রাখা অত্যন্ত কষ্টকর। ডোমেইন নেম হলো এর সহজ, অর্থপূর্ণ ও অদ্বিতীয় আলফানিউমেরিক নাম যা ব্যবহারকারীরা সহজেই মনে রাখতে ও ব্রাউজারে টাইপ করে সাইটে প্রবেশ করতে পারেন।`,
    q_ga: `(গ) দৃশ্যকল্প-১ এর জন্য প্রয়োজনীয় HTML কোড লিখ।`,
    a_ga: `(গ) দৃশ্যকল্প-১ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Book Writers</title>\n</head>\n<body>\n    <ol type="1" start="2">\n        <li>ICT Book Writer Name:\n            <ul type="circle">\n                <li>Mr. X</li>\n                <li>Mr. Y</li>\n            </ul>\n        </li>\n        <li>Bangla Book Writer Name:\n            <ul type="square">\n                <li>Mr. A</li>\n                <li>Mr. B</li>\n            </ul>\n        </li>\n    </ol>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) দৃশ্যকল্প-২ ওয়েবপেজে প্রদর্শন করা কি সম্ভব? তোমার মতামতের যৌক্তিকতা বিশ্লেষণ কর।`,
    a_gha: `(ঘ) হ্যাঁ, দৃশ্যকল্প-২ ওয়েবপেজে প্রদর্শন করা পুরোপুরি সম্ভব। HTML এর টেবিল ট্যাগ এবং rowspan ও colspan অ্যাট্রিবিউট ব্যবহার করে এ ধরনের জটিল টেবিল তৈরি করা যায়।\n\nপ্রয়োজনীয় কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Marks Sheet</title>\n</head>\n<body>\n    <table border="1" align="center">\n        <caption><b>Marks Sheet</b></caption>\n        <tr>\n            <th rowspan="2">Roll No.</th>\n            <th colspan="2">Bangla</th>\n            <th colspan="2">English</th>\n        </tr>\n        <tr>\n            <th>1st</th>\n            <th>2nd</th>\n            <th>1st</th>\n            <th>2nd</th>\n        </tr>\n        <tr>\n            <td align="center">001</td>\n            <td align="center">85</td>\n            <td align="center">67</td>\n            <td align="center">58</td>\n            <td align="center">70</td>\n        </tr>\n        <tr>\n            <td align="center">002</td>\n            <td align="center">65</td>\n            <td align="center">75</td>\n            <td align="center">60</td>\n            <td align="center">55</td>\n        </tr>\n        <tr>\n            <td align="center">003</td>\n            <td align="center">72</td>\n            <td align="center">61</td>\n            <td align="center">48</td>\n            <td align="center">63</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 12. ময়মনসিংহ বোর্ড-২০২৩
  {
    serialNo: 12,
    boardName: 'Mymensingh Board',
    examYear: '2023',
    stem: `চিত্র-১: HOME <-> RESULT <-> IMAGES\n(Under RESULT -> XI, XII -> TEST)\n\nচিত্র-২: Table\n| Bangladesh (কলাম স্প্যান ২) |\n| :---: |\n| photo.jpg (Size 100x80) | 1. Dhaka<br>2. Dinajpur<br>3. Rangpur |\n| Welcome (কলাম স্প্যান ২) |`,
    q_ka: `(ক) আইপি অ্যাড্রেস কী?`,
    a_ka: `(ক) ইন্টারনেটে বা যেকোনো নেটওয়ার্কে যুক্ত প্রতিটি ডিভাইসের যোগাযোগের জন্য নির্ধারিত অনন্য সংখ্যাভিত্তিক ঠিকানাকে আইপি অ্যাড্রেস বলে।`,
    q_kha: `(খ) Wire Frame কী? ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়্যারফ্রেম হলো একটি ওয়েবসাইটের কাঠামো বা পৃষ্ঠা বিন্যাসের প্রাথমিক খসড়া নকশা। এটি কোডিং ও ভিজ্যুয়াল ডিজাইনের পূর্বে পৃষ্ঠাগুলোর এলিমেন্টসমূহ কোথায় কীভাবে বসবে তা উপস্থাপন করে।`,
    q_ga: `(গ) চিত্র-১ এ কোন ধরনের ওয়েবসাইট স্ট্রাকচার ব্যবহার করা হয়েছে?`,
    a_ga: `(গ) চিত্র-১ এ হাইব্রিড বা কম্বিনেশন (Hybrid / Combination) কাঠামো ব্যবহার করা হয়েছে। কারণ এখানে মূল মেনুতে HOME, RESULT ও IMAGES পেজগুলোর মধ্যে লিনিয়ার বা নেটওয়ার্ক সংযোগ রয়েছে এবং RESULT পেজের অধীনে XI, XII এবং TEST পেজগুলোর মধ্যে হায়ারারকিক্যাল বা ট্রি কাঠামো রয়েছে।`,
    q_gha: `(ঘ) চিত্র-২ ওয়েব ব্রাউজারে প্রদর্শনের জন্য HTML কোড লিখ। [চিত্রটি photo.jpg, Size = 100 × 80]`,
    a_gha: `(ঘ) চিত্র-২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Table & Image</title>\n</head>\n<body>\n    <table border="2">\n        <tr>\n            <th colspan="2" align="center">Bangladesh</th>\n        </tr>\n        <tr>\n            <td align="center">\n                <img src="photo.jpg" height="100" width="80"><br>photo\n            </td>\n            <td>\n                <ol>\n                    <li>Dhaka</li>\n                    <li>Dinajpur</li>\n                    <li>Rangpur</li>\n                </ol>\n            </td>\n        </tr>\n        <tr>\n            <td colspan="2" align="center">Welcome</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 13. ঢাকা বোর্ড-২০১৯
  {
    serialNo: 13,
    boardName: 'Dhaka Board',
    examYear: '2019',
    stem: `চিত্র-১: হায়ারারকিক্যাল বা ট্রি কাঠামো (Home Page -> Page 1, Page 2, Page 3, Page 4)\n\nচিত্র-২: Table\nCaption: HSC-2019\n| ICT (কলাম স্প্যান ২) |\n| :---: |\n| Subject (উচ্চতা ২০০px) | Board |\n\nউদ্দীপক: www.board.edu.bd ওয়েবসাইটের মাধ্যমে ICT নম্বর দেখতে হলে “board” এর উপর ক্লিক করতে হবে।`,
    q_ka: `(ক) FTP কি?`,
    a_ka: `(ক) FTP এর পূর্ণরূপ File Transfer Protocol। এটি ইন্টারনেটে এক কম্পিউটার থেকে অন্য কম্পিউটারে ফাইল আদান-প্রদান করার একটি স্ট্যান্ডার্ড নেটওয়ার্ক প্রোটোকল।`,
    q_kha: `(খ) ওয়েবসাইট ও ওয়েবপেইজ এক নয়- ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবপেজ হলো ইন্টারনেটে প্রদর্শিত যেকোনো একক একটি পৃষ্ঠা। অন্যদিকে একটি নির্দিষ্ট ডোমেইনের অধীনে সংরক্ষিত একাধিক আন্তঃসংযুক্ত ওয়েবপেজের সামগ্রিক রূপকে ওয়েবসাইট বলা হয়। সুতরাং এদের পরিধি এক নয়।`,
    q_ga: `(গ) চিত্র-১ এ কোন ধরনের ওয়েবসাইট স্ট্রাকচার ব্যবহার করা হয়েছে? ব্যাখ্যা কর।`,
    a_ga: `(গ) চিত্র-১ এ হায়ারারকিক্যাল বা ট্রি কাঠামো (Tree structure) ব্যবহার করা হয়েছে। এ পদ্ধতিতে মূল হোমপেজ থেকে শাখা পেজে সহজে যাওয়া যায় এবং পুরো সাইটের রূপরেখা স্পষ্ট বোঝা যায়।`,
    q_gha: `(ঘ) চিত্র-২ ওয়েব ব্রাউজারে প্রদর্শনের জন্য html কোড লিখ।`,
    a_gha: `(ঘ) চিত্র-২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>TABLE TEMPLATE</title>\n</head>\n<body>\n    <table border="1">\n        <caption>HSC-2019</caption>\n        <tr>\n            <th align="center" colspan="2">ICT</th>\n        </tr>\n        <tr height="200">\n            <td align="center">Subject</td>\n            <td align="center"><a href="http://www.board.edu.bd">Board</a></td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 14. রাজশাহী বোর্ড-২০১৯
  {
    serialNo: 14,
    boardName: 'Rajshahi Board',
    examYear: '2019',
    stem: `দৃশ্যকল্প-১:\nWELCOME ICT LAB (সবচেয়ে বড় হেডিং)\nWELCOME ICT LAB (সবচেয়ে ছোট হেডিং)\nA₂B² (প্যারাগ্রাফ)\n\nদৃশ্যকল্প-২: টেবিল\n| Book (লিংক: book.com) | Book.jpg (ছবি) |`,
    q_ka: `(ক) ওয়েবসাইট কী?`,
    a_ka: `(ক) একই ডোমেইনের অধীনে সার্ভারে সংরক্ষিত একাধিক আন্তঃসম্পর্কযুক্ত ওয়েবপেজের সমষ্টিকে ওয়েবসাইট বলে।`,
    q_kha: `(খ) ডোমেইন নেম অদ্বিতীয়- ব্যাখ্যা কর।`,
    a_kha: `(খ) ইন্টারনেটে প্রতিটি ওয়েবসাইটের সুনির্দিষ্ট পরিচিতি ও সার্ভার লোকেশন চিহ্নিত করার জন্য ডোমেইন নেম বরাদ্দ দেওয়া হয়। একই নামে দুটি ডোমেইন থাকলে দ্বন্দ্ব দেখা দেবে, তাই ডোমেইন নেম বিশ্বজুড়ে সর্বদা অদ্বিতীয় (Unique) হয়।`,
    q_ga: `(গ) দৃশ্যকল্প-১ এর প্রথম লাইন সবচেয়ে বড়, দ্বিতীয় লাইন সবচেয়ে ছোট হেডিং এবং তৃতীয় লাইন প্যারাগ্রাফ নিয়ে HTML কোড লিখ।`,
    a_ga: `(গ) দৃশ্যকল্প-১ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Code</title>\n</head>\n<body>\n    <h1 align="center">WELCOME ICT LAB</h1>\n    <h6 align="center">WELCOME ICT LAB</h6>\n    <p align="center">A<sub>2</sub>B<sup>2</sup></p>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) দৃশ্যকল্প-২ এর টেবিল তৈরির HTML কোড লিখ যেখানে, Book এ ক্লিক করলে book.com ওয়েবসাইটটি চালু হবে।`,
    a_gha: `(ঘ) দৃশ্যকল্প-২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Code</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <td align="center" width="100">\n                <a href="https://www.book.com">Book</a>\n            </td>\n            <td align="center" width="100">\n                <img src="book.jpg" width="50" height="50"><br>\n                <p>Book.jpg</p>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 15. কুমিল্লা বোর্ড-২০১৯
  {
    serialNo: 15,
    boardName: 'Cumilla Board',
    examYear: '2019',
    stem: `আইসিটি শিক্ষক ক্লাসে html পড়াচ্ছিলেন। তিনি ছাত্রদের টেবিলটির ফাঁকা ঘরে Logo.jpg চিত্রটি প্রদর্শনসহ সম্পূর্ণ টেবিলটি তৈরির html code লিখে দেখালেন:\n| A | B |\n| C | D |\n| E | F |\n(চিত্র-১: D এবং F এর পাশে Logo.jpg ফাঁকা ঘরে প্রদর্শিত)\n\nচিত্র-২:\nQuick brown fox\nJumps over the lazydog\nand then it fall\nprey to a lion.`,
    q_ka: `(ক) সার্চ ইঞ্জিন কী?`,
    a_ka: `(ক) সার্চ ইঞ্জিন হলো এমন একটি সফটওয়্যার প্রোগ্রাম যা ইন্টারনেটের বিভিন্ন ওয়েব সার্ভার থেকে নির্দিষ্ট তথ্যের অনুসন্ধান ও প্রদর্শন করে।`,
    q_kha: `(খ) IP অ্যাড্রেসের ডোমেইন নেম ব্যবহার করা সুবিধাজনক -ব্যাখ্যা কর।`,
    a_kha: `(খ) আইপি অ্যাড্রেস জটিল সংখ্যাভিত্তিক হওয়ায় তা মনে রাখা অত্যন্ত দুরূহ। কিন্তু ডোমেইন নেম অর্থপূর্ণ শব্দ হওয়ায় ব্যবহারকারী সহজে মনে রাখতে ও ব্রাউজারে টাইপ করতে পারেন। তাই ডোমেইন নেম ব্যবহার সুবিধাজনক।`,
    q_ga: `(গ) ছাত্রদের তৈরি html code কেমন তা দেখাও।`,
    a_ga: `(গ) চিত্র-২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Code</title>\n</head>\n<body>\n    <strong>Quick</strong> <i>brown</i> <u>fox</u><br>\n    <del>Jumps over</del> the lazy<sup>dog</sup><br>\n    and <sub>then</sub> <strong><i>it fall</i></strong><br>\n    <u><i>prey</i> to a <i>lion.</i></u>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) উদ্দীপকের ফাঁকা ঘরে ছবিটি সংযোজনের ক্ষেত্রে সাবধানতা উল্লেখপূর্বক টেবিলটি তৈরির html কোড লিখ।`,
    a_gha: `(ঘ) সাবধানতা: ছবিটির সোর্স পাথ ও ফাইলের সঠিক এক্সটেনশন (logo.jpg) দেওয়া, টেবিলের রো-স্প্যান ঠিক রাখা এবং প্রস্থ-উচ্চতা সঠিকভাবে নির্ধারণ করা।\n\nটেবিলের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Table with Image</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <td>A</td>\n            <td colspan="2">B</td>\n        </tr>\n        <tr>\n            <td>C</td>\n            <td>D</td>\n            <td rowspan="2" width="200"><img src="logo.jpg" alt="Logo"></td>\n        </tr>\n        <tr>\n            <td>E</td>\n            <td>F</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 16. যশোর বোর্ড-২০১৯
  {
    serialNo: 16,
    boardName: 'Jashore Board',
    examYear: '2019',
    stem: `দৃশ্যকল্প-১: লিনিয়ার কাঠামো (Linear: ১ -> ২ -> ৩)\nদৃশ্যকল্প-২: ট্রি বা হায়ারারকিক্যাল কাঠামো (Tree)\n\nদৃশ্যকল্প-৩: Student-Info টেবিল:\n| Roll | Name | Address | Result |\n| :---: | :---: | :---: | :---: |\n| 5001 | Rima | Dhaka | 3.5 |\n| 5002 | Moon | Sylhet | 4.7 |\n| 5003 | Jui | Dhaka | 5.0 |\n| 5004 | Koli | Cumilla | 3.8 |`,
    q_ka: `(ক) ব্রাউজার কী?`,
    a_ka: `(ক) ব্রাউজার হলো এমন একটি সফটওয়্যার যা ইন্টারনেটে ওয়েবপেজ পরিদর্শন ও রেন্ডার করতে ব্যবহৃত হয়।`,
    q_kha: `(খ) ‘আইপি ঠিকানা হচ্ছে ডোমেইন নেইম এর গাণিতিক রূপ’ -ব্যাখ্যা কর।`,
    a_kha: `(খ) ইন্টারনেটে যুক্ত প্রতিটি ডিভাইসের যোগাযোগের জন্য নির্ধারিত সংখ্যাভিত্তিক পরিচয় হলো আইপি অ্যাড্রেস, যার মানুষ-পাঠ্য আলফানিউমেরিক রূপ হলো ডোমেইন নেম। তাই আইপি ঠিকানাকে ডোমেইন নেমের গাণিতিক রূপ বলা হয়।`,
    q_ga: `(গ) দৃশ্যকল্প-৩ ওয়েবপেজে প্রদর্শনের জন্য HTML কোড লিখ।`,
    a_ga: `(গ) দৃশ্যকল্প-৩ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Student Info</title>\n</head>\n<body>\n    <table border="1">\n        <caption style="text-align:center;"><strong>Student-Info</strong></caption>\n        <tr>\n            <th>Roll</th>\n            <th>Name</th>\n            <th>Address</th>\n            <th>Result</th>\n        </tr>\n        <tr><td>5001</td><td>Rima</td><td>Dhaka</td><td>3.5</td></tr>\n        <tr><td>5002</td><td>Moon</td><td>Sylhet</td><td>4.7</td></tr>\n        <tr><td>5003</td><td>Jui</td><td>Dhaka</td><td>5.0</td></tr>\n        <tr><td>5004</td><td>Koli</td><td>Cumilla</td><td>3.8</td></tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) দৃশ্যকল্প-১ এবং দৃশ্যকল্প-২ এর ওয়েবসাইট কাঠামোর মধ্যে কোনটি অধিক সুবিধাজনক- যুক্তিসহ লিখ।`,
    a_gha: `(ঘ) দৃশ্যকল্প-১ হলো লিনিয়ার এবং দৃশ্যকল্প-২ হলো ট্রি বা হায়ারারকিক্যাল কাঠামো।\nএদের মধ্যে দৃশ্যকল্প-২ (ট্রি কাঠামো) অধিক সুবিধাজনক। কারণ ট্রি কাঠামোতে মূল হোমপেজ থেকে বিভিন্ন ক্যাটাগরি ও সাব-ক্যাটাগরিতে ব্যবহারকারী সরাসরি সহজে যেতে পারেন। অন্যদিকে লিনিয়ার কাঠামোতে ক্রমানুসারে একের পর এক পেজ পার হয়ে কাঙ্ক্ষিত পেজে যেতে হয়, যা বৃহৎ ও তথ্যবহুল ওয়েবসাইটের জন্য জটিল ও সময়সাপেক্ষ।`
  },

  // 17. চট্টগ্রাম বোর্ড-২০১৯
  {
    serialNo: 17,
    boardName: 'Chattogram Board',
    examYear: '2019',
    stem: `চিত্র-১:\nThis is our national flower\n[ water lily.jpeg ]\nWater lily.jpeg\n\nচিত্র-২: লিনিয়ার কাঠামো (Linear: পেজ ১ -> পেজ ২ -> পেজ ৩)`,
    q_ka: `(ক) আইপি অ্যাড্রেস কী?`,
    a_ka: `(ক) আইপি অ্যাড্রেস হলো ইন্টারনেটে বা নেটওয়ার্কে যুক্ত প্রতিটি ডিভাইসের নিজস্ব অদ্বিতীয় সংখ্যাভিত্তিক ঠিকানা।`,
    q_kha: `(খ) ‘ওয়েব ব্রাউজার ও সার্চ ইঞ্জিন এক নয়’-ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েব ব্রাউজার হলো একটি ক্লায়েন্ট অ্যাপ্লিকেশন সফটওয়্যার যার মাধ্যমে যেকোনো ওয়েবপেজ ভিজিট ও কোড রেন্ডার করা হয় (যেমন: Chrome, Firefox)। আর সার্চ ইঞ্জিন হলো একটি ওয়েব অ্যাপ্লিকেশন বা সেবা যা ব্যবহারকারীর অনুসন্ধানের ভিত্তিতে ওয়েবের বিভিন্ন সাইট থেকে তথ্য খুঁজে এনে প্রদর্শন করে (যেমন: Google, Bing)। তাই এরা এক নয়।`,
    q_ga: `(গ) ব্রাউজারে উদ্দীপকের ন্যায় চিত্র-১ এর ফলাফল পেতে প্রয়োজনীয় HTML কোড লিখ।`,
    a_ga: `(গ) চিত্র-১ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>National Flower</title>\n</head>\n<body style="text-align: center;">\n    <p>This is our national flower.</p>\n    <figure style="display: inline-block;">\n        <img src="water lily.jpeg" alt="Water Lily">\n        <figcaption style="border: 1px solid;">Water lily.jpeg</figcaption>\n    </figure>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) ‘উদ্দীপকের চিত্র-২ এর ওয়েবসাইট কাঠামোটি বড় শিক্ষা প্রতিষ্ঠানের জন্য আদর্শ নয়।’-উক্তিটির সত্যতা যাচাইপূর্বক মতামত দাও।`,
    a_gha: `(ঘ) উক্তিটি সম্পূর্ণ যথার্থ। চিত্র-২ এ প্রদর্শিত কাঠামোটি হলো লিনিয়ার বা অনুক্রমিক কাঠামো। এ কাঠামোতে কোনো পেজে যেতে হলে আগের পেজগুলো ক্রমানুসারে পার হয়ে যেতে হয়, সরাসরি কোনো পেজে যাওয়া যায় না। বড় শিক্ষা প্রতিষ্ঠানের ওয়েবসাইটে ভর্তি, পরীক্ষার ফলাফল, শিক্ষক তালিকা, বিভাগসমূহ, নোটিশ বোর্ড ইত্যাদি অসংখ্য শাখা ও তথ্য থাকে। লিনিয়ার কাঠামো ব্যবহার করলে ব্যবহারকারীকে নোটিশ বা ফলাফল দেখতে অনেক পেজ পার হতে হবে, যা অত্যন্ত সময়সাপেক্ষ ও বিরক্তিকর। তাই বড় শিক্ষা প্রতিষ্ঠানের জন্য হায়ারারকিক্যাল বা ট্রি কাঠামোই আদর্শ।`
  },

  // 18. বরিশাল বোর্ড-২০১৯
  {
    serialNo: 18,
    boardName: 'Barishal Board',
    examYear: '2019',
    stem: `দৃশ্যকল্প-১: ইলা ও আনজুম দুই বান্ধবী মিলে HTML দিয়ে First, Last, Next, Previous লিংকবিশিষ্ট একটি ওয়েবসাইট তৈরি করে। ওয়েবসাইটটি দ্রুত ব্রাউজ করা গেলেও তথ্য নিয়মিত আপডেট করতে সমস্যা হওয়ায় তারা PHP, MySQL ইত্যাদি টুলস দিয়ে ওয়েবসাইটটি পরিবর্তনের সিদ্ধান্ত নেয়।`,
    q_ka: `(ক) হাইপারলিংক কী?`,
    a_ka: `(ক) হাইপারলিংক হলো একটি ওয়েবপেজের কোনো উপাদান (টেক্সট বা ছবি)-এর সাথে অন্য পেজ বা ফাইলের মধ্যকার সংযোগ ব্যবস্থা।`,
    q_kha: `(খ) ওয়েব হোস্টিং গুরুত্বপূর্ণ কেন? ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবসাইট তৈরি করার পর তা ইন্টারনেটে সব সময় সচল ও বিশ্বব্যাপী ব্যবহারকারীদের জন্য উন্মুক্ত রাখতে একটি নিরবচ্ছিন্ন সার্ভারের মেমোরিতে ফাইলগুলো সংরক্ষণ করতে হয়, যাকে ওয়েব হোস্টিং বলে। হোস্টিং না করলে সাইটটি অনলাইনে কেউ দেখতে পারবে না।`,
    q_ga: `(গ) ওয়েবসাইটটির স্ট্রাকচার ব্যাখ্যা কর।`,
    a_ga: `(গ) ইলা ও আনজুমের তৈরি প্রাথমিক ওয়েবসাইটের স্ট্রাকচারটি হলো লিনিয়ার বা অনুক্রমিক (Linear structure)। এ কাঠামোতে পেজগুলো First, Next, Previous, Last লিংকের মাধ্যমে ক্রমানুসারে সাজানো থাকে।`,
    q_gha: `(ঘ) উদ্দীপকে উল্লিখিত সিদ্ধান্তের যৌক্তিকতা বিশ্লেষণ কর।`,
    a_gha: `(ঘ) ইলা ও আনজুমের সাইটটি কেবল HTML দিয়ে তৈরি হওয়ায় তা ছিল একটি স্ট্যাটিক ওয়েবসাইট। স্ট্যাটিক ওয়েবসাইটে নতুন কনটেন্ট যুক্ত করতে হলে মূল কোড পরিবর্তন করতে হয় এবং ডেটাবেজ সাপোর্ট থাকে না। তাই PHP (সার্ভার স্ক্রিপ্টিং) ও MySQL (ডেটাবেজ) ব্যবহার করে সাইটটিকে ডায়নামিক ওয়েবসাইটে রূপান্তরের সিদ্ধান্ত অত্যন্ত যৌক্তিক। এতে তারা কোনো কোডিং ছাড়াই অ্যাডমিন প্যানেল দিয়ে প্রতিদিনের তথ্য সহজে আপডেট করতে পারবে।`
  },

  // 19. সিলেট বোর্ড-২০১৯
  {
    serialNo: 19,
    boardName: 'Sylhet Board',
    examYear: '2019',
    stem: `শীলাদের কলেজের ওয়েবসাইটটি সার্ভার এবং ব্রাউজকারীর মধ্যে উভমুখী ডেটা সরবরাহ করে। শীলা একটি ওয়েবপেজ তৈরি করে যাতে “ourboard” লেখাটিতে ক্লিক করলে “www.e-board.edu.bd” ওয়েবসাইটটি প্রদর্শিত হয়।`,
    q_ka: `(ক) <hr> কী?`,
    a_ka: `(ক) <hr> হলো একটি এম্পটি ট্যাগ, যা ওয়েবপেজে আনুভূমিক রেখা (Horizontal Rule) টানতে ব্যবহৃত হয়।`,
    q_kha: `(খ) হাইপারলিংক ট্যাগের আবশ্যিক অ্যাট্রিবিউটটি ব্যাখ্যা কর।`,
    a_kha: `(খ) হাইপারলিংক ট্যাগের আবশ্যিক অ্যাট্রিবিউট হলো href (Hypertext Reference)। এটি লিংকে ক্লিক করলে ব্রাউজার কোন নির্দিষ্ট পেজ বা ইউআরএলে প্রবেশ করবে তা নির্দেশ করে।`,
    q_ga: `(গ) শীলাদের কলেজের ওয়েবসাইটটি ব্যাখ্যা কর।`,
    a_ga: `(গ) শীলাদের কলেজের ওয়েবসাইটটি একটি ডায়নামিক ওয়েবসাইট। কারণ এতে সার্ভার ও ব্রাউজকারীর মধ্যে উভমুখী (Two-way) ডেটা আদান-প্রদান ঘটে এবং ব্যবহারকারীর ইনপুট গ্রহণ ও প্রদর্শনের ব্যবস্থা রয়েছে।`,
    q_gha: `(ঘ) ‘শীলার তৈরিকৃত পেজটি একটি ওয়েব পোর্টাল’ -HTML কোডসহ বিশ্লেষণ কর।`,
    a_gha: `(ঘ) ওয়েব পোর্টাল হলো এমন একটি ওয়েবসাইট যাতে বিভিন্ন গুরুত্বপূর্ণ লিংক, কনটেন্ট ও সেবা সমন্বিত থাকে। শীলার পেজে “ourboard” লিংকের মাধ্যমে বোর্ডের সাইটে যাওয়ার ব্যবস্থা রয়েছে।\n\nHTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Board Portal</title>\n</head>\n<body>\n    <a href="https://www.e-board.edu.bd">ourboard</a>\n</body>\n</html>\n\`\`\`\nসুতরাং এটি একটি পোর্টালের ভূমিকা পালন করে।`
  },

  // 20. দিনাজপুর বোর্ড-২০১৯
  {
    serialNo: 20,
    boardName: 'Dinajpur Board',
    examYear: '2019',
    stem: `পত্রিকার অনলাইন ভার্সনের ই-পেপার প্রথম পেইজ থেকে পরপর প্রতিটি পেইজ সাজানো থাকে। এ জন্য পাঠকগণের এ ধরনের পত্রিকা পড়ার প্রতি আগ্রহ দিন দিন বৃদ্ধি পাচ্ছে। ‘ক’ নামক বহুজাতিক কোম্পানির ওয়েবসাইট তৈরি করার ক্ষেত্রে খেয়াল রাখে যাতে তাদের প্রতিষ্ঠানের যে কোনো তথ্য খুঁজে পেতে অসুবিধা না হয়। কারণ এ ধরনের ওয়েবসাইটের পেইজগুলো অনেকদিক থেকে সংযুক্ত থাকে। তাছাড়া সৌন্দর্য বৃদ্ধির দিকেও নজর দেয়। ‘খ’ কোম্পানি তাদের ওয়েবসাইটের পেইজগুলো এমনভাবে তৈরি করেছে যার মূল পেইজের সাথে অন্যান্য পেইজগুলো সংযুক্ত থাকে।`,
    q_ka: `(ক) হাইপারলিংক কী?`,
    a_ka: `(ক) হাইপারলিংক হলো একটি ওয়েবপেজের কোনো এলিমেন্টের সাথে অন্য কোনো ওয়েবপেজ বা রিসোর্সের ইলেকট্রনিক সংযোগ ব্যবস্থা।`,
    q_kha: `(খ) হোস্টিং ওয়েবসাইট পাবলিশিং এর একটি গুরুত্বপূর্ণ ধাপ- ব্যাখ্যা কর।`,
    a_kha: `(খ) ইন্টারনেটে ওয়েবসাইটকে সার্বক্ষণিক সচল রাখতে এবং যেকোনো প্রান্ত থেকে ব্রাউজ করার সুযোগ দিতে সার্ভারে প্রয়োজনীয় মেমোরি ভাড়া নিয়ে ফাইল সংরক্ষণ করাকেই হোস্টিং বলে। হোস্টিং ছাড়া পাবলিশিং অসম্ভব।`,
    q_ga: `(গ) উদ্দীপকে পত্রিকার ওয়েব পেইজ যে কাঠামোয় বিন্যস্ত তা ব্যাখ্যা কর।`,
    a_ga: `(গ) পত্রিকার ওয়েবপেজ লিনিয়ার বা অনুক্রমিক (Linear) কাঠামোতে বিন্যস্ত। এতে পাঠকেরা প্রথম পাতা থেকে ক্রমানুসারে পরবর্তী পাতায় ব্রাউজ করতে পারেন।`,
    q_gha: `(ঘ) ‘ক’ ও ‘খ’ কোম্পানির ওয়েব পেইজের কাঠামোর মধ্যে কোনটির ব্যবহার সুবিধাজনক-যুক্তিমূলক মতামত দাও।`,
    a_gha: `(ঘ) ‘ক’ কোম্পানির ওয়েবসাইটের কাঠামো হলো হাইব্রিড বা কম্বিনেশন এবং ‘খ’ কোম্পানির কাঠামো হলো ট্রি বা হায়ারারকিক্যাল। বহুজাতিক প্রতিষ্ঠানের জন্য ‘ক’ কোম্পানির কম্বিনেশন কাঠামো অধিক সুবিধাজনক, কারণ এতে বিভিন্ন ধরনের কাঠামোর সুবিধা একত্রে পাওয়া যায় এবং ব্যবহারকারী সহজেই যেকোনো প্রয়োজনীয় তথ্য খুঁজে পায়।`
  },

  // 21. ঢাকা, যশোর, সিলেট ও দিনাজপুর বোর্ড-২০১৮
  {
    serialNo: 21,
    boardName: 'Dhaka Board',
    examYear: '2018',
    stem: `শুধুমাত্র HTML ব্যবহার করে চন্দনা মডেল কলেজের একটি ওয়েবসাইট তৈরি করা হয়। সাইটটির হোম পেজে ict.jpg নামের 200×300px আকারে একটি ছবি আছে। ছবিটির নিচে notice.html নামের notice পেজের একটি লিংক আছে। ছবির উপরে “welcome to Chandana Model College” লেখাটি নীল রঙে প্রদর্শিত হয়। সাইটটিতে ভিজিটরদের মতামতের কোন ব্যবস্থা নেই।`,
    q_ka: `(ক) ওয়েব পোর্টাল কী?`,
    a_ka: `(ক) ওয়েব পোর্টাল হলো একটি বিশেষ ওয়েবসাইট যা ব্যবহারকারীদের বিভিন্ন তথ্যের উৎস, লিংক ও সেবার সমন্বিত প্ল্যাটফর্ম প্রদান করে।`,
    q_kha: `(খ) হোস্টিং কেন প্রয়োজন বুঝিয়ে লিখ।`,
    a_kha: `(খ) কোনো ওয়েবসাইটের পেজ ও কনটেন্ট ইন্টারনেটের ২৪ ঘণ্টা সচল কোনো কেন্দ্রীয় সার্ভারে সংরক্ষণ করার জন্য ওয়েব হোস্টিং প্রয়োজন।`,
    q_ga: `(গ) উদ্দীপকে উল্লিখিত হোম পেজ তৈরির জন্য HTML কোড লিখ।`,
    a_ga: `(গ) হোম পেজ তৈরির HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Chandana Model College</title>\n</head>\n<body>\n    <h2 style="color: blue;">welcome to Chandana Model College</h2>\n    <img src="ict.jpg" width="200" height="300" alt="ICT"><br>\n    <a href="notice.html">notice</a>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) ওয়েবসাইটটিতে ভিজিটদের মতামত গ্রহণে গৃহীত প্রয়োজনীয় পদক্ষেপ বিশ্লেষণ কর।`,
    a_gha: `(ঘ) সাইটটিতে মতামত গ্রহণের জন্য একে স্ট্যাটিক থেকে ডায়নামিক ওয়েবসাইটে রূপান্তর করতে হবে। এর জন্য HTML ফর্ম ট্যাগ (<form>, <input>, <textarea>, <button>) যুক্ত করে মতামত নেওয়ার ব্যবস্থা করতে হবে এবং ব্যাকেন্ডে PHP/Node.js এবং ডেটাবেজে মতামত সংরক্ষণের ব্যবস্থা গ্রহণ করতে হবে।`
  },

  // 22. রাজশাহী, কুমিল্লা, চট্টগ্রাম ও বরিশাল বোর্ড-২০১৮
  {
    serialNo: 22,
    boardName: 'Rajshahi Board',
    examYear: '2018',
    stem: `চিত্র ১: নেটওয়ার্ক কাঠামো (PAG <-> PAG <-> PAG)\n\nচিত্র ২:\nSubject list:\n1. Bangla\n2. English\n3. ICT`,
    q_ka: `(ক) HTTP কী?`,
    a_ka: `(ক) HTTP এর পূর্ণরূপ Hypertext Transfer Protocol। এটি ক্লায়েন্ট ও ওয়েব সার্ভারের মধ্যে হাইপারটেক্সট বা ডেটা আদান-প্রদান করার প্রোটোকল।`,
    q_kha: `(খ) ওয়েব পেইজের সাথে ব্রাউজারের সম্পর্ক ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবপেজ এইচটিএমএল ভাষায় কোডিং করা থাকে, আর ব্রাউজার সেই কোড ইন্টারপ্রেট করে গ্রাফিক্যাল রূপে প্রদর্শন করে।`,
    q_ga: `(গ) উদ্দীপকের চিত্র ১ দেখে ওয়েব সাইটের কাঠামো ব্যাখ্যা কর।`,
    a_ga: `(গ) চিত্র ১ এর কাঠামোটি হলো নেটওয়ার্ক বা ওয়েব-লিংকড কাঠামো। এ কাঠামোতে প্রতিটি পেজ অন্যান্য সকল পেজের সাথে সরাসরি আন্তঃসংযুক্ত থাকে।`,
    q_gha: `(ঘ) উদ্দীপকের চিত্র ২ কে ওয়েব পেইজ প্রদর্শনের জন্য কোড লিখ।`,
    a_gha: `(ঘ) চিত্র ২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Subject List</title>\n</head>\n<body>\n    <h4><u>Subject list</u></h4>\n    <ol type="1">\n        <li>Bangla</li>\n        <li>English</li>\n        <li>ICT</li>\n    </ol>\n</body>\n</html>\n\`\`\``
  },

  // 23. মাদ্রাসা বোর্ড-২০১৮
  {
    serialNo: 23,
    boardName: 'Madrasah Board',
    examYear: '2018',
    stem: `www.pabnaaliamadrasah.edu.bd নামে মাদ্রাসার সাইটে প্রায়ই প্রতিষ্ঠানের বিভিন্ন কার্যক্রমের ছবি ও ভিডিও আপলোড সম্ভব হচ্ছে না। একজন IT ইঞ্জিনিয়ারের সাথে পরামর্শ করা হলে তিনি জানালেন এখন তো ছবি/ভিডিও রাখতে www.youtube.com এর মত অনেক ওয়েব সাইট রয়েছে। অধ্যক্ষ মহোদয় বললেন তাহলে মাদ্রাসার নিজস্ব ওয়েব সাইটের ব্যবহারকারীরা তা দেখতে পাবে না। ইঞ্জিনিয়ার সাহেব বললেন তাও সম্ভব।`,
    q_ka: `(ক) ফন্ট প্রোপার্টি কী?`,
    a_ka: `(ক) ফন্টের আকার, রং এবং ফেস (ধরণ) নির্ধারণের বৈশিষ্ট্যকে ফন্ট প্রোপার্টি (Font properties: size, color, face) বলে।`,
    q_kha: `(খ) আই.পি অ্যাড্রেস দিয়েও ওয়েবসাইট ভিজিট করা সম্ভব কিভাবে ব্যাখ্যা কর।`,
    a_kha: `(খ) প্রতিটি ডোমেইন নেম মূলত একটি ইউনিক আইপি ঠিকানাকে নির্দেশ করে। ব্রাউজারের অ্যাড্রেসবারে ডোমেইন নামের পরিবর্তে সরাসরি ঐ আইপি অ্যাড্রেস (যেমন: 216.58.216.164) টাইপ করে এন্টার চাপলেও কাঙ্ক্ষিত ওয়েবসাইটে প্রবেশ করা যায়।`,
    q_ga: `(গ) মাদ্রাসাটির ওয়েব সাইটের ডোমেইন টাইপের আলোচনা কর।`,
    a_ga: `(গ) মাদ্রাসার ওয়েবসাইট www.pabnaaliamadrasah.edu.bd এর ডোমেইন টাইপ বিশ্লেষণ:\n১. www হলো হোস্টনেম বা সাবডোমেইন।\n২. .edu হলো শীর্ষ স্তরের জেনেরিক ডোমেইন (gTLD), যা শিক্ষা প্রতিষ্ঠান নির্দেশ করে।\n৩. .bd হলো কান্ট্রি কোড টপ লেভেল ডোমেইন (ccTLD), যা বাংলাদেশকে নির্দেশ করে।`,
    q_gha: `(ঘ) ইঞ্জিনিয়ার সাহেবের সম্ভাব্য সমাধান কী হতে পারে তা বর্ণনা কর।`,
    a_gha: `(ঘ) ইঞ্জিনিয়ার সাহেবের সমাধান হলো ভিডিওগুলো ইউটিউবে আপলোড করে তার এমবেড কোড বা লিংক মাদ্রাসার ওয়েবসাইটে <iframe> বা <a> ট্যাগের সাহায্যে যুক্ত করে দেওয়া। যেমন: <iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>। এতে মাদ্রাসার নিজস্ব সার্ভারের স্টোরেজ ও ব্যান্ডউইথ খরচ হবে না, অথচ ব্যবহারকারীরা মাদ্রাসার সাইট থেকেই সরাসরি ভিডিও দেখতে পারবেন।`
  },

  // 24. ঢাকা বোর্ড-২০১৭
  {
    serialNo: 24,
    boardName: 'Dhaka Board',
    examYear: '2017',
    stem: `শাহরিয়ার সাহেব এমন একটি ছোট ওয়েব পেইজ তৈরি করতে চাইলেন যেখানে Institute.png নামের একটি ছবি ও নিচের টেবিল গুলো থাকবে:\n১ম টেবিল:\n| Serial No | Institute Picture |\n| :---: | :---: |\n| 01 | (Institute.png) |\n\n২য় টেবিল: Employee Information\n| ID No | Emp. Name | Salary |\n| 1001 | Nafis | 50,000 (রো স্প্যান ২) |\n| 1005 | Sajal | |`,
    q_ka: `(ক) HTML Syntax কী?`,
    a_ka: `(ক) HTML ট্যাগ ও এলিমেন্টসমূহ সঠিকভাবে লেখার নির্ধারিত ব্যাকরণগত নিয়মাবলিকে HTML Syntax বলে।`,
    q_kha: `(খ) বর্তমানে ওয়েব পেইজে Hyperlink একটি গুরুত্বপূর্ণ উপাদান- ব্যাখ্যা কর।`,
    a_kha: `(খ) হাইপারলিংকের মাধ্যমে এক পেজ থেকে অন্য পেজে নিমেষেই চলাচল করা যায়। ইন্টারনেটের লক্ষ কোটি পেজকে পরস্পরের সাথে যুক্ত করে বিশাল তথ্যের ভাণ্ডার গড়ে তোলার মূল ভিত্তিই হলো হাইপারলিংক।`,
    q_ga: `(গ) উদ্দীপকে ২য় টেবিলের তথ্যাবলি মজিলা ফায়ারফক্স ওয়েব ব্রাউজারে দেখার জন্য HTML এর সাহায্যে প্রয়োজনীয় কোড লিখ।`,
    a_ga: `(গ) ২য় টেবিলের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Employee Information</title>\n</head>\n<body>\n    <table border="1">\n        <caption>Employee Information</caption>\n        <tr>\n            <th>ID No</th>\n            <th>Emp. Name</th>\n            <th>Salary</th>\n        </tr>\n        <tr>\n            <td>1001</td>\n            <td>Nafis</td>\n            <td rowspan="2">50,000</td>\n        </tr>\n        <tr>\n            <td>1005</td>\n            <td>Sajal</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) ১ম টেবিলের ফাঁকা সেলে উদ্দীপকে উল্লিখিত নামের ছবিসহ ১ম টেবিলের তথ্য ওয়েব ব্রাউজারে দেখার জন্য HTML কোড লিখে ওয়েব পেইজে ইমেজ ব্যবহারের গুরুত্ব ব্যাখ্যা কর।`,
    a_gha: `(ঘ) ১ম টেবিলের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Institute Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th>Serial No</th>\n            <th>Institute Picture</th>\n        </tr>\n        <tr>\n            <td>01</td>\n            <td><img src="Institute.png" width="50" height="50" alt="Institute"></td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\`\nইমেজ ব্যবহারের গুরুত্ব: ইমেজ একটি ওয়েবপেজকে আকর্ষণীয় ও তথ্যবহুল করে তোলে। এটি টেক্সটের বোঝা কমিয়ে মানুষের দৃষ্টি আকর্ষণ করে এবং সহজে বার্তা পৌঁছাতে সাহায্য করে।`
  },

  // 25. রাজশাহী বোর্ড-২০১৭
  {
    serialNo: 25,
    boardName: 'Rajshahi Board',
    examYear: '2017',
    stem: `মি. Z স্যার ক্লাসে html প্রোগ্রামিং দেখাচ্ছিলেন। তিনি একটি ওয়েব পেইজ c ড্রাইভে পিকচার ফোল্ডারের মধ্যে রাখা logo.jpg নামক একটি ইমেজ যুক্ত করলেন যার সাইজ 500×300 পিক্সেল। অতঃপর তিনি ছাত্রদের বললেন তোমরা এমন একটি html কোড লেখ যাতে উক্ত ইমেজের উপর ক্লিক করলে www.xeducationboard.edu.bd ওয়েব সাইট প্রদর্শন করা যায়। অতঃপর তিনি নিচের টেবিলটি তৈরির html কোড লিখলেন:\n\n| Student Name | Compulsory (কলাম স্প্যান ৩) | Optional |\n| :---: | :---: | :---: |\n| Harry Porter | Bangla | English | ICT | Physics<br>Math<br>Biology |`,
    q_ka: `(ক) ওয়েবসাইট কী?`,
    a_ka: `(ক) একই ডোমেইন নেমের অধীনে সার্ভারে সংরক্ষিত একাধিক ওয়েবপেজের সমষ্টিকে ওয়েবসাইট বলে।`,
    q_kha: `(খ) <Font> ট্যাগের অ্যাট্রিবিউটসমূহ ব্যাখ্যা কর।`,
    a_kha: `(খ) <font> ট্যাগের প্রধান অ্যাট্রিবিউট তিনটি: ১. size (অক্ষরের আকার), ২. color (অক্ষরের রং), ৩. face (ফন্টের নাম যেমন- Arial, Vrinda ইত্যাদি)।`,
    q_ga: `(গ) ছাত্রদের html কোড কিরূপ হবে তা দেখাও এবং কোডটিতে যেসব অ্যাট্রিবিউট ব্যবহৃত হয়েছে তাদের ব্যাখ্যা দাও।`,
    a_ga: `(গ) ছাত্রদের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Image Link</title>\n</head>\n<body>\n    <a href="http://www.xeducationboard.edu.bd">\n        <img src="c:/picture/logo.jpg" width="500" height="300" alt="Logo">\n    </a>\n</body>\n</html>\n\`\`\`\nব্যবহৃত অ্যাট্রিবিউট: href (হাইপারলিংকের গন্তব্য ঠিকানা), src (ছবির সোর্স পাথ), width ও height (ছবির আকার নির্ধারণ)।`,
    q_gha: `(ঘ) যদি উদ্দীপকের টেবিলে সকল সারীকে (Row) স্তম্ভে (Column) এবং সকল স্তম্ভকে সারিতে (Row) পরিণত করা হয় তাহলে যে টেবিল তৈরি হয় তা তৈরির জন্য html কোড লেখ।`,
    a_gha: `(ঘ) ট্রান্সপোজড টেবিলের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Transposed Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th>Student Name</th>\n            <td colspan="3" align="center">Harry Porter</td>\n        </tr>\n        <tr>\n            <th rowspan="3">Compulsory</th>\n            <td colspan="3" align="center">Bangla</td>\n        </tr>\n        <tr><td colspan="3" align="center">English</td></tr>\n        <tr><td colspan="3" align="center">ICT</td></tr>\n        <tr>\n            <th>Optional</th>\n            <td>Physics</td>\n            <td>Math</td>\n            <td>Biology</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 26. যশোর বোর্ড-২০১৭
  {
    serialNo: 26,
    boardName: 'Jashore Board',
    examYear: '2017',
    stem: `XYZ College, Dhaka\nAvailable Honor’s Subject\n1. Bangla\n2. English\n3. Mathematics\n4. Accounting`,
    q_ka: `(ক) ওয়েব পেইজ কী?`,
    a_ka: `(ক) ওয়েবপেজ হলো ইন্টারনেটে প্রদর্শনের উপযোগী যেকোনো একক এইচটিএমএল ডকুমেন্ট।`,
    q_kha: `(খ) ডোমেইন নেমের গুরুত্ব ব্যাখ্যা কর।`,
    a_kha: `(খ) প্রতিটি ওয়েবসাইটের আইপি ঠিকানা মুখস্থ রাখা অসম্ভব হওয়ায় ডোমেইন নেম মানুষকে সহজে ওয়েবসাইট খুঁজে পেতে সাহায্য করে।`,
    q_ga: `(গ) উদ্দীপকটি তোমার কলেজের ওয়েবসাইটে হোম পেইজে প্রদর্শনের জন্য HTML কোড লিখ।`,
    a_ga: `(গ) হোম পেজে প্রদর্শনের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>XYZ College</title>\n</head>\n<body>\n    <h1>XYZ College, Dhaka</h1>\n    <h4>Available Honor's Subject</h4>\n    <ol>\n        <li>Bangla</li>\n        <li>English</li>\n        <li>Mathematics</li>\n        <li>Accounting</li>\n    </ol>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) সম্মান বিষয়ে নামের তালিকা নিয়ে Serial no এবং Subject Name এই দুইটি টেবিল হেডিং দুই কলামের একটি (বর্ডারসহ) টেবিল তৈরির HTML কোড লিখ।`,
    a_gha: `(ঘ) টেবিল তৈরির HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Subject Table</title>\n</head>\n<body>\n    <table border="1">\n        <caption>Available Honor's Subject</caption>\n        <tr>\n            <th align="center">Serial No</th>\n            <th align="center">Subject Name</th>\n        </tr>\n        <tr><td align="center">1</td><td align="center">Bangla</td></tr>\n        <tr><td align="center">2</td><td align="center">English</td></tr>\n        <tr><td align="center">3</td><td align="center">Mathematics</td></tr>\n        <tr><td align="center">4</td><td align="center">Accounting</td></tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 27. কুমিল্লা বোর্ড-২০১৭
  {
    serialNo: 27,
    boardName: 'Cumilla Board',
    examYear: '2017',
    stem: `দৃশ্যকল্প-১: ট্রি কাঠামো: Home page -> Page-1, Page-2 -> Page-3, Page-4, Page-5\n\nদৃশ্যকল্প-২: টেবিল\n| Roll | Subject |\n| 201 | Bangla |\n| 202 | English |\n| 203 | ICT |`,
    q_ka: `(ক) মডেম কী?`,
    a_ka: `(ক) মডেম (Modulator-Demodulator) হলো একটি নেটওয়ার্কিং ডিভাইস যা ডিজিটাল সিগন্যালকে অ্যানালগ এবং অ্যানালগ সিগন্যালকে ডিজিটালে রূপান্তর করে।`,
    q_kha: `(খ) ‘আলোর গতিতে ডেটা প্রেরণ সম্ভব’- ব্যাখ্যা কর।`,
    a_kha: `(খ) অপটিক্যাল ফাইবার কেবলে কাঁচ বা প্লাস্টিকের সরু তন্তুর মধ্য দিয়ে আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলনের মাধ্যমে আলোক তরঙ্গে ডেটা পরিবাহিত হয়, ফলে প্রায় আলোর গতিতেই ডেটা প্রেরণ করা সম্ভব।`,
    q_ga: `(গ) উদ্দীপকের দৃশ্যকল্প-১ ওয়েবসাইট কাঠামো ব্যাখ্যা কর।`,
    a_ga: `(গ) দৃশ্যকল্প-১ এ হায়ারারকিক্যাল বা ট্রি কাঠামো প্রদর্শিত হয়েছে। এটি হোম পেজকে মূল ধরে অন্যান্য পেজগুলোকে শাখা-প্রশাখায় সুবিন্যস্ত করে।`,
    q_gha: `(ঘ) উদ্দীপকের দৃশ্যকল্প-২ কে ওয়েব পেইজে প্রদর্শনের জন্য HTML-এর প্রয়োজনীয় কোডসমূহ লিখ।`,
    a_gha: `(ঘ) দৃশ্যকল্প-২ এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Student Table</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th>Roll</th>\n            <th>Subject</th>\n        </tr>\n        <tr><td>201</td><td>Bangla</td></tr>\n        <tr><td>202</td><td>English</td></tr>\n        <tr><td>203</td><td>ICT</td></tr>\n    </table>\n</body>\n</html>\n\`\`\``
  },

  // 28. চট্টগ্রাম বোর্ড-২০১৭
  {
    serialNo: 28,
    boardName: 'Chattogram Board',
    examYear: '2017',
    stem: `দিদার Test পরীক্ষার ফলাফল প্রদর্শনের জন্য নিচের ওয়েবপেইজটি তৈরি করে এবং test.html নামে সেভ করে রাখে:\nTest Result\n| Roll | Group | Name | Result | image.jpg (রো স্প্যান ৫) |\n| :---: | :---: | :---: | :---: | :---: |\n| 101 | Hum. | Reza | A+ | |\n| 102 | Hum. | Eva | B | |\n| 103 | Hum. | Jaber | A- | |\n| 104 | Hum. | Joni | C | |`,
    q_ka: `(ক) ওয়েবসাইট কী?`,
    a_ka: `(ক) ইন্টারনেটে একই ডোমেইনের অধীনে সংরক্ষিত আন্তঃসম্পর্কযুক্ত ওয়েবপেজসমূহের সমষ্টিকে ওয়েবসাইট বলে।`,
    q_kha: `(খ) HTML-এর ব্যবহারের সুবিধা বর্ণনা কর।`,
    a_kha: `(খ) এইচটিএমএল শেখা ও ব্যবহার সহজ, এটি সম্পূর্ণ ফ্রি এবং প্রায় সকল আধুনিক ওয়েব ব্রাউজার এটিকে নির্বিঘ্নে সাপোর্ট করে।`,
    q_ga: `(গ) উদ্দীপকের test.html ফাইলটি তৈরির জন্য HTML কোড লিখ।`,
    a_ga: `(গ) test.html এর HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Test Result</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th colspan="4" align="center">Test Result</th>\n            <td rowspan="5"><img src="image.jpg" alt="Student Photo"></td>\n        </tr>\n        <tr>\n            <th>Roll</th>\n            <th>Group</th>\n            <th>Name</th>\n            <th>Result</th>\n        </tr>\n        <tr><td>101</td><td>Hum.</td><td>Reza</td><td>A+</td></tr>\n        <tr><td>102</td><td>Hum.</td><td>Eva</td><td>B</td></tr>\n        <tr><td>103</td><td>Hum.</td><td>Jaber</td><td>A-</td></tr>\n        <tr><td>104</td><td>Hum.</td><td>Joni</td><td>C</td></tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) Image.jpg এর উপর ক্লিক করলে www.moedu.gov.bd ওয়েবসাইটটি প্রদর্শন করার html কোড লিখে ওয়েব পেইজে উক্ত ট্যাগের ভূমিকা বিশ্লেষণ কর।`,
    a_gha: `(ঘ) ইমেজ হাইপারলিংকের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Linked Image</title>\n</head>\n<body>\n    <a href="http://www.moedu.gov.bd">\n        <img src="image.jpg" width="50" height="50" alt="Ministry of Education">\n    </a>\n</body>\n</html>\n\`\`\`\nবিশ্লেষণ: এখানে <a> ট্যাগটি হাইপারলিংক তৈরি করেছে এবং <img> ট্যাগটি লিংকের দৃশ্যমান ছবি হিসেবে কাজ করছে। ছবিতে ক্লিক করলে সরাসরি শিক্ষা মন্ত্রণালয়ের ওয়েবসাইটে নিয়ে যাবে।`
  },

  // 29. সিলেট বোর্ড-২০১৭
  {
    serialNo: 29,
    boardName: 'Sylhet Board',
    examYear: '2017',
    stem: `প্রমিতা একটি ওয়েবসাইট তৈরির জন্য Home.html, Admission.html এবং Result.html নামে ৩টি পেইজ তৈরি করল। Result.html পেইজে নিম্নরূপ ফলাফল প্রদর্শিত হয়:\n| Roll | Name | GPA |\n| 101 | Karim | 5.00 |\n| 102 | Afrin | 4.75 |\n| 103 | Zakia | 4.50 |\nঅতঃপর সে Home পেইজ থেকে অন্যান্য পেইজে যাওয়ার ব্যবস্থা করল।`,
    q_ka: `(ক) আইপি অ্যাড্রেস কী?`,
    a_ka: `(ক) ইন্টারনেটে প্রতিটি ডিভাইসের যোগাযোগের জন্য নির্ধারিত অনন্য সংখ্যাভিত্তিক পরিচয় হলো আইপি অ্যাড্রেস।`,
    q_kha: `(খ) হোস্টিং ওয়েবসাইট পাবলিকেশনের একটি গুরুত্বপূর্ণ ধাপ- বুঝিয়ে লেখ।`,
    a_kha: `(খ) ওয়েবসাইট ইন্টারনেটে সর্বসাধারণের দেখার উপযোগী করতে বিশ্বস্ত সার্ভারে ডেটা সংরক্ষণ বা হোস্টিং করা অপরিহার্য।`,
    q_ga: `(গ) Result.html পেইজের টেবিলটি তৈরির html কোড লিখ।`,
    a_ga: `(গ) Result.html টেবিলের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Result</title>\n</head>\n<body>\n    <table border="1">\n        <tr>\n            <th>Roll</th>\n            <th>Name</th>\n            <th>GPA</th>\n        </tr>\n        <tr><td>101</td><td>Karim</td><td>5.00</td></tr>\n        <tr><td>102</td><td>Afrin</td><td>4.75</td></tr>\n        <tr><td>103</td><td>Zakia</td><td>4.50</td></tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) প্রমিতার সর্বশেষ গৃহীত ব্যবস্থার প্রয়োজনীয়তা মূল্যায়ন কর।`,
    a_gha: `(ঘ) প্রমিতার সর্বশেষ গৃহীত ব্যবস্থাটি হলো হাইপারলিংক। হাইপারলিংক না থাকলে ব্যবহারকারীকে প্রতিটি পেজের ইউআরএল ম্যানুয়ালি টাইপ করতে হতো যা অত্যন্ত কষ্টসাধ্য। হোম পেজ থেকে Admission.html ও Result.html এ সরাসরি লিংক করে দেওয়ার ফলে ব্যবহারকারীরা এক ক্লিকেই সহজে প্রয়োজনীয় পেজে যাতায়াত করতে পারবেন।`
  },

  // 30. বরিশাল বোর্ড-২০১৭
  {
    serialNo: 30,
    boardName: 'Barishal Board',
    examYear: '2017',
    stem: `দুই বন্ধু আনিস এবং ইকবাল ওয়েবপেইজ তৈরির প্রশিক্ষণ নেয়। আনিস চিত্র-১ (হায়ারারকিক্যাল কাঠামো) এবং ইকবাল চিত্র-২ (লিনিয়ার কাঠামো: ১ -> ২ -> ৩) এর কাঠামো বেছে নিয়ে ওয়েবপেইজ তৈরি করে।`,
    q_ka: `(ক) আইপি অ্যাড্রেস কী?`,
    a_ka: `(ক) আইপি অ্যাড্রেস হলো ইন্টারনেটে যুক্ত প্রতিটি কম্পিউটারের অনন্য সাংখ্যিক ঠিকানা।`,
    q_kha: `(খ) ওয়েব পেজের সাথে ব্রাউজারের সম্পর্ক ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবপেজ হলো এইচটিএমএল কনটেন্ট আর ব্রাউজার হলো সেই কনটেন্টকে রেন্ডার করে ব্যবহারকারীর সামনে উপস্থাপন করার মাধ্যম।`,
    q_ga: `(গ) ইকবালের ওয়েব পেইজ স্ট্রাকচার শনাক্ত করে ব্যাখ্যা কর।`,
    a_ga: `(গ) ইকবালের পেজ স্ট্রাকচারটি হলো লিনিয়ার বা অনুক্রমিক কাঠামো। এতে পেজগুলো নির্দিষ্ট ক্রমানুসারে সাজানো থাকে এবং একের পর এক ক্রমান্বয়ে ব্রাউজ করতে হয়।`,
    q_gha: `(ঘ) উদ্দীপকের স্ট্রাকচার দুটির মধ্যে কোনটির ব্যবহার অধিক সুবিধাজনক-বিশ্লেষণপূর্বক মতামত দাও।`,
    a_gha: `(ঘ) আনিসের হায়ারারকিক্যাল বা ট্রি কাঠামোটি অধিক সুবিধাজনক। কারণ এটি ব্যবহারকারীকে হোমপেজ থেকে সরাসরি কাঙ্ক্ষিত ক্যাটাগরিতে যাওয়ার স্বাধীনতা দেয় এবং সাইটের পূর্ণাঙ্গ চিত্র সহজে তুলে ধরে।`
  },

  // 31. দিনাজপুর বোর্ড-২০১৭
  {
    serialNo: 31,
    boardName: 'Dinajpur Board',
    examYear: '2017',
    stem: `HTML কোড:\n\`\`\`html\n<html>\n<head> <title> ICT </title> </head>\n<body>\n<h3> COLLEGE RESULT </h3>\n<table>\n<tr>\n<th> Roll </th> <th> Name </th> <th> Result </th>\n</tr>\n<tr>\n<td> 501 </td> <td> Sumaiya </td>\n<td> <a href = "Exam Result.html"> My Test Result </a> </td>\n</tr>\n</table>\n</body>\n</html>\n\`\`\``,
    q_ka: `(ক) ব্রাউজার কী?`,
    a_ka: `(ক) ওয়েব ব্রাউজার হলো একটি অ্যাপ্লিকেশন সফটওয়্যার যা দিয়ে ইন্টারনেটে তথ্য ও ওয়েবপেজ খুঁজে প্রদর্শন করা হয়।`,
    q_kha: `(খ) “IP Address এর চেয়ে Domain Name ব্যবহার সুবিধাজনক”-ব্যাখ্যা কর।`,
    a_kha: `(খ) সংখ্যাভিত্তিক আইপি অ্যাড্রেস মনে রাখা মানুষের পক্ষে কঠিন, কিন্তু অর্থপূর্ণ অক্ষরমূলক ডোমেইন নেম সহজেই স্মরণে রাখা যায়।`,
    q_ga: `(গ) উদ্দীপকের মৌলিক কাঠামো ব্যাখ্যা কর।`,
    a_ga: `(গ) উদ্দীপকে HTML এর মৌলিক কাঠামো ব্যবহৃত হয়েছে। এতে <html> রুটের অধীনে দুটি মূল অংশ থাকে: ১. <head> অংশ (শিরোনাম ও মেটাডেটা) এবং ২. <body> অংশ (ব্যবহারকারীর দৃশ্যমান কনটেন্ট ও টেবিল)।`,
    q_gha: `(ঘ) উদ্দীপকটি ইন্টারনেটে দেখার প্রয়োজনীয় পদক্ষেপের সপক্ষে তোমার মতামত দাও।`,
    a_gha: `(ঘ) ইন্টারনেটে প্রদর্শন করতে হলে ডোমেইন নেম রেজিস্ট্রেশন করতে হবে, নির্ভরযোগ্য হোস্টিং সার্ভার স্পেস নিতে হবে এবং ফাইলটি সার্ভারে আপলোড করতে হবে।`
  },

  // 32. মাদ্রাসা বোর্ড-২০১৭
  {
    serialNo: 32,
    boardName: 'Madrasah Board',
    examYear: '2017',
    stem: `করিমনগর মাদ্রাসা ওয়েবসাইটে অধ্যক্ষ ও শিক্ষকমণ্ডলীর ছবি ছাড়া তালিকা দেওয়া আছে। সম্প্রতি শিক্ষা মন্ত্রণালয়ের চাহিদা মোতাবেক অধ্যক্ষ মহোদয় ছবিসহ ওয়েবসাইট পাবলিশ করার জন্য ICT শিক্ষককে বললে, তিনি জানালেন বর্তমান অবস্থায় মাদ্রাসার ওয়েবসাইটে ছবি আপলোড করা সম্ভব নয়। উক্ত সমস্যা সমাধানের জন্য অধ্যক্ষ মহোদয় ICT শিক্ষককে বিশেষজ্ঞের পরামর্শ নেওয়ার জন্য নির্দেশ দিলেন।`,
    q_ka: `(ক) ক্লায়েন্ট সার্ভার কী?`,
    a_ka: `(ক) ক্লায়েন্ট-সার্ভার হলো এমন একটি নেটওয়ার্ক ব্যবস্থা যেখানে সার্ভার বিভিন্ন সেবা ও ডেটা প্রদান করে এবং ক্লায়েন্ট কম্পিউটার সেই সেবা গ্রহণ করে।`,
    q_kha: `(খ) “টেস্টিং ও ডিবাগিং এক নয়।” -বর্ণনা কর।`,
    a_kha: `(খ) টেস্টিং হলো প্রোগ্রামে কোনো ভুলত্রুটি বা বাগ আছে কিনা তা যাচাই করা, আর ডিবাগিং হলো চিহ্নিত সেই ভুলত্রুটিগুলো সংশোধন করা।`,
    q_ga: `(গ) উদ্দীপকের আলোকে মাদ্রাসার ওয়েবসাইটটির বর্তমান অবস্থা বর্ণনা কর।`,
    a_ga: `(গ) মাদ্রাসার ওয়েবসাইটটি বর্তমানে স্ট্যাটিক অবস্থায় রয়েছে। এতে কোনো ডেটাবেজ বা ফাইল আপলোড কার্যকারিতা না থাকায় সাধারণ ব্যবহারকারী ছবি আপলোড করতে পারছে না।`,
    q_gha: `(ঘ) সমস্যা সমাধানে বিশেষজ্ঞের মতামত কীরূপ হতে পারে-পরামর্শ দাও।`,
    a_gha: `(ঘ) বিশেষজ্ঞের পরামর্শ হবে ওয়েবসাইটটিকে স্ট্যাটিক থেকে ডায়নামিক ওয়েবসাইটে রূপান্তর করা। এজন্য PHP বা Node.js স্ক্রিপ্টিং এবং MySQL/MongoDB ডেটাবেজ সংযোগ দিয়ে একটি সুরক্ষিত অ্যাডমিন ড্যাশবোর্ড তৈরি করতে হবে, যাতে সহজেই ছবি ও ফাইল আপলোড করা যায়।`
  },

  // 33. ঢাকা বোর্ড-২০১৬
  {
    serialNo: 33,
    boardName: 'Dhaka Board',
    examYear: '2016',
    stem: `দৃশ্যকল্প-১: ট্রি কাঠামো: Home Page -> P-1, P-2 -> P-3, P-4, P-5, P-6\n\nদৃশ্যকল্প-২: শুভ ওয়েব পেইজ তৈরির প্রশিক্ষণ নেয়। সে নিজের পরিচয় ও ছবি সংবলিত একটি ওয়েব পেইজ তৈরি করে তা ব্রাউজারে রান করে নিজের কম্পিউটারে দেখে। সে তার ওয়েব পেইজটিকে আরও তথ্য সমৃদ্ধ করে shouvo.net নামে চালু করার সিদ্ধান্ত নেয়। শুভ তার বন্ধু রাহুলকে এ কথা বললে সে বলে, “আজ রাতেই ইন্টারনেটে তোমার ওয়েব পেইজ দেখব”। জবাবে শুভ বলে, “এখনই দেখতে পাবে না। আমাকে আরও কিছু পাবলিশিং-এর কাজ করতে হবে।”`,
    q_ka: `(ক) ওয়েবসাইট কী?`,
    a_ka: `(ক) ইন্টারনেটে একই ডোমেইনের অধীনে সংরক্ষিত আন্তঃসম্পর্কযুক্ত ওয়েবপেজসমূহের সমষ্টিকে ওয়েবসাইট বলে।`,
    q_kha: `(খ) ওয়েব পেইজের সাথে ব্রাউজারের সম্পর্ক ব্যাখ্যা কর।`,
    a_kha: `(খ) ওয়েবপেজ হলো HTML কোডে রচিত ডকুমেন্ট, আর ব্রাউজার সেই কোড ইন্টারপ্রেট করে স্ক্রিনে প্রদর্শন করে।`,
    q_ga: `(গ) দৃশ্যকল্প-১ এ ওয়েবসাইটের কাঠামোটি ব্যাখ্যা কর।`,
    a_ga: `(গ) দৃশ্যকল্প-১ এর কাঠামোটি হলো ট্রি বা হায়ারারকিক্যাল কাঠামো। এতে একটি মূল হোমপেজ থেকে বিভিন্ন সাব-পেজে সুশৃঙ্খলভাবে গমন করা যায়।`,
    q_gha: `(ঘ) দৃশ্যকল্প-২ এ শুভর উক্তির যৌক্তিকতা বিশ্লেষণ কর।`,
    a_gha: `(ঘ) শুভর উক্তি সম্পূর্ণ যৌক্তিক। নিজের কম্পিউটারে ফাইল রান করলে তা শুধু অফলাইনেই দেখা যায়। বিশ্বব্যাপী ইন্টারনেটে উন্মুক্ত করতে হলে ডোমেইন নেম রেজিস্ট্রেশন, হোস্টিং সার্ভার ক্রয় এবং এফটিপির মাধ্যমে ফাইল আপলোড করার আবশ্যকীয় কাজগুলো সম্পন্ন করতে হয়।`
  },

  // 34. রাজশাহী বোর্ড-২০১৬
  {
    serialNo: 34,
    boardName: 'Rajshahi Board',
    examYear: '2016',
    stem: `আলোর সোপান বিদ্যালয় কর্তৃপক্ষ একটি ওয়েবসাইট তৈরির কথা ভাবছে। হোম পেজে "campus.JPG" নামক একটি ছবি, Information Technology, Physical Science ও Biological Science শাখাগুলোর ক্রমানুবর্তী তালিকা এবং "Notice Board" নামক একটি লিংক থাকবে। কর্তৃপক্ষ একটি সফটওয়্যার ফার্মের তিনজন বিশেষজ্ঞকে ডাকলেন। বিশেষজ্ঞ দল দুই ধরনের সমাধান দিলেন। প্রথম পদ্ধতিতে খরচ কম কিন্তু নিয়মিত ডেটা আপডেট করতে সমস্যা হবে। দ্বিতীয় পদ্ধতিতে খরচ বেশি কিন্তু নিয়মিত ডেটা আপডেট করা যাবে।`,
    q_ka: `(ক) Tag কী?`,
    a_ka: `(ক) HTML ট্যাগ হলো ‘< >’ ব্র্যাকেটের মাঝে অবস্থিত সুনির্দিষ্ট কোনো নির্দেশের সাংকেতিক শব্দ বা প্রতীক।`,
    q_kha: `(খ) "www.mangoinfo.com" ব্যাখ্যা কর।`,
    a_kha: `(খ) এটি একটি ডোমেইন নেম। এর www হলো সাবডোমেইন, mangoinfo হলো সেকেন্ড লেভেল ডোমেইন (প্রতিষ্ঠানের নাম), এবং .com হলো বাণিজ্যিক প্রতিষ্ঠান নির্দেশক টপ লেভেল ডোমেইন।`,
    q_ga: `(গ) উদ্দীপকে উল্লেখিত হোম পেইজ তৈরির জন্য HTML কোড লিখ।`,
    a_ga: `(গ) হোম পেজের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Alor Sopan School</title>\n</head>\n<body>\n    <img src="campus.jpg" width="100" height="100" alt="Campus"><br>\n    <ol>\n        <li>Information Technology</li>\n        <li>Physical Science</li>\n        <li>Biological Science</li>\n    </ol>\n    <a href="Notice Board.html">Notice Board</a>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) বিশেষজ্ঞ দলের সমাধানদ্বয়ের মধ্যে কোনটি আলোর সোপান বিদ্যালয়ের জন্য উত্তম? বিশ্লেষণপূর্বক মতামত দাও।`,
    a_gha: `(ঘ) দ্বিতীয় পদ্ধতিটি (ডায়নামিক ওয়েবসাইট) আলোর সোপান বিদ্যালয়ের জন্য সর্বোত্তম। শিক্ষা প্রতিষ্ঠানের নোটিশ, ফলাফল ও তথ্য নিয়মিত পরিবর্তন হয়। ডায়নামিক ওয়েবসাইটে অ্যাডমিন প্যানেল দিয়ে সহজেই এসব পরিবর্তন করা যায়, যা স্ট্যাটিক ওয়েবসাইটে সম্ভব নয়।`
  },

  // 35. যশোর বোর্ড-২০১৬
  {
    serialNo: 35,
    boardName: 'Jashore Board',
    examYear: '2016',
    stem: `This is my home page\nBangladesh is land of rivers and cannals`,
    q_ka: `(ক) সার্চ ইঞ্জিন কী?`,
    a_ka: `(ক) সার্চ ইঞ্জিন হলো এমন একটি সফটওয়্যার যা ওয়েবে থাকা কোটি কোটি তথ্য থেকে কাঙ্ক্ষিত তথ্য খুঁজে বের করতে সাহায্য করে।`,
    q_kha: `(খ) ডোমেইন নেইম এ www থাকে কেন? ব্যাখ্যা কর।`,
    a_kha: `(খ) www মানে World Wide Web। এটি নির্দেশ করে যে হোস্ট সার্ভারটি বিশ্বব্যাপী ওয়েব সেবার অংশ হিসেবে ইন্টারনেটে সংযুক্ত।`,
    q_ga: `(গ) উদ্দীপকের অনুচ্ছেদটি ওয়েবে প্রকাশের প্রয়োজনীয় ট্যাগসমূহ ব্যাখ্যা কর।`,
    a_ga: `(গ) প্রয়োজনীয় HTML কোড ও ট্যাগসমূহ:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head><title>Home Page</title></head>\n<body>\n    <p><b><u>This is my home page</u></b><br>\n    Bangladesh is a land of rivers and cannals.</p>\n</body>\n</html>\n\`\`\`\nব্যবহৃত ট্যাগসমূহ: <html>, <body>, <p> (প্যারাগ্রাফ), <b> (বোল্ড), <u> (আন্ডারলাইন), <br> (লাইন ব্রেক)।`,
    q_gha: `(ঘ) উদ্দীপকে অনুচ্ছেদটি বাংলায় তৈরি করার করণীয় বিষয়সমূহ সংক্ষেপে আলোচনা কর।`,
    a_gha: `(ঘ) অনুচ্ছেদটি বাংলায় তৈরি করতে ডকুমেন্টের হেড অংশে <meta charset="UTF-8"> যুক্ত করতে হবে এবং বাংলা ইউনিকোড ফন্ট (যেমন: SolaimanLipi বা Kalpurush) ব্যবহার করে সরাসরি বাংলায় টাইপ করতে হবে।`
  },

  // 36. কুমিল্লা বোর্ড-২০১৬
  {
    serialNo: 36,
    boardName: 'Cumilla Board',
    examYear: '2016',
    stem: `আইসিটি শিক্ষক আসমা ম্যাডাম ওয়েবপেইজ তৈরির জন্য শিক্ষার্থীদের নিচের চিত্রের মতো ওয়েবপেইজ কাঠামোর পরামর্শ দিলেন। শিক্ষার্থীদের মধ্যে অনন্যা চিত্র-১ (লিনিয়ার কাঠামো) এবং অরিত্র চিত্র-২ (ট্রি কাঠামো) বেছে নিয়ে ওয়েবপেইজ তৈরি করল।`,
    q_ka: `(ক) হোম পেইজ কী?`,
    a_ka: `(ক) কোনো ওয়েবসাইটে প্রবেশ করলে সর্বপ্রথম যে মূল পৃষ্ঠাটি প্রদর্শিত হয় তাকে হোম পেজ বলে।`,
    q_kha: `(খ) ওয়েবপেইজ ডিজাইনে HTML এর গুরুত্ব ব্যাখ্যা কর।`,
    a_kha: `(খ) HTML হলো যেকোনো ওয়েবপেজের মূল কাঠামো বা কঙ্কাল তৈরির ভাষা। এটি ছাড়া ব্রাউজারে টেক্সট, ইমেজ বা লিংক সাজিয়ে উপস্থাপন করা অসম্ভব।`,
    q_ga: `(গ) অনন্যার ওয়েব পেইজ স্ট্রাকচারটি শনাক্ত করে ব্যাখ্যা কর।`,
    a_ga: `(গ) অনন্যার ওয়েবসাইটের স্ট্রাকচারটি হলো লিনিয়ার বা সিকোয়েন্সিয়াল কাঠামো। এতে পেজগুলো একটির পর একটি ক্রমানুসারে সাজানো থাকে।`,
    q_gha: `(ঘ) উদ্দীপকে স্ট্রাকচার দুটির মধ্যে অরিত্র’র স্ট্রাকচারটি স্বাচ্ছন্দ্যে ব্যবহার করা যায় বিশ্লেষণপূর্বক মতামত দাও।`,
    a_gha: `(ঘ) অরিত্রর ট্রি বা হায়ারারকিক্যাল কাঠামোটি অধিক স্বাচ্ছন্দ্যে ব্যবহার করা যায়। কারণ এতে মূল পেজ থেকে ব্যবহারকারী সহজে নিজের পছন্দমতো সাব-ক্যাটাগরির পেজে প্রবেশ করতে পারে।`
  },

  // 37. চট্টগ্রাম বোর্ড-২০১৬
  {
    serialNo: 37,
    boardName: 'Chattogram Board',
    examYear: '2016',
    stem: `'X' প্রতিষ্ঠানের হোম পেইজে প্রতিষ্ঠানের প্রশাসনিক ভবনের ছবি দেওয়া আছে। Employee.html ও Product.html নামে দু'টি ওয়েবপেইজ হোম পেইজের সাথে লিংক করা আছে। ওয়েবসাইটটি ইন্টারনেটে থাকলে বিশ্বের সচেতন মানুষ প্রতিষ্ঠান সম্পর্কে জানতে পারবে।`,
    q_ka: `(ক) URL কী?`,
    a_ka: `(ক) URL (Uniform Resource Locator) হলো ইন্টারনেটে কোনো ওয়েবসাইটের যেকোনো রিসোর্স বা পেজের পূর্ণাঙ্গ ওয়েব ঠিকানা।`,
    q_kha: `(খ) “প্রতিনিয়ত পরিবর্তনশীল তথ্যের ওয়েবসাইট” ব্যাখ্যা কর।`,
    a_kha: `(খ) যে সকল ওয়েবসাইটের তথ্য রিয়েল-টাইমে আপডেট হয় এবং ব্যবহারকারীর ইনপুটের ভিত্তিতে পরিবর্তিত কনটেন্ট প্রদর্শন করে তাকে ডায়নামিক ওয়েবসাইট বলে।`,
    q_ga: `(গ) উদ্দীপকে উল্লিখিত প্রতিষ্ঠানটির হোম পেইজ তৈরির html কোড লেখ।`,
    a_ga: `(গ) হোম পেজের HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head><title>X Company</title></head>\n<body>\n    <img src="building.jpg" alt="Administrative Building"><br>\n    <a href="Employee.html">Employee</a><br>\n    <a href="Product.html">Product</a>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) উদ্দীপকের আলোকে সচেতন মানুষের দৃষ্টিগোচর করার প্রয়োজনীয় পদক্ষেপ কী হতে পারে? যুক্তিসহ ব্যাখ্যা কর।`,
    a_gha: `(ঘ) মানুষের দৃষ্টিগোচর করার জন্য ডোমেইন নেম রেজিস্ট্রেশন, নির্ভরযোগ্য ওয়েব হোস্টিং সার্ভারে সাইট আপলোড এবং সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) ও সামাজিক মাধ্যমে প্রচারণা চালাতে হবে।`
  },

  // 38. সিলেট বোর্ড-২০১৬
  {
    serialNo: 38,
    boardName: 'Sylhet Board',
    examYear: '2016',
    stem: `বর্তমানে 'X' কলেজ তাদের কার্যক্রম সুষ্ঠুভাবে পরিচালনার জন্য Website তৈরির সিদ্ধান্ত গ্রহণ করেছে। এইজন্য শুধুমাত্র html ব্যবহার করে শিক্ষার্থীদের নাম, পিতার নাম, জন্মতারিখ, রোল নম্বর ও সেকশন ফিল্ড সংযুক্ত করে Student's information নামক টেবিল তৈরি করে। তবে সরকারও বর্তমানে সকল স্কুল কলেজের হালনাগাদ তথ্য উপস্থাপনের জন্য ওয়েবসাইট তৈরি করার নির্দেশ দিয়েছেন।`,
    q_ka: `(ক) ডোমেইন নেম কী?`,
    a_ka: `(ক) ডোমেইন নেম হলো ইন্টারনেটে কোনো ওয়েবসাইটকে সহজে চেনার জন্য আইপি ঠিকানার বিপরীতে ব্যবহৃত আলফানিউমেরিক নাম।`,
    q_kha: `(খ) যে প্রযুক্তি ঝুঁকিপূর্ণ কাজকে সহজ করেছে তা ব্যাখ্যা কর।`,
    a_kha: `(খ) রোবটিক্স প্রযুক্তি ঝুঁকিপূর্ণ, ক্ষতিকর ও ক্লান্তিকর কাজকে সহজ ও নিরাপদ করেছে (যেমন: পারমাণবিক প্ল্যান্ট, বোমা নিষ্ক্রিয়করণ, খনি ইত্যাদিতে রোবটের ব্যবহার)।`,
    q_ga: `(গ) উদ্দীপকে উল্লিখিত টেবিলটি ডিজাইনের জন্য প্রয়োজনীয় HTML কোড লেখ।`,
    a_ga: `(গ) টেবিলটির HTML কোড:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head><title>Student Info</title></head>\n<body>\n    <table border="1" width="100%">\n        <caption>Student's Information</caption>\n        <tr>\n            <th>Student's Name</th>\n            <th>Father's Name</th>\n            <th>Date of Birth</th>\n            <th>Roll No</th>\n            <th>Section</th>\n        </tr>\n        <tr>\n            <td>Zarin Tasnim</td>\n            <td>Zahidur Rahman</td>\n            <td>10-03-2000</td>\n            <td>1101</td>\n            <td>SC</td>\n        </tr>\n        <tr>\n            <td>Razana Onse</td>\n            <td>Saiful Alam</td>\n            <td>15-05-2000</td>\n            <td>1102</td>\n            <td>SE</td>\n        </tr>\n    </table>\n</body>\n</html>\n\`\`\``,
    q_gha: `(ঘ) কর্তৃপক্ষের গৃহীত ব্যবস্থায় সরকারের নির্দেশ পুরোপুরি বাস্তবায়ন করতে হলে যা যা করণীয় বিশ্লেষণপূর্বক মতামত দাও।`,
    a_gha: `(ঘ) সরকারি নির্দেশ পুরোপুরি বাস্তবায়নে কলেজটিকে একটি পূর্ণাঙ্গ ডায়নামিক ওয়েবসাইট তৈরি করতে হবে। এতে নিয়মিত শিক্ষার্থী, ফলাফল ও নোটিশের তথ্য ডেটাবেজের মাধ্যমে হালনাগাদ করার ব্যবস্থা এবং শিক্ষা বোর্ডের সার্ভারের সাথে সিংক করার সুবিধা নিশ্চিত করতে হবে।`
  },

  // 39. বরিশাল বোর্ড-২০১৬
  {
    serialNo: 39,
    boardName: 'Barishal Board',
    examYear: '2016',
    stem: `মোহন একটি ওয়েবসাইট ব্রাউজ করতে গিয়ে দেখে ওয়েবসাইটটির প্রতিটি পেইজে যেতে হলেই বারবার হোম পেইজে আসতে হয়। আর হোম পেইজটি নানা ধরনের নান্দনিক বিজ্ঞাপনে সাজানো। যাতে করে সবাই আকৃষ্ট হয়। প্রথমবার ব্যবহার করতে গিয়ে সে কিছুটা স্বাচ্ছন্দ্য বোধ করে। কিন্তু সে ওয়েবসাইটের একটি ছবি ব্রাউজ করতে গিয়ে দেখে পেইজটি লোড হতে বেশি সময় নেয়। তাছাড়া পেইজটি দেখা গেলেও সকল ছবি ব্রাউজার প্রদর্শন করতে পারছে না। এতে সে বিরক্ত হয়।`,
    q_ka: `(ক) এইচটিএমএল ট্যাগ কী?`,
    a_ka: `(ক) এইচটিএমএল ট্যাগ হলো ‘< >’ ব্র্যাকেটের মধ্যে আবদ্ধ সুনির্দিষ্ট কোনো নির্দেশের সাংকেতিক শব্দ যা দিয়ে ব্রাউজারকে নির্দেশ দেওয়া হয়।`,
    q_kha: `(খ) ডোমেইন নেম রেজিস্ট্রেশন করতে হয় কেন?`,
    a_kha: `(খ) বিশ্বব্যাপী ডোমেইন নেম যেন অদ্বিতীয় থাকে এবং অন্য কেউ একই নাম দখল করতে না পারে, সেজন্য নির্ধারিত ফি প্রদানপূর্বক অথরাইজড রেজিস্ট্রারের কাছ থেকে ডোমেইন নেম রেজিস্ট্রেশন করতে হয়।`,
    q_ga: `(গ) উদ্দীপকের ওয়েবসাইটটির কাঠামো ব্যাখ্যা কর।`,
    a_ga: `(গ) উদ্দীপকের সাইটটির কাঠামো হলো স্টার কাঠামো। কারণ এতে যেকোনো পেজে যাওয়ার জন্য বা পেজ পরিবর্তনের জন্য সবসময় কেন্দ্রীয় হোমপেজে ফিরে আসতে হয়।`,
    q_gha: `(ঘ) উদ্দীপকে উল্লিখিত সমস্যা সমাধানে তোমার সুচিন্তিত মতামত দাও।`,
    a_gha: `(ঘ) সমস্যা সমাধানে ছবির রেজোলিউশন ও ফাইল সাইজ অপ্টিমাইজ বা কম্প্রেস করতে হবে যাতে দ্রুত লোড হয়। এছাড়া সাইটটিকে ডেডিকেটেড হাই-স্পিড সার্ভারে হোস্ট করতে হবে এবং কাঠামোগত পরিবর্তনের মাধ্যমে একটি গ্লোবাল নেভিগেশন বার তৈরি করতে হবে যাতে বারবার হোমপেজে না এসে সরাসরি যেকোনো পেজে গমন করা যায়।`
  },

  // 40. দিনাজপুর বোর্ড-২০১৬
  {
    serialNo: 40,
    boardName: 'Dinajpur Board',
    examYear: '2016',
    stem: `উচ্চ মাধ্যমিকের শিক্ষার্থীদের দুটি গ্রুপে ভাগ করে কলেজের নিজস্ব ওয়েবসাইট তৈরির জন্য বলা হলো। প্রথম গ্রুপ HTML, CSS ইত্যাদি ব্যবহার করে ওয়েবসাইটটি প্রস্তুত করে। বিচারকমণ্ডলী ২য় গ্রুপের ওয়েবসাইটটি কলেজের জন্য পছন্দ করেন। ICT শিক্ষক কলেজের ওয়েবসাইটটির হোম পেজের Ministry of education লেখাটির সাথে www.moedu.gov.bd ওয়েব অ্যাড্রেসটি যুক্ত করেন।`,
    q_ka: `(ক) আইপি অ্যাড্রেস কী?`,
    a_ka: `(ক) ইন্টারনেটে প্রতিটি কম্পিউটারের নিজস্ব অদ্বিতীয় সংখ্যাভিত্তিক পরিচয়কে আইপি অ্যাড্রেস বলে।`,
    q_kha: `(খ) <img> বুঝিয়ে লেখ।`,
    a_kha: `(খ) <img> হলো একটি এম্পটি ট্যাগ যার সাহায্যে ওয়েবপেজে ছবি বা চিত্র প্রদর্শন করা হয়। এর অত্যাবশ্যকীয় অ্যাট্রিবিউট হলো src।`,
    q_ga: `(গ) উদ্দীপকের ICT শিক্ষকের গৃহীত কার্যক্রমের সংশ্লিষ্ট কোড ব্যাখ্যা কর।`,
    a_ga: `(গ) সংশ্লিষ্ট কোড:\n\`\`\`html\n<a href="http://www.moedu.gov.bd">Ministry of education</a>\n\`\`\`\nএখানে <a> ট্যাগ ও href অ্যাট্রিবিউট ব্যবহার করে শিক্ষা মন্ত্রণালয়ের অফিসিয়াল ওয়েবসাইটের সাথে হাইপারলিংক তৈরি করা হয়েছে।`,
    q_gha: `(ঘ) বিচারকেরা কোন যৌক্তিকতায় ২য় গ্রুপের ওয়েবসাইটটি পছন্দ করেন? ব্যাখ্যা কর।`,
    a_gha: `(ঘ) ১ম গ্রুপের ওয়েবসাইটটি ছিল স্ট্যাটিক (শুধু HTML, CSS), যাতে তথ্য সহজে আপডেট করা যায় না। পক্ষান্তরে ২য় গ্রুপের সাইটটি ছিল ডায়নামিক (PHP, MySQL ডেটাবেজযুক্ত), যা ইন্টারেক্টিভ ও আধুনিক এবং সহজেই প্রতিনিয়ত তথ্য আপডেট করা যায়। তাই বিচারকদের পছন্দ সম্পূর্ণ যৌক্তিক।`
  }
];

async function seed() {
  console.log('Connecting to database...');
  await mongoose.connect(DB_URI);
  console.log('Connected to MongoDB!');

  // Check existing CQs for Chapter 4
  const existingCount = await CQ.countDocuments({ chapter: CHAPTER_NAME });
  console.log(`Existing CQs for Chapter 4: ${existingCount}`);

  if (existingCount > 0) {
    console.log('Removing old Chapter 4 CQs to avoid duplicates...');
    await CQ.deleteMany({ chapter: CHAPTER_NAME });
  }

  console.log(`Inserting ${CQS_DATA.length} Creative Questions into Chapter 4 and Board Questions...`);

  const docsToInsert = CQS_DATA.map(item => ({
    categoryTypes: ['Board Question', 'Chapter Practice'],
    categoryType: 'Board Question',
    chapters: [CHAPTER_NAME],
    chapter: CHAPTER_NAME,
    boardNames: [item.boardName],
    boardName: item.boardName,
    examYears: [item.examYear],
    examYear: item.examYear,
    collegeNames: [],
    collegeName: '',
    testPaperName: '',
    modelTestNos: [],
    modelTestNo: '',
    liveExamNo: '',
    serialNo: item.serialNo,
    image: '',
    stem: item.stem,
    q_ka: item.q_ka,
    a_ka: item.a_ka,
    q_kha: item.q_kha,
    a_kha: item.a_kha,
    q_ga: item.q_ga,
    a_ga: item.a_ga,
    q_gha: item.q_gha,
    a_gha: item.a_gha,
    createdAt: new Date()
  }));

  const inserted = await CQ.insertMany(docsToInsert);
  console.log(`Successfully inserted ${inserted.length} CQs into MongoDB!`);

  const totalCQs = await CQ.countDocuments();
  console.log(`Total CQs now in database: ${totalCQs}`);

  const ch4Count = await CQ.countDocuments({ chapter: CHAPTER_NAME });
  console.log(`Chapter 4 CQs count: ${ch4Count}`);

  const boardCount = await CQ.countDocuments({ categoryTypes: 'Board Question' });
  console.log(`Board Question CQs count: ${boardCount}`);

  await mongoose.disconnect();
  console.log('Database disconnected successfully!');
}

seed().catch(err => {
  console.error('Error seeding CQs:', err);
  process.exit(1);
});
