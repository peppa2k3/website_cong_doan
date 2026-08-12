import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-line bg-white px-6">
      <h1 className="font-display text-lg font-bold text-ink-800">{title}</h1>
      <div className="flex items-center gap-3">
        <a href="/" target="_blank" rel="noreferrer" className="btn-outline !py-2 text-xs">
          <ExternalLink className="h-3.5 w-3.5" /> Xem trang công khai
        </a>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-ink-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-union-500 font-display text-sm font-bold text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-ink-800">{user?.fullName}</p>
              <p className="text-xs text-ink-400">{user?.role?.name}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-ink-400" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-line bg-white py-1 shadow-lift">
              <button
                onClick={() => { setOpen(false); navigate('/admin/settings'); }}
                className="block w-full px-4 py-2 text-left text-sm text-ink-600 hover:bg-ink-50"
              >
                Đổi mật khẩu
              </button>
              <button onClick={doLogout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-union-600 hover:bg-union-50">
                <LogOut className="h-4 w-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
