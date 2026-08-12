import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Plus, User } from 'lucide-react';
import api from '../../services/api';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { LoadingSpinner, EmptyState } from '../../components/common/Feedback';
import { useToast } from '../../context/ToastContext';
import { ORG_UNITS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

const EMPTY_FORM = { fullName: '', position: '', unit: 'ban_chap_hanh', parent: '', email: '', phone: '', bio: '', order: 0 };

export default function OrganizationAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.ORGANIZATION_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/organizations');
      setRows(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      fullName: row.fullName, position: row.position, unit: row.unit, parent: row.parent || '',
      email: row.email || '', phone: row.phone || '', bio: row.bio || '', order: row.order || 0,
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/organizations/${editingId}`, form);
        toast.success('Cập nhật thành công.');
      } else {
        await api.post('/organizations', form);
        toast.success('Thêm nhân sự thành công.');
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
      await api.delete(`/organizations/${deleteTarget._id}`);
      toast.success('Đã xoá.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xoá thất bại.');
    }
  };

  const grouped = rows.reduce((acc, r) => {
    acc[r.unit] = acc[r.unit] || [];
    acc[r.unit].push(r);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 flex justify-end">
        {canManage && (
          <button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" /> Thêm nhân sự</button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có dữ liệu cơ cấu tổ chức" /> : (
        <div className="space-y-6">
          {Object.entries(ORG_UNITS).map(([unitKey, unitLabel]) => {
            const list = grouped[unitKey];
            if (!list || list.length === 0) return null;
            return (
              <div key={unitKey} className="card p-5">
                <h3 className="font-display font-semibold text-ink-800">{unitLabel}</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.sort((a, b) => a.order - b.order).map((p) => (
                    <div key={p._id} className="flex items-start gap-3 rounded-md border border-line p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                        {p.avatar ? <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <User className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink-800">{p.fullName}</p>
                        <p className="truncate text-xs text-ink-500">{p.position}</p>
                        {p.parent && <p className="mt-0.5 text-[11px] text-ink-400">Trực thuộc: {rows.find((r) => r._id === p.parent)?.fullName || '—'}</p>}
                      </div>
                      {canManage && (
                        <div className="flex shrink-0 gap-1">
                          <button onClick={() => openEdit(p)} className="btn-ghost !p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDeleteTarget(p)} className="btn-ghost !p-1.5 text-union-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Họ và tên</label>
              <input className="input" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div>
              <label className="label">Chức vụ</label>
              <input className="input" required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Đơn vị</label>
              <select className="select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                {Object.entries(ORG_UNITS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Trực thuộc (cấp trên)</label>
              <select className="select" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}>
                <option value="">— Không có —</option>
                {rows.filter((r) => r._id !== editingId).map((r) => <option key={r._id} value={r._id}>{r.fullName} ({r.position})</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Số điện thoại</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Giới thiệu ngắn</label>
            <textarea className="textarea !min-h-[80px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="label">Thứ tự hiển thị</label>
            <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá nhân sự"
        description={`Bạn có chắc muốn xoá "${deleteTarget?.fullName}" khỏi cơ cấu tổ chức?`}
        confirmLabel="Xoá"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
