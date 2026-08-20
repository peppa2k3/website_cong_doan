import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShieldCheck, Phone, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/gioi-thieu', label: 'Giới thiệu' },
  { to: '/co-cau-to-chuc', label: 'Cơ cấu tổ chức' },
  { to: '/tin-tuc', label: 'Tin tức' },
  { to: '/hoat-dong', label: 'Hoạt động' },
  { to: '/van-ban', label: 'Văn bản' },
  { to: '/hoi-dap', label: 'Hỏi đáp' },
  { to: '/lien-he', label: 'Liên hệ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100">
      {/* Thanh tiện ích trên cùng (Topbar) */}
      <div className="hidden bg-slate-900 text-slate-200 md:block border-b border-slate-800">
        <div className="container-page flex h-9 items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-amber-400" />
            <span>Đường dây nóng Công đoàn: <strong className="text-amber-300 font-bold">1900 xxxx</strong></span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/tra-cuu" className="hover:text-amber-300 transition-colors">
              Tra cứu trạng thái xử lý
            </Link>
            <span className="text-slate-700">|</span>
            <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Đăng nhập quản trị
            </Link>
          </div>
        </div>
      </div>

      {/* Thanh chính: Logo + Menu + Tìm kiếm */}
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="p-1.5 rounded-xl bg-blue-50 border border-blue-100 group-hover:scale-105 transition-transform duration-200">
            <img src="/hhcd.svg" alt="Logo CĐCS Billion" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
          </div>
          <div className="leading-tight">
            <p className="font-black text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              CĐCS BILLION
            </p>
            <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              Cổng thông tin điện tử
            </p>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-xl px-3.5 py-2 text-base font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-800 hover:bg-slate-100 hover:text-blue-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* CỤM TÌM KIẾM & NÚT HÀNH ĐỘNG */}
        <div className="flex items-center gap-3">
          {/* Form tìm kiếm Desktop */}
          <form onSubmit={submitSearch} className="relative hidden xl:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm thông tin..."
              className="w-40 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-medium text-slate-800 focus:w-56 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-inner"
              aria-label="Tìm kiếm toàn website"
            />
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          {/* Nút gửi phản ánh */}
          <Link
            to="/lien-he#gui-phan-anh"
            className="hidden md:inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-orange-500/20 active:scale-95 transition-all"
          >
            Gửi phản ánh
          </Link>

          {/* Nút Toggle Mobile Menu */}
          <button
            className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Mở menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE (Mở rộng linh hoạt & Dễ chạm) */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          {/* Form tìm kiếm Mobile */}
          <form onSubmit={submitSearch} className="relative mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm tin tức, văn bản..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </form>

          {/* Danh sách trang Mobile */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                  }`
                }
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>
            ))}

            <div className="my-2 border-t border-slate-100" />

            {/* Các tiện ích mở rộng trên Mobile */}
            <Link
              to="/tra-cuu"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              <span>Tra cứu trạng thái xử lý</span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Đăng nhập quản trị</span>
            </Link>

            {/* Nút hành động chính Mobile */}
            <Link
              to="/lien-he#gui-phan-anh"
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-black text-white shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              Gửi phản ánh ngay
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}