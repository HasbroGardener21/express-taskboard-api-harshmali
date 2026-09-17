const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MongoDB connection string is missing in .env');
  }

  await mongoose.connect(mongoUri);

  const existingAdmin = await User.findOne({ email: 'admin@taskboard.com' });
  if (existingAdmin) {
    console.log('Admin account already exists.');
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin1234', salt);

  await User.create({
    email: 'admin@taskboard.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true
  });

  console.log('Admin created successfully: admin@taskboard.com / Admin1234');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});