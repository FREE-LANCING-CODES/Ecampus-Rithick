const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const seedFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected!');

    // Delete existing faculty only
    await User.deleteMany({ role: 'faculty' });
    console.log('🗑️  Cleared old faculty data');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('faculty123', salt);

    const facultyList = [
      {
        userId: 'FAC001',
        password: hashedPassword,
        role: 'faculty',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        phone: '9876543301',
        gender: 'Male',
        isActive: true,
      },
      {
        userId: 'FAC002',
        password: hashedPassword,
        role: 'faculty',
        name: 'Prof. Priya Sharma',
        email: 'priya.sharma@ecampus.com',
        department: 'B.Sc Computer Science',
        phone: '9876543302',
        gender: 'Female',
        isActive: true,
      },
      {
        userId: 'FAC003',
        password: hashedPassword,
        role: 'faculty',
        name: 'Dr. Arun Patel',
        email: 'arun.patel@ecampus.com',
        department: 'B.Sc Computer Science',
        phone: '9876543303',
        gender: 'Male',
        isActive: true,
      },
    ];

    await User.collection.insertMany(facultyList);
    console.log('✅ Created 3 faculty members!\n');

    console.log('🎉 FACULTY CREATED:\n');
    facultyList.forEach((f, i) => {
      console.log(`${i + 1}. ${f.name}`);
      console.log(`   User ID: ${f.userId}`);
      console.log(`   Password: faculty123\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedFaculty();