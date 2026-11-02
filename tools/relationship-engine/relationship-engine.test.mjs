import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeGraph } from './relationship-engine.mjs';

test('finds cross-domain structural bridge candidates and excludes speculative links',()=>{
 const graph={nodes:[{id:'a',domain:'clinical'},{id:'b',domain:'clinical'},{id:'handoff',domain:'administrative'},{id:'c',domain:'benefits'},{id:'d',domain:'benefits'}],edges:[{from:'a',to:'b',status:'observed'},{from:'b',to:'handoff',status:'supported'},{from:'handoff',to:'c',status:'observed'},{from:'c',to:'d',status:'observed'},{from:'a',to:'d',status:'hypothesis'}]};
 const r=analyzeGraph(graph); assert.equal(r.graph.excludedEdgeCount,1); assert.equal(r.candidates[0].id,'handoff'); assert.ok(r.candidates[0].betweenness>0); assert.ok(r.candidates[0].betweenness<=1);
});
test('rejects dangling edges',()=>assert.throws(()=>analyzeGraph({nodes:[{id:'a'}],edges:[{from:'a',to:'missing',status:'observed'}]}),/unknown node/));
test('does not label isolated nodes as bridges',()=>assert.equal(analyzeGraph({nodes:[{id:'solo',domain:'x'}],edges:[]}).candidates.length,0));
test('rejects duplicate identifiers',()=>assert.throws(()=>analyzeGraph({nodes:[{id:'x'},{id:'x'}],edges:[]}),/duplicate/));
