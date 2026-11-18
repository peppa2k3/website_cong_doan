import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShieldCheck, Phone } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white shadow-md relative">
      {/* Thanh tiện ích trên cùng (Desktop) */}
      <div className="hidden bg-sky-800 text-sky-100 md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs px-4">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            <span>Đường dây nóng Công đoàn: 0902 993 488</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/tra-cuu" className="hover:text-white">Tra cứu trạng thái xử lý</Link>
            <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-white">
              <ShieldCheck className="h-3.5 w-3.5" /> Đăng nhập quản trị
            </Link>
          </div>
        </div>
      </div>
  
      {/* Thanh chính: Logo + Menu + Tìm kiếm */}
      <div className="container-page mx-auto flex h-[72px] items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/hhcd.svg" alt="Logo Công đoàn" width="40" height="30" />
          <div className="leading-tight">
            <p className="font-display text-lg sm:text-xl font-bold text-slate-800">CĐCS BILLION VN</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">Cổng thông tin nội bộ</p>
          </div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden items-center gap-1 xl:gap-3 xl:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-800 hover:text-[#00529C] hover:bg-blue-50/60 active:scale-95'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
  
        {/* Nút Tìm kiếm Desktop & Toggle Mobile */}
        <div className="flex items-center gap-3">
          <form onSubmit={submitSearch} className="relative hidden sm:flex items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-28 lg:w-36 focus:w-48 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 py-1.5 pl-3 pr-2 text-sm text-slate-800 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none"
              aria-label="Tìm kiếm toàn website"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-r-lg border border-blue-700 bg-blue-700 px-3 py-2 text-white hover:bg-blue-800 transition-colors duration-200 focus:outline-none"
              title="Tìm kiếm"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Nút Mobile Menu */}
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 xl:hidden focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
  
      {/* Menu mobile: Định vị absolut để đè lên trang, dùng transition mượt mà */}
      <div 
        className={`absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-200 overflow-hidden transition-all duration-300 ease-in-out xl:hidden ${
          open 
            ? 'max-h-[85vh] opacity-100 pointer-events-auto' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pb-6 pt-2 max-h-[85vh] overflow-y-auto">
          <form onSubmit={submitSearch} className="relative mt-3 mb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
            />
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-slate-100 py-3 text-sm font-semibold transition-colors ${
                    isActive ? 'text-blue-700 font-bold bg-blue-50/50 px-2 rounded-md' : 'text-slate-700 hover:text-blue-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link 
              to="/tra-cuu" 
              onClick={() => setOpen(false)} 
              className="border-b border-slate-100 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              Tra cứu trạng thái xử lý
            </Link>
            <Link 
              to="/admin/login" 
              onClick={() => setOpen(false)} 
              className="py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              Đăng nhập quản trị
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}




// import React, { useState } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { Menu, X, Search, ShieldCheck, Phone } from 'lucide-react';
// import UnionSeal from '../common/UnionSeal';

// const NAV_ITEMS = [
//   { to: '/', label: 'Trang chủ' },
//   { to: '/gioi-thieu', label: 'Giới thiệu' },
//   { to: '/co-cau-to-chuc', label: 'Cơ cấu tổ chức' },
//   { to: '/tin-tuc', label: 'Tin tức' },
//   { to: '/hoat-dong', label: 'Hoạt động' },
//   { to: '/van-ban', label: 'Văn bản' },
//   { to: '/hoi-dap', label: 'Hỏi đáp' },
//   { to: '/lien-he', label: 'Liên hệ' },
// ];

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState('');
//   const navigate = useNavigate();

//   const submitSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
//     setQuery('');
//     setOpen(false);
//   };

//     return (
//       <header className="sticky top-0 z-40 bg-slate-150 shadow-sm">
//         {/* Thanh tiện ích trên cùng */}
//         <div className="hidden bg-sky-800 text-ink-100 md:block">
//           <div className="container-page flex h-9 items-center justify-between text-xs px-4">
//             <div className="flex items-center gap-1.5">
//               <Phone className="h-3.5 w-3.5" />
//               <span>Đường dây nóng Công đoàn: 0902 993 488</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <Link to="/tra-cuu" className="hover:text-white">Tra cứu trạng thái xử lý</Link>
//               <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-white">
//                 <ShieldCheck className="h-3.5 w-3.5" /> Đăng nhập quản trị
//               </Link>
//             </div>
//           </div>
//         </div>
    
//         {/* Thanh chính: Logo + Menu + Tìm kiếm + Nút bấm */}
//         <div className="container-page mx-auto flex h-[72px] items-center justify-between gap-4 px-4">
//           {/* Logo Công đoàn */}
//           <Link to="/" className="flex items-center gap-3 shrink-0">
//             <img src="/hhcd.svg" alt="My SVG Logo" width="40" height="30" />
//             <div className="leading-tight">
//               <p className="font-display text-[25px] font-bold text-ink-800 sm:text-base">CĐCS BILLION VN</p>
//               <p className="text-[11px] font-medium uppercase tracking-wide text-blue-600">Cổng thông tin nội bộ</p>
//             </div>
//           </Link>
    
//           {/* Menu Điều hướng */}
//           {NAV_ITEMS.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.to === '/'}
//               className={({ isActive }) =>
//                 `relative flex items-center justify-center whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold 
//                 select-none [webkit-tap-highlight-color:transparent] transition-all duration-200 
                
//                 /* Cảm ứng trên Mobile (Android/iOS): Phản hồi nảy nhẹ lập tức khi CHẠM */
//                 active:scale-95 active:bg-blue-100/80
                
//                 /* Chuột trên Desktop (Windows/macOS): Chỉ Hover khi dùng chuột thật */
//                 @media(hover:hover){hover:text-[#00529C] hover:bg-blue-50/70 hover:-translate-y-0.5}

//                 ${
//                   isActive
//                     ? 'bg-blue-50 text-[#00529C] font-bold shadow-sm border border-blue-100'
//                     : 'text-slate-700'
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
    
//           {/* Khối Tìm kiếm & Nút Gửi phản ánh (Đã thẳng hàng tăm tắp) */}
//           <div className="flex items-center gap-3">
//             {/* Khối Tìm kiếm Hiện Đại - Dynamic & Interactive */}
//             <form onSubmit={submitSearch} className="group relative hidden sm:flex items-center">
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Tìm kiếm..."
//                 className="w-28 lg:w-36 focus:w-48 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50/80 py-1.5 pl-3 pr-2 text-sm text-slate-800 transition-all duration-300 placeholder:text-slate-400 focus:border-[#00529C] focus:bg-white focus:shadow-md focus:outline-none"
//                 aria-label="Tìm kiếm toàn website"
//               />
//               <button
//                 type="submit"
//                 className="inline-flex items-center justify-center rounded-r-lg border border-[#00529C] bg-[#00529C] px-3 py-2 text-white transition-all duration-300 hover:bg-[#003B73] hover:shadow-md focus:outline-none active:scale-95"
//                 title="Tìm kiếm"
//               >
//                 <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
//               </button>
//             </form>

//           {/* Nút Mobile Menu */}
//           <button
//             className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
//             onClick={() => setOpen(!open)}
//             aria-label="Mở menu"
//           >
//             {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//           </div>
//         </div>
    
//         {/* Menu mobile */}
//         {open && (
//           <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
//             <form onSubmit={submitSearch} className="relative mt-3">
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Tìm kiếm..."
//                 className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:outline-none"
//               />
//               <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//             </form>
//             <nav className="mt-2 flex flex-col">
//               {NAV_ITEMS.map((item) => (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   end={item.to === '/'}
//                   onClick={() => setOpen(false)}
//                   className={({ isActive }) =>
//                     `border-b border-slate-100 py-3 text-sm font-semibold ${
//                       isActive ? 'text-blue-700' : 'text-slate-700'
//                     }`
//                   }
//                 >
//                   {item.label}
//                 </NavLink>
//               ))}
//               <Link to="/tra-cuu" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold text-slate-700">
//                 Tra cứu trạng thái xử lý
//               </Link>
//               <Link to="/admin/login" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold text-slate-700">
//                 Đăng nhập quản trị
//               </Link>
//             </nav>
//           </div>
//         )}
//       </header>
//     );

//   return (
//     <header className="sticky top-0 z-40 bg-white shadow-sm">
//       {/* Thanh tiện ích trên cùng */}
//       <div className="hidden bg-sky-800 text-ink-100 md:block">
//         <div className="container-page flex h-9 items-center justify-between text-xs">
//           <div className="flex items-center gap-1.5">
//             <Phone className="h-3.5 w-3.5" />
//             <span>Đường dây nóng Công đoàn: 1900 xxxx</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link to="/tra-cuu" className="hover:text-white">Tra cứu trạng thái xử lý</Link>
//             <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-white">
//               <ShieldCheck className="h-3.5 w-3.5" /> Đăng nhập quản trị
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Thanh chính: logo + menu + tìm kiếm */}
//       <div className="container-page flex h-[72px] items-center justify-between gap-4">
//         <Link to="/" className="flex items-center gap-3 shrink-0">
//           {/* <UnionSeal size={44} spin={false} className="text-union-500" /> */}
//           <img src="/hhcd.svg" alt="My SVG Logo" width="30" height="20"></img>
//           <div className="leading-tight">
//             <p className="font-display text-[15px] font-bold text-ink-800 sm:text-base">CĐCS BILLION</p>
//             <p className="text-[11px] font-medium uppercase tracking-wide text-union-500">Cổng thông tin nội bộ</p>
//           </div>
//         </Link>

