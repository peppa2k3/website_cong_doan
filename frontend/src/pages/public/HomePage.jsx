import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, FileText, MessageCircleHeart, ShieldAlert, Search, ArrowRight, CalendarDays, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import UnionSeal from '../../components/common/UnionSeal';
import BannerSlider from '../../components/public/BannerSlider';
import NewsCard from '../../components/public/NewsCard';
import SectionHeading from '../../components/public/SectionHeading';
import DocumentRow from '../../components/public/DocumentRow';
import { LoadingSpinner } from '../../components/common/Feedback';
import { formatDate } from '../../utils/format';

const QUICK_ACCESS = [
  { icon: MessageCircleHeart, title: 'Gửi góp ý', desc: 'Đóng góp ý kiến xây dựng tổ chức', href: '/lien-he#gui-phan-anh', color: 'brass' },
  { icon: Megaphone, title: 'Gửi phản ánh', desc: 'Phản ánh vấn đề cần Công đoàn hỗ trợ', href: '/lien-he#gui-phan-anh', color: 'ink' },
  { icon: ShieldAlert, title: 'Gửi tố cáo', desc: 'Có thể lựa chọn gửi ẩn danh', href: '/lien-he#gui-phan-anh', color: 'union' },
  { icon: Search, title: 'Tra cứu trạng thái', desc: 'Theo dõi kết quả xử lý bằng mã tra cứu', href: '/tra-cuu', color: 'brass' },
];

const ACCENT = {
  union: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  brass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  ink: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [highlights, setHighlights] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/public/banners', { params: { position: 'home_slider' } }),
      api.get('/public/news/highlights'),
      api.get('/public/documents', { params: { limit: 5 } }),
    ])
      .then(([b, h, d]) => {
        setBanners(b.data.data);
        setHighlights(h.data.data);
        setDocuments(d.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Đang tải trang chủ..." />;

  const hoatDong = highlights?.byCategory?.find((c) => c.category === 'hoat_dong')?.items || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO SECTION - SỐNG ĐỘNG & NỔI BẬT */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-sky-700 to-blue-600 text-white py-12 lg:py-20 shadow-xl">
        {/* Hiệu ứng nền đốm sáng & Pattern */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="bg-seal-grid absolute inset-0 opacity-25" style={{ backgroundSize: '24px 24px' }} />

        <div className="container-page relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          {/* Nội dung Hero */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide border border-amber-300/30 backdrop-blur-md mb-3">
              CỔNG THÔNG TIN ĐIỆN TỬ CÔNG ĐOÀN
            </span>
            
            {/* Tiêu đề lớn, đổ bóng rõ nét */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
              Đồng hành cùng đoàn viên,<br className="hidden sm:inline" /> 
              <span className="text-amber-300 drop-shadow-sm"> lan toả tiếng nói</span> người lao động
            </h1>
            
            {/* Thẻ mô tả chữ to rõ hơn trên Mobile */}
            <p className="mt-4 max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-blue-50 leading-relaxed font-normal drop-shadow-sm">
              Cập nhật tin tức, văn bản và hoạt động của Công đoàn; gửi góp ý, phản ánh, tố cáo và theo dõi kết quả xử lý minh bạch, kịp thời.
            </p>

            {/* Nút bấm Responsive to rõ, dễ chạm */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link 
                to="/lien-he#gui-phan-anh" 
                className="w-full sm:w-auto text-center font-bold text-base py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
              >
                Gửi phản ánh ngay
              </Link>
              <Link 
                to="/van-ban" 
                className="w-full sm:w-auto text-center font-semibold text-base py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 transition-all active:scale-95"
              >
                Tra cứu văn bản
              </Link>
            </div>
          </div>

          {/* Logo / Hiển thị cả trên Mobile với kích thước phù hợp */}
          <div className="flex justify-center items-center mt-4 lg:mt-0">
            <div className="relative flex h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl">
              <img 
                src="/hhcd.svg" 
                alt="Logo Công Đoàn" 
                className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BANNER SLIDER */}
      <div className="container-page -mt-6 sm:-mt-10 relative z-20 pb-4">
        <div className="rounded-2xl shadow-xl overflow-hidden bg-white p-1 sm:p-2 border border-slate-100">
          <BannerSlider banners={banners} />
        </div>
      </div>

      {/* THÔNG BÁO MỚI */}
      {highlights?.pinned?.length > 0 && (
        <section className="container-page py-4 sm:py-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-red-200/80 bg-red-50/70 p-4 sm:p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2 font-display font-bold text-base sm:text-lg text-red-700">
              <span className="p-2 rounded-lg bg-red-100 text-red-600 animate-pulse">
                <Megaphone className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              Thông báo mới:
            </div>
            <div className="flex-1 divide-y divide-red-200/60 sm:divide-y-0 sm:flex sm:flex-wrap sm:gap-x-6">
              {highlights.pinned.slice(0, 4).map((n) => (
                <Link 
                  key={n._id} 
                  to={`/tin-tuc/${n.slug}`} 
                  className="flex items-center justify-between gap-3 py-2.5 text-sm sm:text-base font-medium text-slate-800 hover:text-red-600 transition-colors sm:py-1"
                >
                  <span className="truncate">{n.title}</span>
                  <span className="shrink-0 text-xs text-slate-500 font-normal">{formatDate(n.publishedAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIN NỔI BẬT */}
      {highlights?.featured?.length > 0 && (
        <section className="container-page py-6 sm:py-8">
          <SectionHeading eyebrow="Tin tức Công đoàn" title="Tin nổi bật" viewAllHref="/tin-tuc" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {highlights.featured[0] && (
              <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                <NewsCard item={highlights.featured[0]} size="large" />
              </div>
            )}
            {highlights.featured.slice(1, 5).map((n) => <NewsCard key={n._id} item={n} />)}
          </div>
        </section>
      )}

      {/* HOẠT ĐỘNG TRUYỀN THÔNG */}
      {hoatDong.length > 0 && (
        <section className="bg-white py-8 sm:py-12 border-y border-slate-100">
          <div className="container-page">
            <SectionHeading eyebrow="Hình ảnh & sự kiện" title="Hoạt động truyền thông" viewAllHref="/hoat-dong" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-4">
              {hoatDong.map((n) => <NewsCard key={n._id} item={n} />)}
            </div>
          </div>
        </section>
      )}

      {/* VĂN BẢN MỚI + QUICK ACCESS */}
      <section className="container-page py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cột văn bản */}
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Cập nhật" title="Văn bản mới ban hành" viewAllHref="/van-ban" />
            <div className="space-y-3 mt-4">
              {documents.map((d) => <DocumentRow key={d._id} item={d} />)}
              {documents.length === 0 && (
                <div className="p-6 text-center bg-white rounded-xl text-slate-500 text-sm">
                  Chưa có văn bản nào.
                </div>
              )}
            </div>
            <Link 
              to="/van-ban" 
              className="mt-4 inline-flex items-center justify-center w-full sm:w-auto gap-2 py-3 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors sm:hidden"
            >
              Xem tất cả văn bản <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cột Quick Access - Tăng chi tiết & tương tác trên mobile */}
          <div>
            <SectionHeading title="Kênh tiếp nhận ý kiến" />
            <div className="space-y-3.5 mt-4">
              {QUICK_ACCESS.map((q) => (
                <Link 
                  key={q.title} 
                  to={q.href} 
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all active:scale-[0.99]"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${ACCENT[q.color]}`}>
                    <q.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                      {q.title}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">{q.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}