import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '../store/useProductStore';

const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

useGLTF.preload('/models/Madre.glb', DRACO_URL);
useGLTF.preload('/models/bebe.glb', DRACO_URL);

interface SculptureSceneProps {
  revealProgress: number;
}

const SculptureMeshes: React.FC<SculptureSceneProps> = ({ revealProgress }) => {
  const madreGltf = useGLTF('/models/Madre.glb', DRACO_URL);
  const bebeGltf = useGLTF('/models/bebe.glb', DRACO_URL);

  const baseLightRef = useRef<THREE.PointLight>(null);
  const wombLightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const currentT = useRef(0);

  // Dynamic Physical Material that transitions smoothly from solid satin alabaster to optical crystal
  const madreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f2ebe1'),
      transmission: 0.0,
      opacity: 1.0,
      transparent: true,
      roughness: 0.38,
      metalness: 0.02,
      ior: 1.48,
      thickness: 1.4,
      attenuationColor: new THREE.Color('#ff9d2e'),
      attenuationDistance: 1.6,
      clearcoat: 0.15,
      clearcoatRoughness: 0.2,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, []);

  // Realistic warm skin-tone baby inside womb
  const bebeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#eab68c'),
      roughness: 0.52,
      metalness: 0.04,
      emissive: new THREE.Color('#ff8c24'),
      emissiveIntensity: 0.02,
    });
  }, []);

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

  // Smooth frame-by-frame interpolation driven by scroll progress
  useFrame((_, delta) => {
    // Lerp smoothly toward target reveal progress (0 = solid, 1 = transparent & lit)
    currentT.current = THREE.MathUtils.lerp(
      currentT.current,
      revealProgress,
      Math.min(delta * 4.5, 1)
    );
    const t = currentT.current;

    // Transition Mother Material from solid satin alabaster to crystal optical resin
    madreMaterial.transmission = THREE.MathUtils.lerp(0.0, 0.94, t);
    madreMaterial.roughness = THREE.MathUtils.lerp(0.38, 0.12, t);
    madreMaterial.clearcoat = THREE.MathUtils.lerp(0.15, 0.45, t);

    // Color subtly clarifies from warm solid stone to luminous crystal
    madreMaterial.color.lerpColors(
      new THREE.Color('#f0e7db'),
      new THREE.Color('#f8f2eb'),
      t
    );

    // Baby inside illuminates warmly as transparency increases
    bebeMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.02, 0.38, t);

    // Warm internal womb light & pedestal base glow
    if (wombLightRef.current) {
      wombLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 3.4, t);
    }
    if (baseLightRef.current) {
      baseLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 4.6, t);
    }
    if (ringRef.current) {
      ringRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.0, 2.5, t);
    }

    // Subtle cinematic scroll-driven rotation from 3/4 perspective to front view
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.25, 0.12, t);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.92, 0]}>
      {/* Mother Torso (Transitions solid -> transparent optical crystal) */}
      <primitive object={madreScene} position={[0, 0, 0]} scale={1} />

      {/* Realistic 3D Ultrasound Baby inside Womb Cavity */}
      <group position={[-0.01, 0.21, 0.11]} scale={0.285}>
        <primitive object={bebeScene} />
      </group>

      {/* Internal Womb Light that reveals the baby as you scroll */}
      <pointLight
        ref={wombLightRef}
        position={[0, 0.42, 0.14]}
        color="#ffaa44"
        intensity={0}
        distance={2.2}
        decay={1.8}
      />

      {/* Warm Base Pedestal Light */}
      <pointLight
        ref={baseLightRef}
        position={[0, 0.08, 0.12]}
        color="#ff9d2e"
        intensity={0}
        distance={3.2}
        decay={1.6}
      />

      {/* Travertine Stone Plinth */}
      <group position={[0, -0.045, 0]}>
        <mesh>
          <cylinderGeometry args={[0.52, 0.54, 0.08, 48]} />
          <meshStandardMaterial
            color="#e6dcce"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.42, 48]} />
          <meshStandardMaterial
            ref={ringRef}
            color="#ff9d2e"
            emissive="#ff9d2e"
            emissiveIntensity={0}
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
        Cargando escultura...
      </p>
    </div>
  </Html>
);

