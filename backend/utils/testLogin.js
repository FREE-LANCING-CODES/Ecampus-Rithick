const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Find Dhivya
    const dhivya = await User.findOne({ userId: 'dhivya476' }).select('+password');
    
    if (!dhivya) {
      console.log('❌ Dhivya NOT found in database!');
      process.exit(1);
    }

    console.log('✅ Dhivya found!');
    console.log('User ID:', dhivya.userId);
    console.log('Role:', dhivya.role);
    console.log('Name:', dhivya.name);
    console.log('Email:', dhivya.email);
    console.log('Password Hash:', dhivya.password);

    // Test password
    const password = 'dhivyazhini';
    const isMatch = await bcrypt.compare(password, dhivya.password);
    
    console.log('\n🔑 Password Test:');
    console.log('Testing password:', password);
    console.log('Match:', isMatch ? '✅ YES' : '❌ NO');

    if (!isMatch) {
      console.log('\n⚠️ PASSWORD MISMATCH!');
      console.log('Try these passwords:');
      console.log('- dhivyazhini');
      console.log('- dhivya476');
      console.log('- faculty123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogin();