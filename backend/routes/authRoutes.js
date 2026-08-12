const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', protect, ctrl.logout);
router.get('/me', protect, ctrl.me);
router.put('/change-password', protect, ctrl.changePassword);

module.exports = router;
