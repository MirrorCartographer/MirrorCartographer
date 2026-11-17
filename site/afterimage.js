/* The Carry: one user's deliberate material intervention changes a second room.
   A chemical signature is not an emotional diagnosis, identity, or language model. */
import {IMPRINT_KEY,APPLIED_KEY,validateImprint,worldEffect} from './world-imprint.mjs';
const host=document.getElementById('country');
if(host){
  let raw=null,applied=null;
  try{raw=JSON.parse(localStorage.getItem(IMPRINT_KEY)||'null');applied=localStorage.getItem(APPLIED_KEY);}catch{}
  const material=validateImprint(raw),effect=worldEffect(material);
  if(effect&&material.divergence>0){
    const stone=document.createElement('button');stone.id='foreign-stone';stone.type='button';stone.className='foreign-stone';
    const spent=applied===effect.materialId;
    stone.setAttribute('aria-label',spent?'Chemical imprint already changed this labyrinth':'Allow the Chemical Orchard imprint to rearrange these paths');
    stone.title=spent?'The country remembers':'The roads have not met this substance';
    const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;canvas.setAttribute('aria-hidden','true');
    stone.append(canvas);host.append(stone);
    const g=canvas.getContext('2d');
    if(g){g.clearRect(0,0,96,96);g.strokeStyle='#bdc5a3';g.lineWidth=2;g.beginPath();g.moveTo(23,7);g.lineTo(68,3);g.lineTo(91,33);g.lineTo(84,77);g.lineTo(52,93);g.lineTo(9,68);g.lineTo(5,28);g.closePath();g.stroke();
      for(let j=0;j<8;j++)for(let i=0;i<8;i++){const v=material.cells[j*8+i];if(v>0){g.fillStyle=effect.palette;g.globalAlpha=.24+.7*(v/15);g.fillRect(15+i*8.5,16+j*8.5,2+v/5,2+v/5)}}g.globalAlpha=1;
      g.font='26px serif';g.fillStyle=effect.palette;g.fillText('⌁',37,56);
    }
    if(spent)stone.classList.add('spent');
    stone.addEventListener('click',()=>{
      if(spent||stone.dataset.used==='yes')return;
      const maze=window.MC_LABYRINTH;
      if(!maze||typeof maze.reweaveFromImprint!=='function'){stone.setAttribute('aria-label','Labyrinth unavailable; the imprint is preserved');return;}
      // This destructive change is explicit, reversible by restarting the maze.
      const result=maze.reweaveFromImprint(effect.roadsSeed,effect.weather);
      if(!result?.allPortalsReachable)return;
      try{localStorage.setItem(APPLIED_KEY,effect.materialId)}catch{}
      stone.dataset.used='yes';stone.classList.add('spent');
      stone.setAttribute('aria-label','The material changed the roads; roads still connect all portals');
      const toast=document.getElementById('toast');if(toast){toast.textContent='THE COUNTRY TOOK IT IN.';toast.classList.add('shown');setTimeout(()=>toast.classList.remove('shown'),2300)}
      if(navigator.vibrate)try{navigator.vibrate([12,33,18])}catch{}
    });
    Object.defineProperty(window,'MC_AFTERIMAGE',{value:Object.freeze({getProof:()=>({materialId:effect.materialId,recipe:material.recipe,divergence:material.divergence,spent:stone.classList.contains('spent'),worldWeather:window.MC_LABYRINTH?.state?.().weather??null})}),configurable:false});
  }
}