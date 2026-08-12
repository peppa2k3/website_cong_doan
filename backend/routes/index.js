const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const news = require('./newsRoutes');
const documents = require('./documentRoutes');
const organizations = require('./organizationRoutes');
const banners = require('./bannerRoutes');
const media = require('./mediaRoutes');
const faqs = require('./faqRoutes');
const feedback = require('./feedbackRoutes');
const { dashboardRouter, searchRouter, auditLogRouter, uploadRouter } = require('./miscRoutes');

const router = express.Router();

// ---- Xác thực & quản trị tài khoản ----
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// ---- Khu vực quản trị (yêu cầu đăng nhập + phân quyền, xem trong từng route file) ----
router.use('/news', news.adminRouter);
router.use('/documents', documents.adminRouter);
router.use('/organizations', organizations.adminRouter);
router.use('/banners', banners.adminRouter);
router.use('/media', media.adminRouter);
router.use('/faqs', faqs.adminRouter);
router.use('/feedback', feedback.adminRouter);
router.use('/dashboard', dashboardRouter);
router.use('/auditlogs', auditLogRouter);
router.use('/uploads', uploadRouter);

// ---- Khu vực công khai (không yêu cầu đăng nhập) ----
router.use('/public/news', news.publicRouter);
router.use('/public/documents', documents.publicRouter);
router.use('/public/organizations', organizations.publicRouter);
router.use('/public/banners', banners.publicRouter);
router.use('/public/media', media.publicRouter);
router.use('/public/faqs', faqs.publicRouter);
router.use('/public/feedback', feedback.publicRouter);
router.use('/public/search', searchRouter);

module.exports = router;
