import React from 'react';
import { Link } from 'react-router-dom';
import UnionSeal from '../components/common/UnionSeal';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <UnionSeal size={80} spin={false} className="text-ink-200" />
      <h1 className="font-display text-3xl font-extrabold text-ink-800">404 — Không tìm thấy trang</h1>
      <p className="max-w-md text-ink-500">Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <Link to="/" className="btn-primary">Về trang chủ</Link>
    </div>
  );
}
