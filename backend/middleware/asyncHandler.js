// Bọc các controller async để lỗi tự động chuyển tới errorHandler thay vì làm crash server
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
