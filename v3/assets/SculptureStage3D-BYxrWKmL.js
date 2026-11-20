import{j as o,r as e}from"./ui-vendor-CLKMo3Kf.js";import{C as Oe,A as Ue,u as Pe,a as le,b as n,S as F,F as ye,L as qe,M as me,c as Ie,d as Xe,e as Ke,f as ue,D as Ye,B as Ze,g as ve,h as Ae,R as ae,H as $e,V as Re,O as Je,i as p}from"./three-vendor-DBR3oiYj.js";const P={porcelain_silk:{id:"porcelain_silk",hint:"Porcelana Marfil",shortName:"Marfil",subtitle:"Alabastro satinado clásico",swatchGradient:"radial-gradient(circle at 32% 30%, #FFFFFF 0%, #F3ECE1 55%, #D8CBB8 100%)",swatchBorder:"#C8B9A6",lightShell:"#FBF8F3",lightDeep:"#DFD2C0",lightRim:"#FFFFFF",darkShell:"#F0E4D4",darkDeep:"#5C4433",darkRim:"#FFF8EC",wombGlowColor:"#FFB861",wombCenterAlpha:.06},champagne_quartz:{id:"champagne_quartz",hint:"Cuarzo Champán",shortName:"Champán",subtitle:"Difusión cálida perlada",swatchGradient:"radial-gradient(circle at 32% 30%, #FFFDF9 0%, #E6D3B8 55%, #BFA382 100%)",swatchBorder:"#B59B7C",lightShell:"#F6EFE4",lightDeep:"#D1BEA5",lightRim:"#FFFDF9",darkShell:"#EAD6BC",darkDeep:"#563D2B",darkRim:"#FFF3DF",wombGlowColor:"#FFA845",wombCenterAlpha:.05},honey_amber:{id:"honey_amber",hint:"Ámbar Dorado",shortName:"Ámbar",subtitle:"Resplandor miel envolvente",swatchGradient:"radial-gradient(circle at 32% 30%, #FFE8C2 0%, #D9A76A 55%, #A67338 100%)",swatchBorder:"#9E6E36",lightShell:"#F4E8D6",lightDeep:"#C5AC8C",lightRim:"#FFF9EE",darkShell:"#E2C399",darkDeep:"#4F3522",darkRim:"#FFECC8",wombGlowColor:"#FF982E",wombCenterAlpha:.04}},ie={full:{pos:[0,.04,4.25],target:[0,-.02,0]},womb:{pos:[.12,-.14,1.98],target:[-.01,-.2,.14]},plaque:{pos:[0,-.44,2.24],target:[0,-.66,.42]}},ne="https://www.gstatic.com/draco/versioned/decoders/1.5.7/",We="/Proyecto_3D_Materno/v3/models/Madre.glb",Le="/Proyecto_3D_Materno/v3/models/bebe.glb";le.preload(We,ne);le.preload(Le,ne);const Qe=`
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
`,eo=`
  uniform vec3 uSkinColor;
  uniform vec3 uSssColor;
  uniform vec3 uDeepShadowColor;
  uniform float uWarmLight;
  uniform float uUltrasoundMode;

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
    float sssFactor = (wombWrap * 0.50 + sssBand * 0.40) * (0.20 + 0.80 * uWarmLight);

    vec3 color = mix(baseShading, uSssColor, clamp(sssFactor * 0.48, 0.0, 0.58));
    color += uSssColor * (wombWrap * 0.20 * uWarmLight);

    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.5);
    color += vec3(1.0, 0.93, 0.82) * fresnel * (0.24 + 0.22 * uWarmLight);

    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.14;
    color += vec3(1.0, 0.97, 0.92) * spec;

    float scanLines = 0.76 + 0.24 * sin(vWorldPos.y * 190.0);
    float echoRim = pow(1.0 - ndotv, 1.75);
    float echoRelief = clamp(diffKey * 0.8 + wombWrap * 0.25, 0.0, 1.0);
    vec3 usDeep = vec3(0.30, 0.19, 0.09);
    vec3 usBright = vec3(0.96, 0.77, 0.46);
    vec3 ultrasoundColor = mix(usDeep, usBright, smoothstep(0.18, 0.92, echoRelief)) * scanLines;
    ultrasoundColor += vec3(1.0, 0.88, 0.62) * echoRim * 0.92;

    color = mix(color, ultrasoundColor, clamp(uUltrasoundMode, 0.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`,Fe=`
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
`,oo=`
  void main() {
    gl_FragColor = vec4(0.0);
  }
`,ro=`
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
    float fresnel = pow(1.0 - ndotv, 2.05);
    float rimFine = pow(1.0 - ndotv, 3.2);

    vec3 keyDir = normalize(vec3(0.48, 0.76, 0.68));
    vec3 fillDir = normalize(vec3(-0.65, 0.42, 0.52));

    float diffKey = clamp((dot(N, keyDir) + 0.68) / 1.68, 0.0, 1.0);
    float diffFill = clamp((dot(N, fillDir) + 0.58) / 1.58, 0.0, 1.0);
    float hemi = 0.6 + 0.4 * N.y;

    float lightMix = clamp(diffKey * 0.72 + diffFill * 0.28, 0.0, 1.0);
    vec3 bodyTone = mix(uDeepColor, uShellColor, lightMix);
    bodyTone = mix(bodyTone, uShellColor, hemi * 0.28);

    vec3 wombCenter = vec3(-0.01, 0.51, 0.33);
    vec3 dWomb = (vSculptPos - wombCenter) / vec3(0.28, 0.31, 0.26);
    float distToWomb = length(dWomb);

    float aboveLegsMask = smoothstep(0.22, 0.30, vSculptPos.y);
    float belowUpperHandMask = 1.0 - smoothstep(0.73, 0.795, vSculptPos.y);
    float forwardBellyMask = smoothstep(0.11, 0.23, vSculptPos.z);

    float bellyBoundsMask = aboveLegsMask * belowUpperHandMask * forwardBellyMask;
    float wombWindow = (1.0 - smoothstep(0.58, 1.06, distToWomb)) * bellyBoundsMask;
    float wombGlowField = exp(-distToWomb * 1.45) * bellyBoundsMask;
    float torsoSubsurface = exp(-length(vSculptPos - vec3(0.0, 0.68, 0.16)) * 1.8) * 0.45 * uWarmLight;

    float baseContactRim = exp(-vSculptPos.y * 28.0) * 0.28 * uWarmLight;

    float internalScatter = (wombGlowField * (0.52 + 0.48 * fresnel) + torsoSubsurface * fresnel) * uWarmLight * uReveal;
    vec3 color = mix(bodyTone, bodyTone + uWombGlowColor * 0.64, clamp(internalScatter, 0.0, 0.92));
    color += uWombGlowColor * baseContactRim;

    vec3 H = normalize(keyDir + V);
    float specAtten = (1.0 - wombWindow * 0.65) * (1.0 - breastMask * 0.88);
    float spec = pow(max(dot(N, H), 0.0), 34.0) * 0.24 * specAtten;
    float velvetSheen = pow(1.0 - ndotv, 4.0) * (0.28 + 0.26 * uWarmLight);
    color = mix(color, uRimColor, rimFine * 0.48 * (1.0 - wombWindow * 0.45) * (1.0 - breastMask * 0.55));
    color += mix(uRimColor, uWombGlowColor, 0.32 * uWarmLight) * velvetSheen * (1.0 - breastMask * 0.45);
    color += uRimColor * spec;

    float bellyEdgeFresnel = pow(1.0 - ndotv, 3.2);
    float windowAlpha = mix(uWombCenterAlpha, 0.56, bellyEdgeFresnel * 0.55);
    float targetAlpha = mix(1.0, windowAlpha, wombWindow * uReveal);

    gl_FragColor = vec4(color, targetAlpha);
  }
`,to=`
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
`,ao=`
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

    vec3 veinCoord = vec3(vLocalPos.x * 3.6, vLocalPos.y * 34.0, vLocalPos.z * 3.6);
    float n1 = noise3(veinCoord);
    float veins = sin(vLocalPos.y * 68.0 + n1 * 5.2 + sin(vLocalPos.x * 9.0 + n1 * 3.1) * 1.1) * 0.5 + 0.5;
    float fineGrain = fract(sin(dot(floor(vLocalPos * 140.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);

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

    if (vNormalLocal.y > 0.1) {
      float radialDist = length(vLocalPos.xz * vec2(1.0, 1.18));
      float upLightRing = exp(-pow((radialDist - 0.33) * 5.8, 2.0));
      float upLightCore = 1.0 - smoothstep(0.0, 0.39, radialDist);
      float topGlow = (upLightRing * 0.55 + upLightCore * 0.42) * uWarmLight;
      color += uGlowColor * topGlow * mix(0.38, 0.68, uDarkTheme);
    }

    if (vNormalLocal.y < -0.3) {
      color += uGlowColor * uWarmLight * mix(0.35, 0.65, uDarkTheme);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`,io=`
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
`,lo=`
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
`,no=`
  varying vec2 vUv;
  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,so=`
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

    float alpha = clamp(shadow * mix(0.32, 0.56, uDarkTheme) + warmHalo * uWarmLight * mix(0.42, 0.66, uDarkTheme), 0.0, 0.88);
    vec3 color = mix(shadowColor, glowColor, clamp(warmHalo * uWarmLight * 1.38, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
  }
`,co=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,mo=`
  varying vec2 vUv;
  uniform float uStrength;
  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    float d = length(centered * vec2(1.0, 0.85));
    float halo = exp(-d * 2.55) * (1.0 - smoothstep(0.62, 1.0, d));
    gl_FragColor = vec4(1.0, 0.72, 0.34, halo * uStrength);
  }
