const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok, paginated } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const User = require('../models/User');
const Role = require('../models/Role');

// GET /api/users
const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', role = '' } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.role = role;

  const [items, total] = await Promise.all([
    User.find(query)
      .populate('role', 'name key')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

// GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('role');
  if (!user) throw new ApiError(404, 'Không tìm thấy người dùng.');
  ok(res, user);
});

// POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, phone, department, position, role } = req.body;
  if (!fullName || !username || !email || !password || !role) {
    throw new ApiError(400, 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
  }

  const roleDoc = await Role.findById(role);
  if (!roleDoc) throw new ApiError(400, 'Vai trò không hợp lệ.');

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    phone,
    department,
    position,
    role,
  });

  await logAction(req, {
    action: 'create',
    module: 'user',
    targetId: user._id,
    description: `Tạo tài khoản "${user.username}"`,
  });

  ok(res, user.toSafeObject(), 'Tạo tài khoản thành công.', 201);
});

// PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const { fullName, phone, department, position, role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Không tìm thấy người dùng.');

  if (role) {
    const roleDoc = await Role.findById(role);
    if (!roleDoc) throw new ApiError(400, 'Vai trò không hợp lệ.');
    user.role = role;
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  if (department !== undefined) user.department = department;
  if (position !== undefined) user.position = position;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  await logAction(req, {
    action: 'update',
    module: 'user',
    targetId: user._id,
    description: `Cập nhật tài khoản "${user.username}"`,
  });

  ok(res, user.toSafeObject(), 'Cập nhật thành công.');
});

// PUT /api/users/:id/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    throw new ApiError(400, 'Mật khẩu mới phải có ít nhất 8 ký tự.');
  }
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Không tìm thấy người dùng.');

  user.password = newPassword;
  user.refreshTokenHash = undefined;
  await user.save();

  await logAction(req, {
    action: 'update',
    module: 'user',
    targetId: user._id,
    description: `Đặt lại mật khẩu cho tài khoản "${user.username}"`,
  });

  ok(res, null, 'Đặt lại mật khẩu thành công.');
});

// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Không tìm thấy người dùng.');

  if (String(user._id) === String(req.user._id)) {
    throw new ApiError(400, 'Không thể tự xoá tài khoản đang đăng nhập.');
  }

  await user.deleteOne();

  await logAction(req, {
    action: 'delete',
    module: 'user',
    targetId: req.params.id,
    description: `Xoá tài khoản "${user.username}"`,
  });

  ok(res, null, 'Đã xoá tài khoản.');
});

// GET /api/users/roles/all
const listRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().sort({ createdAt: 1 });
  ok(res, roles);
});

module.exports = { listUsers, getUser, createUser, updateUser, resetPassword, deleteUser, listRoles };
