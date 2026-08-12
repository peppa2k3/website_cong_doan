const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true }, // chức vụ
    unit: {
      type: String,
      enum: ['ban_chap_hanh', 'uy_ban_kiem_tra', 'to_cong_doan', 'ban_nu_cong', 'khac'],
      default: 'ban_chap_hanh',
      index: true,
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    avatar: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

organizationSchema.index({ unit: 1, order: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
