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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';
import UnionSeal from '../common/UnionSeal';

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

export default function Sidebar() {
  const { hasPermission } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-700 bg-ink-800 text-ink-200 lg:flex">
      <div className="flex h-[72px] items-center gap-3 border-b border-ink-700 px-5">
        {/* <UnionSeal size={34} spin={false} className="text-brass-400" /> */}
        <img src="/hhcd.svg" alt="My SVG Logo" width="40" height="40"></img>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-white">Trang quản trị</p>
          <p className="text-[11px] text-ink-400">Công đoàn cơ sở</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {ITEMS.filter((item) => {
          const perms = Array.isArray(item.perm) ? item.perm : [item.perm];
          return hasPermission(...perms);
        }).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-union-500 text-white' : 'text-ink-300 hover:bg-ink-700 hover:text-white'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ink-700 p-3">
        <NavLink to="/admin/settings" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-700 hover:text-white">
          <Settings className="h-[18px] w-[18px]" /> Tài khoản của tôi
        </NavLink>
      </div>
    </aside>
  );
}
