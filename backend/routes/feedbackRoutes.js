const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const { uploadDocument } = require('../middleware/upload');
const ctrl = require('../controllers/feedbackController');

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' },
});

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.FEEDBACK_VIEW, PERMISSIONS.FEEDBACK_MANAGE), ctrl.adminList);
adminRouter.get('/:id', authorize(PERMISSIONS.FEEDBACK_VIEW, PERMISSIONS.FEEDBACK_MANAGE), ctrl.adminGet);
adminRouter.put('/:id/status', authorize(PERMISSIONS.FEEDBACK_MANAGE), ctrl.updateStatus);
adminRouter.post('/:id/responses', authorize(PERMISSIONS.FEEDBACK_MANAGE), ctrl.addResponse);

const publicRouter = express.Router();
publicRouter.post('/', submitLimiter, uploadDocument.array('attachments', 5), ctrl.submit);
publicRouter.post('/track', ctrl.track);

module.exports = { adminRouter, publicRouter };
