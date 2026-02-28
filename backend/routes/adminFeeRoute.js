const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllStudentFees,
  getFeeStatistics,
  createOrUpdateFee,
  addPayment
} = require('../controllers/adminFeeControllers');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllStudentFees);
router.get('/statistics', getFeeStatistics);
router.post('/', createOrUpdateFee);
router.post('/payment', addPayment);

module.exports = router;