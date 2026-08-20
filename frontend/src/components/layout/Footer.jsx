import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-200 border-t-4 border-amber-400 shadow-2xl">
      {/* Khối nội dung chính */}
      <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        
        {/* CỘT 1: LOGO & TÊN TỔ CHỨC */}
        <div className="space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm shadow-md">
              <img src="/hhcd.svg" alt="Logo Công Đoàn" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl text-white tracking-wide drop-shadow-sm">
                CĐCS BILLION
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Cổng thông tin nội bộ
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-medium">
            Đại diện, chăm lo và bảo vệ quyền, lợi ích hợp pháp, chính đáng của đoàn viên và người lao động toàn công ty.
          </p>
        </div>

        {/* CỘT 2: LIÊN KẾT NHANH */}
        <div>
          <h4 className="font-black text-base sm:text-lg uppercase tracking-wider text-white border-b-2 border-amber-400/80 pb-2 inline-block">
            Liên kết nhanh
          </h4>
          <ul className="mt-4 space-y-3 text-sm sm:text-base font-semibold text-slate-300">
            {[
              { to: '/gioi-thieu', label: 'Giới thiệu' },
              { to: '/co-cau-to-chuc', label: 'Cơ cấu tổ chức' },
              { to: '/van-ban', label: 'Văn bản' },
              { to: '/thu-vien', label: 'Thư viện ảnh/video' },
              { to: '/hoi-dap', label: 'Hỏi đáp' },
            ].map((item) => (
              <li key={item.to}>
                <Link 
                  to={item.to} 
                  className="flex items-center gap-2 hover:text-amber-300 hover:translate-x-1.5 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CỘT 3: TIẾP NHẬN Ý KIẾN */}
        <div>
          <h4 className="font-black text-base sm:text-lg uppercase tracking-wider text-white border-b-2 border-amber-400/80 pb-2 inline-block">
            Tiếp nhận ý kiến
          </h4>
          <ul className="mt-4 space-y-3 text-sm sm:text-base font-semibold text-slate-300">
            {[
              { to: '/lien-he#gui-phan-anh', label: 'Gửi góp ý' },
              { to: '/lien-he#gui-phan-anh', label: 'Gửi phản ánh' },
              { to: '/lien-he#gui-phan-anh', label: 'Gửi tố cáo (ẩn danh)' },
              { to: '/tra-cuu', label: 'Tra cứu trạng thái xử lý' },
            ].map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.to} 
                  className="flex items-center gap-2 hover:text-amber-300 hover:translate-x-1.5 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CỘT 4: THÔNG TIN LIÊN HỆ */}
        <div>
          <h4 className="font-black text-base sm:text-lg uppercase tracking-wider text-white border-b-2 border-amber-400/80 pb-2 inline-block">
            Thông tin liên hệ
          </h4>
          <ul className="mt-4 space-y-3.5 text-sm sm:text-base font-medium text-slate-300">
            <li className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-400 shrink-0 mt-0.5 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="leading-snug text-slate-200">
                Lô 43-16 đường N14, KCN Phước Đông, Xã Phước Đông, Huyện Gò Dầu, Tỉnh Tây Ninh, Việt Nam
              </span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-400 shrink-0 shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <span className="font-bold text-amber-300 text-base">1900 1000</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-400 shrink-0 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-slate-200 font-medium">congdoan@billion.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM: Bản quyền & Nút lên đầu trang */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 py-5">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
          <p className="text-center sm:text-left font-medium">
            © {new Date().getFullYear()} <strong className="text-slate-200">Công đoàn Cơ sở Billion</strong>. Bản quyền nội bộ — Vận hành bởi bộ phận IT.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 active:scale-95"
            aria-label="Về đầu trang"
          >
            <span>Lên đầu trang</span>
            <ArrowUp className="h-3.5 w-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}