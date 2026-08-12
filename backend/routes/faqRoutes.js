const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const ctrl = require('../controllers/faqController');

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.FAQ_MANAGE), ctrl.adminList);
adminRouter.put('/:id/answer', authorize(PERMISSIONS.FAQ_MANAGE), ctrl.answer);
adminRouter.delete('/:id', authorize(PERMISSIONS.FAQ_MANAGE), ctrl.remove);

const publicRouter = express.Router();
publicRouter.get('/', ctrl.publicList);
publicRouter.post('/', ctrl.submit);

module.exports = { adminRouter, publicRouter };
