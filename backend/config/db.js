const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // TODO: fix
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/calculator';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
