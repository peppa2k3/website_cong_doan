const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok, paginated, uniqueSlug } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const News = require('../models/News');

// ---------- ADMIN ----------

// GET /api/news (admin - xem cả draft)
const adminList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', category = '', status = '' } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    News.find(query)
      .populate('author', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    News.countDocuments(query),
  ]);

  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

const adminGet = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id).populate('author', 'fullName');
  if (!item) throw new ApiError(404, 'Không tìm thấy tin.');
  ok(res, item);
});

const create = asyncHandler(async (req, res) => {
  const { title, summary, content, thumbnail, category, tags, status, isPinned, isFeatured, galleryImages } =
    req.body;
  if (!title || !content) throw new ApiError(400, 'Vui lòng nhập tiêu đề và nội dung.');

  const slug = await uniqueSlug(News, title);

  const item = await News.create({
    title,
    slug,
    summary,
    content,
    thumbnail,
    category,
    tags,
    status: status || 'draft',
    isPinned: !!isPinned,
    isFeatured: !!isFeatured,
    galleryImages,
    author: req.user._id,
    publishedAt: status === 'published' ? new Date() : null,
  });

  await logAction(req, { action: 'create', module: 'news', targetId: item._id, description: `Tạo tin "${title}"` });
  ok(res, item, 'Tạo tin thành công.', 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy tin.');

  const fields = [
    'title',
    'summary',
    'content',
    'thumbnail',
    'category',
    'tags',
    'status',
    'isPinned',
    'isFeatured',
    'galleryImages',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });

  if (req.body.title && req.body.title !== item.title) {
    item.slug = await uniqueSlug(News, req.body.title, item._id);
  }

  if (req.body.status === 'published' && !item.publishedAt) {
    item.publishedAt = new Date();
  }

  await item.save();

  await logAction(req, { action: 'update', module: 'news', targetId: item._id, description: `Cập nhật tin "${item.title}"` });
  ok(res, item, 'Cập nhật thành công.');
});

const remove = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy tin.');
  await item.deleteOne();
  await logAction(req, { action: 'delete', module: 'news', targetId: req.params.id, description: `Xoá tin "${item.title}"` });
  ok(res, null, 'Đã xoá tin.');
});

// ---------- PUBLIC ----------

// GET /api/public/news
const publicList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, category = '', search = '' } = req.query;
  const query = { status: 'published' };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  const [items, total] = await Promise.all([
    News.find(query)
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    News.countDocuments(query),
  ]);

  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

// GET /api/public/news/highlights (dùng cho trang chủ)
const publicHighlights = asyncHandler(async (req, res) => {
  const [pinned, featured, latestByCategory] = await Promise.all([
    News.find({ status: 'published', isPinned: true }).select('-content').sort({ publishedAt: -1 }).limit(5),
    News.find({ status: 'published', isFeatured: true }).select('-content').sort({ publishedAt: -1 }).limit(6),
    News.aggregate([
      { $match: { status: 'published' } },
      { $sort: { publishedAt: -1 } },
      { $group: { _id: '$category', items: { $push: '$$ROOT' } } },
      { $project: { category: '$_id', items: { $slice: ['$items', 4] } } },
    ]),
  ]);

  ok(res, { pinned, featured, byCategory: latestByCategory });
});

// GET /api/public/news/:slug
const publicGetBySlug = asyncHandler(async (req, res) => {
  const item = await News.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'fullName');
  if (!item) throw new ApiError(404, 'Không tìm thấy tin tức.');

  const related = await News.find({
    category: item.category,
    _id: { $ne: item._id },
    status: 'published',
  })
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(4);

  ok(res, { item, related });
});

module.exports = {
  adminList,
  adminGet,
  create,
  update,
  remove,
  publicList,
  publicHighlights,
  publicGetBySlug,
};
