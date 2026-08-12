const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok, paginated } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const Media = require('../models/Media');

const adminList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 24, album = '', type = '' } = req.query;
  const query = {};
  if (album) query.album = album;
  if (type) query.type = type;

  const [items, total] = await Promise.all([
    Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Media.countDocuments(query),
  ]);
  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

const publicList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 24, album = '', type = '' } = req.query;
  const query = {};
  if (album) query.album = album;
  if (type) query.type = type;

  const [items, total, albums] = await Promise.all([
    Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Media.countDocuments(query),
    Media.distinct('album'),
  ]);
  res.json({
    success: true,
    data: items,
    albums,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// Upload ảnh (multipart)
const createImage = asyncHandler(async (req, res) => {
  const { title, album, description, order } = req.body;
  if (!req.file) throw new ApiError(400, 'Vui lòng chọn ảnh để tải lên.');

  const item = await Media.create({
    type: 'image',
    title,
    url: `/uploads/media/${req.file.filename}`,
    album: album || 'Chung',
    description,
    order,
    uploadedBy: req.user._id,
  });

  await logAction(req, { action: 'create', module: 'media', targetId: item._id, description: `Thêm ảnh "${title || item.url}"` });
  ok(res, item, 'Tải ảnh lên thành công.', 201);
});

// Thêm video (dán link Youtube hoặc tải file)
const createVideo = asyncHandler(async (req, res) => {
  const { title, album, description, order, url, thumbnailUrl } = req.body;

  let videoUrl = url;
  if (req.file) videoUrl = `/uploads/media/${req.file.filename}`;
  if (!videoUrl) throw new ApiError(400, 'Vui lòng cung cấp link video hoặc tải file lên.');

  const item = await Media.create({
    type: 'video',
    title,
    url: videoUrl,
    thumbnailUrl,
    album: album || 'Chung',
    description,
    order,
    uploadedBy: req.user._id,
  });

  await logAction(req, { action: 'create', module: 'media', targetId: item._id, description: `Thêm video "${title || videoUrl}"` });
  ok(res, item, 'Thêm video thành công.', 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await Media.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');

  const fields = ['title', 'album', 'description', 'order', 'thumbnailUrl'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });

  await item.save();
  await logAction(req, { action: 'update', module: 'media', targetId: item._id, description: `Cập nhật media "${item.title}"` });
  ok(res, item, 'Cập nhật thành công.');
});

const remove = asyncHandler(async (req, res) => {
  const item = await Media.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');
  await item.deleteOne();
  await logAction(req, { action: 'delete', module: 'media', targetId: req.params.id, description: `Xoá media "${item.title}"` });
  ok(res, null, 'Đã xoá.');
});

module.exports = { adminList, publicList, createImage, createVideo, update, remove };
