const FeeDetails = require('../models/FeeDetails');

// @desc    Get student's fee details
// @route   GET /api/student/fees
// @access  Private (Student)
exports.getMyFeeDetails = async (req, res) => {
  try {
    const studentId = req.user.id;

    const feeDetails = await FeeDetails.find({ student: studentId })
      .sort({ semester: -1 })
      .populate('updatedBy', 'name');

    if (!feeDetails.length) {
      return res.status(404).json({
        success: false,
        message: 'No fee details found',
      });
    }

    // Calculate overall statistics
    let totalFeeAmount = 0;
    let totalPaid = 0;
    let totalPending = 0;

    feeDetails.forEach((fee) => {
      totalFeeAmount += fee.feeStructure.totalFee;
      totalPaid += fee.paymentDetails.amountPaid;
      totalPending += fee.paymentDetails.amountPending;
    });

    res.status(200).json({
      success: true,
      data: {
        overall: {
          totalFeeAmount,
          totalPaid,
          totalPending,
          percentagePaid: ((totalPaid / totalFeeAmount) * 100).toFixed(2),
        },
        semesterWise: feeDetails,
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

// @desc    Get fee details by semester
// @route   GET /api/student/fees/:semester
// @access  Private (Student)
exports.getFeesBySemester = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { semester } = req.params;

    const feeDetails = await FeeDetails.findOne({
      student: studentId,
      semester: parseInt(semester),
    }).populate('updatedBy', 'name');

    if (!feeDetails) {
      return res.status(404).json({
        success: false,
        message: `No fee details found for semester ${semester}`,
      });
    }

    res.status(200).json({
      success: true,
      data: feeDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get payment history
// @route   GET /api/student/fees/transactions
// @access  Private (Student)
exports.getMyTransactions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const feeDetails = await FeeDetails.find({ student: studentId }).select('transactions semester academicYear');

    if (!feeDetails.length) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found',
      });
    }

    // Collect all transactions
    const allTransactions = [];

    feeDetails.forEach((fee) => {
      fee.transactions.forEach((transaction) => {
        allTransactions.push({
          ...transaction.toObject(),
          semester: fee.semester,
          academicYear: fee.academicYear,
        });
      });
    });

    // Sort by payment date (latest first)
    allTransactions.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

    res.status(200).json({
      success: true,
      count: allTransactions.length,
      data: allTransactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};