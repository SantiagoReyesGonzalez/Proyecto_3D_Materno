import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SculptureViewer3D } from './components/SculptureViewer3D';
import { StorySection } from './components/StorySection';
import { ProductPricingSection } from './components/ProductPricingSection';
import { Footer } from './components/Footer';
import { PRODUCT_TIERS, formatCOP } from './data/products';
import { useProductStore } from './store/useProductStore';

const OrderUploaderModal = lazy(() =>
  import('./components/OrderUploaderModal').then((mod) => ({ default: mod.OrderUploaderModal }))
);

const MobileStickyCtaBar: React.FC = () => {
  const { selectedTier, isOrderModalOpen, getEffectivePrice, openOrderModal } = useProductStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncScroll = () => {
      setVisible(window.scrollY > 520);
    };
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncScroll);
  }, []);

  if (!visible || isOrderModalOpen) return null;

  const activeTier = PRODUCT_TIERS.find((t) => t.id === selectedTier) || PRODUCT_TIERS[1];
  const halfPrice = Math.round(getEffectivePrice() / 2);

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#1B1714]/95 backdrop-blur-md border-t border-[#3D352E] px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-[11px] font-serif text-[#FAF7F2] block truncate">
          {activeTier.name}
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#D4B07B] block truncate">
          Reserva 50%: {formatCOP(halfPrice)} COP
        </span>
      </div>
      <button
        type="button"
        onClick={() => openOrderModal()}
        className="bg-[#D4B07B] text-[#1B1714] px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium shrink-0 hover:bg-[#E2C290] transition-colors whitespace-nowrap"
      >
        Encargar →
      </button>
    </div>
  );
};

export function App() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2825] flex flex-col selection:bg-[#8C6D46]/20 selection:text-[#2C2825] pb-16 sm:pb-0">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SculptureViewer3D />
        <StorySection />
        <ProductPricingSection />
        <Suspense fallback={null}>
          <OrderUploaderModal />
        </Suspense>
      </main>
      <Footer />
      <MobileStickyCtaBar />
    </div>
  );
}

export default App;
