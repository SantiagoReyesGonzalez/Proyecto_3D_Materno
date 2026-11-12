import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '../store/useProductStore';

const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

useGLTF.preload('/models/Madre.glb', DRACO_URL);
useGLTF.preload('/models/bebe.glb', DRACO_URL);

export type ResinFinishId = 'porcelain_silk' | 'champagne_quartz' | 'honey_amber';

interface FinishPreset {
  id: ResinFinishId;
  hint: string;
  swatchGradient: string;
  swatchBorder: string;
  // Day Atelier palette (luminous, creamy, zero dark/black tones)
  lightShell: string;
  lightDeep: string;
  lightRim: string;
  // Evening Sanctuary palette (warm bronze-champagne, never pitch black)
  darkShell: string;
  darkDeep: string;
  darkRim: string;
  wombGlowColor: string;
  wombCenterAlpha: number;
}

const FINISH_PRESETS: Record<ResinFinishId, FinishPreset> = {
  porcelain_silk: {
    id: 'porcelain_silk',
    hint: 'Porcelana Marfil',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFFFFF 0%, #F3ECE1 55%, #D8CBB8 100%)',
    swatchBorder: '#C8B9A6',
    lightShell: '#FBF8F3',
    lightDeep: '#E2D6C5',
    lightRim: '#FFFFFF',
    darkShell: '#C8B8A4',
    darkDeep: '#6E5D4D',
    darkRim: '#FFF6E8',
    wombGlowColor: '#FFB35C',
    wombCenterAlpha: 0.07,
  },
  champagne_quartz: {
    id: 'champagne_quartz',
    hint: 'Cuarzo Champán',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFFDF9 0%, #E6D3B8 55%, #BFA382 100%)',
    swatchBorder: '#B59B7C',
    lightShell: '#F6EFE4',
    lightDeep: '#D6C4AC',
    lightRim: '#FFFDF9',
    darkShell: '#BCA68E',
    darkDeep: '#5E4E3E',
    darkRim: '#FFF0D8',
    wombGlowColor: '#FFA647',
    wombCenterAlpha: 0.05,
  },
  honey_amber: {
    id: 'honey_amber',
    hint: 'Ámbar Dorado',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFE8C2 0%, #D9A76A 55%, #A67338 100%)',
    swatchBorder: '#9E6E36',
    lightShell: '#F4E8D6',
    lightDeep: '#CBB396',
    lightRim: '#FFF9EE',
    darkShell: '#B09474',
    darkDeep: '#524132',
    darkRim: '#FFECC8',
    wombGlowColor: '#FF9A36',
    wombCenterAlpha: 0.04,
  },
};

// ============================================================================
// 1. BABY SUBSURFACE SCATTERING (SSS) SHADER (Luruke Raspberry Technique)
// Soft, warm peach-ivory organic tone with gentle 2700K internal scatter
// ============================================================================
const BABY_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BABY_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uSkinColor;
  uniform vec3 uSssColor;
  uniform vec3 uDeepShadowColor;
  uniform float uWarmLight;

  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);

    vec3 keyDir = normalize(vec3(0.48, 0.72, 0.72));
    vec3 fillDir = normalize(vec3(-0.62, 0.35, 0.55));
    vec3 wombLightPos = vec3(0.0, -0.68, 0.15);
    vec3 wombDir = normalize(wombLightPos - vWorldPos);

    // Ultra-soft wrapped diffuse so the baby has delicate, creamy relief
    float wrap = 0.65;
    float diffKey = clamp((dot(N, keyDir) + wrap) / (1.0 + wrap), 0.0, 1.0);
    float diffFill = clamp((dot(N, fillDir) + 0.5) / 1.5, 0.0, 1.0);
    float hemi = 0.55 + 0.45 * N.y;

    vec3 baseShading = mix(uDeepShadowColor, uSkinColor, diffKey * 0.70 + diffFill * 0.30);
    baseShading *= mix(0.90, 1.06, hemi);

    // Gentle Subsurface Scattering (SSS) from 2700K womb light
    float wombWrap = clamp((dot(N, wombDir) + 0.75) / 1.75, 0.0, 1.0);
    float sssBand = smoothstep(0.05, 0.55, diffKey) * (1.0 - smoothstep(0.55, 0.98, diffKey));
    float sssFactor = (wombWrap * 0.50 + sssBand * 0.40) * (0.35 + 0.65 * uWarmLight);

    vec3 color = mix(baseShading, uSssColor, clamp(sssFactor * 0.48, 0.0, 0.58));
    color += uSssColor * (wombWrap * 0.18 * uWarmLight);

    // Velvet micro-sheen (peach fuzz rim)
    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.5);
    color += vec3(1.0, 0.93, 0.82) * fresnel * (0.28 + 0.18 * uWarmLight);

    // Soft satin highlight
    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.14;
    color += vec3(1.0, 0.97, 0.92) * spec;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================================================
