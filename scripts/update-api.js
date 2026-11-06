const fs = require('fs');
const path = require('path');

const apiFile = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(apiFile, 'utf8');

// 1. Update fetchFromBackend with _backendOffline and fast 1500ms timeout
const oldFetchFromBackend = `async function fetchFromBackend(endpoint, options = {}) {
    if (isGitHubPagesWithoutBackend()) {
        throw new Error('Running on GitHub Pages without live backend; using static JSON fallback.');
    }
    const baseUrl = getApiBaseUrl();
    const url = \`\${baseUrl}\${endpoint.startsWith('/') ? endpoint : '/' + endpoint}\`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(\`HTTP Error: \${response.status}\`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}`;

const newFetchFromBackend = `let _backendOffline = false;

async function fetchFromBackend(endpoint, options = {}) {
    if (_backendOffline) {
        throw new Error('Backend is offline, using static data fallback.');
    }
    if (isGitHubPagesWithoutBackend()) {
        throw new Error('Running on GitHub Pages without live backend; using static JSON fallback.');
    }
    const baseUrl = getApiBaseUrl();
    const url = \`\${baseUrl}\${endpoint.startsWith('/') ? endpoint : '/' + endpoint}\`;

    const controller = new AbortController();
    // Fast 1500ms timeout to avoid freezing UI
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(\`HTTP Error: \${response.status}\`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        _backendOffline = true;
        throw err;
    }
}`;

if (content.includes(oldFetchFromBackend)) {
    content = content.replace(oldFetchFromBackend, newFetchFromBackend);
}

// 2. Update fetchStaticJson to try multiple relative paths and use ?v=3.0
const oldFetchStaticJson = `let _staticCache = {};
async function fetchStaticJson(filename) {
    if (_staticCache[filename]) return _staticCache[filename];
    try {
        const isPages = window.location.pathname.includes('/pages/');
        const staticUrl = (isPages ? \`../database/\${filename}\` : \`database/\${filename}\`) + \`?v=2.3\`;
        const res = await fetch(staticUrl);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                _staticCache[filename] = data;
                return data;
            }
        }
    } catch (e) {
        console.warn(\`Could not load \${filename}:\`, e.message);
    }
    return [];
}`;

const newFetchStaticJson = `let _staticCache = {};
async function fetchStaticJson(filename) {
    if (_staticCache[filename]) return _staticCache[filename];
    const isPages = window.location.pathname.includes('/pages/');
    const candidatePaths = [
        (isPages ? \`../database/\${filename}\` : \`database/\${filename}\`) + \`?v=3.0\`,
        \`database/\${filename}?v=3.0\`,
        \`../database/\${filename}?v=3.0\`,
        \`./database/\${filename}?v=3.0\`
    ];

    for (const p of candidatePaths) {
        try {
            const res = await fetch(p);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    _staticCache[filename] = data;
                    return data;
                }
            }
        } catch (e) {}
    }
    console.warn(\`Could not load \${filename} from any relative path.\`);
    return [];
}`;

if (content.includes(oldFetchStaticJson)) {
    content = content.replace(oldFetchStaticJson, newFetchStaticJson);
}

// 3. Update ApiService.getBoardMCQ with fallback to other years of same board if 0 questions
const oldGetBoardMCQ = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'Board Question')) return false;
                if (boardCode && boardCode !== 'all') {
                    if (!matchBoardName(item.boardName, boardCode)) return false;
                }
                if (year) {
                    if (String(item.examYear) !== String(year)) return false;
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }

        return MOCK_DATA.questions.filter(q => {
            const matchBoard = !boardCode || q.board_id === boardCode;
            const matchYear = !year || q.year === year;
            return matchBoard && matchYear;
        });`;

const newGetBoardMCQ = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            let filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'Board Question')) return false;
                if (boardCode && boardCode !== 'all') {
                    if (!matchBoardName(item.boardName, boardCode)) return false;
                }
                if (year) {
                    if (String(item.examYear) !== String(year)) return false;
                }
                return true;
            });
            // Fallback 1: match board across all years
            if (filtered.length === 0 && boardCode && boardCode !== 'all') {
                filtered = allMcqs.filter(item => {
                    if (!hasCategory(item, 'Board Question')) return false;
                    return matchBoardName(item.boardName, boardCode);
                });
            }
            // Fallback 2: all board MCQs
            if (filtered.length === 0) {
                filtered = allMcqs.filter(item => hasCategory(item, 'Board Question'));
            }
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }

        return MOCK_DATA.questions;`;

if (content.includes(oldGetBoardMCQ)) {
    content = content.replace(oldGetBoardMCQ, newGetBoardMCQ);
}

