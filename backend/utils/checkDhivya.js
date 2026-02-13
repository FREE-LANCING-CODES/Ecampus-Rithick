const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const checkDhivya = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    const dhivya = await User.findOne({ userId: 'dhivya476' }).select('+password');
    
    if (!dhivya) {
      console.log('❌ Dhivya not found!');
    } else {
      console.log('✅ Found Dhivya!');
      console.log('User ID:', dhivya.userId);
      console.log('Role:', dhivya.role);
      console.log('Email:', dhivya.email);
      console.log('Password (hashed):', dhivya.password);
      console.log('Name:', dhivya.name);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkDhivya();