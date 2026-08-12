const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const ctrl = require('../controllers/organizationController');

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.ORGANIZATION_VIEW, PERMISSIONS.ORGANIZATION_MANAGE), ctrl.adminList);
adminRouter.post('/', authorize(PERMISSIONS.ORGANIZATION_MANAGE), ctrl.create);
adminRouter.put('/:id', authorize(PERMISSIONS.ORGANIZATION_MANAGE), ctrl.update);
adminRouter.delete('/:id', authorize(PERMISSIONS.ORGANIZATION_MANAGE), ctrl.remove);

const publicRouter = express.Router();
publicRouter.get('/', ctrl.publicTree);

module.exports = { adminRouter, publicRouter };
