import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
  const drawerRef = useRef(null);

  const title = TITLES[location.pathname.replace(/\/+$/, '')] || 'Trang quản trị';

  const closeDrawer = () => drawerRef.current?.close();

  const openDrawer = () => {
    drawerRef.current.showModal();
    setMobileOpen(true);
  };

  useEffect(() => {
    drawerRef.current?.close();
  }, [location.key]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => {
      if (event.matches) drawerRef.current?.close();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <div className="flex min-h-screen bg-ink-50">
      <div className="sticky top-0 hidden h-dvh w-64 shrink-0 self-start lg:block">
        <Sidebar />
      </div>

      <dialog
        ref={drawerRef}
        id="admin-mobile-nav"
        aria-label="Menu quản trị"
        onClose={() => setMobileOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDrawer();
        }}
        className="fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-[min(18rem,calc(100vw-3rem))] max-w-none overflow-hidden bg-ink-800 p-0 backdrop:bg-ink-900/60"
      >
        <Sidebar onClose={closeDrawer} />
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar key={location.pathname} title={title} mobileOpen={mobileOpen} onOpenMenu={openDrawer} />
        <main className="mx-auto w-full max-w-[100rem] flex-1 p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
