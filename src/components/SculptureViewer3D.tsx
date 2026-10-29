import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '../store/useProductStore';
import { FINISH_OPTIONS } from '../data/products';
import { FinishId } from '../types/product';
import { Sparkles } from 'lucide-react';

const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

useGLTF.preload('/models/Madre.glb', DRACO_URL);
useGLTF.preload('/models/bebe.glb', DRACO_URL);

interface SculptureSceneProps {
  isLedOn: boolean;
  activeFinish: FinishId;
}

const SculptureMeshes: React.FC<SculptureSceneProps> = ({
  isLedOn,
  activeFinish,
}) => {
  const madreGltf = useGLTF('/models/Madre.glb', DRACO_URL);
  const bebeGltf = useGLTF('/models/bebe.glb', DRACO_URL);

  const baseLightRef = useRef<THREE.PointLight>(null);
  const wombLightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.MeshStandardMaterial>(null);

  // Luminous daylight editorial materials that blend with alabaster and travertine
  const madreMaterial = useMemo(() => {
    if (activeFinish === 'frosted') {
      // Frosted Silk (Esmerilado Seda)
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f4ece1'),
        transmission: 0.92,
        opacity: 1,
        transparent: true,
        roughness: 0.22,
        metalness: 0.0,
        ior: 1.48,
        thickness: 1.4,
        attenuationColor: new THREE.Color(isLedOn ? '#ff9d2e' : '#f5e4cf'),
        attenuationDistance: isLedOn ? 1.4 : 2.2,
        clearcoat: 0.25,
        clearcoatRoughness: 0.2,
        side: THREE.FrontSide,
        depthWrite: false,
      });
    }

    if (activeFinish === 'bronze') {
      // Sculptural Patinated Bronze
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8C6D46'),
        roughness: 0.38,
        metalness: 0.45,
      });
    }

    // Default: Smoked Champagne Optical Crystal (Cristal Ahumado Cálido)
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e2d3bf'),
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.14,
      metalness: 0.05,
      ior: 1.5,
      thickness: 1.2,
      attenuationColor: new THREE.Color(isLedOn ? '#ff9d2e' : '#dcb98a'),
      attenuationDistance: isLedOn ? 1.5 : 2.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.15,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, [activeFinish, isLedOn]);

  const bebeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#eab68c'),
      roughness: 0.5,
      metalness: 0.05,
      emissive: new THREE.Color('#ff8c24'),
      emissiveIntensity: isLedOn ? 0.35 : 0.04,
    });
  }, [isLedOn]);

  const madreScene = useMemo(() => {
    const cloned = madreGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = madreMaterial;
        mesh.renderOrder = 2;
      }
    });
    return cloned;
  }, [madreGltf.scene, madreMaterial]);

  const bebeScene = useMemo(() => {
    const cloned = bebeGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = bebeMaterial;
        mesh.renderOrder = 1;
      }
    });
    return cloned;
  }, [bebeGltf.scene, bebeMaterial]);

  useFrame((_, delta) => {
    const step = Math.min(delta * 5, 1);
    if (baseLightRef.current) {
      baseLightRef.current.intensity = THREE.MathUtils.lerp(
        baseLightRef.current.intensity,
        isLedOn ? 4.8 : 0.0,
        step
      );
    }
    if (wombLightRef.current) {
      wombLightRef.current.intensity = THREE.MathUtils.lerp(
        wombLightRef.current.intensity,
        isLedOn ? 3.0 : 0.1,
        step
      );
    }
    if (ringRef.current) {
      ringRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        ringRef.current.emissiveIntensity,
        isLedOn ? 2.5 : 0.0,
        step
      );
    }
  });

  return (
    <group position={[0, -0.92, 0]}>
      {/* Translucent Mother Torso */}
      <primitive object={madreScene} position={[0, 0, 0]} scale={1} />

      {/* Realistic 3D Ultrasound Baby inside Womb */}
      <group position={[-0.01, 0.21, 0.11]} scale={0.285}>
        <primitive object={bebeScene} />
      </group>

      {/* Warm 2700K Base Light */}
      <pointLight
        ref={baseLightRef}
        position={[0, 0.08, 0.12]}
        color="#ff9d2e"
        intensity={isLedOn ? 4.8 : 0}
        distance={3.2}
        decay={1.6}
      />

      {/* Womb Internal Amber Glow */}
      <pointLight
        ref={wombLightRef}
        position={[0, 0.42, 0.14]}
        color="#ffaa44"
        intensity={isLedOn ? 3.0 : 0.1}
        distance={2.0}
        decay={1.8}
      />

      {/* Travertine Stone Pedestal (Matching the Editorial Photos) */}
      <group position={[0, -0.045, 0]}>
        {/* Main Travertine Plinth */}
        <mesh>
          <cylinderGeometry args={[0.52, 0.54, 0.08, 48]} />
          <meshStandardMaterial
            color="#e6dcce"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Recessed Warm LED Ring */}
        <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.42, 48]} />
          <meshStandardMaterial
            ref={ringRef}
            color={isLedOn ? '#ff9d2e' : '#d5c7b3'}
            emissive="#ff9d2e"
            emissiveIntensity={isLedOn ? 2.5 : 0}
            roughness={0.3}
          />
        </mesh>

        {/* Soft Ground Shadow on Alabaster Floor */}
        <mesh position={[0, -0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 48]} />
          <meshBasicMaterial
            color="#c9bcab"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

