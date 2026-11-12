import React from 'react';

interface AtmosphereMoment {
  eyebrow: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
}

const ATMOSPHERE_MOMENTS: AtmosphereMoment[] = [
  {
    eyebrow: 'Luz Natural · Alabastro Puro',
    title: 'Serenidad de museo',
    caption:
      'Bajo la luz del día, el acabado en resina alabastro revela cada trazo escultórico con la nobleza táctil de la piedra caliza.',
    image: `${import.meta.env.BASE_URL}images/editorial/detalle_edicion_esencia.jpg`,
    alt: 'Escultura Maternidad 3D en alabastro mate bajo luz natural de museo sobre base de travertino y latón',
  },
  {
    eyebrow: 'Vigilia Nocturna · 2700K',
    title: 'Calma al anochecer',
    caption:
      'Cuando cae la tarde, la luz cálida emerge desde el vientre maternal y baña la estancia con un halo apacible.',
    image: `${import.meta.env.BASE_URL}images/editorial/detalle_aura_nocturna.jpg`,
    alt: 'Escultura Maternidad 3D encendida en habitación infantil nocturna proyectando un halo dorado de 2700K bajo el plinto de travertino',
  },
  {
    eyebrow: 'Ritual de Entrega · Lino Belga',
    title: 'Resguardo de legado',
    caption:
      'Cada obra llega en estuche artesanal de lino belga con guantes de conservación, sello en lacre y placa de latón cepillado lista para grabar su nombre.',
    image: `${import.meta.env.BASE_URL}images/editorial/detalle_estuche_lino.jpg`,
    alt: 'Estuche abierto en lino belga con guantes blancos de conservación, certificado sellado en lacre, placa de latón cepillado y la escultura al lado',
  },
];

export const ExhibitionDetailsSection: React.FC = () => {
  return (
    <section
      id="detalle-autor"
      className="scroll-mt-20 deferred-section bg-[#FAF7F2] py-24 sm:py-28 lg:py-36 border-t border-[#E5DEC9]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="max-w-xl mx-auto text-center space-y-4 mb-20">
          <span className="eyebrow block">
            Atmósferas y Entrega · Pieza de Autor
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825]">
            Del atelier a la{' '}
            <em className="italic font-normal text-[#8C6D46]">intimidad de tu hogar.</em>
          </h2>
          <p className="text-base text-[#6E665E] font-light leading-relaxed">
            Tres instantes pensados para perdurar: la escultura frente a la luz natural, el santuario
            nocturno y el ritual de recibirla en familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-14">
          {ATMOSPHERE_MOMENTS.map((moment) => (
            <article key={moment.title} className="space-y-6">
              <div className="aspect-[3/4] w-full bg-[#F2ECE1] border border-[#E5DEC9] overflow-hidden">
                <img
                  src={moment.image}
                  alt={moment.alt}
                  loading="lazy"
                  decoding="async"
                  width={896}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 pt-1">
                <span className="eyebrow block">
                  {moment.eyebrow}
                </span>
                <h3 className="font-serif text-3xl text-[#2C2825] font-light">
                  {moment.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-[#6E665E] font-light leading-relaxed">
                  {moment.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
