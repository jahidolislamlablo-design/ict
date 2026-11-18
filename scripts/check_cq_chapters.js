const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    const CQ = mongoose.model('CQ', new mongoose.Schema({}, { strict: false }));
    const chapters = await CQ.distinct('chapter');
    console.log('Distinct chapters in CQ:', chapters);
    const anyCq = await CQ.findOne().lean();
    console.log('Sample CQ:', JSON.stringify(anyCq, null, 2));
    await mongoose.disconnect();
}
test().catch(console.error);
