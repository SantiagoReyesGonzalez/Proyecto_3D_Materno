import{j as e,r as o}from"./ui-vendor-eacxzjFu.js";import{C as He,A as Oe,u as Re,a as ie,b as n,S as C,F as be,L as Ue,M as ce,c as Ie,d as qe,e as Xe,f as me,D as Ke,B as Ye,g as ue,h as Pe,R as te,H as Ze,V as ye,O as $e,i as f}from"./three-vendor-Co-_NPPm.js";import{a as G}from"./index-Dw20h_Up.js";const ae={full:{pos:[0,.04,4.25],target:[0,-.02,0]},womb:{pos:[.12,-.14,1.98],target:[-.01,-.2,.14]},plaque:{pos:[0,-.44,2.24],target:[0,-.66,.42]}},le="https://www.gstatic.com/draco/versioned/decoders/1.5.7/",We="/Proyecto_3D_Materno/v3/models/Madre.glb",Le="/Proyecto_3D_Materno/v3/models/bebe.glb";ie.preload(We,le);ie.preload(Le,le);const Je=`
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
`,Qe=`
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
`,Ce=`
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
`,eo=`
  void main() {
    gl_FragColor = vec4(0.0);
  }
`,oo=`
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
`,ro=`
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
`,to=`
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
`,ao=`
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
`,io=`
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
`,lo=`
  varying vec2 vUv;
  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,no=`
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
`,so=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,co=`
  varying vec2 vUv;
  uniform float uStrength;
  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    float d = length(centered * vec2(1.0, 0.85));
    float halo = exp(-d * 2.55) * (1.0 - smoothstep(0.62, 1.0, d));
    gl_FragColor = vec4(1.0, 0.72, 0.34, halo * uStrength);
  }
`,mo=`
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
`,uo=`
  uniform float uAlpha;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float soft = pow(max(0.0, 1.0 - d * 2.0), 2.2);
    gl_FragColor = vec4(1.0, 0.84, 0.54, soft * uAlpha * vTwinkle);
  }
