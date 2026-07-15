import test from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32, sceneFor } from './world.mjs';

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

test('invalid inputs fail closed', () => {
  assert.throws(() => sceneFor(-1), /seed/);
  assert.throws(() => sceneFor(1, 0, 10), /dimensions/);
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
