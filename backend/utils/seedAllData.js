const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const FeeDetails = require('../models/FeeDetails');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

dotenv.config();

const seedAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected!');

    // Clear old data
    await Attendance.deleteMany({});
    await Marks.deleteMany({});
    await Timetable.deleteMany({});
    try {
      const FeeDetailsModel = mongoose.model('FeeDetails');
      await FeeDetailsModel.deleteMany({});
    } catch (err) {
      console.log('⚠️  FeeDetails clear skipped');
    }
    console.log('🗑️  Cleared old data');

    // Get all students
    const students = await User.find({ role: 'student' });
    console.log(`👥 Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('❌ No students found! Run seedRealStudents.js first!');
      process.exit(1);
    }

    // ========== SUBJECTS ==========
    const subjects = [
      { name: 'Data Structures & Algorithms', code: 'CS301', credits: 4 },
      { name: 'Web Development', code: 'CS302', credits: 3 },
      { name: 'Database Management Systems', code: 'CS303', credits: 4 },
      { name: 'Operating Systems', code: 'CS304', credits: 3 },
      { name: 'Computer Networks', code: 'CS305', credits: 3 },
      { name: 'Software Engineering', code: 'CS306', credits: 3 },
    ];

    // ========== ATTENDANCE DATA ==========
    console.log('📅 Adding Attendance data...');
    const attendanceRecords = [];
    const startDate = new Date('2025-08-01');

    students.forEach((student) => {
      // Each student different attendance percentage
      const attendanceRate = 0.75 + Math.random() * 0.2; // 75% to 95%

      subjects.forEach((subject) => {
        const totalClasses = 35 + Math.floor(Math.random() * 10); // 35-45 classes

        for (let i = 0; i < totalClasses; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i * 2);

          // Skip sundays
          if (date.getDay() === 0) {
            date.setDate(date.getDate() + 1);
          }

          let status;
          const rand = Math.random();
          if (rand < attendanceRate) {
            status = 'Present';
          } else if (rand < attendanceRate + 0.05) {
            status = 'Late';
          } else {
            status = 'Absent';
          }

          attendanceRecords.push({
            student: student._id,
            subject: subject.name,
            subjectCode: subject.code,
            date: date,
            status: status,
            session: 'Full Day',
            semester: 6,
            academicYear: '2025-2026',
            markedBy: null,
          });
        }
      });
    });

    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Attendance added: ${attendanceRecords.length} records`);

    // ========== MARKS DATA ==========
    console.log('📝 Adding Marks data...');
    const marksRecords = [];

    students.forEach((student) => {
      subjects.forEach((subject) => {
        // Random but realistic marks
       // Random but realistic marks (total must be <= 50)
        const cia1 = Math.floor(Math.random() * 6) + 10; // 10-16
        const cia2 = Math.floor(Math.random() * 6) + 10; // 10-16
        const cia3 = Math.floor(Math.random() * 6) + 10; // 10-16
        const assignment = Math.floor(Math.random() * 3) + 5; // 5-7
        const theoryMarks = Math.floor(Math.random() * 25) + 65; // 65-90

        // Grade calculation
        let grade, gradePoint;
        if (theoryMarks >= 90) { grade = 'O'; gradePoint = 10; }
        else if (theoryMarks >= 80) { grade = 'A+'; gradePoint = 9; }
        else if (theoryMarks >= 70) { grade = 'A'; gradePoint = 8; }
        else if (theoryMarks >= 60) { grade = 'B+'; gradePoint = 7; }
        else if (theoryMarks >= 55) { grade = 'B'; gradePoint = 6; }
        else if (theoryMarks >= 50) { grade = 'C'; gradePoint = 5; }
        else { grade = 'F'; gradePoint = 0; }

        marksRecords.push({
          student: student._id,
          subject: subject.name,
          subjectCode: subject.code,
          semester: 6,
          academicYear: '2025-2026',
          internalMarks: {
            cia1: cia1,
            cia2: cia2,
            cia3: cia3,
            assignment: assignment,
            totalInternal: cia1 + cia2 + cia3 + assignment,
          },
          semesterMarks: {
            theoryMarks: theoryMarks,
            grade: grade,
            gradePoint: gradePoint,
            result: theoryMarks >= 50 ? 'Pass' : 'Fail',
          },
          credits: subject.credits,
        });
      });
    });

    await Marks.insertMany(marksRecords);
    console.log(`✅ Marks added: ${marksRecords.length} records`);

    // ========== FEE DETAILS ==========
    console.log('💰 Adding Fee data...');
    const feeRecords = [];

    students.forEach((student) => {
      // Each student different payment status
      const totalFee = 80000;
      const paidOptions = [80000, 60000, 50000, 40000, 30000];
      const amountPaid = paidOptions[Math.floor(Math.random() * paidOptions.length)];
      const amountPending = totalFee - amountPaid;

      let paymentStatus;
      if (amountPending === 0) paymentStatus = 'Paid';
      else if (amountPaid > 0) paymentStatus = 'Partial';
      else paymentStatus = 'Pending';

      // Generate transactions
      const transactions = [];
      let remaining = amountPaid;
      let txnNum = 1;

      while (remaining > 0) {
        const txnAmount = remaining >= 30000 ? 30000 : remaining;
        transactions.push({
          transactionId: `TXN${student.userId.slice(-3)}00${txnNum}`,
          amount: txnAmount,
          paymentMode: txnNum === 1 ? 'Online' : 'Card',
          paymentDate: new Date(`2025-08-${10 + txnNum * 5}`),
          receiptNumber: `REC${student.userId.slice(-3)}00${txnNum}`,
        });
        remaining -= txnAmount;
        txnNum++;
      }

      feeRecords.push({
        student: student._id,
        academicYear: '2025-2026',
        semester: 6,
        feeStructure: {
          tuitionFee: 50000,
          examFee: 5000,
          libraryFee: 2000,
          labFee: 8000,
          sportsFee: 3000,
          hostelFee: 0,
          busFee: 10000,
          otherFees: 2000,
          totalFee: totalFee,
        },
        paymentDetails: {
          amountPaid: amountPaid,
          amountPending: amountPending,
          paymentStatus: paymentStatus,
          lastPaymentDate: transactions.length > 0 ? transactions[transactions.length - 1].paymentDate : null,
          dueDate: new Date('2026-02-28'),
        },
        transactions: transactions,
        concession: 0,
      });
    });

    await FeeDetails.create(feeRecords[0]);
    for (let i = 1; i < feeRecords.length; i++) {
      await FeeDetails.create(feeRecords[i]);
    }
    console.log(`✅ Fee details added: ${feeRecords.length} records`);

    // ========== TIMETABLE DATA ==========
    console.log('📓 Adding Timetable data...');

    const timetableData = {
      department: 'B.Sc Computer Science',
      year: 3,
      semester: 6,
      section: 'C',
      academicYear: '2025-2026',
      schedule: [
        {
          day: 'Monday',
          periods: [
            { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Data Structures & Algorithms', subjectCode: 'CS301', facultyName: 'Dr. Rajesh Kumar', roomNumber: 'Room 301', type: 'Theory' },
            { periodNumber: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Web Development', subjectCode: 'CS302', facultyName: 'Prof. Priya Sharma', roomNumber: 'Lab 201', type: 'Lab' },
            { periodNumber: 3, startTime: '11:00 AM', endTime: '11:15 AM', subject: 'Break', subjectCode: '-', type: 'Break' },
            { periodNumber: 4, startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Database Management Systems', subjectCode: 'CS303', facultyName: 'Dr. Arun Patel', roomNumber: 'Room 302', type: 'Theory' },
            { periodNumber: 5, startTime: '12:15 PM', endTime: '01:15 PM', subject: 'Operating Systems', subjectCode: 'CS304', facultyName: 'Prof. Meena Iyer', roomNumber: 'Room 303', type: 'Theory' },
          ],
        },
        {
          day: 'Tuesday',
          periods: [
            { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Computer Networks', subjectCode: 'CS305', facultyName: 'Dr. Suresh Reddy', roomNumber: 'Room 304', type: 'Theory' },
            { periodNumber: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Software Engineering', subjectCode: 'CS306', facultyName: 'Prof. Anitha Krishnan', roomNumber: 'Room 305', type: 'Theory' },
            { periodNumber: 3, startTime: '11:00 AM', endTime: '11:15 AM', subject: 'Break', subjectCode: '-', type: 'Break' },
            { periodNumber: 4, startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Data Structures Lab', subjectCode: 'CS301', facultyName: 'Dr. Rajesh Kumar', roomNumber: 'Lab 301', type: 'Lab' },
          ],
        },
        {
          day: 'Wednesday',
          periods: [
            { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Database Management Systems', subjectCode: 'CS303', facultyName: 'Dr. Arun Patel', roomNumber: 'Lab 202', type: 'Lab' },
            { periodNumber: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Web Development', subjectCode: 'CS302', facultyName: 'Prof. Priya Sharma', roomNumber: 'Room 301', type: 'Theory' },
            { periodNumber: 3, startTime: '11:00 AM', endTime: '11:15 AM', subject: 'Break', subjectCode: '-', type: 'Break' },
            { periodNumber: 4, startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Operating Systems', subjectCode: 'CS304', facultyName: 'Prof. Meena Iyer', roomNumber: 'Room 303', type: 'Theory' },
          ],
        },
        {
          day: 'Thursday',
          periods: [
            { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Computer Networks', subjectCode: 'CS305', facultyName: 'Dr. Suresh Reddy', roomNumber: 'Room 304', type: 'Theory' },
            { periodNumber: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Data Structures & Algorithms', subjectCode: 'CS301', facultyName: 'Dr. Rajesh Kumar', roomNumber: 'Room 301', type: 'Tutorial' },
            { periodNumber: 3, startTime: '11:00 AM', endTime: '11:15 AM', subject: 'Break', subjectCode: '-', type: 'Break' },
            { periodNumber: 4, startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Software Engineering', subjectCode: 'CS306', facultyName: 'Prof. Anitha Krishnan', roomNumber: 'Room 305', type: 'Theory' },
          ],
        },
        {
          day: 'Friday',
          periods: [
            { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Operating Systems Lab', subjectCode: 'CS304', facultyName: 'Prof. Meena Iyer', roomNumber: 'Lab 303', type: 'Lab' },
            { periodNumber: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Web Development', subjectCode: 'CS302', facultyName: 'Prof. Priya Sharma', roomNumber: 'Lab 201', type: 'Lab' },
            { periodNumber: 3, startTime: '11:00 AM', endTime: '11:15 AM', subject: 'Break', subjectCode: '-', type: 'Break' },
            { periodNumber: 4, startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Database Management Systems', subjectCode: 'CS303', facultyName: 'Dr. Arun Patel', roomNumber: 'Room 302', type: 'Theory' },
          ],
        },
        {
          day: 'Saturday',
          periods: [
            { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Computer Networks Lab', subjectCode: 'CS305', facultyName: 'Dr. Suresh Reddy', roomNumber: 'Lab 304', type: 'Lab' },
            { periodNumber: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Software Engineering', subjectCode: 'CS306', facultyName: 'Prof. Anitha Krishnan', roomNumber: 'Room 305', type: 'Tutorial' },
          ],
        },
      ],
      effectiveFrom: new Date('2025-08-01'),
      isActive: true,
    };

    await Timetable.create(timetableData);
    console.log('✅ Timetable added');

    // ========== SUMMARY ==========
    console.log('\n🎉🎉🎉 ALL DATA ADDED SUCCESSFULLY! 🎉🎉🎉\n');
    console.log('📊 Summary:');
    console.log(`   Students: ${students.length}`);
    console.log(`   Attendance Records: ${attendanceRecords.length}`);
    console.log(`   Marks Records: ${marksRecords.length}`);
    console.log(`   Fee Records: ${feeRecords.length}`);
    console.log(`   Timetable: 1 (shared)\n`);

    console.log('👤 Student Login Details:');
    students.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name} → ${s.userId} / student123`);
    });

    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAllData();