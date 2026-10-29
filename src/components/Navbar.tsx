import React from 'react';
import { useProductStore } from '../store/useProductStore';

export const Navbar: React.FC = () => {
  const { openOrderModal } = useProductStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
        {/* Left: Serif Wordmark */}
        <a
          href="#"
          className="font-serif text-xl sm:text-2xl tracking-[0.18em] text-[#2C2825] font-normal"
        >
          MATERNIDAD 3D
        </a>

        {/* Center: Clean Editorial Links */}
        <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] text-[#6E665E]">
          <a href="#el-atelier" className="hover:text-[#2C2825] transition-colors">
            El Atelier
          </a>
          <a href="#visor-3d" className="hover:text-[#2C2825] transition-colors">
            Estudio 3D
          </a>
          <a href="#catalogo-tiers" className="hover:text-[#2C2825] transition-colors">
            Colección
          </a>
          <a href="#proceso" className="hover:text-[#2C2825] transition-colors">
            Proceso
          </a>
        </nav>

        {/* Right: 1px Fine Line Button */}
        <button
          type="button"
          onClick={() => openOrderModal()}
          className="px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#2C2825] border border-[#2C2825] hover:bg-[#2C2825] hover:text-[#FAF7F2] transition-colors"
        >
          Encargar Obra
        </button>
      </div>
    </header>
  );
};
