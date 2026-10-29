import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#FAF7F2] pt-36 pb-28 lg:pt-44 lg:pb-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          {/* Left Editorial Column with Generous Negative Space */}
          <div className="lg:col-span-6 lg:pr-10 space-y-8">
            <span className="eyebrow block">
              Atelier Escultórico · Bogotá
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-light text-[#2C2825] leading-[1.12]">
              El primer abrazo con tu bebé,{' '}
              <em className="italic font-normal text-[#8C6D46]">
                esculpido en luz y calma.
              </em>
            </h1>

            <p className="text-base sm:text-[17px] text-[#6E665E] leading-relaxed font-light max-w-md">
              Transformamos la ecografía tridimensional de tu bebé en una reliquia familiar de
              resina óptica, modelada y pulida artesanalmente en Bogotá.
            </p>

            <div className="pt-4">
              <a
                href="#catalogo-tiers"
                className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[#2C2825] hover:text-[#8C6D46] transition-colors group"
              >
                <span>Descubrir la Obra</span>
                <span className="w-12 h-[1px] bg-[#8C6D46] group-hover:w-16 transition-all" />
                <span className="text-[#8C6D46]">→</span>
              </a>
            </div>
          </div>

          {/* Right Vertical 4:5 Portrait Frame */}
          <div className="lg:col-span-5 lg:col-start-8">
            <figure className="space-y-4">
              <div className="aspect-[4/5] w-full bg-[#F2ECE1] border border-[#E5DEC9] overflow-hidden">
                <img
                  src="/images/editorial/hero_editorial_alabaster.jpg"
                  alt="Escultura Maternidad 3D en resina óptica sobre piedra travertino con luz cálida"
                  fetchPriority="high"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="font-serif italic text-base text-[#6E665E] text-right">
                Edición Luz de Vida — Resina óptica sobre piedra travertino y luz cálida de 2700K.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
