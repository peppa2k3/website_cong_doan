const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: '' },
    position: {
      type: String,
      enum: ['home_slider', 'home_side', 'popup'],
      default: 'home_slider',
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
