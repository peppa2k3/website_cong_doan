import React, { useEffect, useState, useCallback } from 'react';
import { Play, X, Images } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';

function getYoutubeEmbed(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com.*(?:\?v=|\/embed\/|\/v\/))([^&\n?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function GalleryPage() {
  const [rows, setRows] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [album, setAlbum] = useState('');
  const [type, setType] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/public/media', { params: { page, limit: 16, album, type } });
      setRows(data.data);
      setAlbums(data.albums || []);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, album, type]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">Thư viện ảnh & video</h1>
        <p className="mt-2 max-w-2xl text-ink-500">Hình ảnh và video các hoạt động, sự kiện của Công đoàn.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => { setPage(1); setType(''); }} className={`badge cursor-pointer border ${type === '' ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500'}`}>Tất cả</button>
        <button onClick={() => { setPage(1); setType('image'); }} className={`badge cursor-pointer border ${type === 'image' ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500'}`}>Hình ảnh</button>
        <button onClick={() => { setPage(1); setType('video'); }} className={`badge cursor-pointer border ${type === 'video' ? 'border-transparent bg-union-500 text-white' : 'border-line bg-white text-ink-500'}`}>Video</button>
        {albums.length > 0 && (
          <select className="select ml-auto w-full sm:w-56" value={album} onChange={(e) => { setPage(1); setAlbum(e.target.value); }}>
            <option value="">Tất cả album</option>
            {albums.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Thư viện trống" icon={Images} /> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((m) => (
            <button key={m._id} onClick={() => setActive(m)} className="group relative aspect-video overflow-hidden rounded-lg border border-line bg-ink-100">
              <img src={m.type === 'video' ? (m.thumbnailUrl || m.url) : m.url} alt={m.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" onError={(e) => { e.target.style.display = 'none'; }} />
              {m.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink-900/30">
                  <Play className="h-8 w-8 text-white" />
                </div>
              )}
              {m.title && <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink-900/70 to-transparent p-2 text-left text-xs text-white">{m.title}</span>}
            </button>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 16))} onChange={setPage} />

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 p-4" onClick={() => setActive(null)}>
          <button className="absolute right-5 top-5 text-white" onClick={() => setActive(null)}><X className="h-7 w-7" /></button>
          <div className="max-h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {active.type === 'image' ? (
              <img src={active.url} alt={active.title} className="max-h-[80vh] w-full rounded-lg object-contain" />
            ) : getYoutubeEmbed(active.url) ? (
              <iframe title={active.title} src={getYoutubeEmbed(active.url)} className="aspect-video w-full rounded-lg" allowFullScreen />
            ) : (
              <video src={active.url} controls className="w-full rounded-lg" />
            )}
            {active.title && <p className="mt-3 text-center font-medium text-white">{active.title}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
