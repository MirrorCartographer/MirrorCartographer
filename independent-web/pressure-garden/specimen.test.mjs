import test from 'node:test';import assert from 'node:assert/strict';import{specimenId,specimenSVG}from'./specimen.mjs';
const g={seed:305441741,hue:112,height:.94,branches:5,bloom:7,curl:.31,root:.72};
test('stable specimen id',()=>assert.equal(specimenId(g),'pg-1234abcd'));
test('svg is deterministic and self-contained',()=>{const a=specimenSVG(g,{parents:[1,2]}),b=specimenSVG(g,{parents:[1,2]});assert.equal(a,b);assert.match(a,/^<svg/);assert.match(a,/lineage 1 × 2/);assert.doesNotMatch(a,/<script|href=|xlink:href=/)});
test('visible traits affect drawing',()=>assert.notEqual(specimenSVG(g),specimenSVG({...g,seed:305441742,hue:140})));
test('invalid genome fails closed',()=>assert.throws(()=>specimenSVG({}),/integer seed/));
