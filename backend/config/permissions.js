/**
 * Danh sách toàn bộ quyền (permission) trong hệ thống.
 * Mỗi Role sở hữu một tập hợp con của danh sách này.
 * Thêm module mới -> thêm quyền tương ứng tại đây -> dùng trong routes bằng middleware authorize().
 */
const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',

  USER_VIEW: 'user.view',
  USER_MANAGE: 'user.manage',

  ROLE_MANAGE: 'role.manage',

  NEWS_VIEW: 'news.view',
  NEWS_MANAGE: 'news.manage',

  DOCUMENT_VIEW: 'document.view',
  DOCUMENT_MANAGE: 'document.manage',

  ORGANIZATION_VIEW: 'organization.view',
  ORGANIZATION_MANAGE: 'organization.manage',

  BANNER_MANAGE: 'banner.manage',

  MEDIA_MANAGE: 'media.manage',

  FAQ_MANAGE: 'faq.manage',

  FEEDBACK_VIEW: 'feedback.view',
  FEEDBACK_MANAGE: 'feedback.manage',

  AUDITLOG_VIEW: 'auditlog.view',

  SETTINGS_MANAGE: 'settings.manage',
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * Vai trò mặc định được seed sẵn khi khởi tạo hệ thống.
 * key = tên định danh (không đổi), name = tên hiển thị tiếng Việt
 */
const DEFAULT_ROLES = [
  {
    key: 'superadmin',
    name: 'Quản trị hệ thống',
    description: 'Toàn quyền quản trị, bao gồm quản lý người dùng, phân quyền và cấu hình hệ thống.',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
  },
  {
    key: 'union_admin',
    name: 'Cán bộ Công đoàn',
    description: 'Quản lý toàn bộ nội dung, cơ cấu tổ chức, xử lý góp ý/phản ánh/tố cáo.',
    permissions: ALL_PERMISSIONS.filter((p) => p !== PERMISSIONS.ROLE_MANAGE && p !== PERMISSIONS.SETTINGS_MANAGE),
    isSystem: true,
  },
  {
    key: 'editor',
    name: 'Biên tập viên',
    description: 'Quản lý tin tức, văn bản, banner, thư viện ảnh/video, hỏi đáp.',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.NEWS_VIEW,
      PERMISSIONS.NEWS_MANAGE,
      PERMISSIONS.DOCUMENT_VIEW,
      PERMISSIONS.DOCUMENT_MANAGE,
      PERMISSIONS.BANNER_MANAGE,
      PERMISSIONS.MEDIA_MANAGE,
      PERMISSIONS.FAQ_MANAGE,
      PERMISSIONS.ORGANIZATION_VIEW,
    ],
    isSystem: true,
  },
  {
    key: 'member',
    name: 'Đoàn viên',
    description: 'Tài khoản đoàn viên (dự phòng mở rộng - hiện chưa bắt buộc đăng nhập để gửi góp ý).',
    permissions: [],
    isSystem: true,
  },
];

module.exports = { PERMISSIONS, ALL_PERMISSIONS, DEFAULT_ROLES };
