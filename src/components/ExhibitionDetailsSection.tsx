import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

interface AtmosphereMoment {
  eyebrow: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
}

interface FamilyStory {
  quote: string;
  author: string;
  edition: string;
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

const FAMILY_TESTIMONIALS: FamilyStory[] = [
  {
    quote:
      '“Cuando apagamos la luz del cuarto y encendimos la escultura por primera vez, reconocimos la naricita exacta de la ecografía de la semana 29. Hoy la encendemos cada noche mientras lacto.”',
    author: 'Valentina & Mateo · Bogotá',
    edition: 'Edición II. Luz de Vida',
  },
  {
    quote:
      '“Hicimos vaca entre 6 amigas de $61.500 cada una. En el Baby Shower destaparon el estuche de lino con el sello en lacre y no hubo nadie que no llorara de emoción.”',
    author: 'Camila, Laura y 4 amigas · Medellín',
    edition: 'Regalo Vaca Baby Shower',
  },
  {
    quote:
      '“Aprobar el modelado 3D por WhatsApp antes de que la fundieran me dio tranquilidad total. Ver mi propia silueta abrazando a nuestro hijo en la placa grabada no tiene precio.”',
    author: 'Andrés & Mariana · Chía',
    edition: 'Edición III. Maternidad Total',
  },
];

export const ExhibitionDetailsSection: React.FC = () => {
  const { openOrderModal } = useProductStore();

  return (
    <section
      id="detalle-autor"
      className="scroll-mt-20 deferred-section bg-[#161311] text-[#FAF7F2] py-20 sm:py-28 lg:py-36 border-t border-[#2E2722]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
        {/* Evening Sanctuary Header */}
        <div className="max-w-xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <span className="eyebrow block !text-[#D4B07B]">
            Santuario Nocturno 2700K · Pieza de Autor
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#FAF7F2]">
            Del atelier a la{' '}
            <em className="italic font-normal text-[#D4B07B]">intimidad de tu hogar.</em>
          </h2>
          <p className="text-sm sm:text-base text-[#D6CEC4] font-light leading-relaxed">
            Tres instantes pensados para perdurar: la escultura frente a la luz natural, la calidez
            nocturna a 2700K y el ritual de recibirla en familia.
          </p>
        </div>

        {/* 3 Atmosphere Portrait Cards on Dark Sanctuary Stone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {ATMOSPHERE_MOMENTS.map((moment) => (
            <article key={moment.title} className="space-y-5">
              <div className="aspect-[3/4] w-full bg-[#211C18] border border-[#322A24] overflow-hidden">
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
                <span className="eyebrow block !text-[#D4B07B]">
                  {moment.eyebrow}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light">
                  {moment.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-[#C8BFB5] font-light leading-relaxed">
                  {moment.caption}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* 1. Zero-Risk Sculptural Fidelity Guarantee Seal */}
        <div className="mt-16 sm:mt-20 border border-[#D4B07B]/40 bg-[#211C18] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-11 h-11 shrink-0 border border-[#D4B07B]/50 bg-[#161311] flex items-center justify-center text-[#D4B07B]">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <span className="eyebrow block !text-[#D4B07B]">
                Garantía de Fidelidad Escultórica · Riesgo Cero
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">
                100% Garantía de Aprobación Previa
              </h3>
              <p className="text-sm sm:text-[15px] text-[#D6CEC4] font-light leading-relaxed">
                Antes de fundir tu escultura en resina, nuestros escultores en Bogotá te envían por
                WhatsApp la vista previa 3D modelada desde tu ecografía. Solo abonas el 50% restante
                cuando estés completamente enamorada del resultado.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openOrderModal(undefined, 'split_50_50')}
            className="shrink-0 bg-[#D4B07B] text-[#161311] hover:bg-[#E2C290] px-6 py-4 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors whitespace-nowrap"
          >
            Reservar sin riesgo →
          </button>
        </div>

        {/* 2. Real Family Stories (Editorial Testimonials) */}
        <div className="mt-16 sm:mt-20 pt-14 border-t border-[#2E2722]">
          <div className="max-w-lg mb-10 space-y-2">
            <span className="eyebrow block !text-[#D4B07B]">
              Testimonios de Familias · Colombia
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">
              Obras que ya iluminan <em className="italic text-[#D4B07B]">hogares reales.</em>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {FAMILY_TESTIMONIALS.map((story) => (
              <blockquote
                key={story.author}
                className="bg-[#1E1A16] border border-[#2E2722] p-6 sm:p-7 flex flex-col justify-between space-y-6"
              >
                <p className="font-serif italic text-lg text-[#FAF7F2] font-light leading-relaxed">
                  {story.quote}
                </p>
                <footer className="pt-4 border-t border-[#2E2722] space-y-1">
                  <cite className="not-italic block text-xs uppercase tracking-[0.16em] text-[#D4B07B] font-medium">
                    {story.author}
                  </cite>
                  <span className="block text-[11px] text-[#A89E93] font-light">
                    {story.edition}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
