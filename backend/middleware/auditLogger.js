const AuditLog = require('../models/AuditLog');

/**
 * Ghi log thao tác quản trị. Gọi trực tiếp trong controller sau khi thao tác thành công,
 * ví dụ: await logAction(req, { action: 'create', module: 'news', targetId: news._id, description: `Tạo tin "${news.title}"` })
 * Không throw lỗi ra ngoài để tránh làm hỏng luồng chính nếu ghi log thất bại.
 */
async function logAction(req, { action, module, targetId = '', description = '' }) {
  try {
    await AuditLog.create({
      user: req.user ? req.user._id : undefined,
      userName: req.user ? req.user.fullName : 'Hệ thống',
      action,
      module,
      targetId: targetId ? String(targetId) : '',
      description,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
      method: req.method,
      path: req.originalUrl,
    });
  } catch (err) {
    console.error('[AuditLog] Không thể ghi log:', err.message);
  }
}

module.exports = { logAction };
