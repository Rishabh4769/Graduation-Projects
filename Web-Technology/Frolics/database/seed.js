const connectDB = require('./dbconnection');
const { User } = require('./dbconnection'); // Use models

const seedData = async () => {
  await connectDB();

  // Clear existing
  await User.deleteMany({});

  // Seed admin
  const hashed = await bcrypt.hash('admin123', 12);
  await new User({
    userName: 'admin',
    userPassword: hashed,
    emailAddress: 'admin@frolic.com',
    role: 'admin',
    isAdmin: true
  }).save();

  // Seed institutes, events, etc.
  console.log('Seeding complete');
  process.exit();
};

seedData();

module.exports = seedData;