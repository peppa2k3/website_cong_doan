import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight, Shield } from 'lucide-react';
import UnionSeal from '../common/UnionSeal';


//đoạn code sửa
export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      {/* Khối nội dung chính */}
      <div className="container-page mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/hhcd.svg" alt="Logo Công đoàn" width="36" height="24" className="brightness-125" />
            <div>
              <p className="font-display text-base font-bold text-white tracking-wide">CĐCS BILLION VN</p>
              <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">Cổng thông tin nội bộ</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Đại diện, chăm lo và bảo vệ quyền, lợi ích hợp pháp, chính đáng của đoàn viên, người lao động.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/60 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-800/50">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            <span>Hệ thống bảo mật nội bộ</span>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-slate-800 pb-2.5 mb-4 inline-block">
            Liên kết nhanh
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: '/gioi-thieu', label: 'Giới thiệu' },
              { to: '/co-cau-to-chuc', label: 'Cơ cấu tổ chức' },
              { to: '/van-ban', label: 'Văn bản chỉ đạo' },
              { to: '/thu-vien', label: 'Thư viện ảnh/video' },
              { to: '/hoi-dap', label: 'Hỏi đáp công đoàn' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="group flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Tiếp nhận ý kiến */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-slate-800 pb-2.5 mb-4 inline-block">
            Tiếp nhận ý kiến
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: '/lien-he#gui-phan-anh', label: 'Gửi góp ý, phản ánh' },
              { to: '/tra-cuu', label: 'Tra cứu trạng thái xử lý' },
            ].map((link, idx) => (
              <li key={idx}>
                <Link to={link.to} className="group flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 4: Thông tin liên hệ */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-slate-800 pb-2.5 mb-4 inline-block">
            Thông tin liên hệ
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-blue-400 mt-1" />
              <span className="leading-relaxed">Lô 43-16 đường N14, KCN Phước Đông, Phường Gia Lộc, Tỉnh Tây Ninh, Việt Nam</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-blue-400" />
              <span className="font-medium text-slate-200">0902 993 488 - 0908 816 546</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-blue-400" />
              <a href="mailto:congdoan@billion.com" className="hover:text-blue-400 transition-colors">lopvbillion@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Dòng Copyright phía dưới */}
      <div className="border-t border-slate-800/80 bg-slate-950/50 py-4">
        <div className="container-page mx-auto px-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Công đoàn cơ sở BILLION VN. Bản quyền nội bộ — Vận hành bởi bộ phận IT Billion.
        </div>
      </div>
    </footer>
  );
}


// export default function Footer() {
//   return (
//     <footer className="mt-16 bg-sky-800 text-ink-200">
//       <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-4">
//         <div>
//           <div className="flex items-center gap-3">
//             {/* <UnionSeal size={40} spin={false} className="text-brass-400" /> */}
//             <img src="/hhcd.svg" alt="My SVG Logo" width="30" height="20"></img>
//             <div>
//               <p className="font-display font-bold text-white">CĐCS BILLION</p>
//               <p className="text-xs text-ink-300">Cổng thông tin nội bộ</p>
//             </div>
//           </div>
//           <p className="mt-4 text-sm leading-relaxed text-ink-300">
//             Đại diện, chăm lo và bảo vệ quyền, lợi ích hợp pháp, chính đáng của đoàn viên, người lao động.
//           </p>
//         </div>

//         <div>
//           <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Liên kết nhanh</h4>
//           <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
//             <li><Link to="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
//             <li><Link to="/co-cau-to-chuc" className="hover:text-white">Cơ cấu tổ chức</Link></li>
//             <li><Link to="/van-ban" className="hover:text-white">Văn bản</Link></li>
//             <li><Link to="/thu-vien" className="hover:text-white">Thư viện ảnh/video</Link></li>
//             <li><Link to="/hoi-dap" className="hover:text-white">Hỏi đáp</Link></li>
//           </ul>
//         </div>

//         <div>
//           <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Tiếp nhận ý kiến</h4>
//           <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
//             <li><Link to="/lien-he#gui-phan-anh" className="hover:text-white">Gửi góp ý</Link></li>
//             <li><Link to="/lien-he#gui-phan-anh" className="hover:text-white">Gửi phản ánh</Link></li>
//             <li><Link to="/lien-he#gui-phan-anh" className="hover:text-white">Gửi tố cáo (ẩn danh)</Link></li>
//             <li><Link to="/tra-cuu" className="hover:text-white">Tra cứu trạng thái xử lý</Link></li>
//           </ul>
//         </div>

//         <div>
//           <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Thông tin liên hệ</h4>
//           <ul className="mt-4 space-y-3 text-sm text-ink-300">
//             <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" /> Lô 43-16 đường N14, KCN Phước Đông, Xã Phước Đông, Huyện Gò Dầu, Tỉnh Tây Ninh, Việt Nam</li>
//             <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 mt-0.5" /> 1900 1000</li>
//             <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 mt-0.5" /> congdoan@billion.com</li>
//           </ul>
//         </div>
//       </div>
//       <div className="border-t border-ink-700 py-5">
//         <p className="container-page text-center text-xs text-ink-400">
//           © {new Date().getFullYear()} Công đoàn cơ sở. Bản quyền nội bộ — vận hành bởi bộ phận IT Billion.
//         </p>
//       </div>
//     </footer>
//   );
// }
