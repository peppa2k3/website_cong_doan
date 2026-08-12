const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok, paginated } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const Faq = require('../models/Faq');

// ---------- PUBLIC ----------

// GET /api/public/faqs - danh sách câu hỏi đã được trả lời & công khai
const publicList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', category = '' } = req.query;
  const query = { isPublished: true, status: 'da_tra_loi' };
  if (search) query.$text = { $search: search };
  if (category) query.category = category;

  const [items, total] = await Promise.all([
    Faq.find(query)
      .select('-askerEmail')
      .sort({ order: 1, answeredAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Faq.countDocuments(query),
  ]);
  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

// POST /api/public/faqs - gửi câu hỏi mới
const submit = asyncHandler(async (req, res) => {
  const { question, askerName, askerEmail, category } = req.body;
  if (!question) throw new ApiError(400, 'Vui lòng nhập nội dung câu hỏi.');

  const item = await Faq.create({ question, askerName, askerEmail, category });
  ok(res, { id: item._id }, 'Gửi câu hỏi thành công. Công đoàn sẽ phản hồi sớm nhất.', 201);
});

// ---------- ADMIN ----------

const adminList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status = '', search = '' } = req.query;
  const query = {};
  if (status) query.status = status;
  if (search) query.$text = { $search: search };

  const [items, total] = await Promise.all([
    Faq.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Faq.countDocuments(query),
  ]);
  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

const answer = asyncHandler(async (req, res) => {
  const { answer: answerText, isPublished } = req.body;
  const item = await Faq.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy câu hỏi.');

  if (answerText !== undefined) {
    item.answer = answerText;
    item.status = 'da_tra_loi';
    item.answeredBy = req.user._id;
    item.answeredAt = new Date();
  }
  if (isPublished !== undefined) item.isPublished = isPublished;

  await item.save();
  await logAction(req, { action: 'update', module: 'faq', targetId: item._id, description: `Trả lời câu hỏi "${item.question.slice(0, 50)}"` });
  ok(res, item, 'Đã lưu câu trả lời.');
});

const remove = asyncHandler(async (req, res) => {
  const item = await Faq.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');
  await item.deleteOne();
  await logAction(req, { action: 'delete', module: 'faq', targetId: req.params.id, description: 'Xoá câu hỏi' });
  ok(res, null, 'Đã xoá.');
});

module.exports = { publicList, submit, adminList, answer, remove };
