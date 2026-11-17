import{j as e,C as Se,A as Me,u as Q,b as _,d as t,S as W,F as Z,L as Ce,M as De,e as ye,f as ee,H as k,R as G,V as $,O as Re,g as D}from"./three-vendor-BSvuLwg5.js";import{r as o}from"./ui-vendor-Dr7BTwvn.js";import{a as P}from"./index-Cp0CDoz1.js";const A={full:{pos:[0,.03,2.95],target:[0,-.02,0]},womb:{pos:[.1,-.14,1.38],target:[-.01,-.2,.14]},plaque:{pos:[0,-.44,1.56],target:[0,-.66,.42]}},z="https://www.gstatic.com/draco/versioned/decoders/1.5.7/",oe="/Proyecto_3D_Materno/models/Madre.glb",re="/Proyecto_3D_Materno/models/bebe.glb";_.preload(oe,z);_.preload(re,z);const We=`
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
`,Pe=`
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
`,J=`
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
`,Ne=`
  void main() {
    gl_FragColor = vec4(0.0);
  }
`,Le=`
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
`,Ee=`
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
`,Fe=`
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
`,Ae=`
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
`,ke=`
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
`,_e=`
  varying vec2 vUv;

  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ze=`
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
`,Te=({progressRef:y,finishId:S,warmLightOn:i,sanctuaryDark:r,isMobile:l,cameraPreset:a,engravedText:m,showHotspots:x,onSelectCameraPreset:w})=>{const{gl:v,scene:p,camera:b,invalidate:d}=Q(),M=_(oe,z),L=_(re,z),N=o.useRef(null),E=o.useRef(.95),f=o.useRef(i?1:0),R=o.useRef(r?1:0),F=o.useRef(.06),s=P[S],T=o.useMemo(()=>new t(r?s.darkShell:s.lightShell),[s,r]),te=o.useMemo(()=>new t(r?s.darkDeep:s.lightDeep),[s,r]),ae=o.useMemo(()=>new t(r?s.darkRim:s.lightRim),[s,r]),H=o.useMemo(()=>new t(s.wombGlowColor),[s]),le=o.useMemo(()=>new t(r?"#DED2C1":"#F3ECE1"),[r]),ie=o.useMemo(()=>new t(r?"#BAA995":"#DFD3C2"),[r]),ne=o.useMemo(()=>new t(r?"#70604E":"#9C8A74"),[r]),j=o.useMemo(()=>new W({vertexShader:We,fragmentShader:Pe,uniforms:{uSkinColor:{value:new t("#F5D5BC")},uSssColor:{value:new t("#F2954E")},uDeepShadowColor:{value:new t("#C49574")},uWarmLight:{value:i?1:0}},depthWrite:!0,depthTest:!0}),[]),I=o.useMemo(()=>new W({vertexShader:J,fragmentShader:Ne,colorWrite:!1,depthWrite:!0,depthTest:!0,side:Z}),[]),c=o.useMemo(()=>new W({vertexShader:J,fragmentShader:Le,uniforms:{uShellColor:{value:new t(P.porcelain_silk.lightShell)},uDeepColor:{value:new t(P.porcelain_silk.lightDeep)},uRimColor:{value:new t(P.porcelain_silk.lightRim)},uWombGlowColor:{value:new t(P.porcelain_silk.wombGlowColor)},uReveal:{value:.95},uWarmLight:{value:i?1:0},uWombCenterAlpha:{value:P.porcelain_silk.wombCenterAlpha}},transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:Ce,side:Z}),[]),C=o.useMemo(()=>new W({vertexShader:Ee,fragmentShader:Fe,uniforms:{uStoneLight:{value:new t("#F3ECE1")},uStoneMid:{value:new t("#DFD3C2")},uStonePore:{value:new t("#9C8A74")},uGlowColor:{value:new t("#FFA84C")},uWarmLight:{value:i?1:0},uDarkTheme:{value:r?1:0}}}),[]),B=o.useMemo(()=>new W({vertexShader:Ae,fragmentShader:ke,uniforms:{uWarmLight:{value:i?1:0},uDarkTheme:{value:r?1:0}}}),[]),se=o.useMemo(()=>new De({color:new t("#C9A46B"),metalness:.72,roughness:.3}),[]),V=o.useMemo(()=>new W({vertexShader:_e,fragmentShader:ze,uniforms:{uWarmLight:{value:i?1:0},uDarkTheme:{value:r?1:0}},transparent:!0,depthWrite:!1}),[]),q=o.useMemo(()=>new ye({color:new t("#FFB866"),transparent:!0,opacity:i?.55:0,depthWrite:!1}),[]),ce=o.useMemo(()=>{const h=L.scene.clone(!0);return h.traverse(u=>{if(u.isMesh){const g=u;g.material=j,g.renderOrder=1}}),h},[L.scene,j]),me=o.useMemo(()=>{const h=M.scene.clone(!0);return h.traverse(u=>{if(u.isMesh){const g=u;g.material=I,g.renderOrder=2}}),h},[M.scene,I]),ue=o.useMemo(()=>{const h=M.scene.clone(!0);return h.traverse(u=>{if(u.isMesh){const g=u;g.material=c,g.renderOrder=3}}),h},[M.scene,c]);o.useEffect(()=>{v.compile(p,b),d()},[v,p,b,d]),o.useEffect(()=>{d()},[S,i,r,a,m,d]),ee((h,u)=>{const n=Math.min(u,.05)*6.5,K=y.current,O=a==="womb"?1:.45+Math.min(1,K*1.25)*.55,X=a==="plaque"?0:a==="womb"?.08:D.lerp(-.42,.38,K),U=i?1:0,Y=r?1:0;E.current=D.lerp(E.current,O,n),F.current=D.lerp(F.current,X,n),f.current=D.lerp(f.current,U,n),R.current=D.lerp(R.current,Y,n),N.current&&(N.current.rotation.y=F.current),c.uniforms.uReveal.value=E.current,c.uniforms.uWarmLight.value=f.current,c.uniforms.uShellColor.value.lerp(T,n),c.uniforms.uDeepColor.value.lerp(te,n),c.uniforms.uRimColor.value.lerp(ae,n),c.uniforms.uWombGlowColor.value.lerp(H,n),c.uniforms.uWombCenterAlpha.value=D.lerp(c.uniforms.uWombCenterAlpha.value,s.wombCenterAlpha,n),j.uniforms.uWarmLight.value=f.current,C.uniforms.uStoneLight.value.lerp(le,n),C.uniforms.uStoneMid.value.lerp(ie,n),C.uniforms.uStonePore.value.lerp(ne,n),C.uniforms.uGlowColor.value.lerp(H,n),C.uniforms.uWarmLight.value=f.current,C.uniforms.uDarkTheme.value=R.current,B.uniforms.uWarmLight.value=f.current,B.uniforms.uDarkTheme.value=R.current,V.uniforms.uWarmLight.value=f.current,V.uniforms.uDarkTheme.value=R.current,q.opacity=D.lerp(0,.55,f.current);const he=Math.abs(O-E.current),ge=Math.abs(X-F.current),xe=Math.abs(U-f.current),we=Math.abs(Y-R.current),be=Math.abs(c.uniforms.uShellColor.value.r-T.r)+Math.abs(c.uniforms.uShellColor.value.g-T.g);(he>.002||ge>.002||xe>.002||we>.002||be>.003)&&d()});const ve=l?2:4,pe=l?40:64,de=m.trim()||"EMILIANO · SEMANA 28",fe=m.trim().length>0||a==="plaque";return e.jsxs("group",{ref:N,position:[0,-.62,0],scale:.8,rotation:[0,.06,0],children:[e.jsx("group",{position:[-.01,.21,.095],scale:.275,children:e.jsx("primitive",{object:ce})}),e.jsx("primitive",{object:me,position:[0,0,0],scale:1}),e.jsx("primitive",{object:ue,position:[0,0,0],scale:1}),x&&a==="full"&&w&&e.jsxs(e.Fragment,{children:[e.jsx(k,{position:[.24,.49,.34],center:!0,zIndexRange:[12,0],children:e.jsxs("button",{type:"button",onClick:()=>w("womb"),className:"pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B1714]/85 text-[#FAF7F2] border border-[#D4B07B]/70 text-[10px] tracking-wide whitespace-nowrap shadow-md hover:border-[#D4B07B] transition-transform hover:scale-105",children:[e.jsx("span",{className:"w-2 h-2 rounded-full bg-[#D4B07B] hotspot-pulse"}),e.jsx("span",{children:"Ver bebé en el vientre"})]})}),e.jsx(k,{position:[-.36,-.01,.68],center:!0,zIndexRange:[12,0],children:e.jsxs("button",{type:"button",onClick:()=>w("plaque"),className:"pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B1714]/85 text-[#FAF7F2] border border-[#D4B07B]/70 text-[10px] tracking-wide whitespace-nowrap shadow-md hover:border-[#D4B07B] transition-transform hover:scale-105",children:[e.jsx("span",{className:"text-[#D4B07B]",children:"✦"}),e.jsx("span",{children:"Placa grabada"})]})})]}),e.jsxs("group",{position:[0,0,.01],children:[e.jsx(G,{args:[1.34,.132,1.34],radius:.008,smoothness:ve,position:[0,-.066,0],material:C}),e.jsx(G,{args:[.56,.048,.014],radius:.002,smoothness:2,position:[0,-.066,.672],material:se}),fe&&e.jsx(k,{position:[0,-.066,.684],center:!0,zIndexRange:[15,0],children:e.jsx("div",{className:"pointer-events-none select-none px-3 py-0.5 bg-gradient-to-b from-[#E5C996] via-[#C8A164] to-[#A67D42] border border-[#F5DFB6]/70 shadow-sm whitespace-nowrap",children:e.jsx("span",{className:"font-serif italic text-[11px] sm:text-xs tracking-[0.14em] text-[#231C14] font-medium block",children:de})})}),e.jsxs("mesh",{position:[0,.001,-.01],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[.29,.38,pe]}),e.jsx("primitive",{object:q,attach:"material"})]}),e.jsx(G,{args:[1.12,.042,1.12],radius:.004,smoothness:2,position:[0,-.151,0],material:B}),e.jsxs("mesh",{position:[0,-.173,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.86,1.86]}),e.jsx("primitive",{object:V,attach:"material"})]})]})]})},je=({cameraPreset:y,cameraMoveNonce:S,isMobile:i,onUserOrbitStart:r})=>{const l=o.useRef(null),{camera:a,invalidate:m}=Q(),x=o.useRef(!1),w=o.useRef(!1),v=o.useRef(new $(...A.full.pos)),p=o.useRef(new $(...A.full.target));return o.useEffect(()=>{!w.current&&l.current&&(l.current.target.set(...A.full.target),l.current.update(),w.current=!0)},[]),o.useEffect(()=>{const b=A[y];v.current.set(...b.pos),p.current.set(...b.target),S>0&&(x.current=!0,m())},[y,S,m]),ee((b,d)=>{if(!x.current||!l.current)return;const M=Math.min(1,d*4.5);a.position.lerp(v.current,M),l.current.target.lerp(p.current,M),l.current.update();const L=a.position.distanceTo(v.current),N=l.current.target.distanceTo(p.current);L<.006&&N<.006?(a.position.copy(v.current),l.current.target.copy(p.current),l.current.update(),x.current=!1):m()}),e.jsx(Re,{ref:l,makeDefault:!0,enablePan:!1,enableZoom:!1,enableDamping:!0,dampingFactor:i?.08:.045,rotateSpeed:i?.85:.75,minPolarAngle:Math.PI/4.2,maxPolarAngle:Math.PI/1.85,onStart:()=>{x.current=!1,r==null||r()}})},Be=()=>e.jsx(k,{center:!0,children:e.jsx("div",{className:"px-5 py-2.5 bg-[#FAF7F2]/95 border border-[#E5DEC9] text-center shadow-sm whitespace-nowrap rounded-full",children:e.jsx("p",{className:"font-serif italic text-sm text-[#8C6D46]",children:"Desvelando escultura..."})})}),Ie=({progressRef:y,finishId:S,warmLightOn:i,sanctuaryDark:r,invalidateRef:l,isMobile:a,cameraPreset:m,cameraMoveNonce:x,engravedText:w,showHotspots:v,onSelectCameraPreset:p,onUserOrbitStart:b})=>e.jsxs(Se,{frameloop:"demand",dpr:a?[1,1.25]:[1,1.5],camera:{position:[0,.03,2.95],fov:40},gl:{antialias:!a,alpha:!0,powerPreference:a?"default":"high-performance",toneMapping:Me,toneMappingExposure:1.04},onCreated:({invalidate:d})=>{l.current=d},style:{touchAction:"pan-y"},className:"cursor-grab active:cursor-grabbing w-full h-full",children:[e.jsx("ambientLight",{intensity:.95,color:"#fffcf8"}),e.jsx("directionalLight",{position:[2.5,3.5,2.5],intensity:1.15,color:"#fffdfa"}),e.jsx(o.Suspense,{fallback:e.jsx(Be,{}),children:e.jsx(Te,{progressRef:y,finishId:S,warmLightOn:i,sanctuaryDark:r,isMobile:a,cameraPreset:m,engravedText:w,showHotspots:v,onSelectCameraPreset:p})}),e.jsx(je,{cameraPreset:m,cameraMoveNonce:x,isMobile:a,onUserOrbitStart:b})]});export{Ie as default};
