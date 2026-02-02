const express = require('express');
const {
  getMyAttendance,
  getAttendanceBySubject,
} = require('../controllers/attendanceController');
const {
  getMyInternalMarks,
  getMySemesterResults,
  getMarksBySemester,
} = require('../controllers/marksController');
const {
  getMyFeeDetails,
  getFeesBySemester,
  getMyTransactions,
} = require('../controllers/feeController');
const {
  getMyTimetable,
  getTimetableByDay,
  getTodaySchedule,
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication & student authorization to all routes
router.use(protect);
router.use(authorize('student'));

// ============ ATTENDANCE ROUTES ============
router.get('/attendance', getMyAttendance);
router.get('/attendance/:subjectCode', getAttendanceBySubject);

// ============ MARKS ROUTES ============
router.get('/marks/internal', getMyInternalMarks);
router.get('/marks/semester', getMySemesterResults);
router.get('/marks/semester/:semester', getMarksBySemester);

// ============ FEE ROUTES ============
router.get('/fees', getMyFeeDetails);
router.get('/fees/:semester', getFeesBySemester);
router.get('/fees/transactions', getMyTransactions);

// ============ TIMETABLE ROUTES ============
router.get('/timetable', getMyTimetable);
router.get('/timetable/today', getTodaySchedule);
router.get('/timetable/:day', getTimetableByDay);

module.exports = router;