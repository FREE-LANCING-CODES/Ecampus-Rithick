const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const FeeDetails = require('../models/FeeDetails');

const resetFees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Delete ALL fee records
    const deleted = await FeeDetails.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.deletedCount} fee records`);

    console.log('✅ Done! Now go to Admin → Manage Fees → Add Fee fresh for each student');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetFees();