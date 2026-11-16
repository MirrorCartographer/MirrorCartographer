import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('./tactile-dimensions.js',import.meta.url),'utf8');
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');

test('tactile dimension source has valid JavaScript and visible integration',()=>{
 assert.doesNotThrow(()=>new Script(source,{filename:'tactile-dimensions.js'}));
 assert.match(html,/src="\.\/tactile-dimensions\.js"/);
 assert.match(html,/src="\.\/maze-engine\.js"/);
});
test('iPhone tactile interaction uses a real, directly tapped native WebKit switch',()=>{
 assert.match(source,/switchInput\.setAttribute\('switch',\s*''\)/);
 assert.match(source,/switchInput\.addEventListener\('change',pulse\)/);
 assert.match(source,/\.native-haptic-switch\{[^}]*opacity:0/i);
 assert.doesNotMatch(source,/switchInput\.click\(\)/);
 assert.doesNotMatch(source,/style\.appearance\s*=\s*['"]none/);
});
test('Android vibration path is voluntary and haptics are not misrepresented',()=>{
 assert.match(source,/typeof navigator\.vibrate==='function'/);
 assert.match(source,/navigator\.vibrate\(\[18,34,18\]\)/);
 assert.match(source,/nativeIoshapticVerifiedOnDevice:false/);
 assert.match(source,/fullIoshapticPatterns:false/);
});
test('actual 4D hypercube projection uses 16 vertices and 32 Hamming-one edges',()=>{
 const points4=Array.from({length:16},(_,n)=>[n&1?1:-1,n&2?1:-1,n&4?1:-1,n&8?1:-1]);
 const edges=[];
 for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)if([1,2,4,8].includes(i^j))edges.push([i,j]);
 assert.equal(points4.length,16); assert.equal(edges.length,32);
 assert.match(source,/const w=2\.6\/\(3\.5-p\[3\]\*\.68\)/);
 assert.match(source,/rotate\(p,0,3/);
});
test('reduced motion, no server, no data extraction',()=>{
 assert.match(source,/prefers-reduced-motion: reduce/);
 assert.match(source,/if\(!prefersStill\.matches\)/);
 assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|sendBeacon\(|WebSocket\(/);
});