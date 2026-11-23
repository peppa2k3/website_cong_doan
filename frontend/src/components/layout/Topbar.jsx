import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, ExternalLink, Menu, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, mobileOpen, onOpenMenu }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const accountButton = useRef(null);
  const accountOptions = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!accountOptions.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  const doLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-line bg-white px-3 py-2 sm:min-h-[4.5rem] sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line text-ink-700 hover:bg-ink-50 lg:hidden"
          aria-label="Mở menu quản trị"
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="font-display text-sm font-bold leading-snug text-ink-800 sm:text-lg">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-line px-2 text-xs font-semibold text-ink-700 hover:bg-ink-50 sm:px-3"
          aria-label="Xem trang công khai"
          title="Xem trang công khai"
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden xl:inline">Xem trang công khai</span>
        </a>
        <div
          ref={accountOptions}
          className="relative"
          onBlur={(event) => {
            if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && open) {
              setOpen(false);
              accountButton.current?.focus();
            }
          }}
        >
          <button
            ref={accountButton}
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md p-1 hover:bg-ink-50 sm:px-2"
            aria-label="Tùy chọn tài khoản"
            aria-expanded={open}
            aria-controls={open ? 'admin-account-options' : undefined}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-union-500 font-display text-sm font-bold text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <span className="hidden max-w-36 text-left md:block">
              <span className="block truncate text-sm font-semibold text-ink-800">{user?.fullName}</span>
              <span className="block truncate text-xs text-ink-400">{user?.role?.name}</span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-ink-400 sm:block" aria-hidden="true" />
          </button>
          {open && (
            <div id="admin-account-options" className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-line bg-white p-1 shadow-lift">
              <div className="border-b border-line px-3 py-2 md:hidden">
                <p className="break-words text-sm font-semibold text-ink-800">{user?.fullName}</p>
                <p className="break-words text-xs text-ink-400">{user?.role?.name}</p>
              </div>
              <Link
                to="/admin/settings"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-ink-700 hover:bg-ink-50"
              >
                <Settings className="h-4 w-4" aria-hidden="true" /> Đổi mật khẩu
              </Link>
              <button type="button" onClick={doLogout} className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm text-union-600 hover:bg-union-50">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