`,vo=`
  varying vec3 vNormalWorld;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,po=`
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
`,fo=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ho=`
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
`;function De(S,v){const t=S.getContext("2d");if(!t)return;const i=S.width,r=S.height,p=t.createLinearGradient(0,0,i,r);p.addColorStop(0,"#DFBE86"),p.addColorStop(.5,"#C79F5E"),p.addColorStop(1,"#9E7438"),t.fillStyle=p,t.fillRect(0,0,i,r),t.strokeStyle="rgba(255, 245, 224, 0.14)",t.lineWidth=1;for(let u=4;u<r;u+=6)t.beginPath(),t.moveTo(0,u),t.lineTo(i,u),t.stroke();t.strokeStyle="rgba(54, 38, 18, 0.45)",t.lineWidth=3,t.strokeRect(8,8,i-16,r-16);const a=(v.trim()||"EMILIANO · SEMANA 28").toUpperCase();t.fillStyle="#231C14",t.textAlign="center",t.textBaseline="middle",t.font='italic 500 36px "Cormorant Garamond", Georgia, serif',t.fillText(a,i/2,r/2+2,i-56)}const go=({progressRef:S,tierId:v,finishId:t,warmIntensity:i,sanctuaryDark:r,isMobile:p,cameraPreset:a,ultrasoundMode:u,engravedText:M,showGlassDome:D,autoSpin:R,isStageActive:E,pointerTiltRef:x})=>{const{gl:T,scene:F,camera:U,invalidate:P}=Re(),I=ie(We,le),ve=ie(Le,le),q=o.useRef(null),b=v===1?0:i,X=o.useRef(.95),g=o.useRef(b),y=o.useRef(r?1:0),K=o.useRef(u?1:0),Y=o.useRef(.06),Z=o.useRef(0),$=o.useRef(0),A=o.useRef(0),pe=o.useRef(0),w=G[t],de=o.useMemo(()=>new n(r?w.darkShell:w.lightShell),[w,r]),Ee=o.useMemo(()=>new n(r?w.darkDeep:w.lightDeep),[w,r]),Ae=o.useMemo(()=>new n(r?w.darkRim:w.lightRim),[w,r]),fe=o.useMemo(()=>new n(w.wombGlowColor),[w]),_e=o.useMemo(()=>new n(r?"#DED2C1":"#F3ECE1"),[r]),Ne=o.useMemo(()=>new n(r?"#BAA995":"#DFD3C2"),[r]),Te=o.useMemo(()=>new n(r?"#70604E":"#9C8A74"),[r]),k=o.useMemo(()=>new C({vertexShader:Je,fragmentShader:Qe,uniforms:{uSkinColor:{value:new n("#F5D5BC")},uSssColor:{value:new n("#F2954E")},uDeepShadowColor:{value:new n("#C49574")},uWarmLight:{value:b},uUltrasoundMode:{value:u?1:0}},depthWrite:!0,depthTest:!0}),[]),J=o.useMemo(()=>new C({vertexShader:Ce,fragmentShader:eo,colorWrite:!1,depthWrite:!0,depthTest:!0,side:be}),[]),h=o.useMemo(()=>new C({vertexShader:Ce,fragmentShader:oo,uniforms:{uShellColor:{value:new n(G.porcelain_silk.lightShell)},uDeepColor:{value:new n(G.porcelain_silk.lightDeep)},uRimColor:{value:new n(G.porcelain_silk.lightRim)},uWombGlowColor:{value:new n(G.porcelain_silk.wombGlowColor)},uReveal:{value:.95},uWarmLight:{value:b},uWombCenterAlpha:{value:G.porcelain_silk.wombCenterAlpha}},transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:Ue,side:be}),[]),W=o.useMemo(()=>new C({vertexShader:ro,fragmentShader:to,uniforms:{uStoneLight:{value:new n("#F3ECE1")},uStoneMid:{value:new n("#DFD3C2")},uStonePore:{value:new n("#9C8A74")},uGlowColor:{value:new n("#FFA84C")},uWarmLight:{value:b},uDarkTheme:{value:r?1:0}}}),[]),ne=o.useMemo(()=>new ce({color:new n("#E6DDD0"),roughness:.72,metalness:.04}),[]),V=o.useMemo(()=>new C({vertexShader:ao,fragmentShader:io,uniforms:{uWarmLight:{value:b},uDarkTheme:{value:r?1:0}}}),[]),se=o.useMemo(()=>new ce({color:new n("#C7A163"),metalness:.7,roughness:.32}),[]),_=o.useMemo(()=>{const c=document.createElement("canvas");c.width=1024,c.height=84,De(c,"EMILIANO · SEMANA 28");const l=new Ie(c);l.colorSpace=qe,l.anisotropy=4;const m=new ce({map:l,metalness:.45,roughness:.34});return{canvas:c,texture:l,material:m}},[]);o.useEffect(()=>{De(_.canvas,M),_.texture.needsUpdate=!0,P()},[M,_,P]),o.useEffect(()=>()=>{_.texture.dispose(),_.material.dispose()},[_]);const j=o.useMemo(()=>new C({vertexShader:lo,fragmentShader:no,uniforms:{uWarmLight:{value:b},uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1}),[]),Q=o.useMemo(()=>new Xe({color:new n("#FFB866"),transparent:!0,opacity:b*.55,depthWrite:!1}),[]),ee=o.useMemo(()=>new C({vertexShader:so,fragmentShader:co,uniforms:{uStrength:{value:r?.45*b:.08}},transparent:!0,depthWrite:!1,blending:me}),[]),B=o.useMemo(()=>new C({vertexShader:vo,fragmentShader:po,uniforms:{uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1,side:Ke}),[]),z=o.useMemo(()=>new C({vertexShader:fo,fragmentShader:ho,uniforms:{uWarmLight:{value:b},uDarkTheme:{value:r?1:0},uOpacityScale:{value:v===1?.35:.9}},transparent:!0,depthWrite:!1,blending:me}),[]),N=o.useMemo(()=>{const l=new Float32Array(96),m=new Float32Array(32),s=new Float32Array(32);for(let d=0;d<32;d++){const H=d*2.39996,O=.54+d*37%100/100*.82,re=-.68+d*53%100/100*1.55;l[d*3]=Math.cos(H)*O,l[d*3+1]=re,l[d*3+2]=Math.sin(H)*O*.72,m[d]=.75+d*19%100/100*1.3,s[d]=d*.42}const L=new Ye;L.setAttribute("position",new ue(l,3)),L.setAttribute("aScale",new ue(m,1)),L.setAttribute("aPhase",new ue(s,1));const oe=new C({vertexShader:mo,fragmentShader:uo,uniforms:{uPhaseShift:{value:.5},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,p?1.25:1.5)},uAlpha:{value:r?.7:.2}},transparent:!0,depthWrite:!1,blending:me});return{geometry:L,material:oe}},[p]),Fe=o.useMemo(()=>{const c=ve.scene.clone(!0);return c.traverse(l=>{if(l.isMesh){const m=l;m.material=k,m.renderOrder=1}}),c},[ve.scene,k]),ke=o.useMemo(()=>{const c=I.scene.clone(!0);return c.traverse(l=>{if(l.isMesh){const m=l;m.material=J,m.renderOrder=2}}),c},[I.scene,J]),je=o.useMemo(()=>{const c=I.scene.clone(!0);return c.traverse(l=>{if(l.isMesh){const m=l;m.material=h,m.renderOrder=3}}),c},[I.scene,h]);o.useEffect(()=>{T.compile(F,U),P();const c=window.requestAnimationFrame(()=>P()),l=window.setTimeout(()=>P(),120);return()=>{window.cancelAnimationFrame(c),window.clearTimeout(l)}},[T,F,U,P]),o.useEffect(()=>{P()},[v,t,i,r,a,u,M,D,R,E,P]),o.useEffect(()=>()=>{k.dispose(),J.dispose(),h.dispose(),W.dispose(),ne.dispose(),V.dispose(),se.dispose(),j.dispose(),Q.dispose(),ee.dispose(),B.dispose(),z.dispose(),N.geometry.dispose(),N.material.dispose()},[k,J,h,W,ne,V,se,j,Q,ee,B,z,N]),Pe((c,l)=>{var Se,Me;const m=Math.min(l,.05),s=m*6.5,L=S.current;if(a==="plaque"||a==="womb"){const Be=Math.round(A.current/(Math.PI*2))*(Math.PI*2);A.current=f.lerp(A.current,Be,s)}else R&&E&&(A.current+=m*.28,pe.current+=m*.35);const oe=((Se=x==null?void 0:x.current)==null?void 0:Se.x)??0,d=((Me=x==null?void 0:x.current)==null?void 0:Me.y)??0;Z.current=f.lerp(Z.current,oe*.12,s),$.current=f.lerp($.current,d*.06,s);const H=a==="womb"||u?1:.48+Math.min(1,L*1.25)*.52,O=a==="plaque"?0:a==="womb"?.08:f.lerp(-.42,.38,L),re=b,we=r?1:0,xe=u?1:0;X.current=f.lerp(X.current,H,s),Y.current=f.lerp(Y.current,O,s),g.current=f.lerp(g.current,re,s),y.current=f.lerp(y.current,we,s),K.current=f.lerp(K.current,xe,s),q.current&&(q.current.rotation.y=Y.current+A.current+Z.current,q.current.rotation.x=$.current),h.uniforms.uReveal.value=X.current,h.uniforms.uWarmLight.value=g.current,h.uniforms.uShellColor.value.lerp(de,s),h.uniforms.uDeepColor.value.lerp(Ee,s),h.uniforms.uRimColor.value.lerp(Ae,s),h.uniforms.uWombGlowColor.value.lerp(fe,s),h.uniforms.uWombCenterAlpha.value=f.lerp(h.uniforms.uWombCenterAlpha.value,w.wombCenterAlpha,s),k.uniforms.uWarmLight.value=g.current,k.uniforms.uUltrasoundMode.value=K.current,W.uniforms.uStoneLight.value.lerp(_e,s),W.uniforms.uStoneMid.value.lerp(Ne,s),W.uniforms.uStonePore.value.lerp(Te,s),W.uniforms.uGlowColor.value.lerp(fe,s),W.uniforms.uWarmLight.value=g.current,W.uniforms.uDarkTheme.value=y.current,V.uniforms.uWarmLight.value=g.current,V.uniforms.uDarkTheme.value=y.current,j.uniforms.uWarmLight.value=g.current,j.uniforms.uDarkTheme.value=y.current,B.uniforms.uDarkTheme.value=y.current,z.uniforms.uWarmLight.value=g.current,z.uniforms.uDarkTheme.value=y.current,z.uniforms.uOpacityScale.value=v===1?.35:.9,Q.opacity=f.lerp(0,.55,g.current),ee.uniforms.uStrength.value=f.lerp(.05,.5,y.current)*g.current,N.material.uniforms.uPhaseShift.value=L+pe.current,N.material.uniforms.uAlpha.value=f.lerp(.14,.78,y.current)*f.lerp(.2,1,g.current);const Ge=Math.round(A.current/(Math.PI*2))*(Math.PI*2),Ve=a==="plaque"||a==="womb"?Math.abs(A.current-Ge):0;(Math.abs(H-X.current)+Math.abs(O-Y.current)+Math.abs(re-g.current)+Math.abs(we-y.current)+Math.abs(xe-K.current)+Math.abs(oe*.12-Z.current)+Math.abs(d*.06-$.current)+Ve+Math.abs(h.uniforms.uShellColor.value.r-de.r)>.002||R&&E&&a!=="plaque"&&a!=="womb")&&P()});const he=p?2:4,ge=p?40:64,ze=v===1?.75:v===2?.8:.84;return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{position:[0,-.02,-.72],renderOrder:0,children:[e.jsx("planeGeometry",{args:[2.8,3.2]}),e.jsx("primitive",{object:ee,attach:"material"})]}),e.jsxs("mesh",{position:[0,.04,-.44],renderOrder:0,children:[e.jsx("ringGeometry",{args:[.73,.765,ge]}),e.jsx("primitive",{object:z,attach:"material"})]}),e.jsx("points",{geometry:N.geometry,material:N.material,renderOrder:4}),e.jsxs("group",{ref:q,position:[0,-.62,0],scale:ze,rotation:[0,.06,0],children:[e.jsx("group",{position:[-.01,.21,.095],scale:.275,children:e.jsx("primitive",{object:Fe})}),e.jsx("primitive",{object:ke,position:[0,0,0],scale:1}),e.jsx("primitive",{object:je,position:[0,0,0],scale:1}),v===1?e.jsxs("group",{position:[0,0,.01],children:[e.jsx(te,{args:[.98,.055,.98],radius:.008,smoothness:he,position:[0,-.027,0],material:ne}),e.jsxs("mesh",{position:[0,-.058,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.45,1.45]}),e.jsx("primitive",{object:j,attach:"material"})]})]}):e.jsxs("group",{position:[0,0,.01],children:[e.jsx(te,{args:[1.34,.132,1.34],radius:.008,smoothness:he,position:[0,-.066,0],material:W}),v===3&&e.jsxs("group",{position:[0,-.066,.672],children:[e.jsx(te,{args:[.62,.052,.014],radius:.002,smoothness:2,material:se}),e.jsxs("mesh",{position:[0,0,.0076],children:[e.jsx("planeGeometry",{args:[.59,.048]}),e.jsx("primitive",{object:_.material,attach:"material"})]})]}),e.jsxs("mesh",{position:[0,.001,-.01],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[.29,.38,ge]}),e.jsx("primitive",{object:Q,attach:"material"})]}),e.jsx(te,{args:[1.12,.042,1.12],radius:.004,smoothness:2,position:[0,-.151,0],material:V}),e.jsxs("mesh",{position:[0,-.173,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.86,1.86]}),e.jsx("primitive",{object:j,attach:"material"})]})]}),D&&e.jsxs("group",{position:[0,0,.01],renderOrder:5,children:[e.jsx("mesh",{position:[0,.66,0],material:B,renderOrder:5,children:e.jsx("cylinderGeometry",{args:[.55,.55,1.32,40,1,!0]})}),e.jsx("mesh",{position:[0,1.32,0],material:B,renderOrder:5,children:e.jsx("sphereGeometry",{args:[.55,40,20,0,Math.PI*2,0,Math.PI/2]})})]})]})]})},wo=({cameraPreset:S,cameraMoveNonce:v,isMobile:t})=>{const i=o.useRef(null),{camera:r,invalidate:p}=Re(),a=o.useRef(!1),u=o.useRef(!1),M=o.useRef(new ye(...ae.full.pos)),D=o.useRef(new ye(...ae.full.target));return o.useEffect(()=>{!u.current&&i.current&&(i.current.target.set(...ae.full.target),i.current.update(),u.current=!0)},[]),o.useEffect(()=>{const R=ae[S];M.current.set(...R.pos),D.current.set(...R.target),v>0&&(a.current=!0,p())},[S,v,p]),Pe((R,E)=>{if(!a.current||!i.current)return;const x=Math.min(1,E*4.5);r.position.lerp(M.current,x),i.current.target.lerp(D.current,x),i.current.update();const T=r.position.distanceTo(M.current),F=i.current.target.distanceTo(D.current);T<.006&&F<.006?(r.position.copy(M.current),i.current.target.copy(D.current),i.current.update(),a.current=!1):p()}),e.jsx($e,{ref:i,makeDefault:!0,enablePan:!1,enableZoom:!1,enableDamping:!0,dampingFactor:t?.08:.045,rotateSpeed:t?.85:.75,minPolarAngle:Math.PI/4.2,maxPolarAngle:Math.PI/1.85,onStart:()=>{a.current=!1}})},xo=()=>e.jsx(Ze,{center:!0,style:{pointerEvents:"none"},children:e.jsx("div",{className:"pointer-events-none px-5 py-2.5 bg-[#FBF7F4]/95 border border-[#EBDCD3] text-center shadow-sm whitespace-nowrap rounded-full",children:e.jsx("p",{className:"font-serif italic text-sm text-[#9B5640]",children:"Preparando tu escultura 3D..."})})}),Co=({progressRef:S,tierId:v,finishId:t,warmIntensity:i,sanctuaryDark:r,invalidateRef:p,isMobile:a,cameraPreset:u,cameraMoveNonce:M,ultrasoundMode:D,engravedText:R,showGlassDome:E,autoSpin:x=!1,isStageActive:T=!0,pointerTiltRef:F})=>e.jsxs(He,{frameloop:"demand",dpr:a?[1,1.25]:[1,1.5],camera:{position:[0,.04,4.25],fov:28},gl:{antialias:!a,alpha:!0,powerPreference:a?"default":"high-performance",toneMapping:Oe,toneMappingExposure:1.04},onCreated:({invalidate:U})=>{p.current=U},style:{touchAction:"pan-y"},className:"cursor-grab active:cursor-grabbing w-full h-full",children:[e.jsx("ambientLight",{intensity:.95,color:"#fffcf8"}),e.jsx("directionalLight",{position:[2.5,3.5,2.5],intensity:1.15,color:"#fffdfa"}),e.jsx(o.Suspense,{fallback:e.jsx(xo,{}),children:e.jsx(go,{progressRef:S,tierId:v,finishId:t,warmIntensity:i,sanctuaryDark:r,isMobile:a,cameraPreset:u,ultrasoundMode:D,engravedText:R,showGlassDome:E,autoSpin:x,isStageActive:T,pointerTiltRef:F})}),e.jsx(wo,{cameraPreset:u,cameraMoveNonce:M,isMobile:a})]});export{Co as default};
