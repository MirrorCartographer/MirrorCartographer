import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {RECIPES} from '../site/chemical-orchard/reaction-core.mjs';
import {createTwins,intervene,advanceTwins,divergence,distillTwins} from '../site/chemical-orchard/unlived-core.mjs';
import {distillFields,validateImprint,makeImprint,worldEffect} from '../site/world-imprint.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=p=>readFileSync(resolve(root,p),'utf8');

test('identical histories have identical numerical futures across recipe changes',()=>{
 const t=createTwins(36,30,2026);
 for(const r of RECIPES)advanceTwins(t,r,70);
 assert.deepEqual(t.lived.b,t.unlived.b);
 assert.equal(divergence(t),0);
});
test('intervention changes the lived branch but never leaks into the unlived one',()=>{
 const base=createTwins(36,30,122),t=createTwins(36,30,122);
 advanceTwins(t,RECIPES[0],35);advanceTwins(base,RECIPES[0],35);
 intervene(t,15,17,4.5);
 advanceTwins(t,RECIPES[0],45);advanceTwins(base,RECIPES[0],45);
 assert.ok(divergence(t)>0.00001);
 assert.deepEqual(t.unlived.b,base.unlived.b);
 assert.notDeepEqual(t.lived.b,t.unlived.b);
});
test('material signature is deterministic, bounded, and linked to actual concentrations',()=>{
 const t=createTwins(64,48,25);intervene(t,28,25,5);advanceTwins(t,RECIPES[1],35);
 const signature=distillTwins(t,RECIPES[1]);
 assert.equal(signature.cells.length,64);
 assert.equal(signature.kind,'material-not-person');
 assert.ok(signature.divergence>0);
 assert.deepEqual(signature,distillTwins(t,RECIPES[1]));
 assert.ok(validateImprint(signature));
 const changed={...signature,cells:[...signature.cells]};changed.cells[0]=(changed.cells[0]+1)%16;
 assert.equal(validateImprint(changed),null);
});
test('distinct interventions create different world layouts, not merely colored reactions',()=>{
 const left=createTwins(48,48,6),right=createTwins(48,48,6);
 intervene(left,8,10,6,.9);intervene(right,40,37,6,.9);
 advanceTwins(left,RECIPES[2],70);advanceTwins(right,RECIPES[2],70);
 const a=worldEffect(distillTwins(left,RECIPES[2])),b=worldEffect(distillTwins(right,RECIPES[2]));
 assert.ok(a&&b);
 assert.notEqual(a.materialId,b.materialId);
 assert.notEqual(a.roadsSeed,b.roadsSeed);
});
test('invalid state cannot trigger a new world',()=>{
 assert.equal(validateImprint(null),null);
 assert.equal(validateImprint({kind:'visitor-personality',cells:[]}),null);
 assert.equal(worldEffect({}),null);
 assert.throws(()=>makeImprint({recipe:'unknown',ticks:3,divergence:1,cells:Array(64).fill(1)}));
});
test('no hidden AI/personality profiling; explicit transfer + reversible accessible controls',()=>{
 const orchard=source('site/chemical-orchard/orchard.js');const html=source('site/chemical-orchard/index.html'),carry=source('site/afterimage.js'),world=source('site/world-imprint.mjs');
 for(const x of ['id="witness"','id="bottle"','id="unlived-specimen"','id="carry-back"'])assert.ok(html.includes(x),x);
 assert.ok(orchard.includes("$('bottle').addEventListener('click'"));
 assert.ok(orchard.includes('advanceTwins('));
 assert.match(carry,/reweaveFromImprint/);
 for(const text of [orchard,carry,world])assert.doesNotMatch(text,/fetch\(|sendBeacon|XMLHttpRequest|api\.openai\.com|sk-proj-/i);
 assert.ok(html.includes('aria-label="Reveal the untouched alternative world"'));
});