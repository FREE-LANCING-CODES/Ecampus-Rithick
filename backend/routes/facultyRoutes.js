const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const facultyController = require('../controllers/facultyController');

// All faculty routes are protected
router.use(protect);
router.use(authorize('faculty'));

// Get all students
router.get('/students', facultyController.getStudents);

// Get my subjects
router.get('/subjects', facultyController.getMySubjects);

// Mark attendance
router.post('/attendance', facultyController.markAttendance);

// Get attendance for a subject
router.get('/attendance/:subjectCode', facultyController.getAttendanceBySubject);

// Enter marks
router.post('/marks', facultyController.enterMarks);

// Get marks for a subject
router.get('/marks/:subjectCode', facultyController.getMarksBySubject);

module.exports = router;