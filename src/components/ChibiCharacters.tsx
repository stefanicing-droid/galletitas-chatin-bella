import React, { useEffect, useState } from 'react';
import {
  processSceneIllustration,
  type ProcessedDogSprites,
} from '../utils/canvasBackgroundRemoval';

export type ScenePhase = 'idle' | 'pulling' | 'happy';

interface ChibiCharactersProps {
  phase: ScenePhase;
  onCookieClick: () => void;
  customSprites?: ProcessedDogSprites | null;
}

const CLOSED_SCENE_RAW = '/src/assets/images/chatin_bella_closed_1794964676453.jpg';
const OPEN_SCENE_RAW = '/src/assets/images/chatin_bella_open_1794964649472.jpg';

const CRUMB_PARTICLES = [
  { tx: '-68px', ty: '-58px', rot: '-125deg', size: 9 },
  { tx: '72px', ty: '-60px', rot: '145deg', size: 10 },
  { tx: '-40px', ty: '-78px', rot: '-85deg', size: 7 },
  { tx: '42px', ty: '-76px', rot: '95deg', size: 8 },
  { tx: '-56px', ty: '48px', rot: '-160deg', size: 8 },
  { tx: '58px', ty: '46px', rot: '150deg', size: 9 },
  { tx: '0px', ty: '-88px', rot: '45deg', size: 7 },
  { tx: '-88px', ty: '-12px', rot: '-65deg', size: 7 },
  { tx: '88px', ty: '-14px', rot: '75deg', size: 7 },
  { tx: '0px', ty: '60px', rot: '-45deg', size: 7 },
];

