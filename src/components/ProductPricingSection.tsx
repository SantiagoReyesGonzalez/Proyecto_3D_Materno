import React from 'react';
import {
  PRODUCT_TIERS,
  EDITION_PORTRAIT_IMAGES,
  formatCOP,
} from '../data/products';
import { useProductStore } from '../store/useProductStore';
import { ExhibitionDetailsSection } from './ExhibitionDetailsSection';
import { HowItWorksSection } from './HowItWorksSection';

const SHORT_ESSENCE: Record<1 | 2 | 3, string> = {
  1: 'Alabastro translúcido en luz natural · 3–5 días.',
  2: 'Pedestal en travertino con luz cálida 2700K · 3–5 días.',
  3: 'Esculpida a la medida real de tu silueta · 7–10 días.',
};

export const ProductPricingSection: React.FC = () => {
  const { openOrderModal } = useProductStore();

  return (
    <>
      <section
        id="catalogo-tiers"
        className="scroll-mt-20 deferred-section bg-[#FAF7F2] py-20 sm:py-28 border-t border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
          <div className="max-w-xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow block">Colección</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825]">
              Tres ediciones.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {PRODUCT_TIERS.map((tier) => {
              const isHighlighted = tier.id === 2;
              const halfBooking = Math.round(tier.officialPrice / 2);

              return (
                <article
                  key={tier.id}
                  className={`flex flex-col justify-between group p-6 sm:p-7 relative transition-shadow ${
                    isHighlighted
                      ? 'bg-[#FFFFFF] border-2 border-[#8C6D46] shadow-sm'
                      : 'bg-[#F2ECE1]/45 border border-[#E5DEC9]'
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2C2825] text-[#FAF7F2] px-3.5 py-1 text-[10px] uppercase tracking-[0.18em] whitespace-nowrap">
                      ★ Más Elegida
                    </div>
                  )}

                  <div className="space-y-5">
                    <div
                      onClick={() => openOrderModal(tier.id, 'split_50_50')}
                      className="aspect-[4/5] w-full bg-[#F2ECE1] border border-[#E5DEC9] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={EDITION_PORTRAIT_IMAGES[tier.id]}
                        alt={tier.name}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={1000}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-serif text-3xl text-[#2C2825] font-light">
                        {tier.name}
                      </h3>
                      <p className="font-serif italic text-2xl sm:text-[26px] text-[#8C6D46]">
                        {tier.id === 3 ? 'Desde ' : ''}
                        {formatCOP(tier.officialPrice)} COP
                      </p>
                      <span className="block text-xs text-[#755936]">
                        Reserva hoy con 50%: {formatCOP(halfBooking)}
                      </span>
                      <p className="text-sm text-[#6E665E] font-light pt-1">
                        {SHORT_ESSENCE[tier.id]}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-6 border-t border-[#E5DEC9]">
                    <button
                      type="button"
                      onClick={() => openOrderModal(tier.id, 'split_50_50')}
                      className={`w-full py-3.5 px-5 text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${
                        isHighlighted
                          ? 'bg-[#8C6D46] text-[#FAF7F2] hover:bg-[#2C2825]'
                          : 'bg-[#2C2825] text-[#FAF7F2] hover:bg-[#8C6D46]'
                      }`}
                    >
                      <span>Reservar</span>
                      <span>→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ExhibitionDetailsSection />
      <HowItWorksSection />
    </>
  );
};
