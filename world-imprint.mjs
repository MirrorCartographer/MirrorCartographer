/* Mirror Cartographer: a reversible physical memory between rooms.
   This is a material signature, NEVER a psychological inference. No network. */
export const IMPRINT_KEY='mc.living-country.material.v1';
export const APPLIED_KEY='mc.living-country.applied.v1';
export const VERSION=1;
export const MAX_AGE_DAYS=90;
const recipes=new Set(['lacing','leopard','coral']);

/** FNV-1a is an accidental-corruption check, not a cryptographic signature. */
export function hashString(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function payload(recipe,ticks,divergence,cells){return `${VERSION}:${recipe}:${ticks}:${divergence}:${cells.join(',')}`;}
export function makeImprint({recipe,ticks,divergence,cells}){
 if(!recipes.has(recipe)||!Number.isInteger(ticks)||ticks<0||ticks>10_000_000||!Number.isInteger(divergence)||divergence<0||divergence>10000||!Array.isArray(cells)||cells.length!==64||cells.some(v=>!Number.isInteger(v)||v<0||v>15))throw new TypeError('Invalid material state');
 const hash=hashString(payload(recipe,ticks,divergence,cells));
 return {version:VERSION,kind:'material-not-person',source:'chemical-orchard',recipe,ticks,divergence,cells:[...cells],hash};
}
export function validateImprint(o){
 try{if(!o||o.version!==VERSION||o.kind!=='material-not-person'||o.source!=='chemical-orchard'||!Number.isInteger(o.hash))return null;
 const fresh=makeImprint(o);return fresh.hash===o.hash?fresh:null;}catch{return null;}
}
export function worldEffect(imprint){
 const o=validateImprint(imprint);if(!o)return null;
 const h=o.hash>>>0;const weather=['hush','static','storm','heat'][(h>>>5)%4];
 const roadsSeed=(((h^0x9e3779b9)>>>0)||173)>>>0;
 const palette=['#d7ef57','#f1789e','#91d9c4'][['lacing','leopard','coral'].indexOf(o.recipe)];
 return {weather,roadsSeed,palette,phase:(h%128)/128,materialId:h.toString(16).padStart(8,'0'),divergence:o.divergence};
}
/** Inputs are two actual B concentration fields, not user metadata or transcripts. */
export function distillFields(a,b,width,height,recipe,ticks){
 if(!a||!b||a.length!==b.length||width*height!==a.length||width<8||height<8)throw new RangeError('Incompatible worlds');
 let total=0;
 for(let i=0;i<a.length;i++)total+=Math.abs(a[i]-b[i]);
 const divergence=Math.min(10000,Math.round((total/a.length)*10000));
 const cells=[];
 for(let j=0;j<8;j++)for(let i=0;i<8;i++){
  let sum=0,n=0;
  const x0=Math.floor(i*width/8),x1=Math.max(x0+1,Math.floor((i+1)*width/8));
  const y0=Math.floor(j*height/8),y1=Math.max(y0+1,Math.floor((j+1)*height/8));
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){sum+=Math.abs(a[y*width+x]-b[y*width+x]);n++;}
  cells.push(Math.min(15,Math.floor(35*sum/Math.max(1,n))));
 }
 return makeImprint({recipe,ticks,divergence,cells});
}