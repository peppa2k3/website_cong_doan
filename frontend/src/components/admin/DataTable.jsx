import React from 'react';
import { LoadingSpinner, EmptyState } from '../common/Feedback';

/**
 * DataTable dùng chung cho các trang quản trị.
 * columns: [{ key, header, render?(row) }]
 * actions: (row) => ReactNode  — cột thao tác cuối bảng
 */
export default function DataTable({ columns, rows, loading, actions, emptyTitle = 'Chưa có dữ liệu' }) {
  if (loading) return <LoadingSpinner />;
  if (!rows || rows.length === 0) return <EmptyState title={emptyTitle} />;

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 whitespace-nowrap">{col.header}</th>
            ))}
            {actions && <th className="px-4 py-3 text-right">Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id || row.id} className="border-b border-line last:border-0 hover:bg-ink-50/60">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right align-top"><div className="flex justify-end gap-1.5">{actions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