// {/* đoạn code sửa */}
//         <nav className="hidden items-center gap-2 xl:gap-6 lg:flex">
//           {NAV_ITEMS.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.to === '/'}
//               className={({ isActive }) =>
//                 `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-orange-50 text-orange-600 font-bold'
//                     : 'text-gray-700 hover:bg-gray-100 hover:text-orange-500'
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* <nav className="hidden items-center gap-1 lg:flex">
//           {NAV_ITEMS.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.to === '/'}
//               className={({ isActive }) =>
//                 `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
//                   isActive ? 'text-union-600' : 'text-ink-600 hover:text-union-500'
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </nav> */}

//         <div className="flex items-center gap-2">
//           <form onSubmit={submitSearch} className="relative hidden sm:block">
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Tìm kiếm..."
//               className="w-40 rounded-md border border-line bg-ink-50 py-2 pl-8 pr-2 text-sm focus:w-56 focus:border-union-400 focus:bg-white focus:outline-none transition-all"
//               aria-label="Tìm kiếm toàn website"
//             />
//             <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-ink-400" />
//           </form>
// {/* đoạn code sửa */}          
//           <Link 
//             to="/lien-he#gui-phan-anh" 
//             className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           >
//             Gửi phản ánh
//           </Link>
//           {/* <Link to="/lien-he#gui-phan-anh" className="btn-primary bg-orange-500 hidden md:inline-flex !py-2">
//             Gửi phản ánh
//           </Link> */}
//           <button className="rounded-md p-2 text-ink-600 hover:bg-ink-50 lg:hidden" onClick={() => setOpen(!open)} aria-label="Mở menu">
//             {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Menu mobile */}
//       {open && (
//         <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
//           <form onSubmit={submitSearch} className="relative mt-3">
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Tìm kiếm..."
//               className="input pl-9"
//             />
//             <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-ink-400" />
//           </form>
//           <nav className="mt-2 flex flex-col">
//             {NAV_ITEMS.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 end={item.to === '/'}
//                 onClick={() => setOpen(false)}
//                 className={({ isActive }) =>
//                   `border-b border-line py-3 text-sm font-semibold ${isActive ? 'text-union-600' : 'text-ink-600'}`
//                 }
//               >
//                 {item.label}
//               </NavLink>
//             ))}
//             <Link to="/tra-cuu" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold text-ink-600">
//               Tra cứu trạng thái xử lý
//             </Link>
//             <Link to="/admin/login" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold text-ink-600">
//               Đăng nhập quản trị
//             </Link>
//           </nav>
//         </div>
//       )}
//     </header>
//  );
//}
