const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
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
    semester: {
      type: Number,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    
    // Internal Assessment Marks
    internalMarks: {
      cia1: {
        type: Number,
        default: 0,
        max: 20,
      },
      cia2: {
        type: Number,
        default: 0,
        max: 20,
      },
      cia3: {
        type: Number,
        default: 0,
        max: 20,
      },
      assignment: {
        type: Number,
        default: 0,
        max: 10,
      },
      totalInternal: {
        type: Number,
        default: 0,
        max: 70,  // Changed from 50 to 70
      },
    },

    // End Semester Marks
    semesterMarks: {
      theoryMarks: {
        type: Number,
        default: 0,
        max: 100,
      },
      grade: {
        type: String,
        enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F', 'AB', 'W'],
      },
      gradePoint: {
        type: Number,
        min: 0,
        max: 10,
      },
      result: {
        type: String,
        enum: ['Pass', 'Fail', 'Pending', 'Absent'],
        default: 'Pending',
      },
    },

    credits: {
      type: Number,
      required: true,
    },

    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Faculty who entered marks
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total internal marks before saving
marksSchema.pre('save', function (next) {
  const { cia1, cia2, cia3, assignment } = this.internalMarks;
  this.internalMarks.totalInternal = cia1 + cia2 + cia3 + assignment;
  next();
});

// Index for faster queries
marksSchema.index({ student: 1, semester: 1 });

module.exports = mongoose.model('Marks', marksSchema);