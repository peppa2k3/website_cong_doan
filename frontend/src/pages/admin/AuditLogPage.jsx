import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import { Pagination } from '../../components/common/Feedback';
import { formatDateTime } from '../../utils/format';

const ACTION_LABELS = { create: 'Tạo mới', update: 'Cập nhật', delete: 'Xoá', login: 'Đăng nhập', logout: 'Đăng xuất' };
const MODULE_LABELS = { news: 'Tin tức', document: 'Văn bản', organization: 'Cơ cấu tổ chức', banner: 'Banner', media: 'Thư viện', faq: 'Hỏi đáp', feedback: 'Góp ý/Phản ánh/Tố cáo', user: 'Người dùng', auth: 'Xác thực' };

export default function AuditLogPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auditlogs', { params: { page, limit: 25, module: moduleFilter } });
      setRows(data.data);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [page, moduleFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <select className="select w-full sm:w-56" value={moduleFilter} onChange={(e) => { setPage(1); setModuleFilter(e.target.value); }}>
          <option value="">Tất cả module</option>
          {Object.entries(MODULE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        columns={[
          { key: 'createdAt', header: 'Thời gian', render: (r) => formatDateTime(r.createdAt) },
          { key: 'userName', header: 'Người thực hiện' },
          { key: 'action', header: 'Hành động', render: (r) => <span className="badge bg-ink-100 text-ink-600">{ACTION_LABELS[r.action] || r.action}</span> },
          { key: 'module', header: 'Chức năng', render: (r) => MODULE_LABELS[r.module] || r.module },
          { key: 'description', header: 'Mô tả' },
          { key: 'ipAddress', header: 'Địa chỉ IP' },
        ]}
      />

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 25))} onChange={setPage} />
    </div>
  );
}
