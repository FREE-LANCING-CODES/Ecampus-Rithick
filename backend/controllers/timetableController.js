const Timetable = require('../models/Timetable');

// @desc    Get student's timetable
// @route   GET /api/student/timetable
// @access  Private (Student)
exports.getMyTimetable = async (req, res) => {
  try {
    const student = req.user;

    // Find timetable based on student's department, year, semester
    const timetable = await Timetable.findOne({
      department: student.department,
      year: student.year,
      semester: student.semester,
      isActive: true,
    }).populate('schedule.periods.faculty', 'name email');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found for your class',
      });
    }

    res.status(200).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get timetable for specific day
// @route   GET /api/student/timetable/:day
// @access  Private (Student)
exports.getTimetableByDay = async (req, res) => {
  try {
    const student = req.user;
    const { day } = req.params;

    // Validate day
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    if (!validDays.includes(dayCapitalized)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day. Use: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
      });
    }

    const timetable = await Timetable.findOne({
      department: student.department,
      year: student.year,
      semester: student.semester,
      isActive: true,
    }).populate('schedule.periods.faculty', 'name email');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found',
      });
    }

    // Filter for specific day
    const daySchedule = timetable.schedule.find((s) => s.day === dayCapitalized);

    if (!daySchedule) {
      return res.status(404).json({
        success: false,
        message: `No schedule found for ${dayCapitalized}`,
      });
    }

    res.status(200).json({
      success: true,
      day: dayCapitalized,
      data: daySchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get today's schedule
// @route   GET /api/student/timetable/today
// @access  Private (Student)
exports.getTodaySchedule = async (req, res) => {
  try {
    const student = req.user;

    // Get today's day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    // Sunday check
    if (today === 'Sunday') {
      return res.status(200).json({
        success: true,
        message: 'Today is Sunday - Holiday!',
        data: null,
      });
    }

    const timetable = await Timetable.findOne({
      department: student.department,
      year: student.year,
      semester: student.semester,
      isActive: true,
    }).populate('schedule.periods.faculty', 'name email');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found',
      });
    }

    const todaySchedule = timetable.schedule.find((s) => s.day === today);

    res.status(200).json({
      success: true,
      today: today,
      data: todaySchedule || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};