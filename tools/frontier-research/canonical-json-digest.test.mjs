import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalizeJson, canonicalJsonDigest } from './canonical-json-digest.mjs';

test('matches the RFC 8785 canonical sample', () => {
  const input = {
    numbers: [333333333.33333329, 1e30, 4.50, 2e-3, 1e-27],
    string: "€$\u000f\nA'B\"\\\\\"/",
    literals: [null, true, false],
  };
  assert.equal(
    canonicalizeJson(input),
    '{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],"string":"€$\\u000f\\nA\'B\\"\\\\\\\\\\"/"}',
  );
});

test('equivalent property order produces the same canonical digest', () => {
  const left = canonicalJsonDigest({ z: 1, nested: { b: 2, a: 1 }, list: [{ y: 2, x: 1 }] });
  const right = canonicalJsonDigest({ list: [{ x: 1, y: 2 }], nested: { a: 1, b: 2 }, z: 1 });
  assert.equal(left.canonical, right.canonical);
  assert.equal(left.digest, right.digest);
});

test('array order remains semantically significant', () => {
  assert.notEqual(
    canonicalJsonDigest({ values: [1, 2] }).digest,
    canonicalJsonDigest({ values: [2, 1] }).digest,
  );
});

test('fails closed on non-I-JSON values and ambiguous strings', () => {
  assert.throws(() => canonicalizeJson({ value: Number.NaN }), /non-finite/);
  assert.throws(() => canonicalizeJson({ value: 1n }), /not representable/);
  assert.throws(() => canonicalizeJson({ value: '\ud800' }), /unpaired high surrogate/);
  assert.throws(() => canonicalizeJson(new Date()), /plain JSON object/);
  const cyclic = {};
  cyclic.self = cyclic;
  assert.throws(() => canonicalizeJson(cyclic), /cycle/);
});
