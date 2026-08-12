import React, { useEffect, useState, useCallback } from 'react';
import { MessageCircle, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

export default function FaqAdminPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.FAQ_MANAGE);
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const [answering, setAnswering] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/faqs', { params: { page, limit: 15, status } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const openAnswer = (row) => {
    setAnswering(row);
    setAnswerText(row.answer || '');
    setIsPublished(row.status === 'da_tra_loi' ? row.isPublished : true);
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/faqs/${answering._id}/answer`, { answer: answerText, isPublished });
      toast.success('Đã lưu câu trả lời.');
      setAnswering(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/faqs/${deleteTarget._id}`);
      toast.success('Đã xoá.');
      setDeleteTarget(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Xoá thất bại.'); }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <select className="select w-full sm:w-56" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">Tất cả câu hỏi</option>
          <option value="cho_duyet">Chờ trả lời</option>
          <option value="da_tra_loi">Đã trả lời</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có câu hỏi nào" icon={MessageCircle} /> : (
        <div className="space-y-3">
          {rows.map((f) => (
            <div key={f._id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${f.status === 'da_tra_loi' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {f.status === 'da_tra_loi' ? 'Đã trả lời' : 'Chờ trả lời'}
                    </span>
                    {f.status === 'da_tra_loi' && (
                      <span className={`badge ${f.isPublished ? 'bg-ink-100 text-ink-600' : 'bg-ink-50 text-ink-400'}`}>
                        {f.isPublished ? 'Công khai' : 'Chưa công khai'}
                      </span>
                    )}
                    <span className="text-xs text-ink-400">{formatDateTime(f.createdAt)}</span>
                  </div>
                  <p className="mt-2 font-medium text-ink-800">{f.question}</p>
                  {f.askerName && <p className="mt-0.5 text-xs text-ink-400">Người hỏi: {f.askerName}</p>}
                  {f.answer && <p className="mt-2 rounded-md bg-ink-50 p-3 text-sm text-ink-600">{f.answer}</p>}
                </div>
                {canManage && (
                  <div className="flex shrink-0 gap-1.5">
                    <button onClick={() => openAnswer(f)} className="btn-outline !py-1.5 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> {f.answer ? 'Sửa trả lời' : 'Trả lời'}</button>
                    <button onClick={() => setDeleteTarget(f)} className="btn-ghost !p-2 text-union-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 15))} onChange={setPage} />

      <Modal open={!!answering} onClose={() => setAnswering(null)} title="Trả lời câu hỏi">
        {answering && (
          <form onSubmit={submitAnswer} className="space-y-4">
            <div className="rounded-md bg-ink-50 p-3 text-sm text-ink-700">{answering.question}</div>
            <div>
              <label className="label">Câu trả lời</label>
              <textarea required className="textarea" value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              Công khai câu hỏi này ở trang Hỏi đáp
            </label>
            <div className="flex justify-end gap-2 border-t border-line pt-4">
              <button type="button" className="btn-outline" onClick={() => setAnswering(null)}>Huỷ</button>
              <button disabled={saving} className="btn-primary">{saving ? 'Đang lưu...' : 'Lưu câu trả lời'}</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Xoá câu hỏi" description="Bạn có chắc muốn xoá câu hỏi này?" confirmLabel="Xoá" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
