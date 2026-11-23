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
    <div className="md:overflow-x-auto md:rounded-lg md:border md:border-line md:bg-white">
      <table role="table" className="block w-full text-left text-sm md:table md:min-w-[720px]">
        <thead role="rowgroup" className="sr-only md:not-sr-only md:table-header-group">
          <tr role="row" className="border-b border-line bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500">
            {columns.map((col) => (
              <th key={col.key} scope="col" role="columnheader" className="whitespace-nowrap px-4 py-3">{col.header}</th>
            ))}
            {actions && <th scope="col" role="columnheader" className="px-4 py-3 text-right">Thao tác</th>}
          </tr>
        </thead>
        <tbody role="rowgroup" className="grid gap-3 md:table-row-group">
          {rows.map((row) => (
            <tr key={row._id || row.id} role="row" className="block min-w-0 rounded-lg border border-line bg-white p-3 shadow-card md:table-row md:rounded-none md:border-x-0 md:border-t-0 md:p-0 md:shadow-none md:last:border-b-0 md:hover:bg-ink-50/60">
              {columns.map((col) => (
                <td key={col.key} role="cell" className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 border-b border-line/60 py-2 align-top last:border-b-0 md:table-cell md:border-b-0 md:px-4 md:py-3">
                  <span aria-hidden="true" className="text-xs font-semibold text-ink-500 md:hidden">{col.header}</span>
                  <div className="min-w-0 [overflow-wrap:anywhere]">{col.render ? col.render(row) : row[col.key]}</div>
                </td>
              ))}
              {actions && (
                <td role="cell" className="block pt-2 align-top md:table-cell md:px-4 md:py-3">
                  <div className="flex flex-wrap justify-end gap-1.5 max-md:[&_button]:min-h-11 max-md:[&_button]:min-w-11">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
