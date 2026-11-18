const mongoose = require('mongoose');
const fs = require('fs');

async function exportStudents() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ict_easy_learning');
  const students = await mongoose.connection.collection('students').find({}).toArray();
  fs.writeFileSync('database/students.json', JSON.stringify(students, null, 2), 'utf8');
  console.log('Exported', students.length, 'students to database/students.json');
  await mongoose.disconnect();
}
exportStudents();
