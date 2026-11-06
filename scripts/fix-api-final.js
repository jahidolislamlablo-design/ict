const fs = require('fs');
const path = require('path');

const apiFile = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(apiFile, 'utf8');

// 1. Update getModelTestMCQ
const oldGetModelTestMCQ = `    async getModelTestMCQ(testIdentifier) {
        let testKey = testIdentifier;
        const match = testIdentifier.match(/(?:Model Test\\s*|মডেল টেস্ট\\s*[-–]?\\s*)(\\d+)/i);
        if (match) {
            const n = parseInt(match[1], 10);
            const numStr = n < 10 ? '0' + n : '' + n;
            testKey = 'Model Test ' + numStr;
        }

        try {
            const query = \`/api/mcqs?categoryType=Model Test&modelTestNo=\${encodeURIComponent(testKey)}\`;
            const res = await fetchFromBackend(query);
            if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
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
        return [];
    },`;

const newGetModelTestMCQ = `    async getModelTestMCQ(testIdentifier = '') {
        try {
            let testKey = testIdentifier || '';
            const match = String(testIdentifier).match(/(?:Model Test\\s*|মডেল টেস্ট\\s*[-–]?\\s*)(\\d+)/i);
            if (match) {
                const n = parseInt(match[1], 10);
                const numStr = n < 10 ? '0' + n : '' + n;
                testKey = 'Model Test ' + numStr;
            }

            const query = \`/api/mcqs?categoryType=Model Test\` + (testKey ? \`&modelTestNo=\${encodeURIComponent(testKey)}\` : '');
            const res = await fetchFromBackend(query);
            if (res && res.success && Array.isArray(res.data) && res.data.length >= 25) {
                return res.data.map(mapBackendMcqToFrontend);
            }
        } catch (e) {}

        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            let matched = allMcqs.filter(item => hasCategory(item, 'Model Test'));
            // Always ensure at least 25 questions for full model test
            if (matched.length < 25) {
                const pool = [...allMcqs].sort(() => 0.5 - Math.random());
                for (const item of pool) {
                    if (matched.length >= 25) break;
                    if (!matched.some(m => m._id === item._id)) {
                        matched.push(item);
                    }
                }
            }
            return matched.slice(0, 25).map(mapBackendMcqToFrontend);
        }
        return MOCK_DATA.questions;
    },`;

if (content.includes('async getModelTestMCQ(testIdentifier) {')) {
    content = content.replace(oldGetModelTestMCQ, newGetModelTestMCQ);
}

// 2. Update getCollegeCQ and getCollegeMCQ to gracefully fallback if specific college has 0 matches
const oldCollegeCQBlock = `        const allCqs = await fetchStaticJson('cqs.json');
        if (allCqs.length > 0) {
            const filtered = allCqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            return filtered.map(mapBackendCqToFrontend);
        }
        return [];`;

const newCollegeCQBlock = `        const allCqs = await fetchStaticJson('cqs.json');
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
        }
        return [];`;

content = content.replace(oldCollegeCQBlock, newCollegeCQBlock);

const oldCollegeMCQBlock = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            const filtered = allMcqs.filter(item => {
                if (!hasCategory(item, 'College Test Paper')) return false;
                if (collegeId && item.collegeName) {
                    return matchCollegeName(item.collegeName, collegeId);
                }
                return true;
            });
            if (filtered.length > 0) return filtered.map(mapBackendMcqToFrontend);
        }
        return [];`;

const newCollegeMCQBlock = `        const allMcqs = await fetchStaticJson('mcqs.json');
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
        }
        return [];`;

content = content.replace(oldCollegeMCQBlock, newCollegeMCQBlock);

fs.writeFileSync(apiFile, content, 'utf8');
console.log('Successfully updated api.js with 25-question Model Test and college fallbacks!');
