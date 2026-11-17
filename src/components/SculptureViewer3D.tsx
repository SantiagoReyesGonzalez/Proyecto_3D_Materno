import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { FINISH_PRESETS, ResinFinishId } from '../data/finishes';
import { PRODUCT_TIERS, formatCOP } from '../data/products';
import type { CameraPresetId } from './SculptureStage3D';

const SculptureStage3D = lazy(() => import('./SculptureStage3D'));

const EDITION_TABS: { id: 1 | 2 | 3; shortLabel: string; priceTag: string }[] = [
  { id: 1, shortLabel: 'I. Esencia', priceTag: '$249k' },
  { id: 2, shortLabel: 'II. Luz de Vida', priceTag: '$369k' },
  { id: 3, shortLabel: 'III. Total', priceTag: '$690k' },
];

const CAMERA_VIEWS: { id: CameraPresetId; label: string }[] = [
  { id: 'full', label: '01 · Completa' },
  { id: 'womb', label: '02 · Zoom Bebé' },
  { id: 'plaque', label: '03 · Placa' },
];

const StagePlaceholder: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className={`px-5 py-2.5 border text-center shadow-sm whitespace-nowrap rounded-full ${
        dark ? 'glass-dock-dark' : 'bg-[#FAF7F2]/95 border-[#E5DEC9]'
      }`}
    >
      <p
        className={`font-serif italic text-sm ${
          dark ? 'text-[#D4B07B]' : 'text-[#8C6D46]'
        }`}
      >
        Preparando estudio 3D...
      </p>
    </div>
  </div>
);

