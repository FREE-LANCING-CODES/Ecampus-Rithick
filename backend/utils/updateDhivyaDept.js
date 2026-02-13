const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const updateDhivya = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    const dhivya = await User.findOneAndUpdate(
      { userId: 'dhivya476' },
      { department: 'B.Sc Computer Science' },
      { new: true }
    );

    if (dhivya) {
      console.log('✅ Dhivya updated!');
      console.log('New Department:', dhivya.department);
    } else {
      console.log('❌ Dhivya not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateDhivya();