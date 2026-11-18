const fs = require('fs');
const { convertBijoyToUnicode } = require('bijoy2unicode');

function smartConvertBijoy(text) {
    const tokens = [];
    function makeToken(str) {
        const id = tokens.length;
        tokens.push(str);
        // Use 2 PUA characters: \uE000 followed by char code offset
        return String.fromCharCode(0xE000 + id);
    }

    // 1. Protect HTML tags <...>
    let protectedText = text.replace(/<[^>]+>/g, m => makeToken(m));

    // 2. Protect URLs
    protectedText = protectedText.replace(/https?:\/\/[^\s]+|www\.[a-z0-9.-]+\.[a-z]{2,}/gi, m => makeToken(m));

    // 3. Protect specific code or English words
    const engWords = [
        'HTML', 'DOCTYPE', 'CSS', 'PHP', 'MySQL', 'URL', 'HTTP', 'HTTPS', 'FTP', 'IP', 'TCP',
        'DNS', 'CAD', 'RAM', 'ROM', 'USB', 'WiFi', 'Google', 'Chrome', 'Firefox', 'Mozilla', 'Opera', 'Safari',
        'Bing', 'MSN', 'Yahoo', 'Internet', 'Explorer', 'Word', 'Excel', 'JavaScript', 'ASP', 'JSP',
        'ASP.NET', 'DBMS', 'Home Page', 'Web Page', 'Website', 'Web', 'Server', 'Client',
        'Next', 'Previous', 'Last', 'First', 'Page', 'Link', 'Table', 'Image', 'Form', 'Frame',
        'Student', 'Result', 'Subject', 'Name', 'Roll', 'Address', 'GPA', 'Marks', 'Sheet',
        'English', 'Bangla', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Accounting',
        'Science', 'Commerce', 'Humanities', 'History', 'Management', 'Islamic History',
        'Book', 'Paper', 'Note Book', 'Marker', 'Ink', 'Pencil', 'Pen', 'Bag', 'Produce List',
        'A & H Company Ltd.', 'A & H Company Ltd', 'Order List', 'Unorder List', 'ABC Company', 'Monitor', 'Keyboard',
        'Rose.jpg', 'photo.jpg', 'image.jpg', 'logo.jpg', 'water lily.jpeg', 'notice.html', 'test.html',
        'Home.html', 'Admission.html', 'Result.html', 'Employee.html', 'Product.html',
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
        'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
        'Month', 'Day', 'Coffee', 'Tea', 'Black', 'Green', 'Milk', 'Mango', 'Jack Fruit', 'Fruit',
        'Seasonal Fruit', 'National Fruit', 'Seasonal', 'National', 'Red', 'Yellow', 'Quick', 'brown', 'fox', 'Jumps', 'over', 'the',
        'lazy', 'dog', 'and', 'then', 'it', 'fall', 'prey', 'to', 'a', 'lion',
        'Harry Porter', 'Zarin Tasnim', 'Zahidur Rahman', 'Razana Onse', 'Saiful Alam', 'Nafis', 'Sajal',
        'Reza', 'Eva', 'Jaber', 'Joni', 'Karim', 'Afrin', 'Zakia', 'Rima', 'Moon', 'Jui', 'Koli',
        'Hum', 'Hum.', 'SC', 'Se'
    ];

    // Sort by length descending so longer phrases match first
    engWords.sort((a, b) => b.length - a.length);

    engWords.forEach(w => {
        const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        protectedText = protectedText.replace(regex, m => makeToken(m));
    });

    // Protect Roman numerals: i., ii., iii., iv., v., vi.
    protectedText = protectedText.replace(/\b(i|ii|iii|iv|v|vi)\./gi, m => makeToken(m));

    // Convert Bijoy to Unicode
    let converted = convertBijoyToUnicode(protectedText);

    // Restore tokens
    tokens.forEach((tok, idx) => {
        const tokenChar = String.fromCharCode(0xE000 + idx);
        converted = converted.split(tokenChar).join(tok);
    });

    return converted;
}

const p1Raw = fs.readFileSync('scripts/pdf_pages/page_1.txt', 'utf8');
const p1Smart = smartConvertBijoy(p1Raw);
console.log('--- Smart converted Page 1 (first 1200 chars) ---');
console.log(p1Smart.slice(0, 1200));

fs.writeFileSync('scripts/page_1_smart.txt', p1Smart, 'utf8');
