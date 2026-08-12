import React from 'react';
import { FileText, Download, CalendarDays } from 'lucide-react';
import { DOC_TYPES } from '../../utils/constants';
import { formatDate, formatFileSize } from '../../utils/format';
import api from '../../services/api';

export default function DocumentRow({ item }) {
  const handleDownload = async () => {
    try {
      const { data } = await api.get(`/public/documents/${item._id}/download`);
      const link = document.createElement('a');
      link.href = data.data.fileUrl;
      link.download = data.data.fileName;
      link.click();
    } catch (err) {
      window.open(item.fileUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-union-50 text-union-600">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-ink-800">{item.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
            {item.docNumber && <span className="font-mono">{item.docNumber}</span>}
            <span>{DOC_TYPES[item.docType]}</span>
            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDate(item.issuedDate)}</span>
            <span>{formatFileSize(item.fileSize)}</span>
          </div>
        </div>
      </div>
      <button onClick={handleDownload} className="btn-outline shrink-0 !py-2 text-sm">
        <Download className="h-4 w-4" /> Tải xuống
      </button>
    </div>
  );
}
