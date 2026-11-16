import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import {insertBridge} from './bridge-rooms.mjs';
const html=readFileSync('site/index.html','utf8'),css=readFileSync('site/maze.css','utf8'),engine=readFileSync('site/maze-engine.js','utf8');
test('live labyrinth has a playable canvas, discoverable map, audio controls and accessible routes',()=>{
 for(const id of ['terrain','weather','sound','voice','map-toggle','map-sheet','mini-map','encounter','trace','trace-form','trace-entries','door-index','maze-shift','failsafe'])assert.ok(html.includes(`id="${id}"`),id);
 const links=[...html.matchAll(/<a href="([^"]+)"/g)].map(m=>m[1]);assert.ok(links.some(x=>x.includes('wordless-sky')));assert.ok(links.some(x=>x.includes('living-atlas')));
 assert.ok([...html.matchAll(/<a href=".\/companion\/atlas\/rooms\//g)].length>=5);
 assert.ok(html.includes('<a href="./mind/">The Mind</a>'));
 assert.ok(html.includes('class="mind-knot" aria-label="The Mind"'));
});
test('javascript parses and exposes movement, real graph reachability, evidence threads and sound lifecycle',()=>{
 assert.doesNotThrow(()=>new Script(engine));
 for(const symbol of ['bfsDistances','routeTo','onStep','selfTest','speechSynthesis','AudioContext','localStorage','showEncounter','save','trace-source','prefers-reduced-motion'])assert.ok(engine.includes(symbol),symbol);
 assert.ok(engine.includes('allPortalsReachable'));
});
test('style does not rely on an external asset CDN or an external font request',()=>{
 assert.ok(!css.includes('@import url('));assert.ok(!html.includes('https://fonts.googleapis'));
 assert.ok(css.includes('touch-action:none'));assert.ok(css.includes('prefers-reduced-motion'));
});
test('no secrets, user transcripts, or model calls are embedded in the public engine',()=>{
 assert.ok(!/sk-proj-|Bearer\s+sk-|api\.openai\.com|anthropic\.com\/v1/i.test(engine+html));
 assert.ok(!engine.includes('navigator.sendBeacon'));assert.ok(!engine.includes('fetch('));
 assert.ok(html.includes('YOUR WORDS STAY ON THIS DEVICE'));
});
test('return bridge is an idempotent relative route and keeps original markup',()=>{
 const stub='<html><head></head><body><h1>Existing creative work</h1></body></html>';
 const built=insertBridge(stub,'companion/atlas/rooms/music/index.html');
 assert.match(built,/href="\.\.\/\.\.\/\.\.\/\.\.\/index.html"/);assert.match(built,/Existing creative work/);assert.equal(insertBridge(built,'companion/atlas/rooms/music/index.html'),built);
 assert.equal(insertBridge(stub,'index.html'),stub);
});