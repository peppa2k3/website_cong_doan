import React from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, width = 'max-w-xl' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-3 backdrop-blur-sm sm:p-6">
      <div className={`flex max-h-full w-full ${width} flex-col rounded-lg bg-white shadow-lift`}>
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-4 py-2 sm:px-5 sm:py-3">
          <h3 className="font-display text-lg font-semibold text-ink-800">{title}</h3>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-ink-400 hover:bg-ink-50 hover:text-ink-700" aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = 'Xác nhận', description, confirmLabel = 'Xác nhận', danger = true, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lift">
        <h3 className="font-display text-base font-semibold text-ink-800">{title}</h3>
        {description && <p className="mt-2 text-sm text-ink-500">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-outline" onClick={onCancel}>Huỷ</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
