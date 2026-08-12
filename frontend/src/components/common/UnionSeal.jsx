import React from 'react';

/**
 * UnionSeal - mô-típ hình ảnh chủ đạo của toàn hệ thống, lấy cảm hứng từ con dấu tròn
 * của các văn bản Công đoàn/cơ quan nhà nước: vành ngoài khắc chữ chuyển động nhẹ,
 * trung tâm là biểu tượng bánh răng lồng quyển sách (biểu trưng công - nông - trí).
 */
export default function UnionSeal({ size = 200, spin = true, className = '' }) {
  const id = React.useId();
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Biểu trưng Công đoàn"
    >
      <defs>
        <path id={`circle-${id}`} d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>

      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />

      <g className={spin ? 'origin-center animate-[spin_38s_linear_infinite]' : ''}>
        <text fontSize="11.2" fontWeight="700" letterSpacing="3.5" fill="currentColor" opacity="0.85">
          <textPath href={`#circle-${id}`} startOffset="0%">
            ĐOÀN KẾT • TRÁCH NHIỆM • SẺ CHIA • ĐỔI MỚI •
          </textPath>
        </text>
      </g>

      {/* Bánh răng cách điệu */}
      <g transform="translate(100,100)">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x="-3.2"
            y="-52"
            width="6.4"
            height="12"
            rx="1.2"
            fill="currentColor"
            opacity="0.9"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <circle r="40" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
        {/* Quyển sách cách điệu ở tâm */}
        <path
          d="M -20,-6 C -12,-11 -4,-11 0,-7 C 4,-11 12,-11 20,-6 L 20,10 C 12,5 4,5 0,9 C -4,5 -12,5 -20,10 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <line x1="0" y1="-7" x2="0" y2="9" stroke="var(--seal-bg, #B4232C)" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
