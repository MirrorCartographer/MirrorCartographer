import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('country signal bus validates, bounds, persists and isolates signals',()=>{
 const store=new Map(), listeners=new Map();
 const win={
   localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
   addEventListener:(name,fn)=>{const a=listeners.get(name)||[];a.push(fn);listeners.set(name,a)},
   removeEventListener:(name,fn)=>listeners.set(name,(listeners.get(name)||[]).filter(x=>x!==fn)),
   dispatchEvent:e=>(listeners.get(e.type)||[]).forEach(fn=>fn(e))
 };
 class CustomEvent{constructor(type,opts){this.type=type;this.detail=opts.detail}}
 vm.runInNewContext(readFileSync('site/country-signals.js','utf8'),{window:win,CustomEvent,Date});
 assert.equal(win.MC_COUNTRY.version,1);
 const seen=[];const off=win.MC_COUNTRY.subscribe(x=>seen.push(x));
 win.MC_COUNTRY.emit('music','BAD WEATHER BOOGIE');
 assert.equal(win.MC_COUNTRY.read()[0].value,'BAD WEATHER BOOGIE');
 assert.equal(seen.length,1);
 assert.throws(()=>win.MC_COUNTRY.emit('medical-diagnosis','x'),TypeError);
 assert.throws(()=>win.MC_COUNTRY.emit('weather','x'.repeat(281)),TypeError);
 for(let i=0;i<100;i++)win.MC_COUNTRY.emit('weather','storm');
 assert.equal(win.MC_COUNTRY.read().length,80);
 off();win.MC_COUNTRY.emit('weather','heat');assert.equal(seen.length,101);
 win.MC_COUNTRY.clear();assert.equal(win.MC_COUNTRY.read().length,0);
});
