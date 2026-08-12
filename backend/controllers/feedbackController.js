const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok, paginated } = require('../utils/response');
const { logAction } = require('../middleware/auditLogger');
const { generateTrackingCode } = require('../utils/tokens');
const Feedback = require('../models/Feedback');

const TYPE_PREFIX = { gop_y: 'GY', phan_anh: 'PA', to_cao: 'TC' };

// ---------- PUBLIC ----------

// POST /api/public/feedback - gửi góp ý / phản ánh / tố cáo
const submit = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    content,
    isAnonymous,
    submitterName,
    submitterEmail,
    submitterPhone,
    submitterDepartment,
    lookupPin,
  } = req.body;

  if (!type || !['gop_y', 'phan_anh', 'to_cao'].includes(type)) {
    throw new ApiError(400, 'Loại phản ánh không hợp lệ.');
  }
  if (!title || !content) throw new ApiError(400, 'Vui lòng nhập tiêu đề và nội dung.');
  if (!isAnonymous && (!submitterName || !submitterEmail)) {
    throw new ApiError(400, 'Vui lòng cung cấp họ tên và email liên hệ, hoặc chọn gửi ẩn danh.');
  }
  if (!lookupPin || lookupPin.length < 4) {
    throw new ApiError(400, 'Vui lòng đặt mã PIN (tối thiểu 4 số) để tra cứu trạng thái xử lý sau này.');
  }

  let trackingCode;
  let exists = true;
  while (exists) {
    trackingCode = generateTrackingCode(TYPE_PREFIX[type]);
    // eslint-disable-next-line no-await-in-loop
    exists = await Feedback.exists({ trackingCode });
  }

  const attachments = (req.files || []).map((f) => ({
    name: f.originalname,
    url: `/uploads/documents/${f.filename}`,
    size: f.size,
  }));

  const lookupPinHash = await bcrypt.hash(String(lookupPin), 10);

  const item = await Feedback.create({
    type,
    trackingCode,
    title,
    content,
    attachments,
    isAnonymous: !!isAnonymous,
    submitterName: isAnonymous ? '' : submitterName,
    submitterEmail: isAnonymous ? '' : submitterEmail,
    submitterPhone: isAnonymous ? '' : submitterPhone,
    submitterDepartment: isAnonymous ? '' : submitterDepartment,
    lookupPinHash,
    ipAddress: req.ip,
  });

  ok(
    res,
    { trackingCode: item.trackingCode },
    'Gửi thành công. Vui lòng lưu lại mã tra cứu để theo dõi trạng thái xử lý.',
    201
  );
});

// POST /api/public/feedback/track - tra cứu trạng thái bằng mã + PIN
const track = asyncHandler(async (req, res) => {
  const { trackingCode, lookupPin } = req.body;
  if (!trackingCode || !lookupPin) throw new ApiError(400, 'Vui lòng nhập mã tra cứu và mã PIN.');

  const item = await Feedback.findOne({ trackingCode: trackingCode.toUpperCase().trim() }).select('+lookupPinHash');
  if (!item) throw new ApiError(404, 'Không tìm thấy phản ánh với mã tra cứu này.');

  const isMatch = await bcrypt.compare(String(lookupPin), item.lookupPinHash || '');
  if (!isMatch) throw new ApiError(401, 'Mã PIN không đúng.');

  ok(res, {
    trackingCode: item.trackingCode,
    type: item.type,
    title: item.title,
    status: item.status,
    createdAt: item.createdAt,
    responses: item.responses,
  });
});

// ---------- ADMIN ----------

const adminList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type = '', status = '', priority = '' } = req.query;
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const [items, total] = await Promise.all([
    Feedback.find(query)
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Feedback.countDocuments(query),
  ]);
  paginated(res, { items, total, page: Number(page), limit: Number(limit) });
});

const adminGet = asyncHandler(async (req, res) => {
  const item = await Feedback.findById(req.params.id).populate('assignedTo', 'fullName');
  if (!item) throw new ApiError(404, 'Không tìm thấy.');
  ok(res, item);
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo } = req.body;
  const item = await Feedback.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');

  if (status) item.status = status;
  if (priority) item.priority = priority;
  if (assignedTo !== undefined) item.assignedTo = assignedTo || null;

  await item.save();
  await logAction(req, {
    action: 'update',
    module: 'feedback',
    targetId: item._id,
    description: `Cập nhật trạng thái phản ánh "${item.trackingCode}" -> ${item.status}`,
  });
  ok(res, item, 'Cập nhật thành công.');
});

const addResponse = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(400, 'Vui lòng nhập nội dung phản hồi.');

  const item = await Feedback.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Không tìm thấy.');

  item.responses.push({ content, respondedBy: req.user._id, respondedByName: req.user.fullName });
  if (item.status === 'moi') item.status = 'dang_xu_ly';
  await item.save();

  await logAction(req, {
    action: 'update',
    module: 'feedback',
    targetId: item._id,
    description: `Phản hồi phản ánh "${item.trackingCode}"`,
  });
  ok(res, item, 'Đã gửi phản hồi.');
});

module.exports = { submit, track, adminList, adminGet, updateStatus, addResponse };
