import React, { useEffect, useState } from 'react';
import { Upload, RotateCcw, X, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import {
  processCombinedSheet,
  processSingleDogImage,
  type ProcessedDogSprites,
} from '../utils/canvasBackgroundRemoval';
import { soundEngine } from '../utils/sound';

interface CustomDogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSprites: ProcessedDogSprites | null;
  onApply: (sprites: ProcessedDogSprites | null) => void;
}

type UploadMode = 'separate' | 'combined';
type SplitDirection = 'left-right' | 'top-bottom';

export const CustomDogsModal: React.FC<CustomDogsModalProps> = ({
  isOpen,
  onClose,
  activeSprites,
  onApply,
}) => {
  const [mode, setMode] = useState<UploadMode>('separate');
  const [splitDir, setSplitDir] = useState<SplitDirection>('left-right');
  const [tolerance, setTolerance] = useState<number>(28);

  const [chatinFile, setChatinFile] = useState<File | null>(null);
  const [bellaFile, setBellaFile] = useState<File | null>(null);
  const [combinedFile, setCombinedFile] = useState<File | null>(null);

  const [previewChatin, setPreviewChatin] = useState<string | null>(activeSprites?.chatinUrl ?? null);
  const [previewBella, setPreviewBella] = useState<string | null>(activeSprites?.bellaUrl ?? null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPreviewChatin(activeSprites?.chatinUrl ?? null);
    setPreviewBella(activeSprites?.bellaUrl ?? null);
    setErrorMsg(null);
  }, [isOpen, activeSprites]);

  // Re-run flood-fill live when files, split mode, or tolerance change
  useEffect(() => {
    let cancelled = false;

    const runProcessing = async () => {
      if (mode === 'combined' && combinedFile) {
        setProcessing(true);
        setErrorMsg(null);
        try {
          const result = await processCombinedSheet(combinedFile, splitDir, tolerance);
          if (!cancelled) {
            setPreviewChatin(result.chatinUrl);
            setPreviewBella(result.bellaUrl);
          }
        } catch {
          if (!cancelled) setErrorMsg('No pudimos procesar esa imagen. Prueba con otro archivo PNG o JPG.');
        } finally {
          if (!cancelled) setProcessing(false);
        }
        return;
      }

      if (mode === 'separate' && (chatinFile || bellaFile)) {
        setProcessing(true);
        setErrorMsg(null);
        try {
          const [cUrl, bUrl] = await Promise.all([
            chatinFile ? processSingleDogImage(chatinFile, tolerance) : Promise.resolve(previewChatin),
            bellaFile ? processSingleDogImage(bellaFile, tolerance) : Promise.resolve(previewBella),
          ]);
          if (!cancelled) {
            if (cUrl) setPreviewChatin(cUrl);
            if (bUrl) setPreviewBella(bUrl);
          }
        } catch {
          if (!cancelled) setErrorMsg('Error al limpiar el fondo de la imagen.');
        } finally {
          if (!cancelled) setProcessing(false);
        }
      }
    };

    runProcessing();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, splitDir, tolerance, chatinFile, bellaFile, combinedFile]);

  if (!isOpen) return null;

  const canApply = Boolean(previewChatin && previewBella) && !processing;

  const handleApply = () => {
    if (!previewChatin || !previewBella) return;
    soundEngine.playFavoriteChime();
    onApply({ chatinUrl: previewChatin, bellaUrl: previewBella });
    onClose();
  };

  const handleReset = () => {
    soundEngine.playTap();
    setChatinFile(null);
    setBellaFile(null);
    setCombinedFile(null);
    setPreviewChatin(null);
    setPreviewBella(null);
    onApply(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1610]/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-dogs-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl bg-[#FFFDF8] border-2 border-[#E6CE9E] p-5 sm:p-6 shadow-2xl text-[#3D241C]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="custom-dogs-title" className="font-display text-xl font-bold text-[#9A151D]">
              Personalizar a Chatin y Bella
            </h2>
            <p className="mt-1 text-sm text-[#6E4D3E]">
              Sube tus propias ilustraciones. Quitamos el fondo blanco o cuadriculado automáticamente con Canvas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#6E4D3E] hover:bg-[#F5E7CC] transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Segmented Control */}
        <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F3E4C6]">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setMode('separate');
            }}
            className={`min-h-[40px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              mode === 'separate'
                ? 'bg-white text-[#9A151D] shadow-xs'
                : 'text-[#6E4D3E] hover:text-[#3D241C]'
            }`}
          >
            Dos imágenes separadas
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setMode('combined');
            }}
            className={`min-h-[40px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              mode === 'combined'
                ? 'bg-white text-[#9A151D] shadow-xs'
                : 'text-[#6E4D3E] hover:text-[#3D241C]'
            }`}
          >
            Una imagen dividida
          </button>
        </div>

        {/* Upload Inputs */}
        {mode === 'separate' ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D9BA82] bg-[#FDF7EB] p-4 text-center hover:border-[#C8232C] transition cursor-pointer min-h-[104px]">
              <Upload className="w-5 h-5 text-[#C8232C]" aria-hidden="true" />
              <span className="text-sm font-bold text-[#3D241C]">
                {chatinFile ? chatinFile.name : 'Subir a Chatin (Izquierda)'}
              </span>
              <span className="text-xs text-[#7D5C4B]">PNG, JPG o WEBP</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setChatinFile(f);
                }}
              />
            </label>

            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D9BA82] bg-[#FDF7EB] p-4 text-center hover:border-[#C8232C] transition cursor-pointer min-h-[104px]">
              <Upload className="w-5 h-5 text-[#C8232C]" aria-hidden="true" />
              <span className="text-sm font-bold text-[#3D241C]">
                {bellaFile ? bellaFile.name : 'Subir a Bella (Derecha)'}
              </span>
              <span className="text-xs text-[#7D5C4B]">PNG, JPG o WEBP</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setBellaFile(f);
                }}
              />
            </label>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#6E4D3E]">Cómo dividir la imagen:</span>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F3E4C6]">
                <button
                  type="button"
                  onClick={() => setSplitDir('left-right')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    splitDir === 'left-right' ? 'bg-white text-[#9A151D]' : 'text-[#6E4D3E]'
                  }`}
                >
                  Izq / Der
                </button>
                <button
                  type="button"
                  onClick={() => setSplitDir('top-bottom')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    splitDir === 'top-bottom' ? 'bg-white text-[#9A151D]' : 'text-[#6E4D3E]'
                  }`}
                >
                  Arriba / Abajo
                </button>
              </div>
            </div>

            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D9BA82] bg-[#FDF7EB] p-4 text-center hover:border-[#C8232C] transition cursor-pointer min-h-[104px]">
              <Upload className="w-5 h-5 text-[#C8232C]" aria-hidden="true" />
              <span className="text-sm font-bold text-[#3D241C]">
                {combinedFile ? combinedFile.name : 'Subir lámina con ambos perritos'}
              </span>
              <span className="text-xs text-[#7D5C4B]">Se dividirá y limpiará el fondo automáticamente</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setCombinedFile(f);
                }}
              />
            </label>
          </div>
        )}

        {/* Tolerance Control */}
        <div className="mt-4 rounded-xl bg-[#FDF4E1] border border-[#EAD4A8] p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#5A392C]">
            <span className="inline-flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              Sensibilidad de limpieza de fondo
            </span>
            <span className="font-mono-num">{tolerance}</span>
          </div>
          <input
            type="range"
            min={10}
            max={56}
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="mt-2 w-full accent-[#C8232C] cursor-pointer"
            aria-label="Sensibilidad de limpieza de fondo"
          />
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs font-bold text-[#C8232C]" role="alert">
            {errorMsg}
          </p>
        )}

        {/* Live Transparent Preview */}
        {(previewChatin || previewBella) && (
          <div className="mt-4">
            <div className="text-xs font-bold text-[#6E4D3E] mb-2">
              Vista previa sin fondo {processing ? '(procesando...)' : ''}
            </div>
            <div
              className="grid grid-cols-2 gap-3 rounded-xl border border-[#DFC798] p-3"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #f3e9d6 25%, transparent 25%), linear-gradient(-45deg, #f3e9d6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3e9d6 75%), linear-gradient(-45deg, transparent 75%, #f3e9d6 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                backgroundColor: '#fffdf8',
              }}
            >
              <div className="flex flex-col items-center justify-center min-h-[110px]">
                {previewChatin ? (
                  <img src={previewChatin} alt="Vista previa de Chatin" className="max-h-28 w-auto object-contain" />
                ) : (
                  <span className="text-xs text-[#8D6C5A]">Falta Chatin</span>
                )}
              </div>
              <div className="flex flex-col items-center justify-center min-h-[110px]">
                {previewBella ? (
                  <img src={previewBella} alt="Vista previa de Bella" className="max-h-28 w-auto object-contain" />
                ) : (
                  <span className="text-xs text-[#8D6C5A]">Falta Bella</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DFC798] bg-white text-xs sm:text-sm font-bold text-[#5A392C] hover:bg-[#FDF4E1] transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Usar Chibi Originales</span>
          </button>

          <button
            type="button"
            disabled={!canApply}
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2 rounded-xl bg-[#C8232C] text-white text-sm font-bold hover:bg-[#A81C23] disabled:opacity-45 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {canApply ? <Check className="w-4 h-4" aria-hidden="true" /> : <Sparkles className="w-4 h-4" aria-hidden="true" />}
            <span>Aplicar Perritos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
