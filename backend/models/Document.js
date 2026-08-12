const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    docNumber: { type: String, default: '', trim: true }, // số hiệu văn bản
    docType: {
      type: String,
      enum: ['nghi_quyet', 'quyet_dinh', 'cong_van', 'ke_hoach', 'huong_dan', 'bieu_mau', 'khac'],
      default: 'khac',
      index: true,
    },
    issuer: { type: String, default: '' }, // cơ quan ban hành
    issuedDate: { type: Date },
    summary: { type: String, default: '' },
    category: { type: String, default: 'chung', index: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    fileType: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
    downloadCount: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

documentSchema.index({ title: 'text', summary: 'text', docNumber: 'text' });

module.exports = mongoose.model('Document', documentSchema);
