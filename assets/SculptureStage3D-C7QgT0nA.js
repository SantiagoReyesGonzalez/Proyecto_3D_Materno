import{j as e,C as Ae,A as Ee,u as le,b as U,d as t,S as y,F as re,L as Le,M as Ne,e as Fe,f as te,B as _e,g as Z,h as ne,H as I,R as $,V as ae,O as Te,i as d}from"./three-vendor-Clhz_nA_.js";import{r as o}from"./ui-vendor-DoKJ_vWQ.js";import{a as L}from"./index-BfIbvCK1.js";const H={full:{pos:[0,.03,2.95],target:[0,-.02,0]},womb:{pos:[.1,-.14,1.38],target:[-.01,-.2,.14]},plaque:{pos:[0,-.44,1.56],target:[0,-.66,.42]}},K="https://www.gstatic.com/draco/versioned/decoders/1.5.7/",se="/Proyecto_3D_Materno/models/Madre.glb",ce="/Proyecto_3D_Materno/models/bebe.glb";U.preload(se,K);U.preload(ce,K);const ke=`
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
`,je=`
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
    float sssFactor = (wombWrap * 0.50 + sssBand * 0.40) * (0.35 + 0.65 * uWarmLight);

    vec3 color = mix(baseShading, uSssColor, clamp(sssFactor * 0.48, 0.0, 0.58));
    color += uSssColor * (wombWrap * 0.18 * uWarmLight);

    float ndotv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.5);
    color += vec3(1.0, 0.93, 0.82) * fresnel * (0.28 + 0.18 * uWarmLight);

    vec3 H = normalize(keyDir + V);
    float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.14;
    color += vec3(1.0, 0.97, 0.92) * spec;

    // Volumetric 3D Prenatal Ultrasound Holographic Overlay
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
`,ie=`
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
`,ze=`
  void main() {
    gl_FragColor = vec4(0.0);
  }
`,Be=`
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
    float spec = pow(max(dot(N, H), 0.0), 34.0) * 0.22 * specAtten;
    color = mix(color, uRimColor, rimFine * 0.46 * (1.0 - wombWindow * 0.45) * (1.0 - breastMask * 0.55));
    color += uRimColor * spec;

    float bellyEdgeFresnel = pow(1.0 - ndotv, 3.2);
    float windowAlpha = mix(uWombCenterAlpha, 0.56, bellyEdgeFresnel * 0.55);
    float targetAlpha = mix(1.0, windowAlpha, wombWindow * uReveal);

    gl_FragColor = vec4(color, targetAlpha);
  }
`,Ve=`
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
`,Ge=`
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
`,He=`
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
`,Ie=`
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
`,Ue=`
  varying vec2 vUv;

  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ke=`
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
`,Oe=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,qe=`
  varying vec2 vUv;
  uniform float uStrength;

  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    float d = length(centered * vec2(1.0, 0.85));
    float halo = exp(-d * 2.55) * (1.0 - smoothstep(0.62, 1.0, d));
    gl_FragColor = vec4(1.0, 0.72, 0.34, halo * uStrength);
  }
`,Xe=`
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
`,Ye=`
  uniform float uAlpha;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float soft = pow(max(0.0, 1.0 - d * 2.0), 2.2);
    gl_FragColor = vec4(1.0, 0.84, 0.54, soft * uAlpha * vTwinkle);
  }
