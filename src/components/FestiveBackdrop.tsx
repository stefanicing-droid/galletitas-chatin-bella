import React from 'react';

const PETALS = [
  { left: '8%', delay: '0s', duration: '11s', size: 12, alt: false },
  { left: '22%', delay: '2.6s', duration: '13s', size: 10, alt: true },
  { left: '38%', delay: '5.1s', duration: '10.5s', size: 13, alt: false },
  { left: '64%', delay: '1.4s', duration: '12.5s', size: 11, alt: true },
  { left: '79%', delay: '4.2s', duration: '11.8s', size: 13, alt: false },
  { left: '91%', delay: '6.8s', duration: '13.5s', size: 10, alt: true },
];

const LanternSVG: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size * 1.45}
    viewBox="0 0 80 116"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Hanging string */}
    <line x1="40" y1="0" x2="40" y2="18" stroke="#8C4B27" strokeWidth="2.5" />
    {/* Top gold cap */}
    <rect x="27" y="16" width="26" height="7" rx="3" fill="#E8AE38" stroke="#3D241C" strokeWidth="2.2" />
    {/* Lantern body */}
    <ellipse cx="40" cy="49" rx="28" ry="26" fill="#D32B33" stroke="#3D241C" strokeWidth="2.5" />
    {/* Ribs */}
    <ellipse cx="40" cy="49" rx="17" ry="25.5" stroke="#B01D24" strokeWidth="1.8" />
    <ellipse cx="40" cy="49" rx="7" ry="25.5" stroke="#B01D24" strokeWidth="1.5" />
    {/* Warm inner glow */}
    <ellipse cx="36" cy="44" rx="10" ry="12" fill="#F68B6B" opacity="0.28" />
    {/* Gold center medallion */}
    <circle cx="40" cy="49" r="9.5" fill="#F8CA5C" stroke="#3D241C" strokeWidth="1.8" />
    <path d="M40 43.5 L42 47.5 L46 49 L42 50.5 L40 54.5 L38 50.5 L34 49 L38 47.5 Z" fill="#C8232C" />
    {/* Bottom gold cap */}
    <rect x="29" y="73" width="22" height="6.5" rx="3" fill="#E8AE38" stroke="#3D241C" strokeWidth="2.2" />
    {/* Tassel */}
    <line x1="40" y1="79.5" x2="40" y2="106" stroke="#D32B33" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="35" y1="82" x2="33" y2="102" stroke="#E8AE38" strokeWidth="2" strokeLinecap="round" />
    <line x1="45" y1="82" x2="47" y2="102" stroke="#E8AE38" strokeWidth="2" strokeLinecap="round" />
    <circle cx="40" cy="83" r="3" fill="#F8CA5C" stroke="#3D241C" strokeWidth="1.5" />
  </svg>
);

export const FestiveBackdrop: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden select-none z-0" aria-hidden="true">
      {/* Warm cream rice-paper gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, #FFFDF7 0%, #FDF4E1 52%, #F6E2BE 100%)',
        }}
      />

      {/* Subtle golden festive halo behind center stage */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full opacity-55"
        style={{
          background:
            'radial-gradient(circle, rgba(247, 206, 118, 0.35) 0%, rgba(247, 206, 118, 0) 70%)',
        }}
      />

      {/* Hanging Chinese Lanterns */}
      <div className="absolute top-11 left-2 sm:left-6 md:left-12 anim-lantern-l opacity-95">
        <LanternSVG size={50} />
      </div>
      <div className="hidden md:block absolute top-11 left-32 anim-lantern-r opacity-85">
        <LanternSVG size={38} />
      </div>

      <div className="absolute top-11 right-2 sm:right-6 md:right-12 anim-lantern-r opacity-95">
        <LanternSVG size={50} />
      </div>
      <div className="hidden md:block absolute top-11 right-32 anim-lantern-l opacity-85">
        <LanternSVG size={38} />
      </div>

      {/* Drifting plum blossom petals */}
      {PETALS.map((p, idx) => (
        <div
          key={idx}
          className="absolute -top-6"
          style={{
            left: p.left,
            animation: `${p.alt ? 'petal-drift-left' : 'petal-drift'} ${p.duration} linear ${p.delay} infinite`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2 C14 2, 18 6, 17 11 C16 16, 11 18, 8 16 C4 14, 3 9, 6 5 C7.5 3, 8.8 2, 10 2 Z"
              fill={idx % 2 === 0 ? '#F4A6A3' : '#F8C3BD'}
              opacity="0.72"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
