const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

const BASE_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const DOCUMENT_TYPES = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar'];
const VIDEO_TYPES = ['.mp4', '.mov', '.webm'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function makeStorage(subfolder) {
  const dir = path.join(BASE_UPLOAD_DIR, subfolder);
  ensureDir(dir);
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = crypto.randomBytes(12).toString('hex');
      cb(null, `${Date.now()}-${unique}${ext}`);
    },
  });
}

function fileFilterFor(allowedExts) {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return cb(new ApiError(400, `Định dạng file không được hỗ trợ: ${ext}`));
    }
    cb(null, true);
  };
}

const maxSize = () => (parseInt(process.env.MAX_UPLOAD_MB, 10) || 25) * 1024 * 1024;

const uploadImage = multer({
  storage: makeStorage('images'),
  fileFilter: fileFilterFor(IMAGE_TYPES),
  limits: { fileSize: maxSize() },
});

const uploadDocument = multer({
  storage: makeStorage('documents'),
  fileFilter: fileFilterFor([...DOCUMENT_TYPES, ...IMAGE_TYPES]),
  limits: { fileSize: maxSize() },
});

const uploadMedia = multer({
  storage: makeStorage('media'),
  fileFilter: fileFilterFor([...IMAGE_TYPES, ...VIDEO_TYPES]),
  limits: { fileSize: maxSize() * 4 }, // video lớn hơn
});

module.exports = { uploadImage, uploadDocument, uploadMedia, BASE_UPLOAD_DIR };
