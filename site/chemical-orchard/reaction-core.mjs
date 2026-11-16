/* THE CHEMICAL ORCHARD — deterministic Gray–Scott reaction–diffusion.
   This is an art simulation, not a claim about a real chemical experiment.
   No private data, services, third-party assets, or ML calls. */

export const RECIPES = Object.freeze([
  { id: 'lacing', name: 'LACE', symbol: '⌁', feed: 0.0367, kill: 0.0649, color: [215, 240, 77] },
  { id: 'leopard', name: 'FERAL', symbol: '✳', feed: 0.0300, kill: 0.0620, color: [242, 94, 145] },
  { id: 'coral', name: 'BLOOM', symbol: 'ϟ', feed: 0.0545, kill: 0.0620, color: [93, 206, 191] },
]);

export function createField(width = 178, height = 126) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 8 || height < 8 || width * height > 1_000_000) throw new RangeError('Invalid grid');
  const n = width * height;
  const a = new Float32Array(n), b = new Float32Array(n);
  const nextA = new Float32Array(n), nextB = new Float32Array(n);
  a.fill(1);
  return {width,height,a,b,nextA,nextB,ticks:0,inputs:0};
}

/** Introduce B and remove an equivalent portion of A, with a tapered radial edge. */
export function inoculate(field, x, y, radius = 5, amount = 0.8) {
  if (![x,y,radius,amount].every(Number.isFinite)) return;
  radius = Math.max(1,Math.min(45,radius)); amount=Math.max(0,Math.min(1,amount));
  const {width:w,height:h,a,b} = field;
  const xmin=Math.max(1,Math.floor(x-radius)), xmax=Math.min(w-2,Math.ceil(x+radius));
  const ymin=Math.max(1,Math.floor(y-radius)), ymax=Math.min(h-2,Math.ceil(y+radius));
  for(let j=ymin;j<=ymax;j++) for(let i=xmin;i<=xmax;i++){
    const r=Math.hypot(i-x,j-y)/radius;if(r>1)continue;
    const f=amount*(1-r*r);const k=j*w+i;
    b[k]=Math.min(1,b[k]+f);a[k]=Math.max(0,a[k]-f*.62);
  }
  field.inputs++;
}

/** Seed from coordinates rather than clock/randomness, so replays are reproducible. */
export function seedField(field, seed=731) {
  field.a.fill(1);field.b.fill(0);field.ticks=0;field.inputs=0;
  let z=(seed>>>0)||1;
  function rnd(){z^=z<<13;z^=z>>>17;z^=z<<5;return (z>>>0)/4294967296;}
  const n=5;
  for(let i=0;i<n;i++) {
    const x=field.width*(.2+.6*rnd()),y=field.height*(.18+.64*rnd());
    inoculate(field,x,y,4+6*rnd(),.7+.2*rnd());
  }
  return field;
}

/** Periodic Neumann-style edge clamping, nine-point discrete Laplacian. */
export function advance(field, recipe=RECIPES[0], steps=1) {
  const {width:w,height:h}=field;
  if(!Number.isInteger(steps)||steps<0||steps>128)throw new RangeError('Invalid steps');
  const feed=recipe.feed, kill=recipe.kill;
  if(!(feed>=0&&feed<.1&&kill>=0&&kill<.1))throw new RangeError('Invalid reaction coefficients');
  for(let t=0;t<steps;t++){
    let a=field.a,b=field.b,na=field.nextA,nb=field.nextB;
    for(let y=0;y<h;y++){
      const ym=(y===0?0:y-1)*w, yp=(y===h-1?h-1:y+1)*w, row=y*w;
      for(let x=0;x<w;x++){
        const xl=x===0?0:x-1, xr=x===w-1?w-1:x+1, i=row+x;
        const A=a[i],B=b[i];
        const lapA=-A+.2*(a[row+xl]+a[row+xr]+a[ym+x]+a[yp+x])+.05*(a[ym+xl]+a[ym+xr]+a[yp+xl]+a[yp+xr]);
        const lapB=-B+.2*(b[row+xl]+b[row+xr]+b[ym+x]+b[yp+x])+.05*(b[ym+xl]+b[ym+xr]+b[yp+xl]+b[yp+xr]);
        const react=A*B*B;
        na[i]=Math.min(1,Math.max(0,A+1.0*lapA-react+feed*(1-A)));
        nb[i]=Math.min(1,Math.max(0,B+0.5*lapB+react-(kill+feed)*B));
      }
    }
    field.a=na;field.b=nb;field.nextA=a;field.nextB=b;field.ticks++;
  }
  return field;
}

/** Coarse aggregate, for actual visual/sound changes rather than scripted labels. */
export function sampleField(field, stride=7){
  let live=0,total=0,edge=0,peak=0;
  const {b,width:w,height:h}=field;
  for(let y=1;y<h-1;y+=stride)for(let x=1;x<w-1;x+=stride){
    const i=y*w+x,v=b[i];total++;peak=Math.max(v,peak);if(v>.15)live++;if(Math.abs(b[i+1]-b[i-1])+Math.abs(b[i+w]-b[i-w])>.08)edge++;
  }
  return {coverage:live/Math.max(1,total),complexity:edge/Math.max(1,total),peak,steps:field.ticks,interventions:field.inputs};
}