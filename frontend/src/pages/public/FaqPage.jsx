import React, { useEffect, useState, useCallback } from 'react';
import { ChevronDown, Send, HelpCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="font-medium text-ink-800">{item.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-line bg-ink-50 p-4 text-sm leading-relaxed text-ink-600">{item.answer}</div>}
    </div>
  );
}

export default function FaqPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: '', askerName: '', askerEmail: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/public/faqs', { params: { page, limit: 10 } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/public/faqs', form);
      setSubmitted(true);
      setForm({ question: '', askerName: '', askerEmail: '' });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.response?.data?.message || 'Gửi câu hỏi thất bại, vui lòng thử lại.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">Hỏi đáp</h1>
        <p className="mt-2 max-w-2xl text-ink-500">Những câu hỏi thường gặp về chế độ, chính sách và hoạt động Công đoàn.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Chưa có câu hỏi nào được công khai" icon={HelpCircle} /> : (
            <div className="space-y-3">
              {rows.map((f) => <AccordionItem key={f._id} item={f} />)}
            </div>
          )}
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 10))} onChange={setPage} />
        </div>

        <div>
          <div className="card p-5">
            <h3 className="font-display font-semibold text-ink-800">Gửi câu hỏi cho Công đoàn</h3>
            {submitted ? (
              <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
                <CheckCircle2 className="h-9 w-9 text-green-500" />
                <p className="text-sm text-ink-600">Cảm ơn bạn. Câu hỏi đã được gửi và sẽ được trả lời sớm nhất.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline mt-2 text-xs">Gửi câu hỏi khác</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <div>
                  <label className="label">Câu hỏi của bạn</label>
                  <textarea required className="textarea !min-h-[100px]" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                </div>
                <div>
                  <label className="label">Họ tên (không bắt buộc)</label>
                  <input className="input" value={form.askerName} onChange={(e) => setForm({ ...form, askerName: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email nhận phản hồi (không bắt buộc)</label>
                  <input type="email" className="input" value={form.askerEmail} onChange={(e) => setForm({ ...form, askerEmail: e.target.value })} />
                </div>
                <button disabled={submitting} className="btn-primary w-full">
                  <Send className="h-4 w-4" /> {submitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
