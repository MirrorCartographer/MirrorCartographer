/* Mirror Cartographer / Country Signal Bus v1
   Shared, local-only, versioned signals across rooms on the same origin.
   Not a chat backend, not cross-device sync, and not a source of clinical evidence.
*/
(function(global){
'use strict';
const KEY='mc.country.signals.v1',LIMIT=80,MAX=280;
const kinds=new Set(['weather','broadcast','music','discovery','experiment','lantern','encounter']);
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(valid).slice(-LIMIT):[]}catch{return []}}
function valid(x){return x&&typeof x==='object'&&kinds.has(x.kind)&&typeof x.value==='string'&&x.value.length<=MAX&&typeof x.time==='number'&&Number.isFinite(x.time)}
function emit(kind,value){if(!kinds.has(kind)||typeof value!=='string'||value.length>MAX)throw new TypeError('Invalid signal');const item={kind,value,time:Date.now()};const history=read();history.push(item);try{localStorage.setItem(KEY,JSON.stringify(history.slice(-LIMIT)))}catch{}global.dispatchEvent(new CustomEvent('mc:signal',{detail:item}));return item}
function subscribe(fn){const listener=e=>{if(valid(e.detail))fn(e.detail)};const remote=e=>{if(e.key===KEY)fn(null)};global.addEventListener('mc:signal',listener);global.addEventListener('storage',remote);return()=>{global.removeEventListener('mc:signal',listener);global.removeEventListener('storage',remote)}}
function clear(){localStorage.removeItem(KEY);global.dispatchEvent(new CustomEvent('mc:signal',{detail:null}))}
global.MC_COUNTRY=Object.freeze({version:1,read,emit,subscribe,clear});
})(window);
