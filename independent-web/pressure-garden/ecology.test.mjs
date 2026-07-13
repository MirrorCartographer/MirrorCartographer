import test from 'node:test';
import assert from 'node:assert/strict';
import {createGenome,crossGenomes,describeGenome} from './ecology.mjs';

test('wild genomes are deterministic for identical pressure coordinates',()=>{const a=createGenome({x:.22,y:.81,pressure:.67});const b=createGenome({x:.22,y:.81,pressure:.67});assert.deepEqual(a,b)});

test('different pressure histories produce different genomes',()=>{const a=createGenome({x:.22,y:.81,pressure:.2});const b=createGenome({x:.22,y:.81,pressure:.9});assert.notEqual(a.seed,b.seed);assert.notEqual(a.height,b.height)});

test('hybrids retain bounded parent-influenced traits',()=>{const a=createGenome({x:.2,y:.8,pressure:.3});const b=createGenome({x:.8,y:.7,pressure:.8});const child=crossGenomes(a,b,{x:.5,y:.75,pressure:.6});assert.match(child.lineage,/×/);assert.ok(child.hue>=Math.min(a.hue,b.hue)-30&&child.hue<=Math.max(a.hue,b.hue)+30);assert.ok(child.branches>=2&&child.branches<=7);assert.ok(child.bloom>=2&&child.bloom<=10);assert.ok(child.height>=.62&&child.height<=1.34)});

test('genome descriptions expose visible morphology without identity claims',()=>{const text=describeGenome(createGenome({x:.4,y:.8,pressure:.5}));assert.match(text,/bloom \d+/);assert.doesNotMatch(text,/diagnos|personality|emotion/i)});
