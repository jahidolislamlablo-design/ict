const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ict_easy_learning';

// MCQ Schema
const McqSchema = new mongoose.Schema({
  categoryType: { type: String, default: 'Chapter Practice' },
  chapter: { type: String, required: true },
  collegeName: String,
  boardName: String,
  examYear: String,
  testPaperName: String,
  modelTestNo: String,
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: String,
  createdAt: { type: Date, default: Date.now }
});
const Mcq = mongoose.model('Mcq', McqSchema);

// CQ Schema
const CqSchema = new mongoose.Schema({
  categoryType: { type: String, default: 'Board Question' },
  chapter: { type: String, required: true },
  collegeName: String,
  boardName: String,
  examYear: String,
  testPaperName: String,
  modelTestNo: String,
  stem: { type: String, required: true },
  q_ka: { type: String, required: true },
  a_ka: String,
  q_kha: { type: String, required: true },
  a_kha: String,
  q_ga: { type: String, required: true },
  a_ga: String,
  q_gha: { type: String, required: true },
  a_gha: String,
  createdAt: { type: Date, default: Date.now }
});
const Cq = mongoose.model('Cq', CqSchema);

// Note Schema
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Lecture Note' },
  category: { type: String, required: true },
  content: { type: String, required: true },
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', NoteSchema);

const sampleMcqs = [
  {
    categoryType: 'Board Question',
    chapter: 'Chapter 3: Number System & Logic Gate',
    boardName: 'Dhaka Board',
    examYear: '2024',
    collegeName: '',
    testPaperName: 'Royal Test Paper',
    modelTestNo: '',
    question: 'বাইনারি সংখ্যা পদ্ধতি (1101)₂ এর দশমিকে মান কত?',
    options: ['11', '12', '13', '15'],
    correctAnswer: '13',
    explanation: '1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13'
  },
  {
    categoryType: 'College Test Paper',
    chapter: 'Chapter 3: Number System & Logic Gate',
    boardName: '',
    examYear: '2025',
    collegeName: 'Notre Dame College',
    testPaperName: 'Lecture Test Paper',
    modelTestNo: 'Model Test 01',
    question: 'কোন লজিক গেইটটি ইনভার্টার (Inverter) হিসেবে কাজ করে?',
    options: ['AND Gate', 'OR Gate', 'NOT Gate', 'NAND Gate'],
    correctAnswer: 'NOT Gate',
    explanation: 'NOT গেইটে একটি ইনপুট থাকে এবং এটি ইনপুটকে উল্টে দেয়।'
  },
  {
    categoryType: 'Board Question',
    chapter: 'Chapter 4: Web Design & HTML',
    boardName: 'Rajshahi Board',
    examYear: '2023',
    collegeName: '',
    testPaperName: 'Panjeree Test Paper',
    modelTestNo: '',
    question: 'HTML-এ হাইপারলিংক তৈরি করার জন্য কোন ট্যাগ ব্যবহার করা হয়?',
    options: ['<link>', '<a>', '<href>', '<hyperlink>'],
    correctAnswer: '<a>',
    explanation: '<a> (Anchor) ট্যাগের সাহায্যে ওয়েবপেজে লিঙ্ক যুক্ত করা হয়।'
  },
  {
    categoryType: 'College Test Paper',
    chapter: 'Chapter 5: Programming Language',
    boardName: '',
    examYear: '2025',
    collegeName: 'Dhaka College',
    testPaperName: 'Made Easy',
    modelTestNo: 'Model Test 02',
    question: 'C ভাষায় হেডার ফাইল যুক্ত করার সঠিক সিনট্যাক্স কোনটি?',
    options: ['#include <stdio.h>', '#import <stdio.h>', 'using namespace std;', 'import stdio.h;'],
    correctAnswer: '#include <stdio.h>',
    explanation: 'C ল্যাঙ্গুয়েজে প্রিপ্রসেসর ডিরেক্টিভ #include দিয়ে হেডার ফাইল যুক্ত করা হয়।'
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
    stem: 'আইসিটি ক্লাসে শিক্ষক অয়ন ও সুমনা দুজন শিক্ষার্থীকে দুটি সংখ্যা লিখতে বললেন। অয়ন লিখল (37)₈ এবং সুমনা লিখল (2B)₁₆। এরপর শিক্ষক বললেন, "তোমরা সংখ্যা দুটিকে ২-এর পরিপূরক পদ্ধতিতে যোগ করে দেখাও।"',
    q_ka: 'বাইনারি সংখ্যা পদ্ধতি কাকে বলে?',
    a_ka: 'যে সংখ্যা পদ্ধতিতে হিসাব-নিকাশের জন্য কেবল দুটি অংক বা প্রতীক (০ এবং ১) ব্যবহৃত হয়, তাকে বাইনারি সংখ্যা পদ্ধতি বলে।',
    q_kha: '১ + ১ = ১ এবং ১ + ১ = ১০ ব্যাখ্যা করো।',
    a_kha: 'প্রথমটি বুলিয়ান অ্যালজেবরার যৌক্তিক যোগ (Logical OR operation), যেখানে দুটি চলকের মান সত্য (১) হলে তাদের ফলাফলও সত্য (১) হয়। দ্বিতীয়টি সাধারণ বাইনারি যোগ, যেখানে ১ ও ১ যোগ করলে যোগফল ০ এবং ক্যারি ১ থাকে, অর্থাৎ (১০)₂ হয়।',
    q_ga: 'অয়ন ও সুমনার সংখ্যার মধ্যে দশমিক মানের পার্থক্য নির্ণয় করো।',
    a_ga: 'অয়নের সংখ্যা (37)₈ = 3×8¹ + 7×8⁰ = 24 + 7 = 31। সুমনার সংখ্যা (2B)₁₆ = 2×16¹ + 11×16⁰ = 32 + 11 = 43। সুতরাং দশমিকের পার্থক্য = 43 - 31 = 12।',
    q_gha: '২-এর পরিপূরক পদ্ধতি ব্যবহার করে সুমনার সংখ্যা হতে অয়নের সংখ্যা বিয়োগ সম্ভব কি না—গাণিতিকভাবে বিশ্লেষণ করো।',
    a_gha: 'হ্যাঁ, ২-এর পরিপূরক পদ্ধতিতে যোগের মাধ্যমেই বিয়োগ করা যায়। অয়নের মান ৩১ এর ৮-বিট ২-এর পরিপূরক মান নিয়ে সুমনার মান ৪৩ এর সাথে যোগ করলে ফলাফল (+১২) পাওয়া যায়।'
  },
  {
    categoryType: 'College Test Paper',
    chapter: 'Chapter 5: Programming Language',
    boardName: '',
    examYear: '2025',
    collegeName: 'Notre Dame College',
    testPaperName: 'Made Easy',
    modelTestNo: 'Model Test 01',
    stem: 'একটি টেস্ট প্রোগ্রামে ১ থেকে ১০০ পর্যন্ত বিজোড় সংখ্যাগুলোর যোগফল নির্ণয়ের জন্য একটি অ্যালগরিদম ও সি প্রোগ্রাম তৈরি করা হলো।',
    q_ka: 'কী-ওয়ার্ড (Keyword) কী?',
    a_ka: 'প্রোগ্রামিং ভাষায় পূর্বে থেকে সংরক্ষিত ও নির্দিষ্ট অর্থপূর্ণ শব্দসমূহকে কী-ওয়ার্ড বলা হয় (যেমন: int, float, if, for)।',
    q_kha: 'কম্পাইলার ও ইন্টারপ্রেটারের মধ্যে দুটি পার্থক্য লেখো।',
    a_kha: '১. কম্পাইলার সম্পূর্ণ সোর্স কোডকে একসাথে অনুবাদ করে, পক্ষান্তরে ইন্টারপ্রেটার লাইন বাই লাইন অনুবাদ করে। ২. কম্পাইলারে প্রোগ্রাম সম্পাদনে সময় কম লাগে, ইন্টারপ্রেটারে তুলনামূলক বেশি সময় লাগে।',
    q_ga: 'উদ্দীপকের সমস্যাটির জন্য একটি ফ্লোচার্ট অঙ্কন করো।',
    a_ga: 'স্টার্ট -> সাম = ০, আই = ১ -> কন্ডিশন আই <= ১০০ -> সাম = সাম + আই -> আই = আই + ২ -> প্রিন্ট সাম -> স্টপ।',
    q_gha: 'উদ্দীপকের সমস্যাটি for লুপ ও while লুপ উভয়ের মাধ্যমেই সমাধান সম্ভব—সি কোড লিখে বিশ্লেষণ করো।',
    a_gha: 'for(int i=1; i<=100; i+=2) sum+=i; এবং i=1; while(i<=100){ sum+=i; i+=2; } উভয় কাঠামোতেই শর্ত ও বৃদ্ধির বিন্যাস অনুযায়ী সমমানের আউটপুট পাওয়া যায়।'
  }
];

