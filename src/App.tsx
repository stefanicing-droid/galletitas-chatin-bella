import React, { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Star,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { FestiveBackdrop } from './components/FestiveBackdrop';
import { ChibiCharacters, type ScenePhase } from './components/ChibiCharacters';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CustomDogsModal } from './components/CustomDogsModal';
import { FavoritesModal } from './components/FavoritesModal';
import {
  FORTUNE_CATEGORIES,
  generateLuckyNumbers,
  pickRandomFortune,
  type CategoryFilter,
  type DrawnFortune,
} from './data/fortunes';
import { soundEngine } from './utils/sound';
import type { ProcessedDogSprites } from './utils/canvasBackgroundRemoval';

const FAVORITES_STORAGE_KEY = 'chatin_bella_favorites_v1';

function loadStoredFavorites(): DrawnFortune[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [phase, setPhase] = useState<ScenePhase>('idle');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todas');
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [currentDraw, setCurrentDraw] = useState<DrawnFortune | null>(null);
  const [favorites, setFavorites] = useState<DrawnFortune[]>(loadStoredFavorites);
  const [muted, setMuted] = useState<boolean>(() => soundEngine.isMuted());
  const [copied, setCopied] = useState(false);

  const [customSprites, setCustomSprites] = useState<ProcessedDogSprites | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  const pullTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore storage quota errors
    }
  }, [favorites]);

  useEffect(() => {
    return () => {
      if (pullTimerRef.current !== null) {
        window.clearTimeout(pullTimerRef.current);
      }
    };
  }, []);

  const triggerOpenCookie = () => {
    if (phase === 'pulling') return;

    if (pullTimerRef.current !== null) {
      window.clearTimeout(pullTimerRef.current);
    }

    setCopied(false);
    setPhase('pulling');
    soundEngine.playTap();
    soundEngine.playPullTension();

    pullTimerRef.current = window.setTimeout(() => {
      const { fortune, nextRecentIds } = pickRandomFortune(selectedCategory, recentIds);
      const luckyNumbers = generateLuckyNumbers();

      setRecentIds(nextRecentIds);
      setCurrentDraw({
        fortune,
        luckyNumbers,
        drawnAt: new Date().toISOString(),
      });

      soundEngine.playCookieCrack();
      window.setTimeout(() => {
        soundEngine.playMagicChime();
      }, 140);

      setPhase('happy');
      pullTimerRef.current = null;
    }, 820);
  };

  const handleOpenAnother = () => {
    if (phase === 'pulling') return;
    triggerOpenCookie();
  };

  const handleResetToIdle = () => {
    if (phase === 'pulling') return;
    soundEngine.playTap();
    setPhase('idle');
    setCurrentDraw(null);
    setCopied(false);
  };

  const isCurrentFavorite = currentDraw
    ? favorites.some((f) => f.fortune.id === currentDraw.fortune.id)
    : false;

  const handleToggleFavorite = () => {
    if (!currentDraw) return;
    if (isCurrentFavorite) {
      soundEngine.playTap();
      setFavorites((prev) => prev.filter((f) => f.fortune.id !== currentDraw.fortune.id));
    } else {
      soundEngine.playFavoriteChime();
      setFavorites((prev) => [currentDraw, ...prev]);
    }
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.fortune.id !== id));
  };

  const handleCopyOrShare = async () => {
    if (!currentDraw) return;
    soundEngine.playTap();
    const nums = currentDraw.luckyNumbers.map((n) => String(n).padStart(2, '0')).join(' · ');
    const shareText = `🥠 "${currentDraw.fortune.text}"\nCategoría: ${currentDraw.fortune.category}\nNúmeros de la suerte: ${nums}\n— Las Galletitas de Chatin y Bella`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Las Galletitas de Chatin y Bella',
          text: shareText,
        });
        return;
      } catch {
        // User cancelled or share unsupported — fall through to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleToggleMute = () => {
    const next = !muted;
    soundEngine.setMuted(next);
    setMuted(next);
    if (!next) {
      soundEngine.playTap();
    }
  };

  const handleSelectCategory = (cat: CategoryFilter) => {
    soundEngine.playTap();
    setSelectedCategory(cat);
    if (phase === 'happy') {
      setPhase('idle');
      setCurrentDraw(null);
      setCopied(false);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden flex flex-col justify-between">
      <FestiveBackdrop />

      {/* Compact Single-Row Top Bar */}
      <header className="relative z-20 w-full px-3 sm:px-6 py-2.5 bg-[#FFFDF8]/78 backdrop-blur-md border-b border-[#E8D2A6]/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleResetToIdle}
            className="text-left font-display text-base sm:text-xl font-bold text-[#9A151D] tracking-tight truncate cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8232C] rounded-lg"
          >
            Las Galletitas de Chatin y Bella
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setShowCustomModal(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FDF4E1] border border-[#DFC48D] text-[#5A392C] text-xs sm:text-sm font-bold hover:bg-[#F7E6C4] active:scale-[0.98] transition whitespace-nowrap shrink-0 cursor-pointer"
              title="Subir tus propias ilustraciones de Chatin y Bella"
            >
              <ImageIcon className="w-4 h-4 text-[#C8232C] shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Mis Perritos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setShowFavoritesModal(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FDF4E1] border border-[#DFC48D] text-[#5A392C] text-xs sm:text-sm font-bold hover:bg-[#F7E6C4] active:scale-[0.98] transition whitespace-nowrap shrink-0 cursor-pointer"
              title="Ver frases favoritas guardadas"
            >
              <Star
                className={`w-4 h-4 shrink-0 ${
                  favorites.length > 0 ? 'text-[#D98E16] fill-[#F4C352]' : 'text-[#9A151D]'
                }`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Favoritas</span>
              <span className="font-mono-num text-xs text-[#9A151D]">({favorites.length})</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-xl bg-[#FDF4E1] border border-[#DFC48D] text-[#5A392C] hover:bg-[#F7E6C4] transition cursor-pointer"
              aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
              title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C8232C]" />}
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Single-Screen Main Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-3 sm:px-6 pt-2 sm:pt-3 pb-3 sm:pb-5 max-w-4xl w-full mx-auto min-h-0 overflow-y-auto no-scrollbar">
        {/* Category Filter Bar pinned neatly beneath header */}
        <nav
          aria-label="Categorías de frases"
          className="w-full max-w-xl flex items-center justify-start sm:justify-center gap-1 p-1 rounded-xl bg-[#F3E2C1]/85 border border-[#E2C896] overflow-x-auto no-scrollbar shrink-0"
        >
          {FORTUNE_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleSelectCategory(category)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  active
                    ? 'bg-[#C8232C] text-white shadow-xs'
                    : 'text-[#5A392C] hover:bg-[#FFF9ED]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>

        {/* Centered Stage with clean vertical clearance below category bar */}
        <div className="flex-1 w-full flex flex-col items-center justify-center mt-6 sm:mt-9 gap-2 sm:gap-3 min-h-0">
          {/* Animated Chatin & Bella + Interactive Fortune Cookie */}
          <div className="w-full flex items-center justify-center shrink-0">
            <ChibiCharacters
              phase={phase}
              onCookieClick={triggerOpenCookie}
              customSprites={customSprites}
            />
          </div>

          {/* Dynamic Bottom Interaction / Fortune Scroll Area */}
          <div className="w-full max-w-xl flex flex-col items-center justify-center shrink-0">
          {phase === 'idle' && (
            <div className="flex flex-col items-center text-center gap-3">
              <p className="text-xs sm:text-sm font-semibold text-[#6E4D3E] max-w-md">
                Toca la galleta dorada o pulsa el botón para que Chatin y Bella revelen tu mensaje de hoy.
              </p>
              <button
                type="button"
                onClick={triggerOpenCookie}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-2xl bg-[#C8232C] text-white font-display text-base sm:text-lg font-bold shadow-[0_4px_0_#8C141B] hover:bg-[#B21D25] active:translate-y-0.5 active:shadow-[0_2px_0_#8C141B] transition whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C8232C]"
              >
                <span>✨ Abrir Galleta ✨</span>
              </button>
            </div>
          )}

          {phase === 'pulling' && (
            <div className="py-4 text-center">
              <p className="font-display text-base sm:text-lg font-bold text-[#9A151D] animate-pulse">
                ¡Chatin y Bella están jalando con todas sus fuerzas...!
              </p>
            </div>
          )}

          {phase === 'happy' && currentDraw && (
            <div className="w-full flex flex-col items-center gap-3 anim-paper-unfurl">
              {/* Unfurled Fortune Parchment */}
              <section
                aria-label="Mensaje de la galleta"
                className="w-full rounded-2xl bg-[#FFFDF8] border-2 border-[#E2C68D] px-4 sm:px-6 py-3.5 sm:py-4 shadow-[0_10px_28px_rgba(92,54,28,0.12)] text-center space-y-2.5"
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#8A5F47]">
                  <span className="text-[#9A151D]">{currentDraw.fortune.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">Galleta #{String(currentDraw.fortune.id).padStart(3, '0')}</span>
                </div>

                <p className="text-sm sm:text-base md:text-lg font-extrabold text-[#3D241C] leading-snug text-balance">
                  «{currentDraw.fortune.text}»
                </p>

                <div className="pt-1 border-t border-[#F1E2C2] flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-bold text-[#7D5C4B]">Números de la suerte:</span>
                  <div className="flex items-center gap-1.5">
                    {currentDraw.luckyNumbers.map((num) => (
                      <span
                        key={num}
                        className="font-mono-num inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FDF2D6] border border-[#E5C277] text-xs font-bold text-[#9A151D]"
                      >
                        {String(num).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Comfortable Reveal Action Buttons */}
              <div className="w-full flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAnother}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 sm:px-5 py-2 rounded-xl bg-[#C8232C] text-white text-xs sm:text-sm font-bold shadow-[0_3px_0_#8C141B] hover:bg-[#B21D25] active:translate-y-0.5 transition whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Abrir otra Galleta</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    isCurrentFavorite
                      ? 'bg-[#FDF0CC] border-[#E0AD44] text-[#8F5312]'
                      : 'bg-white border-[#DFC48D] text-[#5A392C] hover:bg-[#FDF4E1]'
                  }`}
                >
                  <Star
                    className={`w-4 h-4 shrink-0 ${
                      isCurrentFavorite ? 'text-[#D98E16] fill-[#F4C352]' : 'text-[#C8232C]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{isCurrentFavorite ? 'Guardada en Favoritas' : 'Guardar en Favoritas'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyOrShare}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-white border border-[#DFC48D] text-[#5A392C] text-xs sm:text-sm font-bold hover:bg-[#FDF4E1] transition whitespace-nowrap cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                  ) : typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
                    <Share2 className="w-4 h-4 text-[#C8232C] shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#C8232C] shrink-0" aria-hidden="true" />
                  )}
                  <span>{copied ? '¡Copiado!' : 'Copiar / Compartir'}</span>
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Modals & Offline Banner */}
      <CustomDogsModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        activeSprites={customSprites}
        onApply={setCustomSprites}
      />

      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        onRemove={handleRemoveFavorite}
      />

      <OfflineIndicator />
    </div>
  );
}