const SparkleStar: React.FC<{ className?: string; size?: number; delay?: string }> = ({
  className = '',
  size = 20,
  delay = '0s',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={`pointer-events-none anim-sparkle ${className}`}
    style={{ animationDelay: delay }}
  >
    <path
      d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z"
      fill="#FCE28B"
      stroke="#3D241C"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChibiCharacters: React.FC<ChibiCharactersProps> = ({
  phase,
  onCookieClick,
  customSprites,
}) => {
  const [closedSceneUrl, setClosedSceneUrl] = useState<string | null>(null);
  const [openSceneUrl, setOpenSceneUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      processSceneIllustration(CLOSED_SCENE_RAW, { tolerance: 30, clearTopCounters: false }),
      processSceneIllustration(OPEN_SCENE_RAW, { tolerance: 30, clearTopCounters: true }),
    ])
      .then(([closedClean, openClean]) => {
        if (!cancelled) {
          setClosedSceneUrl(closedClean);
          setOpenSceneUrl(openClean);
        }
      })
      .catch(() => {
        // Fallback if canvas processing ever fails
        if (!cancelled) {
          setClosedSceneUrl(CLOSED_SCENE_RAW);
          setOpenSceneUrl(OPEN_SCENE_RAW);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isPulling = phase === 'pulling';
  const isHappy = phase === 'happy';

  // Custom uploaded sprites mode ("🖼️ Mis Perritos")
  if (customSprites) {
    const leftWrapperClass = isPulling
      ? 'anim-pull-l'
      : isHappy
        ? 'anim-happy'
        : 'anim-breathe';

    const rightWrapperClass = isPulling
      ? 'anim-pull-r'
      : isHappy
        ? 'anim-happy'
        : 'anim-breathe';

    return (
      <div className="relative flex items-center justify-center w-full max-w-[540px] h-[225px] sm:h-[265px] mx-auto select-none">
        {isHappy && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none anim-crack-pop flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" className="text-[#3D241C]" aria-hidden="true">
              <path d="M26 24 L10 14 M24 14 L6 8 M26 6 L16 2" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-[#3D241C] drop-shadow-[0_2px_0_#FCE294]">
              ¡CRACK!
            </span>
            <svg width="28" height="28" viewBox="0 0 32 32" className="text-[#3D241C]" aria-hidden="true">
              <path d="M6 24 L22 14 M8 14 L26 8 M6 6 L16 2" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        <div
          className={`relative z-10 w-[38%] max-w-[195px] flex items-end justify-end -mr-3 sm:-mr-4 ${leftWrapperClass}`}
        >
          <img
            src={customSprites.chatinUrl}
            alt="Chatin personalizado"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[195px] sm:max-h-[225px] object-contain drop-shadow-[0_8px_14px_rgba(61,36,28,0.16)]"
          />
        </div>

        <button
          type="button"
          onClick={onCookieClick}
          disabled={isPulling}
          aria-label={isHappy ? 'Galleta de la fortuna abierta' : 'Abrir galleta de la fortuna'}
          className={`relative z-20 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8232C] rounded-full transition-transform ${
            phase === 'idle'
              ? 'cursor-pointer hover:scale-105 active:scale-95 anim-cookie-idle'
              : isPulling
                ? 'cursor-wait anim-cookie-tremble'
                : 'cursor-pointer hover:scale-105'
          }`}
        >
          <svg width="136" height="120" viewBox="0 0 160 140" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="customCookieGrad" x1="20%" y1="15%" x2="80%" y2="85%">
                <stop offset="0%" stopColor="#FCE49B" />
                <stop offset="55%" stopColor="#F0B342" />
                <stop offset="100%" stopColor="#D3841D" />
              </linearGradient>
            </defs>
            {!isHappy ? (
              <g>
                <path
                  d="M22 72 C18 32, 52 14, 80 46 C108 14, 142 32, 138 72 C135 106, 108 122, 80 119 C52 122, 25 106, 22 72 Z"
                  fill="url(#customCookieGrad)"
                  stroke="#3D241C"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                <path
                  d="M60 44 C72 60, 88 60, 100 44"
                  stroke="#3D241C"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <ellipse cx="42" cy="48" rx="7" ry="12" transform="rotate(-28 42 48)" fill="#FFF7DA" opacity="0.65" />
                {isPulling && (
                  <path
                    d="M80 46 L74 64 L85 78 L76 96 L82 117"
                    stroke="#FFF6C4"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            ) : (
              <g>
                <path
                  d="M52 54 Q80 48 108 54 L106 80 Q80 74 54 80 Z"
                  fill="#FFFDF8"
                  stroke="#3D241C"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 68 C12 34, 42 20, 60 48 C54 70, 56 96, 64 114 C36 116, 16 100, 14 68 Z"
                  fill="url(#customCookieGrad)"
                  stroke="#3D241C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M146 68 C148 34, 118 20, 100 48 C106 70, 104 96, 96 114 C124 116, 144 100, 146 68 Z"
                  fill="url(#customCookieGrad)"
                  stroke="#3D241C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </svg>

          {isHappy &&
            CRUMB_PARTICLES.map((c, idx) => (
              <span
                key={idx}
                className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-[#F3B947] border border-[#3D241C]"
                style={
                  {
                    width: c.size,
                    height: c.size,
                    '--tx': c.tx,
                    '--ty': c.ty,
                    '--rot': c.rot,
                    animation: 'crumb-fly 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  } as React.CSSProperties
                }
              />
            ))}
        </button>

        <div
          className={`relative z-10 w-[38%] max-w-[195px] flex items-end justify-start -ml-3 sm:-ml-4 ${rightWrapperClass}`}
        >
          <img
            src={customSprites.bellaUrl}
            alt="Bella personalizada"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[195px] sm:max-h-[225px] object-contain drop-shadow-[0_8px_14px_rgba(61,36,28,0.16)]"
          />
        </div>
      </div>
    );
  }

  // Primary Illustrated Chatin & Bella Stage (2 Canvas-cleaned high-fidelity states + 3 animated states)
  const activeSrc = isHappy ? openSceneUrl : closedSceneUrl;
  const stageAnimClass = isPulling
    ? 'anim-scene-pull'
    : isHappy
      ? 'anim-happy-pop'
      : 'anim-breathe';

  return (
    <div className="relative flex items-center justify-center w-full max-w-[540px] mx-auto select-none">
      {/* Ambient twinkling sparkles around the cookie in idle & happy states */}
      {!isPulling && (
        <>
          <SparkleStar className="absolute left-[36%] top-[16%] z-20" size={18} delay="0s" />
          <SparkleStar className="absolute right-[35%] top-[14%] z-20" size={15} delay="0.55s" />
          <SparkleStar className="absolute left-[48%] top-[6%] z-20" size={14} delay="1.05s" />
        </>
      )}

      {/* Interactive Stage Button wrapping the seamless Canvas-cleaned illustration */}
      <button
        type="button"
        onClick={!isPulling ? onCookieClick : undefined}
        disabled={isPulling}
        aria-label={
          isHappy
            ? 'Galleta abierta por Chatin y Bella, pulsa para abrir otra'
            : 'Chatin y Bella sosteniendo una galleta de la fortuna, pulsa para abrir'
        }
        className={`relative group flex items-center justify-center w-full max-w-[460px] sm:max-w-[500px] min-h-[210px] sm:min-h-[255px] rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8232C] transition-transform ${
          phase === 'idle'
            ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
            : isPulling
              ? 'cursor-wait'
              : 'cursor-pointer hover:scale-[1.015]'
        }`}
      >
        {/* Soft warm floor shadow under the two puppies */}
        <div
          className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[78%] h-5 rounded-full opacity-45 blur-xs"
          style={{
            background: 'radial-gradient(ellipse at center, #C8A26F 0%, rgba(200,162,111,0) 72%)',
          }}
        />

        {/* Canvas-processed transparent illustration */}
        <div className={`relative z-10 w-full flex items-center justify-center ${stageAnimClass}`}>
          {activeSrc ? (
            <img
              src={activeSrc}
              alt={
                isHappy
                  ? 'Chatin y Bella celebrando con la galleta de la fortuna partida y el mensaje'
                  : 'Chatin y Bella sosteniendo juntos una gran galleta de la fortuna dorada'
              }
              referrerPolicy="no-referrer"
              draggable={false}
              className="w-full h-auto max-h-[225px] sm:max-h-[265px] object-contain drop-shadow-[0_10px_18px_rgba(61,36,28,0.16)]"
            />
          ) : (
            <div className="w-full h-[220px] sm:h-[255px] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#F4C352] border-t-[#C8232C] animate-spin" />
            </div>
          )}
        </div>

        {/* Dynamic Pulling Crack Energy Flash Overlay */}
        {isPulling && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
              <path
                d="M48 18 L41 39 L55 51 L43 68 L50 82"
                stroke="#FFF7C8"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M48 18 L41 39 L55 51 L43 68 L50 82"
                stroke="#C8232C"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M24 38 L36 44 M72 38 L60 44 M22 58 L35 55 M74 58 L61 55" stroke="#FCE28B" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Flying golden crumbs burst when transitioning to Happy */}
        {isHappy && (
          <div className="pointer-events-none absolute left-1/2 top-[48%] z-30">
            {CRUMB_PARTICLES.map((c, idx) => (
              <span
                key={idx}
                className="absolute rounded-full bg-[#F3B947] border border-[#3D241C]"
                style={
                  {
                    width: c.size,
                    height: c.size,
                    '--tx': c.tx,
                    '--ty': c.ty,
                    '--rot': c.rot,
                    animation: 'crumb-fly 0.78s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </button>
    </div>
  );
};
