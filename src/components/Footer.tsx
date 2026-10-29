import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E5DEC9] py-20 text-xs text-[#6E665E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <span className="font-serif text-xl tracking-[0.18em] text-[#2C2825] block">
            MATERNIDAD 3D
          </span>
          <span className="font-serif italic text-sm text-[#6E665E] block mt-1">
            Atelier de Escultura Prenatal · Bogotá, Colombia
          </span>
        </div>

        <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.22em] text-[#6E665E]">
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
        </div>

        <p className="text-[11px] text-[#6E665E]">
          © 2026 Maternidad 3D · Hecho a mano en Bogotá.
        </p>
      </div>
    </footer>
  );
};
