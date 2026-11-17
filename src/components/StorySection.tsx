import React, { useState } from 'react';

interface CraftMaterialSpec {
  image: string;
  alt: string;
  title: string;
  caption: string;
}

const CRAFT_MATERIAL_SPECS: CraftMaterialSpec[] = [
  {
    image: `${import.meta.env.BASE_URL}images/editorial/atelier_craft_hands.jpg`,
    alt: 'Manos del escultor en el taller de Bogotá sosteniendo la obra Maternidad 3D',
    title: 'Hecho a mano en Bogotá',
    caption: 'Resina óptica pulida al paño con acabado satinado.',
  },
  {
    image: `${import.meta.env.BASE_URL}images/editorial/nursery_warm_glow.jpg`,
    alt: 'Escultura Maternidad 3D iluminada con luz cálida de 2700K en la habitación del bebé',
    title: 'Luz cálida 2700K',
    caption: 'Destello tenue y cálido para las noches junto a la cuna.',
  },
  {
    image: `${import.meta.env.BASE_URL}images/editorial/macro_travertino_luz.jpg`,
    alt: 'Detalle arquitectónico de la base en piedra travertino romano con zócalo de latón',
    title: 'Travertino romano',
    caption: 'Piedra natural con zócalo en latón cepillado.',
  },
];

const UltrasoundComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div id="comparador-eco" className="scroll-mt-24 mt-10 sm:mt-14 space-y-5">
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#1B1714] border border-[#E5DEC9] overflow-hidden select-none shadow-sm">
        <img
          src={`${import.meta.env.BASE_URL}images/editorial/macro_escultura_detalle.jpg`}
          alt="Detalle macro de la escultura Maternidad 3D con el bebé esculpido"
          loading="lazy"
          decoding="async"
          width={1280}
          height={720}
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-[#1B1714]/88 backdrop-blur-sm border border-[#D4B07B]/50 px-2.5 py-1 sm:px-3.5 sm:py-1.5 pointer-events-none">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#D4B07B] font-medium block">
            Escultura 1:1
          </span>
        </div>

        <div
          aria-hidden="true"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          className="absolute inset-0 pointer-events-none"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/editorial/proceso_2_ecografia_3d.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#FAF7F2]/95 border border-[#E5DEC9] px-2.5 py-1 sm:px-3.5 sm:py-1.5">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#2C2825] font-medium block">
              Ecografía 3D
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{ left: `${sliderPos}%` }}
          className="pointer-events-none absolute inset-y-0 -translate-x-1/2 z-10 flex items-center justify-center"
        >
          <div className="w-[2px] h-full bg-[#D4B07B] shadow-[0_0_12px_rgba(212,176,123,0.85)]" />
          <span className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2C2825] text-[#D4B07B] border-2 border-[#D4B07B] shadow-md flex items-center justify-center text-xs font-medium">
            ↔
          </span>
        </div>

        <input
          type="range"
          min={10}
          max={90}
          value={sliderPos}
          aria-label="Comparar ecografía 3D original y escultura tallada"
          onChange={(e) => setSliderPos(Number(e.target.value))}
          style={{ touchAction: 'pan-y' }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0"
        />
      </div>

      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => setSliderPos(85)}
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] border transition-colors ${
              sliderPos >= 70
                ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                : 'bg-[#FAF7F2] text-[#6E665E] border-[#E5DEC9] hover:border-[#8C6D46] hover:text-[#2C2825]'
            }`}
          >
            Ver Ecografía 3D
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] border transition-colors ${
              sliderPos > 30 && sliderPos < 70
                ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                : 'bg-[#FAF7F2] text-[#6E665E] border-[#E5DEC9] hover:border-[#8C6D46] hover:text-[#2C2825]'
            }`}
          >
            Comparar 50 / 50
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(15)}
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] border transition-colors ${
              sliderPos <= 30
                ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                : 'bg-[#FAF7F2] text-[#6E665E] border-[#E5DEC9] hover:border-[#8C6D46] hover:text-[#2C2825]'
            }`}
          >
            Ver Escultura Real
          </button>
        </div>
      </div>
    </div>
  );
};

export const StorySection: React.FC = () => {
  return (
    <section
      id="el-atelier"
      className="scroll-mt-20 deferred-section bg-[#F2ECE1] py-20 sm:py-28 border-t border-[#E5DEC9]"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-14">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="eyebrow block">El Atelier</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825] leading-[1.15]">
            De su ecografía 3D{' '}
            <em className="italic font-normal text-[#8C6D46]">al tacto real.</em>
          </h2>
        </div>

        <UltrasoundComparisonSlider />

        <div className="mt-16 sm:mt-20 pt-14 border-t border-[#E5DEC9] grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {CRAFT_MATERIAL_SPECS.map((item) => (
            <figure key={item.title} className="space-y-4">
              <div className="aspect-[4/5] w-full bg-[#FAF7F2] border border-[#E5DEC9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  width={896}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="space-y-1">
                <h3 className="font-serif text-2xl text-[#2C2825] font-light">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6E665E] font-light">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
