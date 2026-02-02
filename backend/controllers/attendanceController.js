const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get student's attendance
// @route   GET /api/student/attendance
// @access  Private (Student)
exports.getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get all attendance records
    const attendance = await Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .populate('markedBy', 'name');

    // Calculate subject-wise attendance
    const subjectWiseAttendance = {};

    attendance.forEach((record) => {
      const subject = record.subjectCode;

      if (!subjectWiseAttendance[subject]) {
        subjectWiseAttendance[subject] = {
          subjectName: record.subject,
          subjectCode: record.subjectCode,
          totalClasses: 0,
          attended: 0,
          percentage: 0,
        };
      }

      subjectWiseAttendance[subject].totalClasses++;
      if (record.status === 'Present' || record.status === 'On Duty') {
        subjectWiseAttendance[subject].attended++;
      }
    });

    // Calculate percentages
    Object.keys(subjectWiseAttendance).forEach((subject) => {
      const data = subjectWiseAttendance[subject];
      data.percentage = ((data.attended / data.totalClasses) * 100).toFixed(2);
    });

    // Overall attendance
    const totalClasses = attendance.length;
    const totalAttended = attendance.filter(
      (record) => record.status === 'Present' || record.status === 'On Duty'
    ).length;
    const overallPercentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        overall: {
          totalClasses,
          attended: totalAttended,
          percentage: overallPercentage,
        },
        subjectWise: Object.values(subjectWiseAttendance),
        recentAttendance: attendance.slice(0, 10), // Last 10 records
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get attendance by subject
// @route   GET /api/student/attendance/:subjectCode
// @access  Private (Student)
exports.getAttendanceBySubject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectCode } = req.params;

    const attendance = await Attendance.find({
      student: studentId,
      subjectCode: subjectCode,
    })
      .sort({ date: -1 })
      .populate('markedBy', 'name');

    if (!attendance.length) {
      return res.status(404).json({
        success: false,
        message: 'No attendance records found for this subject',
      });
    }

    // Calculate statistics
    const totalClasses = attendance.length;
    const attended = attendance.filter(
      (record) => record.status === 'Present' || record.status === 'On Duty'
    ).length;
    const percentage = ((attended / totalClasses) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        subjectName: attendance[0].subject,
        subjectCode: attendance[0].subjectCode,
        statistics: {
          totalClasses,
          attended,
          percentage,
        },
        records: attendance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};