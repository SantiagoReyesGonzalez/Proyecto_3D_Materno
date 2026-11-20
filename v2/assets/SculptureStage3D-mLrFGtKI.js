import{j as e,C as Re,A as We,u as ue,b as K,d as i,S as P,F as le,L as Ee,M as $,e as Le,f as Ae,g as Ne,h as ne,D as _e,B as Te,i as J,k as ve,R as U,H as Fe,V as se,O as je,l as x}from"./three-vendor-DkJXRzao.js";import{r as o}from"./ui-vendor-CbrmmF2x.js";import{a as _}from"./index-CooxQmGs.js";const I={full:{pos:[0,.03,2.95],target:[0,-.02,0]},womb:{pos:[.1,-.14,1.38],target:[-.01,-.2,.14]},plaque:{pos:[0,-.44,1.56],target:[0,-.66,.42]}},q="https://www.gstatic.com/draco/versioned/decoders/1.5.7/",pe="/Proyecto_3D_Materno/v2/models/Madre.glb",de="/Proyecto_3D_Materno/v2/models/bebe.glb";K.preload(pe,q);K.preload(de,q);const ke=`
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
`,ze=`
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
`,ce=`
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
`,Ve=`
  void main() {
    gl_FragColor = vec4(0.0);
  }
`,Ge=`
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
`,Be=`
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
`,He=`
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
`,Oe=`
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
`,Ue=`
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
`,Ie=`
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

    float alpha = clamp(shadow * mix(0.32, 0.56, uDarkTheme) + warmHalo * uWarmLight * mix(0.42, 0.66, uDarkTheme), 0.0, 0.88);
    vec3 color = mix(shadowColor, glowColor, clamp(warmHalo * uWarmLight * 1.38, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
  }
`,qe=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Xe=`
  varying vec2 vUv;
  uniform float uStrength;
  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    float d = length(centered * vec2(1.0, 0.85));
    float halo = exp(-d * 2.55) * (1.0 - smoothstep(0.62, 1.0, d));
    gl_FragColor = vec4(1.0, 0.72, 0.34, halo * uStrength);
  }
`,Ye=`
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
`,Ze=`
  uniform float uAlpha;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float soft = pow(max(0.0, 1.0 - d * 2.0), 2.2);
    gl_FragColor = vec4(1.0, 0.84, 0.54, soft * uAlpha * vTwinkle);
  }
`,$e=`
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Je=`
  uniform float uDarkTheme;
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);
    float ndotv = abs(dot(N, V));
    float rim = pow(1.0 - clamp(ndotv, 0.0, 1.0), 2.8);
    vec3 glassTint = mix(vec3(0.86, 0.90, 0.92), vec3(0.96, 0.90, 0.82), uDarkTheme);
    float alpha = clamp(0.035 + rim * 0.34, 0.03, 0.42);
    gl_FragColor = vec4(glassTint, alpha);
  }
