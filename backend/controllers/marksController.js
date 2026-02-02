const Marks = require('../models/Marks');

// @desc    Get student's internal marks
// @route   GET /api/student/marks/internal
// @access  Private (Student)
exports.getMyInternalMarks = async (req, res) => {
  try {
    const studentId = req.user.id;

    const marks = await Marks.find({ student: studentId })
      .select('subject subjectCode semester internalMarks credits')
      .sort({ semester: 1 });

    if (!marks.length) {
      return res.status(404).json({
        success: false,
        message: 'No internal marks found',
      });
    }

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get student's semester results
// @route   GET /api/student/marks/semester
// @access  Private (Student)
exports.getMySemesterResults = async (req, res) => {
  try {
    const studentId = req.user.id;

    const results = await Marks.find({ student: studentId })
      .select('subject subjectCode semester semesterMarks credits academicYear')
      .sort({ semester: 1 });

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: 'No semester results found',
      });
    }

    // Calculate semester-wise GPA
    const semesterWiseResults = {};

    results.forEach((result) => {
      const sem = result.semester;

      if (!semesterWiseResults[sem]) {
        semesterWiseResults[sem] = {
          semester: sem,
          academicYear: result.academicYear,
          subjects: [],
          totalCredits: 0,
          earnedCredits: 0,
          gpa: 0,
        };
      }

      semesterWiseResults[sem].subjects.push({
        subject: result.subject,
        subjectCode: result.subjectCode,
        grade: result.semesterMarks.grade,
        gradePoint: result.semesterMarks.gradePoint,
        credits: result.credits,
        result: result.semesterMarks.result,
      });

      semesterWiseResults[sem].totalCredits += result.credits;

      if (result.semesterMarks.result === 'Pass') {
        semesterWiseResults[sem].earnedCredits += result.credits;
      }
    });

    // Calculate GPA for each semester
    Object.keys(semesterWiseResults).forEach((sem) => {
      const semData = semesterWiseResults[sem];
      let totalGradePoints = 0;

      semData.subjects.forEach((subject) => {
        totalGradePoints += subject.gradePoint * subject.credits;
      });

      semData.gpa = (totalGradePoints / semData.totalCredits).toFixed(2);
    });

    res.status(200).json({
      success: true,
      data: Object.values(semesterWiseResults),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get marks by semester
// @route   GET /api/student/marks/semester/:semester
// @access  Private (Student)
exports.getMarksBySemester = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { semester } = req.params;

    const marks = await Marks.find({
      student: studentId,
      semester: parseInt(semester),
    }).sort({ subjectCode: 1 });

    if (!marks.length) {
      return res.status(404).json({
        success: false,
        message: `No marks found for semester ${semester}`,
      });
    }

    res.status(200).json({
      success: true,
      semester: parseInt(semester),
      count: marks.length,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};