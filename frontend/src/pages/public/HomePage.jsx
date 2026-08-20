import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, FileText, MessageCircleHeart, ShieldAlert, Search, ArrowRight, CalendarDays } from 'lucide-react';
import api from '../../services/api';
import UnionSeal from '../../components/common/UnionSeal';
import BannerSlider from '../../components/public/BannerSlider';
import NewsCard from '../../components/public/NewsCard';
import SectionHeading from '../../components/public/SectionHeading';
import DocumentRow from '../../components/public/DocumentRow';
import { LoadingSpinner } from '../../components/common/Feedback';
import { formatDate } from '../../utils/format';

const QUICK_ACCESS = [
  { icon: Megaphone, title: 'Gửi góp ý, phản ánh', desc: 'Phản ánh vấn đề cần Công đoàn hỗ trợ', href: '/lien-he#gui-phan-anh', color: 'ink' },
  { icon: Search, title: 'Tra cứu trạng thái', desc: 'Theo dõi kết quả xử lý bằng mã tra cứu', href: '/tra-cuu', color: 'brass' },
];

const ACCENT = {
  union: 'bg-union-50 text-union-600',
  brass: 'bg-brass-50 text-brass-600',
  ink: 'bg-ink-100 text-ink-600',
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
    <div>
      {/* HERO */}
{/* đoạn code sửa */}
      <section className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 py-12 lg:py-16 overflow-hidden text-white">
        {/* Họa tiết Logo Công đoàn chìm mờ phía xa làm nền */}
        <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
          <img src="/hhcd.svg" alt="" className="w-[600px] h-[600px]" />
        </div>

        <div className="container-page relative z-10 mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            
            {/* CỘT TRÁI: Nội dung chính & Nút hành động */}
            <div className="space-y-6 lg:col-span-7">
              
              {/* Badge nhận diện */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                Cổng thông tin điện tử Công đoàn
              </div>

              {/* Tiêu đề chính */}
              <h1 className="text-3xl font-extrabold leading-tight text-yellow-300 sm:text-4xl lg:text-5xl">
                Đồng hành cùng đoàn viên, <br />
                <span className="bg-gradient-to-r text-yellow-300 via-amber-200 to-white bg-clip-text text-transparent drop-shadow-md ">
                  lan toả tiếng nói người lao động
                </span>
              </h1>

              {/* Mdescription */}
              <p className="max-w-2xl text-base text-sky-100 sm:text-lg leading-relaxed">
                Nơi cập nhật tin tức, văn bản chỉ đạo và tiếp nhận ý kiến, phản ánh nhằm bảo vệ quyền, lợi ích hợp pháp của đoàn viên & người lao động.
              </p>

              {/* Nút bấm nổi bật */}
              {/* <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/lien-he#gui-phan-anh"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Gửi phản ánh ngay
                </Link>

                <Link
                  to="/van-ban"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-700 focus:outline-none"
                >
                  Tra cứu văn bản
                </Link>
              </div> */}

              {/* Thống kê nhanh nâng tầm uy tín */}
              {/* <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 mt-6">
                <div>
                  <div className="text-2xl font-black text-blue-700">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Minh bạch thông tin</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-700">24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Tiếp nhận phản ánh</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-700">Kịp thời</div>
                  <div className="text-xs text-slate-500 font-medium">Giải quyết thắc mắc</div>
                </div>
              </div> */}

            </div>

            {/* CỘT PHẢI: Khung Banner Hình ảnh/Slider Hoạt động thực tế */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Khung trang trí viền xanh mờ */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-400 opacity-20 blur-lg" />
                
                {/* Card chứa hình ảnh hoạt động */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                  <img
                    src="https://phuoc-associates.com/wp-content/uploads/2022/11/portrait-asian-emgineer-male-female-technician-safty-uniform-standing-turn-around-look-camera-laugh-smile-with-cheerful-confident-machinery-factory-workplace-background-2.jpg" 
                    alt="Hoạt động Công đoàn"
                    className="h-80 w-full rounded-xl object-cover"
                  />
                  
                  {/* Overlay thông tin gắn liền trên ảnh */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-900/80 p-4 backdrop-blur-md text-white border border-white/10">
                    <div className="flex items-center gap-3">
                      <img src="/hhcd.svg" alt="CĐVN" className="h-10 w-10 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Công đoàn Cơ sở BILLION VN</h4>
                        <p className="text-xs text-slate-300">Vì quyền lợi chính đáng của người lao động</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* <section className="relative overflow-hidden bg-sky-500">
        <div className="bg-seal-grid absolute inset-0 opacity-40" style={{ backgroundSize: '18px 18px' }} />
        <div className="container-page relative grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <span className="eyebrow !text-brass-800">Cổng thông tin điện tử</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-black sm:text-4xl lg:text-[42px]">
              Đồng hành cùng đoàn viên,<br /> lan toả tiếng nói người lao động
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-700">
              Cập nhật tin tức, văn bản và hoạt động của Công đoàn; gửi góp ý, phản ánh, tố cáo và theo dõi kết quả xử lý minh bạch, kịp thời.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/lien-he#gui-phan-anh" className="btn-primary bg-lime-500 !px-5 !py-3">Gửi phản ánh ngay</Link>
              <Link to="/van-ban" className="btn-outline !border-ink-600 !bg-transparent !px-5 !py-3 !text-white hover:!bg-ink-700">Tra cứu văn bản</Link>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="relative flex h-64 w-64 items-center justify-center">
              {/* <UnionSeal size={256} className="text-brass-400" /> 
              <img src="/hhcd.svg" alt="My SVG Logo" width="300" height="200"></img>
            </div>
          </div>
        </div>
      </section> */}

      <div className="container-page -mt-8 pb-4">
        <BannerSlider banners={banners} />
      </div>

      {/* THÔNG BÁO MỚI */}
      {highlights?.pinned?.length > 0 && (
        <section className="container-page py-8">
          <div className="flex flex-col gap-4 rounded-lg border border-union-100 bg-union-50/60 p-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2 font-display font-bold text-union-600">
              <Megaphone className="h-5 w-5" /> Thông báo mới
            </div>
            <div className="flex-1 divide-y divide-union-100 sm:divide-y-0 sm:flex sm:flex-wrap sm:gap-x-6">
              {highlights.pinned.slice(0, 4).map((n) => (
                <Link key={n._id} to={`/tin-tuc/${n.slug}`} className="flex items-center justify-between gap-3 py-2 text-sm text-ink-700 hover:text-union-600 sm:py-1">
                  <span className="truncate">{n.title}</span>
                  <span className="shrink-0 text-xs text-ink-400">{formatDate(n.publishedAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIN NỔI BẬT */}
      {highlights?.featured?.length > 0 && (
        <section className="container-page py-6">
          <SectionHeading eyebrow="Tin tức Công đoàn" title="Tin nổi bật" viewAllHref="/tin-tuc" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <section className="bg-white py-10">
          <div className="container-page">
            <SectionHeading eyebrow="Hình ảnh & sự kiện" title="Hoạt động truyền thông" viewAllHref="/hoat-dong" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hoatDong.map((n) => <NewsCard key={n._id} item={n} />)}
            </div>
          </div>
        </section>
      )}

      {/* VĂN BẢN MỚI + QUICK ACCESS */}
      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Cập nhật" title="Văn bản mới ban hành" viewAllHref="/van-ban" />
            <div className="space-y-3">
              {documents.map((d) => <DocumentRow key={d._id} item={d} />)}
              {documents.length === 0 && <p className="text-sm text-ink-400">Chưa có văn bản nào.</p>}
            </div>
            <Link to="/van-ban" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-union-600 hover:underline sm:hidden">
              Xem tất cả văn bản <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <SectionHeading title="Kênh tiếp nhận ý kiến" />
            <div className="space-y-3">
              {QUICK_ACCESS.map((q) => (
                <Link key={q.title} to={q.href} className="card flex items-center gap-3 p-4 hover:border-union-300">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${ACCENT[q.color]}`}>
                    <q.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink-800">{q.title}</p>
                    <p className="truncate text-xs text-ink-400">{q.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-ink-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
