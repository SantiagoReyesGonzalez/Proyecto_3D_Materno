import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { FINISH_PRESETS, ResinFinishId } from '../data/finishes';

const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';
const MADRE_MODEL_URL = `${import.meta.env.BASE_URL}models/Madre.glb`;
const BEBE_MODEL_URL = `${import.meta.env.BASE_URL}models/bebe.glb`;

useGLTF.preload(MADRE_MODEL_URL, DRACO_URL);
useGLTF.preload(BEBE_MODEL_URL, DRACO_URL);

// ============================================================================
// 1. BABY SUBSURFACE SCATTERING (SSS) SHADER
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

    float wrap = 0.65;
    float diffKey = clamp((dot(N, keyDir) + wrap) / (1.0 + wrap), 0.0, 1.0);
    float diffFill = clamp((dot(N, fillDir) + 0.5) / 1.5, 0.0, 1.0);
    float hemi = 0.55 + 0.45 * N.y;

    vec3 baseShading = mix(uDeepShadowColor, uSkinColor, diffKey * 0.70 + diffFill * 0.30);
    baseShading *= mix(0.90, 1.06, hemi);

    float wombWrap = clamp((dot(N, wombDir) + 0.75) / 1.75, 0.0, 1.0);
    float sssBand = smoothstep(0.05, 0.55, diffKey) * (1.0 - smoothstep(0.55, 0.98, diffKey));
    float sssFactor = (wombWrap * 0.50 + sssBand * 0.40) * (0.35 + 0.65 * uWarmLight);

    vec3 color = mix(baseShading, uSssColor, clamp(sssFactor * 0.48, 0.0, 0.58));
    color += uSssColor * (wombWrap * 0.18 * uWarmLight);

    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.5);
    color += vec3(1.0, 0.93, 0.82) * fresnel * (0.28 + 0.18 * uWarmLight);

    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.14;
    color += vec3(1.0, 0.97, 0.92) * spec;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================================================