`,uo=`
  attribute float aScale;
  attribute float aPhase;
  uniform float uPhaseShift;
  uniform float uPixelRatio;
  varying float vTwinkle;

  void main() {
    vec3 p = position;
    p.y += sin(aPhase + uPhaseShift * 4.5) * 0.05;
    p.x += cos(aPhase * 1.3 + uPhaseShift * 3.2) * 0.03;
    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aScale * uPixelRatio * (22.0 / max(1.0, -mvPos.z));
    vTwinkle = 0.55 + 0.45 * sin(aPhase + uPhaseShift * 6.0);
  }
`,vo=`
  uniform float uAlpha;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float soft = pow(max(0.0, 1.0 - d * 2.0), 2.2);
    gl_FragColor = vec4(1.0, 0.84, 0.54, soft * uAlpha * vTwinkle);
  }
`,po=`
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,fo=`
  uniform float uDarkTheme;
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);
    float ndotv = abs(dot(N, V));
    float rim = pow(1.0 - clamp(ndotv, 0.0, 1.0), 2.8);
    vec3 keyDir = normalize(vec3(0.42, 0.72, 0.65));
    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 56.0) * 0.38;
    vec3 glassTint = mix(vec3(0.86, 0.90, 0.92), vec3(0.96, 0.90, 0.82), uDarkTheme);
    vec3 finalGlass = glassTint + vec3(1.0, 0.96, 0.90) * spec;
    float alpha = clamp(0.035 + rim * 0.34 + spec * 0.45, 0.03, 0.56);
    gl_FragColor = vec4(finalGlass, alpha);
  }
`,ho=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,go=`
  uniform float uWarmLight;
  uniform float uDarkTheme;
  uniform float uOpacityScale;
  varying vec2 vUv;

  void main() {
    vec3 warmRing = vec3(0.98, 0.76, 0.46);
    vec3 dayRing = vec3(0.76, 0.49, 0.40);
    vec3 ringColor = mix(dayRing, warmRing, uDarkTheme);
    float glowAlpha = mix(0.20, 0.45 + 0.45 * uWarmLight, uDarkTheme) * uOpacityScale;
    gl_FragColor = vec4(ringColor, glowAlpha);
  }
`;function Ee(b,u){const t=b.getContext("2d");if(!t)return;const i=b.width,r=b.height,v=t.createLinearGradient(0,0,i,r);v.addColorStop(0,"#DFBE86"),v.addColorStop(.5,"#C79F5E"),v.addColorStop(1,"#9E7438"),t.fillStyle=v,t.fillRect(0,0,i,r),t.strokeStyle="rgba(255, 245, 224, 0.14)",t.lineWidth=1;for(let f=4;f<r;f+=6)t.beginPath(),t.moveTo(0,f),t.lineTo(i,f),t.stroke();t.strokeStyle="rgba(54, 38, 18, 0.45)",t.lineWidth=3,t.strokeRect(8,8,i-16,r-16);const a=(u.trim()||"EMILIANO · SEMANA 28").toUpperCase();t.fillStyle="#231C14",t.textAlign="center",t.textBaseline="middle",t.font='italic 500 36px "Cormorant Garamond", Georgia, serif',t.fillText(a,i/2,r/2+2,i-56)}const wo=({progressRef:b,tierId:u,finishId:t,warmIntensity:i,sanctuaryDark:r,isMobile:v,cameraPreset:a,cameraMoveNonce:f,ultrasoundMode:h,engravedText:C,showGlassDome:A,autoSpin:M,isStageActive:W,pointerTiltRef:D})=>{const{gl:k,scene:I,camera:de,invalidate:S}=Pe(),X=le(We,ne),pe=le(Le,ne),K=e.useRef(null),y=u===1?0:i,Y=e.useRef(.95),w=e.useRef(y),R=e.useRef(r?1:0),Z=e.useRef(h?1:0),$=e.useRef(.06),J=e.useRef(0),Q=e.useRef(0),L=e.useRef(0),V=e.useRef(!1),fe=e.useRef(0),x=P[t],he=e.useMemo(()=>new n(r?x.darkShell:x.lightShell),[x,r]),_e=e.useMemo(()=>new n(r?x.darkDeep:x.lightDeep),[x,r]),Ne=e.useMemo(()=>new n(r?x.darkRim:x.lightRim),[x,r]),ge=e.useMemo(()=>new n(x.wombGlowColor),[x]),Te=e.useMemo(()=>new n(r?"#DED2C1":"#F3ECE1"),[r]),ke=e.useMemo(()=>new n(r?"#BAA995":"#DFD3C2"),[r]),je=e.useMemo(()=>new n(r?"#70604E":"#9C8A74"),[r]),j=e.useMemo(()=>new F({vertexShader:Qe,fragmentShader:eo,uniforms:{uSkinColor:{value:new n("#F5D5BC")},uSssColor:{value:new n("#F2954E")},uDeepShadowColor:{value:new n("#C49574")},uWarmLight:{value:y},uUltrasoundMode:{value:h?1:0}},depthWrite:!0,depthTest:!0}),[]),ee=e.useMemo(()=>new F({vertexShader:Fe,fragmentShader:oo,colorWrite:!1,depthWrite:!0,depthTest:!0,side:ye}),[]),g=e.useMemo(()=>new F({vertexShader:Fe,fragmentShader:ro,uniforms:{uShellColor:{value:new n(r?P.porcelain_silk.darkShell:P.porcelain_silk.lightShell)},uDeepColor:{value:new n(r?P.porcelain_silk.darkDeep:P.porcelain_silk.lightDeep)},uRimColor:{value:new n(r?P.porcelain_silk.darkRim:P.porcelain_silk.lightRim)},uWombGlowColor:{value:new n(P.porcelain_silk.wombGlowColor)},uReveal:{value:.95},uWarmLight:{value:y},uWombCenterAlpha:{value:P.porcelain_silk.wombCenterAlpha}},transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:qe,side:ye}),[]),E=e.useMemo(()=>new F({vertexShader:to,fragmentShader:ao,uniforms:{uStoneLight:{value:new n(r?"#DED2C1":"#F3ECE1")},uStoneMid:{value:new n(r?"#BAA995":"#DFD3C2")},uStonePore:{value:new n(r?"#70604E":"#9C8A74")},uGlowColor:{value:new n("#FFA84C")},uWarmLight:{value:y},uDarkTheme:{value:r?1:0}}}),[]),se=e.useMemo(()=>new me({color:new n("#E6DDD0"),roughness:.72,metalness:.04}),[]),H=e.useMemo(()=>new F({vertexShader:io,fragmentShader:lo,uniforms:{uWarmLight:{value:y},uDarkTheme:{value:r?1:0}}}),[]),ce=e.useMemo(()=>new me({color:new n("#C7A163"),metalness:.7,roughness:.32}),[]),N=e.useMemo(()=>{const c=document.createElement("canvas");c.width=1024,c.height=84,Ee(c,"EMILIANO · SEMANA 28");const l=new Ie(c);l.colorSpace=Xe,l.anisotropy=4;const m=new me({map:l,metalness:.45,roughness:.34});return{canvas:c,texture:l,material:m}},[]);e.useEffect(()=>{Ee(N.canvas,C),N.texture.needsUpdate=!0,S()},[C,N,S]),e.useEffect(()=>()=>{N.texture.dispose(),N.material.dispose()},[N]);const z=e.useMemo(()=>new F({vertexShader:no,fragmentShader:so,uniforms:{uWarmLight:{value:y},uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1}),[]),oe=e.useMemo(()=>new Ke({color:new n("#FFB866"),transparent:!0,opacity:y*.55,depthWrite:!1}),[]),re=e.useMemo(()=>new F({vertexShader:co,fragmentShader:mo,uniforms:{uStrength:{value:r?.45*y:.08}},transparent:!0,depthWrite:!1,blending:ue}),[]),O=e.useMemo(()=>new F({vertexShader:po,fragmentShader:fo,uniforms:{uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1,side:Ye}),[]),G=e.useMemo(()=>new F({vertexShader:ho,fragmentShader:go,uniforms:{uWarmLight:{value:y},uDarkTheme:{value:r?1:0},uOpacityScale:{value:u===1?.35:.9}},transparent:!0,depthWrite:!1,blending:ue}),[]),T=e.useMemo(()=>{const l=new Float32Array(96),m=new Float32Array(32),s=new Float32Array(32);for(let d=0;d<32;d++){const U=d*2.39996,q=.54+d*37%100/100*.82,te=-.68+d*53%100/100*1.55;l[d*3]=Math.cos(U)*q,l[d*3+1]=te,l[d*3+2]=Math.sin(U)*q*.72,m[d]=.75+d*19%100/100*1.3,s[d]=d*.42}const _=new Ze;_.setAttribute("position",new ve(l,3)),_.setAttribute("aScale",new ve(m,1)),_.setAttribute("aPhase",new ve(s,1));const B=new F({vertexShader:uo,fragmentShader:vo,uniforms:{uPhaseShift:{value:.5},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,v?1.25:1.5)},uAlpha:{value:r?.7:.2}},transparent:!0,depthWrite:!1,blending:ue});return{geometry:_,material:B}},[v]),ze=e.useMemo(()=>{const c=pe.scene.clone(!0);return c.traverse(l=>{if(l.isMesh){const m=l;m.material=j,m.renderOrder=1}}),c},[pe.scene,j]),Ge=e.useMemo(()=>{const c=X.scene.clone(!0);return c.traverse(l=>{if(l.isMesh){const m=l;m.material=ee,m.renderOrder=2}}),c},[X.scene,ee]),Be=e.useMemo(()=>{const c=X.scene.clone(!0);return c.traverse(l=>{if(l.isMesh){const m=l;m.material=g,m.renderOrder=3}}),c},[X.scene,g]);e.useEffect(()=>{k.compile(I,de),S();const c=window.requestAnimationFrame(()=>S()),l=window.setTimeout(()=>S(),120);return()=>{window.cancelAnimationFrame(c),window.clearTimeout(l)}},[k,I,de,S]),e.useEffect(()=>{S()},[u,t,i,r,a,h,C,A,M,W,S]),e.useEffect(()=>()=>{j.dispose(),ee.dispose(),g.dispose(),E.dispose(),se.dispose(),H.dispose(),ce.dispose(),z.dispose(),oe.dispose(),re.dispose(),O.dispose(),G.dispose(),T.geometry.dispose(),T.material.dispose()},[j,ee,g,E,se,H,ce,z,oe,re,O,G,T]),e.useEffect(()=>{f>0&&!M&&(V.current=!0),M&&(V.current=!1),S()},[f,M,S]),Ae((c,l)=>{var Me,De;const m=Math.min(l,.05),s=m*6.5,_=b.current,B=Math.round(L.current/(Math.PI*2))*(Math.PI*2);a==="plaque"||a==="womb"||V.current?(L.current=p.lerp(L.current,B,s),Math.abs(L.current-B)<.002&&(L.current=B,V.current=!1)):M&&W&&(L.current+=m*.28,fe.current+=m*.35);const d=((Me=D==null?void 0:D.current)==null?void 0:Me.x)??0,U=((De=D==null?void 0:D.current)==null?void 0:De.y)??0;J.current=p.lerp(J.current,d*.12,s),Q.current=p.lerp(Q.current,U*.06,s);const q=a==="womb"||h?1:.48+Math.min(1,_*1.25)*.52,te=a==="plaque"?0:a==="womb"?.08:p.lerp(-.42,.38,_),Se=y,be=r?1:0,Ce=h?1:0;Y.current=p.lerp(Y.current,q,s),$.current=p.lerp($.current,te,s),w.current=p.lerp(w.current,Se,s),R.current=p.lerp(R.current,be,s),Z.current=p.lerp(Z.current,Ce,s),K.current&&(K.current.rotation.y=$.current+L.current+J.current,K.current.rotation.x=Q.current),g.uniforms.uReveal.value=Y.current,g.uniforms.uWarmLight.value=w.current,g.uniforms.uShellColor.value.lerp(he,s),g.uniforms.uDeepColor.value.lerp(_e,s),g.uniforms.uRimColor.value.lerp(Ne,s),g.uniforms.uWombGlowColor.value.lerp(ge,s),g.uniforms.uWombCenterAlpha.value=p.lerp(g.uniforms.uWombCenterAlpha.value,x.wombCenterAlpha,s),j.uniforms.uWarmLight.value=w.current,j.uniforms.uUltrasoundMode.value=Z.current,E.uniforms.uStoneLight.value.lerp(Te,s),E.uniforms.uStoneMid.value.lerp(ke,s),E.uniforms.uStonePore.value.lerp(je,s),E.uniforms.uGlowColor.value.lerp(ge,s),E.uniforms.uWarmLight.value=w.current,E.uniforms.uDarkTheme.value=R.current,H.uniforms.uWarmLight.value=w.current,H.uniforms.uDarkTheme.value=R.current,z.uniforms.uWarmLight.value=w.current,z.uniforms.uDarkTheme.value=R.current,O.uniforms.uDarkTheme.value=R.current,G.uniforms.uWarmLight.value=w.current,G.uniforms.uDarkTheme.value=R.current,G.uniforms.uOpacityScale.value=u===1?.35:.9,oe.opacity=p.lerp(0,.55,w.current),re.uniforms.uStrength.value=p.lerp(.05,.5,R.current)*w.current,T.material.uniforms.uPhaseShift.value=_+fe.current,T.material.uniforms.uAlpha.value=p.lerp(.14,.78,R.current)*p.lerp(.2,1,w.current);const He=a==="plaque"||a==="womb"||V.current?Math.abs(L.current-B):0;(Math.abs(q-Y.current)+Math.abs(te-$.current)+Math.abs(Se-w.current)+Math.abs(be-R.current)+Math.abs(Ce-Z.current)+Math.abs(d*.12-J.current)+Math.abs(U*.06-Q.current)+He+Math.abs(g.uniforms.uShellColor.value.r-he.r)>.002||M&&W&&a!=="plaque"&&a!=="womb")&&S()});const we=v?2:4,xe=v?40:64,Ve=u===1?.75:u===2?.8:.84;return o.jsxs(o.Fragment,{children:[o.jsxs("mesh",{position:[0,-.02,-.72],renderOrder:0,children:[o.jsx("planeGeometry",{args:[2.8,3.2]}),o.jsx("primitive",{object:re,attach:"material"})]}),o.jsxs("mesh",{position:[0,.04,-.44],renderOrder:0,children:[o.jsx("ringGeometry",{args:[.73,.765,xe]}),o.jsx("primitive",{object:G,attach:"material"})]}),o.jsx("points",{geometry:T.geometry,material:T.material,renderOrder:4}),o.jsxs("group",{ref:K,position:[0,-.62,0],scale:Ve,rotation:[0,.06,0],children:[o.jsx("group",{position:[-.01,.21,.095],scale:.275,children:o.jsx("primitive",{object:ze})}),o.jsx("primitive",{object:Ge,position:[0,0,0],scale:1}),o.jsx("primitive",{object:Be,position:[0,0,0],scale:1}),u===1?o.jsxs("group",{position:[0,0,.01],children:[o.jsx(ae,{args:[.98,.055,.98],radius:.008,smoothness:we,position:[0,-.027,0],material:se}),o.jsxs("mesh",{position:[0,-.058,0],rotation:[-Math.PI/2,0,0],children:[o.jsx("planeGeometry",{args:[1.45,1.45]}),o.jsx("primitive",{object:z,attach:"material"})]})]}):o.jsxs("group",{position:[0,0,.01],children:[o.jsx(ae,{args:[1.34,.132,1.34],radius:.008,smoothness:we,position:[0,-.066,0],material:E}),u===3&&o.jsxs("group",{position:[0,-.066,.672],children:[o.jsx(ae,{args:[.62,.052,.014],radius:.002,smoothness:2,material:ce}),o.jsxs("mesh",{position:[0,0,.0076],children:[o.jsx("planeGeometry",{args:[.59,.048]}),o.jsx("primitive",{object:N.material,attach:"material"})]})]}),o.jsxs("mesh",{position:[0,.001,-.01],rotation:[-Math.PI/2,0,0],children:[o.jsx("ringGeometry",{args:[.29,.38,xe]}),o.jsx("primitive",{object:oe,attach:"material"})]}),o.jsx(ae,{args:[1.12,.042,1.12],radius:.004,smoothness:2,position:[0,-.151,0],material:H}),o.jsxs("mesh",{position:[0,-.173,0],rotation:[-Math.PI/2,0,0],children:[o.jsx("planeGeometry",{args:[1.86,1.86]}),o.jsx("primitive",{object:z,attach:"material"})]})]}),A&&o.jsxs("group",{position:[0,0,.01],renderOrder:5,children:[o.jsx("mesh",{position:[0,.66,0],material:O,renderOrder:5,children:o.jsx("cylinderGeometry",{args:[.55,.55,1.32,40,1,!0]})}),o.jsx("mesh",{position:[0,1.32,0],material:O,renderOrder:5,children:o.jsx("sphereGeometry",{args:[.55,40,20,0,Math.PI*2,0,Math.PI/2]})})]})]})]})},xo=({cameraPreset:b,cameraMoveNonce:u,isMobile:t})=>{const i=e.useRef(null),{camera:r,invalidate:v}=Pe(),a=e.useRef(!1),f=e.useRef(!1),h=e.useRef(new Re(...ie.full.pos)),C=e.useRef(new Re(...ie.full.target));return e.useEffect(()=>{!f.current&&i.current&&(i.current.target.set(...ie.full.target),i.current.update(),f.current=!0)},[]),e.useEffect(()=>{const A=ie[b];h.current.set(...A.pos),C.current.set(...A.target),u>0&&(a.current=!0,v())},[b,u,v]),Ae((A,M)=>{if(!a.current||!i.current)return;const W=Math.min(1,M*4.5);r.position.lerp(h.current,W),i.current.target.lerp(C.current,W),i.current.update();const D=r.position.distanceTo(h.current),k=i.current.target.distanceTo(C.current);D<.006&&k<.006?(r.position.copy(h.current),i.current.target.copy(C.current),i.current.update(),a.current=!1):v()}),o.jsx(Je,{ref:i,makeDefault:!0,enablePan:!1,enableZoom:!1,enableDamping:!0,dampingFactor:t?.08:.045,rotateSpeed:t?.85:.75,minPolarAngle:Math.PI/4.2,maxPolarAngle:Math.PI/1.85,onStart:()=>{a.current=!1}})},So=()=>o.jsx($e,{center:!0,style:{pointerEvents:"none"},children:o.jsx("div",{className:"pointer-events-none px-5 py-2.5 bg-atelier-glass border border-atelier-border text-center shadow-sm whitespace-nowrap rounded-full",children:o.jsx("p",{className:"font-serif italic text-sm text-atelier-accent",children:"Preparando tu escultura 3D..."})})}),Do=({progressRef:b,tierId:u,finishId:t,warmIntensity:i,sanctuaryDark:r,invalidateRef:v,isMobile:a,cameraPreset:f,cameraMoveNonce:h,ultrasoundMode:C,engravedText:A,showGlassDome:M,autoSpin:W=!1,isStageActive:D=!0,pointerTiltRef:k})=>o.jsxs(Oe,{frameloop:"demand",dpr:a?[1,1.25]:[1,1.5],camera:{position:[0,.04,4.25],fov:28},gl:{antialias:!a,alpha:!0,powerPreference:a?"default":"high-performance",toneMapping:Ue,toneMappingExposure:1.04},onCreated:({invalidate:I})=>{v.current=I},style:{touchAction:"pan-y"},className:"cursor-grab active:cursor-grabbing w-full h-full",children:[o.jsx("ambientLight",{intensity:.95,color:"#fffcf8"}),o.jsx("directionalLight",{position:[2.5,3.5,2.5],intensity:1.15,color:"#fffdfa"}),o.jsx(e.Suspense,{fallback:o.jsx(So,{}),children:o.jsx(wo,{progressRef:b,tierId:u,finishId:t,warmIntensity:i,sanctuaryDark:r,isMobile:a,cameraPreset:f,cameraMoveNonce:h,ultrasoundMode:C,engravedText:A,showGlassDome:M,autoSpin:W,isStageActive:D,pointerTiltRef:k})}),o.jsx(xo,{cameraPreset:f,cameraMoveNonce:h,isMobile:a})]});export{Do as default};
