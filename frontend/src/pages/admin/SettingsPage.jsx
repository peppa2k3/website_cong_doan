import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Đổi mật khẩu thành công.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-lg">
      <div className="card p-5">
        <h3 className="font-display font-semibold text-ink-800">Thông tin tài khoản</h3>
        <div className="mt-3 space-y-1.5 text-sm text-ink-600">
          <p>Họ tên: <span className="font-medium text-ink-800">{user?.fullName}</span></p>
          <p>Tên đăng nhập: <span className="font-medium text-ink-800">{user?.username}</span></p>
          <p>Email: <span className="font-medium text-ink-800">{user?.email}</span></p>
          <p>Vai trò: <span className="font-medium text-ink-800">{user?.role?.name}</span></p>
        </div>
      </div>

      <form onSubmit={submit} className="card mt-5 p-5">
        <h3 className="font-display font-semibold text-ink-800">Đổi mật khẩu</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="label">Mật khẩu hiện tại</label>
            <input type="password" className="input" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <div>
            <label className="label">Mật khẩu mới</label>
            <input type="password" className="input" required minLength={8} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="label">Xác nhận mật khẩu mới</label>
            <input type="password" className="input" required minLength={8} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Cập nhật mật khẩu'}</button>
        </div>
      </form>
    </div>
  );
}
