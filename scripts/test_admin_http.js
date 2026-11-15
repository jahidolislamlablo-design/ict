const http = require('http');

http.get('http://localhost:5000/admin.html', res => {
    console.log('HTTP Status:', res.statusCode);
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('Loaded bytes:', data.length);
        console.log('Contains select mcqChapter:', data.includes('select id="mcqChapter"'));
        console.log('Contains leChapterDropdownWrapper:', data.includes('leChapterDropdownWrapper'));
    });
}).on('error', e => console.error(e));
