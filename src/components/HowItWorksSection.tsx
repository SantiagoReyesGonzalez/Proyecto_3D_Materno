import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { PRODUCT_TIERS, formatCOP } from '../data/products';
import { useProductStore } from '../store/useProductStore';

interface ProcessStep {
  id: number;
  number: string;
  stepCode: string;
  shortTab: string;
  mobileLabel: string;
  timelineNote: string;
  eyebrow: string;
  title: string;
  description: string;
  cardSummary: string;
  footerTag: string;
  image: string;
  alt: string;
  overlayBadge: string;
  highlights: { label: string; value: string; isWarning?: boolean }[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 0,
    number: '01.',
    stepCode: '01',
    shortTab: 'Elige versión',
    mobileLabel: 'Versión',
    timelineNote: '3 ediciones',
    eyebrow: 'Paso 01 de 04 · Elección de Obra',
    title: 'Decides qué versión quieres',
    description:
      'Contamos con 3 versiones diseñadas para cada familia: Esencia Gestacional (alabastro en luz natural), Luz de Vida (nuestra edición insignia con pedestal iluminado a 2700K) y Maternidad Total (escultura a medida de la silueta real de la mamá).',
    cardSummary:
      'Elige entre nuestras 3 versiones: Esencia Gestacional, Luz de Vida (2700K) o Maternidad Total a medida.',
    footerTag: '3 ediciones disponibles',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_1_tres_versiones.jpg`,
    alt: 'Las tres versiones de esculturas Maternidad 3D alineadas sobre mesa de piedra travertino en el atelier',
    overlayBadge: '3 versiones para elegir: Esencia · Luz de Vida (LED 2700K) · Maternidad Total',
    highlights: [
      { label: 'I. Esencia Gestacional', value: '$249.000 COP · Base artesanal sin luz' },
      { label: 'II. Luz de Vida (Favorita)', value: '$369.000 COP · Pedestal travertino LED 2700K' },
      { label: 'III. Maternidad Total', value: 'Desde $690.000 COP · Silueta real de la madre + LED' },
    ],
  },
  {
    id: 1,
    number: '02.',
    stepCode: '02',
    shortTab: 'Ecografía 3D',
    mobileLabel: 'Eco 3D',
    timelineNote: 'Solo 3D · No 2D',
    eyebrow: 'Paso 02 de 04 · Requisito Indispensable',
    title: 'Nos adjuntas fotos de tu ecografía 3D',
    description:
      'Subes las fotografías o el video de la ecografía 3D o 4D de tu bebé donde se aprecie su rostro o cuerpecito con relieve. Importante: únicamente trabajamos con ecografías 3D; las ecografías tradicionales en 2D (blanco y negro planas) no nos sirven para esculpir el volumen real.',
    cardSummary:
      'Solo trabajamos con fotografías o videos de ecografía 3D/4D con volumen; no nos sirven ecografías 2D planas.',
    footerTag: 'Solo ecografía 3D · No aplica 2D',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_2_ecografia_3d.jpg`,
    alt: 'Manos sosteniendo una ecografía prenatal 3D volumétrica junto al teléfono móvil y la escultura iluminada',
    overlayBadge: '✓ Ecografía 3D/4D con volumen (Sí sirve)   ·   ✕ Ecografía 2D plana (No nos sirve)',
    highlights: [
      { label: '✓ Formato válido', value: 'Ecografía 3D o 4D con volumen facial/corporal (.jpg, .png, .mp4)' },
      {
        label: '✕ Formato no válido',
        value: 'Ecografías 2D planas tradicionales en escala de grises',
        isWarning: true,
      },
    ],
  },
  {
    id: 2,
    number: '03.',
    stepCode: '03',
    shortTab: 'Fotos de la mamá',
    mobileLabel: 'Mamá',
    timelineNote: 'Solo Ed. Total',
    eyebrow: 'Paso 03 de 04 · Exclusivo Edición Premium',
    title: 'Fotos de la mamá en la edición premium',
    description:
      'Si seleccionas nuestra edición más exclusiva (III. Maternidad Total), nos adjuntas de 2 a 4 fotografías de referencia de la futura mamá en perfil y tres cuartos —o agendas un escaneo presencial en Bogotá— para modelar su silueta materna exacta abrazando al bebé.',
    cardSummary:
      'Solo si eliges Maternidad Total: envía 2 a 4 fotos guía de la mamá (o agenda escaneo en Bogotá).',
    footerTag: 'Solo edición Maternidad Total',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_3_fotos_mama.jpg`,
    alt: 'Futura mamá posando de perfil en luz natural para sus fotos guía junto a su escultura personalizada Maternidad 3D',
    overlayBadge: 'Aplica únicamente si eliges la edición más premium: III. Maternidad Total',
    highlights: [
      { label: 'Ediciones I y II', value: 'No requieren fotos de la mamá (solo ecografía 3D)' },
      { label: 'Edición III (Guía en casa)', value: '2 a 4 fotos sencillas de perfil con luz natural ($690.000)' },
      { label: 'Edición III (Presencial)', value: 'Escaneo 3D directo en nuestro atelier de Bogotá ($780.000)' },
    ],
  },
  {
    id: 3,
    number: '04.',
    stepCode: '04',
    shortTab: 'Pago y entrega',
    mobileLabel: 'Entrega',
    timelineNote: '3–10 días hábiles',
    eyebrow: 'Paso 04 de 04 · Confirmación y Envío',
    title: 'Confirmas el valor, pagas y recibes en casa',
    description:
      'El sistema calcula el valor exacto según tu versión. Realizas tu pago (reserva 50% al iniciar y 50% al aprobar la vista digital por WhatsApp, 3 cuotas o Vaca grupal) y recibes la obra en su estuche de lino en 3 a 5 días hábiles (7 a 10 días en Maternidad Total).',
    cardSummary:
      'Calculamos tu valor exacto, pagas en tu modalidad elegida y recibes en 3–5 días hábiles (Total: 7–10 días).',
    footerTag: 'Entrega: 3–5 días · Total 7–10 días',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_4_pago_entrega.jpg`,
    alt: 'Estuche artesanal en lino belga abierto con guantes blancos, certificado con sello en lacre y la escultura Maternidad 3D lista para entrega',
    overlayBadge: 'Precio transparente · Reserva con el 50% · Entrega en estuche de lino belga',
    highlights: [
      { label: 'Modalidades de pago', value: 'Abono 50% / 50%, 3 cuotas sin interés o Vaca Baby Shower' },
      { label: 'Plazo Esencia y Luz de Vida', value: 'Entrega en 3 a 5 días hábiles tras aprobación' },
      { label: 'Plazo Maternidad Total', value: 'Entrega en 7 a 10 días hábiles con placa grabada' },
    ],
  },
];

