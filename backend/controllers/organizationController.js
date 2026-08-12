const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const Organization = require('../models/Organization');

function buildTree(flatList) {
  const map = new Map();
  flatList.forEach((item) => map.set(String(item._id), { ...item.toObject(), children: [] }));

  const roots = [];
  map.forEach((node) => {
    if (node.parent && map.has(String(node.parent))) {
      map.get(String(node.parent)).children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

// GET /api/organizations (admin - danh sách phẳng)
const adminList = asyncHandler(async (req, res) => {
  const items = await Organization.find().sort({ unit: 1, order: 1 });
  ok(res, items);
});

// GET /api/public/organizations (cây tổ chức công khai)
const publicTree = asyncHandler(async (req, res) => {
  const items = await Organization.find({ isActive: true }).sort({ unit: 1, order: 1 });
  ok(res, buildTree(items));
});

const create = asyncHandler(async (req, res) => {
  const { fullName, position, unit, parent, avatar, email, phone, bio, order } = req.body;
  if (!fullName || !position) throw new ApiError(400, 'Vui lòng nhập họ tên và chức vụ.');

  const item = await Organization.create({
    fullName,
    position,
    unit,
    parent: parent || null,
    avatar,
    email,
    phone,
    bio,
    order,
  });

  await logAction(req, {
    action: 'create',
    module: 'organization',
    targetId: item._id,
    description: `Thêm nhân sự "${fullName}" vào cơ cấu tổ chức`,
  });
  ok(res, item, 'Thêm thành công.', 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await Organization.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');

  if (req.body.parent === req.params.id) {
    throw new ApiError(400, 'Không thể chọn chính mình làm cấp trên.');
  }

  const fields = ['fullName', 'position', 'unit', 'parent', 'avatar', 'email', 'phone', 'bio', 'order', 'isActive'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f] || (f === 'parent' ? null : item[f]);
  });

  await item.save();
  await logAction(req, {
    action: 'update',
    module: 'organization',
    targetId: item._id,
    description: `Cập nhật nhân sự "${item.fullName}"`,
  });
  ok(res, item, 'Cập nhật thành công.');
});

const remove = asyncHandler(async (req, res) => {
  const item = await Organization.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');

  const childCount = await Organization.countDocuments({ parent: item._id });
  if (childCount > 0) {
    throw new ApiError(400, 'Vui lòng xoá hoặc chuyển cấp dưới trước khi xoá mục này.');
  }

  await item.deleteOne();
  await logAction(req, {
    action: 'delete',
    module: 'organization',
    targetId: req.params.id,
    description: `Xoá nhân sự "${item.fullName}"`,
  });
  ok(res, null, 'Đã xoá.');
});

module.exports = { adminList, publicTree, create, update, remove };