export const SculptureViewer3D: React.FC = () => {
  const { openOrderModal } = useProductStore();
  const [revealProgress, setRevealProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll listener that measures section position and computes smooth reveal progress (0 to 1)
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Transition starts when top of section enters lower 70% of viewport,
      // and completes as it reaches the upper 20%
      const start = vh * 0.72;
      const end = vh * 0.18;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      setRevealProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to pause WebGL rendering when section is completely off-screen
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
        {/* Asymmetric 2-Column Editorial Spread: Zero Chunky Buttons, 100% Scroll-Driven */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-14 items-center">
          {/* Left Column: Poetic Narrative of the Revelation */}
          <div className="lg:col-span-5 space-y-8">
            <span className="eyebrow block">
              La Revelación · Del Exterior al Vientre
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825] leading-[1.14]">
              El misterio de la vida,{' '}
              <em className="italic font-normal text-[#8C6D46]">revelado en luz.</em>
            </h2>

            <p className="text-base text-[#6E665E] font-light leading-relaxed max-w-md">
              Al avanzar en la lectura, la materia sólida se desvanece suavemente en resina
              cristalina para desvelar a tu bebé en el interior del vientre.
            </p>

            {/* Scroll-Driven Visual Progress Meter (Pure Editorial Design) */}
            <div className="space-y-3 pt-2 max-w-sm">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#6E665E]">
                <span className={revealProgress < 0.35 ? 'text-[#2C2825] font-medium' : ''}>
                  Escultura Sólida
                </span>
                <span className={revealProgress > 0.65 ? 'text-[#8C6D46] font-medium' : ''}>
                  Transparencia Maternal
                </span>
              </div>

              {/* 1px Fine Hairline Track with Moving Gold Bead */}
              <div className="relative w-full h-[1px] bg-[#E5DEC9]">
                <div
                  className="absolute top-0 left-0 h-full bg-[#8C6D46] transition-all duration-150"
                  style={{ width: `${Math.round(revealProgress * 100)}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#8C6D46] shadow-sm transition-all duration-150"
                  style={{
                    left: `calc(${Math.round(revealProgress * 100)}% - 5px)`,
                  }}
                />
              </div>

              <p className="font-serif italic text-xs text-[#8C6D46]">
                {revealProgress < 0.25
                  ? 'Desplaza ligeramente para revelar el interior...'
                  : revealProgress < 0.75
                  ? 'La resina se vuelve translúcida y enciende la luz...'
                  : 'Bebé visible en el vientre materno con luz de 2700K.'}
              </p>
            </div>

            {/* Editorial Action */}
            <div className="pt-6 border-t border-[#E5DEC9]">
              <button
                type="button"
                onClick={() => openOrderModal()}
                className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[#2C2825] hover:text-[#8C6D46] transition-colors group"
              >
                <span>Encargar tu Obra Personalizada</span>
                <span className="w-10 h-[1px] bg-[#8C6D46] group-hover:w-14 transition-all" />
                <span className="text-[#8C6D46]">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Seamless 3D Stage on Alabaster */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-square max-h-[580px] bg-[#F2ECE1]/50 border border-[#E5DEC9] overflow-hidden flex items-center justify-center">
              {/* Subtle Natural Daylight Gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(250, 247, 242, 0.95) 0%, rgba(242, 236, 225, 0.65) 70%, rgba(229, 222, 201, 0.35) 100%)',
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
                {/* Luminous Natural Daylight Studio Lighting */}
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
                  <SculptureMeshes revealProgress={revealProgress} />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  minDistance={1.6}
                  maxDistance={3.2}
                  minPolarAngle={Math.PI / 4.8}
                  maxPolarAngle={Math.PI / 1.85}
                  autoRotate={false}
                  target={[0, -0.05, 0]}
                />
              </Canvas>

              {/* Discreet Editorial Prompt */}
              <span className="absolute bottom-4 right-5 font-serif italic text-xs text-[#6E665E] pointer-events-none">
                Gira suavemente con el cursor
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
