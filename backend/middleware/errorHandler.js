const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, `Không tìm thấy đường dẫn: ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let { statusCode, message } = err;
  let details = err.details || null;

  if (!statusCode) statusCode = 500;

  // Lỗi trùng khoá duy nhất của Mongo
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'dữ liệu';
    message = `Giá trị của "${field}" đã tồn tại trong hệ thống.`;
  }

  // Lỗi validate của Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors).map((e) => e.message);
    message = 'Dữ liệu không hợp lệ.';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Định dạng ID không hợp lệ.';
  }

  if (statusCode === 500) {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: message || 'Đã xảy ra lỗi hệ thống.',
    details,
  });
}

module.exports = { notFound, errorHandler };
