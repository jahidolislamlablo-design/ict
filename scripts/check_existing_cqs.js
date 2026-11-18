const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    const CQ = mongoose.model('CQ', new mongoose.Schema({}, { strict: false }));
    const count = await CQ.countDocuments();
    console.log('Total CQs in DB:', count);
    const sample = await CQ.findOne({ chapter: /Chapter 4/i }).lean();
    console.log('Sample Chapter 4 CQ:', JSON.stringify(sample, null, 2));
    await mongoose.disconnect();
}
test().catch(console.error);
