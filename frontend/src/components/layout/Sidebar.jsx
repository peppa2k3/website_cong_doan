import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Users2,
  Image,
  Images,
  HelpCircle,
  MessageSquareWarning,
  ScrollText,
  UsersRound,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

const ITEMS = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, perm: PERMISSIONS.DASHBOARD_VIEW, end: true },
  { to: '/admin/news', label: 'Tin tức & Thông báo', icon: Newspaper, perm: [PERMISSIONS.NEWS_VIEW, PERMISSIONS.NEWS_MANAGE] },
  { to: '/admin/documents', label: 'Văn bản', icon: FileText, perm: [PERMISSIONS.DOCUMENT_VIEW, PERMISSIONS.DOCUMENT_MANAGE] },
  { to: '/admin/organization', label: 'Cơ cấu tổ chức', icon: UsersRound, perm: [PERMISSIONS.ORGANIZATION_VIEW, PERMISSIONS.ORGANIZATION_MANAGE] },
  { to: '/admin/banners', label: 'Banner', icon: Image, perm: PERMISSIONS.BANNER_MANAGE },
  { to: '/admin/media', label: 'Thư viện ảnh/video', icon: Images, perm: PERMISSIONS.MEDIA_MANAGE },
  { to: '/admin/faqs', label: 'Hỏi đáp', icon: HelpCircle, perm: PERMISSIONS.FAQ_MANAGE },
  { to: '/admin/feedback', label: 'Góp ý / Phản ánh / Tố cáo', icon: MessageSquareWarning, perm: [PERMISSIONS.FEEDBACK_VIEW, PERMISSIONS.FEEDBACK_MANAGE] },
  { to: '/admin/users', label: 'Người dùng & Phân quyền', icon: Users2, perm: [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE] },
  { to: '/admin/audit-logs', label: 'Nhật ký hệ thống', icon: ScrollText, perm: PERMISSIONS.AUDITLOG_VIEW },
];

export default function Sidebar({ onClose }) {
  const { hasPermission } = useAuth();

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-ink-700 bg-ink-800 text-ink-100">
      <div className="flex min-h-[4.5rem] shrink-0 items-center gap-3 border-b border-ink-700 px-4">
        <img src="/hhcd.svg" alt="" width="40" height="40" className="shrink-0" />
        <div className="flex-1 leading-tight">
          <p className="font-display text-sm font-bold text-white">Trang quản trị</p>
          <p className="mt-0.5 text-xs text-ink-200">Công đoàn cơ sở</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-md hover:bg-ink-700" aria-label="Đóng menu quản trị">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <nav aria-label="Điều hướng quản trị" className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-3">
        {ITEMS.filter((item) => {
          const perms = Array.isArray(item.perm) ? item.perm : [item.perm];
          return hasPermission(...perms);
        }).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium leading-snug transition-colors ${
                isActive ? 'bg-union-500 text-white' : 'hover:bg-ink-700 hover:text-white'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="shrink-0 border-t border-ink-700 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <NavLink
          to="/admin/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-union-500 text-white' : 'hover:bg-ink-700 hover:text-white'}`
          }
        >
          <Settings className="h-[18px] w-[18px] shrink-0" aria-hidden="true" /> Tài khoản của tôi
        </NavLink>
      </div>
    </aside>
  );
}
