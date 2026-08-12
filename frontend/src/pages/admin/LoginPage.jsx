import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UnionSeal from '../../components/common/UnionSeal';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-800 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* <UnionSeal size={72} spin={false} className="text-brass-400" /> */}
          <img src="/hhcd.svg" alt="My SVG Logo" width="75" height="50"></img>
          <h1 className="mt-4 font-display text-xl font-bold text-white">Trang quản trị Công đoàn</h1>
          <p className="mt-1 text-sm text-ink-300">Đăng nhập dành cho cán bộ Công đoàn</p>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8">
          {error && (
            <div className="mb-4 rounded-md border border-union-200 bg-union-50 px-3 py-2.5 text-sm text-union-700">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="label">Tên đăng nhập / Email</label>
            <input
              className="input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="label">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-ink-400 hover:text-ink-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button disabled={loading} className="btn-primary w-full !py-3">
            <LogIn className="h-4 w-4" /> {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          <Link to="/" className="hover:text-white">← Quay về trang công khai</Link>
        </p>
      </div>
    </div>
  );
}
