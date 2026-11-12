import React from 'react';

export const StorySection: React.FC = () => {
  return (
    <section id="el-atelier" className="scroll-mt-20 bg-[#F2ECE1] py-24 sm:py-28 lg:py-36 border-t border-[#E5DEC9]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Centered Bridal Bliss Editorial Header */}
        <div className="max-w-xl mx-auto text-center space-y-6">
          <span className="eyebrow block">
            El Oficio del Atelier
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825] leading-[1.16]">
            Fraternidad Tangible,
            <br />
            <em className="italic font-normal text-[#8C6D46]">Oficio Artesanal,</em>
            <br />
            Luz Maternal.
          </h2>

          <p className="text-base text-[#6E665E] font-light leading-relaxed">
            Cada pieza nace de la ecografía real de tu bebé, fundida a mano en Bogotá para
            resguardar el vínculo de familia desde la dulce espera.
          </p>
        </div>

        {/* Panoramic Fraternity Portrait (16:9 Quiet-Luxury Story Anchor) */}
        <figure className="mt-16 sm:mt-20 space-y-4">
          <div className="aspect-[16/9] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}images/editorial/family_fraternity_embrace.jpg`}
              alt="Pareja abrazando con ternura la dulce espera frente a la escultura Maternidad 3D iluminada sobre consola de travertino"
              loading="lazy"
              decoding="async"
              width={1280}
              height={714}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <figcaption className="font-serif italic text-base text-[#6E665E] text-right">
            01 — La espera compartida: manos que acompañan una historia que comienza en casa.
          </figcaption>
        </figure>

        {/* Asymmetric Two-Portrait Editorial Spread (Preserving Original Hero Alabaster & Craft Hands) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          <figure className="md:col-span-6 space-y-4">
            <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/editorial/atelier_craft_hands.jpg`}
                alt="Manos del escultor en el taller de Bogotá sosteniendo la obra Maternidad 3D"
                loading="lazy"
                decoding="async"
                width={896}
                height={1200}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="font-serif italic text-base text-[#6E665E]">
              02 — Oficio artesanal en Bogotá: resina pulida a mano y tacto sedoso.
            </figcaption>
          </figure>

          <figure className="md:col-span-5 md:col-start-8 md:mt-20 space-y-4">
            <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/editorial/hero_editorial_alabaster.jpg`}
                alt="Escultura Maternidad 3D en resina óptica alabastro sobre piedra travertino con luz cálida"
                loading="lazy"
                decoding="async"
                width={896}
                height={1200}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="font-serif italic text-base text-[#6E665E]">
              03 — Silueta en alabastro satinado con vientre translúcido sobre piedra natural.
            </figcaption>
          </figure>
        </div>

        {/* Enfoque 4: Macro Details & Warm Sanctuary Glow Triptych */}
        <div className="mt-24 pt-16 border-t border-[#E5DEC9]">
          <div className="max-w-lg mb-12 space-y-2">
            <span className="eyebrow block">
              Detalles del Oficio · Materia y Luz
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2825]">
              Cada veta de piedra y <em className="italic text-[#8C6D46]">cada destello interior.</em>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            <figure className="space-y-4">
              <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/nursery_warm_glow.jpg`}
                  alt="Escultura Maternidad 3D iluminada con luz cálida de 2700K en la habitación del bebé"
                  loading="lazy"
                  decoding="async"
                  width={896}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="font-serif italic text-base text-[#6E665E]">
                04 — Luz maternal de 2700K que acompaña las noches en su habitación.
              </figcaption>
            </figure>

            <figure className="space-y-4">
              <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/macro_escultura_detalle.jpg`}
                  alt="Detalle macro de las manos del escultor puliendo el vientre translúcido en resina alabastro con el bebé en su interior"
                  loading="lazy"
                  decoding="async"
                  width={896}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="font-serif italic text-base text-[#6E665E]">
                05 — Acabado satinado al paño: transparencia calibrada sobre el vientre iluminado.
              </figcaption>
            </figure>

            <figure className="space-y-4">
              <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/macro_travertino_luz.jpg`}
                  alt="Detalle arquitectónico de la base en piedra travertino romano poroso con zócalo de latón cepillado y halo dorado"
                  loading="lazy"
                  decoding="async"
                  width={896}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="font-serif italic text-base text-[#6E665E]">
                06 — Basamento en travertino romano con zócalo en latón cepillado y halo de 2700K.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
