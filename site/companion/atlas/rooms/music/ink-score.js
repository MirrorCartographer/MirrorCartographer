import {cleanStroke,composeScore,validateSavedScore} from './ink-score-core.mjs';
/* The Crooked Score: a locally authored, hand-drawn instrument.
 * No song imports, model calls, metrics, autoplay, or private-user inference. */
(()=>{
 const id=x=>document.getElementById(x),paper=id('score-ground'),g=paper?.getContext('2d');
 if(!paper||!g)return;
 const status=id('scratch-status'),tempo=id('scratch-tempo'),bpm=id('scratch-bpm');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const key='mc.ink-score.1',schema='mc.ink-score.v1';
 let strokes=[],active=null,playing=false,context=null,master=null,delay=null,feedback=null;
 let interval=null,nextTime=0,step=0,events=[],eraseArmed=false;
 let nib={x:.5,y:.5},w=1,h=1,dpr=1;
 const noteColors=['#d4f56a','#e0a3ad','#8fdbd5','#f6ce74'];
 const say=s=>{status.textContent=s};
 function resize(){const r=paper.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,2);paper.width=Math.round(w*dpr);paper.height=Math.round(h*dpr);g.setTransform(dpr,0,0,dpr,0,0);draw();}
 function drawLine(points,color,opacity=1){if(!points?.length)return;g.save();g.globalAlpha=opacity;g.strokeStyle=color;g.lineWidth=4;g.lineCap='round';g.lineJoin='round';g.shadowColor=color;g.shadowBlur=4;g.beginPath();points.forEach((p,i)=>i?g.lineTo(p.x*w,p.y*h):g.moveTo(p.x*w,p.y*h));if(points.length===1){g.lineTo(points[0].x*w+.2,points[0].y*h+.2)}g.stroke();g.shadowBlur=0;g.lineWidth=.8;g.strokeStyle='#fff4ce';g.stroke();g.restore()}
 function draw(){
  g.fillStyle='#15211e';g.fillRect(0,0,w,h);
  const grad=g.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#334d44');grad.addColorStop(.53,'#172b27');grad.addColorStop(1,'#391f32');g.fillStyle=grad;g.fillRect(0,0,w,h);
  // Original crooked hand-ruled lines; coordinates are fixed, not randomized every frame.
  for(let k=0;k<12;k++){
   g.beginPath();for(let i=0;i<=38;i++){const x=i*w/38,y=(k+.55)*h/12+Math.sin(i*1.2+k*2.4)*1.8; i?g.lineTo(x,y):g.moveTo(x,y)}
   g.strokeStyle='rgba(237,220,171,.14)';g.lineWidth=.8;g.stroke();
  }
  for(let i=1;i<16;i++){g.beginPath();const x=i*w/16;g.moveTo(x,0);g.lineTo(x,h);g.lineWidth=.5;g.setLineDash([1,9]);g.strokeStyle='rgba(217,227,174,.1)';g.stroke()}g.setLineDash([]);
  for(let j=0;j<52;j++){const x=((j*7919)%113)/113*w, y=((j*2417)%97)/97*h;g.fillStyle=j%2?'#b9d57b55':'#a95f8755';g.fillRect(x,y,1.5,1.5)}
  strokes.forEach((line,i)=>drawLine(line,noteColors[i%noteColors.length],.93));
  if(active)drawLine(active,'#f7df88',1);
  // The current nib is a small, vibrating-looking hand-drawn crosshair.
  const x=nib.x*w,y=nib.y*h;g.beginPath();g.arc(x,y,8,0,Math.PI*2);g.strokeStyle='#f8f4c3';g.lineWidth=1.3;g.stroke();
  g.beginPath();g.moveTo(x-15,y-12);g.lineTo(x-10,y-6);g.moveTo(x+11,y+5);g.lineTo(x+19,y+12);g.strokeStyle='#dfec72';g.stroke();
  if(playing){const px=(step%16)/16*w;g.beginPath();g.moveTo(px,0);g.lineTo(px,h);g.strokeStyle='#f3d782aa';g.lineWidth=2;g.stroke()}
 }
 function coords(event){const r=paper.getBoundingClientRect();return{x:Math.min(1,Math.max(0,(event.clientX-r.left)/r.width)),y:Math.min(1,Math.max(0,(event.clientY-r.top)/r.height))}}
 function push(){const line=cleanStroke(active);if(line.length){strokes.push(line);if(strokes.length>12)strokes.shift();events=composeScore(strokes);say(`${strokes.length} MARK${strokes.length===1?'':'S'} / ${events.length} NOTES`);}active=null;draw()}
 paper.addEventListener('pointerdown',e=>{if(!paper.setPointerCapture)return;paper.setPointerCapture(e.pointerId);nib=coords(e);active=[nib];draw()});
 paper.addEventListener('pointermove',e=>{if(!active)return;nib=coords(e);active.push(nib);if(active.length>400)active=active.slice(-400);draw()});
 paper.addEventListener('pointerup',e=>{if(!active)return;try{paper.releasePointerCapture(e.pointerId)}catch{};push()});
 paper.addEventListener('pointercancel',()=>{active=null;draw()});
 paper.addEventListener('keydown',e=>{
  const moves={ArrowLeft:[-.03,0],ArrowRight:[.03,0],ArrowUp:[0,-.04],ArrowDown:[0,.04]};
  if(e.key in moves){e.preventDefault();nib={x:Math.min(1,Math.max(0,nib.x+moves[e.key][0])),y:Math.min(1,Math.max(0,nib.y+moves[e.key][1]))};draw()}
  if(e.key===' '||e.key==='Enter'){e.preventDefault();active=[nib];push()}
 });
 function setupAudio(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){say('SOUND UNAVAILABLE ON THIS BROWSER');return false}
  if(context)return true;context=new AC();master=context.createGain();master.gain.value=.17;
  delay=context.createDelay(.9);feedback=context.createGain();const send=context.createGain();delay.delayTime.value=.27;feedback.gain.value=.22;send.gain.value=.18;
  delay.connect(feedback);feedback.connect(delay);delay.connect(master);master.connect(context.destination);send.connect(delay);
  // Save the send node on the master for note connections, not on the global object.
  master._inkSend=send;return true
 }
 function note(e,when){
  if(!context||!master)return;const voice=context.createOscillator(),harmonic=context.createOscillator(),env=context.createGain(),filter=context.createBiquadFilter();
  voice.type='triangle';harmonic.type='sine';voice.frequency.setValueAtTime(e.frequency,when);harmonic.frequency.setValueAtTime(e.frequency*2.003,when);
  filter.type='lowpass';filter.frequency.setValueAtTime(Math.min(4200,850+e.register*220),when);filter.Q.value=.7;
  const voiceGain=context.createGain(),highGain=context.createGain();voiceGain.gain.value=.72;highGain.gain.value=.12;
  voice.connect(voiceGain);harmonic.connect(highGain);voiceGain.connect(filter);highGain.connect(filter);filter.connect(env);
  const amplitude=Math.min(.11,e.velocity*.13);env.gain.setValueAtTime(.0001,when);env.gain.exponentialRampToValueAtTime(amplitude,when+.018);env.gain.exponentialRampToValueAtTime(.0001,when+Math.max(.12,e.duration));
  env.connect(master);env.connect(master._inkSend);
  voice.start(when);harmonic.start(when);voice.stop(when+.8);harmonic.stop(when+.8);
  voice.onended=()=>{try{voice.disconnect();harmonic.disconnect();voiceGain.disconnect();highGain.disconnect();filter.disconnect();env.disconnect()}catch{}};
 }
 function tick(){if(!playing||!context||context.state!=='running')return;
  const advance=60/Number(tempo.value)/4;
  while(nextTime<context.currentTime+.12){
   events.filter(e=>e.beat===step).forEach(e=>note(e,nextTime));step=(step+1)%16;nextTime+=advance;
  }
  if(!reduced.matches)draw();
 }
 function stop(){playing=false;if(interval!==null)clearInterval(interval);interval=null;id('scratch-start').classList.remove('playing');draw()}
 id('scratch-start').addEventListener('click',async()=>{
  events=composeScore(strokes);if(!events.length){say('MAKE A MARK FIRST');return}
  if(!setupAudio())return;
  try{await context.resume()}catch{say('AUDIO CANNOT START HERE');return}
  if(context.state!=='running'){say('AUDIO NEEDS YOUR PERMISSION');return}
  stop();playing=true;step=0;nextTime=context.currentTime+.04;id('scratch-start').classList.add('playing');
  say('THE PAPER IS SINGING');tick();interval=setInterval(tick,25);
 });
 id('scratch-stop').addEventListener('click',()=>{stop();say('THE INK IS STILL HERE')});
 tempo.addEventListener('input',()=>{bpm.textContent=tempo.value});
 id('scratch-save').addEventListener('click',()=>{
  if(!strokes.length){say('THE PAPER IS EMPTY');return}
  try{localStorage.setItem(key,JSON.stringify({schema,tempo:Number(tempo.value),strokes}));say('KEPT ON THIS DEVICE ONLY')}
  catch{say('LOCAL SAVE UNAVAILABLE — EXPORT INSTEAD')}
 });
 id('scratch-export').addEventListener('click',()=>{
  if(!strokes.length){say('NOTHING TO EXPORT');return}
  const data=JSON.stringify({schema,tempo:Number(tempo.value),strokes},null,2),blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='crooked-score.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('SCORE EXPORTED');
 });
 id('scratch-erase').addEventListener('click',()=>{
  if(!eraseArmed){eraseArmed=true;say('PRESS ERASE AGAIN TO CLEAR');return}
  eraseArmed=false;stop();strokes=[];events=[];active=null;try{localStorage.removeItem(key)}catch{};draw();say('PAPER RESET');
 });
 function restore(){try{const raw=localStorage.getItem(key);if(!raw)return;const saved=validateSavedScore(JSON.parse(raw));if(!saved)return;strokes=saved.strokes;tempo.value=saved.tempo;bpm.textContent=tempo.value;events=composeScore(strokes);say('AN OLD SCRATCH IS STILL HERE')}catch{}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();if(context?.state==='running')context.suspend().catch(()=>{});say('MACHINE ASLEEP')}});
 window.addEventListener('pagehide',()=>{stop();if(context)context.close().catch(()=>{})});
 window.addEventListener('resize',resize);restore();resize();
})();