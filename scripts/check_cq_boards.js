const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    const CQ = mongoose.model('CQ', new mongoose.Schema({}, { strict: false }));
    const boards = await CQ.distinct('boardName');
    console.log('Distinct boardNames in CQ:', boards);
    const years = await CQ.distinct('examYear');
    console.log('Distinct examYears in CQ:', years);
    await mongoose.disconnect();
}
test().catch(console.error);
