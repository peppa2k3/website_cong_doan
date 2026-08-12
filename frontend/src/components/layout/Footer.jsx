import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import UnionSeal from '../common/UnionSeal';

export default function Footer() {
  return (
    <footer className="mt-16 bg-sky-800 text-ink-200">
      <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            {/* <UnionSeal size={40} spin={false} className="text-brass-400" /> */}
            <img src="/hhcd.svg" alt="My SVG Logo" width="30" height="20"></img>
            <div>
              <p className="font-display font-bold text-white">CĐCS BILLION</p>
              <p className="text-xs text-ink-300">Cổng thông tin nội bộ</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            Đại diện, chăm lo và bảo vệ quyền, lợi ích hợp pháp, chính đáng của đoàn viên, người lao động.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Liên kết nhanh</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
            <li><Link to="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="/co-cau-to-chuc" className="hover:text-white">Cơ cấu tổ chức</Link></li>
            <li><Link to="/van-ban" className="hover:text-white">Văn bản</Link></li>
            <li><Link to="/thu-vien" className="hover:text-white">Thư viện ảnh/video</Link></li>
            <li><Link to="/hoi-dap" className="hover:text-white">Hỏi đáp</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Tiếp nhận ý kiến</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
            <li><Link to="/lien-he#gui-phan-anh" className="hover:text-white">Gửi góp ý</Link></li>
            <li><Link to="/lien-he#gui-phan-anh" className="hover:text-white">Gửi phản ánh</Link></li>
            <li><Link to="/lien-he#gui-phan-anh" className="hover:text-white">Gửi tố cáo (ẩn danh)</Link></li>
            <li><Link to="/tra-cuu" className="hover:text-white">Tra cứu trạng thái xử lý</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Thông tin liên hệ</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-300">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" /> Lô 43-16 đường N14, KCN Phước Đông, Xã Phước Đông, Huyện Gò Dầu, Tỉnh Tây Ninh, Việt Nam</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 mt-0.5" /> 1900 1000</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 mt-0.5" /> congdoan@billion.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700 py-5">
        <p className="container-page text-center text-xs text-ink-400">
          © {new Date().getFullYear()} Công đoàn cơ sở. Bản quyền nội bộ — vận hành bởi bộ phận IT Billion.
        </p>
      </div>
    </footer>
  );
}
