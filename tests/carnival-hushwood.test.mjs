import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {startForest,plantLight,edgesOf,routeTo,visitLight,triadOf,portalAt,enterTheatre,clearForest,MAX_LIGHTS} from '../site/companion/atlas/rooms/experiments/004-carnival-of-thought/hushwood-core.mjs';

test('lantern placements require visible clear ground, with no duplicates or unbounded growth',()=>{
 let s=startForest();
 assert.deepEqual(plantLight(s,NaN,.5),s);
 assert.deepEqual(plantLight(s,.2,.12),s);
 s=plantLight(s,.25,.55);
 assert.equal(s.lanterns.length,1);
 assert.equal(s.at,0);
 assert.deepEqual(s.visited,[0]);
 assert.equal(plantLight(s,.253,.552).lanterns.length,1);
 for(let i=0;i<MAX_LIGHTS+3;i++)s=plantLight(s,.055+i*.039,.75);
 assert.ok(s.lanterns.length<=MAX_LIGHTS);
});
test('connected lamps create a navigable graph; the moth cannot teleport between components',()=>{
 let s=startForest();
 for(const [x,y] of [[.14,.43],[.29,.44],[.42,.56],[.86,.79]])s=plantLight(s,x,y,1);
 assert.deepEqual(routeTo(s,2,1),[0,1,2]);
 assert.equal(routeTo(s,3,1),null);
 assert.deepEqual(edgesOf(s,1),[[0,1],[1,2]]);
 assert.equal(routeTo(s,77,1),null);
});
test('a traversal of non-collinear lamps opens the clearing, but a straight line does not',()=>{
 let s=startForest();
 for(const [x,y] of [[.22,.48],[.39,.48],[.56,.48],[.45,.66]])s=plantLight(s,x,y,1);
 s=visitLight(s,1);s=visitLight(s,2);
 assert.equal(s.open,false);
 assert.equal(portalAt(s),null);
 s=visitLight(s,3);
 assert.equal(s.open,true);
 assert.ok(triadOf(s).area>=.004);
 const portal=portalAt(s);
 assert.ok(portal.x>=.18&&portal.x<=.82);
 assert.ok(portal.y>=.34&&portal.y<=.59);
});
test('the theatre cannot open without a valid triad and state is session-reversible',()=>{
 let s=plantLight(startForest(),.5,.55);
 assert.equal(enterTheatre(s).entered,false);
 s=visitLight(s,0);
 assert.equal(s.open,false);
 assert.deepEqual(clearForest(),startForest());
});
test('graph obeys screen aspect, and pathfinding always chooses a shortest route',()=>{
 let s=startForest();
 for(const [x,y] of [[.12,.5],[.24,.5],[.37,.5],[.5,.5],[.63,.5]])s=plantLight(s,x,y,2);
 assert.deepEqual(routeTo(s,4,2),[0,1,2,3,4]);
 assert.ok(edgesOf(s,.4).length>edgesOf(s,2).length);
});

test('Hushwood renderer, keyboard, pointer, and fallback directory are linked to the live entry',()=>{
 const html=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/index.html','utf8');
 const js=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/midway.js','utf8');
 const renderer=readFileSync('site/companion/atlas/rooms/experiments/004-carnival-of-thought/hushwood-scene.mjs','utf8');
 assert.match(html,/id="forest-commands" class="forest-commands" hidden/);
 for(const action of ['plant','guide','theatre','clear'])assert.ok(html.includes('data-forest="'+action+'"'));
 assert.match(js,/import \{startForest,plantLight,routeTo,visitLight,portalAt,enterTheatre,clearForest\}/);
 assert.match(js,/drawForest\(ctx,W,H,forest,moth,time,noMotion\)/);
 assert.match(js,/drawTheatre\(ctx,W,H,forest,theatrePulses,theatrePointer,time,noMotion\)/);
 assert.match(js,/guideNextMoth\(\)/);
 assert.match(js,/if\(game\.afterHours&&key===' '/);
 assert.match(js,/mode==='theatre'/);
 assert.match(renderer,/edgesOf\(forest,aspect\)/);
 assert.doesNotMatch(js+renderer,/localStorage|sessionStorage|fetch\(/);
});
