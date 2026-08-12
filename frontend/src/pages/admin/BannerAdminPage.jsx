import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../../services/api';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { LoadingSpinner, EmptyState } from '../../components/common/Feedback';
import ImagePickerField from '../../components/admin/ImagePickerField';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

const POSITIONS = { home_slider: 'Slider trang chủ', home_side: 'Banner phụ trang chủ', popup: 'Popup thông báo' };
const EMPTY_FORM = { title: '', linkUrl: '', position: 'home_slider', order: 0, isActive: true };

export default function BannerAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.BANNER_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/banners');
      setRows(data.data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setImageFile(null); setCurrentImage(''); setModalOpen(true); };
  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({ title: row.title, linkUrl: row.linkUrl || '', position: row.position, order: row.order, isActive: row.isActive });
    setImageFile(null);
    setCurrentImage(row.imageUrl);
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) { toast.error('Vui lòng chọn hình ảnh banner.'); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      if (editingId) {
        await api.put(`/banners/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Cập nhật banner thành công.');
      } else {
        await api.post('/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Tạo banner thành công.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/banners/${deleteTarget._id}`);
      toast.success('Đã xoá banner.');
      setDeleteTarget(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Xoá thất bại.'); }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        {canManage && <button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" /> Thêm banner</button>}
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có banner nào" /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((b) => (
            <div key={b._id} className="card overflow-hidden">
              <img src={b.imageUrl} alt={b.title} className="h-36 w-full object-cover" />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="badge bg-ink-100 text-ink-600">{POSITIONS[b.position]}</span>
                  <span className={`badge ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-400'}`}>{b.isActive ? 'Đang hiển thị' : 'Đã ẩn'}</span>
                </div>
                <p className="mt-2 truncate text-sm font-medium text-ink-800">{b.title}</p>
                {canManage && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openEdit(b)} className="btn-outline flex-1 !py-1.5 text-xs"><Pencil className="h-3.5 w-3.5" /> Sửa</button>
                    <button onClick={() => setDeleteTarget(b)} className="btn-outline flex-1 !py-1.5 text-xs text-union-600"><Trash2 className="h-3.5 w-3.5" /> Xoá</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Chỉnh sửa banner' : 'Thêm banner'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Tiêu đề</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <ImagePickerField label="Hình ảnh banner" currentUrl={currentImage} file={imageFile} onChange={setImageFile} />
          <div>
            <label className="label">Đường dẫn liên kết (khi bấm vào banner)</label>
            <input className="input" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="/tin-tuc/... hoặc để trống" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Vị trí hiển thị</label>
              <select className="select" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                {Object.entries(POSITIONS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Thứ tự</label>
              <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Đang hiển thị công khai
          </label>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu banner'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Xoá banner" description={`Xoá banner "${deleteTarget?.title}"?`} confirmLabel="Xoá" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
