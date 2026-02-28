const FeeDetails = require('../models/FeeDetails');
const User = require('../models/User');

// Get all student fees
exports.getAllStudentFees = async (req, res) => {
  try {
    console.log('🔥 GET /api/admin/fees - Route hit!');
    
    const fees = await FeeDetails.find()
      .populate('student', 'name userId rollNumber department year semester')
      .sort({ semester: -1 });

    console.log(`✅ Found ${fees.length} fee records`);

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
      stats.byStatus[fee.paymentDetails.paymentStatus]++;
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
    console.log('🔥 GET /api/admin/fees/statistics - Route hit!');
    
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
      stats.byStatus[fee.paymentDetails.paymentStatus]++;
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
    console.log('🔥 POST /api/admin/fees - Route hit!');
    
    const { studentId, semester, academicYear, feeStructure, dueDate } = req.body;

    let fee = await FeeDetails.findOne({ student: studentId, semester });

    if (fee) {
      fee.feeStructure = feeStructure;
      fee.academicYear = academicYear;
      fee.paymentDetails.dueDate = dueDate;
      fee.updatedBy = req.user.id;
      await fee.save();
      
      console.log('✅ Fee updated');
      res.status(200).json({ success: true, data: fee });
    } else {
      fee = await FeeDetails.create({
        student: studentId,
        semester,
        academicYear,
        feeStructure,
        paymentDetails: {
          amountPaid: 0,
          amountPending: 0,
          paymentStatus: 'Pending',
          dueDate: dueDate || new Date(Date.now() + 30*24*60*60*1000)
        },
        updatedBy: req.user.id
      });
      
      console.log('✅ Fee created');
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
    console.log('🔥 POST /api/admin/fees/payment - Route hit!');
    
    const { feeId, amount, paymentMode, paymentDate, transactionId } = req.body;

    const fee = await FeeDetails.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    fee.transactions.push({
      transactionId: transactionId || `TXN${Date.now()}`,
      amount: parseFloat(amount),
      paymentMode,
      paymentDate: paymentDate || new Date(),
      receiptNumber: `REC${Date.now()}`
    });

    fee.paymentDetails.amountPaid += parseFloat(amount);
    fee.paymentDetails.lastPaymentDate = paymentDate || new Date();
    fee.updatedBy = req.user.id;

    await fee.save();

    console.log('✅ Payment added');
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    console.error('❌ Error in addPayment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};