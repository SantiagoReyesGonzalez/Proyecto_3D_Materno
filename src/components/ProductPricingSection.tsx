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
  const { openOrderModal } = useProductStore();

  return (
    <>
      {/* 4.5. Las Tres Ediciones Conmemorativas (Galería Editorial sobre #F2ECE1) */}
      <section
        id="catalogo-tiers"
        className="scroll-mt-20 deferred-section bg-[#F2ECE1] py-24 sm:py-28 lg:py-36 border-t border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-xl mx-auto text-center space-y-4 mb-20">
            <span className="eyebrow block">
              Colección Conmemorativa · Bogotá
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825]">
              Tres ediciones para{' '}
              <em className="italic font-normal text-[#8C6D46]">atesorar la espera.</em>
            </h2>
            <p className="text-base text-[#6E665E] font-light">
              Cada edición alberga a tu bebé esculpido fielmente a partir de su ecografía
              tridimensional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-14">
            {PRODUCT_TIERS.map((tier) => (
              <article key={tier.id} className="flex flex-col justify-between group">
                <div className="space-y-6">
                  {/* Vertical 4:5 Portrait Image */}
                  <div
                    onClick={() => openOrderModal(tier.id, 'split_50_50')}
                    className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden cursor-pointer"
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

                  {/* Serif Title & Official Price */}
                  <div className="space-y-1.5 pt-1">
                    <span className="eyebrow block">
                      {tier.subtitle}
                    </span>
                    <h3 className="font-serif text-3xl text-[#2C2825] font-light">
                      {tier.name}
                    </h3>
                    <p className="font-serif italic text-2xl text-[#8C6D46]">
                      {formatCOP(tier.officialPrice)} COP
                    </p>
                  </div>

                  {/* 2 Poetic Lines (Strictly <= 20 words) */}
                  <p className="text-sm sm:text-[15px] text-[#6E665E] font-light leading-relaxed">
                    {tier.shortDescription}
                  </p>
                </div>

                {/* Clean Editorial Link */}
                <div className="pt-6 mt-6 border-t border-[#E5DEC9]">
                  <button
                    type="button"
                    onClick={() => openOrderModal(tier.id, 'split_50_50')}
                    className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#2C2825] hover:text-[#8C6D46] transition-colors"
                  >
                    <span>Seleccionar edición</span>
                    <span className="text-[#8C6D46] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Enfoque 3: Tres Atmósferas y Ritual de Entrega (#FAF7F2) */}
      <ExhibitionDetailsSection />

      {/* Hybrid Interactive Carousel + 4-Card Illustrated How-It-Works Section (#proceso on #F2ECE1) */}
      <HowItWorksSection />
    </>
  );
};
