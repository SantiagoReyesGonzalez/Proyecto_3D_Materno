import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '../store/useProductStore';
import { FINISH_OPTIONS } from '../data/products';
import { FinishId } from '../types/product';

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
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const finishObj = useMemo(
    () => FINISH_OPTIONS.find((f) => f.id === activeFinish) || FINISH_OPTIONS[0],
    [activeFinish]
  );

  const madreMaterial = useMemo(() => {
    const cfg = finishObj.materialConfig;
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(cfg.color),
      transmission: cfg.transmission,
      opacity: 1,
      transparent: true,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
      ior: cfg.ior,
      thickness: cfg.thickness,
      envMapIntensity: 1.4,
      attenuationColor: new THREE.Color(
        isLedOn ? '#ff9d2e' : cfg.attenuationColor
      ),
      attenuationDistance: isLedOn ? 1.6 : cfg.attenuationDistance,
      clearcoat: 0.25,
      clearcoatRoughness: 0.16,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, [finishObj, isLedOn]);

  const bebeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#eab68c'),
      roughness: 0.55,
      metalness: 0.05,
      emissive: new THREE.Color('#ff8c24'),
      emissiveIntensity: isLedOn ? 0.22 : 0.02,
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
        isLedOn ? 4.5 : 0.0,
        step
      );
    }
    if (wombLightRef.current) {
      wombLightRef.current.intensity = THREE.MathUtils.lerp(
        wombLightRef.current.intensity,
        isLedOn ? 2.5 : 0.12,
        step
      );
    }
    if (haloMaterialRef.current) {
      haloMaterialRef.current.opacity = THREE.MathUtils.lerp(
        haloMaterialRef.current.opacity,
        isLedOn ? 0.38 : 0.0,
        step
      );
    }
    if (ringMaterialRef.current) {
      ringMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        ringMaterialRef.current.emissiveIntensity,
        isLedOn ? 2.2 : 0.0,
        step
      );
    }
  });

  return (
    <group position={[0, -0.95, 0]}>
      <primitive object={madreScene} position={[0, 0, 0]} scale={1} />

      <group position={[-0.01, 0.21, 0.11]} scale={0.285}>
        <primitive object={bebeScene} />
      </group>

      <pointLight
        ref={baseLightRef}
        position={[0, 0.06, 0.12]}
        color="#ff9d2e"
        intensity={isLedOn ? 4.5 : 0}
        distance={3}
        decay={1.6}
      />

      <pointLight
        ref={wombLightRef}
        position={[0, 0.42, 0.14]}
        color="#ffaa44"
        intensity={isLedOn ? 2.5 : 0.12}
        distance={1.8}
        decay={1.8}
      />

      <group position={[0, -0.045, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.54, 0.08, 48]} />
          <meshStandardMaterial color="#1A1715" roughness={0.35} metalness={0.25} />
        </mesh>

        <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.41, 48]} />
          <meshStandardMaterial
            ref={ringMaterialRef}
            color={isLedOn ? '#ff9d2e' : '#2C2825'}
            emissive="#ff9d2e"
            emissiveIntensity={isLedOn ? 2.2 : 0}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0, -0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.85, 48]} />
          <meshBasicMaterial
            ref={haloMaterialRef}
            color="#ff9d2e"
            transparent
            opacity={isLedOn ? 0.38 : 0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};

const LoaderOverlay: React.FC = () => (
  <Html center>
    <div className="px-6 py-3 bg-[#1A1715] border border-[#8C6D46]/40 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2]">
        Preparando Escultura 3D...
      </p>
    </div>
  </Html>
);