// 2. MOTHER DEPTH PRE-PASS & SUBTLE FROSTED RESIN SHADER
// ============================================================================
const MOTHER_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vSculptPos;
  varying vec3 vSmoothBreastNormalWorld;

  void main() {
    vSculptPos = vec3(position.x, -position.z, position.y);

    float sideSign = position.x >= 0.0 ? 1.0 : -1.0;
    vec3 dBreast = vec3(
      (position.x - sideSign * 0.125) / 0.11,
      ((-position.z) - 0.965) / 0.095,
      (position.y - 0.06) / 0.12
    );
    vec3 smoothSculptN = normalize(vec3(dBreast.x * 0.52, dBreast.y * 0.62 + 0.14, 1.0));
    vec3 rawSmoothN = vec3(smoothSculptN.x, smoothSculptN.z, -smoothSculptN.y);
    vSmoothBreastNormalWorld = normalize(mat3(modelMatrix) * rawSmoothN);

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

  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vSculptPos;
  varying vec3 vSmoothBreastNormalWorld;

  void main() {
    float breastYMask = smoothstep(0.915, 0.945, vSculptPos.y) * (1.0 - smoothstep(1.045, 1.085, vSculptPos.y));
    float breastXMask = smoothstep(0.035, 0.065, abs(vSculptPos.x)) * (1.0 - smoothstep(0.190, 0.225, abs(vSculptPos.x)));
    float breastZMask = smoothstep(0.070, 0.105, vSculptPos.z) * (1.0 - smoothstep(0.174, 0.184, vSculptPos.z));
    float breastMask = breastYMask * breastXMask * breastZMask;

    vec3 N = normalize(mix(normalize(vNormalWorld), normalize(vSmoothBreastNormalWorld), breastMask * 0.92));
    vec3 V = normalize(vViewDir);

    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.15);
    float rimFine = pow(1.0 - ndotv, 3.4);

    vec3 keyDir = normalize(vec3(0.48, 0.76, 0.68));
    vec3 fillDir = normalize(vec3(-0.65, 0.42, 0.52));

    float diffKey = clamp((dot(N, keyDir) + 0.68) / 1.68, 0.0, 1.0);
    float diffFill = clamp((dot(N, fillDir) + 0.58) / 1.58, 0.0, 1.0);
    float hemi = 0.6 + 0.4 * N.y;

    float lightMix = clamp(diffKey * 0.72 + diffFill * 0.28, 0.0, 1.0);
    vec3 bodyTone = mix(uDeepColor, uShellColor, lightMix);
    bodyTone = mix(bodyTone, uShellColor, hemi * 0.25);

    vec3 wombCenter = vec3(-0.01, 0.51, 0.33);
    vec3 dWomb = (vSculptPos - wombCenter) / vec3(0.28, 0.31, 0.26);
    float distToWomb = length(dWomb);

    float aboveLegsMask = smoothstep(0.22, 0.30, vSculptPos.y);
    float belowUpperHandMask = 1.0 - smoothstep(0.73, 0.795, vSculptPos.y);
    float forwardBellyMask = smoothstep(0.11, 0.23, vSculptPos.z);

    float bellyBoundsMask = aboveLegsMask * belowUpperHandMask * forwardBellyMask;
    float wombWindow = (1.0 - smoothstep(0.58, 1.06, distToWomb)) * bellyBoundsMask;
    float wombGlowField = exp(-distToWomb * 1.65) * bellyBoundsMask;

    float baseContactRim = exp(-vSculptPos.y * 30.0) * 0.25 * uWarmLight;

    float internalScatter = wombGlowField * (0.48 + 0.52 * fresnel) * uWarmLight * uReveal;
    vec3 color = mix(bodyTone, bodyTone + uWombGlowColor * 0.52, internalScatter);
    color += uWombGlowColor * baseContactRim;

    vec3 H = normalize(keyDir + V);
    float specAtten = (1.0 - wombWindow * 0.65) * (1.0 - breastMask * 0.88);
    float spec = pow(max(dot(N, H), 0.0), 34.0) * 0.20 * specAtten;
    color = mix(color, uRimColor, rimFine * 0.40 * (1.0 - wombWindow * 0.45) * (1.0 - breastMask * 0.55));
    color += uRimColor * spec;

    float bellyEdgeFresnel = pow(1.0 - ndotv, 3.2);
    float windowAlpha = mix(uWombCenterAlpha, 0.58, bellyEdgeFresnel * 0.55);
    float targetAlpha = mix(1.0, windowAlpha, wombWindow * uReveal);

    gl_FragColor = vec4(color, targetAlpha);
  }
