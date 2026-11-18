import React, { useState } from 'react';
import { Download, Share, PlusSquare, Smartphone, Monitor, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEngine } from '../utils/sound';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Hide when already running as a standalone installed PWA
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    soundEngine.playTap();
    if (isInstallable) {
      const outcome = await install();
      if (outcome !== 'accepted') {
        // User dismissed native dialog — no extra modal needed unless unavailable
      }
      return;
    }
    setShowGuide(true);
  };

  const handleCopyUrl = async () => {
    soundEngine.playTap();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // ignore clipboard restriction
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl bg-[#C8232C] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#A81C23] active:scale-[0.98] transition whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8232C]"
        title="Instalar aplicación en tu celular o PC"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Instalar App</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1610]/55 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#FFFDF8] border-2 border-[#E6CE9E] p-6 shadow-2xl text-[#3D241C]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="pwa-guide-title" className="font-display text-xl font-bold text-[#9A151D]">
                  Instalar en tu dispositivo
                </h2>
                <p className="mt-1 text-sm text-[#6E4D3E]">
                  Lleva a Chatin y Bella como una app nativa sin barra de navegador y con acceso sin conexión.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#6E4D3E] hover:bg-[#F5E7CC] transition cursor-pointer"
                aria-label="Cerrar guía de instalación"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {isIOS ? (
                <div className="rounded-xl bg-[#FDF4E1] border border-[#EAD4A8] p-4 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 font-bold text-[#9A151D]">
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>Safari en iPhone / iPad</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[#4E3226]">
                    <li>
                      Toca el botón <strong className="inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 inline" /> Compartir</strong> en la barra inferior o superior de Safari.
                    </li>
                    <li>
                      Desliza hacia abajo y selecciona <strong className="inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Añadir a pantalla de inicio</strong>.
                    </li>
                    <li>Confirma tocando <strong>Añadir</strong> arriba a la derecha.</li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-[#FDF4E1] border border-[#EAD4A8] p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 font-bold text-[#9A151D]">
                      <Smartphone className="w-4 h-4 shrink-0" />
                      <span>Celular Android (Chrome)</span>
                    </div>
                    <p className="text-[#4E3226]">
                      Toca los <strong>3 puntos ⋮</strong> arriba a la derecha en Chrome → <strong>«Instalar aplicación»</strong> (o <strong>«Añadir a la pantalla de inicio»</strong>).
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FDF4E1] border border-[#EAD4A8] p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 font-bold text-[#9A151D]">
                      <Monitor className="w-4 h-4 shrink-0" />
                      <span>Computadora (Chrome / Edge)</span>
                    </div>
                    <p className="text-[#4E3226]">
                      Haz clic en el ícono de <strong>Instalar</strong> en la barra de direcciones, o toca los <strong>3 puntos ⋮</strong> arriba a la derecha en Chrome → <strong>«Guardar y compartir» → «Instalar aplicación»</strong>.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl border border-[#DFC798] bg-white text-xs font-bold text-[#5A392C] hover:bg-[#FDF4E1] transition cursor-pointer"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-700" /> : null}
                <span>{copiedUrl ? '¡Enlace copiado!' : 'Copiar enlace de la App'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-h-[42px] px-5 py-2 rounded-xl bg-[#C8232C] text-white text-sm font-bold hover:bg-[#A81C23] transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