export const SculptureViewer3D: React.FC = () => {
  const { isLedOn, toggleLed, activeFinish, setFinish } = useProductStore();
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
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Minimal Editorial Title Above Sanctuary */}
        <div className="max-w-xl mx-auto text-center space-y-4 mb-14">
          <span className="eyebrow block">
            Santuario Interactivo · 360°
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2C2825]">
            Contempla la obra en{' '}
            <em className="italic font-normal text-[#8C6D46]">penumbra y luz cálida.</em>
          </h2>
          <p className="text-sm sm:text-base text-[#6E665E] font-light">
            Gira suavemente la escultura y enciende el pedestal de 2700K para descubrir cómo
            resplandece el vientre en la oscuridad.
          </p>
        </div>

        {/* Bathhouse Warm Obsidian Architectural Frame (#1A1715) */}
        <div className="relative rounded-2xl bg-[#1A1715] border border-[#E5DEC9] overflow-hidden h-[540px] sm:h-[620px] flex flex-col justify-between">
          {/* Three.js Canvas */}
          <div className="absolute inset-0">
            <Canvas
              frameloop={isInView ? 'always' : 'never'}
              dpr={1}
              camera={{ position: [0, 0.12, 2.55], fov: 38 }}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: isLedOn ? 1.18 : 1.0,
              }}
            >
              <color attach="background" args={['#1A1715']} />

              <ambientLight intensity={isLedOn ? 0.55 : 0.85} />
              <hemisphereLight args={['#FAF7F2', '#1A1715', isLedOn ? 0.65 : 0.9]} />
              <directionalLight
                position={[2.5, 3.5, 2.8]}
                intensity={isLedOn ? 1.4 : 2.0}
                color="#FAF7F2"
              />
              <directionalLight
                position={[-2.6, 2.0, -2.0]}
                intensity={isLedOn ? 1.9 : 1.3}
                color={isLedOn ? '#ffbd69' : '#d6cfc7'}
              />

              <Suspense fallback={<LoaderOverlay />}>
                <SculptureMeshes isLedOn={isLedOn} activeFinish={activeFinish} />
              </Suspense>

              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={1.55}
                maxDistance={3.4}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 1.82}
                autoRotate={isInView}
                autoRotateSpeed={0.85}
                target={[0, -0.05, 0]}
              />
            </Canvas>
          </div>

          {/* Invisible/Subtle Top Hint */}
          <div className="relative z-10 p-6 flex justify-between items-center pointer-events-none">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2]/60">
              Rotación Orbital 360°
            </span>
            <span className="font-serif italic text-sm text-[#FAF7F2]/60">
              Arrastra para explorar
            </span>
          </div>

          {/* Bottom Sanctuary Bar: Only 3 Discrete Circular Material Selectors + Soft 2700K Switch */}
          <div className="relative z-10 p-6 sm:px-10 sm:py-7 bg-gradient-to-t from-[#1A1715] via-[#1A1715]/90 to-transparent flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* 3 Discrete Circular Material Selectors */}
            <div className="flex items-center gap-6">
              {FINISH_OPTIONS.map((finish) => {
                const isSelected = finish.id === activeFinish;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => setFinish(finish.id)}
                    className="group flex items-center gap-2.5 text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-full transition-transform ${
                        isSelected
                          ? 'ring-2 ring-[#8C6D46] ring-offset-2 ring-offset-[#1A1715] scale-110'
                          : 'opacity-70 group-hover:opacity-100'
                      }`}
                      style={{ backgroundColor: finish.swatchColor }}
                    />
                    <span
                      className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                        isSelected ? 'text-[#FAF7F2]' : 'text-[#FAF7F2]/55 group-hover:text-[#FAF7F2]/85'
                      }`}
                    >
                      {finish.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Soft Switch: Luz Nocturna 2700K */}
            <button
              type="button"
              onClick={toggleLed}
              role="switch"
              aria-checked={isLedOn}
              className="inline-flex items-center gap-3.5 text-[11px] uppercase tracking-[0.2em] text-[#FAF7F2]"
            >
              <span>Luz Nocturna 2700K</span>
              <span
                className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                  isLedOn ? 'bg-[#8C6D46]' : 'bg-[#2C2825] border border-[#6E665E]/50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-[#FAF7F2] transition-transform ${
                    isLedOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
