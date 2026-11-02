const mongoose = require('mongoose');

async function updateDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
    console.log('Connected to MongoDB');

    const Cq = mongoose.connection.collection('cqs');
    const cqs = await Cq.find({}).toArray();

    const jpegIndices = [7, 8, 9, 21, 28, 41];
    let updatedCount = 0;

    for (const doc of cqs) {
        let changed = false;
        let updateFields = {};

        const checkAndUpdate = (field) => {
            if (typeof doc[field] === 'string') {
                let val = doc[field];
                for (const num of jpegIndices) {
                    const regex = new RegExp(`cq_ch3_image${num}\\.jpeg`, 'g');
                    if (regex.test(val)) {
                        val = val.replace(regex, `cq_ch3_image${num}.png`);
                        changed = true;
                    }
                }
                if (changed) updateFields[field] = val;
            }
        };

        ['image', 'a_ka', 'a_kha', 'a_ga', 'a_gha', 'stem'].forEach(checkAndUpdate);

        if (changed) {
            await Cq.updateOne({ _id: doc._id }, { $set: updateFields });
            updatedCount++;
        }
    }

    console.log(`Updated ${updatedCount} CQ documents in MongoDB.`);
    await mongoose.disconnect();
}

updateDb().catch(console.error);
