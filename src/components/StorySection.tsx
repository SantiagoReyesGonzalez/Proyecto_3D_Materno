import React from 'react';

export const StorySection: React.FC = () => {
  return (
    <section id="el-atelier" className="bg-[#F2ECE1] py-28 lg:py-36 border-t border-[#E5DEC9]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Centered Bridal Bliss Editorial Header */}
        <div className="max-w-xl mx-auto text-center space-y-6">
          <span className="eyebrow block">
            El Oficio del Atelier
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825] leading-[1.16]">
            Memoria Tangible,
            <br />
            <em className="italic font-normal text-[#8C6D46]">Oficio Artesanal,</em>
            <br />
            Luz Maternal.
          </h2>

          <p className="text-base text-[#6E665E] font-light leading-relaxed">
            Cada pieza nace de la ecografía real de tu bebé, fundida a mano para preservar en casa
            la dulzura de la espera.
          </p>
        </div>

        {/* Asymmetric Two-Portrait Editorial Spread (4:5 Vertical Proportions) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          <figure className="md:col-span-6 space-y-4">
            <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
              <img
                src="/images/editorial/atelier_craft_hands.jpg"
                alt="Manos del escultor en el taller de Bogotá sosteniendo la obra Maternidad 3D"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="font-serif italic text-base text-[#6E665E]">
              01 — Oficio artesanal en Bogotá: resina pulida a mano y tacto sedoso.
            </figcaption>
          </figure>

          <figure className="md:col-span-5 md:col-start-8 md:mt-20 space-y-4">
            <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
              <img
                src="/images/editorial/nursery_warm_glow.jpg"
                alt="Escultura Maternidad 3D iluminada con luz cálida de 2700K en la habitación del bebé"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="font-serif italic text-base text-[#6E665E]">
              02 — Luz maternal de 2700K que acompaña las noches en su habitación.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
