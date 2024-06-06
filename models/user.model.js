const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    isAdmin: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('User', schema);
