const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Marks = require('../models/Marks');
const User = require('../models/User'); // Add this line

dotenv.config();

const checkMarks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const marks = await Marks.find()
      .populate('student', 'name userId')
      .sort({ updatedAt: -1 })
      .limit(5);
    
    console.log('\n📊 Latest 5 Marks (Recently Updated):\n');
    
    marks.forEach((mark) => {
      console.log(`${mark.student.name} (${mark.student.userId})`);
      console.log(`  Subject: ${mark.subject} (${mark.subjectCode})`);
      console.log(`  CIA1: ${mark.internalMarks.cia1}, CIA2: ${mark.internalMarks.cia2}, CIA3: ${mark.internalMarks.cia3}`);
      console.log(`  Assignment: ${mark.internalMarks.assignment}`);
      console.log(`  Total: ${mark.internalMarks.totalInternal}`);
      console.log(`  Updated: ${mark.updatedAt}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkMarks();