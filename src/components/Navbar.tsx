import React from 'react';
import { useProductStore } from '../store/useProductStore';

export const Navbar: React.FC = () => {
  const { openOrderModal } = useProductStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#120E0C]/85 md:bg-[#120E0C]/80 md:backdrop-blur-md border-b border-[#D4B07B]/20 text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 h-20 flex items-center justify-between gap-4">
        {/* Left: Serif Wordmark */}
        <a
          href="#"
          className="font-serif text-lg sm:text-2xl tracking-[0.16em] sm:tracking-[0.18em] text-[#FAF7F2] font-normal whitespace-nowrap"
        >
          MATERNIDAD 3D
        </a>

        {/* Center: Clean Editorial Links */}
        <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] text-[#C8BFB5]">
          <a href="#visor-3d" className="hover:text-[#D4B07B] transition-colors whitespace-nowrap">
            Estudio 3D
          </a>
          <a href="#el-atelier" className="hover:text-[#D4B07B] transition-colors whitespace-nowrap">
            El Atelier
          </a>
          <a href="#catalogo-tiers" className="hover:text-[#D4B07B] transition-colors whitespace-nowrap">
            Colección
          </a>
          <a href="#proceso" className="hover:text-[#D4B07B] transition-colors whitespace-nowrap">
            Cómo Funciona
          </a>
        </nav>

        {/* Right: Metallic Champagne Hairline Action */}
        <button
          type="button"
          onClick={() => openOrderModal()}
          className="px-3.5 sm:px-5 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#F5E6CE] border border-[#D4B07B]/55 hover:bg-[#D4B07B] hover:text-[#120E0C] transition-colors whitespace-nowrap"
        >
          Encargar Obra
        </button>
      </div>
    </header>
  );
};
