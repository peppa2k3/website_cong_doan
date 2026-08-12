import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import NewsCard from '../../components/public/NewsCard';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';
import api from '../../services/api';
import { NEWS_CATEGORIES } from '../../utils/constants';

export default function NewsListPage({ fixedCategory, pageTitle, pageSubtitle }) {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const [category, setCategory] = useState(fixedCategory || params.get('category') || '');
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/public/news', { params: { page, limit: 9, category } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, category]);

  useEffect(() => { load(); }, [load]);

  const setPage = (p) => setParams((prev) => { prev.set('page', p); return prev; });

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">{pageTitle}</h1>
        {pageSubtitle && <p className="mt-2 max-w-2xl text-ink-500">{pageSubtitle}</p>}
        {fixedCategory === 'hoat_dong' && (
          <Link to="/thu-vien" className="btn-outline mt-4 inline-flex !py-2 text-sm">Xem thư viện ảnh &amp; video →</Link>
        )}
      </div>

      {!fixedCategory && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => { setCategory(''); setParams((p) => { p.set('page', 1); return p; }); }} className={`badge cursor-pointer border ${category === '' ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500 hover:border-union-300'}`}>Tất cả</button>
          {Object.entries(NEWS_CATEGORIES).map(([key, v]) => (
            <button key={key} onClick={() => { setCategory(key); setParams((p) => { p.set('page', 1); return p; }); }} className={`badge cursor-pointer border ${category === key ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500 hover:border-union-300'}`}>{v.label}</button>
          ))}
        </div>
      )}

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có bài viết nào" /> : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((n) => <NewsCard key={n._id} item={n} />)}
        </div>
      )}

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 9))} onChange={setPage} />
    </div>
  );
}