`;

// ============================================================================
// 3. ARCHITECTURAL ROMAN TRAVERTINE SLAB SHADER (Mobile-GPU Optimized: 2x fewer ALU ops)
// ============================================================================
const TRAVERTINE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vNormalLocal;
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;

  void main() {
    vLocalPos = position;
    vNormalLocal = normalize(normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TRAVERTINE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uStoneLight;
  uniform vec3 uStoneMid;
  uniform vec3 uStonePore;
  uniform vec3 uGlowColor;
  uniform float uWarmLight;
  uniform float uDarkTheme;

  varying vec3 vLocalPos;
  varying vec3 vNormalLocal;
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;

  float hash3(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(hash3(i + vec3(0, 0, 0)), hash3(i + vec3(1, 0, 0)), f.x),
        mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x),
        f.y
      ),
      mix(
        mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x),
        mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x),
        f.y
      ),
      f.z
    );
  }

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);

    // 1. Horizontal Sedimentary Bedding Veins (1 trilinear lookup + analytical harmonics)
    vec3 veinCoord = vec3(vLocalPos.x * 3.6, vLocalPos.y * 34.0, vLocalPos.z * 3.6);
    float n1 = noise3(veinCoord);
    float veins = sin(vLocalPos.y * 68.0 + n1 * 5.2 + sin(vLocalPos.x * 9.0 + n1 * 3.1) * 1.1) * 0.5 + 0.5;
    float fineGrain = fract(sin(dot(floor(vLocalPos * 140.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);

    // 2. Natural Capillary Travertine Pores (2 trilinear lookups instead of 4)
    vec3 poreCoord = vec3(vLocalPos.x * 34.0, vLocalPos.y * 145.0, vLocalPos.z * 34.0);
    float poreCoarse = noise3(poreCoord);
    float poreFine = noise3(poreCoord * 2.3 + vec3(2.3, 5.1, 1.9));
    float poreNoise = poreCoarse * 0.60 + poreFine * 0.40;
    float isSideFace = 1.0 - smoothstep(0.4, 0.8, abs(vNormalLocal.y));

    float macroPore = (1.0 - smoothstep(0.19, 0.25, poreNoise)) * isSideFace;
    float microPore = (1.0 - smoothstep(0.21, 0.27, poreFine)) * mix(0.22, 0.80, isSideFace);
    float poreMask = clamp(macroPore * 0.72 + microPore * 0.52, 0.0, 1.0);

    vec3 stoneColor = mix(uStoneMid, uStoneLight, veins * 0.68 + fineGrain * 0.32);
    stoneColor = mix(stoneColor, uStonePore, poreMask * 0.68);

    // 3. Architectural Studio Lighting & Bevel Highlight
    vec3 keyDir = normalize(vec3(0.45, 0.72, 0.68));
    vec3 fillDir = normalize(vec3(-0.60, 0.48, 0.52));
    float diffKey = clamp(dot(N, keyDir), 0.0, 1.0);
    float diffFill = clamp(dot(N, fillDir), 0.0, 1.0);
    float topMask = smoothstep(0.2, 0.9, vNormalLocal.y);

    float lighting = mix(0.76, 1.04, diffKey * 0.65 + diffFill * 0.35) * mix(0.93, 1.03, topMask);
    vec3 color = stoneColor * lighting;

    vec3 H = normalize(keyDir + V);
    float bevelSpec = pow(max(dot(N, H), 0.0), 32.0) * 0.12 * (1.0 - poreMask);
    color += vec3(1.0, 0.98, 0.94) * bevelSpec;

    // 4. Embedded 2700K Up-Light on Top Face
    if (vNormalLocal.y > 0.1) {
      float radialDist = length(vLocalPos.xz * vec2(1.0, 1.18));
      float upLightRing = exp(-pow((radialDist - 0.33) * 5.8, 2.0));
      float upLightCore = 1.0 - smoothstep(0.0, 0.39, radialDist);
      float topGlow = (upLightRing * 0.55 + upLightCore * 0.42) * uWarmLight;
      color += uGlowColor * topGlow * mix(0.38, 0.68, uDarkTheme);
    }

    // 5. Underside reflection from brass cove
    if (vNormalLocal.y < -0.3) {
      color += uGlowColor * uWarmLight * mix(0.35, 0.65, uDarkTheme);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================================================
// 4. RECESSED BRUSHED BRASS & 2700K LED COVE PLINTH SHADER
// ============================================================================
const BRASS_PLINTH_VERTEX_SHADER = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;

  void main() {
    vLocalPos = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BRASS_PLINTH_FRAGMENT_SHADER = /* glsl */ `
  uniform float uWarmLight;
  uniform float uDarkTheme;

  varying vec3 vLocalPos;
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);

    vec3 brassDark = vec3(0.48, 0.34, 0.18);
    vec3 brassLight = vec3(0.88, 0.68, 0.40);
    vec3 ledWarm = vec3(1.0, 0.72, 0.32);

    vec3 keyDir = normalize(vec3(0.5, 0.6, 0.7));
    float diff = clamp(dot(N, keyDir) * 0.5 + 0.5, 0.0, 1.0);
    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 36.0);

    vec3 brassColor = mix(brassDark, brassLight, diff) + vec3(1.0, 0.90, 0.70) * spec * 0.35;
    float topCoveFactor = smoothstep(-0.012, 0.016, vLocalPos.y);
    vec3 finalColor = mix(brassColor, ledWarm * 1.15, topCoveFactor * uWarmLight * mix(0.75, 0.95, uDarkTheme));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ============================================================================
