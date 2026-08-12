import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, FileText as FileIcon, Download } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import AdminToolbar from '../../components/admin/AdminToolbar';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Feedback';
import { useToast } from '../../context/ToastContext';
import { DOC_TYPES } from '../../utils/constants';
import { formatDate, formatFileSize } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

const EMPTY_FORM = { title: '', docNumber: '', docType: 'khac', issuer: '', issuedDate: '', summary: '', category: 'chung', status: 'published' };

export default function DocumentsAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.DOCUMENT_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [docType, setDocType] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/documents', { params: { page, limit: 10, search, docType } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, docType]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setCurrentFileName('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      title: row.title, docNumber: row.docNumber || '', docType: row.docType, issuer: row.issuer || '',
      issuedDate: row.issuedDate ? row.issuedDate.slice(0, 10) : '', summary: row.summary || '', category: row.category, status: row.status,
    });
    setFile(null);
    setCurrentFileName(row.fileName);
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!editingId && !file) {
      toast.error('Vui lòng chọn file văn bản để tải lên.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('file', file);

      if (editingId) {
        await api.put(`/documents/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Cập nhật văn bản thành công.');
      } else {
        await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Đăng văn bản thành công.');
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
      await api.delete(`/documents/${deleteTarget._id}`);
      toast.success('Đã xoá văn bản.');
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
        placeholder="Tìm theo tiêu đề, số hiệu..."
        onAdd={canManage ? openCreate : undefined}
        addLabel="Đăng văn bản"
        filters={
          <select className="select w-full sm:w-52" value={docType} onChange={(e) => { setPage(1); setDocType(e.target.value); }}>
            <option value="">Tất cả loại văn bản</option>
            {Object.entries(DOC_TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        }
      />

      <DataTable
        loading={loading}
        rows={rows}
        columns={[
          {
            key: 'title', header: 'Văn bản', render: (r) => (
              <div className="flex items-start gap-2 max-w-md">
                <FileIcon className="mt-0.5 h-4 w-4 shrink-0 text-union-500" />
                <div>
                  <p className="font-medium text-ink-800">{r.title}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{r.docNumber} · {DOC_TYPES[r.docType]} · {formatFileSize(r.fileSize)}</p>
                </div>
              </div>
            ),
          },
          { key: 'issuedDate', header: 'Ngày ban hành', render: (r) => formatDate(r.issuedDate) },
          { key: 'downloadCount', header: 'Lượt tải' },
          {
            key: 'file', header: 'File', render: (r) => (
              <a href={r.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-union-600 hover:underline">
                <Download className="h-3.5 w-3.5" /> Tải xuống
              </a>
            ),
          },
        ]}
        actions={canManage ? (row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost !p-2" title="Sửa"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setDeleteTarget(row)} className="btn-ghost !p-2 text-union-600 hover:bg-union-50" title="Xoá"><Trash2 className="h-4 w-4" /></button>
          </>
        ) : undefined}
      />

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 10))} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Chỉnh sửa văn bản' : 'Đăng văn bản mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Tiêu đề văn bản</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Số hiệu văn bản</label>
              <input className="input" value={form.docNumber} onChange={(e) => setForm({ ...form, docNumber: e.target.value })} placeholder="VD: 12/QĐ-CĐ" />
            </div>
            <div>
              <label className="label">Loại văn bản</label>
              <select className="select" value={form.docType} onChange={(e) => setForm({ ...form, docType: e.target.value })}>
                {Object.entries(DOC_TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Cơ quan ban hành</label>
              <input className="input" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
            </div>
            <div>
              <label className="label">Ngày ban hành</label>
              <input type="date" className="input" value={form.issuedDate} onChange={(e) => setForm({ ...form, issuedDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Tóm tắt nội dung</label>
            <textarea className="textarea !min-h-[80px]" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div>
            <label className="label">File văn bản {currentFileName && <span className="font-normal text-ink-400">(hiện tại: {currentFileName})</span>}</label>
            <input type="file" className="input !py-2" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar" />
          </div>
          <div>
            <label className="label">Trạng thái hiển thị</label>
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Bản nháp (chưa công khai)</option>
              <option value="published">Công khai</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu văn bản'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá văn bản"
        description={`Bạn có chắc muốn xoá văn bản "${deleteTarget?.title}"?`}
        confirmLabel="Xoá văn bản"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
