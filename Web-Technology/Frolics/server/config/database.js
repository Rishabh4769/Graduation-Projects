const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;