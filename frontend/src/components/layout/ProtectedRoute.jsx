import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/Feedback';

export default function ProtectedRoute({ children, permissions = [] }) {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <LoadingSpinner label="Đang xác thực phiên đăng nhập..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !hasPermission(...permissions)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-2 text-center">
        <p className="font-display text-xl font-bold text-ink-800">Không đủ quyền truy cập</p>
        <p className="text-sm text-ink-500">Tài khoản của bạn không có quyền xem trang này.</p>
      </div>
    );
  }

  return children;
}
