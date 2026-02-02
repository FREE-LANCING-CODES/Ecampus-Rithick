const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!');

    const users = await User.find({});
    console.log(`\nTotal users in database: ${users.length}\n`);

    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} - UserID: ${user.userId} - Role: ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();