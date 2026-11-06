const fs = require('fs');
const path = require('path');

const apiFile = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(apiFile, 'utf8');

// 1. Fix groups in matchCollegeName:
const targetGroupsOld = `        ['dhaka college', 'ঢাকা কলেজ'],
        ['city college', 'সিটি কলেজ', 'dcc'],`;

const targetGroupsNew = `        ['dhaka college', 'ঢাকা কলেজ', 'dc'],
        ['city college', 'সিটি কলেজ', 'dcc', 'dc', 'ঢাকা সিটি কলেজ'],`;

content = content.replace(targetGroupsOld, targetGroupsNew);

// 2. Fix getModelTestMCQ using regex replacement:
const modelTestRegex = /async getModelTestMCQ\([\s\S]*?\n    \},/;
const modelTestReplacement = `async getModelTestMCQ(testIdentifier = '') {
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

content = content.replace(modelTestRegex, modelTestReplacement);

fs.writeFileSync(apiFile, content, 'utf8');
console.log('Directly patched matchCollegeName and getModelTestMCQ!');
