const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedByName: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['gop_y', 'phan_anh', 'to_cao'], // góp ý / phản ánh / tố cáo
      required: true,
      index: true,
    },
    trackingCode: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],
    isAnonymous: { type: Boolean, default: false },
    submitterName: { type: String, default: '' },
    submitterEmail: { type: String, default: '' },
    submitterPhone: { type: String, default: '' },
    submitterDepartment: { type: String, default: '' },
    // mật khẩu tra cứu do người gửi tự đặt, dùng để bảo vệ trạng thái xử lý khi ẩn danh
    lookupPinHash: { type: String, select: false },
    status: {
      type: String,
      enum: ['moi', 'dang_xu_ly', 'da_xu_ly', 'da_dong'],
      default: 'moi',
      index: true,
    },
    priority: { type: String, enum: ['thap', 'binh_thuong', 'cao', 'khan_cap'], default: 'binh_thuong' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    responses: [responseSchema],
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
