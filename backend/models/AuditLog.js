const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'Hệ thống' },
    action: { type: String, required: true }, // create | update | delete | login | logout | ...
    module: { type: String, required: true }, // news | document | user | ...
    targetId: { type: String, default: '' },
    description: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    method: { type: String, default: '' },
    path: { type: String, default: '' },
    statusCode: { type: Number },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
