const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ userId: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      userId: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@ecampus.com',
      department: 'Administration',
      year: 1,
      semester: 1,
      isActive: true,
    });
    console.log('✅ Admin user created successfully!');
    console.log('📋 Login credentials:');
    console.log('   User ID: admin');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();