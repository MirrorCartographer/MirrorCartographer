/*
  THE LIVING COUNTRY / WALKABLE ENGINE 1.0
  No model/API requests, no analytics, no third-party sound or assets.
  Provenance boundary: authored environmental phrases are not user memories.
  The private notebook never publishes or uploads its text.
*/
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root=$('country'), canvas=$('terrain'), ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){$('failsafe').hidden=false;return;}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const COLUMNS=39, ROWS=29;
const PORTALS=[
 {id:'sky',name:'WORDLESS SKY',glyph:'ϟ',line:'The weather remembers how to speak without words.',route:'./wordless-sky/',color:'#d4f470',sound:2},
 {id:'between',name:'THE BETWEEN',glyph:'∴',line:'Somewhere the distance between two people goes strange.',route:'./expeditions/the-between.html',color:'#f4abbd',sound:4},
 {id:'music',name:'RADIO GHOST',glyph:'♫',line:'A station with no permission to behave.',route:'./companion/atlas/rooms/music/',color:'#b08dec',sound:7},
 {id:'arcade',name:'CARNIVAL',glyph:'✳',line:'Something is laughing behind the Ferris wheel.',route:'./companion/atlas/rooms/arcade/',color:'#ef6582',sound:6},
 {id:'art',name:'IMAGE ORGANISM',glyph:'⌁',line:'Give it a mark. See what grows.',route:'./image-organism.html',color:'#91dbc7',sound:9},
 {id:'atlas',name:'THE LIVING ATLAS',glyph:'◈',line:'Here are all the maps that tried to make sense.',route:'./living-atlas.html',color:'#e3c390',sound:5},
 {id:'mind',name:'MIND PALACE',glyph:'◎',line:'A floor plan will not survive this house.',route:'./mind-palace/',color:'#d8a8df',sound:3},
 {id:'character',name:'CHARACTER ATELIER',glyph:'♟',line:'A little life might crawl out of what you made.',route:'./companion/atlas/rooms/character-atelier/',color:'#edce77',sound:8},
 {id:'gravity',name:'HOUSE OF GRAVITY',glyph:'↯',line:'The floor disagrees with the ceiling.',route:'./companion/atlas/rooms/house-that-forgets-gravity/',color:'#82c7de',sound:5},
 {id:'artists',name:'ARTISTS',glyph:'✥',line:'Nobody wants a frame around a wildfire.',route:'./entrances/art.html',color:'#d8f055',sound:9},
 {id:'orchard',name:'NIGHT SHIFT',glyph:'♣',line:'The trees have been working since you slept.',route:'./companion/atlas/rooms/night-shift-orchard/',color:'#a9c66b',sound:2},
 {id:'screen',name:'THE SCREENING ROOM',glyph:'▣',line:'There is a film playing in the next room.',route:'./companion/atlas/rooms/screening-room/',color:'#f3a879',sound:7},
];
const STORAGE='mc.living-country.2', TRACE='mc.living-country.trace.1';
function get(key,fallback){try{const o=localStorage.getItem(key);return o===null?fallback:JSON.parse(o)}catch{return fallback}}
function put(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
const stored=get(STORAGE,{});
let seed=(Number.isInteger(stored.seed)?stored.seed:Date.now()>>>0)>>>0;
let weather=['hush','static','storm','heat'].includes(stored.weather)?stored.weather:'static';
let seen=new Set(Array.isArray(stored.seen)?stored.seen.filter(x=>Number.isInteger(x)):[]);
let found=new Set(Array.isArray(stored.found)?stored.found.filter(x=>typeof x==='string'):[]);
let scraps=0;
let W=0,H=0,DPR=1,S=80, camera={x:19,y:15},player={x:19,y:15},walk=[], portals=[],grid=[], particles=[],rings=[],now=0,last=0,stepTick=0,mouse={x:-1,y:-1},touch=false,encounter=null,toastTimeout=null;
let audio=null,soundOn=false,drone=null,droneGain=null,voiceOn=false;
let stroke=null,ink=[],lastGesture=null;
function randFactory(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(x,y,t=0){let n=Math.imul((x+7)|0,374761393)^Math.imul((y+41)|0,668265263)^Math.imul((t+seed)|0,2246822519);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295}
const index=(x,y)=>y*COLUMNS+x,valid=(x,y)=>x>=0&&y>=0&&x<COLUMNS&&y<ROWS;
const open=(x,y)=>valid(x,y)&&grid[index(x,y)]===0;
const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
function generate(){
 const rand=randFactory(seed);grid=Array(COLUMNS*ROWS).fill(1);const start={x:19,y:15}, stack=[start];grid[index(start.x,start.y)]=0;
 while(stack.length){const c=stack[stack.length-1];const n=dirs.map(([dx,dy])=>({x:c.x+2*dx,y:c.y+2*dy,dx,dy})).filter(p=>p.x>0&&p.y>0&&p.x<COLUMNS-1&&p.y<ROWS-1&&grid[index(p.x,p.y)]===1);
 if(!n.length){stack.pop();continue}const next=n[Math.floor(rand()*n.length)];grid[index(c.x+next.dx,c.y+next.dy)]=0;grid[index(next.x,next.y)]=0;stack.push(next)}
 // A few loops make a strange country rather than a forced single corridor.
 for(let n=0;n<42;n++){const x=2+Math.floor(rand()*(COLUMNS-4)),y=2+Math.floor(rand()*(ROWS-4));if(grid[index(x,y)]===1&&((open(x-1,y)&&open(x+1,y))||(open(x,y-1)&&open(x,y+1))))grid[index(x,y)]=0}
 // Fix generated grid connectivity by only removing walls; invariant checked by diagnostics.
 const distances=bfsDistances(start.x,start.y);
 const candidates=[];for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLUMNS-1;x++){
 if(!open(x,y))continue;const degree=dirs.reduce((n,[dx,dy])=>n+(open(x+dx,y+dy)?1:0),0);
 if(degree<=2)candidates.push({x,y,depth:distances[index(x,y)],degree});}
 candidates.sort((a,b)=>(b.depth+hash(b.x,b.y)*3)-(a.depth+hash(a.x,a.y)*3));
 const chosen=[];const nearby=dirs.flatMap(([dx,dy])=>[{x:19+2*dx,y:15+2*dy}]).filter(p=>open(p.x,p.y));
 if(nearby.length)chosen.push({...nearby[Math.floor(rand()*nearby.length)],depth:2});
 for(const point of candidates){if(chosen.length>=PORTALS.length)break;if(chosen.every(p=>Math.hypot(p.x-point.x,p.y-point.y)>=4.5))chosen.push(point)}
 if(chosen.length<PORTALS.length){for(const point of candidates){if(chosen.length>=PORTALS.length)break;if(!chosen.some(p=>p.x===point.x&&p.y===point.y))chosen.push(point)}}
 // Start in an illustrated crossroad; the first portal is in view without an instruction panel.
 portals=PORTALS.map((p,i)=>({...p,...chosen[i]}));player={x:start.x,y:start.y};camera={...player};walk=[];
 visitedNear(player.x,player.y);makeParticles();
}
function bfsDistances(x,y){const dist=Array(COLUMNS*ROWS).fill(-1),q=[[x,y]];dist[index(x,y)]=0;for(let k=0;k<q.length;k++){const [a,b]=q[k];for(const [dx,dy] of dirs){const nx=a+dx,ny=b+dy;if(open(nx,ny)&&dist[index(nx,ny)]===-1){dist[index(nx,ny)]=dist[index(a,b)]+1;q.push([nx,ny])}}}return dist}
function routeTo(x,y){const from={x:Math.round(player.x),y:Math.round(player.y)};if(!open(from.x,from.y)||!open(x,y))return[];const seenNodes=new Set([index(from.x,from.y)]),q=[from],parent=new Map();let goal=false;
 for(let i=0;i<q.length;i++){const node=q[i];if(node.x===x&&node.y===y){goal=true;break}for(const [dx,dy] of dirs){const nx=node.x+dx,ny=node.y+dy,id=index(nx,ny);if(open(nx,ny)&&!seenNodes.has(id)){seenNodes.add(id);parent.set(id,index(node.x,node.y));q.push({x:nx,y:ny})}}}
 if(!goal)return[];const path=[];let k=index(x,y),first=index(from.x,from.y);while(k!==first){path.push({x:k%COLUMNS,y:Math.floor(k/COLUMNS)});k=parent.get(k);if(k===undefined)return[]}return path.reverse()}
function nearestOpen(x,y){x=Math.round(x);y=Math.round(y);if(open(x,y))return{x,y};for(let r=1;r<5;r++){let foundTile=null,score=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r||!open(x+dx,y+dy))continue;const s=Math.hypot(dx,dy);if(s<score){score=s;foundTile={x:x+dx,y:y+dy}}}if(foundTile)return foundTile}return null}
function visitedNear(x,y){for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){if(valid(x+dx,y+dy)&&Math.hypot(dx,dy)<=3.6)seen.add(index(x+dx,y+dy))}if(seen.size%7===0)save()}
function save(){put(STORAGE,{schema:2,seed,weather,seen:[...seen],found:[...found]})}
function setWeather(w){weather=w;root.dataset.weather=w;save();$('weather').setAttribute('title','Weather: '+w);$('weather').setAttribute('aria-label','Change weather. Current: '+w);$('ambient-a').textContent={hush:'THE AIR HAS STOPPED TO LISTEN.',static:'EVERY ROAD HAS AN OPINION.',storm:'THE CLOUDS ARE HAVING AN ARGUMENT.',heat:'THE NIGHT HAS A FEVER.'}[w];if(soundOn)chirp(2)}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('shown');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('shown'),reduced.matches?1900:3000)}
function makeParticles(){const r=randFactory(seed^0xDEADBEEF);particles=Array.from({length:75},()=>({x:r(),y:r(),v:3+r()*5,r:.6+r()*2.4,s:r()*6.283}));}
function resize(){const rect=canvas.getBoundingClientRect();W=Math.max(1,rect.width);H=Math.max(1,rect.height);DPR=Math.min(devicePixelRatio||1,2);canvas.width=Math.ceil(W*DPR);canvas.height=Math.ceil(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);S=Math.max(55,Math.min(93,Math.min(W/6.6,H/5.8)));}
function xy(x,y){return[(x-camera.x)*S+W/2,(y-camera.y)*S+H/2]}
function circle(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function line(a,b,c,d,col,width=1){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke()}
function drawGround(x,y,X,Y){
 const h=hash(x,y);ctx.save();ctx.translate(X,Y);
 // A torn contour, not a square floor tile.
 for(let i=0;i<5;i++){
  const a=hash(x,y,21+i)*Math.PI*2,rx=Math.cos(a)*S*.29,ry=Math.sin(a)*S*.29;
  circle(rx,ry,S*(.04+.075*hash(x,y,52+i)),['#9a9d7544','#a5ac7855','#61938a55','#d27c8555','#b2c98044'][i]);
 }
 if(h>.36){ctx.beginPath();ctx.moveTo(-S*.4,S*.13);ctx.bezierCurveTo(-S*.14,-S*.11,S*.06,S*.22,S*.41,-S*.06);ctx.strokeStyle='#c5ad7e77';ctx.lineWidth=1.4;ctx.stroke()}
 if(h>.63){ctx.fillStyle='#c1dd82a8';ctx.font=`${S*.20}px Georgia`;ctx.fillText(['✳','ϟ','⋄','⌁'][Math.floor(hash(x,y,7)*4)],-S*.08,S*.03)}
 ctx.restore();}

function drawWall(x,y,X,Y){
 const t=hash(x,y),q=hash(x,y,4);ctx.save();ctx.translate(X,Y);
 // Collaged ink shrubs, their silhouettes interlocking across tile boundaries.
 const cx=(q-.5)*S*.24,cy=(t-.5)*S*.19;
 for(let k=0;k<4;k++){
  const rr=S*(.25+k*.07),r=hash(x,y,k+7);
  ctx.beginPath();ctx.ellipse(cx+(r-.5)*S*.34,cy+(hash(x,y,k+11)-.5)*S*.4,rr,rr*.65,Math.PI*r,0,Math.PI*2);
  ctx.fillStyle=['#0b1917c9','#14231fdf','#1d2720cf','#273123b3'][k];ctx.fill();
 }
 // Roots and a scratchboard-pencil white contour; no rectangle grid.
 ctx.strokeStyle=t>.6?'#a69a6480':'#8f9e6560';ctx.lineWidth=1.2;ctx.lineCap='round';
 for(let j=0;j<4;j++){
  const angle=hash(x,y,j+12)*Math.PI*2,rr=S*(.24+.09*hash(x,y,j+17));
  const px=Math.cos(angle)*rr,py=Math.sin(angle)*rr;
  ctx.beginPath();ctx.moveTo(px,py);ctx.bezierCurveTo(px-S*.13,py-S*.11,px+S*.20,py-S*.26,px+S*.15,py-S*.39);ctx.stroke();
  if(j===1){ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px-S*.24,py+S*.2,px-S*.36,py+S*.13);ctx.stroke()}
 }
 if(t>.86){ctx.fillStyle='#d5c1806e';ctx.font=`${S*.25}px Georgia`;ctx.fillText(['ϟ','♣','⋄','∴'][Math.floor(hash(x,y,22)*4)],-S*.12,S*.09)}
 ctx.restore();}

