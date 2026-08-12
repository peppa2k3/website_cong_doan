const asyncHandler = require('../middleware/asyncHandler');
const { ok } = require('../utils/response');
const News = require('../models/News');
const Document = require('../models/Document');
const Feedback = require('../models/Feedback');
const Faq = require('../models/Faq');
const User = require('../models/User');
const Media = require('../models/Media');
const AuditLog = require('../models/AuditLog');

const stats = asyncHandler(async (req, res) => {
  const [
    newsPublished,
    newsDraft,
    documentCount,
    feedbackByStatus,
    feedbackByType,
    faqPending,
    userCount,
    mediaCount,
    recentFeedback,
    recentLogs,
    newsViewsAgg,
  ] = await Promise.all([
    News.countDocuments({ status: 'published' }),
    News.countDocuments({ status: 'draft' }),
    Document.countDocuments(),
    Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Feedback.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    Faq.countDocuments({ status: 'cho_duyet' }),
    User.countDocuments(),
    Media.countDocuments(),
    Feedback.find().sort({ createdAt: -1 }).limit(6).select('type title status trackingCode createdAt'),
    AuditLog.find().sort({ createdAt: -1 }).limit(10),
    News.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]),
  ]);

  const feedbackStatusMap = { moi: 0, dang_xu_ly: 0, da_xu_ly: 0, da_dong: 0 };
  feedbackByStatus.forEach((s) => {
    feedbackStatusMap[s._id] = s.count;
  });

  const feedbackTypeMap = { gop_y: 0, phan_anh: 0, to_cao: 0 };
  feedbackByType.forEach((s) => {
    feedbackTypeMap[s._id] = s.count;
  });

  ok(res, {
    news: { published: newsPublished, draft: newsDraft },
    documentCount,
    feedback: { byStatus: feedbackStatusMap, byType: feedbackTypeMap, total: Object.values(feedbackStatusMap).reduce((a, b) => a + b, 0) },
    faqPending,
    userCount,
    mediaCount,
    totalNewsViews: newsViewsAgg[0]?.totalViews || 0,
    recentFeedback,
    recentLogs,
  });
});

module.exports = { stats };
