const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    title: { type: String, default: '' },
    url: { type: String, required: true }, // với video có thể là link Youtube hoặc file tải lên
    thumbnailUrl: { type: String, default: '' },
    album: { type: String, default: 'Chung', trim: true, index: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
