const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const ctrl = require('../controllers/newsController');

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', authorize(PERMISSIONS.NEWS_VIEW, PERMISSIONS.NEWS_MANAGE), ctrl.adminList);
adminRouter.get('/:id', authorize(PERMISSIONS.NEWS_VIEW, PERMISSIONS.NEWS_MANAGE), ctrl.adminGet);
adminRouter.post('/', authorize(PERMISSIONS.NEWS_MANAGE), ctrl.create);
adminRouter.put('/:id', authorize(PERMISSIONS.NEWS_MANAGE), ctrl.update);
adminRouter.delete('/:id', authorize(PERMISSIONS.NEWS_MANAGE), ctrl.remove);

const publicRouter = express.Router();
publicRouter.get('/highlights', ctrl.publicHighlights);
publicRouter.get('/:slug', ctrl.publicGetBySlug);
publicRouter.get('/', ctrl.publicList);

module.exports = { adminRouter, publicRouter };
