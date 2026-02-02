const mongoose = require('mongoose');

const feeDetailsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },

    // Fee Breakdown
    feeStructure: {
      tuitionFee: {
        type: Number,
        required: true,
        default: 0,
      },
      examFee: {
        type: Number,
        default: 0,
      },
      libraryFee: {
        type: Number,
        default: 0,
      },
      labFee: {
        type: Number,
        default: 0,
      },
      sportsFee: {
        type: Number,
        default: 0,
      },
      hostelFee: {
        type: Number,
        default: 0,
      },
      busFee: {
        type: Number,
        default: 0,
      },
      otherFees: {
        type: Number,
        default: 0,
      },
      totalFee: {
        type: Number,
        required: true,
      },
    },

    // Payment Details
    paymentDetails: {
      amountPaid: {
        type: Number,
        default: 0,
      },
      amountPending: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending', 'Overdue'],
        default: 'Pending',
      },
      lastPaymentDate: {
        type: Date,
      },
      dueDate: {
        type: Date,
        required: true,
      },
    },

    // Payment History
    transactions: [
      {
        transactionId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        paymentMode: {
          type: String,
          enum: ['Cash', 'Online', 'Cheque', 'DD', 'Card'],
          required: true,
        },
        paymentDate: {
          type: Date,
          required: true,
        },
        receiptNumber: {
          type: String,
        },
        remarks: {
          type: String,
        },
      },
    ],

    // Concession/Scholarship
    concession: {
      type: Number,
      default: 0,
    },
    concessionReason: {
      type: String,
    },

    // Added/Updated by
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin who updated
    },
  },
  {
    timestamps: true,
  }
);

/// Calculate total fee and pending amount before saving
feeDetailsSchema.pre('save', function () {
  const { tuitionFee, examFee, libraryFee, labFee, sportsFee, hostelFee, busFee, otherFees } =
    this.feeStructure;

  // Total fee calculation
  this.feeStructure.totalFee =
    tuitionFee + examFee + libraryFee + labFee + sportsFee + hostelFee + busFee + otherFees - this.concession;

  // Pending amount calculation
  this.paymentDetails.amountPending = this.feeStructure.totalFee - this.paymentDetails.amountPaid;

  // Update payment status
  if (this.paymentDetails.amountPending === 0) {
    this.paymentDetails.paymentStatus = 'Paid';
  } else if (this.paymentDetails.amountPaid > 0) {
    this.paymentDetails.paymentStatus = 'Partial';
  } else if (new Date() > this.paymentDetails.dueDate) {
    this.paymentDetails.paymentStatus = 'Overdue';
  } else {
    this.paymentDetails.paymentStatus = 'Pending';
  }
});

// Index for faster queries
feeDetailsSchema.index({ student: 1, semester: 1 });

module.exports = mongoose.model('FeeDetails', feeDetailsSchema);