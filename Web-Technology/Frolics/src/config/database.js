const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = 'mongodb+srv://Cluster52104:rishu4769@cluster52104.jvf2n8n.mongodb.net/FrolicDB';
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully to ${uri}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;