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
  { icon: MessageCircleHeart, title: 'Gửi góp ý', desc: 'Đóng góp ý kiến xây dựng tổ chức', href: '/lien-he#gui-phan-anh', color: 'brass' },
  { icon: Megaphone, title: 'Gửi phản ánh', desc: 'Phản ánh vấn đề cần Công đoàn hỗ trợ', href: '/lien-he#gui-phan-anh', color: 'ink' },
  { icon: ShieldAlert, title: 'Gửi tố cáo', desc: 'Có thể lựa chọn gửi ẩn danh', href: '/lien-he#gui-phan-anh', color: 'union' },
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
      <section className="relative overflow-hidden bg-sky-500">
        <div className="bg-seal-grid absolute inset-0 opacity-40" style={{ backgroundSize: '18px 18px' }} />
        <div className="container-page relative grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <span className="eyebrow !text-brass-800">Cổng thông tin điện tử</span>
            {/* <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-black sm:text-4xl lg:text-[42px]"> */}
             {/* chỉnh lại chữ trên banner */}
             <h1 className="title-medium">
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
              {/* <UnionSeal size={256} className="text-brass-400" /> */}
              <img src="/hhcd.svg" alt="My SVG Logo" width="300" height="200"></img>
            </div>
          </div>
        </div>
      </section>

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
