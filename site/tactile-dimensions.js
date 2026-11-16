/*
  CHARITY / FOURTH FIELD — original procedural geometry + tactile threshold.
  The physical iOS path is a REAL finger-tapped native WebKit switch.
  iOS 26.5+ prohibits programmatic switch haptics. Never claim arbitrary
  vibratory waveforms on Safari. Chromium/Android uses navigator.vibrate.
  No external images, libraries, telemetry, AI requests, or medical claims.
*/
(() => {
  'use strict';
  const country = document.getElementById('country');
  if (!country || document.getElementById('fourth-field')) return;

  const prefersStill = window.matchMedia('(prefers-reduced-motion: reduce)');
  const field = document.createElement('canvas');
  field.id = 'fourth-field';
  field.setAttribute('aria-hidden', 'true');
  field.className = 'fourth-field';
  country.append(field);

  // On iOS the user's ACTUAL finger must hit the native checkbox with the
  // `switch` attribute. `.click()` on it or a label is not a haptic trigger
  // on iOS 26.5+. We intentionally keep native appearance intact.
  const pad = document.createElement('div');
  pad.className = 'dimensional-press';
  pad.id = 'dimensional-press';
  const signal = document.createElement('span');
  signal.className = 'dimension-glyph';
  signal.setAttribute('aria-hidden', 'true');
  signal.textContent = '⟡';
  const switchInput = document.createElement('input');
  switchInput.id = 'dimension-switch';
  switchInput.type = 'checkbox';
  switchInput.setAttribute('switch', '');
  switchInput.className = 'native-haptic-switch';
  switchInput.setAttribute('aria-label', 'Touch the dimensional stone to feel a tactile pulse, if supported, and change the world');
  const status = document.createElement('span');
  status.id = 'dimension-status';
  status.className = 'visually-hidden fourth-field-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  pad.append(signal, switchInput, status);
  country.append(pad);

  const style = document.createElement('style');
  style.dataset.mcFourthField = 'true';
  style.textContent = `
    .fourth-field{position:fixed;inset:0;z-index:3;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen;opacity:.84}
    .dimensional-press{position:fixed;z-index:50;right:max(22px,env(safe-area-inset-right,0px));bottom:calc(26px + env(safe-area-inset-bottom,0px));width:68px;height:68px;display:grid;place-items:center;border-radius:47% 53% 46% 54% / 53% 47% 55% 45%;background:radial-gradient(ellipse at 30% 23%,#e6ffb3aa,transparent 28%),radial-gradient(ellipse at 50% 55%,#bdf65a,#697443 38%,#28231d 68%,#0c1612 93%);box-shadow:inset -5px -7px 15px #080d0aca,inset 2px 3px 8px #ffffae68,0 0 0 2px #c7ff7366,0 6px 19px #000a;transform:rotate(-11deg);isolation:isolate}
    .dimensional-press::before{content:'';position:absolute;inset:-7px;border:1px dashed #c0ef8977;border-radius:50%;pointer-events:none}
    .dimensional-press .dimension-glyph{font:italic 29px/1 Georgia,serif;color:#080c06;text-shadow:0 1px 0 #ecff8b77;transform:rotate(11deg);pointer-events:none}
    .native-haptic-switch{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;margin:0!important;opacity:0!important;cursor:pointer;clip-path:circle(48% at 50% 50%);z-index:2;touch-action:manipulation}
    /* Crucial: do not use appearance:none or display:none on the native switch. */
    .dimensional-press:focus-within{outline:3px solid #e6ffa8;outline-offset:8px}
    .dimensional-press.is-pulsing{animation:stone-pulse .52s ease-out 1}
    @keyframes stone-pulse{45%{filter:brightness(1.6);transform:rotate(4deg) scale(1.14)}100%{filter:brightness(1);transform:rotate(-11deg) scale(1)}}
    .fourth-field-status,.visually-hidden.fourth-field-status{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
    @media(max-width:650px){.dimensional-press{width:60px;height:60px;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px))}}
    @media(prefers-reduced-motion:reduce){.dimensional-press.is-pulsing{animation:none}.fourth-field{opacity:.52}}
  `;
  document.head.append(style);

  const canvasCtx = field.getContext('2d', {alpha:true});
  const phases = [
    {name:'FIELD',mark:'⟡',weather:'hush',hue:72},
    {name:'FOLD',mark:'⋈',weather:'static',hue:178},
    {name:'ECHO',mark:'⊕',weather:'storm',hue:316},
    {name:'RIFT',mark:'⧖',weather:'heat',hue:38},
  ];
  let phase=0, pulseTime=0, tick=0, width=0, height=0, dpi=1, raf=0;
  let visualStart = performance.now();
  const points4=[];
  for(let n=0;n<16;n++)points4.push([n&1?1:-1,n&2?1:-1,n&4?1:-1,n&8?1:-1]);
  const edges=[];
  for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)if((i^j)===1||(i^j)===2||(i^j)===4||(i^j)===8)edges.push([i,j]);

  function resize(){
    width=Math.max(1,window.innerWidth);height=Math.max(1,window.innerHeight);
    dpi=Math.min(window.devicePixelRatio||1,1.6);
    field.width=Math.floor(width*dpi);field.height=Math.floor(height*dpi);
    field.style.width=width+'px';field.style.height=height+'px';
    canvasCtx?.setTransform(dpi,0,0,dpi,0,0);
  }
  const rotate=(p,a,b,angle)=>{const c=Math.cos(angle),s=Math.sin(angle),x=p[a],y=p[b];p[a]=x*c-y*s;p[b]=x*s+y*c;};
  function projected(t,scale){
    const origin=window.MC_LABYRINTH?.state?.();
    const x=origin?.position?.x ?? 19,y=origin?.position?.y ?? 15;
    const cx=width*(0.5+0.12*Math.sin(x/7)),cy=height*(0.46+0.09*Math.cos(y/6));
    return points4.map(([a,b,c,d])=>{
      const p=[a,b,c,d];
      rotate(p,0,3,t*.24+phase*.72);rotate(p,1,2,t*.12+phase*.43);
      rotate(p,2,3,t*.19);rotate(p,0,1,t*.08);
      const w=2.6/(3.5-p[3]*.68), z=3.5/(5-p[2]*.7);
      return {x:cx+p[0]*w*z*scale,y:cy+p[1]*w*z*scale,depth:p[3]};
    });
  }
  function render(time){
    if(!canvasCtx)return;
    const t=(time-visualStart)/1000;
    canvasCtx.clearRect(0,0,width,height);
    const lastPulse=Math.max(0,1-(time-pulseTime)/2400);
    const intensity=prefersStill.matches?.46:.22+lastPulse*.75;
    const size=Math.min(width,height)*(.16+phase*.015);
    const pts=projected(prefersStill.matches?phase*.4:t,size);
    const palette=['#deff91','#80ebdb','#ed9dc9','#ffa36e'];
    canvasCtx.save();canvasCtx.lineWidth=.85+lastPulse*1.5;
    for(let k=0;k<edges.length;k++){
      const [i,j]=edges[k],a=pts[i],b=pts[j];
      canvasCtx.beginPath();canvasCtx.moveTo(a.x,a.y);canvasCtx.lineTo(b.x,b.y);
      canvasCtx.strokeStyle=k%2?palette[phase]: '#e8efba';
      canvasCtx.globalAlpha=intensity*(.35+(a.depth+b.depth+2)*.13);
      canvasCtx.stroke();
    }
    canvasCtx.globalAlpha=intensity*.7;
    // The rings are actual two-source interference, not a static ornament.
    const waveCenter=pts[(phase*3)%16];
    for(let k=0;k<5;k++){
      const r=(k+1)*size*.34;
      canvasCtx.beginPath();
      for(let n=0;n<=90;n++){
        const a=n/90*Math.PI*2;
        const left=Math.hypot(Math.cos(a)*r-size*.36,Math.sin(a)*r);
        const right=Math.hypot(Math.cos(a)*r+size*.36,Math.sin(a)*r);
        const phaseWave=Math.cos(left*.022-t*.6)+Math.cos(right*.022-t*.6);
        const off=phaseWave*size*.018*(1+lastPulse);
        const px=waveCenter.x+Math.cos(a)*(r+off),py=waveCenter.y+Math.sin(a)*(r+off);
        if(n===0)canvasCtx.moveTo(px,py);else canvasCtx.lineTo(px,py);
      }
      canvasCtx.closePath();canvasCtx.strokeStyle=palette[phase];canvasCtx.globalAlpha=intensity*(.11+lastPulse*.14);canvasCtx.stroke();
    }
    canvasCtx.restore();
  }
  function loop(time){
    raf=0;
    if(document.hidden)return;
    if(!prefersStill.matches && time-tick < 38){raf=requestAnimationFrame(loop);return;}
    tick=time;render(time);
    if(!prefersStill.matches)raf=requestAnimationFrame(loop);
  }
  function restart(){if(raf)cancelAnimationFrame(raf);if(!document.hidden)raf=requestAnimationFrame(loop);}
  function pulse(){
    // On iOS Safari the OS provides its own haptic ONLY for a direct human
    // tap on the overlaying native switch. JS cannot trigger extra pulses.
    // On Chromium Android the Vibration API provides a real multi-pulse path.
    if(typeof navigator.vibrate==='function'){
      try{navigator.vibrate([18,34,18]);}catch{}
    }
    phase=(phase+1)%4;
    const p=phases[phase];pulseTime=performance.now();
    country.dataset.dimension=p.name.toLowerCase();
    signal.textContent=p.mark;
    status.textContent=p.name+' dimension';
    pad.classList.remove('is-pulsing');void pad.offsetWidth;pad.classList.add('is-pulsing');
    window.MC_LABYRINTH?.setWeather?.(p.weather);
    if(prefersStill.matches)render(pulseTime);
    window.dispatchEvent(new CustomEvent('mc:dimension-changed',{detail:{name:p.name,phase}}));
  }
  switchInput.addEventListener('change',pulse);
  pad.addEventListener('animationend',()=>pad.classList.remove('is-pulsing'));
  window.addEventListener('resize',()=>{resize();if(prefersStill.matches)render(performance.now());});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else restart();});
  if(typeof prefersStill.addEventListener==='function')prefersStill.addEventListener('change',restart);
  resize();restart();
  const isIOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  Object.defineProperty(window,'MC_DIMENSIONS', {configurable:false,value:Object.freeze({
    state:()=>({phase,name:phases[phase].name,projectedVertices:points4.length,edges:edges.length,reducedMotion:prefersStill.matches}),
    capabilities:()=>({androidVibration:typeof navigator.vibrate==='function',iosNativeSwitchCandidate:isIOS,nativeIoshapticVerifiedOnDevice:false,fullIoshapticPatterns:false}),
    selfTest:()=>({canvas:!!canvasCtx,vertices:points4.length,edges:edges.length,nativeSwitch:!!switchInput.hasAttribute('switch'),hapticInputType:switchInput.type,rootPhase:country.dataset.dimension??'field'}),
  })});
})();