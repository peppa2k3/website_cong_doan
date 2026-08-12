const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok, paginated, uniqueSlug } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const Document = require('../models/Document');

const adminList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', docType = '', status = '' } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (docType) query.docType = docType;
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    Document.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Document.countDocuments(query),
  ]);

  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

const create = asyncHandler(async (req, res) => {
  const { title, docNumber, docType, issuer, issuedDate, summary, category, status } = req.body;
  if (!title) throw new ApiError(400, 'Vui lòng nhập tiêu đề văn bản.');
  if (!req.file) throw new ApiError(400, 'Vui lòng tải lên file văn bản.');

  const slug = await uniqueSlug(Document, title);

  const item = await Document.create({
    title,
    slug,
    docNumber,
    docType,
    issuer,
    issuedDate: issuedDate || undefined,
    summary,
    category,
    status: status || 'published',
    fileUrl: `/uploads/documents/${req.file.filename}`,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileType: req.file.mimetype,
    uploadedBy: req.user._id,
  });

  await logAction(req, { action: 'create', module: 'document', targetId: item._id, description: `Đăng văn bản "${title}"` });
  ok(res, item, 'Đăng văn bản thành công.', 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await Document.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy văn bản.');

  const fields = ['title', 'docNumber', 'docType', 'issuer', 'issuedDate', 'summary', 'category', 'status'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });

  if (req.file) {
    item.fileUrl = `/uploads/documents/${req.file.filename}`;
    item.fileName = req.file.originalname;
    item.fileSize = req.file.size;
    item.fileType = req.file.mimetype;
  }

  if (req.body.title && req.body.title !== item.title) {
    item.slug = await uniqueSlug(Document, req.body.title, item._id);
  }

  await item.save();
  await logAction(req, { action: 'update', module: 'document', targetId: item._id, description: `Cập nhật văn bản "${item.title}"` });
  ok(res, item, 'Cập nhật thành công.');
});

const remove = asyncHandler(async (req, res) => {
  const item = await Document.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy văn bản.');
  await item.deleteOne();
  await logAction(req, { action: 'delete', module: 'document', targetId: req.params.id, description: `Xoá văn bản "${item.title}"` });
  ok(res, null, 'Đã xoá văn bản.');
});

// ---------- PUBLIC ----------

const publicList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search = '', docType = '', category = '' } = req.query;
  const query = { status: 'published' };
  if (search) query.$text = { $search: search };
  if (docType) query.docType = docType;
  if (category) query.category = category;

  const [items, total] = await Promise.all([
    Document.find(query)
      .sort({ issuedDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Document.countDocuments(query),
  ]);

  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

const publicDownload = asyncHandler(async (req, res) => {
  const item = await Document.findOneAndUpdate(
    { _id: req.params.id, status: 'published' },
    { $inc: { downloadCount: 1 } },
    { new: true }
  );
  if (!item) throw new ApiError(404, 'Không tìm thấy văn bản.');
  ok(res, { fileUrl: item.fileUrl, fileName: item.fileName });
});

module.exports = { adminList, create, update, remove, publicList, publicDownload };
