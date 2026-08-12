import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, Plus, Image as ImageIcon, Video, Play } from 'lucide-react';
import api from '../../services/api';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

export default function MediaAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.MEDIA_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState('image');
  const [form, setForm] = useState({ title: '', album: 'Chung', description: '', url: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/media', { params: { page, limit: 24, album } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, album]);

  useEffect(() => { load(); }, [load]);

  const openCreate = (type) => {
    setTab(type);
    setForm({ title: '', album: 'Chung', description: '', url: '' });
    setFile(null);
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (tab === 'image') {
        if (!file) { toast.error('Vui lòng chọn ảnh.'); setSaving(false); return; }
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        formData.append('file', file);
        await api.post('/media/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        if (!form.url && !file) { toast.error('Vui lòng nhập link video hoặc tải file lên.'); setSaving(false); return; }
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (file) formData.append('file', file);
        await api.post('/media/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success('Đã thêm vào thư viện.');
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/media/${deleteTarget._id}`);
      toast.success('Đã xoá.');
      setDeleteTarget(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Xoá thất bại.'); }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input w-full sm:max-w-xs"
          placeholder="Lọc theo album..."
          value={album}
          onChange={(e) => { setPage(1); setAlbum(e.target.value); }}
        />
        {canManage && (
          <div className="flex gap-2">
            <button onClick={() => openCreate('image')} className="btn-outline"><ImageIcon className="h-4 w-4" /> Thêm ảnh</button>
            <button onClick={() => openCreate('video')} className="btn-primary"><Video className="h-4 w-4" /> Thêm video</button>
          </div>
        )}
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Thư viện trống" icon={ImageIcon} /> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((m) => (
            <div key={m._id} className="group relative overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-video bg-ink-100">
                <img src={m.type === 'video' ? (m.thumbnailUrl || '/vite.svg') : m.url} alt={m.title} className="h-full w-full object-cover" />
                {m.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-900/30">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-ink-700">{m.title || '(Không có tiêu đề)'}</p>
                <p className="truncate text-[11px] text-ink-400">{m.album}</p>
              </div>
              {canManage && (
                <button
                  onClick={() => setDeleteTarget(m)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 opacity-0 shadow-card transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 text-union-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 24))} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={tab === 'image' ? 'Thêm ảnh vào thư viện' : 'Thêm video vào thư viện'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Tiêu đề</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Album</label>
            <input className="input" value={form.album} onChange={(e) => setForm({ ...form, album: e.target.value })} placeholder="VD: Hội thao 2026" />
          </div>
          {tab === 'image' ? (
            <div>
              <label className="label">Chọn ảnh</label>
              <input type="file" accept="image/*" className="input !py-2" onChange={(e) => setFile(e.target.files[0])} />
            </div>
          ) : (
            <>
              <div>
                <label className="label">Link video (Youtube...) — hoặc tải file bên dưới</label>
                <input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="label">Hoặc tải file video lên</label>
                <input type="file" accept="video/*" className="input !py-2" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </>
          )}
          <div>
            <label className="label">Mô tả</label>
            <textarea className="textarea !min-h-[70px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Xoá khỏi thư viện" description="Bạn có chắc muốn xoá mục này?" confirmLabel="Xoá" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
