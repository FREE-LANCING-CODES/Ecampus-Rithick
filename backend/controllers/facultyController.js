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
      return res.status(400).json({
        success: false,
        message: 'Please provide subjectCode, date, and attendanceList',
      });
    }

    const records = [];

    for (const item of attendanceList) {
      // Check if attendance already exists for this student, subject, date
      const existing = await Attendance.findOne({
        student: item.studentId,
        subjectCode: subjectCode,
        date: new Date(date),
      });

      if (existing) {
        // Update existing
        existing.status = item.status;
        existing.markedBy = req.user.id;
        await existing.save();
        records.push({ studentId: item.studentId, action: 'updated' });
      } else {
        // Create new
        const newRecord = await Attendance.create({
          student: item.studentId,
          subject: subjectName,
          subjectCode: subjectCode,
          date: new Date(date),
          status: item.status,
          session: 'Full Day',
          semester: 6,
          academicYear: '2025-2026',
          markedBy: req.user.id,
        });
        records.push({ studentId: item.studentId, action: 'created' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully!',
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      query.date = new Date(date);
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name userId rollNumber')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
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

    const records = [];

    for (const item of marksList) {
      // Validate marks
      const cia1 = Math.min(Math.max(item.cia1 || 0, 0), 20);
      const cia2 = Math.min(Math.max(item.cia2 || 0, 0), 20);
      const cia3 = Math.min(Math.max(item.cia3 || 0, 0), 20);
      const assignment = Math.min(Math.max(item.assignment || 0, 0), 10);
      const totalInternal = cia1 + cia2 + cia3 + assignment;

      const existing = await Marks.findOne({
        student: item.studentId,
        subjectCode: subjectCode,
        semester: 6,
      });

      if (existing) {
        // Update existing marks
        existing.internalMarks.cia1 = cia1;
        existing.internalMarks.cia2 = cia2;
        existing.internalMarks.cia3 = cia3;
        existing.internalMarks.assignment = assignment;
        existing.internalMarks.totalInternal = totalInternal;

        await existing.save();
        records.push({ studentId: item.studentId, action: 'updated' });
      } else {
        // Create new marks record
        await Marks.create({
          student: item.studentId,
          subject: subjectName,
          subjectCode: subjectCode,
          semester: 6,
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
        records.push({ studentId: item.studentId, action: 'created' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Marks entered successfully!',
      data: records,
    });
  } catch (error) {
    console.error('❌ Error in enterMarks:', error); // Log for debugging
    res.status(500).json({ success: false, message: error.message });
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
      semester: 6,
    }).populate('student', 'name userId rollNumber');

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};