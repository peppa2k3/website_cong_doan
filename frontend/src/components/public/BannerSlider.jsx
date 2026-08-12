import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerSlider({ banners }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % banners.length), [banners.length]);
  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return undefined;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-line shadow-card">
      <div className="aspect-[21/9] sm:aspect-[3/1]">
        {banners.map((b, i) => (
          <a
            key={b._id}
            href={b.linkUrl || '#'}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <img src={b.imageUrl} alt={b.title} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-4 sm:p-6">
              <p className="font-display text-base font-semibold text-white sm:text-xl">{b.title}</p>
            </div>
          </a>
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white" aria-label="Trước">
            <ChevronLeft className="h-4 w-4 text-ink-700" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white" aria-label="Sau">
            <ChevronRight className="h-4 w-4 text-ink-700" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} aria-label={`Banner ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
