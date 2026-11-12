import{j as e,C as co,A as mo,O as vo,u as uo,b as y,d as r,S as f,F as O,L as po,M as fo,e as ho,R as U,H as go,f as p}from"./three-vendor-B8Y6S1Y0.js";import{r as o}from"./ui-vendor-B565rVjJ.js";import{a as h}from"./index-BW_RnHhP.js";const D="https://www.gstatic.com/draco/versioned/decoders/1.5.7/",K="/Proyecto_3D_Materno/models/Madre.glb",X="/Proyecto_3D_Materno/models/bebe.glb";y.preload(K,D);y.preload(X,D);const wo=`
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
`,xo=`
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
`,I=`
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
`,So=`
  void main() {
    gl_FragColor = vec4(0.0);
  }
`,bo=`
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
`,Mo=`
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
`,Co=`
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
`,yo=`
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
`,Do=`
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
`,Wo=`
  varying vec2 vUv;

  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Po=`
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
`,Lo=({progressRef:W,finishId:x,warmLightOn:g,sanctuaryDark:a,isMobile:n})=>{const{gl:S,scene:F,camera:k,invalidate:w}=uo(),b=y(K,D),_=y(X,D),P=o.useRef(null),M=o.useRef(.95),c=o.useRef(g?1:.12),d=o.useRef(a?1:0),C=o.useRef(.06),l=h[x],L=o.useMemo(()=>new r(a?l.darkShell:l.lightShell),[l,a]),Y=o.useMemo(()=>new r(a?l.darkDeep:l.lightDeep),[l,a]),q=o.useMemo(()=>new r(a?l.darkRim:l.lightRim),[l,a]),T=o.useMemo(()=>new r(l.wombGlowColor),[l]),Z=o.useMemo(()=>new r(a?"#DED2C1":"#F3ECE1"),[a]),$=o.useMemo(()=>new r(a?"#BAA995":"#DFD3C2"),[a]),J=o.useMemo(()=>new r(a?"#70604E":"#9C8A74"),[a]),R=o.useMemo(()=>new f({vertexShader:wo,fragmentShader:xo,uniforms:{uSkinColor:{value:new r("#F5D5BC")},uSssColor:{value:new r("#F2954E")},uDeepShadowColor:{value:new r("#C49574")},uWarmLight:{value:1}},depthWrite:!0,depthTest:!0}),[]),z=o.useMemo(()=>new f({vertexShader:I,fragmentShader:So,colorWrite:!1,depthWrite:!0,depthTest:!0,side:O}),[]),i=o.useMemo(()=>new f({vertexShader:I,fragmentShader:bo,uniforms:{uShellColor:{value:new r(h.porcelain_silk.lightShell)},uDeepColor:{value:new r(h.porcelain_silk.lightDeep)},uRimColor:{value:new r(h.porcelain_silk.lightRim)},uWombGlowColor:{value:new r(h.porcelain_silk.wombGlowColor)},uReveal:{value:.95},uWarmLight:{value:1},uWombCenterAlpha:{value:h.porcelain_silk.wombCenterAlpha}},transparent:!0,depthWrite:!1,depthTest:!0,depthFunc:po,side:O}),[]),u=o.useMemo(()=>new f({vertexShader:Mo,fragmentShader:Co,uniforms:{uStoneLight:{value:new r("#F3ECE1")},uStoneMid:{value:new r("#DFD3C2")},uStonePore:{value:new r("#9C8A74")},uGlowColor:{value:new r("#FFA84C")},uWarmLight:{value:1},uDarkTheme:{value:0}}}),[]),N=o.useMemo(()=>new f({vertexShader:yo,fragmentShader:Do,uniforms:{uWarmLight:{value:1},uDarkTheme:{value:0}}}),[]),E=o.useMemo(()=>new f({vertexShader:Wo,fragmentShader:Po,uniforms:{uWarmLight:{value:1},uDarkTheme:{value:0}},transparent:!0,depthWrite:!1}),[]),A=o.useMemo(()=>new fo({color:new r("#FFB866"),transparent:!0,opacity:.55,depthWrite:!1}),[]),Q=o.useMemo(()=>{const m=_.scene.clone(!0);return m.traverse(s=>{if(s.isMesh){const v=s;v.material=R,v.renderOrder=1}}),m},[_.scene,R]),oo=o.useMemo(()=>{const m=b.scene.clone(!0);return m.traverse(s=>{if(s.isMesh){const v=s;v.material=z,v.renderOrder=2}}),m},[b.scene,z]),eo=o.useMemo(()=>{const m=b.scene.clone(!0);return m.traverse(s=>{if(s.isMesh){const v=s;v.material=i,v.renderOrder=3}}),m},[b.scene,i]);o.useEffect(()=>{S.compile(F,k),w()},[S,F,k,w]),o.useEffect(()=>{w()},[x,g,a,w]),ho((m,s)=>{const t=Math.min(s,.05)*6.5,V=W.current,j=.35+Math.min(1,V*1.35)*.65,H=p.lerp(-.42,.38,V),G=g?1:.08,B=a?1:0;M.current=p.lerp(M.current,j,t),C.current=p.lerp(C.current,H,t),c.current=p.lerp(c.current,G,t),d.current=p.lerp(d.current,B,t),P.current&&(P.current.rotation.y=C.current),i.uniforms.uReveal.value=M.current,i.uniforms.uWarmLight.value=c.current,i.uniforms.uShellColor.value.lerp(L,t),i.uniforms.uDeepColor.value.lerp(Y,t),i.uniforms.uRimColor.value.lerp(q,t),i.uniforms.uWombGlowColor.value.lerp(T,t),i.uniforms.uWombCenterAlpha.value=p.lerp(i.uniforms.uWombCenterAlpha.value,l.wombCenterAlpha,t),R.uniforms.uWarmLight.value=c.current,u.uniforms.uStoneLight.value.lerp(Z,t),u.uniforms.uStoneMid.value.lerp($,t),u.uniforms.uStonePore.value.lerp(J,t),u.uniforms.uGlowColor.value.lerp(T,t),u.uniforms.uWarmLight.value=c.current,u.uniforms.uDarkTheme.value=d.current,N.uniforms.uWarmLight.value=c.current,N.uniforms.uDarkTheme.value=d.current,E.uniforms.uWarmLight.value=c.current,E.uniforms.uDarkTheme.value=d.current,A.opacity=p.lerp(.1,.55,c.current);const to=Math.abs(j-M.current),lo=Math.abs(H-C.current),io=Math.abs(G-c.current),so=Math.abs(B-d.current),no=Math.abs(i.uniforms.uShellColor.value.r-L.r)+Math.abs(i.uniforms.uShellColor.value.g-L.g);(to>.002||lo>.002||io>.002||so>.002||no>.003)&&w()});const ro=n?2:4,ao=n?40:64;return e.jsxs("group",{ref:P,position:[0,-.62,0],scale:.8,rotation:[0,.06,0],children:[e.jsx("group",{position:[-.01,.21,.095],scale:.275,children:e.jsx("primitive",{object:Q})}),e.jsx("primitive",{object:oo,position:[0,0,0],scale:1}),e.jsx("primitive",{object:eo,position:[0,0,0],scale:1}),e.jsxs("group",{position:[0,0,.01],children:[e.jsx(U,{args:[1.34,.132,1.34],radius:.008,smoothness:ro,position:[0,-.066,0],material:u}),e.jsxs("mesh",{position:[0,.001,-.01],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[.29,.38,ao]}),e.jsx("primitive",{object:A,attach:"material"})]}),e.jsx(U,{args:[1.12,.042,1.12],radius:.004,smoothness:2,position:[0,-.151,0],material:N}),e.jsxs("mesh",{position:[0,-.173,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[1.86,1.86]}),e.jsx("primitive",{object:E,attach:"material"})]})]})]})},Ro=()=>e.jsx(go,{center:!0,children:e.jsx("div",{className:"px-5 py-2.5 bg-[#FAF7F2]/95 border border-[#E5DEC9] text-center shadow-sm whitespace-nowrap rounded-full",children:e.jsx("p",{className:"font-serif italic text-sm text-[#8C6D46]",children:"Desvelando escultura..."})})}),ko=({progressRef:W,finishId:x,sanctuaryDark:g,invalidateRef:a,isMobile:n})=>e.jsxs(co,{frameloop:"demand",dpr:n?[1,1.25]:[1,1.5],camera:{position:[0,.03,2.95],fov:40},gl:{antialias:!n,alpha:!0,powerPreference:n?"default":"high-performance",toneMapping:mo,toneMappingExposure:1.04},onCreated:({invalidate:S})=>{a.current=S},style:{touchAction:"pan-y"},className:"cursor-grab active:cursor-grabbing w-full h-full",children:[e.jsx("ambientLight",{intensity:.95,color:"#fffcf8"}),e.jsx("directionalLight",{position:[2.5,3.5,2.5],intensity:1.15,color:"#fffdfa"}),e.jsx(o.Suspense,{fallback:e.jsx(Ro,{}),children:e.jsx(Lo,{progressRef:W,finishId:x,warmLightOn:!0,sanctuaryDark:g,isMobile:n})}),e.jsx(vo,{makeDefault:!0,enablePan:!1,enableZoom:!1,enableDamping:!0,dampingFactor:n?.08:.045,rotateSpeed:n?.85:.75,minPolarAngle:Math.PI/4.2,maxPolarAngle:Math.PI/1.85,target:[0,-.02,0]})]});export{ko as default};
