import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ eyebrow, title, viewAllHref }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-1 font-display text-2xl font-bold text-ink-800 sm:text-[26px]">{title}</h2>
      </div>
      {viewAllHref && (
        <Link to={viewAllHref} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-union-600 hover:underline sm:flex">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
