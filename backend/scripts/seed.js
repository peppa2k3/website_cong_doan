require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { DEFAULT_ROLES } = require('../config/permissions');
const Role = require('../models/Role');
const User = require('../models/User');
const Organization = require('../models/Organization');
const News = require('../models/News');

async function seedRoles() {
  const roleMap = {};
  for (const roleDef of DEFAULT_ROLES) {
    // eslint-disable-next-line no-await-in-loop
    const role = await Role.findOneAndUpdate(
      { key: roleDef.key },
      { $set: roleDef },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    roleMap[roleDef.key] = role;
  }
  console.log('[Seed] Đã tạo/cập nhật', Object.keys(roleMap).length, 'vai trò.');
  return roleMap;
}

async function seedSuperAdmin(roleMap) {
  const username = (process.env.SEED_ADMIN_USERNAME || 'superadmin').toLowerCase();
  const existing = await User.findOne({ username });
  if (existing) {
    console.log('[Seed] Tài khoản superadmin đã tồn tại, bỏ qua.');
    return existing;
  }

  const user = await User.create({
    fullName: process.env.SEED_ADMIN_NAME || 'Quản trị hệ thống',
    username,
    email: process.env.SEED_ADMIN_EMAIL || 'superadmin@congdoan.local',
    password: process.env.SEED_ADMIN_PASSWORD || 'DoiMatKhauNgay!123',
    role: roleMap.superadmin._id,
  });
  console.log(`[Seed] Đã tạo tài khoản superadmin: ${username} / (mật khẩu trong .env) — HÃY ĐỔI MẬT KHẨU SAU KHI ĐĂNG NHẬP LẦN ĐẦU.`);
  return user;
}

async function seedOrganization() {
  const count = await Organization.countDocuments();
  if (count > 0) {
    console.log('[Seed] Cơ cấu tổ chức đã có dữ liệu, bỏ qua.');
    return;
  }
  const chuTich = await Organization.create({
    fullName: 'Nguyễn Văn A',
    position: 'Chủ tịch Công đoàn',
    unit: 'ban_chap_hanh',
    order: 1,
  });
  await Organization.create([
    {
      fullName: 'Trần Thị B',
      position: 'Phó Chủ tịch Công đoàn',
      unit: 'ban_chap_hanh',
      parent: chuTich._id,
      order: 2,
    },
    {
      fullName: 'Lê Văn C',
      position: 'Uỷ viên Ban Chấp hành',
      unit: 'ban_chap_hanh',
      parent: chuTich._id,
      order: 3,
    },
    {
      fullName: 'Phạm Thị D',
      position: 'Trưởng Ban Kiểm tra',
      unit: 'uy_ban_kiem_tra',
      order: 1,
    },
  ]);
  console.log('[Seed] Đã tạo dữ liệu mẫu cho cơ cấu tổ chức.');
}

async function seedNews(admin) {
  const count = await News.countDocuments();
  if (count > 0) {
    console.log('[Seed] Tin tức đã có dữ liệu, bỏ qua.');
    return;
  }
  await News.create([
    {
      title: 'Chào mừng đến với Cổng thông tin Công đoàn',
      slug: 'chao-mung-den-voi-cong-thong-tin-cong-doan',
      summary: 'Cổng thông tin điện tử chính thức của Công đoàn chính thức đi vào hoạt động.',
      content:
        '<p>Cổng thông tin điện tử Công đoàn được xây dựng nhằm cung cấp thông tin kịp thời, minh bạch đến toàn thể đoàn viên, người lao động.</p>',
      category: 'thong_bao',
      status: 'published',
      isPinned: true,
      isFeatured: true,
      author: admin._id,
      publishedAt: new Date(),
    },
  ]);
  console.log('[Seed] Đã tạo tin tức mẫu.');
}

async function run() {
  await connectDB();
  const roleMap = await seedRoles();
  const admin = await seedSuperAdmin(roleMap);
  await seedOrganization();
  await seedNews(admin);
  console.log('[Seed] Hoàn tất.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('[Seed] Lỗi:', err);
  process.exit(1);
});
