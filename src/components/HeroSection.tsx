import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

export const HeroSection: React.FC = () => {
  const { openOrderModal } = useProductStore();
  const [isNightPreview, setIsNightPreview] = useState(false);

  return (
    <section className="bg-[#FAF7F2] pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Editorial Column — Persuasive Promise + Double CTA + Risk-Free Guarantees */}
          <div className="lg:col-span-6 lg:pr-8 space-y-6 sm:space-y-8">
            <span className="eyebrow block">
              Atelier Escultórico · Bogotá · Cupos Semanales Limitados
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-light text-[#2C2825] leading-[1.12]">
              El primer abrazo con tu bebé,{' '}
              <em className="italic font-normal text-[#8C6D46]">
                esculpido desde su ecografía 3D.
              </em>
            </h1>

            <p className="text-base sm:text-[17px] text-[#6E665E] leading-relaxed font-light max-w-lg">
              Convertimos la ecografía 3D/4D de tu bebé en una escultura táctil de resina óptica
              iluminada a 2700K sobre piedra travertino. Apruebas el modelado 3D de sus facciones
              por WhatsApp antes de fundir la obra.
            </p>

            {/* Double Conversion CTA */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1">
              <a
                href="#visor-3d"
                className="bg-[#2C2825] text-[#FAF7F2] hover:bg-[#8C6D46] px-7 py-4 text-[11px] uppercase tracking-[0.22em] transition-colors inline-flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <span>Personalizar en Estudio 3D</span>
                <span>→</span>
              </a>

              <button
                type="button"
                onClick={() => openOrderModal()}
                className="border border-[#2C2825]/30 hover:border-[#8C6D46] bg-[#FAF7F2] text-[#2C2825] hover:text-[#755936] px-6 py-4 text-[11px] uppercase tracking-[0.2em] transition-colors inline-flex items-center justify-center whitespace-nowrap"
              >
                Reservar con el 50%
              </button>
            </div>

            {/* 3 Key Zero-Risk Trust Guarantees */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-6 border-t border-[#E5DEC9]">
              <div className="space-y-0.5">
                <span className="block font-serif text-base sm:text-lg text-[#2C2825] leading-snug">
                  50% al iniciar
                </span>
                <span className="block text-[11px] sm:text-xs text-[#6E665E] font-light leading-snug">
                  Saldo al aprobar render 3D
                </span>
              </div>

              <div className="space-y-0.5 border-l border-[#E5DEC9] pl-3 sm:pl-4">
                <span className="block font-serif text-base sm:text-lg text-[#2C2825] leading-snug">
                  Fidelidad 1:1
                </span>
                <span className="block text-[11px] sm:text-xs text-[#6E665E] font-light leading-snug">
                  Desde tu ecografía 3D/4D
                </span>
              </div>

              <div className="space-y-0.5 border-l border-[#E5DEC9] pl-3 sm:pl-4">
                <span className="block font-serif text-base sm:text-lg text-[#2C2825] leading-snug">
                  3 a 5 días hábiles
                </span>
                <span className="block text-[11px] sm:text-xs text-[#6E665E] font-light leading-snug">
                  Estuche en lino belga
                </span>
              </div>
            </div>
          </div>

          {/* Right Vertical 4:5 Showcase — Live Day / Night 2700K Switcher + Ultrasound Proof Card */}
          <div className="lg:col-span-5 lg:col-start-8">
            <figure className="space-y-3.5">
              <div className="aspect-[4/5] w-full bg-[#1B1714] border border-[#E5DEC9] overflow-hidden relative">
                {/* Day Light Sculpture */}
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/hero_ultrasound_keepsake.jpg`}
                  alt="Manos de madre y padre sosteniendo la ecografía prenatal junto a la escultura Maternidad 3D iluminada sobre travertino"
                  decoding="async"
                  width={896}
                  height={1200}
                  {...({ fetchpriority: 'high' } as Record<string, string>)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isNightPreview ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Evening Sanctuary 2700K Crossfade Layer */}
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/detalle_aura_nocturna.jpg`}
                  alt="Escultura Maternidad 3D encendida en habitación nocturna con luz cálida de 2700K"
                  loading="eager"
                  decoding="async"
                  width={896}
                  height={1200}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    isNightPreview ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Top Floating Atmosphere Toggle */}
                <div
                  role="group"
                  aria-label="Cambiar iluminación del retrato principal"
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 inline-flex items-center bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#E5DEC9] p-1 shadow-sm"
                >
                  <button
                    type="button"
                    aria-pressed={!isNightPreview}
                    onClick={() => setIsNightPreview(false)}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      !isNightPreview
                        ? 'bg-[#2C2825] text-[#FAF7F2]'
                        : 'text-[#6E665E] hover:text-[#2C2825]'
                    }`}
                  >
                    <Sun className="w-3 h-3" aria-hidden="true" />
                    <span>Luz Natural</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={isNightPreview}
                    onClick={() => setIsNightPreview(true)}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      isNightPreview
                        ? 'bg-[#2C2825] text-[#D4B07B]'
                        : 'text-[#6E665E] hover:text-[#2C2825]'
                    }`}
                  >
                    <Moon className="w-3 h-3" aria-hidden="true" />
                    <span>Luz Nocturna 2700K</span>
                  </button>
                </div>

                {/* Floating Ultrasound -> Sculpture Verification Card */}
                <a
                  href="#comparador-eco"
                  className="absolute bottom-3.5 left-3.5 right-3.5 sm:right-auto sm:max-w-[335px] z-10 bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#E5DEC9] hover:border-[#8C6D46] p-3 sm:p-3.5 shadow-sm flex items-center gap-3 transition-colors group"
                >
                  <div className="w-12 h-12 shrink-0 border border-[#E5DEC9] overflow-hidden bg-[#F2ECE1]">
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
                    <span className="block text-[11px] font-medium text-[#2C2825] group-hover:text-[#755936] transition-colors leading-tight">
                      ✓ Creada desde tu ecografía 3D
                    </span>
                    <span className="block text-[11px] text-[#6E665E] font-light leading-snug mt-0.5">
                      Sin riesgo: apruebas el render antes de producir
                    </span>
                  </div>
                </a>
              </div>

              <figcaption className="font-serif italic text-sm sm:text-base text-[#6E665E] text-right">
                {isNightPreview
                  ? 'Santuario Nocturno 2700K — luz cálida envolvente sobre el vientre en tu habitación.'
                  : 'De la primera ecografía al abrazo tangible — Edición Luz de Vida en travertino y luz cálida de 2700K.'}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
