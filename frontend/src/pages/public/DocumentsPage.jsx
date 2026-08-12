import React, { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api';
import DocumentRow from '../../components/public/DocumentRow';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/Feedback';
import { DOC_TYPES } from '../../utils/constants';

export default function DocumentsPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [docType, setDocType] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/public/documents', { params: { page, limit: 10, search, docType } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, search, docType]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">Văn bản</h1>
        <p className="mt-2 max-w-2xl text-ink-500">Tra cứu nghị quyết, quyết định, công văn, kế hoạch và các văn bản khác của Công đoàn.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input className="input pl-9" placeholder="Tìm theo tiêu đề, số hiệu văn bản..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-ink-400" />
        </div>
        <select className="select w-full sm:w-56" value={docType} onChange={(e) => { setPage(1); setDocType(e.target.value); }}>
          <option value="">Tất cả loại văn bản</option>
          {Object.entries(DOC_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState title="Không tìm thấy văn bản phù hợp" /> : (
        <div className="space-y-3">
          {rows.map((d) => <DocumentRow key={d._id} item={d} />)}
        </div>
      )}

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 10))} onChange={setPage} />
    </div>
  );
}