const LoaderOverlay: React.FC = () => (
  <Html center>
    <div className="px-5 py-2.5 bg-[#FAF7F2] border border-[#E5DEC9] text-center shadow-sm">
      <p className="font-serif italic text-sm text-[#8C6D46]">
        Cargando escultura en luz natural...
      </p>
    </div>
  </Html>
);

export const SculptureViewer3D: React.FC = () => {
  const { isLedOn, toggleLed, activeFinish, setFinish, openOrderModal } = useProductStore();
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visor-3d"
      className="bg-[#FAF7F2] py-28 lg:py-36 border-t border-[#E5DEC9]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Asymmetric 2-Column Editorial Spread: Context on Left, Seamless 3D on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-14 items-center">
          {/* Left Column: Clear Narrative Context */}
          <div className="lg:col-span-5 space-y-8">
            <span className="eyebrow block">
              Perspectiva Tridimensional · 360°
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825] leading-[1.14]">
              Aprecia cada relieve antes de{' '}
              <em className="italic font-normal text-[#8C6D46]">fundir tu obra.</em>
            </h2>

            <p className="text-base text-[#6E665E] font-light leading-relaxed">
              Gira la pieza libremente para contemplar cómo la resina satinada protege las
              facciones reales de tu bebé.
            </p>

            {/* Material Finish Selectors */}
            <div className="space-y-3 pt-2">
              <span className="eyebrow block text-[10px]">
                Seleccionar Material de Muestra
              </span>
              <div className="flex flex-wrap gap-4">
                {FINISH_OPTIONS.map((finish) => {
                  const isSelected = finish.id === activeFinish;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setFinish(finish.id)}
                      className={`inline-flex items-center gap-2.5 px-4 py-2 text-xs transition-colors border ${
                        isSelected
                          ? 'border-[#8C6D46] bg-[#F2ECE1] text-[#2C2825]'
                          : 'border-[#E5DEC9] bg-[#FAF7F2] text-[#6E665E] hover:border-[#8C6D46]/60'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#2C2825]/20"
                        style={{ backgroundColor: finish.swatchColor }}
                      />
                      <span className="font-serif text-sm tracking-wide">
                        {finish.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2700K Warm Light Switch */}
            <div className="pt-2">
              <button
                type="button"
                onClick={toggleLed}
                className={`inline-flex items-center gap-3 px-5 py-2.5 border text-xs tracking-wide transition-colors ${
                  isLedOn
                    ? 'border-[#8C6D46] bg-[#F2ECE1] text-[#2C2825]'
                    : 'border-[#E5DEC9] bg-[#FAF7F2] text-[#6E665E] hover:border-[#8C6D46]/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
                <span>
                  {isLedOn ? 'Luz de Base 2700K: Encendida' : 'Simular Luz de Base 2700K'}
                </span>
              </button>
            </div>

            {/* CTA Link */}
            <div className="pt-4 border-t border-[#E5DEC9]">
              <button
                type="button"
                onClick={() => openOrderModal()}
                className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[#2C2825] hover:text-[#8C6D46] transition-colors group"
              >
                <span>Encargar con esta configuración</span>
                <span className="w-10 h-[1px] bg-[#8C6D46] group-hover:w-14 transition-all" />
                <span className="text-[#8C6D46]">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Seamless 3D Stage on Alabaster (No Dark Box!) */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-square max-h-[580px] bg-[#F2ECE1]/60 border border-[#E5DEC9] overflow-hidden flex items-center justify-center">
              {/* Subtle Natural Daylight Backdrop */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(250, 247, 242, 0.95) 0%, rgba(242, 236, 225, 0.7) 70%, rgba(229, 222, 201, 0.4) 100%)',
                }}
              />

              {/* Three.js Canvas */}
              <Canvas
                frameloop={isInView ? 'always' : 'never'}
                dpr={1}
                camera={{ position: [0, 0.15, 2.55], fov: 38 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.15,
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                {/* Luminous Natural Daylight Studio Setup */}
                <ambientLight intensity={1.35} color="#fffcf7" />
                <directionalLight
                  position={[2.5, 3.8, 2.8]}
                  intensity={2.2}
                  color="#fffdf8"
                />
                <directionalLight
                  position={[-2.8, 2.2, -2.0]}
                  intensity={1.2}
                  color="#fef5e7"
                />
                <directionalLight
                  position={[0, 2.0, -3.0]}
                  intensity={1.0}
                  color="#f5eadd"
                />

                <Suspense fallback={<LoaderOverlay />}>
                  <SculptureMeshes isLedOn={isLedOn} activeFinish={activeFinish} />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  minDistance={1.6}
                  maxDistance={3.2}
                  minPolarAngle={Math.PI / 4.8}
                  maxPolarAngle={Math.PI / 1.85}
                  autoRotate={isInView}
                  autoRotateSpeed={0.75}
                  target={[0, -0.05, 0]}
                />
              </Canvas>

              {/* Discreet Editorial Prompt at Bottom Right */}
              <span className="absolute bottom-4 right-5 font-serif italic text-xs text-[#6E665E] pointer-events-none">
                Gira suavemente con el cursor · 360°
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
