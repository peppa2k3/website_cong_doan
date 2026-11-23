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

  //-----code gốc
  // const load = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await api.get('/public/news', { params: { page, limit: 9, category } });
  //     setRows(data.data);
  //     setTotal(data.pagination.total);
  //   } finally { setLoading(false); }
  // }, [page, category]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Gọi API lấy dữ liệu từ json-server
      const res = await api.get('/news');
      
      // 2. Kiểm tra dữ liệu trả về từ Axios
      const rawData = res.data;
      
      // 3. Nếu dữ liệu là mảng (json-server), lấy trực tiếp. Nếu là Backend thật, lấy từ rawData.data
      const list = Array.isArray(rawData) ? rawData : (rawData?.data || []);
      
      // 4. Lọc theo danh mục (category) nếu người dùng chọn trên giao diện
      const filteredList = category 
        ? list.filter(item => item.category === category)
        : list;
  
      // 5. Cập nhật State cho giao diện
      setRows(filteredList);
      setTotal(filteredList.length);
    } catch (err) {
      console.error("Lỗi tải danh sách tin tức:", err);
    } finally {
      setLoading(false);
    }
  }, [category]); // Cập nhật dependency khi chọn danh mục

  useEffect(() => { load(); }, [load]);

  const setPage = (p) => setParams((prev) => { prev.set('page', p); return prev; });

  //--------------code gốc--------------------------------
//   return (
//     <div className="container-page py-10">
//       <div className="mb-8">
//         <h1 className="font-display text-3xl font-extrabold text-ink-800">{pageTitle}</h1>
//         {pageSubtitle && <p className="mt-2 max-w-2xl text-ink-500">{pageSubtitle}</p>}
//         {fixedCategory === 'hoat_dong' && (
//           <Link to="/thu-vien" className="btn-outline mt-4 inline-flex !py-2 text-sm">Xem thư viện ảnh &amp; video →</Link>
//         )}
//       </div>

//       {!fixedCategory && (
//         <div className="mb-6 flex flex-wrap gap-2">
//           <button onClick={() => { setCategory(''); setParams((p) => { p.set('page', 1); return p; }); }} className={`badge cursor-pointer border ${category === '' ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500 hover:border-union-300'}`}>Tất cả</button>
//           {Object.entries(NEWS_CATEGORIES).map(([key, v]) => (
//             <button key={key} onClick={() => { setCategory(key); setParams((p) => { p.set('page', 1); return p; }); }} className={`badge cursor-pointer border ${category === key ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500 hover:border-union-300'}`}>{v.label}</button>
//           ))}
//         </div>
//       )}

//       {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có bài viết nào" /> : (
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {rows.map((n) => <NewsCard key={n._id} item={n} />)}
//         </div>
//       )}

//       <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 9))} onChange={setPage} />
//     </div>
//   );
// }


  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Banner đồng bộ bộ nhận diện Công đoàn */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00529C] via-[#0075D3] to-[#00A3FF] text-white shadow-lg">
        {/* Quầng sáng & Họa tiết */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 h-56 w-56 rounded-full bg-sky-300/30 blur-2xl pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
            <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="200" cy="200" r="130" stroke="white" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="80" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="container-page relative py-12">
          {/* Dải Ruy-băng Vàng Kim mang tinh thần Đại hội */}
          <div className="relative my-2">
            <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 px-8 py-4 rounded-r-2xl border-l-8 border-[#801B24] shadow-2xl inline-block max-w-full">
              <h1 className="font-display text-3xl sm:text-3xl font-black text-[#801B24] uppercase tracking-wide drop-shadow-sm">
              {pageTitle}
              </h1>
            </div>
          </div>         
          {/* <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#801B24] sm:text-4xl filter drop-shadow-[0_1px_8px_rgba(255,255,255,0.8)]">
            {pageTitle}
          </h1> */}
          {pageSubtitle && (
            <p className="mt-2 max-w-2xl text-sm text-sky-100 sm:text-base">
              {pageSubtitle}
            </p>
          )}
          {fixedCategory === 'hoat_dong' && (
            <Link
              to="/thu-vien"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-md transition-all hover:bg-amber-300"
            >
              Xem thư viện ảnh &amp; video →
            </Link>
          )}
        </div>
      </div>

      {/* Thân trang chứa bộ lọc & bài viết */}
      <div className="container-page pt-8">
        {!fixedCategory && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => { setCategory(''); setParams((p) => { p.set('page', 1); return p; }); }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                category === ''
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-600 border border-slate-200'
              }`}
            >
              Tất cả
            </button>
            {Object.entries(NEWS_CATEGORIES).map(([key, v]) => (
              <button
                key={key}
                onClick={() => { setCategory(key); setParams((p) => { p.set('page', 1); return p; }); }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  category === key
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-600 border border-slate-200'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : rows.length === 0 ? (
          <EmptyState title="Chưa có bài viết nào" />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((n) => (
              <NewsCard key={n._id} item={n} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 9))} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}