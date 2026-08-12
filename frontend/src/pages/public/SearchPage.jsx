import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Newspaper, FileText, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/common/Feedback';
import { formatDate, truncate } from '../../utils/format';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setData({ news: [], documents: [], faqs: [] }); setLoading(false); return; }
    setLoading(true);
    api.get('/public/search', { params: { q } }).then((res) => setData(res.data.data)).finally(() => setLoading(false));
  }, [q]);

  const totalResults = data ? data.news.length + data.documents.length + data.faqs.length : 0;

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-ink-800">Kết quả tìm kiếm cho “{q}”</h1>

      {loading ? <LoadingSpinner /> : totalResults === 0 ? <EmptyState title="Không tìm thấy kết quả phù hợp" /> : (
        <div className="mt-8 space-y-10">
          {data.news.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-800"><Newspaper className="h-5 w-5 text-union-500" /> Tin tức</h2>
              <div className="space-y-3">
                {data.news.map((n) => (
                  <Link key={n._id} to={`/tin-tuc/${n.slug}`} className="card block p-4 hover:border-union-300">
                    <p className="font-medium text-ink-800">{n.title}</p>
                    <p className="mt-1 text-sm text-ink-500">{truncate(n.summary, 140)}</p>
                    <p className="mt-1.5 text-xs text-ink-400">{formatDate(n.publishedAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data.documents.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-800"><FileText className="h-5 w-5 text-union-500" /> Văn bản</h2>
              <div className="space-y-3">
                {data.documents.map((d) => (
                  <a key={d._id} href={d.fileUrl} target="_blank" rel="noreferrer" className="card block p-4 hover:border-union-300">
                    <p className="font-medium text-ink-800">{d.title}</p>
                    <p className="mt-1 text-xs text-ink-400">{d.docNumber}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {data.faqs.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-800"><HelpCircle className="h-5 w-5 text-union-500" /> Hỏi đáp</h2>
              <div className="space-y-3">
                {data.faqs.map((f) => (
                  <div key={f._id} className="card p-4">
                    <p className="font-medium text-ink-800">{f.question}</p>
                    <p className="mt-1 text-sm text-ink-500">{truncate(f.answer, 140)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