// 5. RECTANGULAR FLOOR SHADOW & WARM 2700K SPILL HALO SHADER
// ============================================================================
const FLOOR_GLOW_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLOOR_GLOW_FRAGMENT_SHADER = /* glsl */ `
  uniform float uWarmLight;
  uniform float uDarkTheme;

  varying vec2 vUv;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    float d = sdRoundBox(vUv, vec2(0.62, 0.62), 0.06);
    float shadow = 1.0 - smoothstep(-0.04, 0.18, d);
    float warmHalo = exp(-max(0.0, d + 0.02) * 5.0) * (1.0 - smoothstep(0.15, 0.44, d));

    vec3 shadowColor = mix(vec3(0.76, 0.70, 0.62), vec3(0.04, 0.03, 0.02), uDarkTheme);
    vec3 glowColor = vec3(1.0, 0.66, 0.26);

    float alpha = clamp(shadow * mix(0.34, 0.58, uDarkTheme) + warmHalo * uWarmLight * mix(0.42, 0.66, uDarkTheme), 0.0, 0.88);
    vec3 color = mix(shadowColor, glowColor, clamp(warmHalo * uWarmLight * 1.38, 0.0, 1.0));

    gl_FragColor = vec4(color, alpha);
  }
`;

interface SculptureMeshesProps {
  progressRef: React.MutableRefObject<number>;
  finishId: ResinFinishId;
  warmLightOn: boolean;
  sanctuaryDark: boolean;
  isMobile: boolean;
}

