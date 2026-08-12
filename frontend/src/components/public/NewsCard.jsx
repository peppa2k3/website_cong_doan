import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, CalendarDays } from 'lucide-react';
import { NEWS_CATEGORIES } from '../../utils/constants';
import { formatDate, truncate } from '../../utils/format';

export default function NewsCard({ item, size = 'default' }) {
  const isLarge = size === 'large';
  return (
    <Link to={`/tin-tuc/${item.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition-shadow hover:shadow-lift">
      <div className={`overflow-hidden bg-ink-100 ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">Công đoàn</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow">{NEWS_CATEGORIES[item.category]?.label}</span>
        <h3 className={`mt-1.5 font-display font-bold text-ink-800 group-hover:text-union-600 ${isLarge ? 'text-lg' : 'text-[15px]'}`}>
          {item.title}
        </h3>
        {item.summary && <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{truncate(item.summary, 120)}</p>}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-ink-400">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(item.publishedAt || item.createdAt)}</span>
          {item.views !== undefined && <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {item.views}</span>}
        </div>
      </div>
    </Link>
  );
}
