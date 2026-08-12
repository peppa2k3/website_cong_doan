const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: '', maxlength: 500 },
    content: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    // Gộp 3 mục menu (Tin tức / Thông báo nổi bật / Hoạt động truyền thông) vào 1 collection
    category: {
      type: String,
      enum: ['tin_tuc', 'thong_bao', 'hoat_dong'],
      default: 'tin_tuc',
      index: true,
    },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    isPinned: { type: Boolean, default: false }, // ghim ở trang chủ / "thông báo mới"
    isFeatured: { type: Boolean, default: false }, // tin nổi bật
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],
    galleryImages: [{ type: String }], // ảnh minh hoạ cho hoạt động truyền thông
    views: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

newsSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('News', newsSchema);
