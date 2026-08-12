import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Pin, Star } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import AdminToolbar from '../../components/admin/AdminToolbar';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Feedback';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImagePickerField from '../../components/admin/ImagePickerField';
import { useToast } from '../../context/ToastContext';
import { NEWS_CATEGORIES, NEWS_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

const EMPTY_FORM = {
  title: '', summary: '', content: '', category: 'tin_tuc', status: 'draft', isPinned: false, isFeatured: false,
};

export default function NewsAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.NEWS_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [thumbFile, setThumbFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/news', { params: { page, limit: 10, search, category } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setThumbFile(null);
    setModalOpen(true);
  };

  const openEdit = async (row) => {
    const { data } = await api.get(`/news/${row._id}`);
    const item = data.data;
    setEditingId(item._id);
    setForm({
      title: item.title, summary: item.summary || '', content: item.content, category: item.category,
      status: item.status, isPinned: item.isPinned, isFeatured: item.isFeatured,
    });
    setThumbFile({ preview: item.thumbnail });
    setModalOpen(true);
  };

  const uploadThumbIfNeeded = async () => {
    if (thumbFile instanceof File) {
      const formData = new FormData();
      formData.append('image', thumbFile);
      const { data } = await api.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data.data.url;
    }
    return thumbFile?.preview || undefined;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const thumbnail = await uploadThumbIfNeeded();
      const payload = { ...form, thumbnail };
      if (editingId) {
        await api.put(`/news/${editingId}`, payload);
        toast.success('Cập nhật tin thành công.');
      } else {
        await api.post('/news', payload);
        toast.success('Tạo tin thành công.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/news/${deleteTarget._id}`);
      toast.success('Đã xoá tin.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xoá thất bại.');
    }
  };

  return (
    <div>
      <AdminToolbar
        search={search}
        onSearchChange={(v) => { setPage(1); setSearch(v); }}
        placeholder="Tìm theo tiêu đề..."
        onAdd={canManage ? openCreate : undefined}
        addLabel="Đăng tin mới"
        filters={
          <select className="select w-full sm:w-52" value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }}>
            <option value="">Tất cả chuyên mục</option>
            {Object.entries(NEWS_CATEGORIES).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}
          </select>
        }
      />

      <DataTable
        loading={loading}
        rows={rows}
        columns={[
          {
            key: 'title', header: 'Tiêu đề', render: (r) => (
              <div className="flex items-start gap-1.5 max-w-md">
                <div>
                  <p className="font-medium text-ink-800">{r.title}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{NEWS_CATEGORIES[r.category]?.label}</p>
                </div>
                {r.isPinned && <Pin className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" />}
                {r.isFeatured && <Star className="mt-1 h-3.5 w-3.5 shrink-0 text-union-500" />}
              </div>
            ),
          },
          { key: 'status', header: 'Trạng thái', render: (r) => <span className={`badge ${NEWS_STATUS[r.status].color}`}>{NEWS_STATUS[r.status].label}</span> },
          { key: 'views', header: 'Lượt xem' },
          { key: 'createdAt', header: 'Ngày tạo', render: (r) => formatDate(r.createdAt) },
        ]}
        actions={canManage ? (row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost !p-2" title="Sửa"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setDeleteTarget(row)} className="btn-ghost !p-2 text-union-600 hover:bg-union-50" title="Xoá"><Trash2 className="h-4 w-4" /></button>
          </>
        ) : undefined}
      />

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 10))} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Chỉnh sửa tin' : 'Đăng tin mới'} width="max-w-3xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Tiêu đề</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Chuyên mục</label>
              <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.entries(NEWS_CATEGORIES).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Trạng thái</label>
              <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Bản nháp</option>
                <option value="published">Đăng ngay</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Tóm tắt</label>
            <textarea className="textarea !min-h-[70px]" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} maxLength={500} />
          </div>
          <ImagePickerField
            label="Ảnh đại diện"
            currentUrl={thumbFile?.preview}
            file={thumbFile instanceof File ? thumbFile : null}
            onChange={(f) => setThumbFile(f)}
          />
          <div>
            <label className="label">Nội dung</label>
            <RichTextEditor value={form.content} onChange={(v) => setForm({ ...form, content: v })} placeholder="Soạn nội dung tin..." />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} />
              Ghim ở trang chủ (thông báo mới)
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Tin nổi bật
            </label>
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu tin'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá tin tức"
        description={`Bạn có chắc muốn xoá tin "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá tin"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
