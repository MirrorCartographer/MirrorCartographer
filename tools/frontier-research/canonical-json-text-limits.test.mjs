import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalJsonTextDigest, parseStrictIJson, DEFAULT_JSON_TEXT_LIMITS } from './canonical-json-text-digest.mjs';

test('exports deterministic defaults', () => {
  assert.deepEqual(DEFAULT_JSON_TEXT_LIMITS, { maxBytes: 1_048_576, maxDepth: 128 });
  assert.equal(Object.isFrozen(DEFAULT_JSON_TEXT_LIMITS), true);
});

test('accepts structure at configured nesting depth', () => {
  assert.deepEqual(parseStrictIJson('[[[0]]]', { maxDepth: 3 }), [[[0]]]);
});

test('rejects structure beyond configured nesting depth before JSON.parse', () => {
  assert.throws(() => parseStrictIJson('[[[[0]]]]', { maxDepth: 3 }), /maximum nesting depth 3 exceeded/);
});

test('counts object and array containers consistently', () => {
  assert.deepEqual(parseStrictIJson('{"a":[{"b":1}]}', { maxDepth: 3 }), { a: [{ b: 1 }] });
  assert.throws(() => parseStrictIJson('{"a":[{"b":1}]}', { maxDepth: 2 }), /maximum nesting depth 2 exceeded/);
});

test('enforces UTF-8 byte length rather than JavaScript code-unit length', () => {
  const text = '"é"';
  assert.equal(Buffer.byteLength(text, 'utf8'), 4);
  assert.equal(parseStrictIJson(text, { maxBytes: 4 }), 'é');
  assert.throws(() => parseStrictIJson(text, { maxBytes: 3 }), /maximum byte length 3/);
});

test('rejects invalid resource-limit configuration', () => {
  for (const options of [{ maxDepth: 0 }, { maxBytes: -1 }, { maxDepth: 1.5 }, null]) {
    assert.throws(() => parseStrictIJson('{}', options));
  }
});

test('preserves duplicate-member rejection under custom limits', () => {
  assert.throws(() => canonicalJsonTextDigest('{"a":1,"\\u0061":2}', 'sha256', { maxDepth: 4, maxBytes: 64 }), /duplicate object member/);
});
