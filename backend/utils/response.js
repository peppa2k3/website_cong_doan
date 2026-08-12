const slugify = require('slugify');

function ok(res, data, message = 'Thành công', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

function paginated(res, { items, total, page, limit }, message = 'Thành công') {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

async function uniqueSlug(Model, text, excludeId = null) {
  const base = slugify(text, { lower: true, strict: true, locale: 'vi' }) || `muc-${Date.now()}`;
  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

module.exports = { ok, paginated, uniqueSlug };