export const SculptureViewer3D: React.FC = () => {
  const {
    selectedTier,
    setTier,
    activeFinish: finishId,
    setFinish: setFinishId,
    customerData,
    updateCustomerData,
    getEffectivePrice,
    openOrderModal,
  } = useProductStore();

  const [sanctuaryDark, setSanctuaryDark] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('full');
  const [cameraMoveNonce, setCameraMoveNonce] = useState(0);
  const [ultrasoundMode, setUltrasoundMode] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldMount3D, setShouldMount3D] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0.5);
  const invalidateRef = useRef<(() => void) | null>(null);

  const warmLightOn = selectedTier !== 1;
  const activeTierObj = PRODUCT_TIERS.find((t) => t.id === selectedTier) || PRODUCT_TIERS[1];
  const effectivePrice = getEffectivePrice();
  const halfBookingPrice = Math.round(effectivePrice / 2);

  const selectCameraPreset = (preset: CameraPresetId) => {
    setCameraPreset(preset);
    setCameraMoveNonce((n) => n + 1);
  };

  const handleToggleUltrasoundMode = () => {
    setUltrasoundMode((prev) => {
      const next = !prev;
      selectCameraPreset(next ? 'womb' : 'full');
      return next;
    });
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || shouldMount3D) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: '750px 0px' }
    );
    observer.observe(el);

    const idleWin = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | undefined;
    let timerId: number | undefined;

    if (idleWin.requestIdleCallback) {
      idleId = idleWin.requestIdleCallback(() => setShouldMount3D(true), { timeout: 1800 });
    } else {
      timerId = window.setTimeout(() => setShouldMount3D(true), 1400);
    }

    return () => {
      observer.disconnect();
      if (idleId !== undefined && idleWin.cancelIdleCallback) {
        idleWin.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [shouldMount3D]);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const el = sectionRef.current;
      if (!el) {
        ticking = false;
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.bottom > 0 && rect.top < vh) {
        const start = vh * 0.85;
        const end = -vh * 0.35;
        const raw = (start - rect.top) / (start - end);
        const clamped = Math.max(0, Math.min(1, raw));
        if (Math.abs(clamped - progressRef.current) > 0.003) {
          progressRef.current = clamped;
          invalidateRef.current?.();
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const renderCameraToolbar = () => (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-md mx-auto">
      <div
        role="group"
        aria-label="Ángulos de cámara del estudio 3D"
        className={`inline-flex flex-wrap justify-center items-center gap-1 p-1 shadow-md ${
          sanctuaryDark
            ? 'glass-dock-dark'
            : 'bg-[#FAF7F2]/92 border border-[#E5DEC9] backdrop-blur-md'
        }`}
      >
        {CAMERA_VIEWS.map((view) => {
          const active = cameraPreset === view.id;
          return (
            <button
              key={view.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectCameraPreset(view.id)}
              className={`px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] transition-colors whitespace-nowrap ${
                active
                  ? sanctuaryDark
                    ? 'bg-[#D4B07B] text-[#120E0C] font-medium'
                    : 'bg-[#2C2825] text-[#FAF7F2] font-medium'
                  : sanctuaryDark
                    ? 'text-[#EAE2D6] hover:text-[#FAF7F2]'
                    : 'text-[#6E665E] hover:text-[#2C2825]'
              }`}
            >
              {view.label}
            </button>
          );
        })}
      </div>

      {/* Star Toggle: 3D Ultrasound Scan <-> Carved Sculpture */}
      <button
        type="button"
        aria-pressed={ultrasoundMode}
        onClick={handleToggleUltrasoundMode}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.14em] transition-all shadow-md whitespace-nowrap border ${
          ultrasoundMode
            ? 'bg-[#D4B07B] text-[#120E0C] border-[#F5E6CE] font-semibold'
            : sanctuaryDark
              ? 'glass-dock-dark text-[#F5E6CE] hover:border-[#D4B07B]'
              : 'bg-[#FAF7F2]/95 border-[#8C6D46] text-[#2C2825] hover:bg-[#F2ECE1]'
        }`}
      >
        <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>
          {ultrasoundMode
            ? '✓ Viendo Ecografía 3D · Volver a Escultura'
            : 'Ver transformación: Ecografía 3D ↔ Escultura'}
        </span>
      </button>
    </div>
  );

  const renderSwatchesRow = (compact = false) => (
    <div
      className={`inline-flex items-center ${compact ? 'gap-2 px-3 py-1.5' : 'gap-3 px-4 py-2.5'} rounded-full border transition-colors duration-300 shadow-sm ${
        sanctuaryDark
          ? 'bg-[#1D1814]/95 border-[#D4B07B]/28'
          : 'bg-[#FAF7F2]/95 border-[#E5DEC9]'
      }`}
    >
      {(Object.keys(FINISH_PRESETS) as ResinFinishId[]).map((key) => {
        const preset = FINISH_PRESETS[key];
        const active = finishId === key;
        return (
          <button
            key={key}
            type="button"
            aria-label={preset.hint}
            title={preset.hint}
            onClick={() => setFinishId(key)}
            className={`relative ${compact ? 'w-5 h-5' : 'w-6 h-6'} rounded-full transition-transform duration-300 flex items-center justify-center ${
              active ? 'scale-110' : 'opacity-75 hover:opacity-100 hover:scale-105'
            }`}
          >
            <span
              className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} rounded-full block shadow-inner`}
              style={{
                background: preset.swatchGradient,
                border: `1px solid ${preset.swatchBorder}`,
              }}
            />
            {active && (
              <span
                className={`absolute -inset-1 rounded-full border transition-colors ${
                  sanctuaryDark ? 'border-[#D4B07B]' : 'border-[#8C6D46]'
                }`}
              />
            )}
          </button>
        );
      })}

      <span
        className={`h-3.5 w-[1px] mx-0.5 ${
          sanctuaryDark ? 'bg-[#3D352E]' : 'bg-[#E5DEC9]'
        }`}
      />

      <button
        type="button"
        onClick={() => setSanctuaryDark((v) => !v)}
        title={sanctuaryDark ? 'Cambiar a luz de día' : 'Ver en Santuario Nocturno 2700K'}
        aria-label={sanctuaryDark ? 'Cambiar a luz de día' : 'Ver en Santuario Nocturno 2700K'}
        className={`inline-flex items-center gap-1.5 pr-1 py-0.5 rounded-full text-[11px] font-serif italic transition-colors whitespace-nowrap ${
          sanctuaryDark
            ? 'text-[#FFB866]'
            : 'text-[#6E665E] hover:text-[#2C2825]'
        }`}
      >
        <span
          className={`w-3 h-3 rounded-full transition-all flex items-center justify-center ${
            sanctuaryDark
              ? 'bg-[#FFB866] shadow-[0_0_10px_#FFA84C]'
              : 'bg-[#2C2825]'
          }`}
        />
        <span>{sanctuaryDark ? 'Noche' : 'Día'}</span>
      </button>
    </div>
  );

  const renderEditionSelector = (compact = false) => (
    <div className={`grid grid-cols-3 ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {EDITION_TABS.map((tab) => {
        const active = selectedTier === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            onClick={() => setTier(tab.id)}
            className={`${compact ? 'p-2' : 'p-2.5 sm:p-3'} text-left border transition-colors ${
              active
                ? sanctuaryDark
                  ? 'bg-[#2B241E] border-[#D4B07B] text-[#FAF7F2]'
                  : 'bg-[#F2ECE1] border-[#8C6D46] text-[#2C2825]'
                : sanctuaryDark
                  ? 'bg-[#1D1814]/80 border-[#352E28] text-[#EAE2D6] hover:border-[#8C6D46]'
                  : 'bg-[#FAF7F2] border-[#E5DEC9] text-[#2C2825] hover:border-[#8C6D46]'
            }`}
          >
            <span
              className={`font-serif ${compact ? 'text-xs' : 'text-sm sm:text-base'} block leading-tight truncate ${
                active
                  ? sanctuaryDark
                    ? 'text-[#FAF7F2]'
                    : 'text-[#2C2825]'
                  : sanctuaryDark
                    ? 'text-[#EAE2D6]'
                    : 'text-[#6E665E]'
              }`}
            >
              {tab.shortLabel}
            </span>
            <span
              className={`text-[10px] block mt-0.5 ${
                active
                  ? sanctuaryDark
                    ? 'text-[#D4B07B]'
                    : 'text-[#755936]'
                  : sanctuaryDark
                    ? 'text-[#B5AAA0]'
                    : 'text-[#6E665E]'
              }`}
            >
              {tab.priceTag}
            </span>
          </button>
        );
      })}
    </div>
  );

  const renderDesktopConfigurator = () => {
    const plaqueInputId = 'studio-plaque-input-desktop';
    return (
      <div className="w-full space-y-5">
        <div className="space-y-2 text-left">
          <span
            className={`block text-[10px] uppercase tracking-[0.2em] font-medium ${
              sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#755936]'
            }`}
          >
            01 · Elige tu edición en el estudio 3D
          </span>
          {renderEditionSelector(false)}
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor={plaqueInputId}
              className={`block text-[10px] uppercase tracking-[0.2em] font-medium ${
                sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#755936]'
              }`}
            >
              02 · Personaliza la placa con el nombre de tu bebé
            </label>
            {cameraPreset !== 'plaque' && (
              <button
                type="button"
                onClick={() => selectCameraPreset('plaque')}
                className={`text-[10px] underline underline-offset-2 shrink-0 ${
                  sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#755936]'
                }`}
              >
                Enfocar placa
              </button>
            )}
          </div>
          <input
            id={plaqueInputId}
            type="text"
            maxLength={34}
            placeholder="Ej. Emiliano · Semana 28"
            value={customerData.plaqueText}
            onFocus={() => selectCameraPreset('plaque')}
            onChange={(e) => {
              const val = e.target.value;
              if (!customerData.plaqueText && val) {
                selectCameraPreset('plaque');
              }
              updateCustomerData({ plaqueText: val });
            }}
            className={`w-full px-3.5 py-2.5 text-sm border focus:outline-none transition-colors ${
              sanctuaryDark
                ? 'bg-[#1D1814] border-[#3D352E] text-[#FAF7F2] placeholder:text-[#8E8377] focus:border-[#D4B07B]'
                : 'bg-[#FAF7F2] border-[#E5DEC9] text-[#2C2825] placeholder:text-[#8E8377] focus:border-[#8C6D46]'
            }`}
          />
          <p
            className={`text-[11px] font-light ${
              sanctuaryDark ? 'text-[#B5AAA0]' : 'text-[#6E665E]'
            }`}
          >
            Grabado incluido en III. Maternidad Total · Vista previa en tiempo real sobre travertino.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {renderSwatchesRow(false)}

          <div className="text-right">
            <span
              className={`text-[10px] uppercase tracking-[0.16em] block ${
                sanctuaryDark ? 'text-[#B5AAA0]' : 'text-[#6E665E]'
              }`}
            >
              {activeTierObj.name}
            </span>
            <span
              className={`font-serif text-2xl ${
                sanctuaryDark ? 'text-[#FAF7F2]' : 'text-[#2C2825]'
              }`}
            >
              {formatCOP(effectivePrice)} COP
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openOrderModal()}
          className={`w-full py-4 px-6 text-[11px] uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-3 font-medium ${
            sanctuaryDark
              ? 'bg-[#D4B07B] text-[#120E0C] hover:bg-[#E5C694]'
              : 'bg-[#2C2825] text-[#FAF7F2] hover:bg-[#8C6D46]'
          }`}
        >
          <span>Reservar con 50% ({formatCOP(halfBookingPrice)} COP)</span>
          <span>→</span>
        </button>
      </div>
    );
  };

  const renderMobileGlassDock = () => {
    const plaqueInputId = 'studio-plaque-input-mobile';
    return (
      <div
        className={`w-full p-3.5 space-y-2.5 transition-colors ${
          sanctuaryDark
            ? 'glass-dock-dark'
            : 'bg-[#FAF7F2]/95 border border-[#E5DEC9] shadow-sm'
        }`}
      >
        {renderEditionSelector(true)}

        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <label htmlFor={plaqueInputId} className="sr-only">
              Personaliza la placa con el nombre de tu bebé
            </label>
            <input
              id={plaqueInputId}
              type="text"
              maxLength={34}
              placeholder="Grabar nombre en placa..."
              value={customerData.plaqueText}
              onFocus={() => selectCameraPreset('plaque')}
              onChange={(e) => {
                const val = e.target.value;
                if (!customerData.plaqueText && val) {
                  selectCameraPreset('plaque');
                }
                updateCustomerData({ plaqueText: val });
              }}
              className={`w-full px-3 py-2 text-xs border focus:outline-none transition-colors ${
                sanctuaryDark
                  ? 'bg-[#1D1814] border-[#3D352E] text-[#FAF7F2] placeholder:text-[#8E8377] focus:border-[#D4B07B]'
                  : 'bg-[#FAF7F2] border-[#E5DEC9] text-[#2C2825] placeholder:text-[#8E8377] focus:border-[#8C6D46]'
              }`}
            />
          </div>
          {renderSwatchesRow(true)}
        </div>

        <button
          type="button"
          onClick={() => openOrderModal()}
          className={`w-full py-3 px-4 text-[10px] uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2 font-medium whitespace-nowrap ${
            sanctuaryDark
              ? 'bg-[#D4B07B] text-[#120E0C] hover:bg-[#E5C694]'
              : 'bg-[#2C2825] text-[#FAF7F2] hover:bg-[#8C6D46]'
          }`}
        >
          <span>Reservar con 50% ({formatCOP(halfBookingPrice)} COP)</span>
          <span>→</span>
        </button>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="visor-3d"
      className={`scroll-mt-20 relative w-full border-t overflow-hidden transition-colors duration-300 ${
        sanctuaryDark
          ? 'bg-sanctuary-radial border-[#D4B07B]/20'
          : 'bg-[#FAF7F2] border-[#E5DEC9]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left Editorial & Desktop Studio Console */}
          <div className="lg:col-span-5 pt-9 pb-1 lg:py-16 space-y-3 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="space-y-2 sm:space-y-3 max-w-md">
              <span
                className={`eyebrow block transition-colors duration-300 ${
                  sanctuaryDark ? '!text-[#D4B07B]' : ''
                }`}
              >
                {sanctuaryDark ? 'Estudio 3D · Santuario 2700K' : 'Estudio 3D · Galería'} —{' '}
                {FINISH_PRESETS[finishId].hint}
              </span>
              <h2
                className={`font-serif text-2xl sm:text-5xl font-light leading-[1.12] transition-colors duration-300 ${
                  sanctuaryDark ? 'text-[#FAF7F2]' : 'text-[#2C2825]'
                }`}
              >
                El misterio de la vida,{' '}
                <em
                  className={`italic font-normal ${
                    sanctuaryDark ? 'text-gold-shimmer' : 'text-[#8C6D46]'
                  }`}
                >
                  revelado en luz.
                </em>
              </h2>
              <p
                className={`hidden sm:block text-sm sm:text-[15px] font-light leading-relaxed transition-colors duration-300 ${
                  sanctuaryDark ? 'text-[#D6CEC4]' : 'text-[#6E665E]'
                }`}
              >
                Gira 360°, alterna entre tu ecografía 3D y la escultura final, o personaliza el
                grabado de su nombre sobre el travertino.
              </p>
            </div>

            <div className="hidden lg:block w-full pt-1">{renderDesktopConfigurator()}</div>
          </div>

          {/* Right / Center Interactive 3D Viewport */}
          <div
            className="lg:col-span-7 relative h-[380px] sm:h-[500px] lg:h-[680px] w-full"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={() => {
              if (!hasInteracted) setHasInteracted(true);
            }}
          >
            {/* Floating Camera Angles + Ultrasound Transformation Controls */}
            <div className="absolute top-2.5 sm:top-5 inset-x-0 z-10 flex justify-center px-2 pointer-events-none">
              <div className="pointer-events-auto">{renderCameraToolbar()}</div>
            </div>

            {shouldMount3D ? (
              <Suspense fallback={<StagePlaceholder dark={sanctuaryDark} />}>
                <SculptureStage3D
                  progressRef={progressRef}
                  finishId={finishId}
                  warmLightOn={warmLightOn}
                  sanctuaryDark={sanctuaryDark}
                  invalidateRef={invalidateRef}
                  isMobile={isMobile}
                  cameraPreset={cameraPreset}
                  cameraMoveNonce={cameraMoveNonce}
                  ultrasoundMode={ultrasoundMode}
                  engravedText={customerData.plaqueText}
                  showHotspots={true}
                  onSelectCameraPreset={selectCameraPreset}
                  onUserOrbitStart={() => {
                    if (!hasInteracted) setHasInteracted(true);
                  }}
                />
              </Suspense>
            ) : (
              <StagePlaceholder dark={sanctuaryDark} />
            )}

            {/* Subtle Disappearing Gesture Hint: Bottom-right on desktop */}
            <div
              className={`pointer-events-none absolute bottom-6 right-4 z-10 hidden lg:flex items-center gap-2 transition-opacity duration-700 ${
                hasInteracted ? 'opacity-0' : 'opacity-80'
              }`}
            >
              <span
                className={`font-serif italic text-sm ${
                  sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#8C6D46]'
                }`}
              >
                Arrastra para girar 360°
              </span>
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
                  sanctuaryDark
                    ? 'border-[#D4B07B]/40 text-[#D4B07B]'
                    : 'border-[#8C6D46]/40 text-[#8C6D46]'
                }`}
              >
                ↔
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Native App Dark Glass Dock directly beneath the 380px viewport */}
        <div className="lg:hidden pb-8 pt-1 flex flex-col items-center gap-2.5">
          {renderMobileGlassDock()}
        </div>
      </div>
    </section>
  );
};
