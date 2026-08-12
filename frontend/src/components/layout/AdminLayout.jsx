import React, { useState } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES = {
  '/admin': 'Tổng quan hệ thống',
  '/admin/news': 'Quản lý Tin tức & Thông báo',
  '/admin/documents': 'Quản lý Văn bản',
  '/admin/organization': 'Quản lý Cơ cấu tổ chức',
  '/admin/banners': 'Quản lý Banner',
  '/admin/media': 'Quản lý Thư viện ảnh/video',
  '/admin/faqs': 'Quản lý Hỏi đáp',
  '/admin/feedback': 'Góp ý / Phản ánh / Tố cáo',
  '/admin/users': 'Người dùng & Phân quyền',
  '/admin/audit-logs': 'Nhật ký hệ thống',
  '/admin/settings': 'Tài khoản của tôi',
};

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const matched = Object.keys(TITLES).find((path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path)));
  const title = TITLES[matched] || 'Trang quản trị';

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 bg-ink-800">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-ink-300 hover:bg-ink-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3">
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-200 hover:bg-ink-700">Tổng quan</NavLink>
            </div>
          </div>
          <div className="flex-1 bg-ink-900/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b border-line bg-white px-4 py-2 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-ink-600 hover:bg-ink-50">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <Topbar title={title} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
