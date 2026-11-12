import React from 'react';
import {
  PRODUCT_TIERS,
  EDITION_PORTRAIT_IMAGES,
  formatCOP,
} from '../data/products';
import { useProductStore } from '../store/useProductStore';
import { ExhibitionDetailsSection } from './ExhibitionDetailsSection';

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

      {/* Clear 4-Step Operational Flow: How We Work (#proceso on #F2ECE1) */}
      <section
        id="proceso"
        className="scroll-mt-20 deferred-section bg-[#F2ECE1] py-24 sm:py-28 lg:py-32 border-t border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <span className="eyebrow block">
              Cómo Funcionamos · Paso a Paso
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825]">
              De tu ecografía 3D a tu hogar,{' '}
              <em className="italic font-normal text-[#8C6D46]">en cuatro pasos simples.</em>
            </h2>
            <p className="text-base text-[#6E665E] font-light leading-relaxed">
              Escoges tu edición, envías tus imágenes 3D, confirmas el valor según el acabado y
              recibes la obra lista en el tiempo acordado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="bg-[#FAF7F2] border border-[#E5DEC9] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-serif italic text-3xl text-[#8C6D46] block">01.</span>
                <h3 className="font-serif text-2xl text-[#2C2825] font-light">
                  Decides tu versión
                </h3>
                <p className="text-sm text-[#6E665E] font-light leading-relaxed">
                  Eliges entre nuestras 3 versiones: <strong className="font-medium text-[#2C2825]">Esencia Gestacional</strong>,{' '}
                  <strong className="font-medium text-[#2C2825]">Luz de Vida</strong> (base cálida 2700K) o{' '}
                  <strong className="font-medium text-[#2C2825]">Maternidad Total</strong>.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5DEC9]">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8C6D46] block">
                  3 ediciones disponibles
                </span>
              </div>
            </article>

            <article className="bg-[#FAF7F2] border border-[#E5DEC9] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-serif italic text-3xl text-[#8C6D46] block">02.</span>
                <h3 className="font-serif text-2xl text-[#2C2825] font-light">
                  Adjuntas ecografía 3D
                </h3>
                <p className="text-sm text-[#6E665E] font-light leading-relaxed">
                  Subes tus fotografías o videos de <strong className="font-medium text-[#2C2825]">ecografía 3D/4D</strong>.
                  Las ecografías tradicionales en <strong className="font-medium text-[#2C2825]">2D no nos sirven</strong> para reconstruir el volumen de tu bebé.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5DEC9]">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8C6D46] block">
                  Solo ecografía 3D · No aplica 2D
                </span>
              </div>
            </article>

            <article className="bg-[#FAF7F2] border border-[#E5DEC9] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-serif italic text-3xl text-[#8C6D46] block">03.</span>
                <h3 className="font-serif text-2xl text-[#2C2825] font-light">
                  Fotos de la mamá
                </h3>
                <p className="text-sm text-[#6E665E] font-light leading-relaxed">
                  Si elegiste la edición más premium (<strong className="font-medium text-[#2C2825]">Maternidad Total</strong>),
                  nos envías fotos de referencia de la madre —o agendas escaneo en Bogotá— para esculpir su silueta real.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5DEC9]">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8C6D46] block">
                  Solo edición Maternidad Total
                </span>
              </div>
            </article>

            <article className="bg-[#FAF7F2] border border-[#E5DEC9] p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-serif italic text-3xl text-[#8C6D46] block">04.</span>
                <h3 className="font-serif text-2xl text-[#2C2825] font-light">
                  Precio, pago y entrega
                </h3>
                <p className="text-sm text-[#6E665E] font-light leading-relaxed">
                  Te confirmamos el precio según tu edición, realizas el pago (abono 50/50, 3 cuotas o Vaca) y recibes en casa en{' '}
                  <strong className="font-medium text-[#2C2825]">3 a 5 días hábiles</strong> (o <strong className="font-medium text-[#2C2825]">7 a 10 días</strong> en versión Total).
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5DEC9]">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8C6D46] block">
                  Entrega: 3–5 días · Total 7–10 días
                </span>
              </div>
            </article>
          </div>

          <div className="mt-12 bg-[#FAF7F2] border border-[#E5DEC9] px-6 py-5 sm:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
              className="shrink-0 inline-flex items-center justify-center gap-3 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors"
            >
              <span>Iniciar mi pedido</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
