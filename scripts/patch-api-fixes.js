const fs = require('fs');
const path = require('path');

const apiFile = path.join(__dirname, '..', 'assets', 'js', 'api.js');
let content = fs.readFileSync(apiFile, 'utf8');

// 1. Fix matchCollegeName groups for 'dc'
const oldDcGroup = `        ['dhaka college', 'ঢাকা কলেজ'],
        ['city college', 'সিটি কলেজ', 'dcc'],`;
const newDcGroup = `        ['dhaka college', 'ঢাকা কলেজ', 'dc'],
        ['city college', 'সিটি কলেজ', 'dcc', 'dc', 'ঢাকা সিটি কলেজ'],`;

content = content.replace(oldDcGroup, newDcGroup);

// 2. Fix getModelTestMCQ to always return 25 questions
const oldModelSection = `        const allMcqs = await fetchStaticJson('mcqs.json');
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

const newModelSection = `        const allMcqs = await fetchStaticJson('mcqs.json');
        if (allMcqs.length > 0) {
            let matched = allMcqs.filter(item => {
                if (!hasCategory(item, 'Model Test')) return false;
                if (testKey && item.modelTestNo) {
                    return item.modelTestNo.toLowerCase().includes(testKey.toLowerCase());
                }
                return true;
            });
            // Supplement up to 25 questions from allMcqs
            const pool = allMcqs.sort(() => 0.5 - Math.random());
            for (const item of pool) {
                if (matched.length >= 25) break;
                if (!matched.some(m => m._id === item._id)) {
                    matched.push(item);
                }
            }
            return matched.map(mapBackendMcqToFrontend);
        }
        return MOCK_DATA.questions;`;

content = content.replace(oldModelSection, newModelSection);

// 3. Add helper aliases for favorite questions
if (!content.includes('window.saveQuestionToFavorites')) {
    const favHelpers = `
// Aliases for favorite management
function saveQuestionToFavorites(qData, category) {
    if (!qData) return;
    const cat = category || (qData.category || detectCurrentMCQCategory());
    let list = getFavoriteQuestions();
    const existingIndex = list.findIndex(item => String(item.id) === String(qData.id));
    const entry = {
        id: qData.id,
        category: cat,
        source_title: qData.source_title || '',
        question_text: qData.question_text || qData.question || '',
        options: qData.options || [],
        correct_index: qData.correct_index !== undefined ? qData.correct_index : (qData.correct || 0),
        explanation: qData.explanation || '',
        context_stem: qData.context_stem || '',
        image: qData.image || '',
        added_at: Date.now()
    };
    if (existingIndex >= 0) {
        list[existingIndex] = entry;
    } else {
        list.push(entry);
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
}

function removeQuestionFromFavorites(qId) {
    let list = getFavoriteQuestions();
    list = list.filter(item => String(item.id) !== String(qId));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
}

function getFavoriteQuestionsByCategory(cat) {
    return getFavoriteQuestions(cat);
}

window.saveQuestionToFavorites = saveQuestionToFavorites;
window.removeQuestionFromFavorites = removeQuestionFromFavorites;
window.getFavoriteQuestionsByCategory = getFavoriteQuestionsByCategory;
`;
    content += favHelpers;
}

fs.writeFileSync(apiFile, content, 'utf8');
console.log('Successfully patched api.js with dc college aliases, 25-question model test guarantee, and favorite helpers!');
