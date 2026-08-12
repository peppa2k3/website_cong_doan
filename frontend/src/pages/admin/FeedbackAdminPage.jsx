import React, { useEffect, useState, useCallback } from 'react';
import { Paperclip, Send, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { FEEDBACK_TYPES, FEEDBACK_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

export default function FeedbackAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.FEEDBACK_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/feedback', { params: { page, limit: 12, type, status } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, type, status]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (row) => {
    const { data } = await api.get(`/feedback/${row._id}`);
    setDetail(data.data);
    setResponseText('');
  };

  const changeStatus = async (newStatus) => {
    try {
      await api.put(`/feedback/${detail._id}/status`, { status: newStatus });
      toast.success('Đã cập nhật trạng thái.');
      const { data } = await api.get(`/feedback/${detail._id}`);
      setDetail(data.data);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra.'); }
  };

  const submitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/feedback/${detail._id}/responses`, { content: responseText });
      setDetail(data.data);
      setResponseText('');
      toast.success('Đã gửi phản hồi.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi phản hồi thất bại.');
    } finally { setSending(false); }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <select className="select w-full sm:w-48" value={type} onChange={(e) => { setPage(1); setType(e.target.value); }}>
          <option value="">Tất cả hình thức</option>
          {Object.entries(FEEDBACK_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="select w-full sm:w-48" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(FEEDBACK_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có góp ý/phản ánh/tố cáo nào" icon={ShieldAlert} /> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((f) => (
            <button key={f._id} onClick={() => openDetail(f)} className="card p-4 text-left transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className={`badge ${FEEDBACK_TYPES[f.type].color}`}>{FEEDBACK_TYPES[f.type].label}</span>
                <span className={`badge ${FEEDBACK_STATUS[f.status].color}`}>{FEEDBACK_STATUS[f.status].label}</span>
              </div>
              <p className="mt-2.5 line-clamp-2 font-medium text-ink-800">{f.title}</p>
              <div className="mt-2.5 flex items-center justify-between text-xs text-ink-400">
                <span className="font-mono">{f.trackingCode}</span>
                <span>{formatDateTime(f.createdAt)}</span>
              </div>
              {f.isAnonymous && <p className="mt-1.5 text-[11px] font-medium text-union-500">Gửi ẩn danh</p>}
            </button>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 12))} onChange={setPage} />

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.trackingCode || ''} width="max-w-2xl">
        {detail && (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${FEEDBACK_TYPES[detail.type].color}`}>{FEEDBACK_TYPES[detail.type].label}</span>
              <span className={`badge ${FEEDBACK_STATUS[detail.status].color}`}>{FEEDBACK_STATUS[detail.status].label}</span>
              <span className="text-xs text-ink-400">{formatDateTime(detail.createdAt)}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-800">{detail.title}</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">{detail.content}</p>

            {detail.attachments?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.attachments.map((a, i) => (
                  <a key={i} href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-ink-600 hover:border-union-300">
                    <Paperclip className="h-3.5 w-3.5" /> {a.name}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-md border border-line p-3 text-sm">
              <p className="font-semibold text-ink-700">Thông tin người gửi</p>
              {detail.isAnonymous ? (
                <p className="mt-1 text-ink-500">Người gửi lựa chọn ẩn danh.</p>
              ) : (
                <div className="mt-1 space-y-0.5 text-ink-500">
                  <p>Họ tên: {detail.submitterName || '—'}</p>
                  <p>Email: {detail.submitterEmail || '—'}</p>
                  <p>Điện thoại: {detail.submitterPhone || '—'}</p>
                  <p>Đơn vị: {detail.submitterDepartment || '—'}</p>
                </div>
              )}
            </div>

            {canManage && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(FEEDBACK_STATUS).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => changeStatus(k)}
                    className={`badge cursor-pointer border ${detail.status === k ? `${v.color} border-transparent` : 'border-line bg-white text-ink-500 hover:border-union-300'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5">
              <p className="mb-2 font-display font-semibold text-ink-800">Trao đổi / phản hồi</p>
              <div className="max-h-56 space-y-2.5 overflow-y-auto">
                {detail.responses?.length === 0 && <p className="text-sm text-ink-400">Chưa có phản hồi nào.</p>}
                {detail.responses?.map((r, i) => (
                  <div key={i} className="rounded-md bg-ink-50 p-3">
                    <div className="flex items-center justify-between text-xs text-ink-400">
                      <span className="font-medium text-ink-600">{r.respondedByName || 'Cán bộ Công đoàn'}</span>
                      <span>{formatDateTime(r.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-700">{r.content}</p>
                  </div>
                ))}
              </div>
              {canManage && (
                <form onSubmit={submitResponse} className="mt-3 flex gap-2">
                  <input className="input flex-1" placeholder="Nhập phản hồi..." value={responseText} onChange={(e) => setResponseText(e.target.value)} />
                  <button disabled={sending} className="btn-primary !px-3"><Send className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
