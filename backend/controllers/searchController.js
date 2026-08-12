const asyncHandler = require('../middleware/asyncHandler');
const { ok } = require('../utils/response');
const News = require('../models/News');
const Document = require('../models/Document');
const Faq = require('../models/Faq');

// GET /api/public/search?q=...
const search = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  if (!q || q.trim().length < 2) {
    return ok(res, { news: [], documents: [], faqs: [] }, 'Vui lòng nhập ít nhất 2 ký tự.');
  }

  const [news, documents, faqs] = await Promise.all([
    News.find({ status: 'published', $text: { $search: q } })
      .select('title slug summary thumbnail category publishedAt')
      .limit(8),
    Document.find({ status: 'published', $text: { $search: q } })
      .select('title slug docNumber docType issuedDate fileUrl')
      .limit(8),
    Faq.find({ isPublished: true, status: 'da_tra_loi', $text: { $search: q } })
      .select('question answer')
      .limit(5),
  ]);

  ok(res, { news, documents, faqs });
});

module.exports = { search };
