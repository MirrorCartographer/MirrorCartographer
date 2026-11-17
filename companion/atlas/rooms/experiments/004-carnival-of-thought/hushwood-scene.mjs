// Hushwood: original procedural paper-cut forest and its gesture-responsive theatre.
// Receives all world state explicitly. Rendering does not infer feelings or identities.
import {edgesOf,triadOf,portalAt} from './hushwood-core.mjs';
const TAU=Math.PI*2,clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),rand=n=>{const x=Math.sin(n*17.691+3.1)*46817.12;return x-Math.floor(x)};
function line(ctx,x,y,x2,y2,color,width=1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function circle(ctx,x,y,r,fill,stroke=null,width=1){ctx.beginPath();ctx.arc(x,y,Math.max(.2,r),0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function oval(ctx,x,y,rx,ry,fill,stroke=null,width=1){ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function text(ctx,str,x,y,size,color,face='Georgia'){ctx.save();ctx.font='bold '+size+'px '+face;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(str,x,y);ctx.restore()}
function glow(ctx,x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function tree(ctx,x,y,s,depth,shade,t){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.strokeStyle=shade;ctx.lineCap='round';
 const arm=(xx,yy,angle,len,w,d)=>{
  const ex=xx+Math.cos(angle)*len,ey=yy+Math.sin(angle)*len;
  line(ctx,xx,yy,ex,ey,shade,w);
  if(d>0){arm(ex,ey,angle-.58+(rand(d*31+xx)*.18),len*.66,w*.67,d-1);arm(ex,ey,angle+.59-(rand(d*23+yy)*.18),len*.63,w*.67,d-1);}
 };
 arm(0,0,-Math.PI/2,35,9,depth);
 const branch=depth===3?61:44;
 for(let i=0;i<branch;i++){
  const a=i*2.399,rad=(i%8)*2.5,y0=-32-rad*3,xx=Math.sin(a)*rad*2.8;
  oval(ctx,xx,y0,4+rand(i)*3,2+rand(i+1)*3,shade==='#112d21'?'#244a3299':'#15291e99');
 }
 ctx.restore();
}
export function drawForest(ctx,W,H,forest,moth,time,still) {
 const t=still?0:time;
 const g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,'#07101b');g.addColorStop(.37,'#1e2930');g.addColorStop(.75,'#16261e');g.addColorStop(1,'#080e0d');
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const moonX=W*.78,moonY=H*.20,r=Math.min(W,H)*.12;
 glow(ctx,moonX,moonY,r*3,'#d4e89322');circle(ctx,moonX,moonY,r,'#b3c8aa');
 for(let i=0;i<18;i++){
  const xx=moonX+(rand(i)*2-1)*r,yy=moonY+(rand(i+33)*2-1)*r;
  if(Math.hypot(xx-moonX,yy-moonY)<r*.8)circle(ctx,xx,yy,rand(i+12)*r*.17,'#839b925e');
 }
 for(let layer=0;layer<3;layer++){
  const shade=['#132923','#0e1f1c','#081614'][layer];
  const y=H*(.66+layer*.11),size=(.55+layer*.35)*Math.min(W,H)*.005;
  for(let i=0;i<15;i++){
   const x=(i+.4*(layer%2))/14*W+Math.sin(i*8)*8;
   tree(ctx,x,y,Math.max(.8,size),3,shade,t);
  }
 }
 ctx.beginPath();
 ctx.moveTo(W*.41,H);
 ctx.quadraticCurveTo(W*.18,H*.77,W*.51,H*.63);
 ctx.quadraticCurveTo(W*.85,H*.81,W*.68,H);
 ctx.closePath();ctx.fillStyle='#5e514044';ctx.fill();
 for(let i=0;i<55;i++){
  const px=rand(i+11)*W,py=H*(.38+rand(i+66)*.62);
  const w=2+rand(i+70)*2,drift=still?0:Math.sin(t*.7+i)*8;
  circle(ctx,px+drift,py,w,'#c3ff7955');
 }
 // Lantern bridges reflect actual graph connectivity. No visual lines for non-edges.
 const aspect=W/H;
 edgesOf(forest,aspect).forEach(([i,j])=>{
  const a=forest.lanterns[i],b=forest.lanterns[j],ax=a.x*W,ay=a.y*H,bx=b.x*W,by=b.y*H;
  ctx.beginPath();ctx.moveTo(ax,ay);
  ctx.quadraticCurveTo((ax+bx)/2,(ay+by)/2-24, bx,by);
  ctx.strokeStyle='#d9fe7b55';ctx.lineWidth=2.2;ctx.stroke();
  const ratio=(Math.sin(t*1.4+i*.9+j)+1)*.5;
  circle(ctx,ax+(bx-ax)*ratio,ay+(by-ay)*ratio-4*Math.sin(ratio*Math.PI),2.5,'#d9ff88');
 });
 forest.lanterns.forEach((p,i)=>{
  const x=p.x*W,y=p.y*H,visited=forest.visited.includes(i),r=10+Math.sin(t*1.9+i)*2;
  glow(ctx,x,y,48,visited?'#e2fd9547':'#a8e17e26');
  oval(ctx,x,y+16,16,4,'#050c0888');
  line(ctx,x-9,y-14,x-9,y+15,'#c6b585',2);
  line(ctx,x+9,y-14,x+9,y+15,'#c6b585',2);
  line(ctx,x-9,y-14,x+9,y-14,'#c6b585',2);
  line(ctx,x-9,y+15,x+9,y+15,'#c6b585',2);
  circle(ctx,x,y,r,visited?'#f2ffb9':'#a7ea72');
  text(ctx,String(i+1),x,y,10,'#1b2716','monospace');
 });
 if(moth&&Number.isFinite(moth.x)&&forest.lanterns.length){
  const x=moth.x*W,y=moth.y*H-Math.sin(t*3)*4;
  glow(ctx,x,y,75,'#baff6a50');
  ctx.save();ctx.translate(x,y);
  const flap=still?.7:Math.cos(t*9)*.6+1;
  oval(ctx,-10,-3,17*flap,11,'#f3e7b7b0','#d5f9a1',1);
  oval(ctx,10,-3,17*flap,11,'#f3e7b7b0','#d5f9a1',1);
  oval(ctx,-6,9,13,7,'#9ac97ca0');
  oval(ctx,6,9,13,7,'#9ac97ca0');
  oval(ctx,0,2,4,17,'#19231e');
  line(ctx,-2,-8,-7,-19,'#cdeaba',1.5);line(ctx,2,-8,7,-19,'#cdeaba',1.5);
  ctx.restore();
 }
 if(forest.open){
  const p=portalAt(forest),x=p.x*W,y=p.y*H,rad=Math.min(W,H)*.088;
  glow(ctx,x,y,rad*3,'#caff9761');
  for(let i=0;i<4;i++){
   ctx.save();ctx.translate(x,y);ctx.rotate(i*.25+(still?0:t*.17));
   ctx.beginPath();ctx.ellipse(0,0,rad*(1+i*.11),rad*(1.35+i*.1),i*.2,0,TAU);
   ctx.strokeStyle=['#c5ee86','#e9d09b','#8bb393','#c5e8b9'][i];
   ctx.lineWidth=2-i*.2;ctx.stroke();ctx.restore();
  }
  circle(ctx,x,y,rad*.30,'#e5f4b9');
  text(ctx,'THE UNWRITTEN DOOR',x,y+rad*1.85,Math.max(9,Math.min(16,W*.025)),'#dbf5a1','monospace');
  const triad=triadOf(forest);
  if(triad){
   const p0=forest.lanterns[triad.ids[0]],p1=forest.lanterns[triad.ids[1]],p2=forest.lanterns[triad.ids[2]];
   ctx.beginPath();ctx.moveTo(p0.x*W,p0.y*H);
   ctx.lineTo(p1.x*W,p1.y*H);ctx.lineTo(p2.x*W,p2.y*H);ctx.closePath();
   ctx.strokeStyle='#d2fcb088';ctx.lineWidth=2;ctx.stroke();
  }
 }
 const copy=forest.open?'THE LIGHTS HAVE FOUND A DOOR':forest.lanterns.length<3?'PLANT LIGHTS · TAP ONE TO GUIDE THE MOTH':'MAKE PATHS · GUIDE THE MOTH THROUGH THREE DISTINCT LIGHTS';
 text(ctx,copy,W*.5,H*.88,Math.max(9,Math.min(15,W*.024)),'#e6f3be','monospace');
}
export function drawTheatre(ctx,W,H,forest,pulses,pointer,time,still) {
 const t=still?0:time;
 const g=ctx.createRadialGradient(W*.5,H*.6,2,W*.5,H*.56,W*.72);
 g.addColorStop(0,'#64724f');g.addColorStop(.35,'#2e3440');g.addColorStop(.9,'#150f24');g.addColorStop(1,'#08070f');
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // Curtains are individually scalloped and flutter only when motion is allowed.
 for(let side of [-1,1]){
  ctx.save();ctx.translate(side===-1?0:W,0);ctx.scale(side,1);
  const fold=still?0:Math.sin(t*.35)*W*.013;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*.23+fold,0);
  for(let y=0;y<=H+H/16;y+=H/16)ctx.lineTo(W*(.16+.03*Math.sin(y/H*25))+fold,y);
  ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle='#401c31';ctx.fill();
  for(let i=0;i<5;i++)line(ctx,W*.028+i*W*.03,0,W*.018+i*W*.027,H,'#9c5d734f',3);
  ctx.restore();
 }
 // Recompose the visitor's actual lantern graph as a projected miniature universe.
 const aspect=W/H;
 const positions=forest.lanterns.map(p=>({x:W*(.2+.6*p.x),y:H*(.31+.47*p.y)}));
 edgesOf(forest,aspect).forEach(([i,j])=>{
  const a=positions[i],b=positions[j];
  line(ctx,a.x,a.y,b.x,b.y,'#e0ff9f70',2);
 });
 for(let i=0;i<positions.length;i++){
  const p=positions[i];glow(ctx,p.x,p.y,30,'#c0ff8b70');circle(ctx,p.x,p.y,6,'#f3ffbf','#2d4635',2);
 }
 // Shadow responds continuously to pointer position, not a personality inference.
 const offX=(pointer.x/W-.5)*Math.min(W,H)*.28,offY=(pointer.y/H-.5)*Math.min(W,H)*.12;
 const sx=W*.5+offX,sy=H*.63+offY,r=Math.min(W,H)*.20;
 ctx.save();ctx.translate(sx,sy);
 ctx.globalAlpha=.86;
 oval(ctx,0,-r*.37,r*.26,r*.42,'#090d17');
 ctx.beginPath();ctx.moveTo(-r*.35,-r*.04);ctx.quadraticCurveTo(-r*.72,r*.41,-r*.55,r*.88);
 ctx.lineTo(r*.55,r*.88);ctx.quadraticCurveTo(r*.72,r*.41,r*.35,-r*.04);ctx.closePath();ctx.fillStyle='#090d17';ctx.fill();
 // Two eyes open slowly as visitors mark the canvas.
 if(pulses.length>=2){
  for(const sign of [-1,1]){
   oval(ctx,sign*r*.105,-r*.38,r*.052,r*.028,'#caff90');
   circle(ctx,sign*r*.105+(pointer.x/W-.5)*4,-r*.38,2,'#14201c');
  }
 }
 ctx.restore();
 // Wavy pulse fronts form a visual interference pattern from actual user taps.
 for(let i=0;i<pulses.length;i++){
  const p=pulses[i],age=clamp(t-p.at,0,14);
  const rad=8+age*39,fade=1-age/14;
  for(let ring=0;ring<3;ring++){
   ctx.beginPath();ctx.ellipse(p.x*W,p.y*H,rad+ring*17,(rad+ring*17)*.68,0,0,TAU);
   ctx.strokeStyle='rgba(208,252,157,'+Math.max(0,fade*(.46-ring*.1))+')';
   ctx.lineWidth=1.6;ctx.stroke();
  }
 }
 text(ctx,'THE THEATRE OF WHAT WAS NOT SAID',W*.5,H*.25,Math.max(11,Math.min(21,W*.037)),'#def3bb','monospace');
 const line1=pulses.length<2?'TOUCH THE STAGE. IT WILL CHANGE WHAT YOU SEE.':
  pulses.length<6?'A SHADOW IS NOT A TESTIMONY.':'THE SKY REMEMBERS THE MOVEMENT, NOT THE MEANING.';
 text(ctx,line1,W*.5,H*.87,Math.max(10,Math.min(15,W*.025)),'#e4d6b4','monospace');
}