// 2. MOTHER DEPTH PRE-PASS & SUBTLE FROSTED RESIN SHADER
// Bit-identical gl_Position guarantees ZERO Z-fighting AND ZERO X-ray overlap
// on the chin, hair, arms, or shoulders!
// ============================================================================
const MOTHER_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MOTHER_DEPTH_FRAGMENT_SHADER = /* glsl */ `
  void main() {
    gl_FragColor = vec4(0.0);
  }
`;

const MOTHER_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uShellColor;
  uniform vec3 uDeepColor;
  uniform vec3 uRimColor;
  uniform vec3 uWombGlowColor;
  uniform float uReveal;
  uniform float uWarmLight;
  uniform float uWombCenterAlpha;
  uniform float uGroupRotY;

  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);

    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.15);
    float rimFine = pow(1.0 - ndotv, 3.4);

    // Soft museum studio lighting (high wrap so shadows are creamy cashmere, never dark/black)
    vec3 keyDir = normalize(vec3(0.48, 0.76, 0.68));
    vec3 fillDir = normalize(vec3(-0.65, 0.42, 0.52));

    float diffKey = clamp((dot(N, keyDir) + 0.68) / 1.68, 0.0, 1.0);
    float diffFill = clamp((dot(N, fillDir) + 0.58) / 1.58, 0.0, 1.0);
    float hemi = 0.6 + 0.4 * N.y;

    // Creamy porcelain/alabaster sculptural shading
    float lightMix = clamp(diffKey * 0.72 + diffFill * 0.28, 0.0, 1.0);
    vec3 bodyTone = mix(uDeepColor, uShellColor, lightMix);
    bodyTone = mix(bodyTone, uShellColor, hemi * 0.25);

    // Un-rotate vWorldPos by -uGroupRotY so the womb window stays 100% locked
    // to the front of the mother's belly as the sculpture turns on scroll!
    float c = cos(uGroupRotY);
    float s = sin(uGroupRotY);
    vec3 bodyPos = vec3(
      vWorldPos.x * c - vWorldPos.z * s,
      vWorldPos.y,
      vWorldPos.x * s + vWorldPos.z * c
    );

    // Localized Womb Window centered on the baby in Sculpture-Locked Space (y = -0.36, z = 0.12):
    // Head, face, chin, hair, shoulders, back, and arms remain 100% solid porcelain (alpha = 1.0)!
    vec3 wombCenter = vec3(0.0, -0.36, 0.12);
    vec3 dWomb = (bodyPos - wombCenter) * vec3(1.06, 1.05, 0.98);
    float distToWomb = length(dWomb);

    // Strictly on the front/side-front belly hemisphere
    float forwardMask = smoothstep(-0.06, 0.05, bodyPos.z);
    float wombWindow = (1.0 - smoothstep(0.18, 0.37, distToWomb)) * forwardMask;
    float wombGlowField = exp(-distToWomb * 2.2) * forwardMask;

    // Subtle 2700K golden subsurface warmth radiating through the belly and cradling hands
    float internalScatter = wombGlowField * (0.45 + 0.55 * fresnel) * uWarmLight * uReveal;
    vec3 color = mix(bodyTone, bodyTone + uWombGlowColor * 0.55, internalScatter);

    // Silky pearl specular & Fresnel rim highlights (softened over the womb window so glare never hides the baby)
    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 34.0) * 0.22 * (1.0 - wombWindow * 0.65);
    color = mix(color, uRimColor, rimFine * 0.42 * (1.0 - wombWindow * 0.45));
    color += uRimColor * spec;

    // Crystal-Clear Subtle Womb Alpha even at 3/4 side angles:
    float bellyEdgeFresnel = pow(1.0 - ndotv, 3.2);
    float windowAlpha = mix(uWombCenterAlpha, 0.58, bellyEdgeFresnel * 0.55);
    float targetAlpha = mix(1.0, windowAlpha, wombWindow * uReveal);

    gl_FragColor = vec4(color, targetAlpha);
  }
