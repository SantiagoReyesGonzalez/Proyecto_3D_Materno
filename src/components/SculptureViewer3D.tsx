import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { FINISH_PRESETS, ResinFinishId } from '../data/finishes';

const SculptureStage3D = lazy(() => import('./SculptureStage3D'));

const StagePlaceholder: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className={`px-5 py-2.5 border text-center shadow-sm whitespace-nowrap rounded-full ${
        dark ? 'bg-[#26211D]/90 border-[#3D352E]' : 'bg-[#FAF7F2]/95 border-[#E5DEC9]'
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
  const { activeFinish: finishId, setFinish: setFinishId, openOrderModal } = useProductStore();
  const [sanctuaryDark, setSanctuaryDark] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldMount3D, setShouldMount3D] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0.5);
  const invalidateRef = useRef<(() => void) | null>(null);

  // Detect mobile / coarse pointer once and on breakpoint change for adaptive GPU profile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Defer 3D engine & GLB model download until near viewport or browser idle,
  // keeping initial mobile Hero LCP completely unobstructed.
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
      idleId = idleWin.requestIdleCallback(() => setShouldMount3D(true), { timeout: 2500 });
    } else {
      timerId = window.setTimeout(() => setShouldMount3D(true), 2000);
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

  // Smooth passive scroll tracking strictly when #visor-3d is visible in the viewport
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

  const bgColor = sanctuaryDark ? '#1B1714' : '#FAF7F2';

  const renderControlsDock = () => (
    <div
      className={`inline-flex items-center gap-3.5 px-4 py-2.5 rounded-full border md:backdrop-blur-md transition-colors duration-300 shadow-sm ${
        sanctuaryDark
          ? 'bg-[#26211D]/95 md:bg-[#26211D]/90 border-[#3D352E]'
          : 'bg-[#FAF7F2]/95 md:bg-[#FAF7F2]/90 border-[#E5DEC9]'
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
            className={`relative w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${
              active ? 'scale-110' : 'opacity-75 hover:opacity-100 hover:scale-105'
            }`}
          >
            <span
              className="w-5 h-5 rounded-full block shadow-inner"
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

      {/* Hairline Divider */}
      <span
        className={`h-4 w-[1px] mx-0.5 ${
          sanctuaryDark ? 'bg-[#3D352E]' : 'bg-[#E5DEC9]'
        }`}
      />

      {/* Single Intuitive Day / Night 2700K Atmosphere Dot */}
      <button
        type="button"
        onClick={() => setSanctuaryDark((v) => !v)}
        title={sanctuaryDark ? 'Ver con luz de día' : 'Ver en penumbra nocturna 2700K'}
        aria-label={sanctuaryDark ? 'Ver con luz de día' : 'Ver en penumbra nocturna 2700K'}
        className={`inline-flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full text-[11px] font-serif italic transition-colors ${
          sanctuaryDark
            ? 'text-[#FFB866]'
            : 'text-[#6E665E] hover:text-[#2C2825]'
        }`}
      >
        <span
          className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
            sanctuaryDark
              ? 'bg-[#FFB866] shadow-[0_0_10px_#FFA84C]'
              : 'bg-[#2C2825]'
          }`}
        />
        <span>{sanctuaryDark ? 'Noche' : 'Día'}</span>
      </button>
    </div>
  );

  const renderOrderCta = () => (
    <button
      type="button"
      onClick={() => openOrderModal()}
      className={`inline-flex items-center gap-3.5 px-5 py-2.5 rounded-full border text-[11px] uppercase tracking-[0.22em] md:backdrop-blur-md transition-colors duration-300 group whitespace-nowrap ${
        sanctuaryDark
          ? 'bg-[#26211D]/95 md:bg-[#26211D]/90 border-[#D4B07B]/50 text-[#FAF7F2] hover:border-[#D4B07B]'
          : 'bg-[#FAF7F2]/95 md:bg-[#FAF7F2]/90 border-[#2C2825]/30 text-[#2C2825] hover:border-[#8C6D46] hover:text-[#8C6D46]'
      }`}
    >
      <span>Encargar esta Obra</span>
      <span className="text-[#8C6D46] group-hover:translate-x-1 transition-transform">
        →
      </span>
    </button>
  );

  return (
    <section
      ref={sectionRef}
      id="visor-3d"
      style={{ backgroundColor: bgColor }}
      className="scroll-mt-20 relative w-full border-t border-[#E5DEC9] overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 pt-14 pb-4 lg:py-20 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="space-y-3 max-w-md">
              <span
                className={`eyebrow block transition-colors duration-300 ${
                  sanctuaryDark ? '!text-[#D4B07B]' : ''
                }`}
              >
                {sanctuaryDark ? 'Santuario Nocturno · 2700K' : 'Estudio de Día · Alabastro'} —{' '}
                {FINISH_PRESETS[finishId].hint}
              </span>
              <h2
                className={`font-serif text-4xl sm:text-5xl font-light leading-[1.12] transition-colors duration-300 ${
                  sanctuaryDark ? 'text-[#FAF7F2]' : 'text-[#2C2825]'
                }`}
              >
                El misterio de la vida,{' '}
                <em
                  className={`italic font-normal transition-colors duration-300 ${
                    sanctuaryDark ? 'text-[#DFB882]' : 'text-[#8C6D46]'
                  }`}
                >
                  revelado en luz.
                </em>
              </h2>
              <p
                className={`text-sm sm:text-[15px] font-light leading-relaxed transition-colors duration-300 ${
                  sanctuaryDark ? 'text-[#C8BFB5]' : 'text-[#6E665E]'
                }`}
              >
                Al deslizar o girar la escultura en acabado{' '}
                <strong
                  className={`font-normal ${
                    sanctuaryDark ? 'text-[#FAF7F2]' : 'text-[#2C2825]'
                  }`}
                >
                  {FINISH_PRESETS[finishId].hint}
                </strong>
                , su vientre translúcido revela a tu bebé sobre travertino con luz cálida de 2700K.
              </p>
            </div>

            {/* Desktop Interactive Dock & CTA tucked cleanly beneath the editorial text */}
            <div className="hidden lg:flex flex-wrap items-center gap-4 pt-3">
              {renderControlsDock()}
              {renderOrderCta()}
            </div>
          </div>

          {/* Right / Center Dedicated 3D Stage */}
          <div
            className="lg:col-span-7 relative h-[450px] sm:h-[540px] lg:h-[680px] w-full"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={() => {
              if (!hasInteracted) setHasInteracted(true);
            }}
          >
            {shouldMount3D ? (
              <Suspense fallback={<StagePlaceholder dark={sanctuaryDark} />}>
                <SculptureStage3D
                  progressRef={progressRef}
                  finishId={finishId}
                  sanctuaryDark={sanctuaryDark}
                  invalidateRef={invalidateRef}
                  isMobile={isMobile}
                />
              </Suspense>
            ) : (
              <StagePlaceholder dark={sanctuaryDark} />
            )}

            {/* Subtle Disappearing Gesture Hint: Top-right on desktop */}
            <div
              className={`pointer-events-none absolute top-8 right-4 z-10 hidden lg:flex items-center gap-2 transition-opacity duration-700 ${
                hasInteracted ? 'opacity-0' : 'opacity-75'
              }`}
            >
              <span
                className={`font-serif italic text-sm ${
                  sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#8C6D46]'
                }`}
              >
                Desliza para girar
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

        {/* Mobile & Tablet Controls Bar: Safely BELOW the 3D stage */}
        <div className="lg:hidden pb-12 pt-1 flex flex-col items-center gap-4">
          <div
            className={`pointer-events-none flex items-center gap-2 transition-opacity duration-700 ${
              hasInteracted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-75'
            }`}
          >
            <span
              className={`font-serif italic text-xs ${
                sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#8C6D46]'
              }`}
            >
              Desliza para girar · 360°
            </span>
          </div>
          <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
            {renderControlsDock()}
            {renderOrderCta()}
          </div>
        </div>
      </div>
    </section>
  );
};
