const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');

// Find MCQ Metadata Card start & end
const mcqCardStart = content.indexOf('<!-- মেটাডেটা বক্স -->');
const mcqCardEnd = content.indexOf('<!-- প্রশ্ন টেক্সট', mcqCardStart);
console.log('MCQ Metadata Card Length in admin.html:', mcqCardEnd - mcqCardStart);

// Find CQ Metadata Card start & end
const cqCardStart = content.indexOf('<!-- মেটাডেটা বক্স -->', mcqCardEnd);
const cqCardEnd = content.indexOf('<!-- উদ্দীপক (Creative Stem) -->', cqCardStart);
console.log('CQ Metadata Card Length in admin.html:', cqCardEnd - cqCardStart);
