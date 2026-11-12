import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, useGLTF, Html } from '@react-three/drei';
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
// Includes warm 2700K up-light rising from the Roman Travertine pedestal!
// ============================================================================
const MOTHER_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vSculptPos;
  varying vec3 vSmoothBreastNormalWorld;

  void main() {
    // Intrinsic anatomical coordinates of Madre.glb (after its +90deg X node rotation):
    // x: left/right [-0.49, +0.49]
    // y: vertical height from the bottom of the sculpture on the stone [0.00, 1.903]
    // z: back-to-front depth [-0.43, +0.43] (front of belly is up to +0.43)
    vSculptPos = vec3(position.x, -position.z, position.y);

    // Smooth analytical breast normal in raw object space to eliminate the pinched/coarse
    // nipple facets on the chest (y in 0.89..1.07, z in 0.06..0.195, |x| in 0.03..0.22)
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
  uniform float uGroupRotY;

  varying vec3 vNormalWorld;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vSculptPos;
  varying vec3 vSmoothBreastNormalWorld;

  void main() {
    // 1. Smooth Breast / Nipple Region Mask in intrinsic sculpture coordinates
    // Smooths out the pointed nipple facets (y~0.965, z<=0.176) into a soft neoclassical contour
    // while strictly excluding the upper forearm/hand in front (y<0.94, z>0.182)
    float breastYMask = smoothstep(0.915, 0.945, vSculptPos.y) * (1.0 - smoothstep(1.045, 1.085, vSculptPos.y));
    float breastXMask = smoothstep(0.035, 0.065, abs(vSculptPos.x)) * (1.0 - smoothstep(0.190, 0.225, abs(vSculptPos.x)));
    float breastZMask = smoothstep(0.070, 0.105, vSculptPos.z) * (1.0 - smoothstep(0.174, 0.184, vSculptPos.z));
    float breastMask = breastYMask * breastXMask * breastZMask;

    vec3 N = normalize(mix(normalize(vNormalWorld), normalize(vSmoothBreastNormalWorld), breastMask * 0.92));
    vec3 V = normalize(vViewDir);

    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.15);
    float rimFine = pow(1.0 - ndotv, 3.4);

    // Soft museum studio lighting
    vec3 keyDir = normalize(vec3(0.48, 0.76, 0.68));
    vec3 fillDir = normalize(vec3(-0.65, 0.42, 0.52));

    float diffKey = clamp((dot(N, keyDir) + 0.68) / 1.68, 0.0, 1.0);
    float diffFill = clamp((dot(N, fillDir) + 0.58) / 1.58, 0.0, 1.0);
    float hemi = 0.6 + 0.4 * N.y;

    // Creamy porcelain/alabaster sculptural shading
    float lightMix = clamp(diffKey * 0.72 + diffFill * 0.28, 0.0, 1.0);
    vec3 bodyTone = mix(uDeepColor, uShellColor, lightMix);
    bodyTone = mix(bodyTone, uShellColor, hemi * 0.25);

    // 2. Intrinsic Belly Womb Window in vSculptPos (100% locked to the Mother's belly dome!)
    // Baby spans vSculptPos.y in [0.21, 0.73]; Belly dome spans vSculptPos.y in [0.23, 0.78]
    vec3 wombCenter = vec3(-0.01, 0.51, 0.33);
    vec3 dWomb = (vSculptPos - wombCenter) / vec3(0.28, 0.31, 0.26);
    float distToWomb = length(dWomb);

    // Strict anatomical boundaries:
    // - Thighs & legs (vSculptPos.y < 0.22) are 100% OPAQUE (never transparent)
    float aboveLegsMask = smoothstep(0.22, 0.30, vSculptPos.y);
    // - Upper belly stays open over the baby's head (up to y = 0.74), closing right under the upper hand (y > 0.79)
    float belowUpperHandMask = 1.0 - smoothstep(0.73, 0.795, vSculptPos.y);
    // - Front belly hemisphere only (z > 0.12)
    float forwardBellyMask = smoothstep(0.11, 0.23, vSculptPos.z);

    float bellyBoundsMask = aboveLegsMask * belowUpperHandMask * forwardBellyMask;
    float wombWindow = (1.0 - smoothstep(0.58, 1.06, distToWomb)) * bellyBoundsMask;
    float wombGlowField = exp(-distToWomb * 1.65) * bellyBoundsMask;

    // Subtle warm 2700K contact reflection only at the very bottom rim (y < 0.05) where the opaque thighs meet the stone
    float baseContactRim = exp(-vSculptPos.y * 30.0) * 0.25 * uWarmLight;

    // Combine Womb Subsurface Glow (strictly inside the belly) + subtle base rim reflection
    float internalScatter = wombGlowField * (0.48 + 0.52 * fresnel) * uWarmLight * uReveal;
    vec3 color = mix(bodyTone, bodyTone + uWombGlowColor * 0.52, internalScatter);
    color += uWombGlowColor * baseContactRim;

    // Silky pearl specular & Fresnel rim highlights (softened on breasts to avoid shiny nipple spots)
    vec3 H = normalize(keyDir + V);
    float specAtten = (1.0 - wombWindow * 0.65) * (1.0 - breastMask * 0.88);
    float spec = pow(max(dot(N, H), 0.0), 34.0) * 0.20 * specAtten;
    color = mix(color, uRimColor, rimFine * 0.40 * (1.0 - wombWindow * 0.45) * (1.0 - breastMask * 0.55));
    color += uRimColor * spec;

    // Crystal-Clear Subtle Womb Alpha focused strictly on the belly dome
    float bellyEdgeFresnel = pow(1.0 - ndotv, 3.2);
    float windowAlpha = mix(uWombCenterAlpha, 0.58, bellyEdgeFresnel * 0.55);
    float targetAlpha = mix(1.0, windowAlpha, wombWindow * uReveal);

    gl_FragColor = vec4(color, targetAlpha);
  }
