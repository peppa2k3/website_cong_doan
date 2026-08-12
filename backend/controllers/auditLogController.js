const asyncHandler = require('../middleware/asyncHandler');
const { paginated } = require('../utils/response');
const AuditLog = require('../models/AuditLog');

const list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, module: moduleFilter = '', action = '' } = req.query;
  const query = {};
  if (moduleFilter) query.module = moduleFilter;
  if (action) query.action = action;

  const [items, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    AuditLog.countDocuments(query),
  ]);
  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

module.exports = { list };
