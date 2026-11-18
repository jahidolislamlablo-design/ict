const mongoose = require('mongoose');

async function clean() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
  const res = await mongoose.connection.collection('students').deleteMany({
    emailOrNumber: { $in: ['01799887766', '01899999999'] }
  });
  console.log('Deleted count:', res.deletedCount);
  await mongoose.disconnect();
}
clean();
