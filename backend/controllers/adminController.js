const User = require('../models/User');
const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');

// Get Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const activeFaculty = await User.countDocuments({ role: 'faculty', isActive: true });

    // Students by year
    const studentsByYear = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
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

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ name: 1 });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const student = await User.create({ ...req.body, role: 'student' });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Also delete related records
    await Marks.deleteMany({ student: req.params.id });
    await Attendance.deleteMany({ student: req.params.id });

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).sort({ name: 1 });
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Faculty
exports.addFaculty = async (req, res) => {
  try {
    const faculty = await User.create({ ...req.body, role: 'faculty' });
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Faculty
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await User.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};