`;function me(w,d){const t=w.getContext("2d");if(!t)return;const a=w.width,r=w.height,u=t.createLinearGradient(0,0,a,r);u.addColorStop(0,"#DFBE86"),u.addColorStop(.5,"#C79F5E"),u.addColorStop(1,"#9E7438"),t.fillStyle=u,t.fillRect(0,0,a,r),t.strokeStyle="rgba(255, 245, 224, 0.14)",t.lineWidth=1;for(let c=4;c<r;c+=6)t.beginPath(),t.moveTo(0,c),t.lineTo(a,c),t.stroke();t.strokeStyle="rgba(54, 38, 18, 0.45)",t.lineWidth=3,t.strokeRect(8,8,a-16,r-16);const n=(d.trim()||"EMILIANO · SEMANA 28").toUpperCase();t.fillStyle="#231C14",t.textAlign="center",t.textBaseline="middle",t.font='italic 600 38px "Cormorant Garamond", Georgia, serif',t.fillText(n,a/2,r/2+2,a-56)}const Qe=({progressRef:w,tierId:d,finishId:t,warmIntensity:a,sanctuaryDark:r,isMobile:u,cameraPreset:n,ultrasoundMode:c,engravedText:S,showGlassDome:M})=>{const{gl:D,scene:A,camera:W,invalidate:b}=ue(),N=K(pe,q),Q=K(de,q),X=o.useRef(null),C=d===1?0:a,j=o.useRef(.95),h=o.useRef(C),y=o.useRef(r?1:0),k=o.useRef(c?1:0),z=o.useRef(.06),f=_[t],ee=o.useMemo(()=>new i(r?f.darkShell:f.lightShell),[f,r]),fe=o.useMemo(()=>new i(r?f.darkDeep:f.lightDeep),[f,r]),he=o.useMemo(()=>new i(r?f.darkRim:f.lightRim),[f,r]),oe=o.useMemo(()=>new i(f.wombGlowColor),[f]),ge=o.useMemo(()=>new i(r?"#DED2C1":"#F3ECE1"),[r]),xe=o.useMemo(()=>new i(r?"#BAA995":"#DFD3C2"),[r]),we=o.useMemo(()=>new i(r?"#70604E":"#9C8A74"),[r]),V=o.useMemo(()=>new P({vertexShader:ke,fragmentShader:ze,uniforms:{uSkinColor:{value:new i("#F5D5BC")},uSssColor:{value:new i("#F2954E")},uDeepShadowColor:{value:new i("#C49574")},uWarmLight:{value:C},uUltrasoundMode:{value:c?1:0}},depthWrite:!0,depthTest:!0}),[]),re=o.useMemo(()=>new P({vertexShader:ce,fragmentShader:Ve,colorWrite:!1,depthWrite:!0,depthTest:!0,side:le}),[]),g=o.useMemo(()=>new P({vertexShader:ce,fragmentShader:Ge,uniforms:{uShellColor:{value:new i(_.porcelain_silk.lightShell)},uDeepColor:{value:new i(_.porcelain_silk.lightDeep)},uRimColor:{value:new i(_.porcelain_silk.lightRim)},uWombGlowColor:{value:new i(_.porcelain_silk.wombGlowColor)},uReveal:{value:.95},uWarmLight:{value:C},uWombCenterAlpha:{value:_.porcelain_silk.wombCenterAlpha}},transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:Ee,side:le}),[]),E=o.useMemo(()=>new P({vertexShader:Be,fragmentShader:He,uniforms:{uStoneLight:{value:new i("#F3ECE1")},uStoneMid:{value:new i("#DFD3C2")},uStonePore:{value:new i("#9C8A74")},uGlowColor:{value:new i("#FFA84C")},uWarmLight:{value:C},uDarkTheme:{value:r?1:0}}}),[]),Se=o.useMemo(()=>new $({color:new i("#E6DDD0"),roughness:.72,metalness:.04}),[]),Y=o.useMemo(()=>new P({vertexShader:Oe,fragmentShader:Ue,uniforms:{uWarmLight:{value:C},uDarkTheme:{value:r?1:0}}}),[]),Me=o.useMemo(()=>new $({color:new i("#C7A163"),metalness:.7,roughness:.32}),[]),L=o.useMemo(()=>{const m=document.createElement("canvas");m.width=1024,m.height=84,me(m,"EMILIANO · SEMANA 28");const l=new Le(m);l.colorSpace=Ae,l.anisotropy=4;const p=new $({map:l,metalness:.45,roughness:.34});return{canvas:m,texture:l,material:p}},[]);o.useEffect(()=>{me(L.canvas,S),L.texture.needsUpdate=!0,b()},[S,L,b]),o.useEffect(()=>()=>{L.texture.dispose(),L.material.dispose()},[L]);const G=o.useMemo(()=>new P({vertexShader:Ie,fragmentShader:Ke,uniforms:{uWarmLight:{value:C},uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1}),[]),te=o.useMemo(()=>new Ne({color:new i("#FFB866"),transparent:!0,opacity:C*.55,depthWrite:!1}),[]),ae=o.useMemo(()=>new P({vertexShader:qe,fragmentShader:Xe,uniforms:{uStrength:{value:r?.45*C:.08}},transparent:!0,depthWrite:!1,blending:ne}),[]),Z=o.useMemo(()=>new P({vertexShader:$e,fragmentShader:Je,uniforms:{uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1,side:_e}),[]),B=o.useMemo(()=>{const l=new Float32Array(96),p=new Float32Array(32),s=new Float32Array(32);for(let v=0;v<32;v++){const T=v*2.39996,F=.54+v*37%100/100*.82,O=-.68+v*53%100/100*1.55;l[v*3]=Math.cos(T)*F,l[v*3+1]=O,l[v*3+2]=Math.sin(T)*F*.72,p[v]=.75+v*19%100/100*1.3,s[v]=v*.42}const R=new Te;R.setAttribute("position",new J(l,3)),R.setAttribute("aScale",new J(p,1)),R.setAttribute("aPhase",new J(s,1));const H=new P({vertexShader:Ye,fragmentShader:Ze,uniforms:{uPhaseShift:{value:.5},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,u?1.25:1.5)},uAlpha:{value:r?.7:.2}},transparent:!0,depthWrite:!1,blending:ne});return{geometry:R,material:H}},[u]),be=o.useMemo(()=>{const m=Q.scene.clone(!0);return m.traverse(l=>{if(l.isMesh){const p=l;p.material=V,p.renderOrder=1}}),m},[Q.scene,V]),Ce=o.useMemo(()=>{const m=N.scene.clone(!0);return m.traverse(l=>{if(l.isMesh){const p=l;p.material=re,p.renderOrder=2}}),m},[N.scene,re]),ye=o.useMemo(()=>{const m=N.scene.clone(!0);return m.traverse(l=>{if(l.isMesh){const p=l;p.material=g,p.renderOrder=3}}),m},[N.scene,g]);o.useEffect(()=>{D.compile(A,W),b()},[D,A,W,b]),o.useEffect(()=>{b()},[d,t,a,r,n,c,S,M,b]),ve((m,l)=>{const s=Math.min(l,.05)*6.5,R=w.current,H=n==="womb"||c?1:.48+Math.min(1,R*1.25)*.52,v=n==="plaque"?0:n==="womb"?.08:x.lerp(-.38,.34,R),T=C,F=r?1:0,O=c?1:0;j.current=x.lerp(j.current,H,s),z.current=x.lerp(z.current,v,s),h.current=x.lerp(h.current,T,s),y.current=x.lerp(y.current,F,s),k.current=x.lerp(k.current,O,s),X.current&&(X.current.rotation.y=z.current),g.uniforms.uReveal.value=j.current,g.uniforms.uWarmLight.value=h.current,g.uniforms.uShellColor.value.lerp(ee,s),g.uniforms.uDeepColor.value.lerp(fe,s),g.uniforms.uRimColor.value.lerp(he,s),g.uniforms.uWombGlowColor.value.lerp(oe,s),g.uniforms.uWombCenterAlpha.value=x.lerp(g.uniforms.uWombCenterAlpha.value,f.wombCenterAlpha,s),V.uniforms.uWarmLight.value=h.current,V.uniforms.uUltrasoundMode.value=k.current,E.uniforms.uStoneLight.value.lerp(ge,s),E.uniforms.uStoneMid.value.lerp(xe,s),E.uniforms.uStonePore.value.lerp(we,s),E.uniforms.uGlowColor.value.lerp(oe,s),E.uniforms.uWarmLight.value=h.current,E.uniforms.uDarkTheme.value=y.current,Y.uniforms.uWarmLight.value=h.current,Y.uniforms.uDarkTheme.value=y.current,G.uniforms.uWarmLight.value=h.current,G.uniforms.uDarkTheme.value=y.current,Z.uniforms.uDarkTheme.value=y.current,te.opacity=x.lerp(0,.55,h.current),ae.uniforms.uStrength.value=x.lerp(.05,.5,y.current)*h.current,B.material.uniforms.uPhaseShift.value=R,B.material.uniforms.uAlpha.value=x.lerp(.14,.78,y.current)*x.lerp(.2,1,h.current),Math.abs(H-j.current)+Math.abs(v-z.current)+Math.abs(T-h.current)+Math.abs(F-y.current)+Math.abs(O-k.current)+Math.abs(g.uniforms.uShellColor.value.r-ee.r)>.002&&b()});const ie=u?2:4,Pe=u?40:64,De=d===1?.75:d===2?.8:.84;return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{position:[0,-.02,-.72],renderOrder:0,children:[e.jsx("planeGeometry",{args:[2.8,3.2]}),e.jsx("primitive",{object:ae,attach:"material"})]}),e.jsx("points",{geometry:B.geometry,material:B.material,renderOrder:4}),e.jsxs("group",{ref:X,position:[0,-.62,0],scale:De,rotation:[0,.06,0],children:[e.jsx("group",{position:[-.01,.21,.095],scale:.275,children:e.jsx("primitive",{object:be})}),e.jsx("primitive",{object:Ce,position:[0,0,0],scale:1}),e.jsx("primitive",{object:ye,position:[0,0,0],scale:1}),d===1?e.jsxs("group",{position:[0,0,.01],children:[e.jsx(U,{args:[.98,.055,.98],radius:.008,smoothness:ie,position:[0,-.027,0],material:Se}),e.jsxs("mesh",{position:[0,-.058,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.45,1.45]}),e.jsx("primitive",{object:G,attach:"material"})]})]}):e.jsxs("group",{position:[0,0,.01],children:[e.jsx(U,{args:[1.34,.132,1.34],radius:.008,smoothness:ie,position:[0,-.066,0],material:E}),d===3&&e.jsxs("group",{position:[0,-.066,.672],children:[e.jsx(U,{args:[.62,.052,.014],radius:.002,smoothness:2,material:Me}),e.jsxs("mesh",{position:[0,0,.0076],children:[e.jsx("planeGeometry",{args:[.59,.048]}),e.jsx("primitive",{object:L.material,attach:"material"})]})]}),e.jsxs("mesh",{position:[0,.001,-.01],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[.29,.38,Pe]}),e.jsx("primitive",{object:te,attach:"material"})]}),e.jsx(U,{args:[1.12,.042,1.12],radius:.004,smoothness:2,position:[0,-.151,0],material:Y}),e.jsxs("mesh",{position:[0,-.173,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.86,1.86]}),e.jsx("primitive",{object:G,attach:"material"})]})]}),M&&e.jsxs("group",{position:[0,0,.01],renderOrder:5,children:[e.jsx("mesh",{position:[0,.66,0],material:Z,renderOrder:5,children:e.jsx("cylinderGeometry",{args:[.55,.55,1.32,40,1,!0]})}),e.jsx("mesh",{position:[0,1.32,0],material:Z,renderOrder:5,children:e.jsx("sphereGeometry",{args:[.55,40,20,0,Math.PI*2,0,Math.PI/2]})})]})]})]})},eo=({cameraPreset:w,cameraMoveNonce:d,isMobile:t})=>{const a=o.useRef(null),{camera:r,invalidate:u}=ue(),n=o.useRef(!1),c=o.useRef(!1),S=o.useRef(new se(...I.full.pos)),M=o.useRef(new se(...I.full.target));return o.useEffect(()=>{!c.current&&a.current&&(a.current.target.set(...I.full.target),a.current.update(),c.current=!0)},[]),o.useEffect(()=>{const D=I[w];S.current.set(...D.pos),M.current.set(...D.target),d>0&&(n.current=!0,u())},[w,d,u]),ve((D,A)=>{if(!n.current||!a.current)return;const W=Math.min(1,A*4.5);r.position.lerp(S.current,W),a.current.target.lerp(M.current,W),a.current.update();const b=r.position.distanceTo(S.current),N=a.current.target.distanceTo(M.current);b<.006&&N<.006?(r.position.copy(S.current),a.current.target.copy(M.current),a.current.update(),n.current=!1):u()}),e.jsx(je,{ref:a,makeDefault:!0,enablePan:!1,enableZoom:!1,enableDamping:!0,dampingFactor:t?.08:.045,rotateSpeed:t?.85:.75,minPolarAngle:Math.PI/4.2,maxPolarAngle:Math.PI/1.85,onStart:()=>{n.current=!1}})},oo=()=>e.jsx(Fe,{center:!0,style:{pointerEvents:"none"},children:e.jsx("div",{className:"pointer-events-none px-5 py-2.5 bg-[#FAF7F2]/95 border border-[#E2D9C8] text-center shadow-sm whitespace-nowrap rounded-full",children:e.jsx("p",{className:"font-serif italic text-sm text-[#755936]",children:"Desvelando estudio 3D..."})})}),lo=({progressRef:w,tierId:d,finishId:t,warmIntensity:a,sanctuaryDark:r,invalidateRef:u,isMobile:n,cameraPreset:c,cameraMoveNonce:S,ultrasoundMode:M,engravedText:D,showGlassDome:A})=>e.jsxs(Re,{frameloop:"demand",dpr:n?[1,1.25]:[1,1.5],camera:{position:[0,.03,2.95],fov:40},gl:{antialias:!n,alpha:!0,powerPreference:n?"default":"high-performance",toneMapping:We,toneMappingExposure:1.04},onCreated:({invalidate:W})=>{u.current=W},style:{touchAction:"pan-y"},className:"cursor-grab active:cursor-grabbing w-full h-full",children:[e.jsx("ambientLight",{intensity:.95,color:"#fffcf8"}),e.jsx("directionalLight",{position:[2.5,3.5,2.5],intensity:1.15,color:"#fffdfa"}),e.jsx(o.Suspense,{fallback:e.jsx(oo,{}),children:e.jsx(Qe,{progressRef:w,tierId:d,finishId:t,warmIntensity:a,sanctuaryDark:r,isMobile:n,cameraPreset:c,ultrasoundMode:M,engravedText:D,showGlassDome:A})}),e.jsx(eo,{cameraPreset:c,cameraMoveNonce:S,isMobile:n})]});export{lo as default};
