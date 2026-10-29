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

  // Optical Material that transitions from Solid Satin Alabaster to Ultra-Clear Crystal (NOT blurry)
  const madreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f0e7db'),
      transmission: 0.0,
      opacity: 1.0,
      transparent: true,
      roughness: 0.35,
      metalness: 0.02,
      ior: 1.46,
      thickness: 0.25, // Thin optical shell so the baby inside is razor-sharp without blurry distortion
      attenuationColor: new THREE.Color('#fdf5ea'),
      attenuationDistance: 3.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, []);

  // Razor-sharp, realistic baby material with anatomically defined skin tone
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

  // Smooth frame-by-frame interpolation driven by scroll progress
  useFrame((_, delta) => {
    currentT.current = THREE.MathUtils.lerp(
      currentT.current,
      revealProgress,
      Math.min(delta * 5.0, 1)
    );
    const t = currentT.current;

    // Transition from Solid Satin Alabaster (t=0) to Crystal Clear Optical Glass (t=1)
    // CRITICAL: roughness must drop to 0.02 so the baby inside is NOT blurry!
    madreMaterial.transmission = THREE.MathUtils.lerp(0.0, 0.98, t);
    madreMaterial.roughness = THREE.MathUtils.lerp(0.35, 0.02, t);
    madreMaterial.clearcoat = THREE.MathUtils.lerp(0.25, 0.95, t);

    // Color clarifies from warm solid stone to luminous clear optical crystal
    madreMaterial.color.lerpColors(
      new THREE.Color('#eee4d5'),
      new THREE.Color('#faf5ee'),
      t
    );

    // Baby inside illuminates gently with warm, sharp light (no blowout)
    bebeMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.05, 0.28, t);

    // Warm Base Uplight (2700K) illuminates from the travertine base
    if (baseLightRef.current) {
      baseLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 3.6, t);
    }

    // Soft Womb Interior Fill Light (gentle fill to define baby's face clearly)
    if (wombLightRef.current) {
      wombLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 1.8, t);
    }

    // Pedestal LED Ring
    if (ringRef.current) {
      ringRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.0, 2.4, t);
    }

    // Subtle cinematic scroll-driven camera rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.28, 0.08, t);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.88, 0]}>
      {/* Mother Torso: Solid Satin Alabaster -> Ultra-Clear Optical Crystal */}
      <primitive object={madreScene} position={[0, 0, 0]} scale={1} />

      {/* Realistic 3D Ultrasound Baby: positioned crisply in the ventral cavity */}
      <group position={[-0.01, 0.21, 0.115]} scale={0.29}>
        <primitive object={bebeScene} />
      </group>

      {/* Internal Womb Directional Fill (crisp, not blurry) */}
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
          <cylinderGeometry args={[0.54, 0.56, 0.08, 64]} />
          <meshStandardMaterial
            color="#e6dcce"
            roughness={0.88}
            metalness={0.04}
          />
        </mesh>

        {/* 2700K LED Ring Channel */}
        <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.43, 64]} />
          <meshStandardMaterial
            ref={ringRef}
            color="#ff9d2e"
            emissive="#ff9d2e"
            emissiveIntensity={0}
            roughness={0.3}
          />
        </mesh>

        {/* Soft Ambient Ground Contact Shadow */}
        <mesh position={[0, -0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.95, 64]} />
          <meshBasicMaterial
            color="#c9bcab"
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

const LoaderOverlay: React.FC = () => (
  <Html center>
    <div className="px-6 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-center shadow-sm">
      <p className="font-serif italic text-base text-[#8C6D46]">
        Cargando escultura en luz natural...
      </p>
    </div>
  </Html>
);

