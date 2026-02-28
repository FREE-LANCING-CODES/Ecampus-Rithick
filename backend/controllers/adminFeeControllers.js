const FeeDetails = require('../models/FeeDetails');
const User = require('../models/User');

const FIXED_SEMESTER_FEE = 40000; // ✅ Fixed fee for all semesters

// Get all student fees
exports.getAllStudentFees = async (req, res) => {
  try {
    const fees = await FeeDetails.find()
      .populate('student', 'name userId rollNumber department year semester')
      .sort({ semester: -1 });

    const stats = {
      totalCollected: 0,
      totalPending: 0,
      totalOverdue: 0,
      byStatus: { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 }
    };

    fees.forEach(fee => {
      stats.totalCollected += fee.paymentDetails.amountPaid;
      stats.totalPending += fee.paymentDetails.amountPending;
      if (fee.paymentDetails.paymentStatus === 'Overdue') {
        stats.totalOverdue += fee.paymentDetails.amountPending;
      }
      if (stats.byStatus[fee.paymentDetails.paymentStatus] !== undefined) {
        stats.byStatus[fee.paymentDetails.paymentStatus]++;
      }
    });

    res.status(200).json({
      success: true,
      count: fees.length,
      summary: stats,
      data: fees
    });
  } catch (error) {
    console.error('❌ Error in getAllStudentFees:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get fee statistics
exports.getFeeStatistics = async (req, res) => {
  try {
    const fees = await FeeDetails.find();

    const stats = {
      totalCollected: 0,
      totalPending: 0,
      totalOverdue: 0,
      byStatus: { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 }
    };

    fees.forEach(fee => {
      stats.totalCollected += fee.paymentDetails.amountPaid;
      stats.totalPending += fee.paymentDetails.amountPending;
      if (fee.paymentDetails.paymentStatus === 'Overdue') {
        stats.totalOverdue += fee.paymentDetails.amountPending;
      }
      if (stats.byStatus[fee.paymentDetails.paymentStatus] !== undefined) {
        stats.byStatus[fee.paymentDetails.paymentStatus]++;
      }
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ Error in getFeeStatistics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update fee
exports.createOrUpdateFee = async (req, res) => {
  try {
    const { studentId, semester, academicYear, examFee, dueDate } = req.body;

    if (!studentId || !semester || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, semester, and dueDate'
      });
    }

    // ✅ Fixed ₹40,000 + optional exam fee only
    const semesterFee = FIXED_SEMESTER_FEE;
    const examFeeAmount = parseFloat(examFee) || 0;
    const totalFee = semesterFee + examFeeAmount;

    const feeStructure = {
      tuitionFee: semesterFee,  // storing as tuitionFee in DB
      examFee: examFeeAmount,
      libraryFee: 0,
      labFee: 0,
      sportsFee: 0,
      hostelFee: 0,
      busFee: 0,
      otherFees: 0,
      totalFee: totalFee,
    };

    let fee = await FeeDetails.findOne({ student: studentId, semester });

    if (fee) {
      // ✅ Update — recalculate pending correctly
      const alreadyPaid = fee.paymentDetails.amountPaid;
      fee.feeStructure = feeStructure;
      fee.academicYear = academicYear || fee.academicYear;
      fee.paymentDetails.dueDate = dueDate;
      fee.paymentDetails.amountPending = Math.max(0, totalFee - alreadyPaid); // ✅ Never negative
      fee.updatedBy = req.user.id;
      await fee.save();

      console.log('✅ Fee updated, totalFee:', totalFee);
      res.status(200).json({ success: true, data: fee });
    } else {
      // ✅ Create new fee record
      fee = await FeeDetails.create({
        student: studentId,
        semester,
        academicYear: academicYear || '2025-2026',
        feeStructure,
        paymentDetails: {
          amountPaid: 0,
          amountPending: totalFee, // ✅ Full amount pending initially
          paymentStatus: 'Pending',
          dueDate: dueDate,
        },
        updatedBy: req.user.id
      });

      console.log('✅ Fee created, totalFee:', totalFee);
      res.status(201).json({ success: true, data: fee });
    }
  } catch (error) {
    console.error('❌ Error in createOrUpdateFee:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add payment
exports.addPayment = async (req, res) => {
  try {
    const { feeId, amount, paymentMode, paymentDate, transactionId } = req.body;

    const fee = await FeeDetails.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    const paymentAmount = parseFloat(amount);
    const totalFee = fee.feeStructure.totalFee;

    // ✅ FIX - Don't allow overpayment
    const maxPayable = fee.paymentDetails.amountPending;
    if (paymentAmount > maxPayable) {
      return res.status(400).json({
        success: false,
        message: `Amount exceeds pending fee. Maximum payable: ₹${maxPayable}`
      });
    }

    fee.transactions.push({
      transactionId: transactionId || `TXN${Date.now()}`,
      amount: paymentAmount,
      paymentMode,
      paymentDate: paymentDate || new Date(),
      receiptNumber: `REC${Date.now()}`
    });

    fee.paymentDetails.amountPaid += paymentAmount;
    fee.paymentDetails.amountPending = Math.max(0, totalFee - fee.paymentDetails.amountPaid); // ✅ Never negative
    fee.paymentDetails.lastPaymentDate = paymentDate || new Date();
    fee.updatedBy = req.user.id;

    await fee.save();

    console.log('✅ Payment added successfully');
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    console.error('❌ Error in addPayment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};