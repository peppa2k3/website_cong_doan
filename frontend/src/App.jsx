import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import OrganizationPage from './pages/public/OrganizationPage';
import NewsListPage from './pages/public/NewsListPage';
import NewsDetailPage from './pages/public/NewsDetailPage';
import DocumentsPage from './pages/public/DocumentsPage';
import FaqPage from './pages/public/FaqPage';
import ContactPage from './pages/public/ContactPage';
import GalleryPage from './pages/public/GalleryPage';
import SearchPage from './pages/public/SearchPage';
import TrackStatusPage from './pages/public/TrackStatusPage';
import NotFoundPage from './pages/NotFoundPage';
import { LoadingSpinner } from './components/common/Feedback';

import { PERMISSIONS } from './utils/permissions';

// Toàn bộ khu vực quản trị (kèm trình soạn thảo rich-text nặng) được tách chunk riêng,
// để khách truy cập website công khai không phải tải mã nguồn khu quản trị.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const NewsAdminPage = lazy(() => import('./pages/admin/NewsAdminPage'));
const DocumentsAdminPage = lazy(() => import('./pages/admin/DocumentsAdminPage'));
const OrganizationAdminPage = lazy(() => import('./pages/admin/OrganizationAdminPage'));
const BannerAdminPage = lazy(() => import('./pages/admin/BannerAdminPage'));
const MediaAdminPage = lazy(() => import('./pages/admin/MediaAdminPage'));
const FaqAdminPage = lazy(() => import('./pages/admin/FaqAdminPage'));
const FeedbackAdminPage = lazy(() => import('./pages/admin/FeedbackAdminPage'));
const UsersAdminPage = lazy(() => import('./pages/admin/UsersAdminPage'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

function AdminSuspense({ children }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-ink-50"><LoadingSpinner label="Đang tải khu vực quản trị..." /></div>}>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* ---- Website công khai ---- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/co-cau-to-chuc" element={<OrganizationPage />} />
          <Route path="/tin-tuc" element={<NewsListPage pageTitle="Tin tức" pageSubtitle="Cập nhật tin tức, thông báo mới nhất từ Công đoàn." />} />
          <Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />
          <Route path="/hoat-dong" element={<NewsListPage fixedCategory="hoat_dong" pageTitle="Hoạt động truyền thông" pageSubtitle="Hình ảnh, bài viết về các hoạt động, sự kiện của Công đoàn." />} />
          <Route path="/van-ban" element={<DocumentsPage />} />
          <Route path="/hoi-dap" element={<FaqPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/thu-vien" element={<GalleryPage />} />
          <Route path="/tra-cuu" element={<TrackStatusPage />} />
          <Route path="/tim-kiem" element={<SearchPage />} />
        </Route>

        {/* ---- Đăng nhập quản trị ---- */}
        <Route path="/admin/login" element={<AdminSuspense><LoginPage /></AdminSuspense>} />

        {/* ---- Trang quản trị ---- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminSuspense><AdminLayout /></AdminSuspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSuspense><DashboardPage /></AdminSuspense>} />
          <Route path="news" element={<ProtectedRoute permissions={[PERMISSIONS.NEWS_VIEW, PERMISSIONS.NEWS_MANAGE]}><AdminSuspense><NewsAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="documents" element={<ProtectedRoute permissions={[PERMISSIONS.DOCUMENT_VIEW, PERMISSIONS.DOCUMENT_MANAGE]}><AdminSuspense><DocumentsAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="organization" element={<ProtectedRoute permissions={[PERMISSIONS.ORGANIZATION_VIEW, PERMISSIONS.ORGANIZATION_MANAGE]}><AdminSuspense><OrganizationAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="banners" element={<ProtectedRoute permissions={[PERMISSIONS.BANNER_MANAGE]}><AdminSuspense><BannerAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="media" element={<ProtectedRoute permissions={[PERMISSIONS.MEDIA_MANAGE]}><AdminSuspense><MediaAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="faqs" element={<ProtectedRoute permissions={[PERMISSIONS.FAQ_MANAGE]}><AdminSuspense><FaqAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="feedback" element={<ProtectedRoute permissions={[PERMISSIONS.FEEDBACK_VIEW, PERMISSIONS.FEEDBACK_MANAGE]}><AdminSuspense><FeedbackAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute permissions={[PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE]}><AdminSuspense><UsersAdminPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="audit-logs" element={<ProtectedRoute permissions={[PERMISSIONS.AUDITLOG_VIEW]}><AdminSuspense><AuditLogPage /></AdminSuspense></ProtectedRoute>} />
          <Route path="settings" element={<AdminSuspense><SettingsPage /></AdminSuspense>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ToastProvider>
  );
}
