const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: [true, 'Please provide department'],
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    section: {
      type: String,
      default: 'A',
    },
    academicYear: {
      type: String,
      required: true,
    },

    // Weekly Schedule
    schedule: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          required: true,
        },
        periods: [
          {
            periodNumber: {
              type: Number,
              required: true,
            },
            startTime: {
              type: String,
              required: true, // Format: "09:00 AM"
            },
            endTime: {
              type: String,
              required: true, // Format: "10:00 AM"
            },
            subject: {
              type: String,
              required: true,
            },
            subjectCode: {
              type: String,
              required: true,
            },
            faculty: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            facultyName: {
              type: String,
            },
            roomNumber: {
              type: String,
            },
            type: {
              type: String,
              enum: ['Theory', 'Lab', 'Tutorial', 'Break', 'Library'],
              default: 'Theory',
            },
          },
        ],
      },
    ],

    // Effective dates
    effectiveFrom: {
      type: Date,
      required: true,
    },
    effectiveTo: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin/Faculty who created
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
timetableSchema.index({ department: 1, year: 1, semester: 1, section: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);