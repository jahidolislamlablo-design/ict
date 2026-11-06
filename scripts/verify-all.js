const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Setup global mock browser environment for Node.js
global.window = {
    location: {
        host: 'localhost:5500',
        hostname: 'localhost',
        pathname: '/pages/chapter-prep.html',
        protocol: 'http:',
        port: '5500'
    }
};

const localStorageStore = {};
global.localStorage = {
    getItem: (k) => localStorageStore[k] || null,
    setItem: (k, v) => { localStorageStore[k] = String(v); },
    removeItem: (k) => { delete localStorageStore[k]; },
    clear: () => { for (const k in localStorageStore) delete localStorageStore[k]; }
};

// Mock fetch for static json loading
global.fetch = async (url) => {
    let filename = '';
    if (url.includes('mcqs.json')) filename = 'mcqs.json';
    else if (url.includes('cqs.json')) filename = 'cqs.json';
    else if (url.includes('pdfs.json')) filename = 'pdfs.json';

    if (filename) {
        const filePath = path.join(__dirname, '..', 'database', filename);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return {
                ok: true,
                status: 200,
                json: async () => data
            };
        }
    }
    return {
        ok: false,
        status: 404,
        json: async () => ({})
    };
};

// Load api.js into global context
const apiCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'api.js'), 'utf8');
vm.runInThisContext(apiCode);

async function runTests() {
    console.log('====================================================');
    console.log('RUNNING FULL SYSTEM VERIFICATION SUITE');
    console.log('====================================================');

    let passed = 0;
    let failed = 0;

    function assert(desc, condition) {
        if (condition) {
            console.log(`[PASS] ${desc}`);
            passed++;
        } else {
            console.error(`[FAIL] ${desc}`);
            failed++;
        }
    }

    // 1. Chapter MCQ Tests (Chapters 1 to 6)
    const chapters = [1, 2, '3.1', '3.2', 4, 5, 6];
    for (const ch of chapters) {
        const mcqs = await ApiService.getChapterMCQ(ch);
        assert(`Chapter ${ch} MCQ loaded: count = ${mcqs ? mcqs.length : 0}`, mcqs && mcqs.length > 0);
    }

    // 2. Chapter CQ Tests (Chapters 1 to 6)
    for (const ch of chapters) {
        const cqs = await ApiService.getChapterCQ(ch);
        assert(`Chapter ${ch} CQ loaded: count = ${cqs ? cqs.length : 0}`, cqs && cqs.length > 0);
    }

    // 3. Board MCQ and CQ Tests
    const boards = ['dhaka', 'rajshahi', 'chattogram', 'jashore', 'comilla', 'barishal', 'sylhet', 'dinajpur'];
    for (const b of boards) {
        const bMcqs = await ApiService.getBoardMCQ(b, '2024');
        assert(`Board ${b} (2024) MCQ loaded: count = ${bMcqs ? bMcqs.length : 0}`, bMcqs && bMcqs.length > 0);

        const bCqs = await ApiService.getBoardCQ(b, '2024');
        assert(`Board ${b} (2024) CQ loaded: count = ${bCqs ? bCqs.length : 0}`, bCqs && bCqs.length > 0);
    }

    // 4. College Test Paper Tests
    const colleges = ['ndc', 'vnsc', 'rajuk', 'dc'];
    for (const col of colleges) {
        const colMcqs = await ApiService.getCollegeMCQ(col);
        assert(`College ${col} MCQ loaded: count = ${colMcqs ? colMcqs.length : 0}`, colMcqs && colMcqs.length > 0);

        const colCqs = await ApiService.getCollegeCQ(col);
        assert(`College ${col} CQ loaded: count = ${colCqs ? colCqs.length : 0}`, colCqs && colCqs.length > 0);
    }

    // 5. Model Test (25 questions guarantee)
    const modelTestQuestions = await ApiService.getModelTestMCQ('Model Test 01');
    assert(`Model Test contains >= 25 questions: count = ${modelTestQuestions ? modelTestQuestions.length : 0}`, modelTestQuestions && modelTestQuestions.length >= 25);

    // 6. Favorite Bookmarking System
    const sampleQuestion = {
        id: 'test_q_999',
        question: 'টেস্ট ফেভারিট প্রশ্ন?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
        explanation: 'টেস্ট ব্যাখ্যা'
    };

    saveQuestionToFavorites(sampleQuestion, 'chapter');
    assert('Question saved to favorites in localStorage', isQuestionFavorite('test_q_999'));

    const favChapter = getFavoriteQuestionsByCategory('chapter');
    assert('Favorite question retrieved under "chapter" category', favChapter.length >= 1 && favChapter.some(f => f.id === 'test_q_999'));

    removeQuestionFromFavorites('test_q_999');
    assert('Question removed from favorites in localStorage', !isQuestionFavorite('test_q_999'));

    // 7. Check Navbar links across all HTML files
    const htmlFiles = [
        path.join(__dirname, '..', 'index.html'),
        ...fs.readdirSync(path.join(__dirname, '..', 'pages')).filter(f => f.endsWith('.html')).map(f => path.join(__dirname, '..', 'pages', f))
    ];

    let navbarsClean = true;
    htmlFiles.forEach(file => {
        const c = fs.readFileSync(file, 'utf8');
        const match = c.match(/<ul class="desktop-nav">([\s\S]*?)<\/ul>/);
        if (match) {
            const nav = match[1];
            if (nav.includes('favorite-question.html') || nav.includes('compiler.html')) {
                console.error(`Nav contains forbidden links in ${path.basename(file)}`);
                navbarsClean = false;
            }
        }
    });
    assert('Navbar desktop-nav is clean of Favorite & Compiler across all HTML files', navbarsClean);

    // 8. Check Home page cards placement in main body
    const indexContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const mainBody = indexContent.slice(indexContent.indexOf('<main'));
    assert('index.html contains special-tools-grid for Favorite Question & Code Compiler', mainBody.includes('class="special-tools-grid"'));
    const pdfPos = mainBody.indexOf('PDF Suggestions');
    const favPos = mainBody.indexOf('Favorite Question');
    const compPos = mainBody.indexOf('Code Compiler');
    assert('Favorite Question is placed below PDF Suggestions in index.html', favPos > pdfPos);
    assert('Code Compiler is placed below PDF Suggestions in index.html', compPos > pdfPos);

    // 9. Check Compiler HTML structure
    const compilerContent = fs.readFileSync(path.join(__dirname, '..', 'pages', 'compiler.html'), 'utf8');
    assert('compiler.html contains single-screen Code & Output toggle buttons', compilerContent.includes('btn-toggle-code') && compilerContent.includes('btn-toggle-output'));
    assert('compiler.html contains toggleCompilerScreen function', compilerContent.includes('function toggleCompilerScreen'));

    console.log('====================================================');
    console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');
    if (failed > 0) process.exit(1);
}

runTests();
