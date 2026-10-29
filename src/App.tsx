import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { SculptureViewer3D } from './components/SculptureViewer3D';
import { ProductPricingSection } from './components/ProductPricingSection';
import { OrderUploaderModal } from './components/OrderUploaderModal';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2825] flex flex-col selection:bg-[#8C6D46]/20 selection:text-[#2C2825]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StorySection />
        <SculptureViewer3D />
        <ProductPricingSection />
        <OrderUploaderModal />
      </main>
      <Footer />
    </div>
  );
}

export default App;
