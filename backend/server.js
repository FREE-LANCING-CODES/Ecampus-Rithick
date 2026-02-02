const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://ecampusrithick.vercel.app', // Everything in small letters
  credentials: true
}));
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', require('./routes/facultyRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'eCampus 2.0 API is running! 🚀',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});