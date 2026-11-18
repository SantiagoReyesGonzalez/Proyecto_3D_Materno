import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

interface ProcessStep {
  id: number;
  number: string;
  stepCode: string;
  shortTab: string;
  mobileLabel: string;
  title: string;
  shortSentence: string;
  image: string;
  alt: string;
  pills: { text: string; highlight?: boolean }[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 0,
    number: '01.',
    stepCode: '01',
    shortTab: 'Elige edición',
    mobileLabel: 'Edición',
    title: 'Elige tu edición',
    shortSentence: 'Tres versiones diseñadas a la medida de tu recuerdo familiar en Bogotá.',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_1_tres_versiones.jpg`,
    alt: 'Las tres versiones de esculturas Maternidad 3D alineadas sobre piedra travertino',
    pills: [{ text: '3 ediciones desde $249.000 COP' }],
  },
  {
    id: 1,
    number: '02.',
    stepCode: '02',
    shortTab: 'Ecografía 3D',
    mobileLabel: 'Eco 3D',
    title: 'Envía tu ecografía 3D',
    shortSentence: 'Envías fotos o video donde se aprecien las facciones con volumen real.',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_2_ecografia_3d.jpg`,
    alt: 'Fotografía de ecografía prenatal 3D volumétrica junto a la escultura iluminada',
    pills: [{ text: '✓ Solo ecografía 3D/4D · ✕ No sirve 2D', highlight: true }],
  },
  {
    id: 2,
    number: '03.',
    stepCode: '03',
    shortTab: 'Fotos mamá',
    mobileLabel: 'Mamá',
    title: 'Fotos guía (solo Ed. III)',
    shortSentence: 'Solo si eliges Maternidad Total, envías fotos de perfil o agendas escaneo.',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_3_fotos_mama.jpg`,
    alt: 'Futura mamá de perfil en luz natural para referencia de escultura personalizada',
    pills: [{ text: 'Solo aplica para III. Maternidad Total' }],
  },
  {
    id: 3,
    number: '04.',
    stepCode: '04',
    shortTab: 'Entrega',
    mobileLabel: 'Entrega',
    title: 'Apruebas en 3D y recibes',
    shortSentence: 'Apruebas la vista previa por WhatsApp y recibes tu escultura en casa.',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_4_pago_entrega.jpg`,
    alt: 'Estuche artesanal en lino belga abierto con sello en lacre y escultura Maternidad 3D',
    pills: [
      { text: '50% al iniciar · 50% al aprobar render 3D' },
      { text: 'Entrega en 3–10 días hábiles' },
    ],
  },
];

