const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const Banner = require('../models/Banner');

const adminList = asyncHandler(async (req, res) => {
  const items = await Banner.find().sort({ position: 1, order: 1 });
  ok(res, items);
});

const publicList = asyncHandler(async (req, res) => {
  const { position = 'home_slider' } = req.query;
  const now = new Date();
  const items = await Banner.find({
    position,
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
    ],
  }).sort({ order: 1 });
  ok(res, items);
});

const create = asyncHandler(async (req, res) => {
  const { title, linkUrl, position, order, isActive, startDate, endDate } = req.body;
  if (!title) throw new ApiError(400, 'Vui lòng nhập tiêu đề banner.');
  if (!req.file) throw new ApiError(400, 'Vui lòng tải lên hình ảnh banner.');

  const item = await Banner.create({
    title,
    imageUrl: `/uploads/images/${req.file.filename}`,
    linkUrl,
    position,
    order,
    isActive,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  await logAction(req, { action: 'create', module: 'banner', targetId: item._id, description: `Tạo banner "${title}"` });
  ok(res, item, 'Tạo banner thành công.', 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await Banner.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy banner.');

  const fields = ['title', 'linkUrl', 'position', 'order', 'isActive', 'startDate', 'endDate'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });
  if (req.file) item.imageUrl = `/uploads/images/${req.file.filename}`;

  await item.save();
  await logAction(req, { action: 'update', module: 'banner', targetId: item._id, description: `Cập nhật banner "${item.title}"` });
  ok(res, item, 'Cập nhật thành công.');
});

const remove = asyncHandler(async (req, res) => {
  const item = await Banner.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy banner.');
  await item.deleteOne();
  await logAction(req, { action: 'delete', module: 'banner', targetId: req.params.id, description: `Xoá banner "${item.title}"` });
  ok(res, null, 'Đã xoá banner.');
});

module.exports = { adminList, publicList, create, update, remove };
