const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// @desc    Get all students in faculty's department
// @route   GET /api/faculty/students
// @access  Faculty
exports.getStudents = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id);

    const students = await User.find({
      role: 'student',
      department: faculty.department,
    }).select('-password').sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('❌ Error in getStudents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subjects assigned to faculty
// @route   GET /api/faculty/subjects
// @access  Faculty
exports.getMySubjects = async (req, res) => {
  try {
    const subjects = [
      { name: 'Data Structures & Algorithms', code: 'CS301', credits: 4 },
      { name: 'Web Development', code: 'CS302', credits: 3 },
      { name: 'Database Management Systems', code: 'CS303', credits: 4 },
      { name: 'Operating Systems', code: 'CS304', credits: 3 },
      { name: 'Computer Networks', code: 'CS305', credits: 3 },
      { name: 'Software Engineering', code: 'CS306', credits: 3 },
    ];

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error('❌ Error in getMySubjects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance for students
// @route   POST /api/faculty/attendance
// @access  Faculty
exports.markAttendance = async (req, res) => {
  try {
    const { subjectCode, subjectName, date, attendanceList } = req.body;

    if (!subjectCode || !date || !attendanceList) {
      console.log('❌ Validation failed:', { subjectCode, date, attendanceList });
      return res.status(400).json({
        success: false,
        message: 'Please provide subjectCode, date, and attendanceList',
      });
    }

    if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'attendanceList must be a non-empty array',
      });
    }

    console.log('📝 Marking attendance:', {
      subjectCode,
      subjectName,
      date,
      studentsCount: attendanceList.length,
      facultyId: req.user.id,
    });

    const records = [];
    const errors = [];

    for (const item of attendanceList) {
      try {
        if (!item.studentId) {
          errors.push({ error: 'Missing studentId', item });
          continue;
        }

        // ✅ FIX - Get student's actual semester from DB
        const studentData = await User.findById(item.studentId).select('semester');
        const studentSemester = studentData?.semester || 6;

        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(0, 0, 0, 0);

        console.log(`   Processing student: ${item.studentId}, status: ${item.status}, semester: ${studentSemester}`);

        const existing = await Attendance.findOne({
          student: item.studentId,
          subjectCode: subjectCode,
          date: attendanceDate,
        });

        if (existing) {
          existing.status = item.status;
          existing.markedBy = req.user.id;
          existing.subject = subjectName || existing.subject;
          existing.semester = studentSemester; // ✅ FIX - update semester too
          await existing.save();

          console.log(`   ✅ Updated attendance for student ${item.studentId}`);
          records.push({ studentId: item.studentId, action: 'updated', status: item.status });
        } else {
          await Attendance.create({
            student: item.studentId,
            subject: subjectName,
            subjectCode: subjectCode,
            date: attendanceDate,
            status: item.status,
            session: 'Full Day',
            semester: studentSemester, // ✅ FIX - use real semester
            academicYear: '2025-2026',
            markedBy: req.user.id,
          });

          console.log(`   ✅ Created attendance for student ${item.studentId}`);
          records.push({ studentId: item.studentId, action: 'created', status: item.status });
        }
      } catch (itemError) {
        console.error(`   ❌ Error processing student ${item.studentId}:`, itemError);
        errors.push({ studentId: item.studentId, error: itemError.message });
      }
    }

    const response = {
      success: true,
      message: 'Attendance marked successfully!',
      summary: {
        total: attendanceList.length,
        processed: records.length,
        failed: errors.length,
        created: records.filter((r) => r.action === 'created').length,
        updated: records.filter((r) => r.action === 'updated').length,
      },
      data: records,
    };

    if (errors.length > 0) {
      response.errors = errors;
      response.message = `Attendance marked with ${errors.length} error(s)`;
    }

    console.log('✅ Attendance marking complete:', response.summary);

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error in markAttendance:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get attendance for a specific subject
// @route   GET /api/faculty/attendance/:subjectCode
// @access  Faculty
exports.getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const { date } = req.query;

    let query = { subjectCode };

    if (date) {
      const queryDate = new Date(date);
      queryDate.setUTCHours(0, 0, 0, 0);
      query.date = queryDate;
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name userId rollNumber')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error('❌ Error in getAttendanceBySubject:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enter marks for students
// @route   POST /api/faculty/marks
// @access  Faculty
exports.enterMarks = async (req, res) => {
  try {
    const { subjectCode, subjectName, marksList } = req.body;

    if (!subjectCode || !marksList) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subjectCode and marksList',
      });
    }

    console.log('📊 Entering marks:', {
      subjectCode,
      subjectName,
      studentsCount: marksList.length,
    });

    const records = [];
    const errors = [];

    for (const item of marksList) {
      try {
        // ✅ FIX - Get student's actual semester
        const studentData = await User.findById(item.studentId).select('semester');
        const studentSemester = studentData?.semester || 6;

        const cia1 = Math.min(Math.max(item.cia1 || 0, 0), 20);
        const cia2 = Math.min(Math.max(item.cia2 || 0, 0), 20);
        const cia3 = Math.min(Math.max(item.cia3 || 0, 0), 20);
        const assignment = Math.min(Math.max(item.assignment || 0, 0), 10);
        const totalInternal = cia1 + cia2 + cia3 + assignment;

        const existing = await Marks.findOne({
          student: item.studentId,
          subjectCode: subjectCode,
          semester: studentSemester, // ✅ FIX - use real semester
        });

        if (existing) {
          existing.internalMarks.cia1 = cia1;
          existing.internalMarks.cia2 = cia2;
          existing.internalMarks.cia3 = cia3;
          existing.internalMarks.assignment = assignment;
          existing.internalMarks.totalInternal = totalInternal;
          existing.subject = subjectName || existing.subject;
          await existing.save();

          console.log(`   ✅ Updated marks for student ${item.studentId}`);
          records.push({ studentId: item.studentId, action: 'updated' });
        } else {
          await Marks.create({
            student: item.studentId,
            subject: subjectName,
            subjectCode: subjectCode,
            semester: studentSemester, // ✅ FIX - use real semester
            academicYear: '2025-2026',
            internalMarks: {
              cia1,
              cia2,
              cia3,
              assignment,
              totalInternal,
            },
            semesterMarks: {
              theoryMarks: 0,
              grade: 'N/A',
              gradePoint: 0,
              result: 'Pending',
            },
            credits: 3,
          });

          console.log(`   ✅ Created marks for student ${item.studentId}`);
          records.push({ studentId: item.studentId, action: 'created' });
        }
      } catch (itemError) {
        console.error(`   ❌ Error processing marks for student ${item.studentId}:`, itemError);
        errors.push({ studentId: item.studentId, error: itemError.message });
      }
    }

    const response = {
      success: true,
      message: 'Marks entered successfully!',
      summary: {
        total: marksList.length,
        processed: records.length,
        failed: errors.length,
      },
      data: records,
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    console.log('✅ Marks entry complete:', response.summary);

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error in enterMarks:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get marks for a specific subject
// @route   GET /api/faculty/marks/:subjectCode
// @access  Faculty
exports.getMarksBySubject = async (req, res) => {
  try {
    const { subjectCode } = req.params;

    const marks = await Marks.find({
      subjectCode,
    }).populate('student', 'name userId rollNumber'); // ✅ FIX - removed hardcoded semester filter

    console.log(`✅ Found ${marks.length} marks records`);

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks,
    });
  } catch (error) {
    console.error('❌ Error in getMarksBySubject:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};