const SculptureMeshes: React.FC<SculptureMeshesProps> = ({
  progressRef,
  finishId,
  warmLightOn,
  sanctuaryDark,
  isMobile,
}) => {
  const { gl, scene, camera, invalidate } = useThree();
  const madreGltf = useGLTF(MADRE_MODEL_URL, DRACO_URL);
  const bebeGltf = useGLTF(BEBE_MODEL_URL, DRACO_URL);

  const groupRef = useRef<THREE.Group>(null);

  const currentReveal = useRef(0.95);
  const currentWarm = useRef(warmLightOn ? 1.0 : 0.12);
  const currentDark = useRef(sanctuaryDark ? 1.0 : 0.0);
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

  const targetStoneLight = useMemo(
    () => new THREE.Color(sanctuaryDark ? '#DED2C1' : '#F3ECE1'),
    [sanctuaryDark]
  );
  const targetStoneMid = useMemo(
    () => new THREE.Color(sanctuaryDark ? '#BAA995' : '#DFD3C2'),
    [sanctuaryDark]
  );
  const targetStonePore = useMemo(
    () => new THREE.Color(sanctuaryDark ? '#70604E' : '#9C8A74'),
    [sanctuaryDark]
  );

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
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      depthFunc: THREE.LessEqualDepth,
      side: THREE.FrontSide,
    });
  }, []);

  const travertineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: TRAVERTINE_VERTEX_SHADER,
      fragmentShader: TRAVERTINE_FRAGMENT_SHADER,
      uniforms: {
        uStoneLight: { value: new THREE.Color('#F3ECE1') },
        uStoneMid: { value: new THREE.Color('#DFD3C2') },
        uStonePore: { value: new THREE.Color('#9C8A74') },
        uGlowColor: { value: new THREE.Color('#FFA84C') },
        uWarmLight: { value: 1.0 },
        uDarkTheme: { value: 0.0 },
      },
    });
  }, []);

  const brassPlinthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: BRASS_PLINTH_VERTEX_SHADER,
      fragmentShader: BRASS_PLINTH_FRAGMENT_SHADER,
      uniforms: {
        uWarmLight: { value: 1.0 },
        uDarkTheme: { value: 0.0 },
      },
    });
  }, []);

  const floorGlowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: FLOOR_GLOW_VERTEX_SHADER,
      fragmentShader: FLOOR_GLOW_FRAGMENT_SHADER,
      uniforms: {
        uWarmLight: { value: 1.0 },
        uDarkTheme: { value: 0.0 },
      },
      transparent: true,
      depthWrite: false,
    });
  }, []);

  const topApertureMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFB866'),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
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
    const speed = dt * 6.5;

    const p = progressRef.current;
    const targetReveal = 0.35 + Math.min(1, p * 1.35) * 0.65;
    const targetRotY = THREE.MathUtils.lerp(-0.42, 0.38, p);
    const targetWarm = warmLightOn ? 1.0 : 0.08;
    const targetDark = sanctuaryDark ? 1.0 : 0.0;

    currentReveal.current = THREE.MathUtils.lerp(currentReveal.current, targetReveal, speed);
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, speed);
    currentWarm.current = THREE.MathUtils.lerp(currentWarm.current, targetWarm, speed);
    currentDark.current = THREE.MathUtils.lerp(currentDark.current, targetDark, speed);

    if (groupRef.current) {
      groupRef.current.rotation.y = currentRotY.current;
    }

    madreFrontMaterial.uniforms.uReveal.value = currentReveal.current;
    madreFrontMaterial.uniforms.uWarmLight.value = currentWarm.current;
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

    travertineMaterial.uniforms.uStoneLight.value.lerp(targetStoneLight, speed);
    travertineMaterial.uniforms.uStoneMid.value.lerp(targetStoneMid, speed);
    travertineMaterial.uniforms.uStonePore.value.lerp(targetStonePore, speed);
    travertineMaterial.uniforms.uGlowColor.value.lerp(targetGlowColor, speed);
    travertineMaterial.uniforms.uWarmLight.value = currentWarm.current;
    travertineMaterial.uniforms.uDarkTheme.value = currentDark.current;

    brassPlinthMaterial.uniforms.uWarmLight.value = currentWarm.current;
    brassPlinthMaterial.uniforms.uDarkTheme.value = currentDark.current;

    floorGlowMaterial.uniforms.uWarmLight.value = currentWarm.current;
    floorGlowMaterial.uniforms.uDarkTheme.value = currentDark.current;

    topApertureMaterial.opacity = THREE.MathUtils.lerp(0.1, 0.55, currentWarm.current);

    const revealDiff = Math.abs(targetReveal - currentReveal.current);
    const rotDiff = Math.abs(targetRotY - currentRotY.current);
    const warmDiff = Math.abs(targetWarm - currentWarm.current);
    const darkDiff = Math.abs(targetDark - currentDark.current);
    const colorDiff =
      Math.abs(madreFrontMaterial.uniforms.uShellColor.value.r - targetShellColor.r) +
      Math.abs(madreFrontMaterial.uniforms.uShellColor.value.g - targetShellColor.g);

    if (
      revealDiff > 0.002 ||
      rotDiff > 0.002 ||
      warmDiff > 0.002 ||
      darkDiff > 0.002 ||
      colorDiff > 0.003
    ) {
      invalidate();
    }
  });

  const slabSmoothness = isMobile ? 2 : 4;
  const ringSegments = isMobile ? 40 : 64;

  return (
    <group ref={groupRef} position={[0, -0.62, 0]} scale={0.80} rotation={[0, 0.06, 0]}>
      <group position={[-0.01, 0.21, 0.095]} scale={0.275}>
        <primitive object={bebeScene} />
      </group>

      <primitive object={madreDepthScene} position={[0, 0, 0]} scale={1} />
      <primitive object={madreFrontScene} position={[0, 0, 0]} scale={1} />

      <group position={[0, 0, 0.01]}>
        <RoundedBox
          args={[1.34, 0.132, 1.34]}
          radius={0.008}
          smoothness={slabSmoothness}
          position={[0, -0.066, 0]}
          material={travertineMaterial}
        />

        <mesh position={[0, 0.001, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.29, 0.38, ringSegments]} />
          <primitive object={topApertureMaterial} attach="material" />
        </mesh>

        <RoundedBox
          args={[1.12, 0.042, 1.12]}
          radius={0.004}
          smoothness={2}
          position={[0, -0.151, 0]}
          material={brassPlinthMaterial}
        />

        <mesh position={[0, -0.173, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.86, 1.86]} />
          <primitive object={floorGlowMaterial} attach="material" />
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

export interface SculptureStage3DProps {
  progressRef: React.MutableRefObject<number>;
  finishId: ResinFinishId;
  sanctuaryDark: boolean;
  invalidateRef: React.MutableRefObject<(() => void) | null>;
  isMobile: boolean;
}

const SculptureStage3D: React.FC<SculptureStage3DProps> = ({
  progressRef,
  finishId,
  sanctuaryDark,
  invalidateRef,
  isMobile,
}) => {
  return (
    <Canvas
      frameloop="demand"
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0.03, 2.95], fov: 40 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? 'default' : 'high-performance',
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
          isMobile={isMobile}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={isMobile ? 0.08 : 0.045}
        rotateSpeed={isMobile ? 0.85 : 0.75}
        minPolarAngle={Math.PI / 4.2}
        maxPolarAngle={Math.PI / 1.85}
        target={[0, -0.02, 0]}
      />
    </Canvas>
  );
};

export default SculptureStage3D;
