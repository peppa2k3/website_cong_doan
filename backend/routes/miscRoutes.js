const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const { uploadImage } = require('../middleware/upload');

const dashboardCtrl = require('../controllers/dashboardController');
const searchCtrl = require('../controllers/searchController');
const auditLogCtrl = require('../controllers/auditLogController');
const uploadCtrl = require('../controllers/uploadController');

const dashboardRouter = express.Router();
dashboardRouter.get('/stats', protect, authorize(PERMISSIONS.DASHBOARD_VIEW), dashboardCtrl.stats);

const searchRouter = express.Router();
searchRouter.get('/', searchCtrl.search);

const auditLogRouter = express.Router();
auditLogRouter.get('/', protect, authorize(PERMISSIONS.AUDITLOG_VIEW), auditLogCtrl.list);

const uploadRouter = express.Router();
uploadRouter.post('/image', protect, uploadImage.single('image'), uploadCtrl.uploadSingleImage);

module.exports = { dashboardRouter, searchRouter, auditLogRouter, uploadRouter };
