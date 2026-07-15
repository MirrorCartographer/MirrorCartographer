import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDefaultIgnorableProfile, evaluateDefaultIgnorableExclusion, applyDefaultIgnorableExclusion } from './default-ignorable-profile.mjs';

const source = `200B..200F ; Default_Ignorable_Code_Point # controls\nFE00..FE0F ; Default_Ignorable_Code_Point # variation selectors\n0041..005A ; XID_Start`;
const dataset = parseDefaultIgnorableProfile(source, { version: '17.0.0', sourceDigest: 'abc123' });

test('accepts an identifier without default ignorables', () => {
  const result = evaluateDefaultIgnorableExclusion('Alpha', dataset);
  assert.equal(result.defaultIgnorableFree, true);
  assert.deepEqual(result.reasons, []);
});

test('rejects join controls and reports scalar index', () => {
  const result = evaluateDefaultIgnorableExclusion(`A\u200DB`, dataset);
  assert.equal(result.defaultIgnorableFree, false);
  assert.deepEqual(result.reasons, ['default_ignorable_excluded:U+200D:index=1']);
});

test('rejects variation selectors', () => {
  assert.equal(evaluateDefaultIgnorableExclusion(`A\uFE0F`, dataset).defaultIgnorableFree, false);
});

test('fails closed on overlapping ranges', () => {
  assert.throws(() => parseDefaultIgnorableProfile(`200B..200F ; Default_Ignorable_Code_Point\n200F ; Default_Ignorable_Code_Point`, { version: '17.0.0', sourceDigest: 'x' }), /overlapping/);
});

test('wrapper blocks registration before the base mutation', () => {
  let registrations = 0;
  const base = {
    version: '17.0.0', authenticatedBundle: true,
    inspect: (identifier) => ({ identifier, admissible: true, reasons: [] }),
    register: (identifier) => { registrations += 1; return { accepted: true, identifier, admissible: true, reasons: [] }; },
  };
  const admission = applyDefaultIgnorableExclusion(base, dataset);
  const rejected = admission.register(`A\u200CB`);
  assert.equal(rejected.accepted, false);
  assert.equal(registrations, 0);
  const accepted = admission.register('Alpha');
  assert.equal(accepted.accepted, true);
  assert.equal(registrations, 1);
});
