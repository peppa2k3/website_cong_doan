import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, KeyRound, ShieldCheck, ShieldOff } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import AdminToolbar from '../../components/admin/AdminToolbar';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Feedback';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

const EMPTY_FORM = { fullName: '', username: '', email: '', password: '', phone: '', department: '', position: '', role: '' };

export default function UsersAdminPage() {
  const { hasPermission, user: currentUser } = useAuth();
  const canManage = hasPermission(PERMISSIONS.USER_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { page, limit: 10, search } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.get('/users/roles/all').then((res) => setRoles(res.data.data)); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY_FORM, role: roles[0]?._id || '' }); setModalOpen(true); };
  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      fullName: row.fullName, username: row.username, email: row.email, password: '',
      phone: row.phone || '', department: row.department || '', position: row.position || '', role: row.role?._id,
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        toast.success('Cập nhật tài khoản thành công.');
      } else {
        await api.post('/users', form);
        toast.success('Tạo tài khoản thành công.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally { setSaving(false); }
  };

  const toggleActive = async (row) => {
    try {
      await api.put(`/users/${row._id}`, { isActive: !row.isActive });
      toast.success(row.isActive ? 'Đã khoá tài khoản.' : 'Đã mở khoá tài khoản.');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra.'); }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${resetTarget._id}/reset-password`, { newPassword });
      toast.success('Đặt lại mật khẩu thành công.');
      setResetTarget(null);
      setNewPassword('');
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra.'); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      toast.success('Đã xoá tài khoản.');
      setDeleteTarget(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Xoá thất bại.'); }
  };

  return (
    <div>
      <AdminToolbar search={search} onSearchChange={(v) => { setPage(1); setSearch(v); }} placeholder="Tìm theo tên, email..." onAdd={canManage ? openCreate : undefined} addLabel="Thêm tài khoản" />

      <DataTable
        loading={loading}
        rows={rows}
        columns={[
          { key: 'fullName', header: 'Họ tên', render: (r) => (
            <div>
              <p className="font-medium text-ink-800">{r.fullName}</p>
              <p className="text-xs text-ink-400">{r.username} · {r.email}</p>
            </div>
          ) },
          { key: 'role', header: 'Vai trò', render: (r) => <span className="badge bg-ink-100 text-ink-600">{r.role?.name}</span> },
          { key: 'department', header: 'Phòng ban / Chức vụ', render: (r) => <span>{r.department}{r.position ? ` · ${r.position}` : ''}</span> },
          { key: 'isActive', header: 'Trạng thái', render: (r) => <span className={`badge ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-400'}`}>{r.isActive ? 'Hoạt động' : 'Đã khoá'}</span> },
          { key: 'createdAt', header: 'Ngày tạo', render: (r) => formatDate(r.createdAt) },
        ]}
        actions={canManage ? (row) => (
          <>
            <button onClick={() => toggleActive(row)} className="btn-ghost !p-2" title={row.isActive ? 'Khoá tài khoản' : 'Mở khoá'}>
              {row.isActive ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </button>
            <button onClick={() => setResetTarget(row)} className="btn-ghost !p-2" title="Đặt lại mật khẩu"><KeyRound className="h-4 w-4" /></button>
            <button onClick={() => openEdit(row)} className="btn-ghost !p-2" title="Sửa"><Pencil className="h-4 w-4" /></button>
            {String(row._id) !== String(currentUser?._id) && (
              <button onClick={() => setDeleteTarget(row)} className="btn-ghost !p-2 text-union-600" title="Xoá"><Trash2 className="h-4 w-4" /></button>
            )}
          </>
        ) : undefined}
      />

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 10))} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Họ và tên</label>
              <input className="input" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div>
              <label className="label">Vai trò</label>
              <select className="select" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tên đăng nhập</label>
              <input className="input" required disabled={!!editingId} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" required disabled={!!editingId} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          {!editingId && (
            <div>
              <label className="label">Mật khẩu ban đầu</label>
              <input type="password" className="input" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Điện thoại</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Phòng ban</label>
              <input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <label className="label">Chức vụ</label>
              <input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu tài khoản'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!resetTarget} onClose={() => setResetTarget(null)} title={`Đặt lại mật khẩu — ${resetTarget?.username}`} width="max-w-sm">
        <form onSubmit={submitReset} className="space-y-4">
          <div>
            <label className="label">Mật khẩu mới</label>
            <input type="password" className="input" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" className="btn-outline" onClick={() => setResetTarget(null)}>Huỷ</button>
            <button className="btn-primary">Đặt lại</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Xoá tài khoản" description={`Xoá tài khoản "${deleteTarget?.username}"?`} confirmLabel="Xoá" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
