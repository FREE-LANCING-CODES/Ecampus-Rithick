const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const seedRealStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected!');

    await User.deleteMany({});
    console.log('🗑️  Cleared all old data');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('student123', salt);

    const students = [
      {
        userId: 'BSC2022001',
        password: hashedPassword,
        role: 'student',
        name: 'Arun',
        email: 'arun.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C001',
        phone: '9876543201',
        gender: 'Male',
        bloodGroup: 'O+',
        dateOfBirth: new Date('2004-05-15'),
        isActive: true,
      },
      {
        userId: 'BSC2022002',
        password: hashedPassword,
        role: 'student',
        name: 'Ganesh',
        email: 'ganesh.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C002',
        phone: '9876543202',
        gender: 'Male',
        bloodGroup: 'A+',
        dateOfBirth: new Date('2004-03-22'),
        isActive: true,
      },
      {
        userId: 'BSC2022003',
        password: hashedPassword,
        role: 'student',
        name: 'Rithick',
        email: 'rithick.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C003',
        phone: '9876543203',
        gender: 'Male',
        bloodGroup: 'B+',
        dateOfBirth: new Date('2004-07-10'),
        isActive: true,
      },
      {
        userId: 'BSC2022004',
        password: hashedPassword,
        role: 'student',
        name: 'Paramesh',
        email: 'paramesh.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C004',
        phone: '9876543204',
        gender: 'Male',
        bloodGroup: 'O-',
        dateOfBirth: new Date('2004-01-18'),
        isActive: true,
      },
      {
        userId: 'BSC2022005',
        password: hashedPassword,
        role: 'student',
        name: 'Nivedh Shivan',
        email: 'nivedh.shivan@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C005',
        phone: '9876543205',
        gender: 'Male',
        bloodGroup: 'AB+',
        dateOfBirth: new Date('2004-09-25'),
        isActive: true,
      },
      {
        userId: 'BSC2022006',
        password: hashedPassword,
        role: 'student',
        name: 'Puhal',
        email: 'puhal.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C006',
        phone: '9876543206',
        gender: 'Male',
        bloodGroup: 'A-',
        dateOfBirth: new Date('2004-11-30'),
        isActive: true,
      },
      {
        userId: 'BSC2022007',
        password: hashedPassword,
        role: 'student',
        name: 'Vicky',
        email: 'vicky.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C007',
        phone: '9876543207',
        gender: 'Male',
        bloodGroup: 'O+',
        dateOfBirth: new Date('2004-02-14'),
        isActive: true,
      },
      {
        userId: 'BSC2022008',
        password: hashedPassword,
        role: 'student',
        name: 'Riyas',
        email: 'riyas.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C008',
        phone: '9876543208',
        gender: 'Male',
        bloodGroup: 'B-',
        dateOfBirth: new Date('2004-06-08'),
        isActive: true,
      },
      {
        userId: 'BSC2022009',
        password: hashedPassword,
        role: 'student',
        name: 'Siva',
        email: 'siva.kumar@ecampus.com',
        department: 'B.Sc Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS22C009',
        phone: '9876543209',
        gender: 'Male',
        bloodGroup: 'AB-',
        dateOfBirth: new Date('2004-12-05'),
        isActive: true,
      },
    ];

    await User.collection.insertMany(students);
    console.log('✅ Created 9 students with unique details!\n');

    console.log('🎉 STUDENTS CREATED:\n');
    students.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   User ID: ${s.userId}`);
      console.log(`   Roll: ${s.rollNumber}`);
      console.log(`   Blood Group: ${s.bloodGroup}`);
      console.log(`   DOB: ${s.dateOfBirth.toLocaleDateString()}`);
      console.log(`   Phone: ${s.phone}\n`);
    });

    console.log('All passwords: student123\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedRealStudents();