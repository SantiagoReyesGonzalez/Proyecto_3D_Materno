import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '../store/useProductStore';

const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

useGLTF.preload('/models/Madre.glb', DRACO_URL);
useGLTF.preload('/models/bebe.glb', DRACO_URL);

interface SculptureSceneProps {
  progressRef: React.MutableRefObject<number>;
}

const SculptureMeshes: React.FC<SculptureSceneProps> = ({ progressRef }) => {
  const madreGltf = useGLTF('/models/Madre.glb', DRACO_URL);
  const bebeGltf = useGLTF('/models/bebe.glb', DRACO_URL);

  const baseLightRef = useRef<THREE.PointLight>(null);
  const wombLightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const currentT = useRef(0);

  // Optical physical material: smoothly shifts from solid satin alabaster to razor-sharp optical crystal
  const madreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#eee4d5'),
      transmission: 0.0,
      opacity: 1.0,
      transparent: true,
      roughness: 0.35,
      metalness: 0.02,
      ior: 1.46,
      thickness: 0.2, // Thin shell ensures zero blur on the interior baby
      attenuationColor: new THREE.Color('#fdf5ea'),
      attenuationDistance: 4.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, []);

  // Defined, warm skin-toned baby
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

  // Zero-react-render frame loop: reads directly from progressRef.current
  useFrame((_, delta) => {
    const target = progressRef.current;
    currentT.current = THREE.MathUtils.lerp(
      currentT.current,
      target,
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
    // Centered so the mother's entire head, hair, belly, arms and travertine base are 100% visible
    <group ref={groupRef} position={[0, -0.92, 0]}>
      <primitive object={madreScene} position={[0, 0, 0]} scale={1} />

      <group position={[-0.01, 0.21, 0.115]} scale={0.29}>
        <primitive object={bebeScene} />
      </group>

      <pointLight
        ref={wombLightRef}
        position={[0, 0.44, 0.2]}
        color="#ffe3c2"
        intensity={0}
        distance={1.6}
        decay={2.0}
      />

      <pointLight
        ref={baseLightRef}
        position={[0, 0.08, 0.12]}
        color="#ff9d2e"
        intensity={0}
        distance={3.0}
        decay={1.6}
      />

      {/* Travertine Base */}
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
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  // High-performance scroll tracking: updates progressRef WITHOUT triggering React re-renders!
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Starts transition when section enters (top at 75% of viewport)
      // and completes when centered (top at 15% of viewport)
      const start = vh * 0.75;
      const end = vh * 0.15;
      const raw = (start - rect.top) / (start - end);
      progressRef.current = Math.max(0, Math.min(1, raw));
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

  // IntersectionObserver pauses WebGL completely when off-screen (0% GPU cost on other sections)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visor-3d"
      className="relative w-full h-[95vh] min-h-[640px] max-h-[920px] bg-[#FAF7F2] border-t border-[#E5DEC9] overflow-hidden"
    >
      {/* Full-Bleed WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          frameloop={isInView ? 'always' : 'never'}
          dpr={1}
          // Camera placed at z=2.75 with fov=42: mother is 100% visible from crown of head to base
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
            <SculptureMeshes progressRef={progressRef} />
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

      {/* Floating Editorial Narrative Overlay (Top-Left) */}
      <div className="relative z-10 pt-16 sm:pt-20 px-6 sm:px-12 lg:px-16 flex justify-between items-start pointer-events-none">
        <div className="max-w-xl space-y-3 pointer-events-auto">
          <span className="eyebrow block">
            Atelier Escultórico · Revelación 3D
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825] leading-[1.12]">
            El misterio de la vida,{' '}
            <em className="italic font-normal text-[#8C6D46]">revelado en luz.</em>
          </h2>
          <p className="text-sm sm:text-base text-[#6E665E] font-light max-w-md">
            Al desplazarte, el alabastro sólido se transforma en resina cristalina para desvelar a
            tu bebé con luz cálida de 2700K.
          </p>
        </div>

        <div className="hidden sm:block text-right pointer-events-auto">
          <span className="font-serif italic text-sm text-[#8C6D46] block">
            Gira libremente con el cursor · 360°
          </span>
        </div>
      </div>

      {/* Floating Minimalist Bottom Bar: Zero chunky boxes */}
      <div className="absolute bottom-8 left-6 sm:left-12 lg:left-16 right-6 sm:right-12 lg:right-16 z-10 flex justify-between items-end pointer-events-none">
        <span className="font-serif italic text-sm text-[#6E665E] pointer-events-auto">
          De la escultura sólida a la transparencia intrauterina.
        </span>

        <button
          type="button"
          onClick={() => openOrderModal()}
          className="pointer-events-auto px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors shadow-sm"
        >
          Encargar esta Obra →
        </button>
      </div>
    </section>
  );
};
