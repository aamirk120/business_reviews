const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema(
  {
    businessid: { type: Schema.Types.ObjectId, ref: 'Business' },
    userid: { type: Schema.Types.ObjectId, ref: 'User' },
    caption: { type: String },
    thumbPath: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('Photo', schema);