`;

// ============================================================================
// 3. ARCHITECTURAL ROMAN TRAVERTINE SLAB SHADER
// Procedural sedimentary veins, natural pitted stone pores, top caustic up-light,
// and warm 2700K under-lip bounce light (matches reference photos!)
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

  // Fast 3D procedural hash & value noise for authentic Roman Travertine stone
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

    // 1. Horizontal Sedimentary Bedding Veins (stretched along X and Z, compressed along Y)
    vec3 veinCoord = vec3(vLocalPos.x * 3.6, vLocalPos.y * 34.0, vLocalPos.z * 3.6);
    float n1 = noise3(veinCoord);
    float n2 = noise3(veinCoord * 2.5 + vec3(4.1, 1.7, 8.3));
    float veins = sin(vLocalPos.y * 68.0 + n1 * 4.5 + n2 * 2.2) * 0.5 + 0.5;
    float fineGrain = noise3(vLocalPos * 42.0);

    // 2. Fine Natural Capillary Travertine Pores (delicate horizontal pitting like Italian Roman Travertine)
    vec3 poreCoord = vec3(vLocalPos.x * 34.0, vLocalPos.y * 145.0, vLocalPos.z * 34.0);
    float poreNoise = noise3(poreCoord) * 0.60 + noise3(poreCoord * 2.4 + vec3(2.3, 5.1, 1.9)) * 0.40;
    vec3 microCoord = vec3(vLocalPos.x * 72.0, vLocalPos.y * 210.0, vLocalPos.z * 72.0);
    float microNoise = noise3(microCoord);
    float isSideFace = 1.0 - smoothstep(0.4, 0.8, abs(vNormalLocal.y));

    // Delicate capillary pores on the cut vertical faces, honed smooth on top
    float macroPore = (1.0 - smoothstep(0.19, 0.25, poreNoise)) * isSideFace;
    float microPore = (1.0 - smoothstep(0.21, 0.27, microNoise)) * mix(0.25, 0.85, isSideFace);
    float poreMask = clamp(macroPore * 0.72 + microPore * 0.55, 0.0, 1.0);

    // Base stone color with sedimentary bands & delicate pore occlusion
    vec3 stoneColor = mix(uStoneMid, uStoneLight, veins * 0.65 + fineGrain * 0.35);
    stoneColor = mix(stoneColor, uStonePore, poreMask * 0.68);

    // 3. Architectural Studio Lighting & Bevel Highlight
    vec3 keyDir = normalize(vec3(0.45, 0.72, 0.68));
    vec3 fillDir = normalize(vec3(-0.60, 0.48, 0.52));
    float diffKey = clamp(dot(N, keyDir), 0.0, 1.0);
    float diffFill = clamp(dot(N, fillDir), 0.0, 1.0);
    float topMask = smoothstep(0.2, 0.9, vNormalLocal.y);

    float lighting = mix(0.76, 1.04, diffKey * 0.65 + diffFill * 0.35) * mix(0.93, 1.03, topMask);
    vec3 color = stoneColor * lighting;

    // Subtle honed stone bevel specular
    vec3 H = normalize(keyDir + V);
    float bevelSpec = pow(max(dot(N, H), 0.0), 32.0) * 0.12 * (1.0 - poreMask);
    color += vec3(1.0, 0.98, 0.94) * bevelSpec;

    // 4. Embedded 2700K Up-Light on Top Face (glowing softly right under the sculpture's base)
    if (vNormalLocal.y > 0.1) {
      float radialDist = length(vLocalPos.xz * vec2(1.0, 1.18));
      // Warm light ring right where the translucent resin base meets the travertine stone
      float upLightRing = exp(-pow((radialDist - 0.33) * 5.8, 2.0));
      float upLightCore = 1.0 - smoothstep(0.0, 0.39, radialDist);
      float topGlow = (upLightRing * 0.55 + upLightCore * 0.42) * uWarmLight;
      color += uGlowColor * topGlow * mix(0.38, 0.68, uDarkTheme);
    }

    // 5. Underside only (vNormalLocal.y < -0.5) catches the warm 2700K brass cove reflection
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

    // Brushed champagne-gold metallic base
    vec3 brassDark = vec3(0.48, 0.34, 0.18);
    vec3 brassLight = vec3(0.88, 0.68, 0.40);
    vec3 ledWarm = vec3(1.0, 0.72, 0.32);

    vec3 keyDir = normalize(vec3(0.5, 0.6, 0.7));
    float diff = clamp(dot(N, keyDir) * 0.5 + 0.5, 0.0, 1.0);
    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 36.0);

    vec3 brassColor = mix(brassDark, brassLight, diff) + vec3(1.0, 0.90, 0.70) * spec * 0.35;

    // Intense 2700K LED cove light strip along the upper recess (where the travertine overhangs)
    // vLocalPos.y is in [-0.017, +0.017]
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

  // 2D rounded box signed distance
  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    // 1:1 Square SDF matching the square travertine & recessed brass plinth proportions
    float d = sdRoundBox(vUv, vec2(0.62, 0.62), 0.06);

    // Crisp contact shadow right under the brass sub-plinth
    float shadow = 1.0 - smoothstep(-0.04, 0.18, d);
    // Soft warm 2700K light spill radiating around the square plinth perimeter
    float warmHalo = exp(-max(0.0, d + 0.02) * 5.0) * (1.0 - smoothstep(0.15, 0.44, d));

    vec3 shadowColor = mix(vec3(0.76, 0.70, 0.62), vec3(0.04, 0.03, 0.02), uDarkTheme);
    vec3 glowColor = vec3(1.0, 0.66, 0.26);

    float alpha = clamp(shadow * mix(0.34, 0.58, uDarkTheme) + warmHalo * uWarmLight * mix(0.42, 0.66, uDarkTheme), 0.0, 0.88);
    vec3 color = mix(shadowColor, glowColor, clamp(warmHalo * uWarmLight * 1.38, 0.0, 1.0));

    gl_FragColor = vec4(color, alpha);
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

  // Travertine stone palette (adapts subtly between Day Atelier and Night Sanctuary)
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

  // Architectural Roman Travertine Material
  const travertineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: TRAVERTINE_VERTEX_SHADER,
      fragmentShader: TRAVERTINE_FRAGMENT_SHADER,
      uniforms: {
        uStoneLight: { value: new THREE.Color('#EDE4D7') },
        uStoneMid: { value: new THREE.Color('#D6C8B4') },
        uStonePore: { value: new THREE.Color('#9E8D79') },
        uGlowColor: { value: new THREE.Color('#FFA84C') },
        uWarmLight: { value: 1.0 },
        uDarkTheme: { value: 0.0 },
      },
    });
  }, []);

  // Recessed Brushed Brass & LED Cove Material
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

  // Soft Floor Contact Shadow & Warm 2700K Halo Material
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

  // Top Optical Diffuser Ring (subtle warm glass aperture where the sculpture sits on the stone)
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
    const speed = dt * 6.0;

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

    // Update Mother uniforms
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

    // Update Baby SSS uniform
    bebeMaterial.uniforms.uWarmLight.value = currentWarm.current;

    // Update Roman Travertine & Brass Plinth uniforms
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
      revealDiff > 0.001 ||
      rotDiff > 0.001 ||
      warmDiff > 0.001 ||
      darkDiff > 0.001 ||
      colorDiff > 0.002
    ) {
      invalidate();
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.62, 0]} scale={0.80} rotation={[0, 0.06, 0]}>
      {/* Pass 1: Baby with Subsurface Scattering */}
      <group position={[-0.01, 0.21, 0.095]} scale={0.275}>
        <primitive object={bebeScene} />
      </group>

      {/* Pass 2: Bit-Identical Shader Depth Pre-Pass */}
      <primitive object={madreDepthScene} position={[0, 0, 0]} scale={1} />

      {/* Pass 3: Mother Creamy Porcelain & Localized Womb Window */}
      <primitive object={madreFrontScene} position={[0, 0, 0]} scale={1} />

      {/* =====================================================================
          ARCHITECTURAL SQUARE ROMAN TRAVERTINE SLAB & RECESSED BRASS 2700K PLINTH
          Generous 1:1 square proportions matching reference photography:
          wide porous travertine stone block over a recessed warm golden brass sub-base
          ===================================================================== */}
      <group position={[0, 0, 0.01]}>
        {/* 1. Upper Hand-Cut 1:1 Square Roman Travertine Stone Slab with micro-chamfered edges */}
        <RoundedBox
          args={[1.34, 0.132, 1.34]}
          radius={0.008}
          smoothness={4}
          position={[0, -0.066, 0]}
          material={travertineMaterial}
        />

        {/* 2. Subtle Embedded Optical Up-Light Aperture on Top of the Stone (under the torso) */}
        <mesh position={[0, 0.001, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.29, 0.38, 64]} />
          <primitive object={topApertureMaterial} attach="material" />
        </mesh>

        {/* 3. Recessed 1:1 Square Brushed Champagne-Brass Sub-Plinth with 2700K Cove Light Strip */}
        <RoundedBox
          args={[1.12, 0.042, 1.12]}
          radius={0.004}
          smoothness={2}
          position={[0, -0.151, 0]}
          material={brassPlinthMaterial}
        />

        {/* 4. Soft Architectural Square Floor Contact Shadow & Warm 2700K Light Spill */}
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

  const renderControlsDock = () => (
    <div
      className={`inline-flex items-center gap-3.5 px-4 py-2.5 rounded-full border backdrop-blur-md transition-all duration-300 shadow-sm ${
        sanctuaryDark
          ? 'bg-[#26211D]/90 border-[#3D352E]'
          : 'bg-[#FAF7F2]/90 border-[#E5DEC9]'
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
  );

  const renderOrderCta = () => (
    <button
      type="button"
      onClick={() => openOrderModal()}
      className={`inline-flex items-center gap-3.5 px-5 py-2.5 rounded-full border text-[11px] uppercase tracking-[0.22em] backdrop-blur-md transition-all duration-300 group whitespace-nowrap ${
        sanctuaryDark
          ? 'bg-[#26211D]/90 border-[#D4B07B]/50 text-[#FAF7F2] hover:border-[#D4B07B]'
          : 'bg-[#FAF7F2]/90 border-[#2C2825]/30 text-[#2C2825] hover:border-[#8C6D46] hover:text-[#8C6D46]'
      }`}
    >
      <span>Encargar esta Obra</span>
      <span className="text-[#8C6D46] group-hover:translate-x-1 transition-transform">
        →
      </span>
    </button>
  );

  return (
    <section
      ref={sectionRef}
      id="visor-3d"
      style={{ backgroundColor: bgColor }}
      className="scroll-mt-20 relative w-full border-t border-[#E5DEC9] overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Editorial Column: Dedicated zone, ZERO overlap with 3D sculpture on any screen */}
          <div className="lg:col-span-5 pt-14 pb-4 lg:py-20 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="space-y-3 max-w-md">
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
                className={`text-sm sm:text-[15px] font-light leading-relaxed transition-colors duration-300 ${
                  sanctuaryDark ? 'text-[#C8BFB5]' : 'text-[#6E665E]'
                }`}
              >
                Al deslizar o girar la pieza, la porcelana sedosa desvela a tu bebé sobre piedra
                travertino con luz cálida de 2700K.
              </p>
            </div>

            {/* Desktop Interactive Dock & CTA tucked cleanly beneath the editorial text */}
            <div className="hidden lg:flex flex-wrap items-center gap-4 pt-3">
              {renderControlsDock()}
              {renderOrderCta()}
            </div>
          </div>

          {/* Right / Center Dedicated 3D Stage: Unobstructed Sculpture */}
          <div
            className="lg:col-span-7 relative h-[450px] sm:h-[540px] lg:h-[680px] w-full"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={() => {
              if (!hasInteracted) setHasInteracted(true);
            }}
          >
            <Canvas
              frameloop="demand"
              dpr={[1, 1.5]}
              camera={{ position: [0, 0.03, 2.95], fov: 40 }}
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
                target={[0, -0.02, 0]}
              />
            </Canvas>

            {/* Subtle Disappearing Gesture Hint: Top-right on desktop */}
            <div
              className={`pointer-events-none absolute top-8 right-4 z-10 hidden lg:flex items-center gap-2 transition-opacity duration-700 ${
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
          </div>
        </div>

        {/* Mobile & Tablet Controls Bar: Safely BELOW the 3D stage (Zero overlap) */}
        <div className="lg:hidden pb-12 pt-1 flex flex-col items-center gap-4">
          <div
            className={`pointer-events-none flex items-center gap-2 transition-opacity duration-700 ${
              hasInteracted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-75'
            }`}
          >
            <span
              className={`font-serif italic text-xs ${
                sanctuaryDark ? 'text-[#D4B07B]' : 'text-[#8C6D46]'
              }`}
            >
              Desliza para girar · 360°
            </span>
          </div>
          <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
            {renderControlsDock()}
            {renderOrderCta()}
          </div>
        </div>
      </div>
    </section>
  );
};
