require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_USER = process.env.MONGO_USER || 'root';
const MONGO_PASS = process.env.MONGO_PASS || 'example';
const MONGO_DB = process.env.MONGO_DB || 'test';
const MONGO_REPLICA_SET = process.env.MONGO_REPLICA_SET || 'rs0';

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@mongo1:${process.env.MONGO_PORT1},mongo2:${process.env.MONGO_PORT2}/${MONGO_DB}?replicaSet=${MONGO_REPLICA_SET}`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;