export const HowItWorksSection: React.FC = () => {
  const { openOrderModal } = useProductStore();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const swipeStartRef = useRef<{
    source: 'touch' | 'pointer';
    x: number;
    y: number;
    intent: 'pending' | 'horizontal' | 'vertical';
  } | null>(null);
  const suppressClickUntilRef = useRef<number>(0);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  const activeStep = PROCESS_STEPS[activeIndex];

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
  };

  const handleSelectStep = (idx: number) => {
    if (Date.now() < suppressClickUntilRef.current) return;
    setIsAutoPlaying(false);
    setActiveIndex(idx);
  };

  const beginSwipe = (source: 'touch' | 'pointer', clientX: number, clientY: number) => {
    if (swipeStartRef.current) return;
    swipeStartRef.current = { source, x: clientX, y: clientY, intent: 'pending' };
  };

  const moveSwipe = (source: 'touch' | 'pointer', clientX: number, clientY: number, visualFeedback = false) => {
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
      const clamped = Math.max(-72, Math.min(72, deltaX * 0.45));
      setDragOffset(clamped);
    }
  };

  const endSwipe = (source: 'touch' | 'pointer', clientX: number, clientY: number) => {
    const start = swipeStartRef.current;
    if (!start || start.source !== source) return;

    const deltaX = clientX - start.x;
    const deltaY = clientY - start.y;
    const isHorizontalGesture =
      start.intent === 'horizontal' ||
      (start.intent === 'pending' && Math.abs(deltaX) >= 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15);

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
      className="scroll-mt-20 deferred-section overflow-x-clip bg-[#F2ECE1] py-16 sm:py-28 lg:py-36 border-t border-[#E5DEC9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        {/* Section Editorial Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 sm:space-y-4 mb-7 sm:mb-12">
          <span className="eyebrow block">
            Cómo Funcionamos · Paso a Paso
          </span>
          <h2 className="font-serif text-2xl sm:text-5xl font-light text-[#2C2825] leading-[1.15]">
            De tu ecografía 3D a tu hogar,{' '}
            <em className="italic font-normal text-[#8C6D46]">en cuatro pasos simples.</em>
          </h2>
          <p className="text-sm sm:text-base text-[#6E665E] font-light leading-relaxed">
            <span className="sm:hidden">
              Desliza o toca la línea de tiempo para ver cómo creamos tu escultura.
            </span>
            <span className="hidden sm:inline">
              Recorre cada etapa en la línea de tiempo interactiva o explora las cuatro tarjetas
              visuales para conocer cómo transformamos tu ecografía 3D en una escultura familiar.
            </span>
          </p>
        </div>

        {/* Interactive Process Timeline Utility Strip */}
        <div className="max-w-5xl mx-auto">
          {/* Single-line subtle utility header */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 mb-3 sm:mb-6 border-b border-[#E5DEC9]">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#755936] font-medium whitespace-nowrap shrink-0">
              <span className="sm:hidden">4 etapas</span>
              <span className="hidden sm:inline">Línea de tiempo · 4 etapas del encargo</span>
            </span>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] transition-colors whitespace-nowrap ${
                  isAutoPlaying
                    ? 'text-[#755936] font-medium'
                    : 'text-[#6E665E] hover:text-[#2C2825]'
                }`}
              >
                {isAutoPlaying ? (
                  <Pause className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <Play className="w-3 h-3" aria-hidden="true" />
                )}
                <span>{isAutoPlaying ? 'Pausar' : 'Auto-recorrer'}</span>
              </button>

              <span className="h-3.5 w-[1px] bg-[#D8CEBE]" aria-hidden="true" />

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Paso anterior"
                  className="p-1.5 text-[#6E665E] hover:text-[#2C2825] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-1 font-serif italic text-sm text-[#6E665E] select-none tabular-nums">
                  0{activeIndex + 1} / 04
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente paso"
                  className="p-1.5 text-[#6E665E] hover:text-[#2C2825] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky on Mobile/Tablet so steps 01–04 stay reachable while reading; static on Desktop */}
        <div className="max-w-5xl mx-auto sticky top-20 z-30 bg-[#F2ECE1]/95 backdrop-blur-sm border-b border-[#E5DEC9]/80 -mx-4 px-4 py-2.5 mb-5 sm:-mx-10 sm:px-10 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-b-0 lg:mx-auto lg:px-0 lg:py-0 lg:mb-10">
          {/* Horizontal Connected Milestone Rail (supports tap & left/right finger swipe) */}
          <div
            role="tablist"
            aria-label="Línea de tiempo de cómo funcionamos"
            {...getSwipeProps(false)}
            className="relative grid grid-cols-4 items-start touch-pan-y select-none"
          >
            {/* Track connecting node centers (12.5% to 87.5%) */}
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

                  <span
                    className={`hidden sm:block mt-1 font-serif italic text-xs transition-colors ${
                      isSelected ? 'text-[#755936]' : 'text-[#6E665E]'
                    }`}
                  >
                    {step.timelineNote}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Featured Carousel Stage (Split Editorial Viewer with Touch Swipe + Arrow Key Navigation) */}
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
          {/* Left 7 Columns: Editorial Photograph with Contextual Badge */}
          <div className="lg:col-span-7 relative bg-[#E5DEC9]/30 border-b lg:border-b-0 lg:border-r border-[#E5DEC9] flex flex-col">
            <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden relative">
              <img
                src={activeStep.image}
                alt={activeStep.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                width={1000}
                height={750}
                className="w-full h-full object-cover select-none transition-opacity duration-300"
              />

              {/* Top-left subtle step badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#FAF7F2]/95 border border-[#E5DEC9] px-2.5 py-1 sm:px-3.5 sm:py-1.5">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#2C2825] font-medium">
                  {activeStep.eyebrow}
                </span>
              </div>

              {/* Mobile/Tablet Quick Photo Prev & Next Touch Buttons */}
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

              {/* Desktop contextual overlay bar along bottom edge (on mobile flows below so photo is 100% uncovered) */}
              <div className="hidden sm:block absolute bottom-0 inset-x-0 bg-[#2C2825]/88 text-[#FAF7F2] px-5 py-3.5 backdrop-blur-[2px]">
                <p className="text-xs sm:text-[13px] font-light tracking-wide">
                  {activeStep.overlayBadge}
                </p>
              </div>
            </div>

            <div className="sm:hidden bg-[#2C2825] text-[#FAF7F2] px-4 py-2">
              <p className="text-[11px] font-light leading-snug">
                {activeStep.overlayBadge}
              </p>
            </div>
          </div>

          {/* Right 5 Columns: Active Step Detailed Explanation */}
          <div className="lg:col-span-5 p-4 sm:p-10 lg:p-11 flex flex-col justify-between space-y-4 sm:space-y-8">
            <div className="space-y-2.5 sm:space-y-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif italic text-3xl sm:text-5xl text-[#8C6D46]">
                  {activeStep.number}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#755936] font-medium">
                  {activeStep.footerTag}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-light text-[#2C2825] leading-tight">
                {activeStep.title}
              </h3>

              <p className="text-[13px] sm:text-[15px] text-[#6E665E] font-light leading-relaxed">
                <span className="sm:hidden">{activeStep.cardSummary}</span>
                <span className="hidden sm:inline">{activeStep.description}</span>
              </p>

              {/* Key Structured Highlights for the Active Step */}
              <div className="pt-2.5 sm:pt-3 space-y-1.5 sm:space-y-2.5 border-t border-[#E5DEC9]">
                {activeStep.highlights.map((item) => (
                  <div
                    key={item.label}
                    className={`p-2 sm:p-3 border text-[11px] sm:text-xs leading-snug ${
                      item.isWarning
                        ? 'bg-[#F2ECE1]/80 border-[#8C6D46]/60 text-[#2C2825]'
                        : 'bg-[#F2ECE1]/40 border-[#E5DEC9] text-[#2C2825]'
                    }`}
                  >
                    <span className="font-medium block text-[#2C2825]">{item.label}</span>
                    <span className="text-[#6E665E] font-light">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stepper Controls inside Card */}
            <div className="pt-3 sm:pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-2 sm:gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="py-1.5 px-1 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#6E665E] hover:text-[#2C2825] transition-colors whitespace-nowrap"
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
                className="py-1.5 px-1 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#2C2825] hover:text-[#8C6D46] transition-colors font-medium whitespace-nowrap"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* 4-Card Visual Overview Grid (Tablet/Desktop only; on mobile keeps view focused and compact) */}
        <div className="hidden sm:grid mt-10 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <article
                key={step.id}
                onClick={() => handleSelectStep(idx)}
                className={`group cursor-pointer bg-[#FAF7F2] border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-[#8C6D46] shadow-sm'
                    : 'border-[#E5DEC9] hover:border-[#8C6D46]/60'
                }`}
              >
                <div>
                  {/* Step Card Thumbnail Image (4:3) */}
                  <div className="aspect-[4/3] w-full bg-[#F2ECE1] border-b border-[#E5DEC9] overflow-hidden relative">
                    <img
                      src={step.image}
                      alt={step.alt}
                      loading="lazy"
                      decoding="async"
                      width={1000}
                      height={750}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border ${
                        isActive
                          ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                          : 'bg-[#FAF7F2]/95 text-[#2C2825] border-[#E5DEC9]'
                      }`}
                    >
                      Paso {step.number}
                    </span>
                  </div>

                  {/* Step Card Copy — concise non-truncated editorial summary */}
                  <div className="p-6 space-y-2.5">
                    <h3 className="font-serif text-2xl text-[#2C2825] font-light leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#6E665E] font-light leading-relaxed">
                      {step.cardSummary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-[#E5DEC9] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#8C6D46] font-medium">
                    {step.footerTag}
                  </span>
                  <span className="text-xs text-[#2C2825] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Pricing & Delivery Timeframe Strip */}
        <div className="mt-6 sm:mt-10 bg-[#FAF7F2] border border-[#E5DEC9] px-4 py-4 sm:px-8 sm:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 flex-1">
            {PRODUCT_TIERS.map((tier) => (
              <div key={tier.id} className="space-y-0.5">
                <span className="text-xs uppercase tracking-[0.16em] text-[#8C6D46] block">
                  {tier.name}
                </span>
                <p className="font-serif text-lg text-[#2C2825] leading-snug">
                  {tier.id === 3 ? 'Desde ' : ''}
                  {formatCOP(tier.officialPrice)} COP
                </p>
                <span className="font-sans text-xs text-[#6E665E] block">
                  Entrega en {tier.deliveryDays} hábiles
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openOrderModal(undefined, 'split_50_50')}
            className="shrink-0 inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors"
          >
            <span>Iniciar mi pedido</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
