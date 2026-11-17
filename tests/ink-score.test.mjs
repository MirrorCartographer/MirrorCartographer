import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {Script} from 'node:vm';
import {SCALE,cleanStroke,strokeToEvents,composeScore,validateSavedScore} from '../site/companion/atlas/rooms/music/ink-score-core.mjs';
const html=readFileSync(new URL('../site/companion/atlas/rooms/music/index.html',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../site/companion/atlas/rooms/music/ink-score.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../site/companion/atlas/rooms/music/ink-score.css',import.meta.url),'utf8');
test('stroke normalization clamps, bounds, and removes invalid input',()=>{
 const s=cleanStroke([{x:-10,y:10},{x:Infinity,y:2},{x:0,y:1},{x:.5,y:.5},{x:10,y:-10}]);
 assert.deepEqual(s[0],{x:0,y:1});assert.equal(s.length,3);assert.deepEqual(s[2],{x:1,y:0});
});
test('horizontal placement changes timing and vertical placement changes pitch',()=>{
 const low=strokeToEvents([{x:.1,y:.9},{x:.3,y:.9}]);const high=strokeToEvents([{x:.1,y:.1},{x:.3,y:.1}]);
 assert.equal(low[0].beat,high[0].beat);assert.notEqual(low[0].frequency,high[0].frequency);
 assert.equal(SCALE.length,12);
});
test('different marks generate different original musical events, with at most three simultaneous voices',()=>{
 const a=composeScore([[{x:.1,y:.8},{x:.5,y:.7}]]);
 const b=composeScore([[{x:.6,y:.2},{x:.8,y:.3}]]);assert.notDeepEqual(a,b);
 const c=composeScore(Array.from({length:8},(_,i)=>[{x:.15,y:i/8},{x:.15,y:(i+.2)/8}]));
 assert.ok(c.length<=3);assert.ok(c.every(n=>n.frequency>0&&n.velocity>=.3));
});
test('saved scores are explicitly versioned and reject malformed input',()=>{
 const v={schema:'mc.ink-score.v1',tempo:98,strokes:[[{x:.2,y:.3},{x:.7,y:.7}]]};
 assert.deepEqual(validateSavedScore(v),v);assert.equal(validateSavedScore({...v,strokes:[[{x:NaN,y:.5}]]}),null);
 assert.equal(validateSavedScore({...v,tempo:1000}),null);assert.equal(validateSavedScore({...v,schema:'unexpected'}),null);
});
test('interface offers original sound without importing recordings or contacting a provider',()=>{
 for(const id of ['score-ground','scratch-start','scratch-stop','scratch-save','scratch-export','scratch-erase','scratch-tempo','scratch-status'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('aria-label="Draw a musical contour'));assert.ok(html.includes('type="module" src="./ink-score.js"'));
 assert.ok(runtime.includes("new AudioContext")||runtime.includes('new AC()'));
 assert.ok(runtime.includes('pointerdown')&&runtime.includes('visibilitychange'));
 assert.doesNotMatch(html+runtime,/api\.openai\.com|<audio\s+autoplay|sendBeacon|fetch\(/);
 assert.ok(css.includes('prefers-reduced-motion'));
 assert.match(css,/#score-ground\{[^}]*pointer-events:auto/);
});
test('runtime JavaScript parses as an ES module',async()=>{
 const child=await import('node:child_process');const cp=child.spawnSync(process.execPath,['--check',new URL('../site/companion/atlas/rooms/music/ink-score.js',import.meta.url).pathname]);assert.equal(cp.status,0,cp.stderr?.toString());
});