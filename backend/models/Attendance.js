const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject name'],
    },
    subjectCode: {
      type: String,
      required: [true, 'Please provide subject code'],
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'On Duty'],
      default: 'Absent',
    },
    session: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Full Day'],
      default: 'Full Day',
    },
    semester: {
      type: Number,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Faculty who marked
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
attendanceSchema.index({ student: 1, subject: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);