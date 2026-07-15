import test from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32, sceneFor, traceFor } from './world.mjs';

test('same seed and dimensions produce identical scene', () => {
  assert.deepEqual(sceneFor(12, 800, 600), sceneFor(12, 800, 600));
});

test('different seeds produce different scenes', () => {
  assert.notDeepEqual(sceneFor(12, 800, 600), sceneFor(13, 800, 600));
});

test('forms remain inside the viewport', () => {
  const scene = sceneFor(4, 320, 568);
  for (const form of scene.forms) {
    assert.ok(form.x >= 0 && form.x <= 320);
    assert.ok(form.y >= 0 && form.y <= 568);
    assert.ok(form.radius > 0);
  }
});

test('scene complexity is bounded', () => {
  assert.equal(sceneFor(1, 200, 200).forms.length, 18);
  assert.equal(sceneFor(1, 4000, 3000).forms.length, 72);
});

test('trace is deterministic, bounded, and references existing forms', () => {
  const scene = sceneFor(8, 390, 844);
  assert.deepEqual(scene.trace, traceFor(scene.forms));
  assert.ok(scene.trace.length <= 28);
  const ids = new Set(scene.forms.map((form) => form.id));
  for (const segment of scene.trace) {
    assert.ok(ids.has(segment.from));
    assert.ok(ids.has(segment.to));
    assert.notEqual(segment.from, segment.to);
  }
});

test('trace tie-breaking is stable', () => {
  const forms = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: 1, y: 0 },
    { id: 'c', x: -1, y: 0 }
  ];
  assert.deepEqual(traceFor(forms, 2), [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' }
  ]);
});

test('invalid inputs fail closed', () => {
  assert.throws(() => sceneFor(-1), /seed/);
  assert.throws(() => sceneFor(1, 0, 10), /dimensions/);
  assert.throws(() => traceFor(null), /forms/);
  assert.throws(() => traceFor([], -1), /maxSegments/);
});

test('PRNG is deterministic and bounded', () => {
  const a = mulberry32(99);
  const b = mulberry32(99);
  for (let i = 0; i < 20; i += 1) {
    const av = a();
    assert.equal(av, b());
    assert.ok(av >= 0 && av < 1);
  }
});
