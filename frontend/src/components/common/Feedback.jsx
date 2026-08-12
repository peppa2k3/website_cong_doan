import React from 'react';
import { Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

export function StatusBadge({ label, colorClass }) {
  return <span className={`badge ${colorClass}`}>{label}</span>;
}

export function LoadingSpinner({ label = 'Đang tải dữ liệu...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <Loader2 className="h-6 w-6 animate-spin text-union-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Chưa có dữ liệu', description = '', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line py-16 text-center">
      <Icon className="h-9 w-9 text-ink-300" />
      <p className="font-display font-semibold text-ink-600">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-400">{description}</p>}
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Phân trang">
      <button
        className="btn-ghost h-9 w-9 !p-0"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {start > 1 && (
        <>
          <PageBtn n={1} page={page} onChange={onChange} />
          {start > 2 && <span className="px-1 text-ink-300">…</span>}
        </>
      )}
      {pages.map((n) => (
        <PageBtn key={n} n={n} page={page} onChange={onChange} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-ink-300">…</span>}
          <PageBtn n={totalPages} page={page} onChange={onChange} />
        </>
      )}
      <button
        className="btn-ghost h-9 w-9 !p-0"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function PageBtn({ n, page, onChange }) {
  const active = n === page;
  return (
    <button
      onClick={() => onChange(n)}
      className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-union-500 text-white' : 'text-ink-600 hover:bg-ink-50'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {n}
    </button>
  );
}