export const HowItWorksSection: React.FC = () => {
  const { openOrderModal } = useProductStore();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const swipeStartRef = useRef<{
    source: 'touch' | 'pointer';
    x: number;
    y: number;
    intent: 'pending' | 'horizontal' | 'vertical';
  } | null>(null);
  const suppressClickUntilRef = useRef<number>(0);

  const activeStep = PROCESS_STEPS[activeIndex];

  useEffect(() => {
    PROCESS_STEPS.forEach((step) => {
      const img = new Image();
      img.src = step.image;
    });
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
  };

  const handleSelectStep = (idx: number) => {
    if (Date.now() < suppressClickUntilRef.current) return;
    setActiveIndex(idx);
  };

  const beginSwipe = (source: 'touch' | 'pointer', clientX: number, clientY: number) => {
    if (swipeStartRef.current) return;
    swipeStartRef.current = { source, x: clientX, y: clientY, intent: 'pending' };
  };

  const moveSwipe = (
    source: 'touch' | 'pointer',
    clientX: number,
    clientY: number,
    visualFeedback = false
  ) => {
    const start = swipeStartRef.current;
    if (!start || start.source !== source) return;

    const deltaX = clientX - start.x;
    const deltaY = clientY - start.y;

    if (start.intent === 'pending') {
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return;
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
        start.intent = 'horizontal';
      } else {
        start.intent = 'vertical';
        if (visualFeedback) setDragOffset(0);
        return;
      }
    }

    if (start.intent === 'horizontal' && visualFeedback) {
      setDragOffset(Math.max(-72, Math.min(72, deltaX * 0.45)));
    }
  };

  const endSwipe = (source: 'touch' | 'pointer', clientX: number, clientY: number) => {
    const start = swipeStartRef.current;
    if (!start || start.source !== source) return;

    const deltaX = clientX - start.x;
    const deltaY = clientY - start.y;
    const isHorizontalGesture =
      start.intent === 'horizontal' ||
      (start.intent === 'pending' &&
        Math.abs(deltaX) >= 36 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.15);

    swipeStartRef.current = null;
    setDragOffset(0);

    if (isHorizontalGesture && Math.abs(deltaX) >= 36) {
      suppressClickUntilRef.current = Date.now() + 350;
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const cancelSwipe = (source: 'touch' | 'pointer') => {
    if (swipeStartRef.current?.source === source) {
      swipeStartRef.current = null;
      setDragOffset(0);
    }
  };

  const getSwipeProps = (visualFeedback = false) => ({
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        beginSwipe('touch', e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        moveSwipe('touch', e.touches[0].clientX, e.touches[0].clientY, visualFeedback);
      }
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      if (touch) {
        endSwipe('touch', touch.clientX, touch.clientY);
      } else {
        cancelSwipe('touch');
      }
    },
    onTouchCancel: () => cancelSwipe('touch'),
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        beginSwipe('pointer', e.clientX, e.clientY);
      }
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        moveSwipe('pointer', e.clientX, e.clientY, visualFeedback);
      }
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        endSwipe('pointer', e.clientX, e.clientY);
      }
    },
    onPointerCancel: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        cancelSwipe('pointer');
      }
    },
  });

  return (
    <section
      id="proceso"
      className="scroll-mt-20 deferred-section overflow-x-clip bg-[#F2ECE1] py-16 sm:py-24 lg:py-28 border-t border-[#E5DEC9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        {/* Minimal Editorial Header */}
        <div className="max-w-xl mx-auto text-center space-y-3 mb-8 sm:mb-12">
          <span className="eyebrow block">Cómo Funciona</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825] leading-[1.15]">
            Cuatro pasos{' '}
            <em className="italic font-normal text-[#8C6D46]">simples.</em>
          </h2>
        </div>

        {/* Sticky on Mobile/Tablet; Clean Connected 4-Node Timeline without utility bar */}
        <div className="max-w-4xl mx-auto sticky top-20 z-30 bg-[#F2ECE1]/95 backdrop-blur-sm border-b border-[#E5DEC9]/80 -mx-4 px-4 py-3 mb-6 sm:-mx-10 sm:px-10 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-b-0 lg:mx-auto lg:px-0 lg:py-0 lg:mb-10">
          <div
            role="tablist"
            aria-label="Pasos de cómo funciona"
            {...getSwipeProps(false)}
            className="relative grid grid-cols-4 items-start touch-pan-y select-none"
          >
            <div
              aria-hidden="true"
              className="absolute top-3.5 sm:top-5 -translate-y-1/2 left-[12.5%] right-[12.5%] h-[1px] bg-[#D8CEBE]"
            >
              <div
                className="h-[2px] -mt-[0.5px] bg-[#8C6D46] transition-all duration-500 ease-out"
                style={{ width: `${(activeIndex / (PROCESS_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = idx === activeIndex;
              const isCompleted = idx < activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectStep(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') handlePrev();
                    if (e.key === 'ArrowRight') handleNext();
                  }}
                  className="group relative flex flex-col items-center text-center px-1 sm:px-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8C6D46] rounded-sm"
                >
                  <span
                    className={`relative z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-[11px] sm:text-sm transition-all duration-300 border ${
                      isSelected
                        ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825] ring-4 ring-[#8C6D46]/20 scale-105'
                        : isCompleted
                          ? 'bg-[#8C6D46] text-[#FAF7F2] border-[#8C6D46] group-hover:bg-[#755936]'
                          : 'bg-[#F2ECE1] text-[#6E665E] border-[#CFC4B2] group-hover:border-[#8C6D46] group-hover:text-[#2C2825] group-hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {step.stepCode}
                  </span>

                  <span
                    className={`mt-1.5 sm:mt-3 block text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.16em] transition-colors leading-tight ${
                      isSelected
                        ? 'text-[#2C2825] font-semibold'
                        : isCompleted
                          ? 'text-[#755936] font-medium'
                          : 'text-[#6E665E] group-hover:text-[#2C2825]'
                    }`}
                  >
                    <span className="sm:hidden">{step.mobileLabel}</span>
                    <span className="hidden sm:inline">{step.shortTab}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Split Viewer — 100% Uncluttered Photo + Concise Right Panel */}
        <div
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
          }}
          {...getSwipeProps(true)}
          style={{
            transform: `translate3d(${dragOffset}px, 0, 0)`,
            opacity: dragOffset === 0 ? 1 : Math.max(0.88, 1 - Math.abs(dragOffset) / 420),
          }}
          className={`bg-[#FAF7F2] border border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 overflow-hidden touch-pan-y focus:outline-none focus:ring-1 focus:ring-[#8C6D46] ${
            dragOffset === 0 ? 'transition-[transform,opacity] duration-300 ease-out' : 'transition-none'
          }`}
        >
          {/* Left 7 Columns: Pure Uncluttered Photograph */}
          <div className="lg:col-span-7 relative bg-[#E5DEC9]/30 border-b lg:border-b-0 lg:border-r border-[#E5DEC9]">
            <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden relative">
              <img
                src={activeStep.image}
                alt={activeStep.alt}
                loading="eager"
                decoding="sync"
                draggable={false}
                width={1000}
                height={750}
                className="w-full h-full object-cover select-none transition-opacity duration-300"
              />

              {/* Mobile Quick Prev/Next Controls on Image Edges */}
              <div className="lg:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Etapa anterior"
                  className="pointer-events-auto w-8 h-8 rounded-full bg-[#FAF7F2]/90 border border-[#E5DEC9] text-[#2C2825] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente etapa"
                  className="pointer-events-auto w-8 h-8 rounded-full bg-[#FAF7F2]/90 border border-[#E5DEC9] text-[#2C2825] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Crisp Step Summary */}
          <div className="lg:col-span-5 p-5 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-serif italic text-4xl sm:text-5xl text-[#8C6D46] block">
                {activeStep.number}
              </span>

              <h3 className="font-serif text-2xl sm:text-4xl font-light text-[#2C2825] leading-tight">
                {activeStep.title}
              </h3>

              <p className="text-sm sm:text-base text-[#6E665E] font-light leading-relaxed">
                {activeStep.shortSentence}
              </p>

              <div className="pt-2 space-y-2">
                {activeStep.pills.map((pill) => (
                  <div
                    key={pill.text}
                    className={`px-3.5 py-2 border text-xs ${
                      pill.highlight
                        ? 'bg-[#F2ECE1] border-[#8C6D46]/60 text-[#2C2825] font-medium'
                        : 'bg-[#F2ECE1]/45 border-[#E5DEC9] text-[#2C2825]'
                    }`}
                  >
                    {pill.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="py-1.5 px-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#6E665E] hover:text-[#2C2825] transition-colors whitespace-nowrap"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {PROCESS_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Ir al paso ${idx + 1}`}
                    onClick={() => handleSelectStep(idx)}
                    className={`h-1.5 transition-all ${
                      idx === activeIndex ? 'w-6 sm:w-7 bg-[#8C6D46]' : 'w-2 bg-[#E5DEC9] hover:bg-[#8C6D46]/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="py-1.5 px-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#2C2825] hover:text-[#8C6D46] transition-colors font-medium whitespace-nowrap"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Closing Reservation Trigger */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => openOrderModal(undefined, 'split_50_50')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors"
          >
            <span>Reservar mi Obra</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