export const SculptureViewer3D: React.FC = () => {
  const { openOrderModal } = useProductStore();
  const [revealProgress, setRevealProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sticky Scroll Driver: As the user scrolls through the 220vh track,
  // the viewport stays pinned full-screen and computes a smooth 0.0 to 1.0 reveal progress.
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = el.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      // When rect.top is 0, we just pinned.
      // Progress from 0 (at pin start) to 1 (at unpin end)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setRevealProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Outer scroll track: 240vh height gives the user comfortable, gradual control over the transition
    <div
      ref={containerRef}
      id="visor-3d"
      className="relative h-[240vh] bg-[#FAF7F2] border-t border-[#E5DEC9]"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Full-Screen 3D WebGL Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas
            dpr={1}
            camera={{ position: [0, 0.08, 2.15], fov: 33 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.12,
            }}
            className="cursor-grab active:cursor-grabbing w-full h-full"
          >
            {/* Museum Gallery Natural Sunlight Lighting */}
            <ambientLight intensity={1.3} color="#fffcf8" />
            <directionalLight
              position={[3.0, 4.2, 3.0]}
              intensity={2.4}
              color="#fffdfa"
            />
            <directionalLight
              position={[-3.0, 2.5, -2.2]}
              intensity={1.3}
              color="#fef6eb"
            />
            <directionalLight
              position={[0, 2.2, -3.2]}
              intensity={1.1}
              color="#f4ebdf"
            />

            <Suspense fallback={<LoaderOverlay />}>
              <SculptureMeshes revealProgress={revealProgress} />
            </Suspense>

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minDistance={1.7}
              maxDistance={2.8}
              minPolarAngle={Math.PI / 4.8}
              maxPolarAngle={Math.PI / 1.85}
              autoRotate={false}
              target={[0, -0.06, 0]}
            />
          </Canvas>
        </div>

        {/* Soft Radial Vignette for Editorial Atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(250, 247, 242, 0.15) 0%, rgba(250, 247, 242, 0.6) 75%, rgba(250, 247, 242, 0.95) 100%)',
          }}
        />

        {/* Top Floating Editorial Overlay (Subtle, High Contrast) */}
        <div className="relative z-20 pt-28 px-6 sm:px-12 lg:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pointer-events-none">
          <div className="max-w-xl space-y-2 pointer-events-auto">
            <span className="eyebrow block">
              La Revelación · Estudio 3D a Pantalla Completa
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#2C2825] leading-[1.08]">
              El misterio de la vida,{' '}
              <em className="italic font-normal text-[#8C6D46]">revelado en luz.</em>
            </h2>
            <p className="text-sm sm:text-base text-[#6E665E] font-light max-w-md">
              Desplaza hacia abajo para transformar la escultura de alabastro sólido en resina
              cristalina y desvelar con nitidez a tu bebé en su interior.
            </p>
          </div>

          <div className="hidden sm:block text-right pointer-events-auto">
            <span className="font-serif italic text-sm text-[#8C6D46] block">
              Gira libremente con el cursor · 360°
            </span>
          </div>
        </div>

        {/* Bottom Floating Progress & Interactive Control Bar */}
        <div className="relative z-20 pb-10 px-6 sm:px-12 lg:px-16 flex flex-col sm:flex-row justify-between items-end gap-6 pointer-events-none">
          {/* Visual Scroll Reveal Meter */}
          <div className="w-full sm:max-w-md space-y-2.5 pointer-events-auto bg-[#FAF7F2]/80 backdrop-blur-sm p-4 border border-[#E5DEC9]">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#6E665E]">
              <span className={revealProgress < 0.25 ? 'text-[#2C2825] font-semibold' : ''}>
                I. Escultura Sólida
              </span>
              <span className={revealProgress > 0.7 ? 'text-[#8C6D46] font-semibold' : ''}>
                II. Cristal & Bebé Revelado
              </span>
            </div>

            {/* Continuous 1px Hairline Progress Bar */}
            <div className="relative w-full h-[2px] bg-[#E5DEC9]">
              <div
                className="absolute top-0 left-0 h-full bg-[#8C6D46] transition-all duration-75"
                style={{ width: `${Math.round(revealProgress * 100)}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#8C6D46] border border-[#FAF7F2] shadow-sm transition-all duration-75"
                style={{
                  left: `calc(${Math.round(revealProgress * 100)}% - 6px)`,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="font-serif italic text-xs text-[#8C6D46]">
                {revealProgress < 0.2
                  ? 'Desplaza suavemente para iniciar la transparencia...'
                  : revealProgress < 0.8
                  ? 'La resina se vuelve cristalina y enciende la luz de 2700K...'
                  : 'Bebé 100% visible en su vientre con luz nocturna.'}
              </p>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#6E665E]">
                {(revealProgress * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
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
