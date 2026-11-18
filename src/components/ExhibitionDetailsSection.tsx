import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

interface AtmosphereMoment {
  title: string;
  caption: string;
  image: string;
  alt: string;
}

interface FamilyStory {
  quote: string;
  author: string;
}

const ATMOSPHERE_MOMENTS: AtmosphereMoment[] = [
  {
    title: 'Serenidad de museo',
    caption: 'Acabado en alabastro mate bajo la luz del día.',
    image: `${import.meta.env.BASE_URL}images/editorial/detalle_edicion_esencia.jpg`,
    alt: 'Escultura Maternidad 3D en alabastro mate bajo luz natural',
  },
  {
    title: 'Calma al anochecer',
    caption: 'Luz cálida de 2700K emergiendo desde el vientre.',
    image: `${import.meta.env.BASE_URL}images/editorial/detalle_aura_nocturna.jpg`,
    alt: 'Escultura Maternidad 3D encendida con halo dorado de 2700K',
  },
  {
    title: 'Ritual en lino belga',
    caption: 'Estuche artesanal con guantes, lacre y placa grabada.',
    image: `${import.meta.env.BASE_URL}images/editorial/detalle_estuche_lino.jpg`,
    alt: 'Estuche abierto en lino belga con guantes, sello en lacre y placa de latón',
  },
];

const FAMILY_TESTIMONIALS: FamilyStory[] = [
  {
    quote: '“Reconocimos la naricita exacta de su ecografía de la semana 29.”',
    author: 'Valentina & Mateo · Bogotá',
  },
  {
    quote: '“Hicimos vaca entre 6 amigas; fue el regalo que hizo llorar a todos.”',
    author: 'Camila & amigas · Medellín',
  },
  {
    quote: '“Aprobar el modelado 3D antes de fundirla nos dio tranquilidad total.”',
    author: 'Andrés & Mariana · Chía',
  },
];

export const ExhibitionDetailsSection: React.FC = () => {
  const { openOrderModal } = useProductStore();

  return (
    <section
      id="detalle-autor"
      className="scroll-mt-20 deferred-section bg-[#161311] text-[#FAF7F2] py-20 sm:py-28 border-t border-[#2E2722]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
          <span className="eyebrow block !text-[#D4B07B]">Santuario 2700K</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#FAF7F2]">
            Hecha para <em className="italic font-normal text-[#D4B07B]">perdurar.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {ATMOSPHERE_MOMENTS.map((moment) => (
            <article key={moment.title} className="space-y-4">
              <div className="aspect-[3/4] w-full bg-[#211C18] border border-[#322A24] overflow-hidden">
                <img
                  src={moment.image}
                  alt={moment.alt}
                  loading="eager"
                  decoding="async"
                  width={896}
                  height={1200}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light">
                  {moment.title}
                </h3>
                <p className="text-sm text-[#C8BFB5] font-light">
                  {moment.caption}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Compact One-Line Zero-Risk Guarantee Bar */}
        <div className="mt-14 border border-[#D4B07B]/40 bg-[#211C18] px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[#FAF7F2] font-light">
            <ShieldCheck className="w-5 h-5 text-[#D4B07B] shrink-0" aria-hidden="true" />
            <span>
              ✓ Garantía 100%: apruebas el render 3D por WhatsApp antes de fundir tu obra
            </span>
          </div>

          <button
            type="button"
            onClick={() => openOrderModal(undefined, 'split_50_50')}
            className="shrink-0 bg-[#D4B07B] text-[#161311] hover:bg-[#E2C290] px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors whitespace-nowrap"
          >
            Reservar →
          </button>
        </div>

        {/* Concise Family Quotes */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FAMILY_TESTIMONIALS.map((story) => (
            <blockquote
              key={story.author}
              className="bg-[#1E1A16] border border-[#2E2722] p-6 flex flex-col justify-between space-y-4"
            >
              <p className="font-serif italic text-lg text-[#FAF7F2] font-light leading-relaxed">
                {story.quote}
              </p>
              <footer className="text-[11px] uppercase tracking-[0.16em] text-[#D4B07B]">
                {story.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};
