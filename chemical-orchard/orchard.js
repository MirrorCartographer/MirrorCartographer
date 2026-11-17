import {RECIPES,sampleField} from './reaction-core.mjs';
import {createTwins,intervene,advanceTwins,divergence,distillTwins} from './unlived-core.mjs';
import {IMPRINT_KEY,validateImprint} from '../world-imprint.mjs';

// Room-specific experiential grammar: touch introduces matter; a real nonlinear
// reaction-diffusion field unfolds. No prewritten animation, model, or diagnosis.
const $=id=>document.getElementById(id);
const canvas=$('specimen'), context=canvas.getContext('2d',{alpha:false});
const page=$('orchard');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!context){$('state').textContent='UNAVAILABLE';throw new Error('No canvas support');}
const W=178,H=126;let twins=createTwins(W,H,20261116);let field=twins.lived;
let recipe=RECIPES[0], pointer=false, raf=0, lastDraw=0, sample={coverage:0,complexity:0,peak:0};
let audio=null,soundEnabled=false,oscillator=null,tone=null,noise=null,resetArmed=false,seed=20261116;
let cursor={x:W/2,y:H/2},lastX=cursor.x,lastY=cursor.y,strokeLength=0,lastHaptic=0;
const buffer=document.createElement('canvas');buffer.width=W;buffer.height=H;
const ghostCanvas=$('unlived-specimen'),ghostContext=ghostCanvas.getContext('2d',{alpha:false});
const ghostBuffer=document.createElement('canvas');ghostBuffer.width=W;ghostBuffer.height=H;
const ghostPixels=ghostBuffer.getContext('2d',{alpha:false});const ghostImage=ghostPixels.createImageData(W,H);
let witness=0,drift=0;
const pixels=buffer.getContext('2d',{alpha:false});const image=pixels.createImageData(W,H);
let toastTimeout;

function notice(s){$('toast').textContent=s;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),1250)}
function position(e){const r=canvas.getBoundingClientRect();return {x:Math.min(W-2,Math.max(1,(e.clientX-r.left)/Math.max(1,r.width)*W)),y:Math.min(H-2,Math.max(1,(e.clientY-r.top)/Math.max(1,r.height)*H))};}
function reaction(x,y,r=5){intervene(twins,x,y,r,.93);cursor={x,y};const rect=canvas.getBoundingClientRect();$('crosshair').style.left=`${x/W*100}%`;$('crosshair').style.top=`${y/H*100}%`;$('crosshair').classList.remove('reacting');void $('crosshair').offsetWidth;$('crosshair').classList.add('reacting');const now=performance.now();if(now-lastHaptic>85&&navigator.vibrate){lastHaptic=now;try{navigator.vibrate(9)}catch{}}}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();pointer=true;canvas.setPointerCapture(e.pointerId);const p=position(e);lastX=p.x;lastY=p.y;strokeLength=0;reaction(p.x,p.y,4.4);});
canvas.addEventListener('pointermove',e=>{if(!pointer)return;const p=position(e);const length=Math.hypot(p.x-lastX,p.y-lastY);strokeLength+=length;if(length>=2.2){const parts=Math.min(8,Math.ceil(length/3));for(let i=1;i<=parts;i++)reaction(lastX+(p.x-lastX)*i/parts,lastY+(p.y-lastY)*i/parts,3.2+Math.min(4,length*.12));lastX=p.x;lastY=p.y;}});
function release(){pointer=false}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
canvas.addEventListener('keydown',e=>{const moves={ArrowUp:[0,-3],ArrowDown:[0,3],ArrowLeft:[-3,0],ArrowRight:[3,0]};if(e.key in moves){e.preventDefault();cursor.x=Math.max(2,Math.min(W-3,cursor.x+moves[e.key][0]));cursor.y=Math.max(2,Math.min(H-3,cursor.y+moves[e.key][1]));notice('⊹');}else if(e.key===' '||e.key==='Enter'){e.preventDefault();reaction(cursor.x,cursor.y,6);}});

