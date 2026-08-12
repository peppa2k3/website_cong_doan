const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const { uploadImage } = require('../middleware/upload');
const ctrl = require('../controllers/bannerController');

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.BANNER_MANAGE), ctrl.adminList);
adminRouter.post('/', authorize(PERMISSIONS.BANNER_MANAGE), uploadImage.single('image'), ctrl.create);
adminRouter.put('/:id', authorize(PERMISSIONS.BANNER_MANAGE), uploadImage.single('image'), ctrl.update);
adminRouter.delete('/:id', authorize(PERMISSIONS.BANNER_MANAGE), ctrl.remove);

const publicRouter = express.Router();
publicRouter.get('/', ctrl.publicList);

module.exports = { adminRouter, publicRouter };
