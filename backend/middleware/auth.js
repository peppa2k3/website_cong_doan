const asyncHandler = require('./asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/tokens');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Xác thực người dùng qua Access Token (Bearer).
 * Gắn req.user (đã kèm role + permissions) nếu hợp lệ.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn.');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, 'Token không hợp lệ hoặc đã hết hạn.');
  }

  const user = await User.findById(payload.sub).populate('role');
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Tài khoản không tồn tại hoặc đã bị khoá.');
  }

  req.user = user;
  req.userPermissions = user.role ? user.role.permissions : [];
  next();
});

module.exports = { protect };
