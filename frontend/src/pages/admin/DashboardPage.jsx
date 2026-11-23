import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, FileText, MessageSquareWarning, Users2, Eye, Images, Clock } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/Feedback';
import { FEEDBACK_STATUS, FEEDBACK_TYPES } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';

const ACCENT_CLASSES = {
  union: 'bg-union-50 text-union-600',
  brass: 'bg-brass-50 text-brass-600',
};

function StatCard({ icon: Icon, label, value, accent = 'union' }) {
  return (
    <div className="card min-w-0 p-3 sm:p-5">
      <div className={`inline-flex rounded-md p-2 ${ACCENT_CLASSES[accent]}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="mt-3">
        <p className="break-words font-display text-xl font-bold tabular-nums text-ink-800 sm:text-2xl">{value}</p>
        <p className="mt-1 text-xs font-medium leading-snug text-ink-500 sm:text-sm">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setData(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard icon={Newspaper} label="Tin đã đăng" value={data.news.published} />
        <StatCard icon={FileText} label="Văn bản" value={data.documentCount} accent="brass" />
        <StatCard icon={MessageSquareWarning} label="Góp ý/Phản ánh/Tố cáo" value={data.feedback.total} />
        <StatCard icon={Eye} label="Lượt xem tin tức" value={data.totalNewsViews} accent="brass" />
        <StatCard icon={Images} label="Ảnh/Video" value={data.mediaCount} />
        <StatCard icon={Users2} label="Tài khoản quản trị" value={data.userCount} accent="brass" />
        <StatCard icon={MessageSquareWarning} label="Câu hỏi chờ trả lời" value={data.faqPending} />
        <StatCard icon={Newspaper} label="Tin nháp chưa đăng" value={data.news.draft} accent="brass" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-3">
        <div className="card min-w-0 p-4 sm:p-5 xl:col-span-2">
          <h3 className="font-display font-semibold text-ink-800">Trạng thái xử lý Góp ý / Phản ánh / Tố cáo</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(FEEDBACK_STATUS).map(([key, meta]) => {
              const count = data.feedback.byStatus[key] || 0;
              const total = data.feedback.total || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-600">{meta.label}</span>
                    <span className="text-ink-400">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-ink-100">
                    <div className="h-2 rounded-full bg-union-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="mt-6 font-display font-semibold text-ink-800">Phân loại theo hình thức</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
            {Object.entries(FEEDBACK_TYPES).map(([key, meta]) => (
              <div key={key} className="min-w-0 rounded-md border border-line px-1 py-3 text-center sm:px-3">
                <p className="font-display text-xl font-bold text-ink-800">{data.feedback.byType[key] || 0}</p>
                <p className="mt-1 text-xs font-medium text-ink-500">{meta.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card min-w-0 p-4 sm:p-5">
          <h3 className="font-display font-semibold text-ink-800">Phản ánh gần đây</h3>
          <div className="mt-3 space-y-3">
            {data.recentFeedback.map((f) => (
              <Link key={f._id} to="/admin/feedback" className="block rounded-md border border-line p-3 hover:border-union-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="break-all font-mono text-xs text-ink-400">{f.trackingCode}</span>
                  <span className={`badge ${FEEDBACK_STATUS[f.status]?.color}`}>{FEEDBACK_STATUS[f.status]?.label}</span>
                </div>
                <p className="mt-1.5 truncate text-sm font-medium text-ink-700">{f.title}</p>
              </Link>
            ))}
            {data.recentFeedback.length === 0 && <p className="text-sm text-ink-400">Chưa có phản ánh nào.</p>}
          </div>
        </div>
      </div>

      <div className="card mt-4 p-4 sm:mt-6 sm:p-5">
        <h3 className="font-display font-semibold text-ink-800">Nhật ký hoạt động gần đây</h3>
        <div className="mt-3 divide-y divide-line">
          {data.recentLogs.map((log) => (
            <div key={log._id} className="flex flex-col gap-1 py-2.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-2 text-ink-600">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                <p className="[overflow-wrap:anywhere]">
                  <span className="font-medium">{log.userName}</span>
                  <span className="text-ink-400"> — {log.description || `${log.action} ${log.module}`}</span>
                </p>
              </div>
              <span className="shrink-0 pl-[1.375rem] text-xs text-ink-400 sm:pl-0">{formatDateTime(log.createdAt)}</span>
            </div>
          ))}
          {data.recentLogs.length === 0 && <p className="py-3 text-sm text-ink-400">Chưa có hoạt động nào.</p>}
        </div>
      </div>
    </div>
  );
}
