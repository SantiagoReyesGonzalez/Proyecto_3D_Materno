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

  // Optical physical material: transitions from solid satin alabaster to razor-sharp optical crystal
  const madreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#eee4d5'),
      transmission: 0.0,
      opacity: 1.0,
      transparent: true,
      roughness: 0.35,
      metalness: 0.02,
      ior: 1.46,
      thickness: 0.22,
      attenuationColor: new THREE.Color('#fdf5ea'),
      attenuationDistance: 3.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, []);

  // Anatomically defined baby material
  const bebeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e8c1a2'),
      roughness: 0.58,
      metalness: 0.02,
      emissive: new THREE.Color('#e08a46'),
      emissiveIntensity: 0.05,
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

  useFrame((_, delta) => {
    currentT.current = THREE.MathUtils.lerp(
      currentT.current,
      revealProgress,
      Math.min(delta * 5.0, 1)
    );
    const t = currentT.current;

    madreMaterial.transmission = THREE.MathUtils.lerp(0.0, 0.98, t);
    madreMaterial.roughness = THREE.MathUtils.lerp(0.35, 0.02, t);
    madreMaterial.clearcoat = THREE.MathUtils.lerp(0.25, 0.95, t);

    madreMaterial.color.lerpColors(
      new THREE.Color('#eee4d5'),
      new THREE.Color('#faf5ee'),
      t
    );

    bebeMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.05, 0.28, t);

    if (baseLightRef.current) {
      baseLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 3.6, t);
    }
    if (wombLightRef.current) {
      wombLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 1.8, t);
    }
    if (ringRef.current) {
      ringRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.0, 2.4, t);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.25, 0.08, t);
    }
  });

  return (
    // Centered vertically so the mother's entire head, hair, belly and travertine base are 100% visible
    <group ref={groupRef} position={[0, -0.92, 0]}>
      {/* Mother Torso */}
      <primitive object={madreScene} position={[0, 0, 0]} scale={1} />

      {/* Realistic 3D Ultrasound Baby inside Womb */}
      <group position={[-0.01, 0.21, 0.115]} scale={0.29}>
        <primitive object={bebeScene} />
      </group>

      {/* Internal Womb Light */}
      <pointLight
        ref={wombLightRef}
        position={[0, 0.44, 0.2]}
        color="#ffe3c2"
        intensity={0}
        distance={1.6}
        decay={2.0}
      />

      {/* Warm Base Pedestal Light (2700K) */}
      <pointLight
        ref={baseLightRef}
        position={[0, 0.08, 0.12]}
        color="#ff9d2e"
        intensity={0}
        distance={3.0}
        decay={1.6}
      />

      {/* Natural Travertine Stone Plinth */}
      <group position={[0, -0.045, 0]}>
        <mesh>
          <cylinderGeometry args={[0.54, 0.56, 0.08, 48]} />
          <meshStandardMaterial
            color="#e6dcce"
            roughness={0.88}
            metalness={0.04}
          />
        </mesh>

        <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.43, 48]} />
          <meshStandardMaterial
            ref={ringRef}
            color="#ff9d2e"
            emissive="#ff9d2e"
            emissiveIntensity={0}
            roughness={0.3}
          />
        </mesh>

        {/* Soft Ground Contact Shadow */}
        <mesh position={[0, -0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.95, 48]} />
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
  const { openOrderModal } = useProductStore();
  const [revealProgress, setRevealProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Highly optimized scroll listener using requestAnimationFrame (zero scroll lag)
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = el.offsetHeight - window.innerHeight;

      if (scrollableDistance > 0) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        setRevealProgress(progress);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver to pause WebGL rendering completely when scrolled off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // Outer scroll track: 180vh gives smooth, natural scroll feel without dragging out the page
    <div
      ref={containerRef}
      id="visor-3d"
      className="relative h-[180vh] bg-[#FAF7F2] border-t border-[#E5DEC9]"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Full-Screen 3D WebGL Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas
            frameloop={isInView ? 'always' : 'never'}
            dpr={1}
            // CAMERA CALIBRATION: Positioned so the mother's entire body (head, hair, belly, hands, and base)
            // is 100% visible and beautifully framed without any cutoffs!
            camera={{ position: [0, 0.05, 2.75], fov: 42 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            className="cursor-grab active:cursor-grabbing w-full h-full"
          >
            <color attach="background" args={['#FAF7F2']} />

            {/* Museum Gallery Studio Lights */}
            <ambientLight intensity={1.35} color="#fffcf8" />
            <directionalLight
              position={[3.0, 4.2, 3.0]}
              intensity={2.3}
              color="#fffdfa"
            />
            <directionalLight
              position={[-3.0, 2.5, -2.2]}
              intensity={1.3}
              color="#fef6eb"
            />
            <directionalLight
              position={[0, 2.2, -3.2]}
              intensity={1.0}
              color="#f4ebdf"
            />

            <Suspense fallback={<LoaderOverlay />}>
              <SculptureMeshes revealProgress={revealProgress} />
            </Suspense>

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minDistance={1.8}
              maxDistance={3.5}
              minPolarAngle={Math.PI / 4.8}
              maxPolarAngle={Math.PI / 1.85}
              autoRotate={false}
              target={[0, -0.05, 0]}
            />
          </Canvas>
        </div>

        {/* Top Floating Editorial Overlay */}
        <div className="relative z-10 pt-28 px-6 sm:px-12 lg:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pointer-events-none">
          <div className="max-w-xl space-y-2 pointer-events-auto">
            <span className="eyebrow block">
              La Revelación · Estudio Tridimensional
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825] leading-[1.12]">
              El misterio de la vida,{' '}
              <em className="italic font-normal text-[#8C6D46]">revelado en luz.</em>
            </h2>
            <p className="text-sm sm:text-base text-[#6E665E] font-light max-w-md">
              Desplaza suavemente para transformar el alabastro sólido en resina cristalina y
              desvelar con nitidez a tu bebé en el interior.
            </p>
          </div>

          <div className="hidden sm:block text-right pointer-events-auto">
            <span className="font-serif italic text-sm text-[#8C6D46] block">
              Gira libremente con el cursor · 360°
            </span>
          </div>
        </div>

        {/* Bottom Floating Editorial Bar: Zero Chunky Sliders, Pure Minimalist Luxury */}
        <div className="relative z-10 pb-10 px-6 sm:px-12 lg:px-16 flex justify-between items-end gap-6 pointer-events-none">
          <div className="pointer-events-auto">
            <p className="font-serif italic text-sm text-[#6E665E]">
              {revealProgress < 0.25
                ? 'Escultura en alabastro sólido'
                : revealProgress < 0.75
                ? 'Resina cristalina revelando el interior...'
                : 'Bebé visible en el vientre materno con luz de 2700K.'}
            </p>
          </div>

          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={() => openOrderModal()}
              className="px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors shadow-sm"
            >
              Encargar esta Obra →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
