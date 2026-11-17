// Lightweight DOM/canvas harness: executes the real browser entry without a network.
// Not a substitute for touch/audio/visual testing on a device.
import test from 'node:test';
import assert from 'node:assert/strict';

test('a real keyboard and pointer path opens the secret woods and theatre without a runtime exception', async()=>{
 const restore=new Map();
 function set(name,value){restore.set(name,globalThis[name]);globalThis[name]=value}
 const events=new Map(),frames=[],nodes=new Map();
 const empty=()=>{};
 function element(id){
  if(nodes.has(id))return nodes.get(id);
  const listeners=new Map();
  const el={
   id,tagName:id==='midway-world'?'CANVAS':'BUTTON',
   hidden:id==='map'||id==='return'||id==='forest-commands'||id==='map-forest-note',
   textContent:'',style:{},width:0,height:0,dataset:{},
   addEventListener(name,fn){listeners.set(name,fn)},
   emit(name,arg={}){return listeners.get(name)?.(arg)},
   setAttribute:empty,focus:empty,
   querySelector:()=>element('dummy-button'),
   querySelectorAll:()=>[],
   getContext:()=>ctx,
   setPointerCapture:empty
  };
  nodes.set(id,el);
  return el;
 }
 const gradient={addColorStop:empty};
 const ctx=new Proxy({},{
  get(target,prop){
   if(prop==='createLinearGradient'||prop==='createRadialGradient')return ()=>gradient;
   if(prop in target)return target[prop];
   return empty;
  },set(target,p,v){target[p]=v;return true}
 });
 const canvas=element('midway-world');
 set('window',globalThis);
 set('document',{getElementById:element});
 set('innerWidth',400);set('innerHeight',780);set('devicePixelRatio',1);
 set('matchMedia',()=>({matches:true}));
 set('requestAnimationFrame',fn=>{frames.push(fn);return frames.length});
 set('addEventListener',(type,fn)=>events.set(type,fn));
 try{
  await import('../site/companion/atlas/rooms/experiments/004-carnival-of-thought/midway.js?smoke=1');
  const game=globalThis.__MC_CARNIVAL__;
  assert.equal(game.getMode(),'world');
  assert.equal(game.getState().afterHours,false);
  const key=(name)=>events.get('keydown')({key:name,target:canvas,preventDefault:empty});
  const click=(x,y)=>{
   canvas.emit('pointerdown',{clientX:x,clientY:y,pointerId:1,preventDefault:empty});
   canvas.emit('pointerup');
  };
  // Real input flow: tune the original radio, spin wheel in reduced-motion mode,
  // and align the reflection. These three stamps + the weather enter the gate.
  key('1');
  for(let i=0;i<25;i++)key('ArrowRight');
  assert.ok(game.getState().stamps.includes('mirror'),'mirror alignment did not award a stamp');
  key('Escape');key('2');key(' ');
  assert.ok(game.getState().stamps.includes('wheel'),'stillness wheel did not award a stamp');
  key('Escape');key('4');
  for(let i=0;i<22;i++)key('ArrowRight');
  assert.ok(game.getState().stamps.includes('radio'),'radio tuning did not award a stamp');
  key('Escape');key('5');
  for(let i=0;i<4;i++)key(' ');
  assert.ok(game.getState().stamps.includes('weather'),'weather pressure did not award a stamp');
  key('Escape');key('g');key(' ');
  assert.equal(game.getState().afterHours,true);
  assert.equal(game.getMode(),'world');
  // Geometry: the three lanterns are connected by visible edges,
  // but the moth must traverse the network to reveal the portal.
  click(128,421);click(208,460);click(288,600);
  assert.equal(game.getState().forest.lanterns.length,3);
  assert.equal(game.getState().forest.open,false);
  click(208,460);click(288,600);
  assert.equal(game.getState().forest.open,true);
  assert.equal(game.getState().forest.visited.length,3);
  key('k');
  assert.equal(game.getMode(),'theatre');
  click(190,410);
  frames[0]?.(16);
  assert.equal(game.getState().forest.entered,true);
  key('Escape');assert.equal(game.getMode(),'world');
 }finally{
  for(const [k,v] of restore)if(v===undefined)delete globalThis[k];else globalThis[k]=v;
  delete globalThis.__MC_CARNIVAL__;
 }
});
