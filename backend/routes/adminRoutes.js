const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getAllFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  resetPassword, // ✅ NEW
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Stats
router.get('/stats', getStats);

// Students
router.get('/students', getAllStudents);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// ✅ NEW - Reset Password
router.put('/reset-password/:id', resetPassword);

// Faculty
router.get('/faculty', getAllFaculty);
router.post('/faculty', addFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

module.exports = router;