const fs = require('fs');
const path = require('path');

const mcqsPath = path.join(__dirname, '..', 'database', 'mcqs.json');
const cqsPath = path.join(__dirname, '..', 'database', 'cqs.json');

const mcqs = JSON.parse(fs.readFileSync(mcqsPath, 'utf8'));
const cqs = JSON.parse(fs.readFileSync(cqsPath, 'utf8'));

console.log('Original MCQs:', mcqs.length);
console.log('Original CQs:', cqs.length);

// 1. New MCQs for Chapter 3.1 (Number Systems), Chapter 3.2 (Digital Logic), Chapter 5 (C Programming), Chapter 6 (DBMS), and Model Tests
const newMcqs = [
    // Chapter 3.1: Number Systems
    {
        question: "বাইনারি সংখ্যা পদ্ধতি (1101)₂ এর দশমিকে মান কত?",
        options: ["11", "12", "13", "15"],
        correctAnswer: "13",
        explanation: "1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test", "College Test Paper"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        collegeName: "নটর ডেম কলেজ, ঢাকা",
        modelTestNo: "Model Test 01"
    },
    {
        question: "অক্টাল সংখ্যা পদ্ধতির ভিত্তি (Base) কত?",
        options: ["২", "৮", "১০", "১৬"],
        correctAnswer: "৮",
        explanation: "অক্টাল সংখ্যা পদ্ধতিতে ০ থেকে ৭ পর্যন্ত মোট ৮টি মৌলিক চিহ্ন ব্যবহৃত হয়, তাই এর ভিত্তি ৮।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "রাজশাহী বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "হেক্সাডেসিমেল পদ্ধতিতে 'F' এর পরবর্তী সংখ্যাটি কত?",
        options: ["10", "16", "E", "G"],
        correctAnswer: "10",
        explanation: "হেক্সাডেসিমেল পদ্ধতিতে F (১৫) এর পরবর্তী সংখ্যাটি হলো (10)₁₆, যা দশমিকে ১৬।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper"],
        boardName: "চট্টগ্রাম বোর্ড",
        examYear: "2024",
        collegeName: "ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ"
    },
    {
        question: "(1011.11)₂ সংখ্যাটির সমতুল্য ডেসিমেল মান কত?",
        options: ["11.75", "11.5", "10.75", "12.25"],
        correctAnswer: "11.75",
        explanation: "পূর্ণাংশ 1011 = 8+2+1 = 11 এবং ভগ্নাংশ .11 = 1/2 + 1/4 = 0.5 + 0.25 = 0.75। সুতরাং 11.75।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "যশোর বোর্ড",
        examYear: "2023",
        modelTestNo: "Model Test 01"
    },
    {
        question: "কম্পিউটারে ঋণাত্মক সংখ্যা উপস্থাপনের সবচেয়ে আধুনিক ও জনপ্রিয় পদ্ধতি কোনটি?",
        options: ["প্রকৃত মান গঠন", "১ এর পরিপূরক", "২ এর পরিপূরক", "বিসিডি কোড"],
        correctAnswer: "২ এর পরিপূরক",
        explanation: "২ এর পরিপূরক পদ্ধতিতে যোগের মাধ্যমে বিয়োগ সম্পন্ন করা যায় এবং এতে সার্কিট সরল হয়।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "দিনাজপুর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "Unicode কত বিটের কোড?",
        options: ["৭ বিট", "৮ বিট", "১৬ বিট", "৩২ বিট"],
        correctAnswer: "১৬ বিট",
        explanation: "ইউনিকোড মূলত ১৬ বিটের কোড (পরবর্তীতে সম্প্রসারিত), যাতে ২¹⁶ = ৬৫,৫৩৬টি অনন্য চিহ্ন কোডিং করা যায়।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper"],
        boardName: "কুমিল্লা বোর্ড",
        examYear: "2024",
        collegeName: "রাজউক উত্তরা মডেল কলেজ"
    },
    {
        question: "(77)₈ এর পরের সংখ্যাটি কত?",
        options: ["(78)₈", "(100)₈", "(80)₈", "(70)₈"],
        correctAnswer: "(100)₈",
        explanation: "অক্টালে ৭ এর সাথে ১ যোগ করলে ১০ হয় (ক্যারি ১)। তাই ৭৭ এর সাথে ১ যোগ করলে (১০০)₈ হয়।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "বরিশাল বোর্ড",
        examYear: "2023",
        modelTestNo: "Model Test 02"
    },
    {
        question: "BCD কোড পূর্ণরূপ কী?",
        options: ["Binary Coded Decimal", "Bit Coded Digit", "Binary Calculated Decimal", "Basic Coded Digital"],
        correctAnswer: "Binary Coded Decimal",
        explanation: "BCD এর পূর্ণরূপ হলো Binary Coded Decimal, যাতে প্রতি দশমিক অঙ্ককে ৪-বিট বাইনারিতে প্রকাশ করা হয়।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question"],
        boardName: "সিলেট বোর্ড",
        examYear: "2024"
    },
    {
        question: "(1010)₂ এবং (1100)₂ এর যোগফল কত?",
        options: ["(10110)₂", "(11010)₂", "(10010)₂", "(11110)₂"],
        correctAnswer: "(10110)₂",
        explanation: "1010 (দশমিকে 10) + 1100 (দশমিকে 12) = 22, যা বাইনারিতে (10110)₂।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ময়মনসিংহ বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "ASCII-7 কোড দিয়ে কতটি অদ্বিতীয় চিহ্ন নির্দেশ করা যায়?",
        options: ["১২৮টি", "২৫৬টি", "৬৪টি", "৫১২টি"],
        correctAnswer: "১২৮টি",
        explanation: "ASCII-7 এ ৭টি বিট থাকে, তাই ২⁷ = ১২৮টি ভিন্ন চিহ্ন প্রকাশ করা সম্ভব।",
        chapter: "Chapter 3 (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)",
        categoryTypes: ["Chapter Practice", "Board Question"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2023"
    },

    // Chapter 3.2: Digital Devices & Logic Gates
    {
        question: "নিচের কোন দুটি গেটকে সার্বজনীন গেট (Universal Gate) বলা হয়?",
        options: ["AND ও OR", "NAND ও NOR", "XOR ও XNOR", "NOT ও AND"],
        correctAnswer: "NAND ও NOR",
        explanation: "NAND ও NOR গেট দিয়ে মৌলিক গেটসহ যেকোনো লজিক সার্কিট তৈরি করা যায় বলে এদের সার্বজনীন গেট বলে।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "একটি ফুল অ্যাডারে (Full Adder) কয়টি ইনপুট ও কয়টি আউটপুট থাকে?",
        options: ["২টি ইনপুট, ১টি আউটপুট", "৩টি ইনপুট, ২টি আউটপুট", "৩টি ইনপুট, ৩টি আউটপুট", "২টি ইনপুট, ২টি আউটপুট"],
        correctAnswer: "৩টি ইনপুট, ২টি আউটপুট",
        explanation: "ফুল অ্যাডারে ৩টি ইনপুট (A, B এবং Cin) এবং ২টি আউটপুট (Sum ও Carry) থাকে।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "রাজশাহী বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "বুলিয়ান স্বতঃসিদ্ধ অনুযায়ী A + 1 এর মান কত?",
        options: ["A", "0", "1", "A'"],
        correctAnswer: "1",
        explanation: "OR অপারেশনে যেকোনো একটি ইনপুট ১ হলে আউটপুট সর্বদাই ১ হয় (A + 1 = 1)।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper"],
        boardName: "চট্টগ্রাম বোর্ড",
        examYear: "2024",
        collegeName: "ঢাকা কলেজ, ঢাকা"
    },
    {
        question: "ডিকোডারের (Decoder) ইনপুট সংখ্যা n হলে আউটপুট সংখ্যা কতটি হবে?",
        options: ["n²", "2ⁿ", "2n", "n/2"],
        correctAnswer: "2ⁿ",
        explanation: "ডিকোডারে n সংখ্যক ইনপুটের জন্য সর্বোচ্চ ২ⁿ সংখ্যক আউটপুট লাইন পাওয়া যায়।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "যশোর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "কোন লজিক গেটের বিজোড় সংখ্যক ১ ইনপুটের জন্য আউটপুট ১ হয়?",
        options: ["AND গেট", "OR গেট", "XOR গেট", "NOR গেট"],
        correctAnswer: "XOR গেট",
        explanation: "XOR (Exclusive-OR) গেটে ইনপুটে বিজোড় সংখ্যক ১ থাকলে আউটপুট ১ (High) হয়।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "দিনাজপুর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "ডি-মরগ্যানের ১ম উপপাদ্যটি কোনটি?",
        options: ["(A + B)' = A' . B'", "(A . B)' = A' + B'", "A + A' = 1", "A . A' = 0"],
        correctAnswer: "(A + B)' = A' . B'",
        explanation: "ডি-মরগ্যানের ১ম সূত্র: সমষ্টির পূরক তাদের পৃথক পূরকের গুণফলের সমান [(A + B)' = A' . B']।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question"],
        boardName: "কুমিল্লা বোর্ড",
        examYear: "2023"
    },
    {
        question: "এনকোডারের (Encoder) কাজ কী?",
        options: ["যান্ত্রিক ভাষাকে মানুষের ভাষায় রূপান্তর", "মানুষের ভাষাকে কম্পিউটারের যান্ত্রিক ভাষায় রূপান্তর", "ডাটা সংরক্ষণ করা", "এসিকে ডিসি করা"],
        correctAnswer: "মানুষের ভাষাকে কম্পিউটারের যান্ত্রিক ভাষায় রূপান্তর",
        explanation: "এনকোডার আলফানিউমেরিক বা মানুষের বোধগম্য সংকেতকে বাইনারি বা কম্পিউটারের ভাষায় রূপান্তর করে।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "সিলেট বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 02"
    },
    {
        question: "নিচের কোন মেমোরিটি রিফ্রেশ করার প্রয়োজন হয়?",
        options: ["SRAM", "DRAM", "ROM", "Flash"],
        correctAnswer: "DRAM",
        explanation: "DRAM (Dynamic RAM) ক্যাপাসিটর দিয়ে গঠিত হওয়ায় চার্জ ধরে রাখতে প্রতি সেকেন্ডে বহুবার রিফ্রেশ করতে হয়।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question"],
        boardName: "বরিশাল বোর্ড",
        examYear: "2024"
    },
    {
        question: "৮টি ইনপুট লাইনের একটি এনকোডারে আউটপুট লাইনের সংখ্যা কয়টি হবে?",
        options: ["২টি", "৩টি", "৪টি", "৮টি"],
        correctAnswer: "৩টি",
        explanation: "যেহেতু ২³ = ৮, তাই ৮টি ইনপুটের জন্য আউটপুট হবে ৩টি (n=3)।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "লজিক ফাংশন F = A + A'B এর সরলীকৃত রূপ কোনটি?",
        options: ["A + B", "A . B", "A'", "B'"],
        correctAnswer: "A + B",
        explanation: "A + A'B = (A + A')(A + B) = 1 . (A + B) = A + B।",
        chapter: "Chapter 3 (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "রাজশাহী বোর্ড",
        examYear: "2023",
        modelTestNo: "Model Test 02"
    },

    // Chapter 5: C Programming
    {
        question: "সি (C) ভাষায় প্রোগ্রামের এক্সিকিউশন কোন ফাংশন থেকে শুরু হয়?",
        options: ["start()", "main()", "void()", "printf()"],
        correctAnswer: "main()",
        explanation: "প্রতিটি সি প্রোগ্রামের এক্সিকিউশন প্রধান ফাংশন main() থেকেই সর্বদা শুরু হয়।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test", "College Test Paper"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        collegeName: "নটর ডেম কলেজ, ঢাকা",
        modelTestNo: "Model Test 01"
    },
    {
        question: "সি ভাষায় ফ্লোটিং পয়েন্ট বা দশমিক সংখ্যার ফরম্যাট স্পেসিফায়ার কোনটি?",
        options: ["%d", "%c", "%f", "%lf"],
        correctAnswer: "%f",
        explanation: "float ডাটা টাইপের মান ইনপুট/আউটপুটের জন্য '%f' স্পেসিফায়ার ব্যবহৃত হয়।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "রাজশাহী বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "সি ভাষায় নিচের কোনটি সঠিক চলক (Variable) নাম?",
        options: ["1sum", "sum_1", "float", "my sum"],
        correctAnswer: "sum_1",
        explanation: "চলকের নাম সংখ্যা দিয়ে শুরু হওয়া বা কী-ওয়ার্ড বা ফাঁকা স্থান (space) রাখা অবৈধ। 'sum_1' একটি বৈধ চলক নাম।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper"],
        boardName: "চট্টগ্রাম বোর্ড",
        examYear: "2024",
        collegeName: "ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ"
    },
    {
        question: "সি ভাষায় লজিক্যাল AND অপারেটরের প্রতীক কোনটি?",
        options: ["&", "&&", "|", "||"],
        correctAnswer: "&&",
        explanation: "সি ভাষায় '&&' হলো যৌক্তিক AND (Logical AND) অপারেটর।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "যশোর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "for(i = 1; i <= 5; i++) লুপটি মোট কতবার আবর্তিত হবে?",
        options: ["৪ বার", "৫ বার", "৬ বার", "অসীম বার"],
        correctAnswer: "৫ বার",
        explanation: "i এর মান ১, ২, ৩, ৪, ৫ পর্যন্ত শর্ত পূরণ করে মোট ৫ বার চলবে।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "দিনাজপুর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "সি ভাষায় হেডার ফাইল ইনক্লুড করার সঠিক প্রিপ্রসেসর ডিরেক্টিভ কোনটি?",
        options: ["#include", "#define", "#import", "#pragma"],
        correctAnswer: "#include",
        explanation: "#include ডিরেক্টিভ দিয়ে হেডার ফাইল (যেমন <stdio.h>) প্রোগ্রামে অন্তর্ভুক্ত করা হয়।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question"],
        boardName: "কুমিল্লা বোর্ড",
        examYear: "2023"
    },
    {
        question: "অ্যালগরিদমের চিত্ররূপকে কী বলা হয়?",
        options: ["সুডোকোড", "ফ্লোচার্ট (Flowchart)", "প্রোগ্রাম", "সোর্স কোড"],
        correctAnswer: "ফ্লোচার্ট (Flowchart)",
        explanation: "কোনো সমস্যা সমাধানের পর্যায়ক্রমিক চিত্রভিত্তিক উপস্থাপনাকে ফ্লোচার্ট বা প্রবাহচিত্র বলা হয়।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "সিলেট বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 02"
    },
    {
        question: "ফ্লোচার্টে সিদ্ধান্ত (Decision) গ্রহণের জন্য কোন প্রতীক ব্যবহৃত হয়?",
        options: ["ডিম্বাকৃতি", "আয়তাকার", "হীরকাকৃতি (রম্বস)", "সামান্তরিক"],
        correctAnswer: "হীরকাকৃতি (রম্বস)",
        explanation: "রম্বস বা হীরকাকৃতি প্রতীক দিয়ে শর্ত বা সিদ্ধান্ত (Yes/No) যাচাই করা হয়।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "বরিশাল বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "সি ভাষায় a = 5; b = ++a; হলে b এর মান কত?",
        options: ["5", "6", "4", "7"],
        correctAnswer: "6",
        explanation: "প্রি-ইনক্রিমেন্ট (++a) এর ফলে a এর মান আগে ১ বৃদ্ধি পেয়ে ৬ হবে এবং তা b তে নির্ধারিত হবে।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ময়মনসিংহ বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 02"
    },
    {
        question: "একটি কম্পাইলার সম্পূর্ণ প্রোগ্রামকে কীভাবে অনুবাদ করে?",
        options: ["এক লাইন এক লাইন করে", "একত্রে সম্পূর্ণ প্রোগ্রামটি", "শুধুমাত্র কমেন্টগুলো", "ফাংশন ছাড়া"],
        correctAnswer: "একত্রে সম্পূর্ণ প্রোগ্রামটি",
        explanation: "কম্পাইলার সম্পূর্ণ সোর্স কোডকে একসাথে অবজেক্ট কোডে রূপান্তর করে, পক্ষান্তরে ইন্টারপ্রেটার লাইন বাই লাইন অনুবাদ করে।",
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },

    // Chapter 6: DBMS
    {
        question: "রিলেশনাল ডাটাবেজ মডেলে সারিকে (Row) কী বলা হয়?",
        options: ["ফিল্ড", "রেকর্ড বা টাপল (Tuple)", "অ্যাট্রিবিউট", "ডোমেন"],
        correctAnswer: "রেকর্ড বা টাপল (Tuple)",
        explanation: "রিলেশনাল ডাটাবেজের প্রতিটি সারিকে রেকর্ড (Record) বা টাপল (Tuple) বলা হয়।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test", "College Test Paper"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        collegeName: "রাজউক উত্তরা মডেল কলেজ",
        modelTestNo: "Model Test 01"
    },
    {
        question: "ডাটাবেজ টেবিলের প্রতিটি কলাম বা বৈশিষ্ট্যকে কী বলে?",
        options: ["টাপল", "ফিল্ড (Field)", "এনটিটি", "রিলেশন"],
        correctAnswer: "ফিল্ড (Field)",
        explanation: "ডাটাবেজের প্রতিটি কলাম বা উপাত্তের উপাদানকে ফিল্ড বা অ্যাট্রিবিউট বলা হয়।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "রাজশাহী বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "যে ফিল্ড দিয়ে প্রতিটি রেকর্ডকে একক ও অনন্যভাবে শনাক্ত করা যায় তাকে কী বলে?",
        options: ["ফরেন কী", "কম্পোজিট কী", "প্রাইমারি কী (Primary Key)", "সেকেন্ডারি কী"],
        correctAnswer: "প্রাইমারি কী (Primary Key)",
        explanation: "প্রাইমারি কী হলো টেবিলের এমন ফিল্ড যার মান ইউনিক এবং কখনো ফাঁকা (Null) হতে পারে না।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "চট্টগ্রাম বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "SQL এর পূর্ণরূপ কী?",
        options: ["Structured Query Language", "Standard Quality Language", "Sequential Query List", "Simple Query Language"],
        correctAnswer: "Structured Query Language",
        explanation: "SQL এর পূর্ণরূপ Structured Query Language, যা ডাটাবেজ কুয়েরি ও পরিচালনার জন্য আন্তর্জাতিক মানদণ্ড।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "যশোর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "দুটি টেবিলের মধ্যে সম্পর্ক তৈরির জন্য একটি টেবিলের প্রাইমারি কী অপর টেবিলে থাকলে তাকে কী বলে?",
        options: ["সুপার কী", "ক্যান্ডিডেট কী", "ফরেন কী (Foreign Key)", "অল্টারনেট কী"],
        correctAnswer: "ফরেন কী (Foreign Key)",
        explanation: "একটি রিলেশনের প্রাইমারি কী যদি অন্য টেবিলে ব্যবহৃত হয়, তখন দ্বিতীয় টেবিলে তাকে ফরেন কী বলা হয়।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "দিনাজপুর বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "SQL এ ডাটাবেজ টেবিল থেকে নির্দিষ্ট ডাটা খোঁজার কমান্ড কোনটি?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correctAnswer: "SELECT",
        explanation: "ডাটাবেজ টেবিল থেকে নির্দিষ্ট শর্তে তথ্য প্রদর্শন বা অনুসন্ধানের জন্য 'SELECT' স্টেটমেন্ট ব্যবহৃত হয়।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question"],
        boardName: "কুমিল্লা বোর্ড",
        examYear: "2023"
    },
    {
        question: "নিচের কোন ডাটা টাইপে ছবি, অডিও বা ভিডিও ফাইল সংরক্ষণ করা হয়?",
        options: ["OLE Object", "Memo", "Hyperlink", "Text"],
        correctAnswer: "OLE Object",
        explanation: "OLE Object (Object Linking and Embedding) ফিল্ডে যেকোনো বাইনারি অবজেক্ট যেমন ছবি, সাউন্ড সংরক্ষণ করা যায়।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "সিলেট বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 02"
    },
    {
        question: "ডাটাবেজ ইনডেক্সিং (Indexing) করার প্রধান সুবিধা কী?",
        options: ["ডাটা দ্রুত মুছে ফেলা", "ডাটা দ্রুত ও সহজে অনুসন্ধান করা", "মেমোরি বাঁচানো", "নেটওয়ার্ক স্পিড বাড়ানো"],
        correctAnswer: "ডাটা দ্রুত ও সহজে অনুসন্ধান করা",
        explanation: "ইনডেক্সিং করার ফলে সূচির মাধ্যমে রেকর্ড দ্রুত খুঁজে পাওয়া যায় এবং সার্চ পারফরম্যান্স বাড়ে।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "বরিশাল বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    },
    {
        question: "ডাটা সিকিউরিটির জন্য অননুমোদিত ব্যক্তি থেকে তথ্য নিরাপদ রাখতে কী করা হয়?",
        options: ["ডাটা সর্টিং", "ডাটা এনক্রিপশন (Data Encryption)", "ইনডেক্সিং", "ডাটা কপি"],
        correctAnswer: "ডাটা এনক্রিপশন (Data Encryption)",
        explanation: "ডাটা এনক্রিপশনের মাধ্যমে সাধারণ টেক্সটকে দুর্বোধ্য সাইফার টেক্সটে পরিণত করা হয় যাতে গোপনীয়তা বজায় থাকে।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 02"
    },
    {
        question: "একজন শিক্ষক একাধিক শিক্ষার্থীকে পড়াতে পারেন - এটি কোন ধরণের রিলেশন?",
        options: ["One to One (1:1)", "One to Many (1:M)", "Many to One (M:1)", "Many to Many (M:N)"],
        correctAnswer: "One to Many (1:M)",
        explanation: "একজন শিক্ষকের বিপরীতে একাধিক ছাত্র থাকায় এটি ওয়ান-টু-মেনি (1:M) সম্পর্ক নির্দেশ করে।",
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        categoryTypes: ["Chapter Practice", "Board Question", "Model Test"],
        boardName: "ময়মনসিংহ বোর্ড",
        examYear: "2024",
        modelTestNo: "Model Test 01"
    }
];