`;

interface SculptureSceneProps {
  progressRef: React.MutableRefObject<number>;
  finishId: ResinFinishId;
  warmLightOn: boolean;
  sanctuaryDark: boolean;
}

const SculptureMeshes: React.FC<SculptureSceneProps> = ({
  progressRef,
  finishId,
  warmLightOn,
  sanctuaryDark,
}) => {
  const { gl, scene, camera, invalidate } = useThree();
  const madreGltf = useGLTF('/models/Madre.glb', DRACO_URL);
  const bebeGltf = useGLTF('/models/bebe.glb', DRACO_URL);

  const ringRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloRef = useRef<THREE.MeshBasicMaterial>(null);
  const baseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const currentReveal = useRef(0.95);
  const currentWarm = useRef(warmLightOn ? 1.0 : 0.12);
  const currentRotY = useRef(0.06);
  const targetPreset = FINISH_PRESETS[finishId];

  const targetShellColor = useMemo(
    () => new THREE.Color(sanctuaryDark ? targetPreset.darkShell : targetPreset.lightShell),
    [targetPreset, sanctuaryDark]
  );
  const targetDeepColor = useMemo(
    () => new THREE.Color(sanctuaryDark ? targetPreset.darkDeep : targetPreset.lightDeep),
    [targetPreset, sanctuaryDark]
  );
  const targetRimColor = useMemo(
    () => new THREE.Color(sanctuaryDark ? targetPreset.darkRim : targetPreset.lightRim),
    [targetPreset, sanctuaryDark]
  );
  const targetGlowColor = useMemo(
    () => new THREE.Color(targetPreset.wombGlowColor),
    [targetPreset]
  );
  const targetPedestalColor = useMemo(
    () => new THREE.Color(sanctuaryDark ? '#2B2521' : '#EAE2D6'),
    [sanctuaryDark]
  );

  // Pass 1: Baby Subsurface Scattering Material
  const bebeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: BABY_VERTEX_SHADER,
      fragmentShader: BABY_FRAGMENT_SHADER,
      uniforms: {
        uSkinColor: { value: new THREE.Color('#F5D5BC') },
        uSssColor: { value: new THREE.Color('#F2954E') },
        uDeepShadowColor: { value: new THREE.Color('#C49574') },
        uWarmLight: { value: 1.0 },
      },
      depthWrite: true,
      depthTest: true,
    });
  }, []);

  // Pass 2: Bit-Identical Shader Depth Pre-Pass for Mother
  const madreDepthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: MOTHER_VERTEX_SHADER,
      fragmentShader: MOTHER_DEPTH_FRAGMENT_SHADER,
      colorWrite: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.FrontSide,
    });
  }, []);

  // Pass 3: Mother Subtle Frosted Resin Material
  const madreFrontMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: MOTHER_VERTEX_SHADER,
      fragmentShader: MOTHER_FRAGMENT_SHADER,
      uniforms: {
        uShellColor: { value: new THREE.Color(FINISH_PRESETS.porcelain_silk.lightShell) },
        uDeepColor: { value: new THREE.Color(FINISH_PRESETS.porcelain_silk.lightDeep) },
        uRimColor: { value: new THREE.Color(FINISH_PRESETS.porcelain_silk.lightRim) },
        uWombGlowColor: { value: new THREE.Color(FINISH_PRESETS.porcelain_silk.wombGlowColor) },
        uReveal: { value: 0.95 },
        uWarmLight: { value: 1.0 },
        uWombCenterAlpha: { value: FINISH_PRESETS.porcelain_silk.wombCenterAlpha },
        uGroupRotY: { value: 0.06 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      depthFunc: THREE.LessEqualDepth,
      side: THREE.FrontSide,
    });
  }, []);

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

  const madreDepthScene = useMemo(() => {
    const cloned = madreGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = madreDepthMaterial;
        mesh.renderOrder = 2;
      }
    });
    return cloned;
  }, [madreGltf.scene, madreDepthMaterial]);

  const madreFrontScene = useMemo(() => {
    const cloned = madreGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = madreFrontMaterial;
        mesh.renderOrder = 3;
      }
    });
    return cloned;
  }, [madreGltf.scene, madreFrontMaterial]);

  useEffect(() => {
    gl.compile(scene, camera);
    invalidate();
  }, [gl, scene, camera, invalidate]);

  useEffect(() => {
    invalidate();
  }, [finishId, warmLightOn, sanctuaryDark, invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const speed = dt * 6.0;

    const p = progressRef.current;
    // Gentle scroll-linked reveal & orbital rotation:
    // As the user scrolls past the section, the sculpture smoothly turns from a 3/4 profile (-0.42 rad)
    // through the front view (0.06 rad) to the opposite 3/4 angle (+0.38 rad), so users who never drag
    // still experience the full 3D depth automatically!
    const targetReveal = 0.35 + Math.min(1, p * 1.35) * 0.65;
    const targetRotY = THREE.MathUtils.lerp(-0.42, 0.38, p);
    const targetWarm = warmLightOn ? 1.0 : 0.08;

    currentReveal.current = THREE.MathUtils.lerp(currentReveal.current, targetReveal, speed);
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, speed);
    currentWarm.current = THREE.MathUtils.lerp(currentWarm.current, targetWarm, speed);

    if (groupRef.current) {
      groupRef.current.rotation.y = currentRotY.current;
    }

    madreFrontMaterial.uniforms.uReveal.value = currentReveal.current;
    madreFrontMaterial.uniforms.uWarmLight.value = currentWarm.current;
    madreFrontMaterial.uniforms.uGroupRotY.value = currentRotY.current;
    madreFrontMaterial.uniforms.uShellColor.value.lerp(targetShellColor, speed);
    madreFrontMaterial.uniforms.uDeepColor.value.lerp(targetDeepColor, speed);
    madreFrontMaterial.uniforms.uRimColor.value.lerp(targetRimColor, speed);
    madreFrontMaterial.uniforms.uWombGlowColor.value.lerp(targetGlowColor, speed);
    madreFrontMaterial.uniforms.uWombCenterAlpha.value = THREE.MathUtils.lerp(
      madreFrontMaterial.uniforms.uWombCenterAlpha.value,
      targetPreset.wombCenterAlpha,
      speed
    );

    bebeMaterial.uniforms.uWarmLight.value = currentWarm.current;

    if (ringRef.current) {
      ringRef.current.opacity = THREE.MathUtils.lerp(0.18, 0.92, currentWarm.current);
    }
    if (haloRef.current) {
      haloRef.current.opacity = THREE.MathUtils.lerp(0.0, 0.32, currentWarm.current);
    }
    if (baseMatRef.current) {
      baseMatRef.current.color.lerp(targetPedestalColor, speed);
    }

    const revealDiff = Math.abs(targetReveal - currentReveal.current);
    const rotDiff = Math.abs(targetRotY - currentRotY.current);
    const warmDiff = Math.abs(targetWarm - currentWarm.current);
    const colorDiff =
      Math.abs(madreFrontMaterial.uniforms.uShellColor.value.r - targetShellColor.r) +
      Math.abs(madreFrontMaterial.uniforms.uShellColor.value.g - targetShellColor.g);

    if (revealDiff > 0.001 || rotDiff > 0.001 || warmDiff > 0.001 || colorDiff > 0.002) {
      invalidate();
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.76, 0]} scale={0.84} rotation={[0, 0.06, 0]}>
      {/* Pass 1: Baby with Subsurface Scattering */}
      <group position={[-0.01, 0.21, 0.095]} scale={0.275}>
        <primitive object={bebeScene} />
      </group>

      {/* Pass 2: Bit-Identical Shader Depth Pre-Pass */}
      <primitive object={madreDepthScene} position={[0, 0, 0]} scale={1} />

      {/* Pass 3: Mother Creamy Porcelain & Localized Womb Window */}
      <primitive object={madreFrontScene} position={[0, 0, 0]} scale={1} />

      {/* Handcrafted Travertine Pedestal & 2700K Warm LED Ring */}
      <group position={[0, -0.045, 0]}>
        <mesh>
          <cylinderGeometry args={[0.54, 0.56, 0.08, 48]} />
          <meshStandardMaterial
            ref={baseMatRef}
            color={sanctuaryDark ? '#2B2521' : '#EAE2D6'}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Warm 2700K LED Recessed Ring */}
        <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.43, 64]} />
          <meshBasicMaterial
            ref={ringRef}
            color="#FFB866"
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Soft Warm Floor Halo */}
        <mesh position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.52, 48]} />
          <meshBasicMaterial
            ref={haloRef}
            color="#FFA84C"
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

const LoaderOverlay: React.FC = () => (
  <Html center>
    <div className="px-5 py-2.5 bg-[#FAF7F2]/95 border border-[#E5DEC9] text-center shadow-sm whitespace-nowrap rounded-full">
      <p className="font-serif italic text-sm text-[#8C6D46]">
        Desvelando escultura...
      </p>
    </div>
  </Html>
);

export const SculptureViewer3D: React.FC = () => {
  const { openOrderModal } = useProductStore();
  const [finishId, setFinishId] = useState<ResinFinishId>('porcelain_silk');
  const [sanctuaryDark, setSanctuaryDark] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0.5);
  const invalidateRef = useRef<(() => void) | null>(null);

  // Smooth passive scroll tracking across the entire viewport journey of the section
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const el = sectionRef.current;
      if (!el) {
        ticking = false;
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.bottom >= -150 && rect.top <= vh + 150) {
        // Maps scroll from when section enters bottom (top = vh * 0.85)
        // to when section exits top (top = -vh * 0.35)
        const start = vh * 0.85;
        const end = -vh * 0.35;
        const raw = (start - rect.top) / (start - end);
        const clamped = Math.max(0, Math.min(1, raw));
        if (Math.abs(clamped - progressRef.current) > 0.002) {
          progressRef.current = clamped;
          invalidateRef.current?.();
        }
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

  const bgColor = sanctuaryDark ? '#1B1714' : '#FAF7F2';

  return (
    <section
      ref={sectionRef}
      id="visor-3d"
      style={{ backgroundColor: bgColor }}
      className="relative w-full h-[92vh] min-h-[660px] max-h-[920px] border-t border-[#E5DEC9] overflow-hidden transition-colors duration-300"
    >
      {/* Demand-Driven WebGL Canvas */}
      <div
        className="absolute inset-0 z-0"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={() => {
          if (!hasInteracted) setHasInteracted(true);
        }}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.04, 2.85], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.04,
          }}
          onCreated={({ invalidate }) => {
            invalidateRef.current = invalidate;
          }}
          style={{ touchAction: 'pan-y' }}
          className="cursor-grab active:cursor-grabbing w-full h-full"
        >
          <ambientLight intensity={0.95} color="#fffcf8" />
          <directionalLight position={[2.5, 3.5, 2.5]} intensity={1.15} color="#fffdfa" />

          <Suspense fallback={<LoaderOverlay />}>
            <SculptureMeshes
              progressRef={progressRef}
              finishId={finishId}
              warmLightOn={true}
              sanctuaryDark={sanctuaryDark}
            />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={false}
            enableDamping={true}
            dampingFactor={0.045}
            rotateSpeed={0.75}
            minPolarAngle={Math.PI / 4.2}
            maxPolarAngle={Math.PI / 1.85}
            target={[0, 0.0, 0]}
          />
        </Canvas>
      </div>

      {/* Whisper-Quiet Editorial Narrative Overlay (Top-Left) */}
      <div className="relative z-10 pt-12 sm:pt-14 px-6 sm:px-12 lg:px-16 flex justify-between items-start pointer-events-none">
        <div className="max-w-md space-y-2.5 pointer-events-auto">
          <span
            className={`eyebrow block transition-colors duration-300 ${
              sanctuaryDark ? '!text-[#D4B07B]' : ''
            }`}
          >
            El Santuario · Luz de 2700K
          </span>
          <h2
            className={`font-serif text-4xl sm:text-5xl font-light leading-[1.12] transition-colors duration-300 ${
              sanctuaryDark ? 'text-[#FAF7F2]' : 'text-[#2C2825]'
            }`}
          >
            El misterio de la vida,{' '}
            <em
              className={`italic font-normal transition-colors duration-300 ${
                sanctuaryDark ? 'text-[#DFB882]' : 'text-[#8C6D46]'
              }`}
            >
              revelado en luz.
            </em>
          </h2>
          <p
            className={`text-sm sm:text-[15px] font-light max-w-sm transition-colors duration-300 ${
              sanctuaryDark ? 'text-[#C8BFB5]' : 'text-[#6E665E]'
            }`}
          >
            Al deslizar o girar la pieza, la porcelana sedosa desvela a tu bebé bajo una cálida
            luz maternal.
          </p>
        </div>
      </div>

      {/* Subtle Disappearing Gesture Hint (Fades out automatically after first drag) */}
      <div
        className={`pointer-events-none absolute top-1/2 right-6 sm:right-12 lg:right-16 -translate-y-1/2 z-10 hidden md:flex items-center gap-2.5 transition-opacity duration-700 ${
          hasInteracted ? 'opacity-0' : 'opacity-75'
        }`}
      >
        <span
          className={`font-serif italic text-sm ${
            sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#8C6D46]'
          }`}
        >
          Desliza para girar
        </span>
        <span
          className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
            sanctuaryDark
              ? 'border-[#D4B07B]/40 text-[#D4B07B]'
              : 'border-[#8C6D46]/40 text-[#8C6D46]'
          }`}
        >
          ↔
        </span>
      </div>

      {/* Ultra-Minimalist Bottom Bar: Pure Tactile Color Dots (Zero Text Clutter) + Editorial Link */}
      <div className="absolute bottom-8 left-6 sm:left-12 lg:left-16 right-6 sm:right-12 lg:right-16 z-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-5 pointer-events-none">
        {/* Floating Pill Dock: 3 Tactile Material Spheres + 1 Day/Night Glow Icon */}
        <div
          className={`pointer-events-auto inline-flex items-center gap-3.5 px-4 py-2.5 rounded-full border backdrop-blur-md transition-all duration-500 shadow-sm ${
            sanctuaryDark
              ? 'bg-[#26211D]/85 border-[#3D352E]'
              : 'bg-[#FAF7F2]/85 border-[#E5DEC9]'
          }`}
        >
          {(Object.keys(FINISH_PRESETS) as ResinFinishId[]).map((key) => {
            const preset = FINISH_PRESETS[key];
            const active = finishId === key;
            return (
              <button
                key={key}
                type="button"
                aria-label={preset.hint}
                title={preset.hint}
                onClick={() => setFinishId(key)}
                className={`relative w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${
                  active ? 'scale-110' : 'opacity-75 hover:opacity-100 hover:scale-105'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full block shadow-inner"
                  style={{
                    background: preset.swatchGradient,
                    border: `1px solid ${preset.swatchBorder}`,
                  }}
                />
                {active && (
                  <span
                    className={`absolute -inset-1 rounded-full border transition-colors ${
                      sanctuaryDark ? 'border-[#D4B07B]' : 'border-[#8C6D46]'
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* Hairline Divider */}
          <span
            className={`h-4 w-[1px] mx-0.5 ${
              sanctuaryDark ? 'bg-[#3D352E]' : 'bg-[#E5DEC9]'
            }`}
          />

          {/* Single Intuitive Day / Night 2700K Atmosphere Dot */}
          <button
            type="button"
            onClick={() => setSanctuaryDark((v) => !v)}
            title={sanctuaryDark ? 'Ver con luz de día' : 'Ver en penumbra nocturna 2700K'}
            aria-label={sanctuaryDark ? 'Ver con luz de día' : 'Ver en penumbra nocturna 2700K'}
            className={`inline-flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full text-[11px] font-serif italic transition-colors ${
              sanctuaryDark
                ? 'text-[#FFB866]'
                : 'text-[#6E665E] hover:text-[#2C2825]'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                sanctuaryDark
                  ? 'bg-[#FFB866] shadow-[0_0_10px_#FFA84C]'
                  : 'bg-[#2C2825]'
              }`}
            />
            <span>{sanctuaryDark ? 'Noche' : 'Día'}</span>
          </button>
        </div>

        {/* Clean Editorial Link CTA (Matches Bridal Bliss Hero style, not a heavy box) */}
        <button
          type="button"
          onClick={() => openOrderModal()}
          className={`pointer-events-auto inline-flex items-center gap-3.5 px-5 py-2.5 rounded-full border text-[11px] uppercase tracking-[0.22em] backdrop-blur-md transition-all duration-300 group ${
            sanctuaryDark
              ? 'bg-[#26211D]/85 border-[#D4B07B]/50 text-[#FAF7F2] hover:border-[#D4B07B]'
              : 'bg-[#FAF7F2]/85 border-[#2C2825]/30 text-[#2C2825] hover:border-[#8C6D46] hover:text-[#8C6D46]'
          }`}
        >
          <span>Encargar esta Obra</span>
          <span className="text-[#8C6D46] group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </section>
  );
};
