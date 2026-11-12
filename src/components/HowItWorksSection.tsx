import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCT_TIERS, formatCOP } from '../data/products';
import { useProductStore } from '../store/useProductStore';

interface ProcessStep {
  id: number;
  number: string;
  shortTab: string;
  eyebrow: string;
  title: string;
  description: string;
  detailNote: string;
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
    shortTab: '01 · Elige versión',
    eyebrow: 'Paso 01 de 04 · Elección de Obra',
    title: 'Decides qué versión quieres',
    description:
      'Contamos con 3 versiones diseñadas para cada familia: Esencia Gestacional (acabado alabastro en luz natural), Luz de Vida (nuestra edición insignia con pedestal iluminado a 2700K) y Maternidad Total (escultura a medida de la silueta real de la mamá).',
    detailNote:
      'Puedes explorar cada acabado en nuestro estudio 3D interactivo antes de elegir tu edición.',
    footerTag: '3 ediciones disponibles',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_1_tres_versiones.jpg`,
    alt: 'Las tres versiones de esculturas Maternidad 3D alineadas sobre mesa de piedra travertino en el atelier',
    overlayBadge: '3 versiones para elegir: Esencia · Luz de Vida (LED 2700K) · Maternidad Total',
    highlights: [
      { label: 'I. Esencia Gestacional', value: '$249.000 COP · Base artesanal sin luz' },
      { label: 'II. Luz de Vida (Favorita)', value: '$369.000 COP · Pedestal travertino LED 2700K' },
      { label: 'III. Maternidad Total', value: '$690.000 COP · Silueta real de la madre + LED' },
    ],
  },
  {
    id: 1,
    number: '02.',
    shortTab: '02 · Ecografía 3D',
    eyebrow: 'Paso 02 de 04 · Requisito Indispensable',
    title: 'Nos adjuntas fotos de tu ecografía 3D',
    description:
      'Subes las fotografías o el video de la ecografía 3D o 4D de tu bebé donde se aprecie su rostro o cuerpecito con relieve. Importante: únicamente trabajamos con ecografías 3D; las ecografías tradicionales en 2D (blanco y negro planas) no nos sirven para esculpir el volumen real.',
    detailNote:
      'Si tienes varias tomas 3D de la misma sesión, puedes compartirnos tus favoritas para lograr la mayor fidelidad.',
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
    shortTab: '03 · Fotos de la mamá',
    eyebrow: 'Paso 03 de 04 · Exclusivo Edición Premium',
    title: 'Fotos de la mamá si elegiste la más premium',
    description:
      'Si seleccionas nuestra edición más exclusiva (III. Maternidad Total), nos adjuntas de 2 a 4 fotografías de referencia de la futura mamá en perfil y tres cuartos —o agendas un escaneo presencial en Bogotá— para modelar su silueta materna exacta abrazando al bebé.',
    detailNote:
      'Si eliges Esencia Gestacional o Luz de Vida, no necesitas enviar fotos de la mamá: trabajamos sobre nuestra silueta escultórica de atelier.',
    footerTag: 'Solo edición Maternidad Total',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_3_fotos_mama.jpg`,
    alt: 'Futura mamá posando de perfil en luz natural para sus fotos guía junto a su escultura personalizada Maternidad 3D',
    overlayBadge: 'Opcional · Aplica únicamente si eliges la edición III. Maternidad Total',
    highlights: [
      { label: 'Ediciones I y II', value: 'No requieren fotos de la mamá (solo ecografía 3D)' },
      { label: 'Edición III (Guía en casa)', value: '2 a 4 fotos sencillas de perfil con luz natural ($690.000)' },
      { label: 'Edición III (Presencial)', value: 'Escaneo 3D directo en nuestro atelier de Bogotá ($780.000)' },
    ],
  },
  {
    id: 3,
    number: '04.',
    shortTab: '04 · Pago y entrega',
    eyebrow: 'Paso 04 de 04 · Confirmación y Envío',
    title: 'Se confirma el precio, pagas y recibes en casa',
    description:
      'El sistema te muestra el precio exacto según la versión elegida. Realizas tu pago con la modalidad que prefieras (reserva 50% al iniciar y 50% al aprobar el modelo digital por WhatsApp, 3 cuotas o Vaca grupal) y recibes la obra en su estuche de lino en 3 a 5 días hábiles (7 a 10 días en Maternidad Total).',
    detailNote:
      'Antes de fundir en resina óptica te enviamos por WhatsApp la vista previa 3D para tu aprobación.',
    footerTag: 'Entrega: 3–5 días · Total 7–10 días',
    image: `${import.meta.env.BASE_URL}images/editorial/proceso_4_pago_entrega.jpg`,
    alt: 'Estuche artesanal en lino belga abierto con guantes blancos, certificado con sello en lacre y la escultura Maternidad 3D lista para entrega',
    overlayBadge: 'Precios claros · Reserva con el 50% · Entrega asegurada en estuche de lino belga',
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
    setIsAutoPlaying(false);
    setActiveIndex(idx);
  };

  return (
    <section
      id="proceso"
      className="scroll-mt-20 deferred-section bg-[#F2ECE1] py-24 sm:py-28 lg:py-36 border-t border-[#E5DEC9]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Editorial Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-14">
          <span className="eyebrow block">
            Cómo Funcionamos · Paso a Paso
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825] leading-[1.15]">
            De tu ecografía 3D a tu hogar,{' '}
            <em className="italic font-normal text-[#8C6D46]">en cuatro pasos simples.</em>
          </h2>
          <p className="text-base text-[#6E665E] font-light leading-relaxed">
            Recorre cada etapa en nuestro carrusel interactivo o explora las cuatro tarjetas
            visuales para conocer cómo transformamos tu ecografía 3D en una escultura familiar.
          </p>
        </div>

        {/* Step Selector Pills + Carousel Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5DEC9]">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pasos de cómo funcionamos">
            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectStep(idx)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] border transition-colors ${
                    isSelected
                      ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                      : 'bg-[#FAF7F2] text-[#6E665E] border-[#E5DEC9] hover:border-[#8C6D46] hover:text-[#2C2825]'
                  }`}
                >
                  {step.shortTab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#6E665E] hover:text-[#2C2825] border border-[#E5DEC9] bg-[#FAF7F2] transition-colors"
            >
              {isAutoPlaying ? 'Pausar carrusel' : 'Auto-recorrer'}
            </button>

            <div className="inline-flex items-center border border-[#E5DEC9] bg-[#FAF7F2]">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Paso anterior"
                className="p-2.5 text-[#2C2825] hover:bg-[#F2ECE1] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 font-serif italic text-sm text-[#6E665E] select-none">
                0{activeIndex + 1} / 04
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Siguiente paso"
                className="p-2.5 text-[#2C2825] hover:bg-[#F2ECE1] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Featured Carousel Stage (Split Editorial Viewer) */}
        <div className="bg-[#FAF7F2] border border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left 7 Columns: Editorial Photograph with Contextual Badge */}
          <div className="lg:col-span-7 relative bg-[#E5DEC9]/30 border-b lg:border-b-0 lg:border-r border-[#E5DEC9]">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden relative">
              <img
                key={activeStep.image}
                src={activeStep.image}
                alt={activeStep.alt}
                loading="lazy"
                decoding="async"
                width={1000}
                height={750}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Top-left subtle step badge */}
              <div className="absolute top-4 left-4 bg-[#FAF7F2]/95 border border-[#E5DEC9] px-3.5 py-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#2C2825] font-medium">
                  {activeStep.eyebrow}
                </span>
              </div>

              {/* Bottom contextual overlay bar */}
              <div className="absolute bottom-0 inset-x-0 bg-[#2C2825]/88 text-[#FAF7F2] px-5 py-3.5 backdrop-blur-[2px]">
                <p className="text-xs sm:text-[13px] font-light tracking-wide">
                  {activeStep.overlayBadge}
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Active Step Detailed Explanation */}
          <div className="lg:col-span-5 p-7 sm:p-10 lg:p-11 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif italic text-4xl sm:text-5xl text-[#8C6D46]">
                  {activeStep.number}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6D46]">
                  {activeStep.footerTag}
                </span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#2C2825] leading-tight">
                {activeStep.title}
              </h3>

              <p className="text-sm sm:text-[15px] text-[#6E665E] font-light leading-relaxed">
                {activeStep.description}
              </p>

              {/* Key Structured Highlights for the Active Step */}
              <div className="pt-3 space-y-2.5 border-t border-[#E5DEC9]">
                {activeStep.highlights.map((item) => (
                  <div
                    key={item.label}
                    className={`p-3 border text-xs ${
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
            <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="text-[11px] uppercase tracking-[0.2em] text-[#6E665E] hover:text-[#2C2825] transition-colors"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-2">
                {PROCESS_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Ir al paso ${idx + 1}`}
                    onClick={() => handleSelectStep(idx)}
                    className={`h-1.5 transition-all ${
                      idx === activeIndex ? 'w-7 bg-[#8C6D46]' : 'w-2 bg-[#E5DEC9] hover:bg-[#8C6D46]/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="text-[11px] uppercase tracking-[0.2em] text-[#2C2825] hover:text-[#8C6D46] transition-colors font-medium"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* 4-Card Visual Overview Grid (All 4 Steps + Images Visible Simultaneously) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
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

                  {/* Step Card Copy */}
                  <div className="p-6 space-y-2.5">
                    <h3 className="font-serif text-2xl text-[#2C2825] font-light leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#6E665E] font-light leading-relaxed line-clamp-4">
                      {step.description}
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
        <div className="mt-10 bg-[#FAF7F2] border border-[#E5DEC9] px-6 py-6 sm:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            {PRODUCT_TIERS.map((tier) => (
              <div key={tier.id} className="space-y-0.5">
                <span className="text-xs uppercase tracking-[0.16em] text-[#8C6D46] block">
                  {tier.name}
                </span>
                <p className="font-serif text-lg text-[#2C2825] leading-snug">
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
