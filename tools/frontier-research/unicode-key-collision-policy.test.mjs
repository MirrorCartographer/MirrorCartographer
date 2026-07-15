import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalJsonDigest } from './canonical-json-digest.mjs';
import { findUnicodeKeyCollisions, enforceUnicodeKeyCollisionPolicy } from './unicode-key-collision-policy.mjs';

test('detects canonically equivalent keys without mutating JCS input', () => {
  const value = { '\u00e9': 1, 'e\u0301': 2 };
  const before = canonicalJsonDigest(value);
  const collisions = findUnicodeKeyCollisions(value, { form: 'NFC' });
  const after = canonicalJsonDigest(value);
  assert.equal(collisions.length, 1);
  assert.deepEqual(collisions[0].originalKeys, ['e\u0301', '\u00e9']);
  assert.equal(before.digest, after.digest);
  assert.equal(Object.keys(value).length, 2);
});

test('NFKC policy catches compatibility-equivalent keys that NFC preserves', () => {
  const value = { A: 1, '\uff21': 2 };
  assert.equal(findUnicodeKeyCollisions(value, { form: 'NFC' }).length, 0);
  assert.equal(findUnicodeKeyCollisions(value, { form: 'NFKC' }).length, 1);
});

test('reports nested object location and ignores repeated keys in separate objects', () => {
  const value = { left: { '\u00e9': 1, 'e\u0301': 2 }, right: { '\u00e9': 3 } };
  assert.equal(findUnicodeKeyCollisions(value)[0].path, '$.left');
});

test('enforcement fails closed while collision-free data passes by identity', () => {
  const safe = { alpha: { beta: true } };
  assert.equal(enforceUnicodeKeyCollisionPolicy(safe), safe);
  assert.throws(() => enforceUnicodeKeyCollisionPolicy({ '\u00e9': 1, 'e\u0301': 2 }), /Unicode NFC key collision/);
});
