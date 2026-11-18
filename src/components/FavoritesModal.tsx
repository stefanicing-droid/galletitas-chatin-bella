import React, { useState } from 'react';
import { Star, Trash2, Copy, Check, X } from 'lucide-react';
import type { DrawnFortune } from '../data/fortunes';
import { soundEngine } from '../utils/sound';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: DrawnFortune[];
  onRemove: (id: number) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemove,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (item: DrawnFortune) => {
    soundEngine.playTap();
    const nums = item.luckyNumbers.map((n) => String(n).padStart(2, '0')).join(' · ');
    const text = `🥠 "${item.fortune.text}"\nCategoría: ${item.fortune.category}\nNúmeros de la suerte: ${nums}\n— Las Galletitas de Chatin y Bella`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.fortune.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore clipboard restriction
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1610]/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85dvh] flex flex-col rounded-2xl bg-[#FFFDF8] border-2 border-[#E6CE9E] shadow-2xl text-[#3D241C]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#EFE0BF]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#D98E16] fill-[#F4C352]" aria-hidden="true" />
            <h2 id="favorites-modal-title" className="font-display text-xl font-bold text-[#9A151D]">
              Mis Frases Favoritas
            </h2>
            <span className="font-mono-num text-xs font-bold text-[#7D5C4B]">
              ({favorites.length})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#6E4D3E] hover:bg-[#F5E7CC] transition cursor-pointer"
            aria-label="Cerrar favoritas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {favorites.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="font-display text-lg font-semibold text-[#5A392C]">
                Aún no tienes frases guardadas
              </p>
              <p className="text-sm text-[#7D5C4B] max-w-xs mx-auto">
                Abre una galleta con Chatin y Bella y toca «Guardar en Favoritas» para coleccionar las que más te gusten.
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <article
                key={item.fortune.id}
                className="rounded-xl bg-[#FDF7EB] border border-[#E8D2A6] p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#7D5C4B]">
                  <span className="font-bold text-[#9A151D]">
                    {item.fortune.category} · #{String(item.fortune.id).padStart(3, '0')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#6E4D3E] hover:bg-[#EFE0BF] transition cursor-pointer"
                      aria-label="Copiar frase"
                      title="Copiar frase"
                    >
                      {copiedId === item.fortune.id ? (
                        <Check className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        onRemove(item.fortune.id);
                      }}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#9A151D] hover:bg-[#F9DADA] transition cursor-pointer"
                      aria-label="Quitar de favoritas"
                      title="Quitar de favoritas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-bold text-[#3D241C] leading-relaxed">
                  «{item.fortune.text}»
                </p>

                <div className="flex items-center gap-2 text-xs text-[#6E4D3E]">
                  <span className="font-semibold">Suerte:</span>
                  <span className="font-mono-num font-bold tracking-wide text-[#9A151D]">
                    {item.luckyNumbers.map((n) => String(n).padStart(2, '0')).join(' · ')}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