const sampleNotes = [
  {
    title: 'HSC ICT ২০২৪ ঢাকা বোর্ড - ৩য় অধ্যায় সৃজনশীল সমাধান',
    type: 'Board Question',
    category: 'বোর্ড কোশ্চেন',
    content: 'ঢাকা বোর্ড ২০২৪ এর সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস অংশের সম্পূর্ণ গ ও ঘ নং প্রশ্নের সমাধান।',
    pdfUrl: 'https://example.com/hsc-ict-dhaka-2024.pdf'
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully!');

    // পুরাতন ডাটা মুছে ফেলা
    await Mcq.deleteMany({});
    await Cq.deleteMany({});
    await Note.deleteMany({});
    console.log('🧹 Existing sample data cleared.');

    // নতুন স্যাম্পল ডাটা ইনসার্ট
    await Mcq.insertMany(sampleMcqs);
    console.log(`✅ ${sampleMcqs.length} MCQs successfully inserted!`);

    await Cq.insertMany(sampleCqs);
    console.log(`✅ ${sampleCqs.length} CQs successfully inserted!`);

    await Note.insertMany(sampleNotes);
    console.log(`✅ ${sampleNotes.length} Notes successfully inserted!`);

    console.log('\n🎉 Congratulations! Database "ict_easy_learning" is 100% READY with MCQs, CQs & Notes!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