`,Ze=({progressRef:P,finishId:D,warmLightOn:n,sanctuaryDark:r,isMobile:a,cameraPreset:l,ultrasoundMode:m,engravedText:h,showHotspots:W,onSelectCameraPreset:g})=>{const{gl:S,scene:b,camera:A,invalidate:x}=le(),E=U(se,K),_=U(ce,K),O=o.useRef(null),T=o.useRef(.95),f=o.useRef(n?1:0),M=o.useRef(r?1:0),k=o.useRef(m?1:0),j=o.useRef(.06),u=L[D],q=o.useMemo(()=>new t(r?u.darkShell:u.lightShell),[u,r]),me=o.useMemo(()=>new t(r?u.darkDeep:u.lightDeep),[u,r]),ue=o.useMemo(()=>new t(r?u.darkRim:u.lightRim),[u,r]),J=o.useMemo(()=>new t(u.wombGlowColor),[u]),ve=o.useMemo(()=>new t(r?"#DED2C1":"#F3ECE1"),[r]),pe=o.useMemo(()=>new t(r?"#BAA995":"#DFD3C2"),[r]),de=o.useMemo(()=>new t(r?"#70604E":"#9C8A74"),[r]),z=o.useMemo(()=>new y({vertexShader:ke,fragmentShader:je,uniforms:{uSkinColor:{value:new t("#F5D5BC")},uSssColor:{value:new t("#F2954E")},uDeepShadowColor:{value:new t("#C49574")},uWarmLight:{value:n?1:0},uUltrasoundMode:{value:m?1:0}},depthWrite:!0,depthTest:!0}),[]),Q=o.useMemo(()=>new y({vertexShader:ie,fragmentShader:ze,colorWrite:!1,depthWrite:!0,depthTest:!0,side:re}),[]),v=o.useMemo(()=>new y({vertexShader:ie,fragmentShader:Be,uniforms:{uShellColor:{value:new t(L.porcelain_silk.lightShell)},uDeepColor:{value:new t(L.porcelain_silk.lightDeep)},uRimColor:{value:new t(L.porcelain_silk.lightRim)},uWombGlowColor:{value:new t(L.porcelain_silk.wombGlowColor)},uReveal:{value:.95},uWarmLight:{value:n?1:0},uWombCenterAlpha:{value:L.porcelain_silk.wombCenterAlpha}},transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:Le,side:re}),[]),R=o.useMemo(()=>new y({vertexShader:Ve,fragmentShader:Ge,uniforms:{uStoneLight:{value:new t("#F3ECE1")},uStoneMid:{value:new t("#DFD3C2")},uStonePore:{value:new t("#9C8A74")},uGlowColor:{value:new t("#FFA84C")},uWarmLight:{value:n?1:0},uDarkTheme:{value:r?1:0}}}),[]),X=o.useMemo(()=>new y({vertexShader:He,fragmentShader:Ie,uniforms:{uWarmLight:{value:n?1:0},uDarkTheme:{value:r?1:0}}}),[]),fe=o.useMemo(()=>new Ne({color:new t("#C9A46B"),metalness:.72,roughness:.3}),[]),Y=o.useMemo(()=>new y({vertexShader:Ue,fragmentShader:Ke,uniforms:{uWarmLight:{value:n?1:0},uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1}),[]),ee=o.useMemo(()=>new Fe({color:new t("#FFB866"),transparent:!0,opacity:n?.55:0,depthWrite:!1}),[]),oe=o.useMemo(()=>new y({vertexShader:Oe,fragmentShader:qe,uniforms:{uStrength:{value:n&&r?.48:.12}},transparent:!0,depthWrite:!1,blending:te}),[]),B=o.useMemo(()=>{const s=new Float32Array(108),p=new Float32Array(36),i=new Float32Array(36);for(let c=0;c<36;c++){const N=c*2.39996,F=.52+c*37%100/100*.85,G=-.68+c*53%100/100*1.55;s[c*3]=Math.cos(N)*F,s[c*3+1]=G,s[c*3+2]=Math.sin(N)*F*.72,p[c]=.75+c*19%100/100*1.35,i[c]=c*.42}const C=new _e;C.setAttribute("position",new Z(s,3)),C.setAttribute("aScale",new Z(p,1)),C.setAttribute("aPhase",new Z(i,1));const V=new y({vertexShader:Xe,fragmentShader:Ye,uniforms:{uPhaseShift:{value:.5},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,a?1.25:1.5)},uAlpha:{value:r?.75:.25}},transparent:!0,depthWrite:!1,blending:te});return{geometry:C,material:V}},[a]),he=o.useMemo(()=>{const w=_.scene.clone(!0);return w.traverse(s=>{if(s.isMesh){const p=s;p.material=z,p.renderOrder=1}}),w},[_.scene,z]),ge=o.useMemo(()=>{const w=E.scene.clone(!0);return w.traverse(s=>{if(s.isMesh){const p=s;p.material=Q,p.renderOrder=2}}),w},[E.scene,Q]),xe=o.useMemo(()=>{const w=E.scene.clone(!0);return w.traverse(s=>{if(s.isMesh){const p=s;p.material=v,p.renderOrder=3}}),w},[E.scene,v]);o.useEffect(()=>{S.compile(b,A),x()},[S,b,A,x]),o.useEffect(()=>{x()},[D,n,r,l,m,h,x]),ne((w,s)=>{const i=Math.min(s,.05)*6.5,C=P.current,V=l==="womb"||m?1:.45+Math.min(1,C*1.25)*.55,c=l==="plaque"?0:l==="womb"?.08:d.lerp(-.42,.38,C),N=n?1:0,F=r?1:0,G=m?1:0;T.current=d.lerp(T.current,V,i),j.current=d.lerp(j.current,c,i),f.current=d.lerp(f.current,N,i),M.current=d.lerp(M.current,F,i),k.current=d.lerp(k.current,G,i),O.current&&(O.current.rotation.y=j.current),v.uniforms.uReveal.value=T.current,v.uniforms.uWarmLight.value=f.current,v.uniforms.uShellColor.value.lerp(q,i),v.uniforms.uDeepColor.value.lerp(me,i),v.uniforms.uRimColor.value.lerp(ue,i),v.uniforms.uWombGlowColor.value.lerp(J,i),v.uniforms.uWombCenterAlpha.value=d.lerp(v.uniforms.uWombCenterAlpha.value,u.wombCenterAlpha,i),z.uniforms.uWarmLight.value=f.current,z.uniforms.uUltrasoundMode.value=k.current,R.uniforms.uStoneLight.value.lerp(ve,i),R.uniforms.uStoneMid.value.lerp(pe,i),R.uniforms.uStonePore.value.lerp(de,i),R.uniforms.uGlowColor.value.lerp(J,i),R.uniforms.uWarmLight.value=f.current,R.uniforms.uDarkTheme.value=M.current,X.uniforms.uWarmLight.value=f.current,X.uniforms.uDarkTheme.value=M.current,Y.uniforms.uWarmLight.value=f.current,Y.uniforms.uDarkTheme.value=M.current,ee.opacity=d.lerp(0,.55,f.current),oe.uniforms.uStrength.value=d.lerp(.08,.52,M.current)*d.lerp(.2,1,f.current),B.material.uniforms.uPhaseShift.value=C,B.material.uniforms.uAlpha.value=d.lerp(.18,.85,M.current)*d.lerp(.35,1,f.current);const Ce=Math.abs(V-T.current),ye=Math.abs(c-j.current),De=Math.abs(N-f.current),Re=Math.abs(F-M.current),Pe=Math.abs(G-k.current),We=Math.abs(v.uniforms.uShellColor.value.r-q.r)+Math.abs(v.uniforms.uShellColor.value.g-q.g);(Ce>.002||ye>.002||De>.002||Re>.002||Pe>.002||We>.003)&&x()});const we=a?2:4,Se=a?40:64,be=h.trim()||"EMILIANO · SEMANA 28",Me=h.trim().length>0||l==="plaque";return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{position:[0,-.02,-.72],renderOrder:0,children:[e.jsx("planeGeometry",{args:[2.8,3.2]}),e.jsx("primitive",{object:oe,attach:"material"})]}),e.jsx("points",{geometry:B.geometry,material:B.material,renderOrder:4}),e.jsxs("group",{ref:O,position:[0,-.62,0],scale:.8,rotation:[0,.06,0],children:[e.jsx("group",{position:[-.01,.21,.095],scale:.275,children:e.jsx("primitive",{object:he})}),e.jsx("primitive",{object:ge,position:[0,0,0],scale:1}),e.jsx("primitive",{object:xe,position:[0,0,0],scale:1}),W&&l==="full"&&g&&e.jsxs(e.Fragment,{children:[e.jsx(I,{position:[.24,.49,.34],center:!0,zIndexRange:[12,0],children:e.jsxs("button",{type:"button",onClick:()=>g("womb"),className:"pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B1714]/85 text-[#FAF7F2] border border-[#D4B07B]/70 text-[10px] tracking-wide whitespace-nowrap shadow-md hover:border-[#D4B07B] transition-transform hover:scale-105",children:[e.jsx("span",{className:"w-2 h-2 rounded-full bg-[#D4B07B] hotspot-pulse"}),e.jsx("span",{children:"Ver bebé en el vientre"})]})}),e.jsx(I,{position:[-.36,-.01,.68],center:!0,zIndexRange:[12,0],children:e.jsxs("button",{type:"button",onClick:()=>g("plaque"),className:"pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B1714]/85 text-[#FAF7F2] border border-[#D4B07B]/70 text-[10px] tracking-wide whitespace-nowrap shadow-md hover:border-[#D4B07B] transition-transform hover:scale-105",children:[e.jsx("span",{className:"text-[#D4B07B]",children:"✦"}),e.jsx("span",{children:"Placa grabada"})]})})]}),e.jsxs("group",{position:[0,0,.01],children:[e.jsx($,{args:[1.34,.132,1.34],radius:.008,smoothness:we,position:[0,-.066,0],material:R}),e.jsx($,{args:[.56,.048,.014],radius:.002,smoothness:2,position:[0,-.066,.672],material:fe}),Me&&e.jsx(I,{position:[0,-.066,.684],center:!0,zIndexRange:[15,0],children:e.jsx("div",{className:"pointer-events-none select-none px-3 py-0.5 bg-gradient-to-b from-[#E5C996] via-[#C8A164] to-[#A67D42] border border-[#F5DFB6]/70 shadow-sm whitespace-nowrap",children:e.jsx("span",{className:"font-serif italic text-[11px] sm:text-xs tracking-[0.14em] text-[#231C14] font-medium block",children:be})})}),e.jsxs("mesh",{position:[0,.001,-.01],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[.29,.38,Se]}),e.jsx("primitive",{object:ee,attach:"material"})]}),e.jsx($,{args:[1.12,.042,1.12],radius:.004,smoothness:2,position:[0,-.151,0],material:X}),e.jsxs("mesh",{position:[0,-.173,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.86,1.86]}),e.jsx("primitive",{object:Y,attach:"material"})]})]})]})]})},$e=({cameraPreset:P,cameraMoveNonce:D,isMobile:n,onUserOrbitStart:r})=>{const a=o.useRef(null),{camera:l,invalidate:m}=le(),h=o.useRef(!1),W=o.useRef(!1),g=o.useRef(new ae(...H.full.pos)),S=o.useRef(new ae(...H.full.target));return o.useEffect(()=>{!W.current&&a.current&&(a.current.target.set(...H.full.target),a.current.update(),W.current=!0)},[]),o.useEffect(()=>{const b=H[P];g.current.set(...b.pos),S.current.set(...b.target),D>0&&(h.current=!0,m())},[P,D,m]),ne((b,A)=>{if(!h.current||!a.current)return;const x=Math.min(1,A*4.5);l.position.lerp(g.current,x),a.current.target.lerp(S.current,x),a.current.update();const E=l.position.distanceTo(g.current),_=a.current.target.distanceTo(S.current);E<.006&&_<.006?(l.position.copy(g.current),a.current.target.copy(S.current),a.current.update(),h.current=!1):m()}),e.jsx(Te,{ref:a,makeDefault:!0,enablePan:!1,enableZoom:!1,enableDamping:!0,dampingFactor:n?.08:.045,rotateSpeed:n?.85:.75,minPolarAngle:Math.PI/4.2,maxPolarAngle:Math.PI/1.85,onStart:()=>{h.current=!1,r==null||r()}})},Je=()=>e.jsx(I,{center:!0,children:e.jsx("div",{className:"px-5 py-2.5 bg-[#FAF7F2]/95 border border-[#E5DEC9] text-center shadow-sm whitespace-nowrap rounded-full",children:e.jsx("p",{className:"font-serif italic text-sm text-[#8C6D46]",children:"Desvelando escultura..."})})}),ro=({progressRef:P,finishId:D,warmLightOn:n,sanctuaryDark:r,invalidateRef:a,isMobile:l,cameraPreset:m,cameraMoveNonce:h,ultrasoundMode:W,engravedText:g,showHotspots:S,onSelectCameraPreset:b,onUserOrbitStart:A})=>e.jsxs(Ae,{frameloop:"demand",dpr:l?[1,1.25]:[1,1.5],camera:{position:[0,.03,2.95],fov:40},gl:{antialias:!l,alpha:!0,powerPreference:l?"default":"high-performance",toneMapping:Ee,toneMappingExposure:1.04},onCreated:({invalidate:x})=>{a.current=x},style:{touchAction:"pan-y"},className:"cursor-grab active:cursor-grabbing w-full h-full",children:[e.jsx("ambientLight",{intensity:.95,color:"#fffcf8"}),e.jsx("directionalLight",{position:[2.5,3.5,2.5],intensity:1.15,color:"#fffdfa"}),e.jsx(o.Suspense,{fallback:e.jsx(Je,{}),children:e.jsx(Ze,{progressRef:P,finishId:D,warmLightOn:n,sanctuaryDark:r,isMobile:l,cameraPreset:m,ultrasoundMode:W,engravedText:g,showHotspots:S,onSelectCameraPreset:b})}),e.jsx($e,{cameraPreset:m,cameraMoveNonce:h,isMobile:l,onUserOrbitStart:A})]});export{ro as default};
