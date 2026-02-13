const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const deleteDhivya = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    const result = await User.deleteOne({ userId: 'dhivya476' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Dhivya deleted!');
    } else {
      console.log('❌ Dhivya not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteDhivya();