import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalJsonTextDigest, parseStrictIJson } from './canonical-json-text-digest.mjs';

test('accepts unique members and produces stable semantic digest', () => {
  const a = canonicalJsonTextDigest('{"b":2,"a":1}');
  const b = canonicalJsonTextDigest('{ "a" : 1, "b" : 2 }');
  assert.equal(a.canonical, '{"a":1,"b":2}');
  assert.equal(a.digest, b.digest);
});

test('rejects duplicate names before JSON.parse collapses them', () => {
  assert.throws(() => parseStrictIJson('{"role":"reader","role":"admin"}'), /duplicate object member "role"/);
});

test('detects escaped-name equivalence', () => {
  assert.throws(() => parseStrictIJson('{"a":1,"\\u0061":2}'), /duplicate object member "a"/);
});

test('scopes duplicate detection to each object', () => {
  assert.deepEqual(parseStrictIJson('{"a":1,"nested":{"a":2}}'), { a: 1, nested: { a: 2 } });
});

test('rejects nested duplicates and trailing data', () => {
  assert.throws(() => parseStrictIJson('{"nested":{"x":1,"x":2}}'), /duplicate object member "x"/);
  assert.throws(() => parseStrictIJson('{"x":1} null'), /trailing data/);
});

test('preserves existing I-JSON scalar rejection downstream', () => {
  assert.throws(() => canonicalJsonTextDigest('{"x":1e400}'), /non-finite number/);
  assert.throws(() => canonicalJsonTextDigest('{"x":"\\ud800"}'), /unpaired high surrogate/);
});