function drawPortal(p,X,Y){
 const t=now*.001,scale=1+Math.sin(t*1.9+p.sound)*.042;ctx.save();ctx.translate(X,Y);ctx.scale(scale,scale);
 const col=p.color,rr=S*.5;
 let grad=ctx.createRadialGradient(0,0,0,0,0,S*.92);grad.addColorStop(0,col+'aa');grad.addColorStop(.20,col+'3e');grad.addColorStop(1,col+'00');circle(0,0,S*.92,grad);
 ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=2.6;ctx.strokeStyle=col;ctx.fillStyle='#0c1313d0';
 // Twelve hand-built portal species. No repeated "feature card" shell.
 switch(p.id){
  case 'sky':
   ctx.beginPath();ctx.moveTo(-rr*.5,-rr*.65);ctx.lineTo(rr*.1,-rr*.1);ctx.lineTo(-rr*.18,rr*.24);ctx.lineTo(rr*.55,rr*.57);ctx.lineTo(rr*.06,-rr*.03);ctx.lineTo(rr*.31,-rr*.47);ctx.stroke();
   for(let i=0;i<6;i++)line(-rr+(i*.32*rr),rr*.66,-rr+(i*.32*rr)-3,rr*.85,col+'99');break;
  case 'music':
   circle(0,0,rr*.71,'#151317',col);circle(0,0,rr*.51,null,col+'a4');circle(0,0,rr*.28,null,col+'aa');circle(0,0,rr*.07,col);ctx.beginPath();ctx.moveTo(rr*.62,-rr*.70);ctx.lineTo(rr*.63,rr*.48);ctx.lineTo(rr*.28,rr*.25);ctx.stroke();break;
  case 'between':
   for(let i=0;i<2;i++){const dx=(i-.5)*rr*.8;ctx.beginPath();ctx.moveTo(dx-rr*.22,rr*.6);ctx.lineTo(dx-rr*.22,-rr*.44);ctx.quadraticCurveTo(dx,-rr*.82,dx+rr*.22,-rr*.44);ctx.lineTo(dx+rr*.22,rr*.6);ctx.stroke()}line(-rr*.05,-rr*.24,rr*.05,rr*.24,'#f4e7c5',2);break;
  case 'arcade':
   circle(0,0,rr*.74,'#19101a',col);for(let i=0;i<7;i++){const a=i*Math.PI/3.5+t*.06;line(0,0,Math.sin(a)*rr*.68,Math.cos(a)*rr*.68,col,1.4)}circle(0,0,rr*.15,col);line(-rr*.5,rr*.72,rr*.5,rr*.72,col,3);break;
  case 'art':
   for(let i=0;i<5;i++){ctx.strokeStyle=[col,'#f8d790','#ec4d83','#d9ee73','#a19cce'][i];ctx.beginPath();ctx.ellipse((i-2)*rr*.09,0,rr*(.15+i*.13),rr*(.7-i*.07),i*.25,0,Math.PI*1.7);ctx.stroke()}break;
  case 'atlas':
   ctx.beginPath();ctx.moveTo(-rr*.69,-rr*.48);ctx.lineTo(-rr*.12,-rr*.64);ctx.lineTo(rr*.3,-rr*.37);ctx.lineTo(rr*.72,-rr*.56);ctx.lineTo(rr*.72,rr*.44);ctx.lineTo(rr*.28,rr*.63);ctx.lineTo(-rr*.12,rr*.36);ctx.lineTo(-rr*.69,rr*.57);ctx.closePath();ctx.stroke();line(-rr*.12,-rr*.64,-rr*.12,rr*.36,col);line(rr*.3,-rr*.37,rr*.28,rr*.63,col);break;
  case 'mind':
   ctx.beginPath();ctx.moveTo(-rr*.84,0);ctx.quadraticCurveTo(0,-rr*1.0,rr*.84,0);ctx.quadraticCurveTo(0,rr*1.0,-rr*.84,0);ctx.stroke();circle(0,0,rr*.3,'#1a1c24',col);circle(rr*.06,-rr*.08,rr*.09,col);break;
  case 'character':
   circle(0,-rr*.54,rr*.26,'#272025',col);ctx.beginPath();ctx.moveTo(0,-rr*.28);ctx.lineTo(-rr*.49,rr*.47);ctx.lineTo(rr*.49,rr*.47);ctx.closePath();ctx.stroke();line(-rr*.35,rr*.53,rr*.35,rr*.53,col,3);break;
  case 'gravity':
   ctx.rotate(-.22);ctx.strokeRect(-rr*.58,-rr*.18,rr*1.16,rr*.77);ctx.beginPath();ctx.moveTo(-rr*.76,-rr*.19);ctx.lineTo(0,-rr*.8);ctx.lineTo(rr*.76,-rr*.19);ctx.stroke();line(0,-rr*.15,0,rr*.6,col);break;
  case 'artists':
   for(let i=0;i<6;i++){const v=i*.34*rr-rr*.85;line(v,-rr*.75+(i%2)*rr*.12,v+rr*.42,rr*.75,['#d2e957','#ed4b81','#e0cc96','#6dd2bc','#c7a9eb'][i%5],2+(i%2)*3)}circle(rr*.18,-rr*.11,rr*.17,null,col);break;
  case 'orchard':
   line(0,rr*.73,0,-rr*.55,col,5);ctx.beginPath();ctx.moveTo(0,-rr*.48);ctx.bezierCurveTo(-rr*.55,-rr*.82,-rr*.95,-rr*.15,-rr*.17,-rr*.19);ctx.bezierCurveTo(rr*.65,-rr*.96,rr*.99,-rr*.24,rr*.1,-rr*.23);ctx.stroke();for(let i=0;i<5;i++)circle((hash(i,3)-.5)*rr*1.2,(hash(i,4)-.5)*rr*.55-rr*.25,rr*.09,col);break;
  case 'screen':
   ctx.save();ctx.rotate(.12);ctx.strokeRect(-rr*.68,-rr*.56,rr*1.36,rr*.94);ctx.strokeRect(-rr*.48,-rr*.38,rr*.96,rr*.58);ctx.restore();for(let i=0;i<3;i++)line(-rr*.47+i*rr*.44,rr*.6,-rr*.27+i*rr*.44,rr*.72,col,2);break;
 }
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${S*.16}px Georgia`;ctx.fillStyle='#f4ebcb';ctx.fillText(p.glyph,0,S*.68);
 if(found.has(p.id))circle(rr*.72,-rr*.62,3.7,'#d5f26d');ctx.restore();}

function drawOrigin(){
 const [X,Y]=xy(19,15),t=now*.00036;ctx.save();ctx.translate(X,Y);ctx.rotate(Math.sin(t)*.012);
 const radius=S*1.42;
 const g=ctx.createRadialGradient(0,0,S*.2,0,0,radius);g.addColorStop(0,'#cde95d30');g.addColorStop(.7,'#ed4d781c');g.addColorStop(1,'#cfe95700');circle(0,0,radius,g);
 ctx.strokeStyle='#e6b6aa55';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,S*.94,S*.73,-.22,.25,Math.PI*1.88);ctx.stroke();
 for(let k=0;k<14;k++){const a=k*Math.PI/7;const r1=S*(.57+hash(k,1)*.08),r2=S*(.87+hash(k,7)*.19);
  line(Math.cos(a)*r1,Math.sin(a)*r1,Math.cos(a)*r2,Math.sin(a)*r2,k%3===0?'#d4f06a99':'#d9b5a35a',k%2===0?1.5:1)}
 ctx.fillStyle='#e4e79bba';ctx.textAlign='center';ctx.font=`${S*.20}px Georgia`;ctx.fillText('✳',0,-S*.58);ctx.fillText('ϟ',0,S*.65);ctx.restore();}
function drawSky(){
 const palette={static:['#0b1917','#253d34','#4f3136'],hush:['#0e1b26','#27463f','#264547'],storm:['#091422','#263747','#512b42'],heat:['#351923','#58342d','#3c2826']}[weather];
 const sky=ctx.createLinearGradient(0,0,W,H);sky.addColorStop(0,palette[0]);sky.addColorStop(.57,palette[1]);sky.addColorStop(1,palette[2]);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 const wave=now*.00025;ctx.save();
 // Giant weather disc: the country is seen through an imperfect instrument.
 const moonX=W*.82+Math.sin(wave)*W*.014,moonY=H*.29;
 const halo=ctx.createRadialGradient(moonX,moonY,10,moonX,moonY,Math.min(W,H)*.58);halo.addColorStop(0,'#e3d2a838');halo.addColorStop(.27,'#a8bba51d');halo.addColorStop(1,'#d9ad9a00');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
 circle(moonX,moonY,Math.min(W,H)*.205,'#a6a58d10','#c6b79a3c');
 for(let i=0;i<3;i++){const rr=Math.min(W,H)*(.22+i*.055);ctx.beginPath();ctx.ellipse(moonX,moonY,rr,rr*.84,.24+i*.13,0,Math.PI*2);ctx.strokeStyle=['#e3c69a33','#8aca9f29','#e28ca42e'][i];ctx.lineWidth=1.5;ctx.stroke()}
 ctx.strokeStyle='#d9d7a44a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(moonX-Math.min(W,H)*.09,moonY-Math.min(W,H)*.14);ctx.bezierCurveTo(moonX+40,moonY-22,moonX-34,moonY+30,moonX+Math.min(W,H)*.07,moonY+Math.min(W,H)*.13);ctx.stroke();
 // Long printmaker's topographic hatchings, changing with the sky.
 for(let i=0;i<11;i++){
  const yy=H*(.17+i*.10),v=i%3;ctx.beginPath();ctx.moveTo(-30,yy);ctx.bezierCurveTo(W*.31,yy-H*(.05+v*.035),W*.56,yy+H*(.075-v*.01),W+30,yy-H*.04);ctx.strokeStyle=['#a7be8751','#daaa9870','#6dc2b146'][v];ctx.lineWidth=i%3===0?2.3:1.1;ctx.stroke();
 }
 // Firefly dust and the occasional edge of a giant root.
 for(let i=0;i<28;i++){const x=hash(i,22)*W,y=hash(i,12)*H;if(hash(i,3)>.62)circle(x,y,1+hash(i,9)*2,'#ddf47d62')}
 ctx.restore();
 if(weather==='storm')for(let i=0;i<54;i++){const p=particles[i],x=(p.x*W+now*.18*p.v)%W,y=(p.y*H+now*.34*p.v)%H;line(x,y,x-9,y+29,'#e3e4d35c',1)}
 if(weather==='heat'){ctx.fillStyle='#ef5b6c14';ctx.fillRect(0,H*.72,W,H*.28)}
}

function drawPathEdge(){
 const minX=Math.max(0,Math.floor(camera.x-W/(2*S))-2),maxX=Math.min(COLUMNS,Math.ceil(camera.x+W/(2*S))+2);
 const minY=Math.max(0,Math.floor(camera.y-H/(2*S))-2),maxY=Math.min(ROWS,Math.ceil(camera.y+H/(2*S))+2);
 // Paint the connected corridors in long strokes so the maze has no visible square cells.
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 for(let y=minY;y<maxY;y++)for(let x=minX;x<maxX;x++){
   if(!open(x,y))continue;const [X,Y]=xy(x,y);
   for(const [dx,dy] of [[1,0],[0,1]])if(open(x+dx,y+dy)){
     const [X2,Y2]=xy(x+dx,y+dy);line(X,Y,X2,Y2,'#060e0cc9',S*.89);
     line(X,Y,X2,Y2,'#6876576d',S*.74);
     line(X,Y,X2,Y2,'#c3bb8860',S*.33);
   }
   circle(X,Y,S*.46,'#6f795763','#0a0f0b58');circle(X,Y,S*.32,'#a79c7041');
 }
 ctx.restore();
 // The shrubs appear on top of the route; they change the silhouette of the world.
 for(let y=minY;y<maxY;y++)for(let x=minX;x<maxX;x++){
  const [X,Y]=xy(x,y);
  if(open(x,y))drawGround(x,y,X,Y);else drawWall(x,y,X,Y);
 }
 drawOrigin();
 // A labyrinth should retain mystery, not use square fog-of-war.
 for(const p of portals){if(p.x>=minX&&p.x<maxX&&p.y>=minY&&p.y<maxY){const [X,Y]=xy(p.x,p.y);drawPortal(p,X,Y)}}
 const centre=xy(player.x,player.y),r=Math.max(W,H)*.75;
 const veil=ctx.createRadialGradient(centre[0],centre[1],S*.3,centre[0],centre[1],r);
 veil.addColorStop(0,'#060b0900');veil.addColorStop(.35,'#060b0910');veil.addColorStop(.75,'#060b0965');veil.addColorStop(1,'#060b09d0');ctx.fillStyle=veil;ctx.fillRect(0,0,W,H);
 // Apparitions briefly suggest what was here, then leave.
 for(let i=0;i<8;i++){const xx=Math.floor(camera.x)+(i*5%11)-5,yy=Math.floor(camera.y)+(i*3%7)-3;if(!valid(xx,yy)||open(xx,yy))continue;
 if(hash(xx,yy,30)>.79){const [X,Y]=xy(xx,yy);ctx.fillStyle='#e6e2a45c';ctx.font=`${S*.25}px Georgia`;ctx.fillText('♣',X,Y)}}
}

function drawParticles(dt){const kind=weather==='hush'?'#91cac0':weather==='heat'?'#e8a179':weather==='storm'?'#e6d6cb':'#d2e86b';for(let i=0;i<particles.length;i++){const p=particles[i];const px=(p.x*W+Math.sin(now*.0006*p.v+p.s)*45+W)%W;const py=(p.y*H+now*(weather==='storm'?.07:.008)*p.v)%H;ctx.globalAlpha=(weather==='hush'?.35:.6)*(0.55+Math.sin(now*.0013*p.v+p.s)*.4);circle(px,py,p.r,kind)}ctx.globalAlpha=1;
 for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.life-=dt;circle(r.x,r.y,(1-r.life/r.max)*90,null,`${r.color}${Math.max(0,Math.round(130*r.life/r.max)).toString(16).padStart(2,'0')}`);if(r.life<=0)rings.splice(i,1)} }
function drawPlayer(){const [X,Y]=xy(player.x,player.y),t=now*.002;ctx.save();ctx.translate(X,Y);
 const grad=ctx.createRadialGradient(0,0,0,0,0,S*.46);grad.addColorStop(0,'#e8f58e66');grad.addColorStop(.5,'#e8f58e22');grad.addColorStop(1,'#e8f58e00');circle(0,0,S*.45,grad);
 // Bug-sized companion silhouette; a field creature, not a photo or simulated animal.
 const dx=-S*.25,dy=S*.18;ctx.fillStyle='#171b12';ctx.beginPath();ctx.ellipse(dx,dy,S*.095,S*.07,-.15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(dx-S*.035,dy-S*.05);ctx.lineTo(dx-S*.08,dy-S*.16);ctx.lineTo(dx+S*.01,dy-S*.06);ctx.fill();circle(dx+S*.08,dy-S*.01,S*.015,'#e8cba2');
 circle(0,-S*.08+Math.sin(t)*S*.03,S*.105,'#f6f1c0');circle(0,-S*.08+Math.sin(t)*S*.03,S*.064,'#cde94d');ctx.rotate(.2*Math.sin(t));line(-S*.11,S*.05,S*.12,-S*.24,'#f5e9bd',2);ctx.restore();}
function drawFrame(){
 ctx.save();ctx.lineWidth=1.3;ctx.strokeStyle='#d7c7a94b';ctx.beginPath();ctx.moveTo(15,12);ctx.lineTo(15,H-25);ctx.moveTo(W-17,20);ctx.lineTo(W-17,H-19);ctx.stroke();
 // Pencil-scratched notches and seismograph waves at the edges.
 for(let i=0;i<15;i++){const yy=40+i*(H-95)/14;line(9,yy,12+(hash(i,3)*9),yy+hash(i,4)*3,'#e8d8aa4a')}
 ctx.textAlign='center';ctx.font='13px Georgia';ctx.fillStyle='#dfe6ad88';for(let j=0;j<7;j++){const x=42+j*83;if(x<W-90)ctx.fillText(['✳','ϟ','♣','∞','≈','✳','∴'][j],x,H-12)}
 ctx.restore();}

function paint(ts){let dt=Math.max(0,Math.min(.05,(ts-last)/1000||.016));last=ts;now=ts;try{
 if(walk.length){let remaining=dt*3.35;while(remaining>.001&&walk.length){const dest=walk[0],dx=dest.x-player.x,dy=dest.y-player.y,d=Math.hypot(dx,dy);if(d<remaining+.01){player.x=dest.x;player.y=dest.y;walk.shift();remaining-=d;onStep(dest.x,dest.y)}else{player.x+=dx/d*remaining;player.y+=dy/d*remaining;remaining=0}}}
 const smooth=reduced.matches?1:Math.min(1,dt*6);camera.x+=(player.x-camera.x)*smooth;camera.y+=(player.y-camera.y)*smooth;
 ctx.setTransform(DPR,0,0,DPR,0,0);drawSky();drawPathEdge();drawParticles(dt);drawPlayer();drawInk(dt);drawFrame();
 }catch(e){console.error('MC maze render',e);$('failsafe').hidden=false;return}requestAnimationFrame(paint)}
function onStep(x,y){visitedNear(x,y);scraps++;if(scraps%4===0)save();if(soundOn&&scraps%3===0)chirp(Math.abs((x*11+y*7+weather.length)%10));
 const p=portals.find(p=>p.x===x&&p.y===y);if(p){found.add(p.id);save();showEncounter(p)}else if(encounter&&Math.hypot(encounter.x-x,encounter.y-y)>2.5)closeEncounter();}
function asPoint(ev){const r=canvas.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top,pressure:Math.max(.15,Math.min(1,Number(ev.pressure)||.48))}}
function pointerStart(ev){if(!$('trace').hidden||!$('map-sheet').hidden)return;touch=true;stroke={id:ev.pointerId,points:[asPoint(ev)],started:performance.now()};try{canvas.setPointerCapture(ev.pointerId)}catch{}}
function pointerMove(ev){if(!stroke||stroke.id!==ev.pointerId)return;const point=asPoint(ev),previous=stroke.points.at(-1);if(Math.hypot(point.x-previous.x,point.y-previous.y)>3&&stroke.points.length<450)stroke.points.push(point)}
function pointerEnd(ev){if(!stroke||stroke.id!==ev.pointerId)return;const event=stroke;stroke=null;const point=asPoint(ev);event.points.push(point);let length=0;for(let i=1;i<event.points.length;i++)length+=Math.hypot(event.points[i].x-event.points[i-1].x,event.points[i].y-event.points[i-1].y);
 if(length>65&&event.points.length>=5){shapeReaction(event.points,length);return}tapGround(point)}
function pointerCancel(){stroke=null}
function shapeReaction(points,length){let turn=0,lastAngle=null,lastSign=0;
 for(let i=1;i<points.length;i++){const dx=points[i].x-points[i-1].x,dy=points[i].y-points[i-1].y;if(Math.hypot(dx,dy)<4)continue;const angle=Math.atan2(dy,dx);if(lastAngle!==null){const change=Math.atan2(Math.sin(angle-lastAngle),Math.cos(angle-lastAngle));const sign=Math.sign(change);if(Math.abs(change)>.55&&(sign!==lastSign||Math.abs(change)>1.1)){turn++;lastSign=sign}}lastAngle=angle}
 const a=points[0],b=points.at(-1),closure=Math.hypot(a.x-b.x,a.y-b.y),form=(closure<Math.max(35,length*.21)&&length>110)?'loop':turn>=3?'lightning':'current';
 ink.push({points:points.slice(),life:6,max:6,form});lastGesture={form,length:Math.round(length),at:new Date().toISOString()};
 if(ink.length>18)ink.shift();if(form==='loop'){setWeather('hush');if(soundOn)chirp(8)}else if(form==='lightning'){setWeather('storm');if(soundOn)chirp(6)}else{setWeather('heat');if(soundOn)chirp(3)}
 toast({loop:'◯',lightning:'ϟ',current:'≈'}[form]);
}
function tapGround(point){if(!$('trace').hidden||!$('map-sheet').hidden)return;const px=point.x,py=point.y;const target=nearestOpen(camera.x+(px-W/2)/S,camera.y+(py-H/2)/S);if(!target){toast('THAT ONE IS MADE OF THORNS.');return}
 const p=portals.find(p=>p.x===target.x&&p.y===target.y);if(encounter&&p&&p.id===encounter.id){showEncounter(p);return}
 walk=routeTo(target.x,target.y);try{navigator.vibrate?.(9)}catch{}rings.push({x:px,y:py,max:.55,life:.55,color:'#d8f36b'});
 if(!walk.length){if(p)showEncounter(p);else if(soundOn)chirp(1)}if(walk.length&&soundOn)chirp(3)}
function drawInk(dt){
 if(stroke&&stroke.points.length>1)paintStroke(stroke.points,1,'#dfec6b');
 for(let i=ink.length-1;i>=0;i--){const mark=ink[i];mark.life-=dt;paintStroke(mark.points,Math.min(1,mark.life/mark.max),'#ef729d');if(mark.life<=0)ink.splice(i,1)}
}
function paintStroke(points,opacity,color){if(opacity<=0||points.length<2)return;ctx.save();ctx.globalAlpha=opacity;ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=17;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))ctx.lineTo(p.x,p.y);ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;ctx.lineWidth=.9;ctx.strokeStyle='#fffcbb';ctx.stroke();ctx.restore()}
function keyboard(ev){if(!$('trace').hidden||!$('map-sheet').hidden){if(ev.key==='Escape'){closeMap();closeTrace()}return}
 if(ev.key==='Escape'){closeEncounter();return}
 const step={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[ev.key];if(step){ev.preventDefault();const nx=Math.round(player.x)+step[0],ny=Math.round(player.y)+step[1];if(open(nx,ny))walk=routeTo(nx,ny);else{toast('THE WALL WON.');if(soundOn)chirp(0)}}if(ev.key==='Enter'&&encounter){window.location.assign(encounter.route)}}
function showEncounter(p){encounter=p;$('encounter').hidden=false;$('encounter-number').textContent=`${String(PORTALS.indexOf(PORTALS.find(t=>t.id===p.id))+1).padStart(2,'0')} / 12`;$('encounter-glyph').textContent=p.glyph;$('encounter-glyph').style.color=p.color;$('encounter-title').textContent=p.name;$('encounter-line').textContent=p.line;$('encounter-enter').href=p.route;$('encounter-enter').setAttribute('aria-label','Enter '+p.name);$('encounter-mark').textContent=found.has(p.id)?'♥':'♡';if(soundOn)chirp(p.sound);speak(p.line)}
function closeEncounter(){encounter=null;$('encounter').hidden=true}
function toggleMap(){const sheet=$('map-sheet'),show=sheet.hidden;sheet.hidden=!show;$('map-toggle').setAttribute('aria-expanded',String(show));if(show){closeEncounter();drawMap();$('map-close').focus()}}
function closeMap(){$('map-sheet').hidden=true;$('map-toggle').setAttribute('aria-expanded','false')}
function drawMap(){const c=$('mini-map'),g=c.getContext('2d');if(!g)return;const tw=c.width/COLUMNS,th=c.height/ROWS;g.fillStyle='#19211b';g.fillRect(0,0,c.width,c.height);
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLUMNS;x++){if(!seen.has(index(x,y)))continue;g.fillStyle=open(x,y)?'#c0b592':'#3d4639';g.fillRect(x*tw,y*th,tw+.5,th+.5)}
 for(const p of portals){if(!seen.has(index(p.x,p.y)))continue;g.fillStyle=p.color;g.fillRect((p.x+.1)*tw,(p.y+.1)*th,tw*.8,th*.8)}circleMap(g,player.x*tw+tw/2,player.y*th+th/2,4,'#f44f76');$('map-progress').textContent=String(Math.floor(seen.size*100/(COLUMNS*ROWS)))+'%'}
function circleMap(g,x,y,r,c){g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function initAudio(){const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)return false;try{if(!audio){audio=new Constructor();const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=440;droneGain=audio.createGain();droneGain.gain.value=.0001;drone=audio.createOscillator();drone.type='sine';drone.frequency.value=55;drone.connect(filter).connect(droneGain).connect(audio.destination);drone.start()}
 if(audio.state!=='running')audio.resume().catch(()=>{});return true}catch(e){console.warn('Web Audio unavailable',e);return false}}
function chirp(why){if(!soundOn||!audio||audio.state!=='running')return;const freq=[82,164.81,196,220,261.63,293.66,329.63,392,440,523.25][why%10],t=audio.currentTime;
 const o=audio.createOscillator(),g=audio.createGain(),f=audio.createBiquadFilter();o.type=why%3===0?'triangle':'sine';o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*(1+.025*(why%3)),t+.17);f.type='lowpass';f.frequency.value=750;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.027,t+.027);g.gain.exponentialRampToValueAtTime(.0001,t+.44);o.connect(f).connect(g).connect(audio.destination);o.start(t);o.stop(t+.47);o.onended=()=>{o.disconnect();g.disconnect();f.disconnect()}}
function toggleSound(){if(soundOn){soundOn=false;droneGain?.gain.setTargetAtTime(.0001,audio.currentTime,.03);audio?.suspend?.().catch(()=>{});$('sound').setAttribute('aria-pressed','false');$('sound').setAttribute('aria-label','Turn original sound on');return}
 if(!initAudio()){toast('THIS BROWSER HAS NO SOUND ENGINE.');return}soundOn=true;droneGain.gain.setTargetAtTime(.015,audio.currentTime,.1);$('sound').setAttribute('aria-pressed','true');$('sound').setAttribute('aria-label','Turn original sound off');setTimeout(()=>chirp(6),90)}
function speak(text){if(!voiceOn||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(text);s.rate=.88;s.pitch=.84;s.volume=.8;speechSynthesis.speak(s)}catch{voiceOn=false;$('voice').setAttribute('aria-pressed','false')}}
function toggleVoice(){if(!('speechSynthesis' in window)){toast('THE VOICE DIDN’T MAKE IT THROUGH.');return}voiceOn=!voiceOn;$('voice').setAttribute('aria-pressed',String(voiceOn));$('voice').setAttribute('aria-label',voiceOn?'Turn spoken encounters off':'Turn spoken encounters on');if(voiceOn)speak('The country has teeth.');else speechSynthesis.cancel()}
function shift(){if($('maze-shift').dataset.armed!=='yes'){$('maze-shift').dataset.armed='yes';toast('TURN IT AGAIN TO MOVE THE ROADS.');return}seed=(seed+0x1f123bb5)>>>0;seen.clear();found.clear();$('maze-shift').dataset.armed='';generate();save();drawMap();toast('THE COUNTRY MOVED WHILE YOU WATCHED.')}
let thread=get(TRACE,[]);if(!Array.isArray(thread))thread=[];thread=thread.filter(e=>e&&typeof e.text==='string'&&['exact','interpret','idea'].includes(e.kind));
const sourceRow=$('trace-source-row'),source=$('trace-source'),status=$('trace-status'),form=$('trace-form');
function currentKind(){return document.querySelector('input[name="kind"]:checked')?.value||'exact'}
function syncKind(){const kind=currentKind();sourceRow.hidden=kind==='exact';source.required=kind==='interpret'}
function sourceOptions(){const last=source.value;source.textContent='';const def=document.createElement('option');def.value='';def.textContent='Select an exact statement';source.append(def);for(const entry of [...thread].reverse().filter(t=>t.kind==='exact')){const o=document.createElement('option');o.value=entry.id;o.textContent=entry.text.slice(0,92);source.append(o)}if([...source.options].some(o=>o.value===last))source.value=last}
function renderThread(){const ul=$('trace-entries');ul.textContent='';for(const entry of [...thread].reverse()){const li=document.createElement('li'),small=document.createElement('small');small.textContent=entry.kind.toUpperCase()+'  /  '+(new Date(entry.time)).toLocaleString();li.append(small,document.createTextNode(entry.text));if(entry.source){const e=thread.find(t=>t.id===entry.source&&t.kind==='exact');if(e){const q=document.createElement('blockquote');q.textContent='↳ '+e.text.slice(0,280);li.append(q)}}ul.append(li)}}
function openTrace(){$('trace').hidden=false;document.body.classList.add('trace-open');sourceOptions();renderThread();$('trace-text').focus()}
function closeTrace(){$('trace').hidden=true;document.body.classList.remove('trace-open');$('trace-open').focus()}
function submitTrace(event){event.preventDefault();const text=$('trace-text').value.trim(),kind=currentKind(),sourceId=source.value;if(!text)return;if(kind==='interpret'&&!thread.some(t=>t.kind==='exact'&&t.id===sourceId)){status.textContent='AN INTERPRETATION NEEDS AN ACTUAL SOURCE.';return}const id=typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random();thread.push({id,kind,source:kind==='exact'?null:sourceId||null,text,time:new Date().toISOString(),author:'visitor'});if(thread.length>1500)thread=thread.slice(-1500);if(!put(TRACE,thread))status.textContent='LOCAL STORAGE UNAVAILABLE. EXPORT BEFORE LEAVING.';else status.textContent='✳';$('trace-text').value='';sourceOptions();renderThread();}
function exportThread(){const file={format:'mc-day-thread-v1',explanation:'User-authored records. Interpretations never replace exact copy.',exported:new Date().toISOString(),records:thread};const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='charity-day-thread.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function clearThread(){const el=$('trace-clear');if(el.dataset.armed!=='yes'){el.dataset.armed='yes';status.textContent='TAP AGAIN TO ERASE THE LOCAL THREAD.';return}el.dataset.armed='';thread=[];put(TRACE,thread);status.textContent='ERASED FROM THIS BROWSER.';renderThread();sourceOptions()}
function validateModel(){const d=bfsDistances(Math.round(player.x),Math.round(player.y));return{allPortalsReachable:portals.every(p=>d[index(p.x,p.y)]>=0),portals:portals.length,distinctPortalCells:new Set(portals.map(p=>index(p.x,p.y))).size===portals.length,passableCells:grid.filter(v=>v===0).length,orphanedPassableCells:grid.filter((v,i)=>v===0&&d[i]===-1).length}}
const api=Object.freeze({
 state:()=>({seed,weather,position:{...player},pathLength:walk.length,visited:seen.size,discovered:[...found],sound:soundOn,audioState:audio?.state??'not-started',voice:voiceOn,threadCount:thread.length,lastGesture}),
 selfTest:()=>({engine:'loaded',canvas:Boolean(ctx),routeLinks:document.querySelectorAll('#door-index a').length,model:validateModel(),webaudio:Boolean(window.AudioContext||window.webkitAudioContext),speech:Boolean(window.speechSynthesis),vibration:typeof navigator.vibrate==='function',storageWritable:(()=>{try{const key='mc.probe';localStorage.setItem(key,'1');localStorage.removeItem(key);return true}catch{return false}})(),prefersReducedMotion:reduced.matches}),
 setWeather, navigateTo:(id)=>{const p=portals.find(v=>v.id===id);if(p){walk=routeTo(p.x,p.y);return walk.length>0 || (Math.round(player.x)===p.x&&Math.round(player.y)===p.y)}return false},
 showPortal:(id)=>{const p=portals.find(v=>v.id===id);if(p){showEncounter(p);return true}return false},
 routeTo:(x,y)=>routeTo(x,y),
 });
 Object.defineProperty(window,'MC_LABYRINTH',{value:api,configurable:false});
 setWeather(weather);generate();resize();renderThread();syncKind();
 canvas.addEventListener('pointerdown',pointerStart);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerEnd);canvas.addEventListener('pointercancel',pointerCancel);document.addEventListener('keydown',keyboard);
 $('weather').addEventListener('click',()=>{const w=['hush','static','storm','heat'];setWeather(w[(w.indexOf(weather)+1)%w.length]);toast({hush:'THE AIR HOLDS ITS BREATH.',static:'SOMEBODY TURNED ON THE STATIC.',storm:'THE SKY IS HAVING A FIT.',heat:'SWEET JESUS, EVEN THE SKY IS HOT.'}[weather])});
 $('sound').addEventListener('click',toggleSound);$('voice').addEventListener('click',toggleVoice);
 $('map-toggle').addEventListener('click',toggleMap);$('map-close').addEventListener('click',closeMap);$('maze-shift').addEventListener('click',shift);
 $('encounter-close').addEventListener('click',closeEncounter);$('encounter-mark').addEventListener('click',()=>{if(encounter){found.add(encounter.id);save();$('encounter-mark').textContent='♥';toast('KEPT.')}});
 $('trace-open').addEventListener('click',openTrace);$('trace-close').addEventListener('click',closeTrace);form.addEventListener('submit',submitTrace);$('trace-export').addEventListener('click',exportThread);$('trace-clear').addEventListener('click',clearThread);document.querySelectorAll('input[name="kind"]').forEach(el=>el.addEventListener('change',syncKind));
 addEventListener('resize',resize);addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden){save();window.speechSynthesis?.cancel?.();if(audio?.state==='running')audio.suspend().catch(()=>{})}else if(soundOn){$('sound').setAttribute('title','Tap to wake sound after returning')}});
 if(new URLSearchParams(location.search).has('proof')){console.info('MC LABYRINTH PROOF',api.selfTest())}
 requestAnimationFrame(paint);
})();