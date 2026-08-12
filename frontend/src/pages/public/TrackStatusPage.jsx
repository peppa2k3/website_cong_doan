import React, { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { FEEDBACK_TYPES, FEEDBACK_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';

export default function TrackStatusPage() {
  const [form, setForm] = useState({ trackingCode: '', lookupPin: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post('/public/feedback/track', {
        trackingCode: form.trackingCode.trim(),
        lookupPin: form.lookupPin.trim(),
      });
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tìm thấy thông tin, vui lòng kiểm tra lại.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">Tra cứu trạng thái xử lý</h1>
        <p className="mt-2 text-ink-500">Nhập mã tra cứu và mã PIN đã đặt khi gửi góp ý/phản ánh/tố cáo.</p>
      </div>

      <form onSubmit={submit} className="card mx-auto mt-8 max-w-lg p-6">
        <div className="mb-4">
          <label className="label">Mã tra cứu</label>
          <input required className="input font-mono uppercase" placeholder="VD: PA-7K3F9D" value={form.trackingCode} onChange={(e) => setForm({ ...form, trackingCode: e.target.value })} />
        </div>
        <div className="mb-5">
          <label className="label">Mã PIN</label>
          <input required inputMode="numeric" className="input max-w-[180px]" value={form.lookupPin} onChange={(e) => setForm({ ...form, lookupPin: e.target.value.replace(/\D/g, '') })} />
        </div>
        {error && <div className="mb-4 rounded-md border border-union-200 bg-union-50 px-3 py-2.5 text-sm text-union-700">{error}</div>}
        <button disabled={loading} className="btn-primary w-full !py-3"><Search className="h-4 w-4" /> {loading ? 'Đang tra cứu...' : 'Tra cứu'}</button>
      </form>

      {result && (
        <div className="card mx-auto mt-6 max-w-lg p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${FEEDBACK_TYPES[result.type].color}`}>{FEEDBACK_TYPES[result.type].label}</span>
            <span className={`badge ${FEEDBACK_STATUS[result.status].color}`}>{FEEDBACK_STATUS[result.status].label}</span>
            <span className="text-xs text-ink-400">{formatDateTime(result.createdAt)}</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-ink-800">{result.title}</h3>

          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 font-display font-semibold text-ink-800"><MessageSquare className="h-4 w-4" /> Phản hồi từ Công đoàn</p>
            {result.responses?.length === 0 && <p className="text-sm text-ink-400">Chưa có phản hồi. Vui lòng quay lại sau.</p>}
            <div className="space-y-2.5">
              {result.responses?.map((r, i) => (
                <div key={i} className="rounded-md bg-ink-50 p-3">
                  <div className="flex items-center justify-between text-xs text-ink-400">
                    <span className="font-medium text-ink-600">{r.respondedByName || 'Cán bộ Công đoàn'}</span>
                    <span>{formatDateTime(r.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-700">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
