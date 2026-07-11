import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canonicalizeJson,
  canonicalJsonSha256,
  parseAndCanonicalizeJson,
} from './json-canonicalization.mjs';

test('matches the RFC 8785 primitive serialization example', () => {
  const value = {
    numbers: [333333333.33333329, 1e30, 4.50, 2e-3, 1e-27],
    string: "€$\u000f\nA'B\"\\\\\"/",
    literals: [null, true, false],
  };
  assert.equal(
    canonicalizeJson(value),
    '{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],"string":"€$\\u000f\\nA\'B\\"\\\\\\\\\\"/"}',
  );
});

test('sorts object properties recursively while preserving array order', () => {
  const value = { z: { b: 2, a: 1 }, a: [{ y: 2, x: 1 }, 3] };
  assert.equal(canonicalizeJson(value), '{"a":[{"x":1,"y":2},3],"z":{"a":1,"b":2}}');
});

test('semantically identical JSON texts produce the same canonical digest', () => {
  const left = JSON.parse('{"b":2,"a":{"d":4,"c":3}}');
  const right = JSON.parse('{\n  "a": {"c": 3, "d": 4},\n  "b": 2\n}');
  assert.equal(canonicalJsonSha256(left), canonicalJsonSha256(right));
  assert.equal(parseAndCanonicalizeJson(JSON.stringify(left)), canonicalizeJson(right));
});

test('rejects non-I-JSON values that cannot be safely canonicalized', () => {
  assert.throws(() => canonicalizeJson({ value: Number.NaN }), /Non-finite number/);
  assert.throws(() => canonicalizeJson({ value: 1n }), /Unsupported JSON value/);
  assert.throws(() => canonicalizeJson({ value: '\ud800' }), /Lone high surrogate/);
});

test('sorts RFC 8785 property-name vector by UTF-16 code units', () => {
  const value = {
    '\u20ac': 'Euro Sign',
    '\r': 'Carriage Return',
    '\ufb33': 'Hebrew Letter Dalet With Dagesh',
    '1': 'One',
    '\ud83d\ude00': 'Emoji: Grinning Face',
    '\u0080': 'Control',
    '\u00f6': 'Latin Small Letter O With Diaeresis',
  };
  assert.equal(
    canonicalizeJson(value),
    String.raw`{"\r":"Carriage Return","1":"One","":"Control","ö":"Latin Small Letter O With Diaeresis","€":"Euro Sign","😀":"Emoji: Grinning Face","דּ":"Hebrew Letter Dalet With Dagesh"}`,
  );
});