// Append new MCQs with IDs
let maxMcqId = 10000;
newMcqs.forEach((q, idx) => {
    q._id = 'gen_mcq_' + (maxMcqId + idx);
    q.serialNo = maxMcqId + idx;
    q.createdAt = new Date().toISOString();
    q.__v = 0;
    mcqs.push(q);
});

console.log('Total MCQs after addition:', mcqs.length);
fs.writeFileSync(mcqsPath, JSON.stringify(mcqs, null, 2), 'utf8');

// 2. New CQs for Chapter 4 (Web Design & HTML), Chapter 5 (C Programming), Chapter 6 (DBMS)
const newCqs = [
    // Chapter 4: Web Design & HTML
    {
        chapter: "Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML",
        stem: "তানভীর তার স্কুলের একটি ওয়েবসাইট তৈরি করার উদ্যোগ নিল। সে পেজের কাঠামো নির্ধারণ করতে একটি মূল পেজ ও অন্যান্য শাখা পেজ তৈরি করল। পেজটিতে একটি তথ্যবহুল টেবিল, বিদ্যালয়ের ছবি ও ভর্তির ফর্মের হাইপারলিংক যুক্ত করল।",
        q_ka: "HTML এর পূর্ণরূপ কী?",
        a_ka: "HTML এর পূর্ণরূপ হলো HyperText Markup Language।",
        q_kha: "ওয়েবপেজে হাইপারলিংক কেন অত্যন্ত গুরুত্বপূর্ণ? ব্যাখ্যা কর।",
        a_kha: "হাইপারলিংক এর মাধ্যমে একটি ওয়েবপেজের সাথে অন্য ওয়েবপেজ বা ওয়েবসাইটের সংযোগ স্থাপন করা হয়। <a> ট্যাগের সাহায্যে টেক্সট বা ছবির উপর ক্লিকযোগ্য লিঙ্ক তৈরি করে ব্যবহারকারীরা সহজে এক তথ্য থেকে অন্য তথ্যে পরিভ্রমণ করতে পারে।",
        q_ga: "উদ্দীপকে তানভীরের সাইটটিতে ৩টি সারি ও ৩টি কলাম বিশিষ্ট একটি টেবিল তৈরির জন্য প্রয়োজনীয় HTML কোড লিখ।",
        a_ga: "<table border=\"1\">\n  <tr><th>রোল</th><th>নাম</th><th>বিভাগ</th></tr>\n  <tr><td>১০১</td><td>সাকিব</td><td>বিজ্ঞান</td></tr>\n  <tr><td>১০২</td><td>তানভীর</td><td>বিজ্ঞান</td></tr>\n</table>",
        q_gha: "তানভীরের ব্যবহৃত ওয়েবসাইটের কাঠামো বিশ্লেষণ করে শিক্ষার্থীদের সুবিধার প্রেক্ষাপটে এর কার্যকারিতা মূল্যায়ন কর।",
        a_gha: "উদ্দীপকে তানভীর একটি হায়ারার্কিক্যাল বা ট্রি কাঠামো ব্যবহার করেছে, যেখানে মূল হোমপেজ থেকে শাখা পেজে যাওয়া যায়। সাধারণ শিক্ষা প্রতিষ্ঠানের জন্য এটি সর্বাধিক জনপ্রিয় কাঠামো কারণ ব্যবহারকারীরা সহজে মেনু ও শাখা থেকে নির্দিষ্ট ক্লাসের তথ্য খুঁজে পায়।",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        collegeName: "নটর ডেম কলেজ, ঢাকা",
        modelTestNo: "Model Test 01"
    },
    {
        chapter: "Chapter 4: ওয়েব ডিজাইন পরিচিতি এবং HTML",
        stem: "রহিম একটি ই-কমার্স ওয়েবসাইটের প্রোডাক্ট পেজ তৈরি করছে। সেখানে পণ্যের ছবি, পণ্যের তালিকা (অর্ডারড ও আন-অর্ডারড লিস্ট) এবং গ্রাহক ফিডব্যাক দেওয়ার ব্যবস্থা রয়েছে।",
        q_ka: "ট্যাগ (Tag) কী?",
        a_ka: "HTML ট্যাগ হলো কি-ওয়ার্ড যা < > চিহ্নের মাঝে আবদ্ধ থাকে এবং ব্রাউজারকে নির্দেশ দেয় কনটেন্ট কীভাবে প্রদর্শিত হবে।",
        q_kha: "ওয়েব ব্রাউজার ও সার্চ ইঞ্জিনের মধ্যে পার্থক্য লিখ।",
        a_kha: "ওয়েব ব্রাউজার হলো ক্লায়েন্ট অ্যাপ্লিকেশন সফটওয়্যার (যেমন Chrome) যার সাহায্যে ওয়েবপেজ দেখা যায়। পক্ষান্তরে সার্চ ইঞ্জিন হলো একটি ওয়েবভিত্তিক টুল (যেমন Google) যা ইন্টারনেটে তথ্য অনুসন্ধানে ব্যবহৃত হয়।",
        q_ga: "উদ্দীপকের তথ্য অনুযায়ী রহিম কীভাবে ক্রমানুযায়ী ৩টি পণ্যের তালিকা ও একটি পণ্যের ছবি যুক্ত করবে তা HTML কোডে দেখাও।",
        a_ga: "<img src=\"product.jpg\" alt=\"পণ্যের ছবি\" width=\"200\">\n<ol>\n  <li>স্মার্টফোন</li>\n  <li>ল্যাপটপ</li>\n  <li>হেডফোন</li>\n</ol>",
        q_gha: "ওয়েবপেজে স্ট্যাটিক ওয়েবসাইটের তুলনায় ডাইনামিক ওয়েবসাইটের সুবিধা বিশ্লেষণ কর।",
        a_gha: "ডাইনামিক ওয়েবসাইটে ব্যবহারকারীর চাহিদা অনুযায়ী ডাটাবেজ থেকে স্বয়ংক্রিয় তথ্য পরিবর্তন হয় এবং গ্রাহকের ইনপুট সংরক্ষণ করা যায়। ই-কমার্স সাইটে পণ্য কেনাবেচা ও রিয়েলটাইম আপডেটের জন্য ডাইনামিক সাইট অপরিহার্য।",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper"],
        boardName: "রাজশাহী বোর্ড",
        examYear: "2024",
        collegeName: "ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ"
    },

    // Chapter 5: C Programming
    {
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        stem: "শিক্ষক ক্লাসে ছাত্রদের তিনটি ধনাত্মক সংখ্যার মধ্যে বৃহত্তম সংখ্যা নির্ণয়ের সমস্যা দিলেন। তিনি তাদের বললেন প্রথমে বিষয়টির ফ্লোচার্ট আঁকতে এবং পরবর্তীতে সি প্রোগ্রামে তা রূপান্তর করতে।",
        q_ka: "কী-ওয়ার্ড (Keyword) কী?",
        a_ka: "সি ভাষায় পূর্বনির্ধারিত ও সংরক্ষিত শব্দসমূহকে কী-ওয়ার্ড বলে (যেমন: int, float, if, else, return)।",
        q_kha: "কম্পাইলার ও ইন্টারপ্রেটারের মধ্যে প্রধান পার্থক্য বুঝিয়ে বল।",
        a_kha: "কম্পাইলার সম্পূর্ণ সোর্স প্রোগ্রামকে একসাথে পড়ে অবজেক্ট কোডে অনুবাদ করে এবং সব ভুল একত্রে প্রদর্শন করে। পক্ষান্তরে ইন্টারপ্রেটার লাইন বাই লাইন অনুবাদ করে এবং ভুল পাওয়া মাত্র কাজ বন্ধ করে দেয়।",
        q_ga: "উদ্দীপকের তিনটি সংখ্যার মধ্যে বড় সংখ্যাটি নির্ণয়ের অ্যালগরিদম ও ফ্লোচার্ট সংক্ষেপে লিখ।",
        a_ga: "অ্যালগরিদম:\n১. শুরু করি।\n২. তিনটি সংখ্যা a, b, c ইনপুট নিই।\n৩. যদি a > b এবং a > c হয়, তবে বৃহত্তম = a।\n৪. অন্যথায় যদি b > c হয়, তবে বৃহত্তম = b।\n৫. অন্যথায় বৃহত্তম = c।\n৬. ফলাফল প্রদর্শন করে শেষ করি।",
        q_gha: "উদ্দীপকের সমস্যার সমাধানের জন্য একটি পূর্ণাঙ্গ আদর্শ সি প্রোগ্রাম (C Program) লিখ।",
        a_gha: "#include <stdio.h>\nint main() {\n    int a, b, c;\n    printf(\"তিনটি সংখ্যা লিখুন: \");\n    scanf(\"%d %d %d\", &a, &b, &c);\n    if (a >= b && a >= c)\n        printf(\"বৃহত্তম সংখ্যা: %d\\n\", a);\n    else if (b >= a && b >= c)\n        printf(\"বৃহত্তম সংখ্যা: %d\\n\", b);\n    else\n        printf(\"বৃহত্তম সংখ্যা: %d\\n\", c);\n    return 0;\n}",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        collegeName: "রাজউক উত্তরা মডেল কলেজ",
        modelTestNo: "Model Test 01"
    },
    {
        chapter: "Chapter 5: প্রোগ্রামিং ভাষা (C Programming)",
        stem: "আসিফ ১ থেকে n পর্যন্ত বিজোড় সংখ্যাগুলোর যোগফল (১ + ৩ + ৫ + ... + n) নির্ণয় করার জন্য একটি লুপ ব্যবহার করে কোড লেখার চেষ্টা করছে।",
        q_ka: "ভেরিয়েবল বা চলক কী?",
        a_ka: "প্রোগ্রাম চলাকালীন মেমোরিতে যে স্থানে ডাটা সংরক্ষণ করা হয় এবং যার মান পরিবর্তনশীল তাকে চলক (Variable) বলে।",
        q_kha: "while এবং do-while লুপের পার্থক্য ব্যাখ্যা কর।",
        a_kha: "while লুপ হলো এন্ট্রি-কন্ট্রোলড লুপ, অর্থাৎ লুপের শুরুতে শর্ত সত্য হলে তবেই স্টেটমেন্ট এক্সিকিউট হয়। কিন্তু do-while লুপ এক্সিট-কন্ট্রোলড লুপ, শর্ত মিথ্যা হলেও লুপ বডি অন্তত একবার চলে।",
        q_ga: "উদ্দীপকে উল্লিখিত ১ থেকে n পর্যন্ত বিজোড় সংখ্যার ধারাটির যোগফল নির্ণয়ের জন্য for লুপ ব্যবহার করে একটি সি কোড লিখ।",
        a_ga: "#include <stdio.h>\nint main() {\n    int n, sum = 0;\n    printf(\"n এর মান লিখুন: \");\n    scanf(\"%d\", &n);\n    for(int i = 1; i <= n; i += 2) {\n        sum += i;\n    }\n    printf(\"বিজোড় সংখ্যার যোগফল = %d\\n\", sum);\n    return 0;\n}",
        q_gha: "একই সমস্যাটি while লুপ দ্বারা সমাধান করে লুপের কার্যকারিতা বিশ্লেষণ কর।",
        a_gha: "#include <stdio.h>\nint main() {\n    int n, i = 1, sum = 0;\n    printf(\"n এর মান লিখুন: \");\n    scanf(\"%d\", &n);\n    while(i <= n) {\n        sum += i;\n        i += 2;\n    }\n    printf(\"যোগফল = %d\\n\", sum);\n    return 0;\n}\nwhile লুপে শর্ত আগে পরীক্ষা হয়, ফলে n এর মান ০ বা ঋণাত্মক দিলে অপ্রয়োজনীয় লুপ চলে না।",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper"],
        boardName: "চট্টগ্রাম বোর্ড",
        examYear: "2024",
        collegeName: "ঢাকা রেসিডেনসিয়াল মডেল কলেজ"
    },

    // Chapter 6: DBMS
    {
        chapter: "Chapter 6: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)",
        stem: "একটি কলেজের ডাটাবেজে দুটি টেবিল রয়েছে:\n১. Student_Info (Roll, Name, Class, District)\n২. Result_Info (Roll, GPA, Grade, Pass_Year)\nপ্রশাসন বিভাগ এই দুটি টেবিলকে সম্পর্কিত করে শিক্ষার্থীদের পূর্ণাঙ্গ একাডেমিক ফলাফল প্রস্তুত করে।",
        q_ka: "প্রাইমারি কী (Primary Key) কী?",
        a_ka: "যে ফিল্ডের মাধ্যমে ডাটাবেজ টেবিলের প্রতিটি রেকর্ডকে একক ও অনন্যভাবে (Uniquely) শনাক্ত করা যায় তাকে প্রাইমারি কী বলে।",
        q_kha: "ডাটাবেজ রিলেশনের শর্তাবলি সংক্ষেপে ব্যাখ্যা কর।",
        a_kha: "দুটি টেবিলের মধ্যে রিলেশন গঠনের জন্য: ১) উভয় টেবিলে অন্তত একটি কমন ফিল্ড থাকতে হবে, ২) কমন ফিল্ডের ডাটা টাইপ ও ফিল্ড সাইজ একই হতে হবে, এবং ৩) কমন ফিল্ডটির অন্তত একটি টেবিলে প্রাইমারি কী হতে হবে।",
        q_ga: "উদ্দীপকের টেবিল দুটির মধ্যে কমন ফিল্ড চিহ্নিত করে এদের মধ্যকার রিলেশনশিপ চিত্রসহ বর্ণনা কর।",
        a_ga: "এখানে উভয় টেবিলে কমন ফিল্ড হলো 'Roll'। Student_Info টেবিলে 'Roll' হলো প্রাইমারি কী এবং Result_Info টেবিলে 'Roll' হলো ফরেন কী। প্রতিটি ছাত্রের জন্য একটি মাত্র চূড়ান্ত ফলাফল থাকায় এদের সম্পর্ক One-to-One (1:1) অথবা One-to-Many।",
        q_gha: "Student_Info টেবিল থেকে ঢাকা জেলার সকল শিক্ষার্থীর তথ্য দেখার জন্য প্রয়োজনীয় SQL কুয়েরি লিখ এবং এর উপযোগিতা বিশ্লেষণ কর।",
        a_gha: "SQL কুয়েরি:\nSELECT * FROM Student_Info WHERE District = 'Dhaka';\nএই কুয়েরিটির মাধ্যমে বিশাল ডাটাবেজ থেকে মুহূর্তের মধ্যে সুনির্দিষ্ট তথ্য ফিল্টার করে নির্ভুল তালিকা প্রিন্ট করা সম্ভব।",
        categoryTypes: ["Chapter Practice", "Board Question", "College Test Paper", "Model Test"],
        boardName: "ঢাকা বোর্ড",
        examYear: "2024",
        collegeName: "নটর ডেম কলেজ, ঢাকা",
        modelTestNo: "Model Test 01"
    }
];

let maxCqId = 20000;
newCqs.forEach((q, idx) => {
    q._id = 'gen_cq_' + (maxCqId + idx);
    q.serialNo = maxCqId + idx;
    q.createdAt = new Date().toISOString();
    q.__v = 0;
    cqs.push(q);
});

console.log('Total CQs after addition:', cqs.length);
fs.writeFileSync(cqsPath, JSON.stringify(cqs, null, 2), 'utf8');
console.log('Successfully seeded missing questions for all chapters!');