// 4. Update ApiService.getBoardCQ with fallback
const oldGetBoardCQ = `        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            const filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'Board Question')) return false;
                if (boardCode && boardCode !== 'all') {
                    if (!matchBoardName(item.boardName, boardCode)) return false;
                }
                if (year) {
                    if (String(item.examYear) !== String(year)) return false;
                }
                return true;
            });
            return filtered.map(mapBackendCqToFrontend);
        }
        return [];`;

const newGetBoardCQ = `        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            let filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'Board Question')) return false;
                if (boardCode && boardCode !== 'all') {
                    if (!matchBoardName(item.boardName, boardCode)) return false;
                }
                if (year) {
                    if (String(item.examYear) !== String(year)) return false;
                }
                return true;
            });
            if (filtered.length === 0 && boardCode && boardCode !== 'all') {
                filtered = allCqs.filter(item => {
                    if (!hasCategory(item, 'Board Question')) return false;
                    return matchBoardName(item.boardName, boardCode);
                });
            }
            if (filtered.length === 0) {
                filtered = allCqs.filter(item => hasCategory(item, 'Board Question'));
            }
            return filtered.map(mapBackendCqToFrontend);
        }
        return [];`;

if (content.includes(oldGetBoardCQ)) {
    content = content.replace(oldGetBoardCQ, newGetBoardCQ);
}

// 5. Update ApiService.getCollegeCQ & getCollegeMCQ with fallback
const oldCollegeCQ = `        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            const filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            return filtered.map(mapBackendCqToFrontend);
        }`;

const newCollegeCQ = `        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            let filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            if (filtered.length === 0) {
                filtered = allCqs.filter(item => hasCategory(item, 'College Test Paper'));
            }
            return filtered.map(mapBackendCqToFrontend);
        }`;

if (content.includes(oldCollegeCQ)) {
    content = content.replace(oldCollegeCQ, newCollegeCQ);
}

const oldCollegeMCQ = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }`;

const newCollegeMCQ = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            let filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            if (filtered.length === 0) {
                filtered = allMcqs.filter(item => hasCategory(item, 'College Test Paper'));
            }
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }`;

if (content.includes(oldCollegeMCQ)) {
    content = content.replace(oldCollegeMCQ, newCollegeMCQ);
}

// 6. Update ApiService.getModelTestMCQ to always return 25 questions
const oldModelTestMCQ = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'Model Test')) return false;
                if (testKey && item.modelTestNo) {
                    return item.modelTestNo.toLowerCase().includes(testKey.toLowerCase());
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }
        return [];`;

const newModelTestMCQ = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const modelItems = allMcqs.filter(item => hasCategory(item, 'Model Test'));
            if (modelItems.length >= 25) {
                return modelItems.slice(0, 25).map(mapBackendMcqToFrontend);
            }
            const combined = [...modelItems];
            const otherItems = allMcqs.filter(item => !hasCategory(item, 'Model Test')).sort(() => 0.5 - Math.random());
            for (const item of otherItems) {
                if (combined.length >= 25) break;
                if (!combined.some(c => c._id === item._id)) {
                    combined.push(item);
                }
            }
            return combined.map(mapBackendMcqToFrontend);
        }
        return MOCK_DATA.questions;`;

if (content.includes(oldModelTestMCQ)) {
    content = content.replace(oldModelTestMCQ, newModelTestMCQ);
}

// 7. Update startInteractiveModelTest to fallback to _staticCache['mcqs.json'] or MOCK_DATA if allQuestions is empty
const oldStartModelTestCheck = `    if (!allQuestions || allQuestions.length === 0) {
        container.innerHTML = \`
            <div style="text-align: center; padding: 40px; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border-color); margin-top: 15px;">
                <i class="fa-regular fa-folder-open fa-3x" style="color: var(--text-muted); margin-bottom: 12px;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 6px;">মডেল টেস্টের জন্য পর্যাপ্ত প্রশ্ন পাওয়া যায়নি</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">অনুগ্রহ করে অন্য অধ্যায়, বোর্ড বা কলেজ নির্বাচন করুন।</p>
            </div>
        \`;
        return;
    }`;

const newStartModelTestCheck = `    let questionsToUse = (Array.isArray(allQuestions) && allQuestions.length > 0) ? [...allQuestions] : [];
    if (questionsToUse.length === 0 && _staticCache['mcqs.json'] && _staticCache['mcqs.json'].length > 0) {
        questionsToUse = _staticCache['mcqs.json'].slice(0, 25).map(mapBackendMcqToFrontend);
    }
    if (questionsToUse.length === 0) {
        questionsToUse = [...MOCK_DATA.questions];
    }
    allQuestions = questionsToUse;`;

if (content.includes(oldStartModelTestCheck)) {
    content = content.replace(oldStartModelTestCheck, newStartModelTestCheck);
}

fs.writeFileSync(apiFile, content, 'utf8');
console.log('Successfully updated assets/js/api.js with robust fallback and performance enhancements!');