function changeRecipe(id){const found=RECIPES.find(r=>r.id===id);if(!found)return;
  recipe=found;page.dataset.recipe=id;
  document.querySelectorAll('[data-recipe]').forEach(b=>{const active=b.dataset.recipe===id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  // Every recipe changes the chemical system in place. No reset on switch.
  notice(found.symbol);
}
document.querySelectorAll('[data-recipe]').forEach(b=>b.addEventListener('click',()=>changeRecipe(b.dataset.recipe)));

function render(){const a=field.a,b=field.b,p=image.data;let i=0;
  const col=recipe.color,light=[56,71,53];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const k=y*W+x,v=b[k];const s=Math.max(0,Math.min(1,(v-.05)*2.35));
    const gx=(x>0&&x<W-1?b[k+1]-b[k-1]:0),gy=(y>0&&y<H-1?b[k+W]-b[k-W]:0);
    const relief=Math.max(-.25,Math.min(.25,-gx*.8-gy*1.45));
    const halo=Math.max(0,Math.min(.25,(a[k]-.7)*.13));
    const pigment=Math.max(0,Math.min(1,s+relief+halo));
    p[i++]=Math.floor(18+(col[0]-18)*pigment+light[0]*Math.min(.15,v));
    p[i++]=Math.floor(25+(col[1]-25)*pigment+light[1]*Math.min(.15,v));
    p[i++]=Math.floor(18+(col[2]-18)*pigment+light[2]*Math.min(.15,v));
    p[i++]=255;
  }
  pixels.putImageData(image,0,0);
  context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';context.drawImage(buffer,0,0,canvas.width,canvas.height);
  if(witness>0&&ghostContext){
    const ghost=twins.unlived.b,g=ghostImage.data;let k=0;
    for(let i=0;i<ghost.length;i++){
      const v=Math.min(1,Math.max(0,(ghost[i]-.04)*2.55));
      g[k++]=Math.floor(20+151*v);g[k++]=Math.floor(29+175*v);g[k++]=Math.floor(33+182*v);g[k++]=255;
    }
    ghostPixels.putImageData(ghostImage,0,0);ghostContext.imageSmoothingEnabled=true;
    ghostContext.drawImage(ghostBuffer,0,0,ghostCanvas.width,ghostCanvas.height);
  }
}
function setSize(){const r=canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;const d=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ghostCanvas.width=canvas.width;ghostCanvas.height=canvas.height;render();}
window.addEventListener('resize',setSize,{passive:true});

function syncAudio(){if(!soundEnabled||!audio||audio.state!=='running'||!oscillator||!tone)return;const now=audio.currentTime;const intensity=Math.min(1,sample.coverage*3+.04);oscillator.frequency.setTargetAtTime(65+sample.complexity*740+RECIPES.indexOf(recipe)*32,now,.18);tone.gain.setTargetAtTime(.009+.027*intensity,now,.23);noise.frequency.setTargetAtTime(210+sample.peak*600,now,.14);}
async function toggleSound(){if(soundEnabled){soundEnabled=false;tone?.gain.setTargetAtTime(0,audio.currentTime,.08);$('sound').setAttribute('aria-pressed','false');$('sound').setAttribute('aria-label','Enable sound');return;}
  try{if(!audio){const CT=window.AudioContext||window.webkitAudioContext;if(!CT)throw new Error('Audio unsupported');audio=new CT();oscillator=audio.createOscillator();oscillator.type='triangle';oscillator.frequency.value=110;noise=audio.createBiquadFilter();noise.type='lowpass';noise.frequency.value=500;tone=audio.createGain();tone.gain.value=0;oscillator.connect(noise).connect(tone).connect(audio.destination);oscillator.start();}
  await audio.resume();soundEnabled=audio.state==='running';$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').setAttribute('aria-label',soundEnabled?'Disable sound':'Enable sound');syncAudio();
  }catch{soundEnabled=false;notice('SOUND UNAVAILABLE');}
}
$('sound').addEventListener('click',toggleSound);
document.addEventListener('visibilitychange',()=>{if(document.hidden){soundEnabled=false;if(audio?.state==='running')audio.suspend().catch(()=>{});$('sound').setAttribute('aria-pressed','false');}});

function frame(now){raf=requestAnimationFrame(frame);if(document.hidden)return;
  // Cap mobile simulation work and pause motion when OS requests reduced motion.
  if(now-lastDraw < (reduced.matches?160:37))return;
  lastDraw=now;
  advanceTwins(twins,recipe,reduced.matches?1:2);
  if(field.ticks%12<3){sample=sampleField(field);drift=divergence(twins);$('drift').textContent=drift.toFixed(5);$('state').textContent=sample.coverage>.24?'FERMENTING':sample.coverage>.075?'MULTIPLYING':'GROWING';$('living-numbers').textContent=`${sample.coverage.toFixed(3)} / ${sample.complexity.toFixed(3)}`;$('ticks').textContent=String(field.ticks).padStart(6,'0');syncAudio();
   const gate=({lacing:.017,leopard:.082,coral:.105})[recipe.id];
   if(sample.complexity>gate&&field.ticks>240)$('hidden-door').hidden=false;
  }
  render();
}

$('erase').addEventListener('click',()=>{if(!resetArmed){resetArmed=true;$('erase').classList.add('armed');notice('⟲ ?');return;}resetArmed=false;$('erase').classList.remove('armed');twins=createTwins(W,H,++seed);field=twins.lived;drift=0;$('drift').textContent='0.00000';$('hidden-door').hidden=true;notice('✳');});
$('export').addEventListener('click',()=>{const a=document.createElement('a');a.download='chemical-orchard-'+recipe.id+'.png';a.href=canvas.toDataURL('image/png');a.click();notice('⇩');});
$('witness').addEventListener('input',e=>{
  witness=Math.max(0,Math.min(100,Number(e.target.value)||0));
  ghostCanvas.style.clipPath=`inset(0 0 0 ${100-witness}%)`;
  $('witness-seam').style.left=`${witness}%`;
  $('witness-seam').hidden=witness===0;
  e.target.setAttribute('aria-valuetext',`${witness}% of the untouched branch visible`);
  render();
});
$('bottle').addEventListener('click',()=>{
  if(twins.interventions===0){notice('THE GLASS REMAINS UNCHANGED.');return;}
  const imprint=distillTwins(twins,recipe);
  if(imprint.divergence===0){notice('TWO FUTURES STILL AGREE.');return;}
  try{localStorage.setItem(IMPRINT_KEY,JSON.stringify(imprint));
    $('carry-back').hidden=false;$('bottle').classList.add('sealed');
    notice('SOMETHING FOLLOWED YOU.');
  }catch{notice('THIS DEVICE CANNOT KEEP THE SPECIMEN.');}
});
$('tactile').addEventListener('change',()=>{if(navigator.vibrate)try{navigator.vibrate([18,20,12])}catch{}notice('✳');});

setSize();render();raf=requestAnimationFrame(frame);
window.MC_CHEMICAL_ORCHARD=Object.freeze({getProof(){return {recipe:recipe.id,steps:field.ticks,inputs:twins.interventions,fieldSample:sampleField(field),divergence:divergence(twins),unlivedSteps:twins.unlived.ticks,canTransfer:twins.interventions>0,imprintInStorage:(()=>{try{return !!validateImprint(JSON.parse(localStorage.getItem(IMPRINT_KEY)))}catch{return false}})(),audioActive:soundEnabled,hasExport:!!$('export'),privacy:'no network or identity collection'}}});