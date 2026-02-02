const User = require('../models/User');

// @desc    Register new user (Admin use pannum - students add panna)
// @route   POST /api/auth/register
// @access  Public (later Admin only pannalam)
exports.register = async (req, res) => {
  try {
    const { userId, password, role, name, email, department, year, semester, rollNumber, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User ID already exists',
      });
    }

    // Create user
    const user = await User.create({
      userId,
      password,
      role,
      name,
      email,
      department,
      year,
      semester,
      rollNumber,
      phone,
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
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

// @desc    Login user (Student/Faculty/Admin)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validation
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide User ID and Password',
      });
    }

    // Check user exists (password include pannu)
    const user = await User.findOne({ userId }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Check password match
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
        department: user.department,
        year: user.year,
        semester: user.semester,
        rollNumber: user.rollNumber,
        phone: user.phone,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};