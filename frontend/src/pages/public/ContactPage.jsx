import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Paperclip, CheckCircle2, Copy, X } from 'lucide-react';
import api from '../../services/api';
import { FEEDBACK_TYPES } from '../../utils/constants';

const EMPTY_FORM = {
  type: 'gop_y', title: '', content: '', isAnonymous: false,
  submitterName: '', submitterEmail: '', submitterPhone: '', submitterDepartment: '', lookupPin: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const addFiles = (fileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)].slice(0, 5));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.lookupPin.length < 4) {
      setError('Vui lòng đặt mã PIN gồm ít nhất 4 số để tra cứu trạng thái xử lý sau này.');
      return;
    }
    if (!form.isAnonymous && (!form.submitterName || !form.submitterEmail)) {
      setError('Vui lòng nhập họ tên và email, hoặc chọn gửi ẩn danh.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((f) => formData.append('attachments', f));
      const { data } = await api.post('/public/feedback', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(data.data);
      setForm(EMPTY_FORM);
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi thất bại, vui lòng thử lại.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">Liên hệ</h1>
        <p className="mt-2 max-w-2xl text-ink-500">Thông tin liên hệ và kênh tiếp nhận góp ý, phản ánh, tố cáo của Công đoàn.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-ink-800">Thông tin liên hệ</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li className="flex gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-union-500" /> Lô 43-16 đường N14, KCN Phước Đông, Xã Phước Đông, Huyện Gò Dầu, Tỉnh Tây Ninh, Việt Nam</li>
              <li className="flex gap-2.5"><Phone className="h-4 w-4 shrink-0 text-union-500" /> 1900 xxxx</li>
              <li className="flex gap-2.5"><Mail className="h-4 w-4 shrink-0 text-union-500" /> congdoan@billion.com</li>
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-display font-semibold text-ink-800">Cam kết bảo mật</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Thông tin góp ý, phản ánh, tố cáo được bảo mật và chỉ cán bộ Công đoàn có thẩm quyền xử lý mới được tiếp cận. Bạn có thể lựa chọn gửi ẩn danh đối với nội dung tố cáo.
            </p>
          </div>
        </div>

        <div id="gui-phan-anh" className="lg:col-span-2 scroll-mt-24">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink-800">Gửi góp ý / phản ánh / tố cáo</h3>

            {result ? (
              <div className="mt-5 rounded-md border border-green-200 bg-green-50 p-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
                <p className="mt-3 font-medium text-ink-800">Gửi thành công!</p>
                <p className="mt-1 text-sm text-ink-600">Vui lòng lưu lại mã tra cứu bên dưới để theo dõi trạng thái xử lý.</p>
                <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-md bg-white px-4 py-2 font-mono text-lg font-bold text-union-600 shadow-card">
                  {result.trackingCode}
                  <button type="button" onClick={() => navigator.clipboard.writeText(result.trackingCode)} title="Sao chép mã">
                    <Copy className="h-4 w-4 text-ink-400 hover:text-ink-700" />
                  </button>
                </div>
                <button onClick={() => setResult(null)} className="btn-outline mt-4 text-sm">Gửi phản ánh khác</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                {error && <div className="rounded-md border border-union-200 bg-union-50 px-3 py-2.5 text-sm text-union-700">{error}</div>}

                <div>
                  <label className="label">Hình thức gửi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(FEEDBACK_TYPES).map(([key, v]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setForm({ ...form, type: key })}
                        className={`rounded-md border py-2.5 text-sm font-medium transition-colors ${form.type === key ? 'border-union-400 bg-union-50 text-union-700' : 'border-line text-ink-500 hover:border-union-200'}`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Tiêu đề</label>
                  <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="label">Nội dung chi tiết</label>
                  <textarea required className="textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                </div>

                <div>
                  <label className="label">Tệp đính kèm (tối đa 5 file)</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-line px-3 py-2.5 text-sm text-ink-500 hover:border-union-300">
                    <Paperclip className="h-4 w-4" /> Chọn tệp đính kèm
                    <input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  </label>
                  {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-xs text-ink-600">
                          {f.name}
                          <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm text-ink-600">
                  <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} />
                  Gửi ẩn danh (không cung cấp thông tin cá nhân)
                </label>

                {!form.isAnonymous && (
                  <div className="grid grid-cols-1 gap-4 rounded-md bg-ink-50 p-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Họ và tên</label>
                      <input required={!form.isAnonymous} className="input" value={form.submitterName} onChange={(e) => setForm({ ...form, submitterName: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input required={!form.isAnonymous} type="email" className="input" value={form.submitterEmail} onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Số điện thoại</label>
                      <input className="input" value={form.submitterPhone} onChange={(e) => setForm({ ...form, submitterPhone: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Phòng ban / Đơn vị</label>
                      <input className="input" value={form.submitterDepartment} onChange={(e) => setForm({ ...form, submitterDepartment: e.target.value })} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">Đặt mã PIN tra cứu (tối thiểu 4 số)</label>
                  <input required minLength={4} inputMode="numeric" className="input max-w-[180px]" value={form.lookupPin} onChange={(e) => setForm({ ...form, lookupPin: e.target.value.replace(/\D/g, '') })} placeholder="VD: 1234" />
                  <p className="mt-1 text-xs text-ink-400">Dùng mã PIN này cùng mã tra cứu để theo dõi trạng thái xử lý sau này, kể cả khi gửi ẩn danh.</p>
                </div>

                <button disabled={submitting} className="btn-primary w-full !py-3">
                  <Send className="h-4 w-4" /> {submitting ? 'Đang gửi...' : 'Gửi đến Công đoàn'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
