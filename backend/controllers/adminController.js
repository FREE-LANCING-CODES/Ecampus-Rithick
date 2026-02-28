const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// Get stats
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const activeFaculty = await User.countDocuments({ role: 'faculty', isActive: true });
    
    const studentsByYear = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        activeStudents,
        activeFaculty,
        studentsByYear,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add student
exports.addStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      role: 'student',
    };

    const student = await User.create(studentData);

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await Attendance.deleteMany({ student: req.params.id });
    await Marks.deleteMany({ student: req.params.id });
    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW - Reset student/faculty password
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters',
      });
    }

    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = newPassword;
    await user.save(); // pre('save') hook auto encrypt pannudum

    console.log(`✅ Password reset for user: ${user.userId}`);

    res.status(200).json({
      success: true,
      message: `Password reset successfully for ${user.name}`,
    });
  } catch (error) {
    console.error('❌ Error in resetPassword:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('-password')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add faculty
exports.addFaculty = async (req, res) => {
  try {
    const facultyData = {
      ...req.body,
      role: 'faculty',
    };

    const faculty = await User.create(facultyData);

    res.status(201).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await User.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    await faculty.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};