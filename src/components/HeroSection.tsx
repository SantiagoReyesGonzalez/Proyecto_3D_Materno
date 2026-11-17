import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
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
          {/* Pure Visual Showcase (0-scroll impact on mobile, Right on Desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] w-full bg-[#181310] border border-[#D4B07B]/25 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
              <img
                src={`${import.meta.env.BASE_URL}images/editorial/detalle_aura_nocturna.jpg`}
                alt="Escultura Maternidad 3D iluminada con luz cálida de 2700K"
                loading="eager"
                decoding="sync"
                width={896}
                height={1200}
                {...({ fetchpriority: 'high' } as Record<string, string>)}
                className={`w-full h-full object-cover object-[50%_58%] lg:object-center transition-opacity duration-500 ${
                  isNightPreview ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <img
                src={`${import.meta.env.BASE_URL}images/editorial/hero_ultrasound_keepsake.jpg`}
                alt="Escultura Maternidad 3D en luz natural sobre travertino"
                loading="eager"
                decoding="sync"
                width={896}
                height={1200}
                className={`absolute inset-0 w-full h-full object-cover object-[50%_55%] lg:object-center transition-opacity duration-500 ${
                  isNightPreview ? 'opacity-0' : 'opacity-100'
                }`}
              />

              <div
                aria-hidden="true"
                className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#120E0C]/85 via-[#120E0C]/30 to-transparent"
              />

              {/* Clean Floating Day / Night 2700K Switch */}
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
            </div>
          </div>

          {/* Concise Monumental Copy & Dual CTAs */}
          <div className="order-2 lg:order-1 lg:col-span-6 lg:pr-6 space-y-5 lg:space-y-7">
            <span className="eyebrow !text-[#D4B07B] block">
              Atelier Escultórico · Bogotá
            </span>

            <h1 className="font-serif text-[34px] sm:text-5xl lg:text-[62px] font-light text-[#FAF7F2] leading-[1.08]">
              El primer abrazo con tu bebé,{' '}
              <em className="italic font-normal text-gold-shimmer block sm:inline">
                esculpido en luz viva.
              </em>
            </h1>

            <p className="text-sm sm:text-[17px] text-[#D6CEC4] leading-relaxed font-light max-w-lg">
              Escultura en resina óptica y travertino a 2700K, creada desde tu ecografía 3D.
            </p>

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

            {/* Clean One-Line Promises */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-5 pt-4 sm:pt-6 border-t border-[#D4B07B]/20 text-center sm:text-left">
              <span className="font-serif text-sm sm:text-base text-[#FAF7F2]">
                Reserva 50/50
              </span>
              <span className="font-serif text-sm sm:text-base text-[#FAF7F2] border-l border-[#D4B07B]/20 pl-2 sm:pl-4">
                Apruebas en 3D
              </span>
              <span className="font-serif text-sm sm:text-base text-[#FAF7F2] border-l border-[#D4B07B]/20 pl-2 sm:pl-4">
                Entrega 3–5 días
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
