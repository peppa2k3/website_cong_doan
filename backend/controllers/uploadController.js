const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');

// POST /api/uploads/image - dùng cho ảnh đại diện, thumbnail, ảnh chèn trong nội dung soạn thảo
const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Vui lòng chọn file hình ảnh.');
  ok(res, { url: `/uploads/images/${req.file.filename}` }, 'Tải lên thành công.', 201);
});

module.exports = { uploadSingleImage };
