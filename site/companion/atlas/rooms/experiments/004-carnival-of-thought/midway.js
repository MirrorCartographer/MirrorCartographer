import {initialGame,advance,statusOf,STATIONS} from './midway-core.mjs';
import {initialBooths,changeBooth,evaluateBooths} from './booth-model.mjs';
import {startForest,plantLight,routeTo,visitLight,portalAt,enterTheatre,clearForest} from './hushwood-core.mjs';
import {drawForest,drawTheatre} from './hushwood-scene.mjs';
const $=id=>document.getElementById(id);
const canvas=$('midway-world'),ctx=canvas.getContext('2d',{alpha:false});
const narrator=$('narrator'),title=$('station-title'),hint=$('station-hint');
const TAU=Math.PI*2,PI=Math.PI,clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),lerp=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=0,H=0,D=1,time=0,last=0,mode='world',game=initialGame(),coin=initialBooths(),noMotion=reduced,audio=null,drone=null,droneGain=null,soundOn=false;
let wheelAngle=0,wheelVel=0,pointer={x:0,y:0,down:false},hold=false,arrival=null,selected=1;
let avatar={x:.51,y:.86,tx:.51,ty:.86},particles=[],forest=startForest(),moth=null,theatrePulses=[],theatrePointer={x:0,y:0},lastStrikeAt=-1000,messageTimeout=0;
const words={
 mirror:['THE MIRROR THAT DISAGREES','Drag your reflection into the pale silhouette.'],
 wheel:['THE WHEEL OF EXPERTS','Touch the wheel. Gravity is the only panelist with credentials.'],
 gallery:['THE GALLERY OF ALMOST-FACTS','Hit the acid-green evidence, not the convincing red nonsense.'],
 radio:['RADIO ELSEWHERE','Drag the needle. Something peculiar lives near 94.6.'],
 weather:['THE WEATHER BUREAU','Press and hold the copper lung. The sky has no supervisor.'],
 gate:['THE UNINSPECTED EXIT','Four punch marks. Absolutely no valid permit.'],
 theatre:['THE SHADOW THEATRE','Touch or drag the stage. The shadow answers movement, not meaning.']
};
function announce(s){narrator.textContent=s;}
function note(s){announce(s);messageTimeout=time+5;}
function apply(action,v){
 const previous=game.stamps.length;
 game=advance(game,action,v);
 refresh();
 if(game.stamps.length>previous){
  const messages={mirror:'THE MIRROR RELENTS. It will deny this in court.',wheel:'THE WHEEL HAS ISSUED A CERTIFICATE. Nobody checked its qualifications.',gallery:'YOU HIT THE EVIDENCE. The decoys are pursuing a defamation claim.',radio:'YOU FOUND THE STATION. It was broadcasting from a place that does not exist.',weather:'YOU STOLE THE THUNDER. The weather service demands its clipboard.'};
  note(messages[action]||'ONE MORE HOLE IN YOUR TICKET.');
  chime(392,523.25,659.25);
 }else if(action==='reset')announce('New ticket. Same disreputable establishment.');
}
function refresh(){
 const status=statusOf(game);
 const icons=STATIONS.map(n=>game.stamps.includes(n)?'✳':'◇').join(' ');
 $('stamps').textContent=icons;
 $('count').textContent=game.afterHours?'GATE OPEN · YOU ARE SOMEWHERE ELSE':status.need?status.stamps+' / 4 TO OPEN THE GATE':'THE GATE IS READY';
 $('forest-commands').hidden=!game.afterHours;
 $('map-forest-note').hidden=!game.afterHours;
 if(mode==='world')title.textContent='';
}
function enter(name){
 if(!words[name]||(name==='theatre'&&!forest.open))return;
 mode=name;
 arrival=null;
 title.textContent=words[name][0];
 hint.textContent=words[name][1];
 $('return').hidden=false;
 if(name==='mirror')announce('The reflection is missing its shadow. An embarrassing oversight.');
 if(name==='wheel')announce('Spin it. Then ask which part of the spectacle was evidence.');
 if(name==='gallery')announce('Three green hits out of six shots. The red things have excellent marketing.');
 if(name==='radio'){announce('An original tone moves when you tune, if you explicitly turn on sound.');sustainRadio();}
 if(name==='weather')announce('Press the copper lung. Nothing is supposed to happen. Obviously.');
 if(name==='gate')announce(statusOf(game).need?'The gate requires '+statusOf(game).need+' more marks. The fence is not impressed.':'The lock has run out of objections. Touch the gate.');
 if(name==='theatre')announce('This stage casts a shadow from your movement. It cannot infer what you feel, even if the curtains act impressed.');
}
function back(){mode='world';arrival=null;title.textContent='';hint.textContent='';$('return').hidden=true;sustainRadio();announce(game.afterHours?'Plant lanterns. Touch a lantern to guide the moth across connected lights.':'Tap the dirt to walk. Tap a strange thing to make it stranger.');canvas.focus({preventScroll:true});}
function positions(){
 const top=clamp(H*.225,110,210),bottom=H-(W<700?150:136),span=Math.max(175,bottom-top);
 const a=top+span*.26,b=top+span*.74;
 return [
  {name:'mirror',x:W*.18,y:a,r:W<700?40:75},
  {name:'wheel',x:W*.5,y:a-9,r:W<700?43:80},
  {name:'gallery',x:W*.82,y:a,r:W<700?40:75},
  {name:'radio',x:W*.18,y:b,r:W<700?41:75},
  {name:'gate',x:W*.5,y:b+6,r:W<700?42:77},
  {name:'weather',x:W*.82,y:b,r:W<700?40:75}
 ];
}
function resize(){
 W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,2);
 canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);
 ctx.setTransform(D,0,0,D,0,0);
 if(!theatrePointer.x&&!theatrePointer.y)theatrePointer={x:W*.5,y:H*.55};
 particles=Array.from({length:Math.min(100,Math.ceil(W*H/9000))},(_,i)=>({x:(i*73.3%101)/101*W,y:(i*41.1%103)/103*H,r:(i%3)+.4}));
}
resize();addEventListener('resize',resize,{passive:true});
function stroke(color='#f0d2a1',width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function fill(color){ctx.fillStyle=color;ctx.fill()}
function path(points,closed=true){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(const p of points.slice(1))ctx.lineTo(p[0],p[1]);if(closed)ctx.closePath();}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function circ(x,y,r,c,edge=null,lw=1){ctx.beginPath();ctx.arc(x,y,Math.max(.2,r),0,TAU);if(c)fill(c);if(edge)stroke(edge,lw)}
function ellipse(x,y,rx,ry,c,edge=null){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);if(c)fill(c);if(edge)stroke(edge,1)}
function line(x,y,x2,y2,c,w=1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);stroke(c,w)}
function text(s,x,y,size=16,color='#f0d9b3',font='Georgia',align='center'){
 ctx.fillStyle=color;ctx.font='bold '+size+'px '+font;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);
}
function seeded(n){const x=Math.sin(n*78.233+3.1)*43758.5453;return x-Math.floor(x)}
function sky(){
 const g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,game.afterHours?'#04130d':'#130918');
 g.addColorStop(.53,game.afterHours?'#24322b':'#40172d');
 g.addColorStop(.82,game.afterHours?'#121b13':'#271521');
 g.addColorStop(1,'#0b0910');rect(0,0,W,H,g);
 const moonx=W*.78,moony=H*.2;
 circ(moonx,moony,Math.min(W,H)*.052,game.afterHours?'#deecac':'#ead5ae');
 for(let i=0;i<70;i++){
  const x=seeded(i+5)*W,y=seeded(i+25)*H*.58;
  circ(x,y,Math.max(.5,seeded(i+43)*1.4),game.afterHours?'#cbfc94b0':'#ffefbd82');
 }
 // Ripped-paper mountains and fir silhouettes.
 const mountain=[];
 for(let x=-15;x<=W+20;x+=W/16)mountain.push([x,H*(.44+seeded(Math.floor(x/W*16)+90)*.2)]);
 mountain.push([W+25,H]);mountain.push([-25,H]);path(mountain);fill(game.afterHours?'#102a1d':'#2a1925');
 for(let i=0;i<18;i++){
  const x=(i+.6)*W/18,y=H*(.62+seeded(i+21)*.08),s=15+seeded(i+77)*Math.min(95,H*.13);
  path([[x,y-s],[x-s*.47,y],[x+s*.47,y]]);fill(game.afterHours?'#091910':'#160e18');
  path([[x,y-s*.62],[x-s*.6,y+s*.15],[x+s*.6,y+s*.15]]);fill(game.afterHours?'#091910':'#160e18');
 }
 const ground=ctx.createLinearGradient(0,H*.52,0,H);
 ground.addColorStop(0,'#322428');ground.addColorStop(1,'#0d0b13');
 rect(0,H*.65,W,H*.35,ground);
 for(let i=0;i<14;i++){let y=H*.63+i*i*.004*H;line(0,y,W,y,'#c49b5322',1);}
 // Warped bulbs on a sagging wire.
 for(let i=0;i<18;i++){
  const x=(i/17)*W,y=H*.26+Math.sin(i/17*PI)*H*.035;
  if(i<17){const nx=(i+1)/17*W,ny=H*.26+Math.sin((i+1)/17*PI)*H*.035;line(x,y,nx,ny,'#71524b',1);}
  circ(x,y+5,3+(i%3),i%4===0?'#c1ef61':i%3===0?'#f0b76b':'#c65f74');
 }
 if(game.weather!=='dry'){
  const n=game.weather==='storm'?58:game.weather==='rain'?29:15;
  for(let i=0;i<n;i++){
   const p=particles[i%particles.length],x=(p.x+(noMotion?0:time*80*(game.weather==='wind'?1.7:1)))%W,y=(p.y+(noMotion?0:time*150))%H;
   line(x,y,x+(game.weather==='wind'?22:8),y+24,'#b5d3c355',1);
  }
 }
 for(let i=0;i<particles.length;i++){
  const p=particles[i],x=p.x+Math.sin(noMotion?0:time*.7+i)*8,y=p.y+Math.cos(noMotion?0:time*.5+i)*9;
  if(y>H*.38)circ(x,y,p.r,game.afterHours?'#dbff8499':'#e9bc6070');
 }
}
function stationArt(p){
 const {name,x,y,r}=p,collected=game.stamps.includes(name),pulse=noMotion?0:Math.sin(time*2+p.x)*.05;
 ellipse(x,y+r*.68,r*.88,r*.16,'#080711cc');
 ctx.save();ctx.translate(x,y);ctx.rotate(pulse*.15);
 if(name==='wheel'){
  circ(0,0,r*.84,'#180f1d','#d3b06b',2);
  for(let i=0;i<12;i++){
   const a=(noMotion?0:time*.17)+i*TAU/12;
   line(0,0,Math.cos(a)*r*.83,Math.sin(a)*r*.83,i%2?'#c39b65':'#ad4c67',2);
   circ(Math.cos(a)*r*.84,Math.sin(a)*r*.84,Math.max(2,r*.07),i%3?'#b9eb64':'#f1c17d');
  }
  circ(0,0,r*.14,'#f7d89e','#4b2137',3);
  line(-r*.1,r*.84,-r*.25,r*1.1,'#b99373',3);line(r*.1,r*.84,r*.25,r*1.1,'#b99373',3);
 }else if(name==='mirror'){
  ctx.beginPath();ctx.ellipse(0,0,r*.62,r*.95,0,0,TAU);fill('#734e55');stroke('#e7be7b',5);
  ctx.beginPath();ctx.ellipse(0,0,r*.5,r*.81,0,0,TAU);fill('#14292d');stroke('#8ab99a',1.5);
  for(let i=0;i<5;i++){line(-r*.35,-r*.5+i*r*.27,r*.22,-r*.69+i*r*.21,'#bfeae54b',1);}
  path([[-r*.2,r*.25],[0,-r*.38],[r*.23,r*.3]]);fill('#d6ff8b80');
 }else if(name==='gallery'){
  path([[-r,-r*.52],[0,-r*1.22],[r,-r*.52]]);fill('#6a2646');stroke('#e1b06f',2);
  rect(-r*.86,-r*.52,r*1.72,r*1.08,'#29151e');
  for(let i=0;i<3;i++){const tx=-r*.46+i*r*.46;circ(tx,0,r*.16,i===1?'#c4f077':'#b44d62');circ(tx,r*.06,r*.035,'#1d161b');}
  line(-r*.92,r*.6,r*.92,r*.6,'#e0ad68',4);
 }else if(name==='radio'){
  path([[-r*.75,-r*.55],[-r*.3,-r*.8],[r*.67,-r*.64],[r*.8,r*.55],[-r*.82,r*.61]]);fill('#4c302d');stroke('#ceaa7a',2);
  circ(-r*.28,r*.06,r*.32,'#191619','#eac68c',2);
  for(let i=0;i<5;i++)line(-r*.5+i*r*.11,-r*.12,-r*.5+i*r*.11,r*.2,'#a7d665',1);
  rect(r*.2,-r*.24,r*.38,r*.26,'#cece7d');line(r*.42,-r*.65,r*.65,-r*1.2,'#e5cc97',2);
 }else if(name==='weather'){
  path([[-r*.8,r*.5],[-r*.58,-r*.48],[0,-r*.87],[r*.68,-r*.55],[r*.8,r*.58]]);fill('#71503d');stroke('#dbb586',2);
  circ(0,-r*.08,r*.39,'#180e19','#a3ef6e',3);
  path([[r*.05,-r*.52],[-r*.18,-r*.1],[r*.08,-r*.1],[-r*.18,r*.46],[r*.3,-r*.26],[-r*.02,-r*.26]]);fill('#d5f76a');
 }else{
  rect(-r*.7,-r*.98,r*1.4,r*1.86,'#27151d');
  ctx.strokeStyle='#ce9d73';ctx.lineWidth=4;ctx.strokeRect(-r*.7,-r*.98,r*1.4,r*1.86);
  line(0,-r*.95,0,r*.87,'#d1ad77',3);
  for(let i=0;i<4;i++)circ((-1+i%2*2)*r*.52,(-.57+Math.floor(i/2)*.98)*r,r*.085,i<game.stamps.length?'#c3ff6f':'#483447','#9b845f',1);
  if(statusOf(game).unlocked)text('OPEN',0,-r*1.14,12,'#cdff74','monospace');
 }
 ctx.restore();
 text(name==='gate'?'THE GATE':name==='wheel'?'EXPERTS':name==='mirror'?'THE MIRROR':name==='gallery'?'THE GALLERY':name==='radio'?'RADIO ELSEWHERE':'WEATHER',x,y+r*1.4,W<700?9:13,collected?'#c7ff78':'#ead5a4','monospace');
 if(collected){circ(x+r*.72,y-r*.85,Math.max(8,r*.21),'#b7ed57','#1d2515',2);text('✓',x+r*.72,y-r*.84,Math.max(10,r*.25),'#15220d','monospace');}
}
function drawPlayer(){
 const x=avatar.x*W,y=avatar.y*H;
 ellipse(x,y+11,19,6,'#05040988');
 circ(x,y-16,9,'#f1c4a0','#160b12',1.5);
 path([[x-12,y-9],[x+12,y-9],[x+9,y+13],[x-9,y+13]]);fill('#c4ef69');stroke('#1c161a',2);
 line(x-7,y+13,x-8,y+26,'#e7d6a8',4);line(x+6,y+13,x+8,y+26,'#e7d6a8',4);
 line(x-14,y-22,x+13,y-22,'#362430',4);line(x-7,y-29,x+5,y-29,'#362430',10);
}
function plantLantern(x,y){
 const next=plantLight(forest,x,y,W/H);
 if(next===forest){note('Too close, outside the path, or the woods are full. Move a little.');return;}
 const first=forest.lanterns.length===0;
 forest=next;
 if(first){moth={x:forest.lanterns[0].x,y:forest.lanterns[0].y,path:[]};}
 note(forest.lanterns.length===1?'THE FIRST LIGHT. The moth is awake.':forest.lanterns.length<4?'MORE LIGHT. Draw a route, not a straight line.':'THE WOODS ARE GETTING CONNECTED. The moth refuses to teleport.');
 chime(220+forest.lanterns.length*23);
}
function announceArrival(id){
 const before=forest.open;
 forest=visitLight(forest,id);
 if(!before&&forest.open){
  note('THREE LIGHTS, ONE CROOKED PATH. A door has appeared. The forest would rather not discuss its architect.');
  chime(294,392,523.25,698);
 }else{
  note('THE MOTH REMEMBERS '+forest.visited.length+' DISTINCT LIGHTS. No opinions were polled.');
  chime(294+id*19);
 }
}
function guideMoth(target){
 if(!moth)return;
 const route=routeTo(forest,target,W/H);
 if(!route){note('NO BRIDGE. Plant a lamp between those islands. This moth has standards.');return;}
 if(route.length<2){note('THE MOTH IS ALREADY HERE. It has nothing useful to add.');return;}
 moth.path=route.slice(1);
 if(noMotion){
  for(const id of moth.path){moth.x=forest.lanterns[id].x;moth.y=forest.lanterns[id].y;announceArrival(id);}
  moth.path=[];
 }else note('WATCH THE MOTH FOLLOW THE LIGHTS. It cannot jump across a missing connection.');
}
function guideNextMoth(){
 if(!moth||forest.lanterns.length<2){note('Plant at least two connected lanterns first.');return;}
 const options=forest.lanterns.map((p,i)=>({i,route:routeTo(forest,i,W/H)})).filter(x=>x.route&&x.route.length>1);
 const next=options.find(x=>!forest.visited.includes(x.i))||options[0];
 if(next)guideMoth(next.i);else note('No reachable second light. Bridge the dark with another lantern.');
}
function stepMoth(dt){
 if(!moth?.path?.length)return;
 const id=moth.path[0],point=forest.lanterns[id];
 if(!point){moth.path=[];return;}
 const delta=Math.hypot((moth.x-point.x)*W/H,moth.y-point.y);
 if(delta<.005){
  moth.x=point.x;moth.y=point.y;
  moth.path.shift();announceArrival(id);
  return;
 }
 const portion=Math.min(1,dt*.26/delta);
 moth.x+=(point.x-moth.x)*portion;
 moth.y+=(point.y-moth.y)*portion;
}
function strikeTheatre(x,y){
 const point={x:clamp(x/W,.04,.96),y:clamp(y/H,.28,.91),at:time};
 theatrePointer={x,y};
 if(performance.now()-lastStrikeAt<110&&theatrePulses.length)return;
 lastStrikeAt=performance.now();
 theatrePulses.push(point);
 if(theatrePulses.length>24)theatrePulses.shift();
 if(theatrePulses.length===2)note('THERE ARE TWO EYES NOW. Correlation remains an unfortunate word.');
 else if(theatrePulses.length===6)note('YOU MADE THE SHADOW MOVE. You did not tell it what to believe.');
 if(theatrePulses.length<=8)chime(190+theatrePulses.length*32);
}
function drawWorld(){
 if(game.afterHours){drawForest(ctx,W,H,forest,moth,time,noMotion);drawPlayer();return;}
 sky();
 for(const p of positions())stationArt(p);
 drawPlayer();
 const dots=positions();
 if(arrival){
  const p=dots.find(x=>x.name===arrival);
  if(p)circ(p.x,p.y,p.r*1.25,null,'#c8ff74',2);
 }
 if(!noMotion){
  for(let i=0;i<10;i++){
   const x=W*.1+i*W*.09,y=H*.88+Math.sin(time+i)*6;
   circ(x,y,1.2,'#eab87955');
  }
 }
}
function darkScene(colors){
 const g=ctx.createRadialGradient(W*.5,H*.53,5,W*.5,H*.57,W*.75);
 g.addColorStop(0,colors[0]);g.addColorStop(1,colors[1]);rect(0,0,W,H,g);
 for(let i=0;i<65;i++){const x=seeded(i+10)*W,y=seeded(i+200)*H;circ(x,y,seeded(i+40)*1.6,'#e5bf7a44');}
 for(let x=0;x<W;x+=W/22)line(x,H*.4+Math.sin(x)*7,W*.5,H*.92,'#dfb8701a');
}
function sceneCenter(){return {x:W*.5,y:H*.56,r:Math.min(W*.31,H*.26,260)};}
function drawMirror(){
 darkScene(['#44243c','#090911']);
 const {x,y,r}=sceneCenter();
 ellipse(x,y,r*.72,r*1.17,'#9f705f','#f0c995');ellipse(x,y,r*.61,r*1.06,'#172f31','#f0c995');
 const goalX=x+(0.72-.5)*r*1.3,headY=y-r*.32;
 // Ghost silhouette stays fixed; user's distorted reflection moves with the drag.
 circ(goalX,headY,r*.17,'#c7ff8190','#d9fba0',1);
 path([[goalX-r*.19,headY+r*.15],[goalX+r*.19,headY+r*.15],[goalX+r*.35,y+r*.62],[goalX-r*.35,y+r*.62]]);fill('#ccf77740');
 const moveX=x+(game.mirrorAngle-.5)*r*1.3;
 ctx.save();ctx.translate(moveX,y);ctx.scale(1+(game.mirrorAngle-.72)*1.15,1);
 circ(0,-r*.32,r*.17,'#eebbad');path([[-r*.2,-r*.15],[r*.2,-r*.15],[r*.35,r*.6],[-r*.35,r*.6]]);fill('#6adbb38c');stroke('#caecca',2);ctx.restore();
 for(let i=0;i<7;i++){const a=i*TAU/7;circ(x+Math.cos(a)*r*.78,y+Math.sin(a)*r*1.2,4,'#e2bf79');}
 const sx=W*.15,ex=W*.85,sy=Math.min(H*.83,y+r*1.25);
 line(sx,sy,ex,sy,'#b89c70',8);
 circ(lerp(sx,ex,game.mirrorAngle),sy,14,'#cbff6b','#312c23',3);
 circ(lerp(sx,ex,.72),sy,8,null,'#f2aabc',2);
 text(game.stamps.includes('mirror')?'THE REFLECTION HAS SIGNED A STATEMENT':'DRAG THE LITTLE GREEN HANDLE',W*.5,sy+29,clamp(W*.025,10,16),'#f0ca9b','monospace');
}
function drawWheel(){
 darkScene(['#3c132b','#100910']);const {x,y,r}=sceneCenter();
 const outer=r*1.05;
 for(let i=0;i<16;i++){
  const a=wheelAngle+i*TAU/16,b=a+TAU/16;
  path([[x,y],[x+Math.cos(a)*outer,y+Math.sin(a)*outer],[x+Math.cos(b)*outer,y+Math.sin(b)*outer]]);
  fill(i%2?'#71284c':'#b88a54');stroke('#1c111b',2);
  text(i%3===0?'?':i%3===1?'!':'✳',x+Math.cos(a+TAU/32)*r*.72,y+Math.sin(a+TAU/32)*r*.72,Math.max(11,r*.13),'#ead7a5','Georgia');
 }
 circ(x,y,outer,null,'#d7b66f',5);circ(x,y,r*.15,'#261423','#f8e1ad',4);
 for(let i=0;i<16;i++){const a=wheelAngle+i*TAU/16;circ(x+Math.cos(a)*outer,y+Math.sin(a)*outer,5,i%3?'#b4e66b':'#dc748a');}
 path([[x,y-outer-27],[x-15,y-outer-55],[x+15,y-outer-55]]);fill('#caff60');
 const ev=evaluateBooths(coin);
 text(coin.trials?coin.heads+' HEADS / '+coin.trials+' SYNTHETIC FLIPS':'A FORTUNE IS NOT A FINDING',W*.5,Math.min(H*.88,y+outer+38),clamp(W*.027,12,18),'#eac88f','monospace');
 if(coin.trials)text(ev.rejected?'THE 90% PROPHECY IS IN TROUBLE':'THE WHEEL REQUESTS A LARGER SAMPLE',W*.5,Math.min(H*.93,y+outer+60),clamp(W*.02,9,14),'#ccff7e','monospace');
}
function targets(){
 const ys=[H*.45,H*.58,H*.71],centers=[.29,.5,.71],spread=Math.min(W*.12,100);
 return ys.map((y,i)=>({x:W*centers[i]+Math.sin(noMotion?i:time*(i+1)*.93+i*2)*spread,y,r:clamp(W*.06,23,43),kind:i===1?'evidence':'decoy',i}));
}
function drawGallery(){
 darkScene(['#361828','#0c080f']);
 const roof=H*.30;
 path([[W*.1,roof],[W*.5,roof-H*.11],[W*.9,roof],[W*.85,H*.84],[W*.15,H*.84]]);fill('#3b182b');stroke('#c1975f',4);
 for(let i=0;i<8;i++)line(W*(.17+i*.09),roof+20,W*(.17+i*.09),H*.78,i%2?'#a33c6155':'#e4bd6e33',4);
 targets().forEach(t=>{
  line(t.x,t.y-60,t.x,t.y-t.r,'#c5b28e88',2);
  circ(t.x,t.y,t.r,t.kind==='evidence'?'#bdf16c':'#a33a58','#f5d89e',4);
  circ(t.x,t.y,t.r*.55,'#26101e','#eed8a8',2);
  text(t.kind==='evidence'?'✳':'?',t.x,t.y,Math.max(16,t.r*.8),t.kind==='evidence'?'#d2ff7f':'#d4a4b3');
  if(selected===t.i)circ(t.x,t.y,t.r+9,null,'#d2ff90bb',2);
 });
 text(game.galleryHits+' / 3 EVIDENCE      '+(6-game.galleryShots)+' SHOTS LEFT',W*.5,H*.82,clamp(W*.023,11,19),'#f8dbab','monospace');
 if(game.galleryShots>=6&&!game.stamps.includes('gallery'))text('OUT OF SHOTS · TAP TO RELOAD',W*.5,H*.89,clamp(W*.023,10,16),'#d6f47c','monospace');
 if(game.stamps.includes('gallery'))text('THE EXHIBITS ARE FILING A COMPLAINT',W*.5,H*.89,clamp(W*.021,10,16),'#d6f47c','monospace');
}
function drawRadio(){
 darkScene(['#273126','#100d13']);const {x,y,r}=sceneCenter();
 rect(x-r*1.25,y-r*.76,r*2.5,r*1.53,'#53372f');
 ctx.strokeStyle='#e3b17b';ctx.lineWidth=7;ctx.strokeRect(x-r*1.25,y-r*.76,r*2.5,r*1.53);
 circ(x-r*.66,y,r*.51,'#180d17','#c9aa83',5);
 for(let i=0;i<9;i++){
  const a=i*TAU/9;line(x-r*.66,y,x-r*.66+Math.cos(a)*r*.41,y+Math.sin(a)*r*.41,'#a8f175',3);
 }
 rect(x-r*.02,y-r*.28,r*.97,r*.4,'#23151c');rect(x+r*.04,y-r*.21,r*.84,r*.24,'#d0b980');
 const cx=lerp(x+r*.08,x+r*.84,(game.frequency-87)/21);
 line(cx,y-r*.33,cx,y+r*.2,'#bdf767',5);
 text(game.frequency.toFixed(1)+' FM',x+r*.46,y+r*.44,Math.max(15,r*.17),'#e7d7a8','monospace');
 const closeness=1-clamp(Math.abs(game.frequency-94.6)/5,0,1);
 for(let i=0;i<24;i++){
  const xx=x-r*.83+i*r*.064,amplitude=(6+28*closeness)*(Math.sin(i*1.6+time*2));
  line(xx,y+r*.96,xx,y+r*.96-amplitude,'#aee66d',2);
 }
 text(game.stamps.includes('radio')?'YOU FOUND THE TRANSMISSION':'87                             94.6                             108',W*.5,Math.min(H*.9,y+r*1.28),clamp(W*.018,9,15),'#e7d39c','monospace');
}
function drawWeather(){
 darkScene(['#1b3040','#0b101a']);const {x,y,r}=sceneCenter();
 const pressure=game.weatherPressure;
 circ(x,y,r*1.08,'#282f34','#d9ac79',9);
 for(let i=0;i<36;i++){
  const a=i*TAU/36-PI/2;
  line(x+Math.cos(a)*r*.73,y+Math.sin(a)*r*.73,x+Math.cos(a)*r*.92,y+Math.sin(a)*r*.92,'#c8b07c',2);
 }
 ctx.beginPath();ctx.arc(x,y,r*.62,-PI/2,-PI/2+TAU*clamp(pressure,0,1));stroke('#caff70',Math.max(10,r*.12));
 circ(x,y,r*.47,'#20131d','#efd1a4',3);
 path([[x+r*.05,y-r*.36],[x-r*.16,y+r*.03],[x+r*.1,y+r*.03],[x-r*.14,y+r*.38],[x+r*.33,y-r*.12],[x-r*.02,y-r*.12]]);fill('#caff72');
 text(Math.round(clamp(pressure,0,1)*100)+'%',x,y+r*.68,Math.max(16,r*.2),'#f5d99f','monospace');
 text(game.stamps.includes('weather')?'THE CLOUDS HAVE UNIONIZED':'PRESS AND HOLD · OR HOLD SPACE',x,Math.min(H*.9,y+r*1.3),clamp(W*.026,10,18),'#f4d9a7','monospace');
}
function drawGate(){
 darkScene(['#182b21','#0a0a0c']);const {x,y,r}=sceneCenter();
 const open=game.afterHours||statusOf(game).unlocked;
 const separation=open?r*.38:0;
 rect(x-r*.76-separation,y-r*.9,r*.76,r*1.9,'#362033');
 rect(x+separation,y-r*.9,r*.76,r*1.9,'#362033');
 ctx.strokeStyle='#d6b77b';ctx.lineWidth=6;
 ctx.strokeRect(x-r*.76-separation,y-r*.9,r*.76,r*1.9);
 ctx.strokeRect(x+separation,y-r*.9,r*.76,r*1.9);
 for(let i=0;i<4;i++)circ(x-r*.52+(i%2)*r*1.07,y-r*.6+Math.floor(i/2)*r*1.1,r*.12,i<game.stamps.length?'#caff78':'#6b5467','#e6bb77',2);
 if(open){
  for(let i=0;i<15;i++){let xx=x-r*.2+seeded(i+21)*r*.42,yy=y-r*.6+seeded(i+12)*r*1.3;circ(xx,yy,1+seeded(i)*5,'#c6ff8caa');}
 }
 text(open?'THE LOCK HAS RESIGNED':'FOUR MARKS REQUIRED',W*.5,Math.min(H*.9,y+r*1.3),clamp(W*.027,11,19),'#cafe78','monospace');
}
function drawStation(){
 if(mode==='mirror')drawMirror();
 else if(mode==='wheel')drawWheel();
 else if(mode==='gallery')drawGallery();
 else if(mode==='radio')drawRadio();
 else if(mode==='weather')drawWeather();
 else if(mode==='gate')drawGate();
}
function clock(now){
 const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;
 if(!noMotion)time+=dt;
 if(arrival){
  const loc=positions().find(x=>x.name===arrival);
  if(loc){avatar.tx=loc.x/W;avatar.ty=loc.y/H;}
 }
 const dx=avatar.tx-avatar.x,dy=avatar.ty-avatar.y,dist=Math.hypot(dx,dy);
 if(dist>.003){
  const step=Math.min(dist,dt*.54);
  avatar.x+=dx/dist*step;avatar.y+=dy/dist*step;
 }
 if(arrival && dist<.035){const name=arrival;arrival=null;enter(name);}
 if(mode==='wheel'&&Math.abs(wheelVel)>.0005){
  wheelAngle+=wheelVel*dt*60;
  wheelVel*=Math.pow(noMotion?.79:.974,dt*60);
  if(Math.abs(wheelVel)<.004){
   wheelVel=0;
   apply('wheel');
   coin=changeBooth(coin,'sample');
   note('THE WHEEL CLAIMED 90% HEADS. RECEIPT: '+coin.heads+' / '+coin.trials+' fair flips. Astounding how data ruins a good prophecy.');
  }
 }
 if(mode==='weather'&&hold&&!game.stamps.includes('weather')){
  const next=game.weatherPressure+dt*.55;
  if(Math.abs(next-game.weatherPressure)>.0001)apply('pressure',next);
 }
 if(game.afterHours&&mode==='world')stepMoth(dt);
 if(!ctx)return;
 if(mode==='world')drawWorld();else if(mode==='theatre')drawTheatre(ctx,W,H,forest,theatrePulses,theatrePointer,time,noMotion);else drawStation();
 if(mode==='wheel'&&wheelVel)hint.textContent='The wheel is still having an opinion.';
 if(messageTimeout&&time>messageTimeout){messageTimeout=0;if(mode==='world')announce(game.afterHours?'Tap a lantern to guide the moth; the trails are real.':'Touch the next attraction. Nobody is supervising.');}
 requestAnimationFrame(clock);
}
requestAnimationFrame(clock);
function sustainRadio(){
 if(!soundOn||!audio)return;
 if(!drone){
  drone=audio.createOscillator();droneGain=audio.createGain();
  drone.type='sine';droneGain.gain.value=0;
  drone.connect(droneGain).connect(audio.destination);drone.start();
 }
 const f=110*Math.pow(2,(game.frequency-87)/21);
 drone.frequency.setTargetAtTime(f,audio.currentTime,.12);
 droneGain.gain.setTargetAtTime(mode==='radio' ? .016 : .004,audio.currentTime,.12);
}
function chime(...freqs){
 if(!soundOn)return;
 try{
  if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended')audio.resume();
  freqs.forEach((freq,i)=>{
   const at=audio.currentTime+i*.07,osc=audio.createOscillator(),g=audio.createGain();
   osc.type='triangle';osc.frequency.setValueAtTime(freq,at);
   g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(.045,at+.02);g.gain.exponentialRampToValueAtTime(.0001,at+.25);
   osc.connect(g).connect(audio.destination);osc.start(at);osc.stop(at+.26);
  });
 }catch{soundOn=false;$('sound').setAttribute('aria-pressed','false');$('sound').textContent='♫ UNAVAILABLE';}
}
function spin(){
 if(wheelVel)return;
 wheelVel=noMotion?0.055:0.23;
 wheelAngle+=.08;
 chime(196,246.94);
 if(noMotion){wheelVel=0;apply('wheel');coin=changeBooth(coin,'sample');note('FAIR COIN: '+coin.heads+' / '+coin.trials+' heads. Nobody in the committee prepared for arithmetic.');}
}
function shoot(kind){
 if(game.galleryShots>=6&&!game.stamps.includes('gallery')){apply('reload');note('New darts. Sadly the decoys have returned.');return;}
 if(game.galleryShots>=6||game.stamps.includes('gallery'))return;
 apply('shot',kind);
 chime(kind==='evidence'?520:160);
 if(!game.stamps.includes('gallery'))note(kind==='evidence'?'A GREEN TARGET HIT. This is almost suspiciously competent.':'The red thing was not evidence. It was just dressed for television.');
}
function adjustX(x){
 if(mode==='mirror')apply('mirror',clamp((x-W*.15)/(W*.7),0,1));
 if(mode==='radio'){const f=87+clamp((x-W*.2)/(W*.6),0,1)*21;apply('radio',f);sustainRadio();}
}
function press(x,y){
 pointer.down=true;pointer.x=x;pointer.y=y;
 if(mode==='world'&&game.afterHours){
  const gate=portalAt(forest);
  if(gate&&Math.hypot(x-gate.x*W,y-gate.y*H)<Math.min(W,H)*.12){
   forest=enterTheatre(forest);
   enter('theatre');chime(174,261.63,349.23);return;
  }
  const nearest=forest.lanterns.map((p,i)=>({i,d:Math.hypot(x-p.x*W,y-p.y*H)})).sort((a,b)=>a.d-b.d)[0];
  if(nearest&&nearest.d<31){guideMoth(nearest.i);}
  else{
   avatar.tx=clamp(x/W,.04,.96);avatar.ty=clamp(y/H,.33,.84);
   plantLantern(avatar.tx,avatar.ty);
  }
  return;
 }
 if(mode==='theatre'){strikeTheatre(x,y);return;}
 if(mode==='world'){
  const candidate=positions().map(p=>({...p,d:Math.hypot(x-p.x,y-p.y)})).sort((a,b)=>a.d-b.d)[0];
  if(candidate && candidate.d<candidate.r*1.22){arrival=candidate.name;avatar.tx=candidate.x/W;avatar.ty=candidate.y/H;note('Walking toward '+words[candidate.name][0].toLowerCase()+'.');}
  else{avatar.tx=clamp(x/W,.02,.98);avatar.ty=clamp(y/H,.3,.85);arrival=null;}
 }else if(mode==='wheel')spin();
 else if(mode==='gallery'){
  const t=targets().find(t=>Math.hypot(x-t.x,y-t.y)<t.r*1.35);
  shoot(t?t.kind:'miss');
 }else if(mode==='mirror'||mode==='radio')adjustX(x);
 else if(mode==='weather')hold=true;
 else if(mode==='gate'){
  if(statusOf(game).unlocked){apply('gate');back();note('YOU WALKED THROUGH THE GATE. This place appears to have an understory.');}
  else note('The padlocks still require '+statusOf(game).need+' punches. They have union representation.');
 }
}
canvas.addEventListener('pointerdown',e=>{
 e.preventDefault();pointer.down=true;pointer.x=e.clientX;pointer.y=e.clientY;
 try{canvas.setPointerCapture(e.pointerId);}catch{}
 press(e.clientX,e.clientY);
});
canvas.addEventListener('pointermove',e=>{
 pointer.x=e.clientX;pointer.y=e.clientY;
 if(mode==='theatre'){theatrePointer={x:e.clientX,y:e.clientY};if(pointer.down)strikeTheatre(e.clientX,e.clientY);}else if(pointer.down)adjustX(e.clientX);
});
const release=()=>{pointer.down=false;hold=false;};
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);addEventListener('blur',release);
function keyboard(e){
 const key=e.key.toLowerCase(),shortcut={'1':'mirror','2':'wheel','3':'gallery','4':'radio','5':'weather','g':'gate'};
 if(key==='escape'){e.preventDefault();if(!$('map').hidden){$('map').hidden=true;$('map-toggle').setAttribute('aria-expanded','false')}else back();return;}
 if(e.target.tagName==='BUTTON'||e.target.tagName==='A')return;
 if(shortcut[key]&&mode==='world'&&!game.afterHours){e.preventDefault();enter(shortcut[key]);return;}
 const arrows=['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d'];
 if(arrows.includes(key)||key==='enter'||key===' '){e.preventDefault();}
 if(mode==='world'){
  const d=.035;
  if(game.afterHours&&key===' '){plantLantern(avatar.x,avatar.y);return;}
  if(game.afterHours&&key==='k'){
   if(forest.open){forest=enterTheatre(forest);enter('theatre');}else note('Three distinct lanterns. Make a crooked connected route. Then ask for the door.');
   return;
  }
  if(game.afterHours&&key==='e'){guideNextMoth();return;}
  if(key==='arrowleft'||key==='a')avatar.tx=clamp(avatar.tx-d,.02,.98);
  if(key==='arrowright'||key==='d')avatar.tx=clamp(avatar.tx+d,.02,.98);
  if(key==='arrowup'||key==='w')avatar.ty=clamp(avatar.ty-d,.3,.85);
  if(key==='arrowdown'||key==='s')avatar.ty=clamp(avatar.ty+d,.3,.85);
  if(game.afterHours&&key==='enter'){guideNextMoth();return;}
  if(key==='enter'||key===' '){
   const nearest=positions().map(p=>({...p,d:Math.hypot(p.x/W-avatar.x,p.y/H-avatar.y)})).sort((a,b)=>a.d-b.d)[0];
   if(nearest)enter(nearest.name);
  }
 }else if(mode==='theatre'){
  if(key==='arrowleft'||key==='a')theatrePointer.x=clamp(theatrePointer.x-W*.04,0,W);
  if(key==='arrowright'||key==='d')theatrePointer.x=clamp(theatrePointer.x+W*.04,0,W);
  if(key==='arrowup'||key==='w')theatrePointer.y=clamp(theatrePointer.y-H*.04,0,H);
  if(key==='arrowdown'||key==='s')theatrePointer.y=clamp(theatrePointer.y+H*.04,0,H);
  if(key==='enter'||key===' ')strikeTheatre(theatrePointer.x,theatrePointer.y);
 }else if(mode==='wheel'&&(key==='enter'||key===' '))spin();
 else if(mode==='mirror'){
  if(key==='arrowleft'||key==='a')apply('mirror',game.mirrorAngle-.025);
  if(key==='arrowright'||key==='d')apply('mirror',game.mirrorAngle+.025);
 }else if(mode==='radio'){
  if(key==='arrowleft'||key==='a')apply('radio',game.frequency-.25);
  if(key==='arrowright'||key==='d')apply('radio',game.frequency+.25);
 }else if(mode==='gallery'){
  if(key==='arrowup'||key==='w'||key==='arrowleft'||key==='a')selected=(selected+2)%3;
  if(key==='arrowdown'||key==='s'||key==='arrowright'||key==='d')selected=(selected+1)%3;
  if(key==='enter'||key===' ')shoot(selected===1?'evidence':'decoy');
 }else if(mode==='weather'&&(key==='enter'||key===' '))apply('pressure',game.weatherPressure+.28);
 else if(mode==='gate'&&(key==='enter'||key===' ')){
  if(statusOf(game).unlocked){apply('gate');back();note('THE GATE OPENED. What a troubling lack of building regulation.');}
  else announce(statusOf(game).need+' tickets still required. Sorry, darling.');
 }
}
addEventListener('keydown',keyboard);
$('return').addEventListener('click',back);
$('forest-commands').querySelectorAll('[data-forest]').forEach(btn=>btn.addEventListener('click',()=>{
 const action=btn.dataset.forest;
 if(action==='plant')plantLantern(avatar.x,avatar.y);
 if(action==='guide')guideNextMoth();
 if(action==='theatre'){if(forest.open){forest=enterTheatre(forest);enter('theatre');}else note('The clearing remains locked. Guide the moth through three lamps that do not lie on one line.');}
 if(action==='clear'){forest=clearForest();moth=null;theatrePulses=[];announce('The lamps are gone. The ground remains.');}
 $('map').hidden=true;$('map-toggle').setAttribute('aria-expanded','false');canvas.focus({preventScroll:true});
}));
$('sound').addEventListener('click',e=>{
 soundOn=!soundOn;
 if(soundOn){
  try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();sustainRadio();chime(196,293.7,392);}
  catch{soundOn=false;}
 }
 if(!soundOn&&droneGain&&audio)droneGain.gain.setTargetAtTime(0,audio.currentTime,.04);
 e.currentTarget.setAttribute('aria-pressed',String(soundOn));e.currentTarget.textContent=soundOn?'♫ SOUND ON':'♫ SOUND OFF';
});
$('still').addEventListener('click',e=>{
 noMotion=!noMotion;e.currentTarget.setAttribute('aria-pressed',String(noMotion));e.currentTarget.textContent=noMotion?'◷ STILLNESS':'◷ MOTION ON';
 if(noMotion&&mode==='wheel'&&wheelVel){wheelVel=0;apply('wheel');coin=changeBooth(coin,'sample');}
});
$('map-toggle').addEventListener('click',e=>{
 const open=$('map').hidden;$('map').hidden=!open;e.currentTarget.setAttribute('aria-expanded',String(open));if(open)$('map').querySelector('button')?.focus();
});
$('map').querySelectorAll('[data-enter]').forEach(b=>b.addEventListener('click',()=>{
 $('map').hidden=true;$('map-toggle').setAttribute('aria-expanded','false');enter(b.dataset.enter);canvas.focus({preventScroll:true});
}));
refresh();
window.__MC_CARNIVAL__={getState:()=>({...game,stamps:[...game.stamps],forest:{...forest,lanterns:forest.lanterns.map(p=>({...p})),visited:[...forest.visited]}}),getMode:()=>mode,visit:enter,reset:()=>{apply('reset');coin=initialBooths();forest=clearForest();moth=null;theatrePulses=[];back();}};
