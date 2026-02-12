const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const deleteDummyFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete FAC001, FAC002, FAC003
    const result = await User.deleteMany({
      role: 'faculty',
      userId: { $in: ['FAC001', 'FAC002', 'FAC003'] }
    });

    console.log(`✅ Deleted ${result.deletedCount} dummy faculty!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteDummyFaculty();