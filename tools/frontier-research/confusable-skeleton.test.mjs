import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConfusables, internalSkeleton, createSkeletonRegistry } from './confusable-skeleton.mjs';

const source = `
0430 ; 0061 ; MA # CYRILLIC SMALL LETTER A -> LATIN SMALL LETTER A
03BF ; 006F ; MA # GREEK SMALL LETTER OMICRON -> LATIN SMALL LETTER O
0153 ; 006F 0065 ; MA # LATIN SMALL LIGATURE OE -> oe
`;
const dataset = parseConfusables(source, { version: '17.0.0', sourceDigest: 'sha256:test' });
const noIgnorables = () => false;

test('parses mappings and retains version provenance', () => {
  assert.equal(dataset.mappingCount, 3);
  assert.equal(dataset.version, '17.0.0');
});

test('maps visually confusable scalars into the same internal skeleton', () => {
  const latin = internalSkeleton('paypal', dataset, { isDefaultIgnorable: noIgnorables });
  const spoof = internalSkeleton('pаypаl', dataset, { isDefaultIgnorable: noIgnorables });
  assert.equal(spoof.skeleton, latin.skeleton);
});

test('applies NFD before mapping and after concatenation', () => {
  const composed = internalSkeleton('é', dataset, { isDefaultIgnorable: noIgnorables });
  const decomposed = internalSkeleton('e\u0301', dataset, { isDefaultIgnorable: noIgnorables });
  assert.equal(composed.skeleton, decomposed.skeleton);
  assert.equal(composed.skeleton, 'e\u0301');
});

test('removes default ignorables only through explicit version-matched evidence', () => {
  const result = internalSkeleton('a\u200Db', dataset, { isDefaultIgnorable: (cp) => cp === 0x200D });
  assert.equal(result.skeleton, 'ab');
  assert.equal(result.evidence[1].action, 'removed_default_ignorable');
});

test('registry rejects a later identifier with an occupied skeleton', () => {
  const registry = createSkeletonRegistry(dataset, { isDefaultIgnorable: noIgnorables });
  assert.equal(registry.register('paypal').accepted, true);
  const collision = registry.register('pаypаl');
  assert.equal(collision.accepted, false);
  assert.equal(collision.skeletonUnique, false);
  assert.equal(collision.incumbent, 'paypal');
});

test('registry registration is idempotent for the exact same identifier', () => {
  const registry = createSkeletonRegistry(dataset, { isDefaultIgnorable: noIgnorables });
  assert.equal(registry.register('alpha').accepted, true);
  assert.equal(registry.register('alpha').accepted, true);
  assert.equal(registry.size(), 1);
});

test('parser rejects duplicate source mappings', () => {
  assert.throws(() => parseConfusables('0430 ; 0061 ; MA\n0430 ; 0062 ; MA', { version: '17.0.0', sourceDigest: 'sha256:test' }), /duplicates source/);
});

test('parser rejects malformed, surrogate, and multi-scalar sources', () => {
  assert.throws(() => parseConfusables('ZZZZ ; 0061 ; MA', { version: '17.0.0', sourceDigest: 'sha256:test' }), /malformed/);
  assert.throws(() => parseConfusables('D800 ; 0061 ; MA', { version: '17.0.0', sourceDigest: 'sha256:test' }), /non-scalar/);
  assert.throws(() => parseConfusables('0061 0062 ; 0061 ; MA', { version: '17.0.0', sourceDigest: 'sha256:test' }), /exactly one scalar/);
});

test('skeleton evaluation fails closed without a default-ignorable predicate', () => {
  assert.throws(() => internalSkeleton('alpha', dataset), /isDefaultIgnorable predicate is required/);
});
