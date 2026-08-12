const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const { uploadMedia } = require('../middleware/upload');
const ctrl = require('../controllers/mediaController');

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.MEDIA_MANAGE), ctrl.adminList);
adminRouter.post('/images', authorize(PERMISSIONS.MEDIA_MANAGE), uploadMedia.single('file'), ctrl.createImage);
adminRouter.post('/videos', authorize(PERMISSIONS.MEDIA_MANAGE), uploadMedia.single('file'), ctrl.createVideo);
adminRouter.put('/:id', authorize(PERMISSIONS.MEDIA_MANAGE), ctrl.update);
adminRouter.delete('/:id', authorize(PERMISSIONS.MEDIA_MANAGE), ctrl.remove);

const publicRouter = express.Router();
publicRouter.get('/', ctrl.publicList);

module.exports = { adminRouter, publicRouter };
