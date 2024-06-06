const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema(
  {
    ownerid: { type: Schema.Types.ObjectId, ref: 'User' },
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: { type: String },
    city: { type: String, },
    state: { type: String },
    zip: { type: String, },
    phone: { type: String },
    category: { type: String },
    subcategory: { type: String },
    photos: [{
      caption: { type: String },
      url: { type: String }
    }],
    reviews: [{
      dollars: { type: Number },
      stars: { type: Number },
      review: { type: String },
    }]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('Business', schema);
