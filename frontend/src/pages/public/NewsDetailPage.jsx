import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Eye, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/common/Feedback';
import NewsCard from '../../components/public/NewsCard';
import { NEWS_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/format';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get(`/public/news/${slug}`)
      .then((res) => setData(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="container-page py-16"><LoadingSpinner /></div>;
  if (error || !data) return <div className="container-page py-16"><EmptyState title="Không tìm thấy bài viết" /></div>;

  const { item, related } = data;

  return (
    <div className="container-page py-10">
      <Link to="/tin-tuc" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-union-600">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>

      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">{NEWS_CATEGORIES[item.category]?.label}</span>
        <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink-800 sm:text-3xl">{item.title}</h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-ink-400">
          <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {formatDate(item.publishedAt)}</span>
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {item.views} lượt xem</span>
          {item.author?.fullName && <span>Đăng bởi {item.author.fullName}</span>}
        </div>

        {item.thumbnail && (
          <img src={item.thumbnail} alt={item.title} className="mt-6 w-full rounded-lg object-cover" />
        )}

        <div className="prose-doc mt-6" dangerouslySetInnerHTML={{ __html: item.content }} />

        {item.galleryImages?.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {item.galleryImages.map((img, i) => <img key={i} src={img} alt="" className="aspect-square rounded-md object-cover" />)}
          </div>
        )}
      </div>

      {related?.length > 0 && (
        <div className="mx-auto mt-12 max-w-5xl">
          <h3 className="font-display text-xl font-bold text-ink-800">Bài viết liên quan</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((n) => <NewsCard key={n._id} item={n} />)}
          </div>
        </div>
      )}
    </div>
  );
}
