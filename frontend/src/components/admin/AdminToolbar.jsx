import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function AdminToolbar({ search, onSearchChange, placeholder = 'Tìm kiếm...', onAdd, addLabel = 'Thêm mới', filters, children }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="input pl-9"
              aria-label={placeholder}
            />
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-ink-400" />
          </div>
        )}
        {filters}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {onAdd && (
          <button onClick={onAdd} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
