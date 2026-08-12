const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const { uploadDocument } = require('../middleware/upload');
const ctrl = require('../controllers/documentController');

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.DOCUMENT_VIEW, PERMISSIONS.DOCUMENT_MANAGE), ctrl.adminList);
adminRouter.post('/', authorize(PERMISSIONS.DOCUMENT_MANAGE), uploadDocument.single('file'), ctrl.create);
adminRouter.put('/:id', authorize(PERMISSIONS.DOCUMENT_MANAGE), uploadDocument.single('file'), ctrl.update);
adminRouter.delete('/:id', authorize(PERMISSIONS.DOCUMENT_MANAGE), ctrl.remove);

const publicRouter = express.Router();
publicRouter.get('/', ctrl.publicList);
publicRouter.get('/:id/download', ctrl.publicDownload);

module.exports = { adminRouter, publicRouter };
