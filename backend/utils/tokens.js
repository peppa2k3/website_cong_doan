const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role.toString ? user.role.toString() : user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '2h' }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Sinh mã tra cứu ngắn, dễ đọc cho góp ý/phản ánh/tố cáo, vd: PA-7K3F9D */
function generateTrackingCode(prefix) {
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  return `${prefix}-${rand}`;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  generateTrackingCode,
};
