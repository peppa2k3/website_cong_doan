const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const User = require('../models/User');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/tokens');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, 'Vui lòng nhập tên đăng nhập và mật khẩu.');
  }

  const user = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
  })
    .select('+password')
    .populate('role');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Tên đăng nhập hoặc mật khẩu không đúng.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Tên đăng nhập hoặc mật khẩu không đúng.');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  await logAction(
    { user, ip: req.ip, headers: req.headers, method: 'POST', originalUrl: '/api/auth/login' },
    { action: 'login', module: 'auth', description: `${user.fullName} đăng nhập hệ thống` }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  ok(res, { user: user.toSafeObject(), accessToken }, 'Đăng nhập thành công.');
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'Không tìm thấy phiên đăng nhập.');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    throw new ApiError(401, 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash').populate('role');
  if (!user || !user.isActive || user.refreshTokenHash !== hashToken(token)) {
    throw new ApiError(401, 'Phiên đăng nhập không hợp lệ.');
  }

  const accessToken = signAccessToken(user);
  ok(res, { accessToken, user: user.toSafeObject() }, 'Làm mới phiên thành công.');
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshTokenHash = undefined;
    await req.user.save();
  }
  res.clearCookie('refreshToken', { path: '/api/auth' });
  ok(res, null, 'Đã đăng xuất.');
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  ok(res, { user: req.user.toSafeObject(), permissions: req.userPermissions }, 'OK');
});

// PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    throw new ApiError(400, 'Mật khẩu mới phải có ít nhất 8 ký tự.');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Mật khẩu hiện tại không đúng.');

  user.password = newPassword;
  await user.save();

  await logAction(req, { action: 'update', module: 'auth', description: 'Đổi mật khẩu tài khoản' });

  ok(res, null, 'Đổi mật khẩu thành công.');
});

module.exports = { login, refresh, logout, me, changePassword };
