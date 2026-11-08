const fs = require('fs');
const path = require('path');

const chapterNames = [
    "প্রথম অধ্যায়",
    "দ্বিতীয় অধ্যায়",
    "তৃতীয় অধ্যায় (সংখ্যা পদ্ধতি)",
    "তৃতীয় অধ্যায় (ডিজিটাল ডিভাইস)",
    "চতুর্থ অধ্যায় (HTML)",
    "পঞ্চম অধ্যায় (C Programming)",
    "৬ষ্ঠ অধ্যায় (DBMS)",
    "১ম ও ২য় অধ্যায়",
    "৩য় ও ৪র্থ অধ্যায়",
    "৫ম ও ৬ষ্ঠ অধ্যায়",
    "পূর্ণাঙ্গ সিলেবাস"
];

const modelTests = [];

for (let i = 1; i <= 50; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    let ch = "পূর্ণাঙ্গ সিলেবাস";
    let cat = "full";
    if (i === 1) {
        ch = "প্রথম অধ্যায়";
        cat = "chapter";
    } else if (i <= 7) {
        const cNames = ["প্রথম অধ্যায়", "দ্বিতীয় অধ্যায়", "৩য় অধ্যায় (১ম অংশ)", "৩য় অধ্যায় (২য় অংশ)", "৪র্থ অধ্যায়", "৫ম অধ্যায়", "৬ষ্ঠ অধ্যায়"];
        ch = cNames[i - 1] || "অধ্যায়ভিত্তিক";
        cat = "chapter";
    } else if (i > 30) {
        cat = "chapter";
        ch = `অধ্যায়ভিত্তিক স্পেশাল (${(i - 30) % 6 + 1}ম অধ্যায়)`;
    }

    // Generate date like "01-11-26", "02-11-26", etc.
    const day = (i % 28) + 1;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const month = ((Math.floor(i / 28) + 10) % 12) + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = i === 1 ? "01-11-26" : `${dayStr}-${monthStr}-26`;

    const participants = 500 + ((i * 47) % 350);

    modelTests.push({
        _id: `mt-${numStr}`,
        serialNo: i,
        examNo: numStr,
        title: `Model Test ${numStr}`,
        date: dateStr,
        chapters: ch,
        category: cat,
        totalQuestions: 25,
        duration: 25,
        totalMarks: 25,
        participants: i === 1 ? 547 : participants,
        startTime: "",
        endTime: "",
        isLive: false,
        buttonText: "Start Previous Live Exam"
    });
}

const dbDir = path.join(__dirname, '..', 'database');
const targetPath = path.join(dbDir, 'model_tests.json');
fs.writeFileSync(targetPath, JSON.stringify(modelTests, null, 2), 'utf8');
console.log(`Generated ${modelTests.length} model tests in ${targetPath}`);

const oneDriveBase = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning';
const oneDriveTarget = path.join(oneDriveBase, 'database', 'model_tests.json');
if (fs.existsSync(path.dirname(oneDriveTarget))) {
    fs.writeFileSync(oneDriveTarget, JSON.stringify(modelTests, null, 2), 'utf8');
    console.log(`Synced to OneDrive: ${oneDriveTarget}`);
}
