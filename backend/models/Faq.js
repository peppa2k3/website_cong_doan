const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    askerName: { type: String, default: '' },
    askerEmail: { type: String, default: '' },
    category: { type: String, default: 'chung' },
    answer: { type: String, default: '' },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answeredAt: { type: Date },
    status: { type: String, enum: ['cho_duyet', 'da_tra_loi'], default: 'cho_duyet', index: true },
    isPublished: { type: Boolean, default: false, index: true }, // hiển thị công khai ở trang Hỏi đáp
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('Faq', faqSchema);
