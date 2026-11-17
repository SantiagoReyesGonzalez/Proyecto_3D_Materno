import React, { useState } from 'react';
import { Moon, Sparkles, Sun } from 'lucide-react';
import { formatCOP } from '../data/products';
import { useProductStore } from '../store/useProductStore';

export const HeroSection: React.FC = () => {
  const { openOrderModal, getEffectivePrice } = useProductStore();
  const [isNightPreview, setIsNightPreview] = useState(true);
  const halfBookingPrice = Math.round(getEffectivePrice() / 2);

  return (
    <section className="bg-sanctuary-radial text-[#FAF7F2] min-h-[92svh] pt-24 pb-8 sm:pt-32 sm:pb-16 lg:pt-32 lg:pb-24 flex items-center relative overflow-hidden">
      {/* Soft Breathing 2700K Ambient Glow Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 lg:left-[72%] w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full bg-[#FFA84C]/12 blur-[90px] animate-aura-breathe"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          {/* Visual Showcase (First in mobile flow for instant 0-scroll sculpture impact; Right on Desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <figure className="space-y-2.5 lg:space-y-3.5">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] w-full bg-[#181310] border border-[#D4B07B]/25 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
                {/* Luminous Nocturnal 2700K Sculpture Layer */}
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/detalle_aura_nocturna.jpg`}
                  alt="Escultura Maternidad 3D iluminada en santuario nocturno con luz cálida de 2700K"
                  loading="eager"
                  decoding="sync"
                  width={896}
                  height={1200}
                  {...({ fetchpriority: 'high' } as Record<string, string>)}
                  className={`w-full h-full object-cover object-[50%_58%] lg:object-center transition-opacity duration-500 ${
                    isNightPreview ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Gallery Natural Daylight Crossfade Layer */}
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/hero_ultrasound_keepsake.jpg`}
                  alt="Manos de madre y padre sosteniendo la ecografía prenatal junto a la escultura Maternidad 3D sobre travertino"
                  loading="eager"
                  decoding="sync"
                  width={896}
                  height={1200}
                  className={`absolute inset-0 w-full h-full object-cover object-[50%_55%] lg:object-center transition-opacity duration-500 ${
                    isNightPreview ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Soft bottom vignette on mobile so transition into copy is seamless */}
                <div
                  aria-hidden="true"
                  className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#120E0C]/85 via-[#120E0C]/30 to-transparent"
                />

                {/* Subtle Ultrasound Origin Chip on Top-Left (Compact on mobile) */}
                <a
                  href="#comparador-eco"
                  className="lg:hidden absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 bg-[#14100D]/90 border border-[#D4B07B]/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-[#F5E6CE]"
                >
                  <span>✓ Ecografía 3D real</span>
                </a>

                {/* Floating Day / Night 2700K Switch (opaque warm dark plate for 100% text crispness over photos) */}
                <div
                  role="group"
                  aria-label="Cambiar iluminación del retrato principal"
                  className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 inline-flex items-center bg-[#14100D]/92 border border-[#D4B07B]/40 p-1 shadow-md isolate"
                >
                  <button
                    type="button"
                    aria-pressed={isNightPreview}
                    onClick={() => setIsNightPreview(true)}
                    className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-colors ${
                      isNightPreview
                        ? 'bg-[#D4B07B] text-[#120E0C] font-medium'
                        : 'text-[#EAE2D6] hover:text-[#FAF7F2]'
                    }`}
                  >
                    <Moon className="w-3 h-3" aria-hidden="true" />
                    <span className="sm:hidden">2700K</span>
                    <span className="hidden sm:inline">Luz Nocturna 2700K</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={!isNightPreview}
                    onClick={() => setIsNightPreview(false)}
                    className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-colors ${
                      !isNightPreview
                        ? 'bg-[#FAF7F2] text-[#120E0C] font-medium'
                        : 'text-[#EAE2D6] hover:text-[#FAF7F2]'
                    }`}
                  >
                    <Sun className="w-3 h-3" aria-hidden="true" />
                    <span className="sm:hidden">Galería</span>
                    <span className="hidden sm:inline">Luz de Galería</span>
                  </button>
                </div>

                {/* Desktop Interactive Ultrasound Proof Floating Card */}
                <a
                  href="#comparador-eco"
                  className="hidden lg:flex absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[335px] z-10 glass-dock-dark hover:border-[#D4B07B]/70 p-3.5 shadow-lg items-center gap-3 transition-colors group animate-float-slow"
                >
                  <div className="w-12 h-12 shrink-0 border border-[#D4B07B]/40 overflow-hidden bg-[#181310]">
                    <img
                      src={`${import.meta.env.BASE_URL}images/editorial/proceso_2_ecografia_3d.jpg`}
                      alt="Ecografía prenatal 3D de referencia"
                      loading="eager"
                      decoding="async"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium text-[#F5E6CE] group-hover:text-[#D4B07B] transition-colors leading-tight">
                      ✓ Creada desde tu ecografía 3D
                    </span>
                    <span className="block text-[11px] text-[#C8BFB5] font-light leading-snug mt-0.5">
                      Sin riesgo: apruebas el render 3D antes de producir
                    </span>
                  </div>
                </a>
              </div>

              <figcaption className="hidden lg:block font-serif italic text-sm text-[#C8BFB5] text-right">
                {isNightPreview
                  ? 'Santuario Nocturno 2700K — el vientre translúcido ilumina las noches de espera.'
                  : 'Luz de Galería — escultura en alabastro óptico y travertino romano.'}
              </figcaption>
            </figure>
          </div>

          {/* Copy, Monumental Shimmer Headline & Dual CTAs */}
          <div className="order-2 lg:order-1 lg:col-span-6 lg:pr-6 space-y-4 sm:space-y-6 lg:space-y-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="eyebrow !text-[#D4B07B] block">
                Atelier Escultórico · Bogotá
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 border border-[#D4B07B]/35 bg-[#1D1713] text-[#F5E6CE]">
                <Sparkles className="w-3 h-3 text-[#D4B07B]" aria-hidden="true" />
                <span>Grabado personalizado + Aprobación 3D por WhatsApp</span>
              </span>
            </div>

            <h1 className="font-serif text-[32px] sm:text-5xl lg:text-[62px] font-light text-[#FAF7F2] leading-[1.08]">
              El primer abrazo con tu bebé,{' '}
              <em className="italic font-normal text-gold-shimmer block sm:inline">
                esculpido en luz viva.
              </em>
            </h1>

            <p className="text-sm sm:text-[17px] text-[#D6CEC4] leading-relaxed font-light max-w-lg">
              Transformamos su ecografía 3D/4D en una reliquia luminosa de resina óptica a 2700K sobre
              travertino. Ves y apruebas el modelado 3D de sus facciones antes de fundir la obra.
            </p>

            {/* Primary & Secondary Conversion Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1">
              <a
                href="#visor-3d"
                className="bg-[#D4B07B] text-[#120E0C] hover:bg-[#E5C694] px-6 sm:px-7 py-3.5 sm:py-4 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors inline-flex items-center justify-center gap-3 whitespace-nowrap shadow-[0_8px_28px_rgba(212,176,123,0.22)]"
              >
                <span>Vivir Experiencia 3D</span>
                <span>→</span>
              </a>

              <button
                type="button"
                onClick={() => openOrderModal()}
                className="glass-dock-dark hover:border-[#D4B07B] text-[#FAF7F2] px-5 sm:px-6 py-3.5 sm:py-4 text-[11px] uppercase tracking-[0.18em] transition-colors inline-flex items-center justify-center whitespace-nowrap"
              >
                Reservar con 50% ({formatCOP(halfBookingPrice)})
              </button>
            </div>

            {/* Compact 3 Guarantees Strip */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-5 pt-4 sm:pt-6 border-t border-[#D4B07B]/20">
              <div className="space-y-0.5">
                <span className="block font-serif text-sm sm:text-lg text-[#FAF7F2] leading-snug">
                  50% al iniciar
                </span>
                <span className="block text-[10px] sm:text-xs text-[#C8BFB5] font-light leading-tight">
                  Saldo al aprobar 3D
                </span>
              </div>

              <div className="space-y-0.5 border-l border-[#D4B07B]/20 pl-2.5 sm:pl-4">
                <span className="block font-serif text-sm sm:text-lg text-[#FAF7F2] leading-snug">
                  Fidelidad 1:1
                </span>
                <span className="block text-[10px] sm:text-xs text-[#C8BFB5] font-light leading-tight">
                  Ecografía 3D/4D real
                </span>
              </div>

              <div className="space-y-0.5 border-l border-[#D4B07B]/20 pl-2.5 sm:pl-4">
                <span className="block font-serif text-sm sm:text-lg text-[#FAF7F2] leading-snug">
                  3 a 5 días
                </span>
                <span className="block text-[10px] sm:text-xs text-[#C8BFB5] font-light leading-tight">
                  Estuche en lino belga
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
