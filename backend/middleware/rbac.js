const ApiError = require('../utils/ApiError');

/**
 * Kiểm tra req.userPermissions có chứa ít nhất 1 trong các quyền yêu cầu không.
 * Dùng: router.post('/news', protect, authorize(PERMISSIONS.NEWS_MANAGE), handler)
 */
const authorize = (...requiredPermissions) => (req, res, next) => {
  const userPermissions = req.userPermissions || [];

  const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));
  if (!hasPermission) {
    return next(new ApiError(403, 'Bạn không có quyền thực hiện thao tác này.'));
  }
  next();
};

module.exports = { authorize };
