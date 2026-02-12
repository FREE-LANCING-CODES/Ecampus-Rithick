const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'Please provide User ID'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 1,
      select: false, // Password return panna koodadhu by default
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student',
    },
    name: {
      type: String,
      required: [true, 'Please provide name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide valid email',
      ],
    },
    department: {
      type: String,
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    rollNumber: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    dateOfBirth: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // ========== NEW FACULTY FIELDS - ADDED ==========
    qualification: {
      type: String,
    },
    specialization: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
    designation: {
      type: String,
    },
    dateOfJoining: {
      type: Date,
    },
    officeRoom: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    // ================================================
  },
  {
    timestamps: true, // createdAt, updatedAt auto add aagum
  }
);

// Password encrypt panradhu - Save pannumbodhu
userSchema.pre('save', async function () {
  // Password change aagala na skip pannu
  if (!this.isModified('password')) {
    return;
  }

  // Password hash (encrypt) pannu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// JWT Token generate panradhu
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Password match panradhu (Login time)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);