const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { PERMISSIONS } = require('../config/permissions');
const ctrl = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/roles/all', authorize(PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE), ctrl.listRoles);

router.get('/', authorize(PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE), ctrl.listUsers);
router.get('/:id', authorize(PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE), ctrl.getUser);
router.post('/', authorize(PERMISSIONS.USER_MANAGE), ctrl.createUser);
router.put('/:id', authorize(PERMISSIONS.USER_MANAGE), ctrl.updateUser);
router.put('/:id/reset-password', authorize(PERMISSIONS.USER_MANAGE), ctrl.resetPassword);
router.delete('/:id', authorize(PERMISSIONS.USER_MANAGE), ctrl.deleteUser);

module.exports = router;
