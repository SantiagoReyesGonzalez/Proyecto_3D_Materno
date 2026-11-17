import React from 'react';
import {
  PRODUCT_TIERS,
  EDITION_PORTRAIT_IMAGES,
  formatCOP,
} from '../data/products';
import { useProductStore } from '../store/useProductStore';
import { ExhibitionDetailsSection } from './ExhibitionDetailsSection';
import { HowItWorksSection } from './HowItWorksSection';

export const ProductPricingSection: React.FC = () => {
  const { setTier, openOrderModal } = useProductStore();

  const handleInspectInStudio = (tierId: 1 | 2 | 3) => {
    setTier(tierId);
    document.getElementById('visor-3d')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Las Tres Ediciones Conmemorativas (sobre #FAF7F2 alternando con #F2ECE1 superior y #161311 inferior) */}
      <section
        id="catalogo-tiers"
        className="scroll-mt-20 deferred-section bg-[#FAF7F2] py-20 sm:py-28 lg:py-36 border-t border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
          <div className="max-w-xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
            <span className="eyebrow block">
              Colección Conmemorativa · Bogotá
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825]">
              Tres ediciones para{' '}
              <em className="italic font-normal text-[#8C6D46]">atesorar la espera.</em>
            </h2>
            <p className="text-sm sm:text-base text-[#6E665E] font-light">
              Cada edición alberga a tu bebé esculpido fielmente a partir de su ecografía 3D.
            </p>
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
                      ★ Favorita de las Familias · Más Elegida
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Vertical 4:5 Portrait Image */}
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

                    {/* Serif Title, Official Price & Psychological Easy-Pay Breakdown */}
                    <div className="space-y-2 pt-1">
                      <span className="eyebrow block">
                        {tier.subtitle}
                      </span>
                      <h3 className="font-serif text-3xl text-[#2C2825] font-light">
                        {tier.name}
                      </h3>
                      <p className="font-serif italic text-2xl sm:text-[26px] text-[#8C6D46]">
                        {tier.id === 3 ? 'Desde ' : ''}
                        {formatCOP(tier.officialPrice)} COP
                      </p>

                      <div className="p-3 bg-[#F2ECE1]/80 border border-[#E5DEC9] space-y-1">
                        <span className="block text-xs font-medium text-[#2C2825]">
                          Hoy reservas con el 50%: {formatCOP(halfBooking)} COP
                        </span>
                        <span className="block text-[11px] text-[#6E665E] font-light">
                          O en Vaca de Baby Shower: {formatCOP(tier.vacaPerPersonAmount)} COP ×{' '}
                          {tier.vacaSuggestedPeople} personas
                        </span>
                      </div>
                    </div>

                    {/* Description + Spec & Lead-time Meta */}
                    <div className="space-y-2.5">
                      <p className="text-sm text-[#6E665E] font-light leading-relaxed">
                        {tier.shortDescription}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#755936]">
                        {tier.specs.lighting} · Entrega {tier.deliveryDays} hábiles
                      </p>
                    </div>
                  </div>

                  {/* Dual Conversion Actions */}
                  <div className="pt-5 mt-6 border-t border-[#E5DEC9] space-y-2.5">
                    <button
                      type="button"
                      onClick={() => openOrderModal(tier.id, 'split_50_50')}
                      className={`w-full py-3.5 px-5 text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${
                        isHighlighted
                          ? 'bg-[#8C6D46] text-[#FAF7F2] hover:bg-[#2C2825]'
                          : 'bg-[#2C2825] text-[#FAF7F2] hover:bg-[#8C6D46]'
                      }`}
                    >
                      <span>Reservar Edición</span>
                      <span>→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInspectInStudio(tier.id)}
                      className="w-full py-2.5 px-4 text-[10px] uppercase tracking-[0.18em] text-[#6E665E] hover:text-[#2C2825] border border-[#E5DEC9] hover:border-[#8C6D46] bg-[#FAF7F2] transition-colors"
                    >
                      Ver en Estudio 3D
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Santuario Nocturno 2700K, Sello de Garantía y Testimonios Reales (#161311) */}
      <ExhibitionDetailsSection />

      {/* Línea de tiempo interactiva y carrusel de proceso (#proceso en #F2ECE1) */}
      <HowItWorksSection />
    </>
  );
};
