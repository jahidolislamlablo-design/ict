# ICT Easy Learning - Backend API & Admin Portal

Node.js, Express এবং MongoDB (Mongoose) ভিত্তিক ব্যাকএন্ড প্রজেক্ট। এটি [ICT Easy Learning Frontend](https://jahidolislamlablo-design.github.io/ict)-এর সাথে ডাটা আদান-প্রদান করতে এবং অ্যাডমিন প্যানেল থেকে MCQ ও CQ প্রশ্নাবলি সহজে ডাটা এন্ট্রি করতে তৈরি করা হয়েছে।

---

## 📋 প্রজেক্টের বৈশিষ্ট্যসমূহ

1. **অ্যাডমিন ডাটা এন্ট্রি পোর্টাল (`admin.html`)**:
   - `http://localhost:5000/admin.html` অথবা `http://localhost:5000/admin`-এ চলবে।
   - সম্পূর্ণ রেসপনসিভ ও আধুনিক সিঙ্গেল-পেজ ইন্টারফেস (HTML, CSS, JS)।
   - দুটি সমৃদ্ধ ফর্ম: **MCQ এন্ট্রি** এবং **CQ (সৃজনশীল) এন্ট্রি**।
   - রিকোয়েস্ট সফল হলে আকর্ষণীয় ফ্লোটিং টোস্ট নোটিফিকেশন প্রদর্শন ও স্বয়ংক্রিয় ফর্ম রিসেট।
   - "মেটাডেটা ধরে রাখুন" ফিচার যাতে একাধারে একাধিক প্রশ্ন এন্ট্রি করার সময় বারবার অধ্যায়, বোর্ড, বা কলেজের নাম সিলেক্ট করতে না হয়।
   - লাইভ ডাটাবেজ প্রিভিউ ট্যাব যেখান থেকে সরাসরি প্রশ্ন দেখা ও ডিলিট করা যায়।

2. **ফিল্টারিং মেটাডেটা (Metadata Options)**:
   - `categoryType`: 'Board Question' / 'College Test Paper' / 'Model Test' / 'Chapter Practice'
   - `chapter`: যেমন 'Chapter 3: Number System & Logic Gate'
   - `collegeName`: যেমন 'Notre Dame College', 'Dhaka College', 'Viqarunnisa Noon College'
   - `boardName`: যেমন 'Dhaka Board', 'Rajshahi Board', 'All Boards' ইত্যাদি
   - `examYear`: যেমন '2026', '2025', '2024' ইত্যাদি
   - `testPaperName`: যেমন 'Royal Test Paper', 'Lecture', 'Panjeree', 'Made Easy'
   - `modelTestNo`: যেমন 'Model Test 01', 'Model Test 05'

3. **MCQ Model & Endpoints**:
   - ফিল্ডসমূহ: `categoryType`, `chapter`, `collegeName`, `boardName`, `examYear`, `testPaperName`, `modelTestNo`, `question`, `options` (Array বা option1, option2, option3, option4), `correctAnswer`, `explanation`
   - এন্ডপয়েন্ট: `POST /api/mcqs`, `GET /api/mcqs` (ফিল্টারিং সহ)

4. **CQ Model & Endpoints (সৃজনশীল প্রশ্ন)**:
   - ফিল্ডসমূহ: মেটাডেটা ছাড়াও `stem` (উদ্দীপক), `q_ka` & `a_ka` (ক: জ্ঞানমূলক), `q_kha` & `a_kha` (খ: অনুধাবনমূলক), `q_ga` & `a_ga` (গ: প্রয়োগমূলক), `q_gha` & `a_gha` (ঘ: উচ্চতর দক্ষতামূলক)
   - এন্ডপয়েন্ট: `POST /api/cqs`, `GET /api/cqs` (ফিল্টারিং সহ)

5. **MongoDB Connection & CORS**:
   - `mongodb://127.0.0.1:27017/ict_easy_learning`
   - GitHub Pages (`https://jahidolislamlablo-design.github.io`) ও লোকালহোস্ট CORS সমর্থন এবং Private Network Access (PNA) হেডার কনফিগারেশন।

---

## 🚀 কীভাবে সার্ভার রান করবেন?

### ১. সার্ভার চালু করা
```bash
npm run dev
# অথবা:
npm start
```

### ২. অ্যাডমিন পোর্টাল ওপেন করা
ব্রাউজারে গিয়ে ভিজিট করুন:
👉 **[http://localhost:5000/admin.html](http://localhost:5000/admin.html)**
*(অথবা `http://localhost:5000/admin`)*

### ৩. প্রাথমিক ডাটা সিড করা (ঐচ্ছিক)
```bash
npm run seed
```

---

## 📡 API এন্ডপয়েন্ট তালিকা

### ১. সাধারণ এন্ডপয়েন্ট
- `GET /` : সার্ভার স্ট্যাটাস ও এন্ডপয়েন্ট গাইড
- `GET /admin.html` : অ্যাডমিন ডাটা এন্ট্রি পোর্টাল

### ২. MCQ এন্ডপয়েন্ট
| মেথড | এন্ডপয়েন্ট | বিবরণ |
|---|---|---|
| `GET` | `/api/mcqs` | সকল MCQ ফেচ করা (ফিল্টার সমর্থিত) |
| `GET` | `/api/mcqs?chapter=Chapter 3&boardName=Dhaka Board` | নির্দিষ্ট বোর্ড বা চ্যাপ্টার অনুযায়ী ফিল্টার |
| `GET` | `/api/mcqs/chapters` | সকল চ্যাপ্টারের নাম তালিকা |
| `GET` | `/api/mcqs/:id` | নির্দিষ্ট একটি MCQ দেখা |
| `POST` | `/api/mcqs` | নতুন MCQ যোগ করা |
| `DELETE` | `/api/mcqs/:id` | একটি MCQ ডিলিট করা |

### ৩. CQ এন্ডপয়েন্ট (সৃজনশীল প্রশ্ন)
| মেথড | এন্ডপয়েন্ট | বিবরণ |
|---|---|---|
| `GET` | `/api/cqs` | সকল CQ ফেচ করা (ফিল্টার সমর্থিত) |
| `GET` | `/api/cqs?categoryType=Board Question&examYear=2024` | বোর্ড ও সাল অনুযায়ী CQ ফিল্টার |
| `GET` | `/api/cqs/chapters` | সকল CQ চ্যাপ্টারের তালিকা |
| `GET` | `/api/cqs/:id` | নির্দিষ্ট একটি CQ দেখা |
| `POST` | `/api/cqs` | নতুন CQ সেভ করা |
| `DELETE` | `/api/cqs/:id` | একটি CQ ডিলিট করা |
