const fs = require('fs');
const { convertBijoyToUnicode } = require('bijoy2unicode');

function smartConvert(text) {
    if (!text) return '';
    const tokens = [];
    function makeToken(str) {
        const id = tokens.length;
        tokens.push(str);
        return String.fromCharCode(0xE000 + id);
    }

    // 1. Protect HTML tags & comments
    let protectedText = text.replace(/<[^>]+>/g, m => makeToken(m));

    // 2. Protect URLs & filenames
    protectedText = protectedText.replace(/https?:\/\/[^\s]+|www\.[a-z0-9.-]+\.[a-z]{2,}|[a-z0-9_-]+\.(jpg|jpeg|png|gif|html|php)/gi, m => makeToken(m));

    // 3. Protect English words, abbreviations, names
    const engWords = [
        'HTML', 'DOCTYPE', 'CSS', 'PHP', 'MySQL', 'URL', 'HTTP', 'HTTPS', 'FTP', 'IP', 'TCP', 'IP Address',
        'DNS', 'CAD', 'RAM', 'ROM', 'USB', 'WiFi', 'Google', 'Chrome', 'Firefox', 'Mozilla', 'Opera', 'Safari',
        'Bing', 'MSN', 'Yahoo', 'Internet', 'Explorer', 'Word', 'Excel', 'JavaScript', 'ASP', 'JSP',
        'ASP.NET', 'DBMS', 'Home Page', 'Web Page', 'Website', 'Web', 'Server', 'Client', 'Empty', 'Linear', 'Tree', 'Hybrid',
        'Next', 'Previous', 'Last', 'First', 'Page', 'Link', 'Table', 'Image', 'Form', 'Frame', 'Hyperlink', 'Protocol',
        'Student', 'Result', 'Subject', 'Name', 'Roll', 'Address', 'GPA', 'Marks', 'Sheet', 'Notice Board',
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
        'Hum', 'Hum.', 'SC', 'Se', 'Case Sensitive', 'Casc Sensitive', 'Tag', 'Syntax', 'Wire Frame', 'Wireframe', 'Markup Language',
        'Hyper Text Markup Language', 'Uniform Resource Locator', 'File Transfer Protocol', 'Internet Protocol Address',
        'About Us', 'Contact', 'All Department', 'Company', 'welcome to Chandana Model College', 'Chandana Model College',
        'Welcome', 'Available Honor’s Subject', 'Available Honor\'s Subject', 'Subject Name', 'Serial No', 'Serial no',
        'XYZ College, Dhaka', 'Alor Sopan School', 'Alor Sopan', 'This is my home page', 'Bangladesh is land of rivers and cannals',
        'Pabna Sadar, Pabna', 'Computer Compose & IT Service', 'Size', 'Color', 'Face', 'font', 'align', 'border', 'colspan', 'rowspan',
        'width', 'height', 'src', 'href', 'target', 'type', 'start', 'caption'
    ];

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

const fullRaw = fs.readFileSync('scripts/full_pdf_raw.txt', 'utf8');
console.log('Full raw length:', fullRaw.length);

// Let's test smart converting the whole document
console.log('Converting full raw document with smart converter...');
const fullUnicode = smartConvert(fullRaw);
fs.writeFileSync('scripts/full_pdf_smart_unicode.txt', fullUnicode, 'utf8');
console.log('Saved full_pdf_smart_unicode.txt! Length:', fullUnicode.length);
