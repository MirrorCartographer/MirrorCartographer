import test from 'node:test';
import assert from 'node:assert/strict';
import { AfterbellScore } from './afterbell-score.mjs';

test('fold and unfold preserve a deterministic room', () => {
  const score = new AfterbellScore();
  score.add({ x: .1, y: .2, strength: .4 });
  score.add({ x: .8, y: .7, strength: .9 });
  const folded = score.fold();
  const restored = AfterbellScore.unfold(folded);
  assert.deepEqual(restored.snapshot(), score.snapshot());
});

test('coordinates and strength are clamped before hashing', () => {
  const score = new AfterbellScore();
  score.add({ x: -2, y: 3, strength: 5 });
  assert.deepEqual(score.snapshot().marks[0], { x: 0, y: 1, strength: 1 });
});

test('room keeps only the configured number of newest marks', () => {
  const score = new AfterbellScore({ limit: 3 });
  for (let index = 0; index < 5; index += 1) score.add({ x: index / 4, y: .5, strength: .5 });
  assert.equal(score.snapshot().count, 3);
  assert.equal(score.snapshot().marks[0].x, .5);
});

test('malformed and oversized seeds fail closed', () => {
  assert.throws(() => AfterbellScore.unfold('wrong'), /Unsupported/);
  assert.throws(() => AfterbellScore.unfold('ab1.bad'), /Malformed/);
  const marks = Array.from({ length: 25 }, () => ({ x: .5, y: .5, strength: .5 }));
  const payload = Buffer.from(JSON.stringify({ version: 1, marks })).toString('base64url');
  assert.throws(() => AfterbellScore.unfold(`ab1.${payload}`), /exceeds/);
});
