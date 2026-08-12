import React, { useEffect, useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/common/Feedback';
import { ORG_UNITS } from '../../utils/constants';

function PersonCard({ p }) {
  return (
    <div className="card flex flex-col items-center p-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-ink-100 text-ink-400">
        {p.avatar ? <img src={p.avatar} alt={p.fullName} className="h-full w-full object-cover" /> : <User className="h-7 w-7" />}
      </div>
      <p className="mt-3 font-display font-semibold text-ink-800">{p.fullName}</p>
      <p className="text-sm text-union-600">{p.position}</p>
      {p.bio && <p className="mt-2 text-xs leading-relaxed text-ink-500">{p.bio}</p>}
      <div className="mt-3 flex gap-3 text-xs text-ink-400">
        {p.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {p.email}</span>}
        {p.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {p.phone}</span>}
      </div>
      {p.children?.length > 0 && (
        <div className="mt-4 grid w-full grid-cols-1 gap-3 border-t border-line pt-4 sm:grid-cols-2">
          {p.children.map((c) => (
            <div key={c._id} className="rounded-md bg-ink-50 p-2.5 text-left">
              <p className="text-sm font-medium text-ink-700">{c.fullName}</p>
              <p className="text-xs text-ink-400">{c.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizationPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/organizations').then((res) => setTree(res.data.data)).finally(() => setLoading(false));
  }, []);

  const grouped = tree.reduce((acc, p) => {
    acc[p.unit] = acc[p.unit] || [];
    acc[p.unit].push(p);
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-extrabold text-ink-800">Cơ cấu tổ chức</h1>
        <p className="mt-2 max-w-2xl text-ink-500">Danh sách Ban Chấp hành, Uỷ ban Kiểm tra và các tổ chức trực thuộc Công đoàn.</p>
      </div>

      {loading ? <LoadingSpinner /> : tree.length === 0 ? <EmptyState title="Chưa cập nhật cơ cấu tổ chức" /> : (
        <div className="space-y-12">
          {Object.entries(ORG_UNITS).map(([key, label]) => {
            const list = grouped[key];
            if (!list || list.length === 0) return null;
            return (
              <div key={key}>
                <h2 className="mb-5 font-display text-xl font-bold text-ink-800">{label}</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => <PersonCard key={p._id} p={p} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
