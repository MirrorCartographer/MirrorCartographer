import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialGame,advance,collect,gateReady,statusOf,GATE_STAMPS} from '../site/companion/atlas/rooms/experiments/004-carnival-of-thought/midway-core.mjs';
test('the gate requires four distinct discovered attractions',()=>{
 let state=initialGame();assert.equal(gateReady(state),false);
 for(const name of ['mirror','wheel','gallery'])state=collect(state,name);
 assert.equal(advance(state,'gate').afterHours,false);
 state=collect(state,'gallery');assert.equal(state.stamps.length,3);
 state=collect(state,'radio');
 assert.equal(state.stamps.length,GATE_STAMPS);
 assert.equal(advance(state,'gate').afterHours,true);
});
test('each attraction has a condition, rather than awarding a ticket on entry',()=>{
 let s=initialGame();
 s=advance(s,'mirror',.3);assert.equal(s.stamps.length,0);
 s=advance(s,'mirror',.72);assert.ok(s.stamps.includes('mirror'));
 s=advance(s,'radio',87);assert.equal(s.stamps.length,1);
 s=advance(s,'radio',94.6);assert.ok(s.stamps.includes('radio'));
 s=advance(s,'pressure',.4);assert.equal(s.weather,'wind');
 s=advance(s,'pressure',1.04);assert.ok(s.stamps.includes('weather'));
 assert.equal(s.weather,'storm');
 s=advance(s,'wheel');assert.ok(s.stamps.includes('wheel'));
});
test('gallery counts the moving evidence objects and gives a retry',()=>{
 let s=initialGame();for(let i=0;i<3;i++)s=advance(s,'shot','decoy');
 assert.equal(s.galleryShots,3);assert.equal(s.galleryHits,0);
 for(let i=0;i<3;i++)s=advance(s,'shot','evidence');
 assert.equal(s.galleryShots,6);assert.equal(s.galleryHits,3);assert.ok(s.stamps.includes('gallery'));
 assert.deepEqual(advance(s,'shot','evidence'),s);
 const reloaded=advance(s,'reload');assert.equal(reloaded.galleryHits,0);
});
test('radio, mirror and weather values are bounded and progress is reversible',()=>{
 let s=advance(initialGame(),'radio',500);
 assert.equal(s.frequency,108);
 s=advance(s,'mirror',-40);assert.equal(s.mirrorAngle,0);
 s=advance(s,'pressure',500);assert.equal(s.weatherPressure,1.25);
 assert.equal(statusOf(s).unlocked,false);
 assert.deepEqual(advance(s,'reset'),initialGame());
});
test('unknown actions and repeat claims do not award extra tickets',()=>{
 const s=advance(initialGame(),'wheel'),t=advance(s,'wheel');
 assert.equal(t.stamps.length,1);assert.equal(t.wheelSpins,2);
 assert.deepEqual(advance(t,'nonsense'),t);
});

test('the public entry supports an opt-in sound switch, reduced motion and a nonpuzzle accessible directory',()=>{
 const html=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/index.html','utf8');
 const code=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/midway.js','utf8');
 const css=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/midway.css','utf8');
 assert.match(html,/id="sound" type="button" aria-pressed="false"/);
 assert.match(html,/id="still" type="button" aria-pressed="false"/);
 assert.match(html,/id="map" class="map" hidden/);
 assert.match(html,/id="return" type="button" hidden/);
 assert.match(code,/prefers-reduced-motion: reduce/);
 assert.match(code,/soundOn=false/);
 assert.match(css,/touch-action:none/);
 assert.match(css,/focus-visible/);
 assert.doesNotMatch(code,/localStorage|sessionStorage|fetch\(/);
});
